import { baseUrl } from "../constants";

export const registerService = async (user) => {
  try {
    const res = await fetch(`${baseUrl}/auths/register`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
