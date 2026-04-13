import { baseUrl } from "../../../service/constants";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json(
        { error: "Unauthorized", payload: [] },
        { status: 401 },
      );
    }

    const res = await fetch(`${baseUrl}/categories`, {
      method: "GET",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Backend API error:", errorData);
      return Response.json(
        {
          error: errorData.message || "Failed to fetch categories",
          payload: [],
        },
        { status: res.status },
      );
    }

    const data = await res.json();
    return Response.json({ payload: data.payload || [] });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: error.message, payload: [] },
      { status: 500 },
    );
  }
}
