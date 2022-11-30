import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import DiamondIcon from "@mui/icons-material/Diamond";
import SettingsIcon from "@mui/icons-material/Settings";
import { useMergeState } from "../../utils/custom-hooks";
import { APP_TOKEN, USER_ROLES } from "../../utils/constants";

const NAVS = [
  {
    id: "1",
    title: "Dashboard",
    iconComponent: DashboardIcon,
    route: "/dashboard",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "4",
    title: "Feedback",
    iconComponent: CampaignIcon,
    route: "/feedback",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "5",
    title: "Employees",
    iconComponent: PeopleAltIcon,
    route: "/employees",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "6",
    title: "Worklog",
    iconComponent: GroupWorkIcon,
    route: "/work-log",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "7",
    title: "Company Values",
    iconComponent: DiamondIcon,
    route: "/company-values",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "8",
    title: "Recognition",
    iconComponent: WorkspacePremiumIcon,
    route: "/recognition",
    innerNavs: [],
    shouldShow: true,
  },
  {
    id: "9",
    title: "Settings",
    iconComponent: SettingsIcon,
    route: "/settings",
    innerNavs: [],
    shouldShow: true,
  },
];

export default function NavBar(props) {
  const { user } = props;

  const { logout } = useAuth0();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [state, setState] = useMergeState({
    navs: NAVS,
    selectedNav: NAVS[0],
    selectedInnerNav: NAVS[0].innerNavs[0],
    profileMenuAnchorEl: null,
    shouldShowSelectCountryDialog: false,
  });

  const handleNavChange = (nav) => {
    setState({ selectedNav: nav, selectedInnerNav: nav.innerNavs[0] });

    if (nav.innerNavs[0]) {
      navigate(`${nav.route}${nav.innerNavs[0].route}`);
    } else {
      navigate(`${nav.route}`);
    }
  };

  const handleInnerNavChange = (innerNav) => {
    setState({ selectedInnerNav: innerNav });
    navigate(`${state.selectedNav.route}${innerNav.route}`);
  };

  const handleOpenProfileMenu = (event) => {
    setState({ profileMenuAnchorEl: event.currentTarget });
  };

  const handleCloseProfileMenu = () => {
    setState({ profileMenuAnchorEl: null });
  };

  const handleLogout = () => {
    handleCloseProfileMenu();
    localStorage.removeItem(APP_TOKEN);

    logout({
      returnTo: process.env.REACT_APP_APP_BASE_URL,
    });
  };

  useEffect(() => {
    const mainNav = pathname.split("/")[1];
    const nestedNav = pathname.split("/")[2];

    const topNav = state?.navs.find((elem) => elem.route === `/${mainNav}`);

    if (topNav?.route) {
      setState({ selectedNav: topNav });

      if (nestedNav) {
        const innerNav = topNav?.innerNavs.find(
          (elem) => elem.route === `/${nestedNav}`
        );

        if (innerNav?.route) {
          setState({ selectedInnerNav: innerNav });
        }
      }
    }
  }, [pathname]);

  useEffect(() => {
    const navs = NAVS;

    if (user?.role === USER_ROLES.EMPLOYEE) {
      navs.splice(
        navs.findIndex((elem) => elem.id === "5"),
        1
      );
    }

    if (
      user?.role === USER_ROLES.MANAGER ||
      user?.role === USER_ROLES.EMPLOYEE
    ) {
      navs.splice(
        navs.findIndex((elem) => elem.id === "7"),
        1
      );
    }

    setState({
      navs,
    });
  }, []);

  return (
    <div className="w-1/4 flex">
      <div className="w-20 h-screen border-r border-gray-200 flex flex-col justify-between">
        <div className="my-6 text-center text-sm font-semibold">Easy HR</div>

        <div className="flex flex-col items-center">
          {state.navs.map((nav) => (
            <div
              key={nav.id}
              className={`w-full h-full flex justify-center mb-4  ${
                state.selectedNav?.id === nav.id
                  ? "bg-gray-200 border-r-2 border-primary"
                  : ""
              }`}
            >
              <Tooltip title={nav.title} placement="right">
                {nav?.iconComponent && (
                  <IconButton onClick={() => handleNavChange(nav)}>
                    <nav.iconComponent />
                  </IconButton>
                )}
              </Tooltip>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-4">
          <IconButton onClick={handleOpenProfileMenu} size="small">
            <Avatar alt={user?.firstName} src={user?.profile?.avatar} />
          </IconButton>

          <Menu
            anchorEl={state.profileMenuAnchorEl}
            open={Boolean(state.profileMenuAnchorEl)}
            onClose={handleCloseProfileMenu}
            transformOrigin={{ horizontal: "left", vertical: "top" }}
            anchorOrigin={{ horizontal: "left", vertical: "top" }}
          >
            <MenuItem disabled>
              {user?.firstName} {user?.lastName}
            </MenuItem>

            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>

      <div className="w-full h-screen border-r border-gray-200 flex flex-col justify-between items-center">
        <div className="pt-4 w-5/6">
          <div className="flex text-2xl font-semibold">
            {state.selectedNav?.title}
          </div>

          <div className="mt-8 flex flex-col">
            {state.selectedNav?.innerNavs.map((innerNav) => (
              <div
                key={innerNav.id}
                className={`w-full h-full flex mb-4 text-gray-500 ${
                  state.selectedInnerNav?.id === innerNav.id
                    ? "text-gray-900 font-semibold"
                    : ""
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleInnerNavChange(innerNav)}
                >
                  {innerNav.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
