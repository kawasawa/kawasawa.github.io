DROP TABLE IF EXISTS sns CASCADE;

CREATE TABLE sns (
  id          INT          NOT NULL AUTO_INCREMENT,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  favicon     TEXT,
  url         TEXT,
  visible     BOOLEAN      NOT NULL,
  PRIMARY KEY (id)
);
