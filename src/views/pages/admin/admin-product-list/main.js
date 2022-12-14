import { elementCreater } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';
import productService from '/public/scripts/productService.js';

const $admin_product_wapper = document.querySelector('.admin_product_wapper');
const $products = document.querySelector('.products');

const getCategoryTitleFromId = (products, categories) => {
  const titleMap = {};

  categories.forEach((category) => {
    titleMap[category._id] = category.title;
  });

  products.products.forEach((product) => {
    product.categoryTitle = titleMap[product.categoryId];
  });

  return products;
};

const productDetail = (product) => {
  const productId = product.parentNode.parentNode.getAttribute('data-key');
  sessionStorage.setItem('p_id', productId);
  window.location.href = '/admin/product/detail';
};

const clickEventMap = {
  detail_bnt: productDetail,
  back_admin_main_bnt: () => (location.href = '/admin'),
  create_product_bnt: () => (location.href = '/admin/product/adder'),
};

$admin_product_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

const pageRender = async () => {
  const responseProducts = await productService.getAllProducts();
  const responseCategorise = await categoryService.getAllCategories();
  const products = getCategoryTitleFromId(responseProducts, responseCategorise);

  products.products.forEach((product) => {
    const { _id, title, categoryTitle, shortDescription, manufacturer, price } =
      product;

    const html_temp = `
      <div class='product_item' data-key=${_id}>
        <div>
          <span>${title}</span>
        </div>
        <div>
          <span>${categoryTitle}</span>
        </div>
        <div>
          <span>${shortDescription}</span>
        </div>
        <div>
          <span>${manufacturer}</span>
        </div>
        <div>
          <span>${price}</span>
        </div>
        <div>
          <button class='detail_bnt'>상세</button>
        </div>
      </div>
    `;

    elementCreater($products, html_temp);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
