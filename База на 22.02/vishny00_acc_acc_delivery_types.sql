CREATE TABLE vishny00_acc.acc_delivery_types
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(255),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL
);
INSERT INTO vishny00_acc.acc_delivery_types (id, name, createdAt, updatedAt) VALUES (1, 'Самовывоз', '2018-01-01 00:00:00', '2018-01-01 00:00:00');
INSERT INTO vishny00_acc.acc_delivery_types (id, name, createdAt, updatedAt) VALUES (2, 'Доставка на отделение НП', '2018-01-01 00:00:00', '2018-01-01 00:00:00');
INSERT INTO vishny00_acc.acc_delivery_types (id, name, createdAt, updatedAt) VALUES (3, 'Доставка по адресу НП', '2018-01-01 00:00:00', '2018-01-01 00:00:00');
INSERT INTO vishny00_acc.acc_delivery_types (id, name, createdAt, updatedAt) VALUES (4, 'Доставка Укрпочтой', '2018-01-01 00:00:00', '2018-01-01 00:00:00');