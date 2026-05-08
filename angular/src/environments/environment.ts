import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'HYD',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'http://localhost:44379/',
    redirectUri: baseUrl,
    clientId: 'MyCrmApp_App',
    responseType: 'code',
    scope: 'offline_access MyCrmApp',
    requireHttps: false,
  },
  apis: {
    default: {
      url: 'http://localhost:44379',
      rootNamespace: 'MyCrmApp',
    },
  },
} as Environment;
