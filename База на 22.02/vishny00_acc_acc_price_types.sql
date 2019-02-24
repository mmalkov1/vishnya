CREATE TABLE vishny00_acc.acc_price_types
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    price_name varchar(255),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL
);
INSERT INTO vishny00_acc.acc_price_types (id, price_name, createdAt, updatedAt) VALUES (1, 'Закупочная', null, null);
INSERT INTO vishny00_acc.acc_price_types (id, price_name, createdAt, updatedAt) VALUES (2, 'Розничная', null, null);