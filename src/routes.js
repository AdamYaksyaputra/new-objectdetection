// import
import Dashboard from "views/Dashboard/Dashboard";
import History from "views/Dashboard/History";
import Account from "views/Dashboard/Account";
import Profile from "views/Dashboard/Profile";
import Sensor from "views/Dashboard/Sensor";
import Reports from "views/Dashboard/Reports";
import SignIn from "views/Auth/SignIn.js";
import SignUp from "views/Auth/SignUp.js";

import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  SupportIcon,
  ClockIcon,
  BellIcon,
} from "components/Icons/Icons";



var dashRoutes = [
  {
    hide: false,
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    hide: false,
    path: "/histories",
    name: "History",
    rtlName: "لوحة القيادة",
    icon: <ClockIcon color="inherit" />,
    component: History,
    layout: "/admin",
  },
  {
    hide: false,
    path: "/reports",
    name: "Reports",
    icon: <StatsIcon color="inherit" />,
    component: Reports,
    layout: "/admin",
  },
  {
    hide: false,
    path: "/accounts",
    name: "Account",
    rtlName: "لوحة القيادة",
    icon: <PersonIcon color="inherit" />,
    component: Account,
    layout: "/admin",
  },
  {
    hide: false,
    path: "/sensors",
    name: "Sensor",
    icon: <SupportIcon color="inherit" />,
    component: Sensor,
    layout: "/admin",
  },
  {
    hide: true,
    path: "/login",
    name: "Sign In",
    rtlName: "لوحة القيادة",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/login",
  },
];
export default dashRoutes;
