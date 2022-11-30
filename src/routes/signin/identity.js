import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { APP_TOKEN } from "../../utils/constants";

export default function SignInIdentityContainer(props) {
  const { getUserInfo } = props;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const init = async () => {
    localStorage.setItem(APP_TOKEN, token);

    await getUserInfo();

    navigate("/dashboard");
  };

  useEffect(() => {
    init();
  }, []);

  return null;
}
