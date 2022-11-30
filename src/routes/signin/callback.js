import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "components/Spinner";
import { signin } from "../../api";

export default function SignInCallbackContainer() {
  const { isLoading, user, logout } = useAuth0();

  const { enqueueSnackbar } = useSnackbar();

  const handleSignIn = async () => {
    if (user?.email) {
      const payload = {
        email: user?.email,
      };

      const response = await signin(payload);

      if (response?.success) {
        window.location.href = `http://${response?.data?.subdomain}.${process.env.REACT_APP_APP_DOMAIN}/signin/identity?token=${response?.data?.token}`;
      } else {
        enqueueSnackbar(response?.message, { variant: "error" });
        logout({
          returnTo: process.env.REACT_APP_APP_BASE_URL,
        });
      }
    }
  };

  useEffect(() => {
    handleSignIn();
  }, [user]);

  return (
    <div>
      {isLoading && (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={isLoading} />
        </div>
      )}
    </div>
  );
}
