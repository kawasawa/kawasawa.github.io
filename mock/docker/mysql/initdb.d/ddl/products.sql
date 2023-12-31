DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE products (
  id            INT          NOT NULL AUTO_INCREMENT,
  title_ja_jp   VARCHAR(255) NOT NULL,
  title_en_us   VARCHAR(255) NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  body_ja_jp    TEXT         NOT NULL,
  body_en_us    TEXT         NOT NULL,
  skills        TEXT         NOT NULL,
  url_code      TEXT         NOT NULL,
  url_home      TEXT         NOT NULL,
  downloads     INT,
  pickup        BOOLEAN      NOT NULL,
  visible       BOOLEAN      NOT NULL,
  PRIMARY KEY (id)
);
