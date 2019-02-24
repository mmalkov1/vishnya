CREATE TABLE vishny00_acc.acc_categories
(
    id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    category_name varchar(255),
    parent_id int(11),
    createdAt datetime NOT NULL,
    updatedAt datetime NOT NULL
);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (1, 'Главная', 0, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596131, 'Женский   Кожаный рюкзак', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596134, 'Женский Повседневный рюкзак', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596136, 'Женские сумки Из натуральной кожи', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596171, 'Женские  Повседневные сумки', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596173, 'Женские Вечерние, мини, клатчи', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596192, 'Мужские Тибетские браслеты из бусин', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596193, 'Мужские Кожаные браслеты', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596195, 'Мужские Браслеты на любой вкус', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596197, 'Мужские Наборы', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596200, 'Цепочки, кулоны, подвески', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596201, 'Женский Браслеты', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596202, 'Женкские Серьги', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596203, 'Женские  колье', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24596206, 'Женские  Часы', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24987962, 'Мужские сумки из натуральной кожи', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (24987967, 'Мужские  Рюкзаки', 1, null, null);
INSERT INTO vishny00_acc.acc_categories (id, category_name, parent_id, createdAt, updatedAt) VALUES (27139923, 'Женские кольца Кольца', 1, null, null);