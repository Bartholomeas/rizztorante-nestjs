import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  vus: 10,
  // duration: "5m",
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(99)<400"],
  },
  stages: [
    // stress
    { duration: "30s", target: 50 },
    { duration: "15s", target: 100 },
    { duration: "15s", target: 200 },
    { duration: "15s", target: 300 },
    { duration: "1m", target: 350 },
    { duration: "30s", target: 30 },

    // warmup
    { duration: "30s", target: 80 },

    // spike
    { duration: "20s", target: 250 },
    { duration: "20s", target: 500 },
    { duration: "10s", target: 500 },
    { duration: "1m", target: 100 },
    // spike cooldown

    { duration: "30s", target: 0 },
  ],
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3002/api/v1";

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

  return JSON.parse(getCartRes.body);
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

const checkoutCart = (requestOptions) => {
  const checkoutRes = http.post(
    `${BASE_URL}/checkout`,
    JSON.stringify({
      firstName: "TestFirstanme",
      lastName: "TestLastName",
      street: "string",
      houseNumber: "string",
      city: "string",
      zipCode: "00-000",
      phoneNumber: "+48123456789",
      deliveryInstructions: "string",
      tableNumber: 0,
      pickupType: "OnSite",
      paymentType: "Online",
    }),
    requestOptions,
  );

  check(checkoutRes, {
    "checkout successful": (r) => r.status === 201,
    "checkout duration was <=1500ms": (r) => r.timings.duration <= 1500,
  });
};

export default function () {
  const jar = http.cookieJar();
  const requestOptions = {
    headers,
    jar,
    credentials: "include",
  };

  loginGuest(requestOptions);

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

  const cart = getCart(requestOptions);
  getCheckoutPickupOptions(requestOptions);
  getPaymentOptions(requestOptions);

  if (cart?.total > 0) checkoutCart(requestOptions);
}
