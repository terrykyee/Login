//@flow
/** List of URL templates for Login Server endpoints. */
import urljoin from 'url-join';

export const Paths = {
  USER: '/users',
  LOGIN: '/users/login',
};

export const HOST_NAME = 'localhost';

/**
 * Represents a protocol and its characteristics.
 */
export type WebProtocolType = {
  protocol: string,
  port: string,
};

/** List of web protocols used in communication */
export const WebProtocols = {
  http: {
    protocol: 'http',
    port: '3001',
  },
};

/**
 * Class providing methods to generate URLs to Login Server endpoints.
 */
export class LoginServerUrls {
  /**
   * Formats a url origin from a given hostname and protocol.
   * @param hostname - The hostname
   * @param protocol - the Protocol
   * @returns {string} - The url origin based on the given hostname, protocol and port
   */
  static formatOrigin(hostname: string, protocol: WebProtocolType): string {
    let origin = `${encodeURIComponent(protocol.protocol)}://${encodeURIComponent(hostname)}`;

    if (protocol.port !== null && protocol.port.length > 0) {
      origin = `${origin}:${encodeURIComponent(protocol.port)}`;
    }

    return origin;
  }

  /**
   * Gets the login server origin for a given protocol and the current base domain.
   * @param protocol The protocol
   * @returns {string} The origin.
   */
  static getLoginServerOrigin(protocol: WebProtocolType): string {
    return LoginServerUrls.formatOrigin(HOST_NAME, protocol);
  }

  /**
   * Gets the endpoint to register a user.
   * @return {string} URL to the Login Server register a user endpoint
   */
  static user(): string {
    return `${urljoin(LoginServerUrls.getLoginServerOrigin(WebProtocols.http),
      Paths.USER)}`;
  }

  /**
   * Gets the endpoint to login a user.
   * @return {string} URL to the Login Server login a user endpoint
   */
  static login(): string {
    return `${urljoin(LoginServerUrls.getLoginServerOrigin(WebProtocols.http),
      Paths.LOGIN)}`;
  }
}