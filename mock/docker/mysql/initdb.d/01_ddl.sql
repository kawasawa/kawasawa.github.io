SET FOREIGN_KEY_CHECKS=0;

SOURCE /docker-entrypoint-initdb.d/ddl/articles_metadata.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/articles_pickup.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/career_details.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/careers.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/certifications.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/icons.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/product_images.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/products.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/sns.sql;
SOURCE /docker-entrypoint-initdb.d/ddl/version.sql;

SET FOREIGN_KEY_CHECKS=1;
