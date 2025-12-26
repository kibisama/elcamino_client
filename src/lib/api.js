import axios from "axios";

const client = axios.create();
client.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL
    : "/api";
client.defaults.timeout = 5000;
client.interceptors.request.use(
  (req) => {
    const access_token = localStorage.getItem("elcamino_client_access_token");
    if (access_token) {
      req.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return req;
  },
  (e) => Promise.reject(e)
);
client.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem(
          "elcamino_client_refresh_token"
        );
        const data = await client.post("auth", { refresh_token });
        const { access_token, refresh_token: new_refresh_token } = data;
        localStorage.setItem("elcamino_client_access_token", access_token);
        localStorage.setItem(
          "elcamino_client_refresh_token",
          new_refresh_token
        );
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("elcamino_client_access_token");
        localStorage.removeItem("elcamino_client_refresh_token");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export const post = (url, { arg }) => client.post(url, arg);
export const get = (url) => client.get(url);
export const logout = () => {
  //
  localStorage.removeItem("elcamino_client_access_token");
  localStorage.removeItem("elcamino_client_refresh_token");
  window.location.href = "/signin";
};
