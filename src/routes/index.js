import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpContainer from "./signup";
import SignInContainer from "./signin";
import SignInCallbackContainer from "./signin/callback";
import SignInIdentityContainer from "./signin/identity";
import DashboardContainer from "./dashboard";
import FeedbackContainer from "./feedback";
import EmployeesContainer from "./employees";
import WorklogContainer from "./work-log";
import SettingsContainer from "./settings";
import RewardsAndRecognitionContainer from "./recognition";
import CompanyValuesContainer from "./company-values";
import AcceptInviteContainer from "./accept-invite";
import NavBar from "../components/NavBar";
import Spinner from "../components/Spinner";
import ProtectedRoute from "../components/ProtectedRoute";
import PageNotFound from "../components/PageNotFound";
import { getUserInfo } from "../api";
import { APP_TOKEN, USER_ROLES } from "../utils/constants";
import { useMergeState } from "../utils/custom-hooks";

const shouldShowNavBar = () => {
  if (window.location.pathname.includes("/accept-invite")) {
    return false;
  }

  return true;
};

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
        {state?.isLoggedIn && shouldShowNavBar() && (
          <NavBar user={state?.user} />
        )}

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

                <Route path="signin" element={<SignInContainer />} />

                <Route
                  path="signin/callback"
                  element={<SignInCallbackContainer />}
                />

                <Route
                  path="signin/identity"
                  element={
                    <SignInIdentityContainer getUserInfo={getUserInfoHandler} />
                  }
                />

                <Route
                  path="accept-invite"
                  element={
                    <AcceptInviteContainer getUserInfo={getUserInfoHandler} />
                  }
                />

                <Route
                  element={
                    <ProtectedRoute
                      isLoggedIn={state?.isLoggedIn}
                      allowedRoles={[
                        USER_ROLES.ADMIN,
                        USER_ROLES.MANAGER,
                        USER_ROLES.EMPLOYEE,
                      ]}
                      role={state?.user?.role}
                    />
                  }
                >
                  <Route
                    path="dashboard"
                    element={<DashboardContainer user={state?.user} />}
                  />

                  <Route
                    path="feedback"
                    element={<FeedbackContainer user={state?.user} />}
                  />

                  <Route
                    path="work-log"
                    element={<WorklogContainer user={state?.user} />}
                  />

                  <Route
                    path="recognition"
                    element={
                      <RewardsAndRecognitionContainer user={state?.user} />
                    }
                  />

                  <Route path="settings" element={<SettingsContainer />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      isLoggedIn={state?.isLoggedIn}
                      allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
                      role={state?.user?.role}
                    />
                  }
                >
                  <Route
                    path="employees"
                    element={<EmployeesContainer user={state?.user} />}
                  />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      isLoggedIn={state?.isLoggedIn}
                      allowedRoles={[USER_ROLES.ADMIN]}
                      role={state?.user?.role}
                    />
                  }
                >
                  <Route
                    path="company-values"
                    element={<CompanyValuesContainer />}
                  />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}
