declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'production' | 'development' | 'test';

        // REACT_APP
        readonly REACT_APP_GOOGLEAPIS_URL: string;
        readonly REACT_APP_GOOGLE_SHEETS_API_KEY: string;
        readonly REACT_APP_GOOGLE_SHEETS_ID: string;
        readonly REACT_APP_GOOGLE_ANALYTICS_ID?: string;
        readonly REACT_APP_EMAILJS_PUBLIC_KEY?: string;
        readonly REACT_APP_EMAILJS_SERVICE_ID?: string;
        readonly REACT_APP_EMAILJS_TEMPLATE_ID?: string;
        readonly REACT_APP_SENTRY_DSN?: string;
      }
    }
  }
}
