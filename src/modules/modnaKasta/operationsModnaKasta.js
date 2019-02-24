import { findCollection } from "../../services/apiAccounting";
import { updateAllProducts } from "../../services/apiCasta";

export const updateProductsInModnaKasta = async (collection, counts) => {
  const getProductQuantity = id => {
    return counts
      .filter(el => el.product_id == id && el.documentStatus === 1)
      .reduce((acc, item) => acc + item.product_count, 0);
  };
  await findCollection(collection)
    .then(res => {
      const productsArray = [];

      res.data.map(el => {
        if (el.isProductModnaKasta === 1) {
          productsArray.push({
            code: el.product_art,
            color: el.color,
            size: el.size,
            brand: el.brand,
            stock: getProductQuantity(el.id)
          });
        }
      });
      return productsArray;
    })
    .then(data => {
      updateAllProducts(data);
      return data;
    })
    .catch(err => console.log("Ошибка обновления товаров в ModnaKasta" + err));
  return;
};
