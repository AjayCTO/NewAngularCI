import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:5000',
  clientId: 'angular_spa', // The "Auth Code + PKCE" client
  responseType: 'id_token token',
  redirectUri: 'http://localhost:4200/auth-callback',
  postLogoutRedirectUri: 'http://localhost:4200/',
  silentRefreshRedirectUri: 'http://localhost:4200/silent-refresh.html',
  scope: 'openid profile api1 api3', // Ask offline_access to support refresh token refreshes
  useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  silentRefreshTimeout: 5000, // For faster testing
  // timeoutFactor: 0.25, // For faster testing
  // sessionChecksEnabled: true,
  // showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  nonceStateSeparator: 'semicolon' // Real semicolon gets mangled by IdentityServer's URI encoding

  // issuer: 'https://clearlyauthserver.azurewebsites.net',
  // clientId: 'clearlyinventoryUI', // The "Auth Code + PKCE" client
  // responseType: 'id_token token',
  // redirectUri: 'https://clearlyinventory4.azurewebsites.net/auth-callback',
  // postLogoutRedirectUri: 'https://clearlyinventory4.azurewebsites.net/',
  // silentRefreshRedirectUri: 'https://clearlyinventory4.azurewebsites.net/silent-refresh.html',
  // scope: 'openid profile api1 api3', // Ask offline_access to support refresh token refreshes
  // useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
  // silentRefreshTimeout: 5000, // For faster testing
  // // //timeoutFactor: 0.25, // For faster testing
  // // //  sessionChecksEnabled: true,
  // // // showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
  // clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
  // nonceStateSeparator: 'semicolon' // Real semicolon gets mangled by IdentityServer's URI encoding


};
