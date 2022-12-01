import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from "components/Spinner";
import { signin } from "../../api";
import { useMergeState } from "utils/custom-hooks";

export default function SignInCallbackContainer() {
  const { user, logout } = useAuth0();

  const { enqueueSnackbar } = useSnackbar();

  const [state, setState] = useMergeState({
    isLoading: false,
  });

  const handleSignIn = async () => {
    setState({ isLoading: true });

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

    setState({ isLoading: false });
  };

  useEffect(() => {
    handleSignIn();
  }, [user]);

  return (
    <div>
      {state?.isLoading && (
        <div className="mt-10 w-full h-screen flex justify-center">
          <Spinner loading={state?.isLoading} />
        </div>
      )}
    </div>
  );
}
