type ParserType = (str: string | undefined) => string;

export const parseUrl: ParserType = (url): string => {
  if (url === '/') return '/'
  if (!url) return '';

  let parsedUrl = url.startsWith('/') ? url.slice(1) : url;
  parsedUrl = parsedUrl.endsWith('/') ? parsedUrl.slice(0, -1) : parsedUrl;
  return parsedUrl;
}

export const parseMethod: ParserType = (method) => method || '';
