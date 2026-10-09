<#
.SYNOPSIS
    Intune Nuke - verwijdert (na backup) alle Intune-configuratie uit een tenant.
    Conditional Access, Entra ID-objecten, connectors/tokens en devices blijven ongemoeid.

.DESCRIPTION
    Wizard in 5 stappen:
      1. Inloggen         - interactief, je ziet direct tenantnaam + account
      2. Scannen          - telt per categorie wat er staat (verandert niets)
      3. Kiezen           - vink categorieën aan (of A = alles)
      4. Backup           - elk object wordt eerst als JSON weggeschreven
      5. Nuke             - pas na het intypen van de tenant-domeinnaam

    Werkt op macOS, Windows en Linux (PowerShell 7+).

.PARAMETER DryRun
    Scan + backup, maar verwijder niets. Handig om eerst te zien wat er zou gebeuren.

.PARAMETER TenantId
    Optioneel: tenant-ID of domein om in te loggen (anders je standaardtenant).

.PARAMETER BackupPath
    Map waar backups en logs komen. Standaard: ./IntuneNuke-Backups

.EXAMPLE
    pwsh ./Intune-Nuke.ps1 -DryRun
    pwsh ./Intune-Nuke.ps1
    pwsh ./Intune-Nuke.ps1 -TenantId contoso.onmicrosoft.com
#>
#Requires -Version 7.0
[CmdletBinding()]
param(
    [switch]$DryRun,
    [string]$TenantId,
    [string]$BackupPath = (Join-Path (Get-Location) 'IntuneNuke-Backups')
)

$ErrorActionPreference = 'Stop'
$Graph = 'https://graph.microsoft.com/beta'

