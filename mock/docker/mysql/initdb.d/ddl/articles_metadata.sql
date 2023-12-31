DROP TABLE IF EXISTS articles_metadata CASCADE;

CREATE TABLE articles_metadata (
  id CHAR(20) NOT NULL,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  body_ja_jp TEXT NOT NULL,
  body_en_us TEXT NOT NULL,
  tags VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  likes_count INT NOT NULL,
  stocks_count INT NOT NULL,
  comments_count INT NOT NULL,
  /*
   // NOTE: MySQL の日時型は DATETIME が推奨される (2024 年時点)
   // - TIMESTAMP: 日付 ◯, 時刻 ◯, TZ ◯ (2038 年問題の影響を受ける)
   // - DATETIME : 日付 ◯, 時刻 ◯, TZ ×
   // - DATE     : 日付 ◯, 時刻 ×, TZ ×
   // ただし将来的に MySQL のアップデートで対応される可能性は十分ある
   // PostgreSQL は 8.4 以降 TIMESTAMP が 8bit に拡張された
   */
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
