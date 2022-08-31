import axios, { AxiosInstance } from 'axios';

import { createInstance, invoke } from './axios';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    defaults: {
      withCredentials: true,
      headers: { common: [] },
    },
    create: jest.fn(),
  },
}));

describe('axios', () => {
  const mock_use = jest.fn();
  const mock_get = jest.fn();
  const mock_post = jest.fn();
  const mock_patch = jest.fn();
  const mock_delete = jest.fn();
  const spy_create = jest.spyOn(axios, 'create');
  const dummy_AxiosInstance = {
    interceptors: { response: { use: mock_use } },
    get: mock_get,
    post: mock_post,
    patch: mock_patch,
    delete: mock_delete,
  } as unknown as AxiosInstance;

  beforeEach(() => {
    mock_get.mockClear();
    mock_post.mockClear();
    mock_patch.mockClear();
    mock_delete.mockClear();
    spy_create.mockClear();
    spy_create.mockReturnValue(dummy_AxiosInstance);
  });

  describe('createInstance', () => {
    it('リトライ回数を0回にするとリトライの設定が組み込まれないこと', () => {
      const instance = createInstance(0);
      expect(instance).toBe(dummy_AxiosInstance);
      expect(spy_create).toBeCalled();
      expect(mock_use).not.toBeCalled();
    });

    it('リトライ回数を1回以上にするとリトライの設定が組み込まれること', () => {
      const instance = createInstance(1);
      expect(instance).toBe(dummy_AxiosInstance);
      expect(spy_create).toBeCalled();
      expect(mock_use).toBeCalled();
    });

    it('既定の状態ではリトライの設定が組み込まれること', () => {
      const instance = createInstance();
      expect(instance).toBe(dummy_AxiosInstance);
      expect(spy_create).toBeCalled();
      expect(mock_use).toBeCalled();
    });
  });

  describe('invoke', () => {
    it('GETメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_get.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'GET', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_get).toBeCalled();
    });

    it('getメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_get.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'get', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_get).toBeCalled();
    });

    it('POSTメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_post.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'POST', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_post).toBeCalled();
    });

    it('postメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_post.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'post', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_post).toBeCalled();
    });

    it('PATCHメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_patch.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'PATCH', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_patch).toBeCalled();
    });

    it('patchメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_patch.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'patch', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_patch).toBeCalled();
    });

    it('DELETEメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_delete.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'DELETE', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_delete).toBeCalled();
    });

    it('deleteメソッドが呼び出されること', async () => {
      const dummy_AxiosResponse = { data: {} };
      mock_delete.mockReturnValue(dummy_AxiosResponse);
      const instance = createInstance();

      const response = await invoke(instance, 'delete', 'example.com');
      expect(response).toBe(dummy_AxiosResponse);
      expect(mock_delete).toBeCalled();
    });

    it('サポートされていないメソッドには例外をスローすること', async () => {
      const instance = createInstance();
      expect(() => invoke(instance, 'OPTIONS', 'example.com')).toThrow();
    });
  });
});
