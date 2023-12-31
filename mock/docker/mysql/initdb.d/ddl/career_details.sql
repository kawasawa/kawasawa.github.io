DROP TABLE IF EXISTS career_details CASCADE;

CREATE TABLE career_details (
  /*
   // NOTE: MySQL の予約語のエスケープにはバッククォートを使用する
   // DBMS ごとに仕様が異なる
   //   - MySQL     : `id`  -- バッククォート
   //   - PostgreSQL: "id"  -- ダブルクォート
   //   - Oracle    : "id"  -- ダブルクォート
   //   - SQL Server: "id"  -- ダブルクォート または ブラケット[]
   */
  career_id INT NOT NULL,
  row_no INT NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  skills TEXT,
  PRIMARY KEY (career_id, row_no),
  FOREIGN KEY fk_career_id (career_id) REFERENCES careers (id)
  /*
   // NOTE: MySQL の外部キーにはインデックスが自動で付与される
   // DBMS ごとに仕様が異なる
   //   - MySQL     : PRIMARY ◯, UNIQUE ◯, FOREIGN ◯
   //   - PostgreSQL: PRIMARY ◯, UNIQUE ◯, FOREIGN ×
   //   - Oracle    : PRIMARY ◯, UNIQUE ◯, FOREIGN ×
   //   - SQL Server: PRIMARY ◯, UNIQUE ◯, FOREIGN ×
   */
  -- CREATE INDEX idx_career_id ON career_details (career_id);
);
