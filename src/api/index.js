import axios from "axios";
import { APP_TOKEN } from "../utils/constants";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 50000,
});

// COMMON

const getHeaders = () => ({
  "x-access-token": localStorage.getItem(APP_TOKEN),
});

const Exception = (message) => {
  const error = new Error(message);

  error.success = false;

  return error;
};

const processError = (error) => {
  if (error?.response?.data) {
    throw Exception(error.response.data?.message);
  }

  if (error?.request) {
    throw Exception("It's not you, it's us, want to give it another try?");
  }

  throw Exception("Oops! Something went wrong.");
};

export const signup = async (payload) => {
  try {
    const response = await API.post("/users/signup", payload);
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const signin = async (payload) => {
  try {
    const response = await API.post("/users/signin", payload);
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getUserInfo = async () => {
  try {
    const response = await API.get("/users", { headers: getHeaders() });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};
