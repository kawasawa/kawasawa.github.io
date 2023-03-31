import 'react-toastify/dist/ReactToastify.css';

import { colors, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import ga from 'react-ga4';
import { ToastContainer } from 'react-toastify';

import { endpoints } from '@/constants';
import { Top } from '@/pages';

const AppTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.grey[900] },
  },
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

const App = () => {
  // NOTE: React Hooks によりコンポーネントから汎用ロジックを分離できる
  //   よく使うものとして下記がある
  //   - useEffect  : 副作用の実行
  //   - useState   : 状態の保持
  //   - useRef     : 要素の保持
  //   - useMemo    : 値のメモ化
  //   - useCallback: 関数のメモ化

  // NOTE: 再描画のタイミング
  //   主に以下のタイミングで再描画が発生する
  //   - コンポーネントが保持する状態 (useState や useReducer等) が更新された場合
  //   - コンポーネントが参照するコンテキスト (useContext) が更新された場合
  //   - コンポーネントに渡される引数 (props およびそれに内包される値) が更新された場合
  //   - 親コンポーネントが再描画された場合 ※ メモ化 (React.memo) されたコンポーネントは除外される

  // NOTE: 副作用とは
  //   コンポーネントの本来の責務は描画だが、描画以外で実行しなければならない処理を React では「副作用」と呼ぶ
  //   API 処理 (サーバからのデータ取得) やイベントハンドラ (DOM イベント) などはすべて副作用となる
  //   副作用を含む処理をコンポーネント内にそのまま定義した場合、再描画のたびに処理が呼び出され、過剰実行や無限ループに陥る可能性がある
  //   useEffect は副作用が依存する値を指定する（実行される条件を限定する）ことで、再描画時の無条件実行を防ぐことができる

  React.useEffect(() => {
    /* istanbul ignore else */
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      ga.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID!);
      ga.send({ hitType: 'pageview', page: endpoints.self });
    }
  }, []);

  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Top data-testid="App__Top" />
      <ToastContainer draggable={false} closeButton={false} autoClose={5000} data-testid="App__ToastContainer" />
    </ThemeProvider>
  );
};

export default App;
