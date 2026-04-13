import { baseUrl } from "../constants";

export const getAllProductService = async (token) => {
  try {
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}/products`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${res.status}`;
      throw new Error(`API Error: ${errorMessage}`);
    }

    const data = await res.json();
    return data.payload || [];
  } catch (e) {
    console.error("Error fetching products:", e);
    return [];
  }
};

// Get All Categories
export const getAllCategoriesService = async (token) => {
  try {
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}/categories`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${res.status}`;
      throw new Error(`API Error: ${errorMessage}`);
    }

    const data = await res.json();
    return data.payload || [];
  } catch (e) {
    console.error("Error fetching categories:", e);
    return [];
  }
};

// Get Product By Id
export const getProductByIdService = async (productId, token) => {
  try {
    const headers = {
      accept: "*/*",
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "GET",
      headers,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP ${res.status}`;
      throw new Error(`API Error: ${errorMessage}`);
    }
    const data = await res.json();
    return data.payload;
  } catch (e) {
    console.error(`Error fetching product with ID ${productId}:`, e);
  }
};
