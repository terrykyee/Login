import { buildPost, checkHttpStatusCode } from './FetchUtilities';
import { LoginServerUrls } from './LoginServerUrls';

const LoginServerRequestsErrorMessages = {
  LOGIN_ERROR: 'Error logging into the server',
  REGISTER_ERROR: 'Error registering a user',
  USER_RETRIEVAL_ERROR: 'Error retrieving user information',
};

export type LoginServerResponseType = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  __v: number,
}

export class LoginServerRequests {
  static request(url: string, firstName: string, lastName: string, email: string, password: string): Promise<*> {
    return fetch(url, buildPost(firstName, lastName, email, password))
      .then((response: Object) => {
          checkHttpStatusCode(response, LoginServerRequestsErrorMessages.LOGIN_ERROR);
          return response.json();
        });
  }

  static registerUser(firstName: string, lastName: string, email: string, password: string): Promise<*> {
    const url = LoginServerUrls.user();
    return LoginServerRequests.request(url, firstName, lastName, email, password);
  }

  static loginUser(email: string, password: string): Promise<*> {
    const url = LoginServerUrls.login();
    return LoginServerRequests.request(url, null, null, email, password);
  }
}