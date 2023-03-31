const cookieConfig = {
  maxAge: 600,
  httpOnly: true,
  secure: true,
  sameSite: false,
};
export const config = {
  session: {
    secret: 'secret',
    cookie: cookieConfig,
    resave: false,
    rolling: true,
    saveUninitialized: false,
  },
  cors: {
    // origin: 'https://kawasawa.github.io/',
    credentials: true,
    methods: 'GET,POST,PATCH,DELETE',
  },
  csrf: {
    cookie: cookieConfig,
  },
};
