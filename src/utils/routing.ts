type ErrorType = {
  type: string;
  message: string;
}

type GetError = (method: string, url: string) => ErrorType;

const getError: GetError = (method, url) => ({
  type: 'UNKNOWN_ROUTE',
  message: `A human-friendly message: ${method} ${url} doesn't exist.`,
});

type MatchRoute = (router: Record<string, any>, route: { method: string, url: string }) => {
  error: ErrorType | null;
  service?: any | undefined;
  validator?: any;
  params?: Record<any, any>;
}

export const matchRoute: MatchRoute = (router, { method, url }) => {
  const routerForMethod = router[method];

  if (!routerForMethod) {
    return {
      error: getError(method, url),
    }
  }


  const staticController = routerForMethod[url];
  if (staticController) {
    return {
      error: null,
      service: staticController.service,
      validator: staticController.validator,
      params: {},
    };
  }

  const dynamicControllers = Object.entries(routerForMethod)
    .filter(([key, value]) => key.includes(':'))
    .map(([key, value]) => ({
      //@ts-ignore
      service: value.service,
      //@ts-ignore
      validator: value.validator,
      routeName: key.split(":")[0],
      paramName: key.split(":")[1],
    }));

  const dynamicController = dynamicControllers.find(controller => url.includes(controller.routeName));

  if (dynamicController) {
    return {
      error: null,
      service: dynamicController.service,
      validator: dynamicController.validator,
      params: {
        [dynamicController.paramName]: url.slice(dynamicController.routeName.length)
      },
    };
  }

  return {
    error: getError(method, url),
    service: null,
  }
};