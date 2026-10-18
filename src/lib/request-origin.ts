import { AppError } from './model';

/**
 * Check browser POST/PATCH/DELETE requests against the public site origin.
 *
 * On Netlify the Next.js Request.url can refer to the internal server/adapter
 * rather than the public address used by the visitor. Comparing their hosts
 * directly incorrectly rejects perfectly valid same-origin submissions.
 *
 * We accept the Netlify-provided deployment URLs or the public Host headers,
 * while still rejecting browser requests explicitly marked cross-site.
 */
export function validateWriteOrigin(
  request: Request,
  configuredUrls: readonly (string | undefined)[] = [
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
    process.env.SITE_URL,
  ],
): void {
  const rejected = () => { throw new AppError('Deze aanvraag kon niet worden gecontroleerd. Vernieuw de pagina en probeer opnieuw.', 403); };
  const origin = request.headers.get('origin');
  if (!origin || origin === 'null') return rejected();

  let source: URL;
  try {
    source = new URL(origin);
    // "Origin" is a single serialized origin, never a page URL.
    if (!['https:', 'http:'].includes(source.protocol) || origin !== source.origin) return rejected();
  } catch { return rejected(); }

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return rejected();

  // Deployment URLs are configured by the host, not controlled by user input.
  for (const url of configuredUrls) {
    if (!url) continue;
    try {
      if (source.origin === new URL(url).origin) return;
    } catch { /* Ignore a missing or malformed optional hosting variable. */ }
  }

  // A reverse proxy can route the request with a private Request.url. Its
  // public Host/X-Forwarded-Host still identifies the visitor-facing domain.
  // Reject comma-separated chains rather than trusting an attacker-supplied
  // first element in an unverified forwarding chain.
  for (const header of ['host', 'x-forwarded-host'] as const) {
    const host = request.headers.get(header)?.trim();
    if (host && !host.includes(',') && !/[\s/@]/.test(host) && host === source.host) return;
  }

  // Local development and direct Next.js requests use the Request.url host.
  if (source.origin === new URL(request.url).origin) return;
  return rejected();
}
