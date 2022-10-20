import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardContainer from "./dashboard";
import SignUpContainer from "./signup";
import SignInContainer from "./signin";
import NavBar from "../components/NavBar";
import Spinner from "../components/Spinner";
import ProtectedRoute from "../components/ProtectedRoute";
import PageNotFound from "../components/PageNotFound";
import { getUserInfo } from "../api";
import { APP_TOKEN } from "../utils/constants";
import { useMergeState } from "../utils/custom-hooks";

export default function RoutesContainer() {
  const [state, setState] = useMergeState({
    user: {},
    isLoggedIn: false,
  });

  const getUserInfoHandler = async () => {
    try {
      const response = await getUserInfo();

      if (response?.success) {
        setState({ user: { ...response.data }, isLoggedIn: true });
      }
    } catch (error) {
      localStorage.removeItem(APP_TOKEN);
      window.location.href = "/signin";
    }
  };

  const isAppLoading = localStorage.getItem(APP_TOKEN) && !state?.isLoggedIn;

  useEffect(() => {
    const asyncHandler = async () => {
      await getUserInfoHandler();
    };

    if (localStorage.getItem(APP_TOKEN)) {
      asyncHandler();
    }
  }, []);

  return (
    <div className="w-full h-screen overflow-y-auto">
      {state?.isLoggedIn && <NavBar />}

      {isAppLoading ? (
        <div className="mt-10 flex justify-center">
          <Spinner loading={isAppLoading} />
        </div>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              path="/signup"
              element={<SignUpContainer getUserInfo={getUserInfoHandler} />}
            />

            <Route
              path="/signin"
              element={<SignInContainer getUserInfo={getUserInfoHandler} />}
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isLoggedIn={state?.isLoggedIn}>
                  <DashboardContainer />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}
