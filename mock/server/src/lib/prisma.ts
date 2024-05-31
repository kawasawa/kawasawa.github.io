import { PrismaClient } from '@prisma/client';

import { dbLog, dbQuery } from './pino';

// 公式では、PrismaClient のインスタンスはシングルトンであるべきとされている。
// 各インスタンスが接続プールを管理するため、DB の接続数を使い果たす可能性があるためである。
// また、常時接続が起こり得る API サーバの場合は、接続の解放 `$disconnect()` は推奨されていない。
// https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/connection-management
let _client: PrismaClient | null = null;

const createDbClient = () => {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' },
      { level: 'error', emit: 'event' },
    ],
  });
  client.$on('query', (event) => dbQuery(event));
  client.$on('info', (event) => dbLog(event, 'info'));
  client.$on('warn', (event) => dbLog(event, 'warn'));
  client.$on('error', (event) => dbLog(event, 'error'));
  return client;
};

/**
 * DB クライアントのインスタンスを取得します。
 * @returns DB クライアント
 */
export const getDbClient = () => _client ?? (_client = createDbClient());
