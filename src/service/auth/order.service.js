import { baseUrl } from "../constants";

export const createOrderService = async (orderDetailRequests, token) => {
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      body: JSON.stringify({ orderDetailRequests }),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (e) {
    console.error("Order service error:", e);
    throw e;
  }
};

export const getOrdersService = async (token) => {
  try {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return { status: res.status, data };
  } catch (e) {
    console.error("Get orders service error:", e);
    throw e;
  }
};