# ----------------------------------------------------------------------------
#  Wat wordt er opgeruimd? (volgorde = verwijdervolgorde, i.v.m. afhankelijkheden)
# ----------------------------------------------------------------------------
$Types = @(
    # 1. Policy sets eerst: die verwijzen naar alles hieronder
    @{ Group='Policy sets';                       Name='Policy sets';                         Uri='deviceAppManagement/policySets' }

    # 2. App protection & app configuration (verwijzen naar apps)
    @{ Group='App protection & app config';       Name='App protection - iOS';                Uri='deviceAppManagement/iosManagedAppProtections' }
    @{ Group='App protection & app config';       Name='App protection - Android';            Uri='deviceAppManagement/androidManagedAppProtections' }
    @{ Group='App protection & app config';       Name='App protection - Windows';            Uri='deviceAppManagement/windowsManagedAppProtections' }
    @{ Group='App protection & app config';       Name='WIP (MDM)';                           Uri='deviceAppManagement/mdmWindowsInformationProtectionPolicies' }
    @{ Group='App protection & app config';       Name='WIP (MAM)';                           Uri='deviceAppManagement/windowsInformationProtectionPolicies' }
    @{ Group='App protection & app config';       Name='App config - managed apps';           Uri='deviceAppManagement/targetedManagedAppConfigurations' }
    @{ Group='App protection & app config';       Name='App config - managed devices';        Uri='deviceAppManagement/mobileAppConfigurations' }

    # 3. Apps (ingebouwde 'global' apps van Microsoft kunnen niet weg en worden overgeslagen)
    @{ Group='Apps';                              Name='Apps';                                Uri='deviceAppManagement/mobileApps'
       Skip = { param($o) $o.appAvailability -eq 'global' } }

    # 4. Compliance
    @{ Group='Compliance';                        Name='Compliance policies';                 Uri='deviceManagement/deviceCompliancePolicies' }
    @{ Group='Compliance';                        Name='Custom compliance scripts';           Uri='deviceManagement/deviceComplianceScripts' }

    # 5. Configuratie
    @{ Group='Configuratie & endpoint security';  Name='Configuratieprofielen (templates)';   Uri='deviceManagement/deviceConfigurations' }
    @{ Group='Configuratie & endpoint security';  Name='Settings catalog / endpoint security';Uri='deviceManagement/configurationPolicies'; Expand='settings,assignments' }
    @{ Group='Configuratie & endpoint security';  Name='Administrative templates';            Uri='deviceManagement/groupPolicyConfigurations'
       Children = @('definitionValues?$expand=definition($select=id,displayName,classType),presentationValues') }
    @{ Group='Configuratie & endpoint security';  Name='Security baselines / ES (legacy)';    Uri='deviceManagement/intents'; Children=@('settings') }
    @{ Group='Configuratie & endpoint security';  Name='Reusable settings (firewall e.d.)';   Uri='deviceManagement/reusablePolicySettings'; Expand='' }
    @{ Group='Configuratie & endpoint security';  Name='Geïmporteerde ADMX-bestanden';        Uri='deviceManagement/groupPolicyUploadedDefinitionFiles'; Expand='' }

    # 6. Scripts
    @{ Group='Scripts & remediations';            Name='Platform scripts - Windows';          Uri='deviceManagement/deviceManagementScripts' }
    @{ Group='Scripts & remediations';            Name='Shell scripts - macOS';               Uri='deviceManagement/deviceShellScripts' }
    @{ Group='Scripts & remediations';            Name='Custom attributes - macOS';           Uri='deviceManagement/deviceCustomAttributeShellScripts' }
    @{ Group='Scripts & remediations';            Name='Remediations';                        Uri='deviceManagement/deviceHealthScripts'
       Skip = { param($o) $o.isGlobalScript -eq $true } }

    # 7. Windows updates (update rings zitten bij configuratieprofielen)
    @{ Group='Windows updates';                   Name='Feature updates';                     Uri='deviceManagement/windowsFeatureUpdateProfiles' }
    @{ Group='Windows updates';                   Name='Quality updates (expedite)';          Uri='deviceManagement/windowsQualityUpdateProfiles' }
    @{ Group='Windows updates';                   Name='Driver updates';                      Uri='deviceManagement/windowsDriverUpdateProfiles' }

    # 8. Enrollment
    @{ Group='Enrollment';                        Name='Autopilot deployment profiles';       Uri='deviceManagement/windowsAutopilotDeploymentProfiles'; PreDelete='AutopilotAssignments' }
    @{ Group='Enrollment';                        Name='ESP / restricties / WHfB / limieten'; Uri='deviceManagement/deviceEnrollmentConfigurations'
       Skip = { param($o) $o.priority -eq 0 -or $o.id -match '_Default' } }
    @{ Group='Enrollment';                        Name='Apple ADE enrollment profiles';       Lister='DepProfiles'; Expand='' }
    @{ Group='Enrollment';                        Name='Apple user-initiated profiles';       Uri='deviceManagement/appleUserInitiatedEnrollmentProfiles' }
    @{ Group='Enrollment';                        Name='Android Enterprise enrollment profiles'; Uri='deviceManagement/androidDeviceOwnerEnrollmentProfiles'; Expand='' }
    @{ Group='Enrollment';                        Name='Device categories';                   Uri='deviceManagement/deviceCategories'; Expand='' }
    @{ Group='Enrollment';                        Name='Terms and conditions';                Uri='deviceManagement/termsAndConditions' }

    # 9. Tenant admin
    @{ Group='Tenant admin';                      Name='Notification templates (compliance)'; Uri='deviceManagement/notificationMessageTemplates'; Children=@('localizedNotificationMessages'); Expand='' }
    @{ Group='Tenant admin';                      Name='Company Portal branding (niet-default)'; Uri='deviceManagement/intuneBrandingProfiles'
       Skip = { param($o) $o.isDefaultProfile -eq $true } }
    @{ Group='Tenant admin';                      Name='Custom Intune-rollen (+ toewijzingen)'; Uri='deviceManagement/roleDefinitions'; Expand='roleAssignments'; PreDelete='RoleAssignments'
       Skip = { param($o) $o.isBuiltIn -eq $true } }

    # 10. Filters & scope tags als laatste (anders 'in use')
    @{ Group='Assignment filters';                Name='Assignment filters';                  Uri='deviceManagement/assignmentFilters'; Expand='' }
    @{ Group='Scope tags';                        Name='Scope tags (niet-default)';           Uri='deviceManagement/roleScopeTags'; Expand='assignments'
       Skip = { param($o) $o.isBuiltIn -eq $true -or "$($o.id)" -eq '0' } }
)

