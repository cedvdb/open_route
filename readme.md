# open_route ( Prototype demo )

This library provides a server agnostic way of handling requests.

# Why

The goal of this library is to give common grounds for toolings.

# Usage

### 1. declare your handler

```ts
export interface CreateAccountRequest {
  body: {
    name: {
      firstname: string;
      lastname: string;
    },
    age: number;
  }
}

export interface CreateAccountResponseBody {
  id: string;
}

export class CreateAccountRoute implements Route<CreateAccountRequest, CreateAccountResponseBody> {
  readonly path = `/account`;
  readonly method = HttpMethod.post;

  async handle(request: CreateAccountRequest): Promise<Response<CreateAccountResponseBody>> {
    if (request.body.age >= 18) {
      return new OkResponse({ id: randomUUID() });
    } else {
      return new FailureResponse(400, 'Must be 18 years old');
    }
  }
}
```

### 2. Write an adapter for your server of choice

Here an express example:

```ts
/**
 * This is an example routeradapter which receives Routes and add their handlers to an express router
 */
export class ExampleExpressRouterAdapter {

  constructor(private router: express.Router) { }

  /** adds route to express */
  addRoute(route: Route<any, any>) {
    this.router[route.method](  // for the method defined on route
      route.path,  // for path defined on route
      this.toExpressHandler(route)  // use the handle method of said route
    );
  }

  /** transforms route.handle to an express handler */
  protected toExpressHandler(route: Route<any, any>) {
    return async (expressRequest: express.Request, expressResponse: express.Response) => {
      try {
        const response = await route.handle(expressRequest);
        this.handleResponse(response, expressResponse);
      } catch (e) {
        console.error(e);
        expressResponse.sendStatus(500);
      }
    }
  }

  /** given a open route response, call the appropriate  */
  protected handleResponse(response: Response<any>, expressResponse: express.Response) {
    if (response instanceof OkResponse) {
      expressResponse.status(response.statusCode).send(response.body);
    } else if (response instanceof RedirectResponse) {
      expressResponse.redirect(response.url);
    } else if (response instanceof FailureResponse) {
      expressResponse.status(response.code).send({ failure: response.failure });
    } else if (response instanceof InternalErrorResponse) {
      expressResponse.sendStatus(500);
    }
  }
}
```