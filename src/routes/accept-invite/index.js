import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner";
import { acceptInvite } from "../../api";
import { APP_TOKEN } from "utils/constants";

const AcceptInviteContainer = (props) => {
  const { getUserInfo } = props;

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const emailToken = searchParams.get("token");

    const acceptInviteHandler = async () => {
      const response = await acceptInvite({ emailToken });

      if (response?.success) {
        localStorage.setItem(APP_TOKEN, response?.data?.token);

        await getUserInfo();

        navigate("/dashboard");
      } else {
        enqueueSnackbar(response?.message, { variant: "error" });
      }
    };

    acceptInviteHandler();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="w-full flex justify-center mt-10">
          <Spinner loading={isLoading} />
        </div>
      ) : null}
    </div>
  );
};

AcceptInviteContainer.propTypes = {
  getUserInfo: PropTypes.func.isRequired,
};

export default AcceptInviteContainer;
