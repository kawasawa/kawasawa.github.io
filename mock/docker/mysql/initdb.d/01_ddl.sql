SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS icons CASCADE;
DROP TABLE IF EXISTS careers CASCADE;
DROP TABLE IF EXISTS career_details CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS articles_metadata CASCADE;
DROP TABLE IF EXISTS articles_pickup CASCADE;
DROP TABLE IF EXISTS version CASCADE;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE icons (
  id VARCHAR(255) NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  body_ja_jp TEXT NOT NULL,
  body_en_us TEXT NOT NULL,
  skills TEXT NOT NULL,
  url_code TEXT NOT NULL,
  url_home TEXT NOT NULL,
  downloads INT,
  pickup BOOLEAN NOT NULL,
  visible BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE product_images (
  product_id INT NOT NULL,
  row_no INT NOT NULL,
  data TEXT NOT NULL,
  PRIMARY KEY (product_id, row_no),
  FOREIGN KEY fk_product_id (product_id) REFERENCES products (id)
);

CREATE TABLE careers (
  id INT NOT NULL AUTO_INCREMENT,
  date VARCHAR(255) NOT NULL,
  place VARCHAR(255) NOT NULL,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  favicon TEXT,
  url TEXT,
  visible BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE career_details (
  career_id INT NOT NULL,
  row_no INT NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  skills TEXT,
  PRIMARY KEY (career_id, row_no),
  FOREIGN KEY fk_career_id (career_id) REFERENCES careers (id)
);

CREATE TABLE certifications (
  id INT NOT NULL AUTO_INCREMENT,
  date VARCHAR(255) NOT NULL,
  title_ja_jp VARCHAR(255) NOT NULL,
  title_en_us VARCHAR(255) NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  favicon TEXT,
  url TEXT,
  visible BOOLEAN NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE articles_metadata (
  id CHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
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
