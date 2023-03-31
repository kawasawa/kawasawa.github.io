import dotenv from 'dotenv';
import fs from 'fs';

import { createApp } from './app';
import { initializeAdapter } from './db';

const envName = process.env.NODE_ENV;
if (!envName) throw new Error(`NODE_ENV is empty.`);
console.log(`NODE_ENV identified. : envName="${envName}"`);

let envPath = `./.env.${envName}`;
if (!fs.existsSync(envPath)) envPath = './.env';
if (!fs.existsSync(envPath)) throw new Error(`EnvFile does not exists. : path="${envPath}"`);
dotenv.config({ path: envPath });
console.log(`EnvFile has been loaded. : path="${envPath}"`);

initializeAdapter();

const app = createApp();
app.listen(process.env.EXPRESS_PORT, () => console.log(`Start to listen. : port="${process.env.EXPRESS_PORT}"`));
