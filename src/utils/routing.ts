type GetError = (method: string, url: string) => {
  type: string;
  message: string;
}

const getError: GetError = (method, url) => ({
  type: 'UNKNOWN_ROUTE',
  message: `A human-friendly message: ${method} ${url} doesn't exist.`,
});

type MatchRoute = (router: Record<string, any>, route: { method: string, url: string }) => {
  error: null | any;
  service: null | any;
}

export const matchRoute: MatchRoute = (router, { method, url }) => {
  const routerForMethod = router[method];

  if (!routerForMethod) {
    return {
      error: getError(method, url),
      service: null,
    }
  }

  // mapController(subrouter, url);
  const controller = routerForMethod[url];

  if (!controller) {
    return {
      error: getError(method, url),
      service: null,
    }
  }

  return {
    error: null,
    service: controller.service,
  };
};