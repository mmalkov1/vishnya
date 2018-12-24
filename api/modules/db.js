let Sequelize = require("sequelize");

let db = new Sequelize("vishny00_acc", "vishny00_acc", "xbv2juuf", {
  host: "vishny00.mysql.tools",
  dialect: "mysql"
});

let Orders = db.define("acc_orders", {
  number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientSurname: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientSecondName: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientPhone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  clientEmail: {
    type: Sequelize.STRING,
    allowNull: true
  },
  delType: {
    type: Sequelize.STRING,
    allowNull: true
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true
  },
  total: {
    type: Sequelize.STRING,
    allowNull: true
  },
  documentStatus: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: true
  },
  deliveryStatus: {
    type: Sequelize.STRING,
    allowNull: true
  },
  sourceOrder: {
    type: Sequelize.STRING,
    allowNull: true
  },
  declarationNumber: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  declarationRef: {
    type: Sequelize.STRING,
    allowNull: true
  }
});
let Postings = db.define("acc_postings", {
  number: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
    allowNull: true
  },
  provider: {
    type: Sequelize.STRING,
    allowNull: true
  },
  total: {
    type: Sequelize.STRING,
    allowNull: true
  },
  documentStatus: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});
let DeliveryType = db.define("acc_delivery_type", {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

let OrderProducts = db.define("acc_orderproducts", {
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  product_art: {
    type: Sequelize.STRING,
    allowNull: true
  },
  product_name: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  product_count: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  product_price: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  product_sum: {
    type: Sequelize.FLOAT,
    allowNull: true
  },
  product_orderquant: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  order_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  document_type: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  documentStatus: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

let Products = db.define("acc_products", {
  product_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  product_art: {
    type: Sequelize.STRING,
    allowNull: true
  },
  product_url: {
    type: Sequelize.STRING,
    allowNull: true
  },
  product_descr: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  product_unit: {
    type: Sequelize.STRING,
    allowNull: true
  },
  product_const: {
    type: Sequelize.DOUBLE,
    allowNull: true
  },
  product_photo: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

let Category = db.define("acc_category", {
  category_name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  parent_id: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

let ProductStatus = db.define("acc_product_status", {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

let ProductPrice = db.define("acc_product_price", {
  price_count: {
    type: Sequelize.FLOAT,
    allowNull: true
  }
});

let PriceType = db.define("acc_price_type", {
  price_name: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

let Users = db.define("acc_users", {
  login: {
    type: Sequelize.STRING,
    allowNull: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: true
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true
  },
  role: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
});

Orders.hasMany(OrderProducts, { foreignKey: "order_id" });
Products.belongsTo(Category);
Products.belongsTo(ProductStatus);
Products.hasMany(ProductPrice);
ProductPrice.belongsTo(PriceType);

module.exports = {
  Orders,
  Postings,
  DeliveryType,
  OrderProducts,
  Products,
  ProductStatus,
  ProductPrice,
  PriceType,
  Category,
  Users,
  db
};
