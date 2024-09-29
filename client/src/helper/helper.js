import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_SERVER_DOMAIN;

export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exsist...!" };
  }
}

export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't match...!" };
  }
}

export async function getUserName() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Can't find token!");
  let decode = jwtDecode(token);
  console.log(decode);
}

export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);

    let { username, email } = credentials;

    if (status === 201) {
      await axios.post("/api/sendmail", {
        username,
        userEmail: email,
        text: msg,
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post("/api/login", { username, password });

      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");

    const { data } = await axios.put("/api/updateuser", response, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update User...!" });
  }
}

export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/api/generateOTP", { params: username });

    //send mail
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });

      let text = `Your Password Recovery OTP is ${code}. Verify and Recover your Password`;
      await axios.post("/api/sendMail", {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }

    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, code },
    });

    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
}

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/resetPassword", {
      username,
      password,
    });

    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