$Scopes = @(
    'DeviceManagementConfiguration.ReadWrite.All'
    'DeviceManagementApps.ReadWrite.All'
    'DeviceManagementServiceConfig.ReadWrite.All'
    'DeviceManagementRBAC.ReadWrite.All'
    'DeviceManagementScripts.ReadWrite.All'
    'Organization.Read.All'
)

# ----------------------------------------------------------------------------
#  Helpers
# ----------------------------------------------------------------------------
function Write-Step($n, $text) {
    Write-Host ''
    Write-Host "  [$n/5] $text" -ForegroundColor Cyan
    Write-Host ('  ' + ('─' * 60)) -ForegroundColor DarkGray
}

function Invoke-Graph {
    param([string]$Method = 'GET', [string]$Path)
    $uri = if ($Path -match '^https://') { $Path } else { "$Graph/$Path" }
    for ($i = 0; $i -lt 6; $i++) {
        try {
            return Invoke-MgGraphRequest -Method $Method -Uri $uri -OutputType PSObject -ErrorAction Stop
        } catch {
            $code = $null
            try { $code = [int]$_.Exception.Response.StatusCode } catch {}
            if ($code -in 429, 503, 504 -and $i -lt 5) {
                $wait = [math]::Pow(2, $i + 1)
                try { $ra = $_.Exception.Response.Headers.RetryAfter.Delta.TotalSeconds; if ($ra) { $wait = $ra } } catch {}
                Start-Sleep -Seconds $wait
                continue
            }
            throw
        }
    }
}

function Get-GraphAll([string]$Path) {
    $out  = [System.Collections.Generic.List[object]]::new()
    $next = $Path
    while ($next) {
        $r = Invoke-Graph -Path $next
        if ($null -ne $r.value) { foreach ($v in $r.value) { $out.Add($v) } }
        $next = $r.'@odata.nextLink'
    }
    return $out
}

function Get-ErrText($err) {
    $m = $err.ErrorDetails.Message
    if (-not $m) { $m = $err.Exception.Message }
    try { $j = $m | ConvertFrom-Json; if ($j.error.message) { $m = $j.error.message } } catch {}
    ($m -replace '\s+', ' ').Trim() | Select-Object -First 1
}

function Get-ObjName($o) {
    foreach ($p in 'displayName', 'name', 'fileName') { if ($o.$p) { return [string]$o.$p } }
    return [string]$o.id
}

function Get-SafeName([string]$s) {
    $s = ($s -replace '[\\/:*?"<>|\r\n\t]', '_').Trim()
    if ($s.Length -gt 60) { $s = $s.Substring(0, 60) }
    return $s
}

function Get-Items($t) {
    if ($t.Lister -eq 'DepProfiles') {
        $items = @()
        foreach ($tok in (Get-GraphAll 'deviceManagement/depOnboardingSettings')) {
            foreach ($p in (Get-GraphAll "deviceManagement/depOnboardingSettings/$($tok.id)/enrollmentProfiles")) {
                $p | Add-Member -NotePropertyName '_path' -NotePropertyValue "deviceManagement/depOnboardingSettings/$($tok.id)/enrollmentProfiles/$($p.id)" -Force
                $items += $p
            }
        }
        return $items
    }
    $items = Get-GraphAll $t.Uri
    foreach ($i in $items) { $i | Add-Member -NotePropertyName '_path' -NotePropertyValue "$($t.Uri)/$($i.id)" -Force }
    return $items
}

function Remove-Dependencies($t, $o) {
    switch ($t.PreDelete) {
        'AutopilotAssignments' {
            foreach ($a in (Get-GraphAll "$($o._path)/assignments")) {
                Invoke-Graph -Method DELETE -Path "$($o._path)/assignments/$($a.id)" | Out-Null
            }
        }
        'RoleAssignments' {
            foreach ($a in (Get-GraphAll "$($o._path)/roleAssignments")) {
                Invoke-Graph -Method DELETE -Path "deviceManagement/roleAssignments/$($a.id)" | Out-Null
            }
        }
    }
}

