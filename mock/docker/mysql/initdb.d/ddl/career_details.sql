DROP TABLE IF EXISTS career_details CASCADE;

CREATE TABLE career_details (
  career_id INT NOT NULL,
  row_no INT NOT NULL,
  subject_ja_jp VARCHAR(255) NOT NULL,
  subject_en_us VARCHAR(255) NOT NULL,
  skills TEXT,
  PRIMARY KEY (career_id, row_no),
  FOREIGN KEY fk_career_id (career_id) REFERENCES careers (id)
);
