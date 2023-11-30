import { Backdrop, Box, CircularProgress } from '@mui/material';
import React from 'react';

import { BackToTopButton, Installer } from '@/components/elements';
import { About, Articles, Banner, Footer, Header, Products } from '@/components/layouts';

// NOTE: React Context によりコンポーネントの階層を横断してオブジェクトを伝播させることができる
// 親から子さらに孫へと値を授受する際、props によるバケツリレー (prop drilling) を避けることができる
// 一般的に状態管理の方式は以下で使い分けられる
//   - Global State: React.Context
//   - Local State : React.useState

export const PendingContext = React.createContext<
  React.Dispatch<React.SetStateAction<boolean>>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>(() => {});

export const Top = () => {
  // NOTE: React Hooks によりコンポーネントから汎用ロジックを分離できる
  //   よく使うものとして下記がある
  //   - useState   : 状態の保持
  //   - useRef     : 要素の保持
  //   - useMemo    : 値のメモ化
  //   - useCallback: 関数のメモ化
  //   - useEffect  : 副作用の実行

  const [isPending, setIsPending] = React.useState(false);
  const backToTopRef = React.useRef<HTMLDivElement>(null);
  const isVisible = React.useCallback(
    () => !!backToTopRef?.current && backToTopRef.current.offsetTop < window.scrollY,
    []
  );

  return (
    <PendingContext.Provider value={setIsPending}>
      <Box sx={{ color: 'common.white', bgcolor: 'grey.900' }}>
        <Header data-testid="Top__Header" />
        <Banner data-testid="Top__Banner" />
        <div ref={backToTopRef} />
        <Products data-testid="Top__Products" />
        <Articles data-testid="Top__Articles" />
        <About data-testid="Top__About" />
        <Footer data-testid="Top__Footer" />
        <Installer data-testid="Top__InstallButton" />
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