function Backup-Item($t, $o, [string]$dir) {
    $expand = if ($t.ContainsKey('Expand')) { $t.Expand } else { 'assignments' }
    $full = $null
    if ($expand) { try { $full = Invoke-Graph -Path "$($o._path)?`$expand=$expand" } catch {} }
    if (-not $full) { try { $full = Invoke-Graph -Path $o._path } catch { $full = $o } }

    $export = [ordered]@{ _nuke = [ordered]@{ type = $t.Name; graphPath = $o._path; exportedAt = (Get-Date).ToString('s') }; object = $full }
    foreach ($c in @($t.Children)) {
        if (-not $c) { continue }
        try { $export["_child_$(($c -split '\?')[0])"] = Get-GraphAll "$($o._path)/$c" } catch { $export["_child_$c"] = "BACKUP FOUT: $(Get-ErrText $_)" }
    }
    $file = Join-Path $dir ("{0}__{1}.json" -f (Get-SafeName (Get-ObjName $o)), $o.id)
    $export | ConvertTo-Json -Depth 50 | Set-Content -Path $file -Encoding utf8
    return $file
}

# ----------------------------------------------------------------------------
#  Banner
# ----------------------------------------------------------------------------
Clear-Host
Write-Host ''
Write-Host '   ██╗███╗   ██╗████████╗██╗   ██╗███╗   ██╗███████╗    ███╗   ██╗██╗   ██╗██╗  ██╗███████╗' -ForegroundColor Red
Write-Host '   ██║████╗  ██║╚══██╔══╝██║   ██║████╗  ██║██╔════╝    ████╗  ██║██║   ██║██║ ██╔╝██╔════╝' -ForegroundColor Red
Write-Host '   ██║██╔██╗ ██║   ██║   ██║   ██║██╔██╗ ██║█████╗      ██╔██╗ ██║██║   ██║█████╔╝ █████╗  ' -ForegroundColor Red
Write-Host '   ██║██║╚██╗██║   ██║   ██║   ██║██║╚██╗██║██╔══╝      ██║╚██╗██║██║   ██║██╔═██╗ ██╔══╝  ' -ForegroundColor Red
Write-Host '   ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚████║███████╗    ██║ ╚████║╚██████╔╝██║  ██╗███████╗' -ForegroundColor Red
Write-Host '   ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚══════╝    ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝' -ForegroundColor Red
Write-Host ''
Write-Host '   Verwijdert Intune-configuratie. Blijft staan: Conditional Access, Entra-groepen/-users,' -ForegroundColor Gray
Write-Host '   devices, Autopilot-hashes en connectors/tokens (APNs, ADE, VPP, Managed Google Play).' -ForegroundColor Gray
if ($DryRun) { Write-Host '   *** DRY RUN: er wordt NIETS verwijderd ***' -ForegroundColor Yellow }

# ----------------------------------------------------------------------------
#  1. Inloggen
# ----------------------------------------------------------------------------
Write-Step 1 'Inloggen bij Microsoft Graph'

# Vaste moduleversie: nieuwere versies vereisen .NET 10 en crashen op PowerShell 7.4/7.5
$GraphModVer = '2.25.0'
if (-not (Get-Module -ListAvailable -Name Microsoft.Graph.Authentication | Where-Object { $_.Version -eq $GraphModVer })) {
    $ans = Read-Host "  Module Microsoft.Graph.Authentication $GraphModVer ontbreekt. Nu installeren (CurrentUser)? [J/n]"
    if ($ans -match '^[nN]') { Write-Host '  Gestopt.'; return }
    Install-Module Microsoft.Graph.Authentication -RequiredVersion $GraphModVer -Scope CurrentUser -Force -AllowClobber
}
Import-Module Microsoft.Graph.Authentication -RequiredVersion $GraphModVer

