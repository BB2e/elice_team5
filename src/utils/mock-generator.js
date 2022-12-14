import {
  categoryModel,
  orderModel,
  productModel,
  userModel,
  basketModel,
} from '../db';
import {
  orderMockData,
  categoryMockData,
  productMockData,
  userMockData,
} from './mock';

async function dataReset() {
  console.log('collections deleteAll...');

  await userModel.deleteAll();
  await productModel.deleteAll();
  await orderModel.deleteAll();
  await categoryModel.deleteAll();
  await basketModel.deleteAll();
}

async function dataPull() {
  console.log('data pulling...');

  const userIdList = [];
  for (const data in userMockData) {
    const { _id } = await userModel.createWithTimestamp(userMockData[data]);
    userIdList.push(_id);
  }
  const newCategories = [];
  for (const data in categoryMockData) {
    const newCategory = await categoryModel.create(categoryMockData[data]);
    newCategories.push(newCategory);
  }

  for (const data in productMockData) {
    const productMockDataTitle = productMockData[data].searchKeywords;
    let index = 0;
    for (const category in newCategories) {
      if (productMockDataTitle.includes(newCategories[category].title)) {
        index = category;
      }
    }
    await productModel.create({
      ...productMockData[data],
      sellerId: userIdList[0],
      categoryId: newCategories[index]._id,
    });
  }
  for (const data in orderMockData) {
    const randomN = Math.floor((Math.random() * 100) % (userIdList.length - 1));
    await orderModel.create({
      ...orderMockData[data],
      userId: userIdList[randomN]._id,
    });
  }
}

async function mockGenerator() {
  await dataReset();
  await dataPull();
}

export { mockGenerator };
