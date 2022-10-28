import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpContainer from "./signup";
import SignInContainer from "./signin";
import DashboardOverviewContainer from "./dashboard/overview";
import DashboardActivityContainer from "./dashboard/activity";
import FeedbackContainer from "./feedback";
import EmployeesContainer from "./employees";
import WorklogContainer from "./work-log";
import SettingsContainer from "./settings";
import NavBar from "../components/NavBar";
import Spinner from "../components/Spinner";
import ProtectedRoute from "../components/ProtectedRoute";
import PageNotFound from "../components/PageNotFound";
import { getUserInfo } from "../api";
import { APP_TOKEN, USER_ROLES } from "../utils/constants";
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
    <BrowserRouter>
      <div className="flex">
        {state?.isLoggedIn && <NavBar user={state?.user} />}

        {isAppLoading ? (
          <div className="mt-10 w-full h-screen flex justify-center">
            <Spinner loading={isAppLoading} />
          </div>
        ) : (
          <div className="p-4 w-full h-screen overflow-y-auto">
            <Routes>
              <Route path="/">
                <Route
                  path="signup"
                  element={<SignUpContainer getUserInfo={getUserInfoHandler} />}
                />

                <Route
                  path="signin"
                  element={<SignInContainer getUserInfo={getUserInfoHandler} />}
                />

                <Route
                  element={
                    <ProtectedRoute
                      isLoggedIn={state?.isLoggedIn}
                      allowedRoles={[USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE]}
                      role={state?.user?.role}
                    />
                  }
                >
                  <Route path="dashboard">
                    <Route
                      path="overview"
                      element={<DashboardOverviewContainer />}
                    />

                    <Route
                      path="activity"
                      element={<DashboardActivityContainer />}
                    />
                  </Route>

                  <Route path="feedback" element={<FeedbackContainer />} />

                  <Route path="employees" element={<EmployeesContainer />} />

                  <Route path="work-log" element={<WorklogContainer />} />

                  <Route path="settings" element={<SettingsContainer />} />
                </Route>

                <Route
                  path="/"
                  element={<Navigate to="/dashboard/overview" />}
                />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
