import Vue from 'vue';
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'https://a29c74260bf84715b57364644e0f8e8e@sentry.io/1400181',
  release: process.env.SOURCE_VERSION,
  integrations: [
    new Sentry.Integrations.Vue({
      Vue,
      attachProps: true,
    }),
  ],
});
