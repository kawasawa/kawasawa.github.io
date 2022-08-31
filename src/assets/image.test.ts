import { extractAlt } from './images';

describe('image', () => {
  it('引数がshields.ioの形式に合致する場合、statusエリアの文字列が返却されること', () => {
    const status = 'status';
    const alt = extractAlt(`https://example.com/-${status}-ABCDEF.svg?logo=hoge&style=flat`);
    expect(alt).toBe(status);
  });

  it('引数がshields.ioの形式に合致しない場合、引数の文字列がそのまま返却されること', () => {
    const status = 'status';
    const alt = extractAlt(status);
    expect(alt).toBe(status);
  });
});
