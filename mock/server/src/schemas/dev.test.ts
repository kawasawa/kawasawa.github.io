import { createSchema } from './dev';

describe('About', () => {
  test('オブジェクトがスキーマで指定された条件を満たす場合は型定義されたオブジェクトが返却されること', async () => {
    const dummy_data = {
      name: 'name',
      email: 'email@example.com',
      message: 'message',
    };
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).resolves.toBe(dummy_data);
  });

  test('プロパティが不足している場合は例外をスローすること', async () => {
    const dummy_data = {};
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).rejects.toThrow();
  });

  test('name が最大長を超える場合は例外をスローすること', async () => {
    const dummy_data = {
      name: 'a'.repeat(256),
      email: 'email@example.com',
      message: 'message',
    };
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).rejects.toThrow();
  });

  test('email が最大長を超える場合は例外をスローすること', async () => {
    const dummy_data = {
      name: 'name',
      email: `${'a'.repeat(244)}@example.com`,
      message: 'message',
    };
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).rejects.toThrow();
  });

  test('email の書式が不正な場合は例外をスローすること', async () => {
    const dummy_data = {
      name: 'name',
      email: 'invalid-email',
      message: 'message',
    };
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).rejects.toThrow();
  });

  test('inquiry が最大長を超える場合は例外をスローすること', async () => {
    const dummy_data = {
      name: 'name',
      email: 'email@example.com',
      message: 'a'.repeat(1001),
    };
    const schema = createSchema();
    await expect(schema.validate(dummy_data)).rejects.toThrow();
  });
});
