import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';

import { BackToTopButton } from '@/components/elements';
import { About, Articles, Banner, Footer, Header, Products } from '@/components/layouts';

// NOTE: React Context でグローバルに状態を保持できる
//   一般的に状態管理の方式は以下で使い分けされる
//     - Local State : useState
//     - Global State: React Context
//   Context はコンポーネント間を横断して状態を保持できるため、
//   親から子さらに孫へと伝播させる際の prop drilling (バケツリレー) を回避できる

export const PendingContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  [false, () => {}]
);

export const Top = () => {
  // NOTE: React Hooks で再利用可能な汎用処理をコンポーネントから分離できる
  //   代表的なものに以下がある
  //   - useEffect 副作用の分離
  //       summary:
  //         副作用 (描画以外の処理) は useEffect 内に定義する
  //       example:
  //         // ① 依存配列に指定された変数が変更されたときに処理が実行される
  //         React.useEffect(() => {
  //           document.title =`${count} times clicked`;
  //         }, [count])
  //         // ② 依存配列を空にすると初回レンダリング時のみ処理が実行される
  //         //    戻り値には再レンダリング時または削除時のクリーンアップ処理を指定できる
  //         //    (イベントハンドラの解除等に用いることが多い)
  //         React.useEffect(() => {
  //           const onScroll = () => {};
  //           window.addEventListener('scroll', onScroll);
  //           return () => window.removeEventListener('scroll', onScroll);
  //         }, []);
  //       appendix:
  //         useEffect はレンダリング結果 (return された JSX) で DOM が更新され、それをブラウザが描画した後に実行される
  //         (つまり関数本体にある処理 (useState や useRef) がすべて解釈された後となる)
  //         なお、類似するフックである useLayoutEffect は useEffect よりも先に実行される
  //         useLayoutEffect は DOM の更新後、ブラウザが描画する前に実行される
  //         従って DOM やスクロール位置を変更する処理は、useLayoutEffect に実装することで画面のちらつきを回避できる
  //
  //   - useState 値の保持
  //       summary:
  //         更新時に再レンダリングが必要な値は useState で保持する
  //         通常の変数 (let 等) は更新しても再レンダリングされない
  //       example:
  //         // useState は現在値とセッターメソッドを返す
  //         // useState の引数には初期値を指定できる
  //         const [count, setCount] = React.useState(0);
  //
  //   - useRef 参照の保持
  //       summary:
  //         (値ではなく) 参照は useRef で保持する
  //         useState と異なり参照を保持するのみで、値を変更しても再レンダリングされない
  //         参照内の実体 (値) には current プロパティを介してアクセスする
  //         スクロール位置の制御や、DOM のクリック、入力フォーカスの設定に用いることが多い
  //       example:
  //         // ① DOM 要素の参照を保持し、アクセスする
  //         const elementRef = React.useRef<HTMLInputElement>(null);
  //         const handleFocus = React.useCallback(() => elementRef.current?.focus(), []);
  //         return (
  //           <>
  //             <input ref={elementRef} type="text" />
  //             <button onClick={handleFocus}>Focus</button>
  //           </>
  //         );
  //         // ② プリミンティブ型の参照も保持できる
  //         const valueRef = React.useRef(0);
  //
  //   - useMemo 値のキャッシュ
  //       summary:
  //         計算結果の値をキャッシュする
  //         再レンダリング時、依存配列で指定された要素に変更がなければ React は前回使用した計算結果の値を再利用する
  //         計算処理の負荷が高いものをキャッシュして使用することが多い
  //       example:
  //         const center = React.useMemo(() => calcCenter(points), [calcCenter, points]);
  //
  //   - useCallback 関数のキャッシュ
  //       summary:
  //         関数の参照をキャッシュする
  //         再レンダリング時、依存配列で指定された要素に変更がなければ React は前回使用した関数の参照を再利用する
  //         (なので、正確には関数の生成をスキップする訳ではなく無視しているだけである)
  //         ※ 若干可読性は落ちるが、本プロダクトでは原則すべてのローカル関数を useCallback でラップする方針としている
  //         (キャッシュされた関数が他から依存を受けていない場合はメリットが薄いが、特段のデメリットも無い)
  //       example:
  //         // ① useEffect 内で使用する関数をキャッシュすることで再レンダリング時の不必要な再実行を防止する
  //         const scrollTop = React.useCallback(() => {
  //           const element = dialogRef.current;
  //           if (element) element.scrollTop = 0;
  //         }, []);
  //         React.useEffect(() => scrollTop(), [scrollTop]);
  //         // ② メモ化されたコンポーネントに渡す関数をキャッシュする
  //         //    memo は props が変更されたときのみコンポーネントを再レンダリングする
  //         //    useCallback は依存配列が変更されたときのみ関数の参照を更新する
  //         //    これらが合わさることで、不要な再レンダリングを抑制できる
  //         const Child = React.memo((props: { onClick: React.MouseEventHandler }) => (
  //           <button onClick={props.onClick}>Click</button>
  //         ));
  //         const Parent = () => {
  //           const handleClick = React.useCallback(() => console.log('clicked'), []);
  //           return <Child onClick={handleClick} />;
  //         };

  const [isPending, setIsPending] = React.useState(false);
  const backToTopRef = React.useRef<HTMLDivElement>(null);
  const isVisible = React.useCallback(
    () => !!backToTopRef?.current && backToTopRef.current.offsetTop < window.scrollY,
    []
  );

  return (
    <PendingContext.Provider value={[isPending, setIsPending]}>
      <Box sx={{ color: 'common.white', bgcolor: 'grey.900' }}>
        <Header data-testid="Top__Header" />
        <Banner data-testid="Top__Banner" />
        <div ref={backToTopRef} />
        <Products data-testid="Top__Products" />
        <Articles data-testid="Top__Articles" />
        <About data-testid="Top__About" />
        <Footer data-testid="Top__Footer" />
        <BackToTopButton isVisible={isVisible} data-testid="Top__BackToTopButton" />
        <Backdrop
          open={isPending}
          sx={(theme) => ({
            color: 'common.white',
            zIndex: Math.max(...Object.values(theme.zIndex)) + 1,
          })}
        >
          <CircularProgress color="inherit" size={60} thickness={5} />
        </Backdrop>
      </Box>
    </PendingContext.Provider>
  );
};
