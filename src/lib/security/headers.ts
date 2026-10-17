/**
 * Shared security headers + CSP Report-Only.
 * Flip to Content-Security-Policy (enforce) only after GA4/Clarity/Grow domains
 * are confirmed in production reports — see docs/SCRIPT_STATUS.md.
 */

export function securityHeaders(): Record<string, string> {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.clarity.ms https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://www.facebook.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://*.clarity.ms https://www.facebook.com https://api.grow-il.com",
    "frame-src 'self' https://*.grow-il.com https://pay.grow-il.com",
    "worker-src 'self' blob:",
    "child-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "report-uri /api/csp-report",
  ].join("; ");

  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "X-DNS-Prefetch-Control": "on",
    "Content-Security-Policy-Report-Only": csp,
  };
}
