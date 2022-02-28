import { Options, Sequelize } from 'sequelize';

import { initializeModels } from './models';

const options: Options = {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  pool: {
    max: 10,
    min: 3,
    acquire: 30000,
    evict: 10000,
  },
};

export const instance = new Sequelize(
  process.env.NODE_ENV === 'production'
    ? {
        ...options,
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : options
);

export const initializeAdapter = () => {
  initializeModels(instance);
};
