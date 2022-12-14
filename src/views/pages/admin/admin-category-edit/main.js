import { elementCreater, dateFormet } from '/public/scripts/util.js';
import categoryService from '/public/scripts/categoryService.js';
import adminService from '/public/scripts/adminService.js';

const $admin_category_wapper = document.querySelector('.admin_category_wapper');
const $categories = document.querySelector('.categories');

const checkObj = {};

const editCategoty = async (target) => {
  const formData = new FormData(target);
  const categoryId = target.getAttribute('id');

  const updateObj = {
    title: formData.get('category-title'),
    description: formData.get('category-description'),
  };

  await adminService.setCategoryByCategoryId(categoryId, updateObj);
  $categories.innerHTML = '';
  await pageRender();
};

const createCategory = async (target) => {
  const formData = new FormData(target);

  const createObj = {
    title: formData.get('create-category-title'),
    description: formData.get('create-category-description'),
  };

  const $title = document.querySelector('[name="create-category-title"]');
  const $description = document.querySelector(
    '[name="create-category-description"]',
  );
  $title.value = '';
  $description.value = '';

  await adminService.createCategory(createObj);

  $categories.innerHTML = '';
  await pageRender();
};

//forEach isn't wait async
const deleteCategory = async () => {
  const categoryId = Object.keys(checkObj);
  for (const id of categoryId) {
    await adminService.deleteCategoryByCategoryId(id);
    delete checkObj[id];
  }
  $categories.innerHTML = '';
  await pageRender();
};

const deleteCategoryChecker = (target) => {
  const targetId = target.parentNode.getAttribute('id');
  if (target.checked) checkObj[targetId] = target.checked;
  else delete checkObj[targetId];
};

const checkAll = (target) => {
  const $category_checked = document.querySelectorAll('.category_checked');
  $category_checked.forEach((checkbox) => {
    checkbox.checked = target.checked;
    deleteCategoryChecker(checkbox);
  });
};

//이벤트 함수
const clickEventMap = {
  selected_category_delete_bnt: deleteCategory,
  category_checked: deleteCategoryChecker,
  all_check: checkAll,
  admin_edit_complete_bnt: () => (location.href = '/admin/category/list'),
};

const submitEventMap = {
  edit_form: editCategoty,
  create_form: createCategory,
};

//이벤트 리스너
$admin_category_wapper.addEventListener('click', (e) => {
  if (!clickEventMap[e.target.className]) return;

  clickEventMap[e.target.className](e.target);
});

$admin_category_wapper.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!submitEventMap[e.target.className]) return;

  submitEventMap[e.target.className](e.target);
});

const pageRender = async () => {
  const categories = await categoryService.getAllCategories();

  categories.forEach((category) => {
    const { _id, title, description, createdAt, updatedAt } = category;
    const createDate = dateFormet(createdAt);
    const updateDate = dateFormet(updatedAt);

    const html_temp = `
      <div class="category_item">
        <form class='edit_form' id=${_id}>
          <input class='category_checked' type='checkbox'>
          <input name='category-title' value="${title}">
          <input name='category-description' value="${description}">
          <span>${createDate}</span>
          <span>${updateDate}</span>
          <button class='edit_bnt' type='submit'>수정하기</button>
        </form>
      </div>
    `;

    elementCreater($categories, html_temp);
  });
};

window.addEventListener('DOMContentLoaded', async () => {
  await pageRender();
});
