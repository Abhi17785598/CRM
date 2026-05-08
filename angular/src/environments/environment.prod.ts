import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'HYD',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44379/',
    redirectUri: baseUrl,
    clientId: 'MyCrmApp_App',
    responseType: 'code',
    scope: 'offline_access MyCrmApp',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44379',
      rootNamespace: 'MyCrmApp',
    },
  },
} as Environment;
