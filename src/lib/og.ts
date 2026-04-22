// Very small Open Graph extractor: fetches HTML, scans for og:image / twitter:image,
// falls back to the first <img>. No external dependency. Best-effort.

type OgResult = {
  title: string | null;
  image: string | null;
};

function pickMeta(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHTMLEntities(m[1]).trim();
  }
  return null;
}

function decodeHTMLEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function resolveUrl(possiblyRelative: string, base: string): string {
  try {
    return new URL(possiblyRelative, base).toString();
  } catch {
    return possiblyRelative;
  }
}

export async function fetchOpenGraph(url: string): Promise<OgResult> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; ComprinhasBot/1.0; +https://comprinhas.app)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    if (!res.ok) return { title: null, image: null };
    const html = (await res.text()).slice(0, 200_000);

    const title =
      pickMeta(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
        /<title[^>]*>([^<]+)<\/title>/i,
      ]) || null;

    const rawImage = pickMeta(html, [
      /<meta[^>]+property=["']og:image(:secure_url)?["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    ]);
    // The regex above captures the URL in group 2 if og:image:secure_url matched.
    // Re-run targeted matches to be safe.
    let image =
      (html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      )?.[1] ??
        html.match(
          /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        )?.[1] ??
        html.match(
          /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
        )?.[1]) ||
      null;
    if (!image && rawImage) image = rawImage;

    return {
      title,
      image: image ? resolveUrl(decodeHTMLEntities(image).trim(), url) : null,
    };
  } catch {
    return { title: null, image: null };
  }
}
