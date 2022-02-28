import express from 'express';

import { articlesMetadata, articlesPickup, version } from '../api';

// NOTE: REST API の URI はハイフン区切りが推奨される
//   明確なルールは無いが、特段意向が無ければハイフン区切り (スパイナルケース) を採用する
//   実際、ドメイン名ではハイフンは許容されるが、アンダースコアは使用できない
//   キャメルケースも一応存在するが、他に比べると可読性が低く少数派である
//   そもそも、単語が連続するような名称のリソースはディレクトリ自体を分けるべきだ
//     articles-metadata -> articles/metadata (今回はスプレッドシート名なので致し方ない)
const router = express.Router();
router.get('/:sheetId/values/articles-metadata', articlesMetadata);
router.get('/:sheetId/values/articles-pickup', articlesPickup);
router.get('/:sheetId/values/version', version);

export const spreadsheetsRouter = router;
