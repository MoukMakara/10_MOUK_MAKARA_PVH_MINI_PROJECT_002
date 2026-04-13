"use server";

import { baseUrl } from "../../service/constants";
import { getServerSession } from "next-auth";
export async function getCategoriesAction() {
  try {
    const session = await getServerSession();
    const token = session?.user?.accessToken;

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
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data: data.payload || [] };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createProductAction(formData) {
  try {
    const token = formData.token;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      imageUrl: formData.imageUrl,
      categoryId: formData.categoryId,
    };

    const res = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data: data.payload || data };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}
export async function updateProductAction(productId, formData) {
  try {
    const token = formData.token;

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      imageUrl: formData.imageUrl,
      categoryId: formData.categoryId,
    };

    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data: data.payload || data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(productId, token) {
  try {
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}
