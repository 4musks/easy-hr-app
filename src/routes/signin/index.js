import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";

export default function SignInContainer() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="w-2/5">
        <Button fullWidth variant="contained" onClick={loginWithRedirect}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
