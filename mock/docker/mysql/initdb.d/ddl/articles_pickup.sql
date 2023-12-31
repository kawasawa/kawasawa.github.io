DROP TABLE IF EXISTS articles_pickup CASCADE;

CREATE TABLE articles_pickup (
  id   CHAR(20) NOT NULL,
  data TEXT     NOT NULL,
  PRIMARY KEY (id)
);
