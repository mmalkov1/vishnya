CREATE TABLE vishny00_acc.acc_product_statuses
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(255),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL
);
INSERT INTO vishny00_acc.acc_product_statuses (id, name, createdAt, updatedAt) VALUES (1, 'В наличии', null, null);
INSERT INTO vishny00_acc.acc_product_statuses (id, name, createdAt, updatedAt) VALUES (2, 'Отсутствует', null, null);