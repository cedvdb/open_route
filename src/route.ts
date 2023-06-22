
import { HttpMethod } from './http_method';
import { HttpPath } from './http_path';
import { FailureResponse, InternalErrorResponse, OkResponse, RedirectResponse } from './response';

export type HandlerResult<T> = OkResponse<T> | RedirectResponse | FailureResponse | InternalErrorResponse;


/**
 * Represents a single endpoint.
 */
export interface Route<Request, ResponseBody> {
  /** Example "/account" */
  path: HttpPath;
  /** The http method to be used to access this endpoint */
  method: HttpMethod;

  handle: (request: Request) => Promise<HandlerResult<ResponseBody>>;
}