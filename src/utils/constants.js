import DashboardIcon from "@mui/icons-material/Dashboard";
import CampaignIcon from "@mui/icons-material/Campaign";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import SettingsIcon from "@mui/icons-material/Settings";

export const APP_TOKEN = "APP_TOKEN";

export const NAVS = {
  TOP_NAVS: [
    {
      id: "1",
      title: "Dashboard",
      iconComponent: DashboardIcon,
      route: "/dashboard",
      innerNavs: [
        {
          id: "2",
          title: "Overview",
          route: "/overview",
        },
        {
          id: "3",
          title: "Activity",
          route: "/activity",
        },
      ],
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
      title: "Settings",
      iconComponent: SettingsIcon,
      route: "/settings",
      innerNavs: [],
      shouldShow: true,
    },
  ],
};

export const USER_ROLES = {
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};
