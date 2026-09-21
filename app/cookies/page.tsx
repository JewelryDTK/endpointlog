export const metadata = { title: 'Cookies', description: 'Cookie use on EndpointLog.', alternates: { canonical: '/cookies/' } };

export default function Cookies() {
  return (
    <main id="main">
      <header className="page-heading shell"><div><span className="micro-label">Legal</span><h1>Cookies</h1></div><p>How EndpointLog uses optional analytics cookies.</p></header>
      <article className="shell legal-content">
        <p><strong>Last updated:</strong> 21 September 2026</p>
        <h2>Your choice</h2>
        <p>EndpointLog asks for permission before loading Google Analytics. Choosing “Only necessary” sends no analytics data to Google. Your preference is stored in your browser so the site can remember it.</p>
        <h2>Google Analytics</h2>
        <p>After consent, Google Analytics measures visits and site interactions. It may set <code>_ga</code> and <code>_ga_&lt;container-id&gt;</code> first-party cookies. Google lists a default lifetime of two years, although browsers may shorten it.</p>
        <p>Advertising storage and ad personalisation remain disabled. EndpointLog does not use marketing cookies.</p>
        <h2>External services</h2>
        <p>Following an external link, such as LinkedIn, takes you to another service. That service may use cookies under its own policy.</p>
        <h2>Change your preference</h2>
        <p>Use “Cookie settings” in the footer at any time. Withdrawing consent removes known Google Analytics cookies and stops future analytics loading.</p>
      </article>
    </main>
  );
}
