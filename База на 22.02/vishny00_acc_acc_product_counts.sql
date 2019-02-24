CREATE TABLE vishny00_acc.acc_product_counts
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    productCount int(11),
    documentType int(11),
    documentId int(11),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL,
    accProductId int(11),
    CONSTRAINT acc_product_counts_ibfk_1 FOREIGN KEY (accProductId) REFERENCES vishny00_acc.acc_products (id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX accProductId ON vishny00_acc.acc_product_counts (accProductId);