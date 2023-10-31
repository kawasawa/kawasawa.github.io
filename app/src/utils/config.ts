/**
 * ローカルストレージに保存された設定値を一意に特定するキーを表します。
 */
export const configKeys = {
  locale: 'locale',
} as const;

/**
 * ローカルストレージに保存された設定値を一意に特定するキーを表します。
 */
export type ConfigKeys = (typeof configKeys)[keyof typeof configKeys];

/**
 * ローカルストレージに保存されている値を取得します。
 * @param key 設定キー
 * @returns 設定値
 */
export const getConfig = (key: ConfigKeys) => localStorage.getItem(key);

/**
 * ローカルストレージに値を保存、または既に保存されている値を更新します。
 * @param key 設定キー
 * @param value 設定値
 */
export const setConfig = (key: ConfigKeys, value: string) => localStorage.setItem(key, value);
