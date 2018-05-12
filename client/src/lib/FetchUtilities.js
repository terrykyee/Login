import {
  DataAccessError,
  UnauthenticatedDataAccessError,
  UnauthorizedDataAccessError,
  PermanentDataAccessError,
  TemporaryDataAccessError,
  NotFoundDataAccessError,
} from './NetworkUtilities';

export const FetchConstants = {
  METHOD_POST: 'POST',
  METHOD_PUT: 'PUT',
  METHOD_GET: 'GET',
  NO_CORS: 'no-cors',
  CORS: 'cors',
  HEADER_CONTENT_TYPE: 'Content-Type',
  CONTENT_TYPE_JSON: 'application/json',
  CONTENT_TYPE_TEXT: 'text/plain',
  CONTENT_TYPE_FORM_URL_ENCODED: 'application/x-www-form-urlencoded',
};

/**
 * Composes HTTP POST request to register or login a user
 * @param firstName User first name
 * @param lastName User last name
 * @param email User email
 * @param password User password
 * @returns POST body object
 */
export function buildPost(firstName: ?string, lastName: ?string, email: string, password: string): Object {
  const body = new URLSearchParams();
  if (firstName) {
    body.append('firstName', firstName);
  }

  if (lastName) {
    body.append('lastName', lastName);
  }

  body.append('email', email);
  body.append('password', password);

  return {
    method: FetchConstants.METHOD_POST,
    headers: {
      'Content-Type' : FetchConstants.CONTENT_TYPE_FORM_URL_ENCODED,
    },
    body,
  };
}

/**
 * Checks for a response successful HTTP status code (2xx) and if it is not successful, throw
 * a HttpDataAccessError.
 * @param response - The HTTP response object to check.
 * @param message - Message to include in any exceptions
 */
export function checkHttpStatusCode(response: Object, message: string) {
  if (response === null) {
    throw new DataAccessError(message, Date.now(), response);
  }

  if (response.status >= 200 && response.status < 400) {
    return;
  }

  if (response.status === 401) {
    throw new UnauthenticatedDataAccessError(message, Date.now(), response);
  }

  if (response.status === 403) {
    throw new UnauthorizedDataAccessError(message, Date.now(), response);
  }

  if (response.status === 404) {
    throw new NotFoundDataAccessError(message, Date.now(), response);
  }

  if (response.status >= 400 && response.status < 500) {
    // These are bad responses of some kind, they aren't going to fix themselves
    throw new PermanentDataAccessError(message, Date.now(), response);
  }

  if (response.status >= 500) {
    // These are temporary server side failure conditions, retry them
    throw new TemporaryDataAccessError(message, Date.now(), response);
  }
}