# Altijd vers inloggen, zodat je nooit per ongeluk in een gecachte (andere) tenant zit
try { Disconnect-MgGraph -ErrorAction SilentlyContinue | Out-Null } catch {}
$connectArgs = @{ Scopes = $Scopes; NoWelcome = $true; ContextScope = 'Process' }
if ($TenantId) { $connectArgs.TenantId = $TenantId }
Connect-MgGraph @connectArgs

$ctx  = Get-MgContext
$org  = (Invoke-Graph -Path 'https://graph.microsoft.com/v1.0/organization').value | Select-Object -First 1
$initialDomain = ($org.verifiedDomains | Where-Object { $_.isInitial }).name

Write-Host ''
Write-Host "  Tenant   : $($org.displayName)" -ForegroundColor White
Write-Host "  Domein   : $initialDomain"      -ForegroundColor White
Write-Host "  TenantId : $($ctx.TenantId)"    -ForegroundColor White
Write-Host "  Account  : $($ctx.Account)"     -ForegroundColor White
$ok = Read-Host '  Is dit de juiste tenant? [j/N]'
if ($ok -notmatch '^[jJyY]') { Write-Host '  Gestopt. Er is niets gewijzigd.' -ForegroundColor Yellow; Disconnect-MgGraph | Out-Null; return }

# ----------------------------------------------------------------------------
#  2. Scannen
# ----------------------------------------------------------------------------
Write-Step 2 'Scannen (alleen lezen)'

$Inventory = [ordered]@{}
$n = 0
foreach ($t in $Types) {
    $n++
    Write-Progress -Activity 'Scannen' -Status $t.Name -PercentComplete ($n / $Types.Count * 100)
    $entry = @{ Type = $t; Items = @(); Skipped = 0; Error = $null }
    try {
        $all = @(Get-Items $t)
        if ($t.Skip) {
            $keep = @($all | Where-Object { -not (& $t.Skip $_) })
            $entry.Skipped = $all.Count - $keep.Count
            $all = $keep
        }
        $entry.Items = $all
    } catch {
        $entry.Error = Get-ErrText $_
    }
    $Inventory[$t.Name] = $entry
}
Write-Progress -Activity 'Scannen' -Completed

$groups = $Types.Group | Select-Object -Unique
$menu = @()
$i = 0
foreach ($g in $groups) {
    $i++
    $entries = $Inventory.Values | Where-Object { $_.Type.Group -eq $g }
    $count   = ($entries | ForEach-Object { $_.Items.Count } | Measure-Object -Sum).Sum
    $detail  = ($entries | Where-Object { $_.Items.Count -gt 0 } | ForEach-Object { "$($_.Type.Name): $($_.Items.Count)" }) -join ' | '
    $menu += [pscustomobject]@{ Nr = $i; Categorie = $g; Aantal = [int]$count; Details = $detail }
}

Write-Host ''
$menu | Format-Table Nr, Categorie, Aantal, Details -AutoSize -Wrap | Out-String -Width 200 | Write-Host

$errs = $Inventory.Values | Where-Object { $_.Error }
if ($errs) {
    Write-Host '  Niet uit te lezen (vaak: feature niet gelicenseerd/ingeschakeld — kan geen kwaad):' -ForegroundColor DarkYellow
    $errs | ForEach-Object { Write-Host "   - $($_.Type.Name): $($_.Error)" -ForegroundColor DarkGray }
}
$skips = $Inventory.Values | Where-Object { $_.Skipped -gt 0 }
if ($skips) {
    Write-Host '  Overgeslagen (ingebouwd/default, kan niet weg):' -ForegroundColor DarkGray
    $skips | ForEach-Object { Write-Host "   - $($_.Type.Name): $($_.Skipped)" -ForegroundColor DarkGray }
}

$total = ($menu | Measure-Object Aantal -Sum).Sum
if (-not $total) { Write-Host "`n  Niets gevonden om op te ruimen. Je tenant is al schoon." -ForegroundColor Green; Disconnect-MgGraph | Out-Null; return }

