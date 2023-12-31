SET FOREIGN_KEY_CHECKS=0;

SOURCE /docker-entrypoint-initdb.d/dml/articles_metadata.sql;
SOURCE /docker-entrypoint-initdb.d/dml/articles_pickup.sql;
SOURCE /docker-entrypoint-initdb.d/dml/career_details.sql;
SOURCE /docker-entrypoint-initdb.d/dml/careers.sql;
SOURCE /docker-entrypoint-initdb.d/dml/certifications.sql;
SOURCE /docker-entrypoint-initdb.d/dml/icons.sql;
SOURCE /docker-entrypoint-initdb.d/dml/product_images.sql;
SOURCE /docker-entrypoint-initdb.d/dml/products.sql;
SOURCE /docker-entrypoint-initdb.d/dml/sns.sql;
SOURCE /docker-entrypoint-initdb.d/dml/version.sql;

SET FOREIGN_KEY_CHECKS=1;
