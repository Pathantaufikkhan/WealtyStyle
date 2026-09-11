import dns from "dns";

// Common disposable / burner email domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamail.org",
  "sharklasers.com",
  "trashmail.com",
  "yopmail.com",
  "getairmail.com",
  "throwawaymail.com",
  "dispostable.com",
  "fakemailgenerator.com",
  "generator.email",
  "maildrop.cc",
  "burnermail.io",
  "mohmal.com",
  "inboxkitten.com",
  "crazymailing.com",
  "mytemp.email",
  "emailondeck.com",
  "tempail.com",
  "fakeinbox.com",
  "tempinbox.com",
]);

// Top common valid email domains for typo matching
const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "yahoo.co.in",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "proton.me",
  "protonmail.com",
  "rediffmail.com",
  "zoho.com",
  "aol.com",
  "live.com",
  "msn.com",
];

// Common domain typos mapped to their correct versions
const DOMAIN_TYPOS: Record<string, string> = {
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmaik.com": "gmail.com",
  "gmaul.com": "gmail.com",
  "gemail.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cm": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yaho.co.in": "yahoo.co.in",
  "yahoo.con": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "hotmaill.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "outlok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.con": "outlook.com",
  "iclud.com": "icloud.com",
  "icoud.com": "icloud.com",
  "redifmail.com": "rediffmail.com",
  "rediff.com": "rediffmail.com",
};

/**
 * Basic syntax check using standard RFC email regex
 */
export function validateEmailSyntax(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  
  // RFC 5322 regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

/**
 * Extracts username and domain from an email
 */
export function parseEmail(email: string): { user: string; domain: string } | null {
  if (!email || !email.includes("@")) return null;
  const parts = email.trim().toLowerCase().split("@");
  if (parts.length !== 2) return null;
  return { user: parts[0], domain: parts[1] };
}

/**
 * Checks if the domain is a known temporary or disposable email service
 */
export function isDisposableDomain(domain: string): boolean {
  const cleanDomain = domain.toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(cleanDomain);
}

/**
 * Checks for common typos and suggests correction
 */
export function getDomainTypoSuggestion(domain: string): string | null {
  const cleanDomain = domain.toLowerCase().trim();
  
  // Direct typo lookup
  if (DOMAIN_TYPOS[cleanDomain]) {
    return DOMAIN_TYPOS[cleanDomain];
  }

  // Levenshtein distance matching for common domains
  for (const target of COMMON_DOMAINS) {
    if (cleanDomain !== target && levenshteinDistance(cleanDomain, target) === 1) {
      return target;
    }
  }

  return null;
}

/**
 * Calculates Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Checks in real-time whether a domain has active Mail Exchange (MX) DNS records
 */
export async function checkDomainMxRecords(domain: string): Promise<{
  mxExists: boolean;
  mxHosts: string[];
  error?: string;
}> {
  const cleanDomain = domain.toLowerCase().trim();

  // Basic sanity check on domain format
  if (!cleanDomain || !cleanDomain.includes(".") || cleanDomain.startsWith(".") || cleanDomain.endsWith(".")) {
    return { mxExists: false, mxHosts: [], error: "Invalid domain format" };
  }

  try {
    const addresses = await dns.promises.resolveMx(cleanDomain);
    if (addresses && addresses.length > 0) {
      // Sort by priority
      const sorted = addresses.sort((a, b) => a.priority - b.priority);
      return {
        mxExists: true,
        mxHosts: sorted.map((item) => item.exchange),
      };
    }
    return { mxExists: false, mxHosts: [], error: "No MX records found for domain" };
  } catch (err: any) {
    // If MX lookup fails (e.g. ENOTFOUND or ENODATA), check if domain has an A record as a fallback
    try {
      const aRecords = await dns.promises.resolve4(cleanDomain);
      if (aRecords && aRecords.length > 0) {
        return {
          mxExists: true,
          mxHosts: [cleanDomain],
        };
      }
    } catch {
      // Both MX and A record lookups failed
    }

    return {
      mxExists: false,
      mxHosts: [],
      error: err?.code === "ENOTFOUND" ? "Domain does not exist" : "Mail exchange server not found",
    };
  }
}
