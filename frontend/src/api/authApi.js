import axios from "axios";

export const loginApi = (email, password) => {
  return axios.post("http://localhost:5000/login", {
    email,
    password,
  });
};
