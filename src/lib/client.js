import axios from "axios";

const client = axios.create();
client.defaults.baseURL = "api";
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
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem(
          "elcamino_client_refresh_token"
        );
        const response = await refreshToken({
          refresh_token,
        });
        const { access_token, refresh_token: new_refresh_token } =
          response.data;
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
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("elcamino_client_access_token");
        localStorage.removeItem("elcamino_client_refresh_token");
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
);

export const refreshToken = (body) => client.post("auth", body);
export const postLogin = (body) => client.post("auth/login", body);
export const getUser = () => client.get("user/info");
export const getDeliveries = ({ invoiceCode, date }) =>
  client.get(`user/deliveries/${invoiceCode}/${date}`);
