DROP TABLE IF EXISTS version CASCADE;

CREATE TABLE version (
  last_update VARCHAR(20) NOT NULL,
  PRIMARY KEY (last_update)
);
