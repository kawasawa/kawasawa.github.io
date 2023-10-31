SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS articles_metadata CASCADE;
DROP TABLE IF EXISTS articles_pickup CASCADE;
DROP TABLE IF EXISTS version CASCADE;
SET FOREIGN_KEY_CHECKS=1;

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
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE articles_pickup (
  id CHAR(20) NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE version (
  last_update VARCHAR(20) NOT NULL,
  PRIMARY KEY (last_update)
);