# ----------------------------------------------------------------------------
#  3. Kiezen
# ----------------------------------------------------------------------------
Write-Step 3 'Kies wat er weg moet'

$selected = @()
if (Get-Command Out-ConsoleGridView -ErrorAction SilentlyContinue) {
    Write-Host '  Spatie = aan/uitvinken, Enter = bevestigen, Esc = stoppen' -ForegroundColor Gray
    $selected = @($menu | Where-Object Aantal -gt 0 | Out-ConsoleGridView -Title 'Intune Nuke - kies categorieën' -OutputMode Multiple).Categorie
} else {
    while (-not $selected) {
        $inp = Read-Host '  Nummers (bijv. 1,3,5 of 2-6), A = alles, Q = stoppen'
        if ($inp -match '^[qQ]$') { break }
        if ($inp -match '^[aA]$') { $selected = $menu.Categorie; break }
        $nums = foreach ($part in ($inp -split '[,\s]+' | Where-Object { $_ })) {
            if ($part -match '^(\d+)-(\d+)$') { [int]$matches[1]..[int]$matches[2] } elseif ($part -match '^\d+$') { [int]$part }
        }
        $selected = @($menu | Where-Object { $_.Nr -in $nums }).Categorie
        if (-not $selected) { Write-Host '  Geen geldige keuze, probeer opnieuw.' -ForegroundColor Yellow }
    }
}
if (-not $selected) { Write-Host '  Niets gekozen. Gestopt, er is niets gewijzigd.' -ForegroundColor Yellow; Disconnect-MgGraph | Out-Null; return }

$work = @($Inventory.Values | Where-Object { $_.Type.Group -in $selected -and $_.Items.Count -gt 0 })
$workCount = ($work | ForEach-Object { $_.Items.Count } | Measure-Object -Sum).Sum

Write-Host ''
Write-Host "  Gekozen: $($selected -join ', ')" -ForegroundColor White
Write-Host "  Totaal : $workCount objecten" -ForegroundColor White

# ----------------------------------------------------------------------------
#  4. Backup
# ----------------------------------------------------------------------------
Write-Step 4 'Backup maken (JSON per object)'

$stamp   = Get-Date -Format 'yyyyMMdd-HHmmss'
$runDir  = Join-Path $BackupPath ("{0}_{1}" -f (Get-SafeName $initialDomain), $stamp)
New-Item -ItemType Directory -Path $runDir -Force | Out-Null
$logFile = Join-Path $runDir 'nuke-log.csv'
$log = [System.Collections.Generic.List[object]]::new()
function Add-Log($t, $o, $action, $result, $err) {
    $log.Add([pscustomobject]@{ Time = (Get-Date).ToString('s'); Category = $t.Group; Type = $t.Name; Name = (Get-ObjName $o); Id = $o.id; Action = $action; Result = $result; Error = $err })
}

$queue = [System.Collections.Generic.List[object]]::new()
$n = 0; $bkFail = 0
foreach ($e in $work) {
    $t   = $e.Type
    $dir = Join-Path $runDir (Join-Path (Get-SafeName $t.Group) (Get-SafeName $t.Name))
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    foreach ($o in $e.Items) {
        $n++
        Write-Progress -Activity 'Backup' -Status "$($t.Name): $(Get-ObjName $o)" -PercentComplete ($n / $workCount * 100)
        try {
            Backup-Item $t $o $dir | Out-Null
            Add-Log $t $o 'Backup' 'OK' ''
            $queue.Add(@{ Type = $t; Obj = $o })
        } catch {
            $bkFail++
            Add-Log $t $o 'Backup' 'FOUT' (Get-ErrText $_)   # zonder backup: NIET verwijderen
        }
    }
}
Write-Progress -Activity 'Backup' -Completed
$log | Export-Csv -Path $logFile -NoTypeInformation -Encoding utf8
Write-Host "  Backup klaar: $($queue.Count) objecten -> $runDir" -ForegroundColor Green
if ($bkFail) { Write-Host "  $bkFail objecten konden niet geback-upt worden en worden NIET verwijderd (zie log)." -ForegroundColor Yellow }

