'use client';

import { useEffect, useState } from 'react';

const storageKey = 'endpointlog-consent-v1';
const measurementId = 'G-SEM5NEP9HX';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function configureConsent(analytics: boolean) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer.push(args); };
  window.gtag('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function loadAnalytics() {
  if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) return;
  configureConsent(true);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.gaId = measurementId;
  document.head.appendChild(script);
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });
}

function removeAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (!name?.startsWith('_ga')) continue;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}; SameSite=Lax`;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag(...args: unknown[]) { window.dataLayer.push(args); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    });
    const stored = localStorage.getItem(storageKey);
    if (stored === null) setVisible(true);
    else {
      const allowed = stored === 'analytics';
      setAnalytics(allowed);
      if (allowed) loadAnalytics();
    }
    const reopen = () => { setSettings(true); setVisible(true); };
    window.addEventListener('endpointlog:cookie-settings', reopen);
    return () => window.removeEventListener('endpointlog:cookie-settings', reopen);
  }, []);

  const save = (allowed: boolean) => {
    localStorage.setItem(storageKey, allowed ? 'analytics' : 'necessary');
    setAnalytics(allowed);
    configureConsent(allowed);
    if (allowed) loadAnalytics();
    else {
      removeAnalyticsCookies();
      if (document.querySelector(`script[data-ga-id="${measurementId}"]`)) location.reload();
    }
    setVisible(false);
    setSettings(false);
  };

  if (!visible) return null;
  return (
    <>
      <div className="consent-overlay" />
      <section className="consent-dialog" role="dialog" aria-modal="true" aria-labelledby="consent-title" aria-describedby="consent-description">
        {settings ? (
          <>
            <div className="consent-copy"><span className="micro-label">Privacy controls</span><h2 id="consent-title">Cookie settings</h2><p id="consent-description">Choose whether EndpointLog may use Google Analytics.</p></div>
            <label className="consent-choice"><span><strong>Analytics</strong><small>Helps improve EndpointLog through anonymous usage statistics.</small></span><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /></label>
            <div className="consent-actions"><button className="consent-secondary" type="button" onClick={() => setSettings(false)}>Back</button><button className="button" type="button" onClick={() => save(analytics)}>Save preferences</button></div>
          </>
        ) : (
          <>
            <div className="consent-copy"><span className="micro-label">Your privacy</span><h2 id="consent-title">Analytics cookies</h2><p id="consent-description">EndpointLog uses optional Google Analytics cookies to understand site usage. Analytics stays off until you accept. Read the <a href="/cookies/">cookie statement</a>.</p></div>
            <div className="consent-actions"><button className="consent-secondary" type="button" onClick={() => setSettings(true)}>Settings</button><button className="consent-secondary" type="button" onClick={() => save(false)}>Only necessary</button><button className="button" type="button" onClick={() => save(true)}>Accept analytics</button></div>
          </>
        )}
      </section>
    </>
  );
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('endpointlog:cookie-settings'))}>Cookie settings</button>;
}
