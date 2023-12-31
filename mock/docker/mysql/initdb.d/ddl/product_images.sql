DROP TABLE IF EXISTS product_images CASCADE;

CREATE TABLE product_images (
  product_id INT  NOT NULL,
  row_no     INT  NOT NULL,
  data       TEXT NOT NULL,
  PRIMARY KEY (product_id, row_no),
  FOREIGN KEY fk_product_id (product_id) REFERENCES products (id)
);
