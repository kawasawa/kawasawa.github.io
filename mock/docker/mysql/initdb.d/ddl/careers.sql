DROP TABLE IF EXISTS careers CASCADE;

CREATE TABLE careers (
  id          INT          NOT NULL AUTO_INCREMENT,
  date        VARCHAR(255) NOT NULL,
  place       VARCHAR(255) NOT NULL,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  favicon     TEXT,
  url         TEXT,
  visible     BOOLEAN      NOT NULL,
  PRIMARY KEY (id)
);
