function normalizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    const imgurl = parsed.searchParams.get('imgurl');
    if (imgurl) return decodeURIComponent(imgurl);
  } catch (_) {}

  const match = trimmed.match(/[?&]imgurl=([^&]+)/i);
  if (match) {
    try {
      return decodeURIComponent(match[1]);
    } catch (_) {}
  }

  return trimmed;
}

module.exports = normalizeImageUrl;
