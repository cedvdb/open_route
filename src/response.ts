import assert from 'node:assert';

export interface Response {
  readonly statusCode: number;
}

/** A success response. Results in a 200 status code */
export class OkResponse<T> implements Response {
  readonly statusCode = 200;
  constructor(
    public readonly body: T,
  ) { }
}

/** A success response. Results in a 201 status code */
export class CreatedResponse<T> implements Response {
  readonly statusCode = 201;
  constructor(
    public readonly body: T,
    public readonly location?: string,
  ) { }
}

/** A redirection. Results in a 301 status code */
export class RedirectResponse implements Response {
  readonly statusCode = 301;
  constructor(
    public readonly location: string,
  ) { }
}

/** A failure response. Results in a 4XX status code */
export class FailureResponse implements Response {
  constructor(
    public readonly statusCode: number,
    public readonly failure: string,
  ) {
    assert(statusCode >= 400 && statusCode < 500, 'statusCode for failure must be 4XX');
  }
}

/** A internal error response. Results in a 5XX status code */
export class InternalErrorResponse implements Response {
  readonly statusCode = 500;
  constructor(
    public readonly error: any,
  ) { }
}