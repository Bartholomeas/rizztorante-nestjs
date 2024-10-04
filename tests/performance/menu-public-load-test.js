import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 20,
  duration: "5s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(99)<200"],
  },
};

const BASE_URL = "http://localhost:3002/api/v1";

const headers = {
  "Content-Type": "application/json",
};

const getMenus = (requestOptions) => {
  const menusRes = http.get(`${BASE_URL}/menus`, requestOptions);
  check(menusRes, {
    "menus status was 200": (r) => r.status === 200,
    "menus duration was <=200ms": (r) => r.timings.duration <= 200,
    "menus response is array": (r) => Array.isArray(JSON.parse(r.body)),
  });
  sleep(1);
  return JSON.parse(menusRes.body);
};

const getCategories = (menuId, requestOptions) => {
  const categoriesRes = http.get(`${BASE_URL}/menus/${menuId}/categories`, requestOptions);
  check(categoriesRes, {
    "categories status was 200": (r) => r.status === 200,
    "categories duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
  return JSON.parse(categoriesRes.body);
};

const getPositions = (categoryId, requestOptions) => {
  const positionsRes = http.get(
    `${BASE_URL}/menus/categories/${categoryId}/positions`,
    requestOptions,
  );
  check(positionsRes, {
    "positions status was 200": (r) => r.status === 200,
    "positions duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
  return JSON.parse(positionsRes.body);
};

const addItemToCart = (menuPositionId, requestOptions) => {
  const addItemRes = http.post(
    `${BASE_URL}/cart/item`,
    JSON.stringify({ menuPositionId, quantity: 1 }),
    requestOptions,
  );
  const success = check(addItemRes, {
    "add item status was 201": (r) => r.status === 201,
    "add item duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
  return success ? JSON.parse(addItemRes.body) : null;
};

const changeItemQuantity = (itemId, quantity, requestOptions) => {
  const changeQuantityRes = http.put(
    `${BASE_URL}/cart/item/${itemId}`,
    JSON.stringify({ quantity }),
    requestOptions,
  );

  const success = check(changeQuantityRes, {
    "change quantity status was 200": (r) => r.status === 200,
    "change quantity duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
  return success;
};

const removeItemFromCart = (itemId, requestOptions) => {
  const removeItemRes = http.del(`${BASE_URL}/cart/item/${itemId}`, null, requestOptions);
  const success = check(removeItemRes, {
    "remove item status was 200": (r) => r.status === 200,
    "remove item duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
  return success;
};

const getCart = (requestOptions) => {
  const getCartRes = http.get(`${BASE_URL}/cart`, requestOptions);
  check(getCartRes, {
    "get cart status was 200": (r) => r.status === 200,
    "get cart duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
};

const getCheckoutPickupOptions = (requestOptions) => {
  const getPickupOptionsRes = http.get(`${BASE_URL}/checkout/pickup`, requestOptions);
  check(getPickupOptionsRes, {
    "get pickup options status was 200": (r) => r.status === 200,
    "get pickup options duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
};

const getPaymentOptions = (requestOptions) => {
  const getPaymentOptionsRes = http.get(`${BASE_URL}/checkout/payment`, requestOptions);
  check(getPaymentOptionsRes, {
    "get payment options status was 200": (r) => r.status === 200,
    "get payment options duration was <=200ms": (r) => r.timings.duration <= 200,
  });
  sleep(1);
};

const loginGuest = (requestOptions) => {
  const loginRes = http.post(`${BASE_URL}/auth/login-guest`, null, requestOptions);
  const success = check(loginRes, {
    "login successful": (r) => r.status === 201,
  });
  sleep(1);
  return success;
};

export default function () {
  const jar = http.cookieJar();
  const requestOptions = {
    headers,
    jar,
    credentials: "include",
  };

  if (!loginGuest(requestOptions)) {
    console.log("Guest login failed, skipping iteration");
    return;
  }

  const menus = getMenus(requestOptions);
  if (menus?.length > 0) {
    const randomMenu = menus[Math.floor(Math.random() * menus.length)];
    const categories = getCategories(randomMenu.id, requestOptions);

    if (categories?.length > 0) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const positions = getPositions(randomCategory.id, requestOptions);

      if (positions?.length > 0) {
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        const [addedItem] = addItemToCart(randomPosition.id, requestOptions);
        console.log("ADDED ITEM TO JEST: ", addedItem);
        if (addedItem) {
          const newQuantity = Math.floor(Math.random() * 5) + 1;
          if (changeItemQuantity(addedItem.id, newQuantity, requestOptions)) {
            console.log(`Changed quantity to ${newQuantity}`);
          }
          if (Math.random() < 0.5) {
            if (removeItemFromCart(addedItem.id, requestOptions)) {
              console.log("Removed item from cart");
            }
          }
        }
      }
    }
  }

  getCart(requestOptions);
  getCheckoutPickupOptions(requestOptions);
  getPaymentOptions(requestOptions);
}
