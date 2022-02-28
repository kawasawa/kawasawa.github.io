declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NODE_ENV: 'production' | 'development' | 'test';

        // APP
        readonly EXPRESS_PORT: number;
      }
    }
  }
}
