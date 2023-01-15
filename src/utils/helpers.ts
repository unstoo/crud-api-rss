import { SERVICE_CODES } from "../users/user.service";

type ParserType = (str: string | undefined) => string;

export const parseUrl: ParserType = (url): string => {
  if (url === '/') return '/'
  if (!url) return '';

  let parsedUrl = url.startsWith('/') ? url.slice(1) : url;
  parsedUrl = parsedUrl.endsWith('/') ? parsedUrl.slice(0, -1) : parsedUrl;
  return parsedUrl;
}

export const parseMethod: ParserType = (method) => method || '';

export const SERVICE_TO_HTTP_CODE: Record<SERVICE_CODES, number> = {
  [SERVICE_CODES.FOUND]: 200,
  [SERVICE_CODES.NOT_FOUND]: 404,
  [SERVICE_CODES.CREATED]: 201,
  [SERVICE_CODES.UPDATED]: 200,
  [SERVICE_CODES.DELETED]: 204,
};
