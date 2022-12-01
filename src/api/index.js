import axios from "axios";
import { APP_TOKEN } from "../utils/constants";
import { getSubdomain } from "../utils/common";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 50000,
});

// COMMON

const getHeaders = () => ({
  "x-access-token": localStorage.getItem(APP_TOKEN),
  "x-subdomain": getSubdomain(),
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
    const response = await API.get("/users/info", { headers: getHeaders() });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getUsers = async (params) => {
  try {
    const response = await API.get("/users", { params, headers: getHeaders() });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateProfile = async (payload) => {
  try {
    const response = await API.put("/users/profile", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const triggerInvite = async (payload) => {
  try {
    const response = await API.post("/users/invite", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const acceptInvite = async (payload) => {
  try {
    const response = await API.post("/users/accept-invite", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getFeedback = async () => {
  try {
    const response = await API.get("/feedback", {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const createFeedback = async (payload) => {
  try {
    const response = await API.post("/feedback", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateFeedback = async (payload) => {
  try {
    const response = await API.put("/feedback", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const deleteFeedback = async (params) => {
  try {
    const response = await API.delete("/feedback", {
      params,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getStats = async () => {
  try {
    const response = await API.get("/stats", {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getWorklog = async () => {
  try {
    const response = await API.get("/worklog", {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const createWorklog = async (payload) => {
  try {
    const response = await API.post("/worklog", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateWorklog = async (payload) => {
  try {
    const response = await API.put("/worklog", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const deleteWorklog = async (params) => {
  try {
    const response = await API.delete("/worklog", {
      params,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getCompanyValues = async () => {
  try {
    const response = await API.get("/company-values", {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const addCompanyValue = async (payload) => {
  try {
    const response = await API.post("/company-values", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateCompanyValue = async (payload) => {
  try {
    const response = await API.put("/company-values", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const deleteCompanyValue = async (params) => {
  try {
    const response = await API.delete("/company-values", {
      params,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const getRecognition = async () => {
  try {
    const response = await API.get("/recognition", {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const addRecognition = async (payload) => {
  try {
    const response = await API.post("/recognition", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const updateRecognition = async (payload) => {
  try {
    const response = await API.put("/recognition", payload, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};

export const deleteRecognition = async (params) => {
  try {
    const response = await API.delete("/recognition", {
      params,
      headers: getHeaders(),
    });
    return response?.data;
  } catch (error) {
    return processError(error);
  }
};