if ($DryRun) {
    Write-Host "`n  DRY RUN klaar. Er is niets verwijderd. Bekijk de backupmap om te zien wat er weg zou gaan." -ForegroundColor Yellow
    Disconnect-MgGraph | Out-Null
    return
}

# ----------------------------------------------------------------------------
#  5. NUKE
# ----------------------------------------------------------------------------
Write-Step 5 'NUKE'
Write-Host ''
Write-Host "  Je staat op het punt $($queue.Count) objecten DEFINITIEF te verwijderen uit:" -ForegroundColor Red
Write-Host "      $($org.displayName)  ($initialDomain)" -ForegroundColor Red
Write-Host ''
$confirm = Read-Host "  Typ '$initialDomain' om te bevestigen"
if ($confirm -ne $initialDomain) { Write-Host '  Komt niet overeen. Gestopt, er is niets verwijderd.' -ForegroundColor Yellow; Disconnect-MgGraph | Out-Null; return }

for ($s = 5; $s -gt 0; $s--) { Write-Host "`r  Start over $s s... (Ctrl+C om af te breken) " -NoNewline -ForegroundColor Red; Start-Sleep 1 }
Write-Host ''

# Meerdere rondes: objecten die 'in use' zijn (bijv. app-afhankelijkheden/supersedence)
# lukken vaak wel nadat andere objecten weg zijn.
$pending = $queue
for ($round = 1; $round -le 3 -and $pending.Count -gt 0; $round++) {
    $failed = [System.Collections.Generic.List[object]]::new()
    $n = 0
    foreach ($q in $pending) {
        $n++
        $t = $q.Type; $o = $q.Obj
        Write-Progress -Activity "Verwijderen (ronde $round)" -Status "$($t.Name): $(Get-ObjName $o)" -PercentComplete ($n / $pending.Count * 100)
        try {
            Remove-Dependencies $t $o
            Invoke-Graph -Method DELETE -Path $o._path | Out-Null
            Add-Log $t $o 'Delete' 'OK' ''
            Write-Host "  ✔ $($t.Name): $(Get-ObjName $o)" -ForegroundColor DarkGreen
        } catch {
            $q.LastError = Get-ErrText $_
            $failed.Add($q)
        }
    }
    Write-Progress -Activity "Verwijderen (ronde $round)" -Completed
    if ($failed.Count -eq $pending.Count) { $pending = $failed; break }   # geen voortgang meer
    $pending = $failed
    if ($pending.Count -gt 0 -and $round -lt 3) { Write-Host "  $($pending.Count) objecten nog in gebruik, nieuwe poging over 10 s..." -ForegroundColor DarkYellow; Start-Sleep 10 }
}
foreach ($q in $pending) {
    Add-Log $q.Type $q.Obj 'Delete' 'FOUT' $q.LastError
    Write-Host "  ✘ $($q.Type.Name): $(Get-ObjName $q.Obj) — $($q.LastError)" -ForegroundColor Red
}
$log | Export-Csv -Path $logFile -NoTypeInformation -Encoding utf8

# ----------------------------------------------------------------------------
#  Samenvatting
# ----------------------------------------------------------------------------
$okCount = ($log | Where-Object { $_.Action -eq 'Delete' -and $_.Result -eq 'OK' }).Count
Write-Host ''
Write-Host '  ════════════════════ KLAAR ════════════════════' -ForegroundColor Cyan
Write-Host "  Verwijderd : $okCount"           -ForegroundColor Green
Write-Host "  Mislukt    : $($pending.Count)"  -ForegroundColor ($(if ($pending.Count) { 'Red' } else { 'Green' }))
Write-Host "  Backup     : $runDir"            -ForegroundColor White
Write-Host "  Log        : $logFile"           -ForegroundColor White
Write-Host ''
Write-Host '  Tip: Windows Autopatch maakt zijn eigen policies opnieuw aan zolang Autopatch actief is.' -ForegroundColor DarkGray
Disconnect-MgGraph | Out-Null
