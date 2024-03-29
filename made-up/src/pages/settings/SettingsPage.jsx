import Page from "@/components/ui/Page";
import React from "react";
import ProfilePic from "@/components/ProfilePic";
import { useSelector, useDispatch } from "react-redux";
import { addAlert, share } from "@/redux/slices/appSlice";
import { Link } from "react-router-dom";

import {
  InboxArrowDownIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import { CameraIcon } from "@heroicons/react/24/solid";
const settingsList = [
  {
    title: "Personal information",
    desc: "your name, user name and bio",
    icon: <UserIcon />,
    link: "/settings/info",
  },
  {
    title: "Genral",
    desc: "Account and posting details",
    icon: <AdjustmentsHorizontalIcon />,
  },
  {
    title: "Securtiy",
    desc: "Manage your security",
    icon: <ShieldCheckIcon />,
  },

  {
    title: "Login Information",
    desc: "E-mail, phone and password",
    icon: <ArrowLeftEndOnRectangleIcon />,
  },
  {
    title: "Deactivation",
    desc: "Deactivate or delete account",
    icon: <ExclamationTriangleIcon />,
  },
  {
    title: "Data transfer",
    desc: "Get data from other platfroms",
    icon: <InboxArrowDownIcon />,
  },
];

const SettingsPage = ({ history }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = (link) => history.go(link);

  const commingSoonAlert = () =>
    dispatch(
      addAlert({
        title: "Coming soon!",
        type: "comingsoon",
      })
    );

  const redirectToLink = (link = null) => {
    link ? navigate(link) : commingSoonAlert();
  };
  return (
    <Page title={"Settings"} backTo="/home" className="z-50">
      <div className="flex items-center flex-col">
        {/* edit profile pic */}
        <Link to="/settings/profilePic" className="relative pointer">
          <ProfilePic data={userInfo} className="w-24 h-24 shadow " />
          {/* edit profile pic */}
          <div>
            <CameraIcon className="w-7 h-7 text-alt bg-dark dark:bg-dark-alt  rounded-full absolute bottom-1 right-0 p-1 cursor-pointer" />
          </div>
        </Link>
        <h3 className="mt-1 text-lg text-altcolor font-bold">
          {userInfo.fullName}
        </h3>
      </div>
      <div className="mt-3 py-2">
        {settingsList.map((item, index) => (
          <Link
            key={index}
            className="flex items-center  ps-2 pe-4 py-3 mb-3 rounded-xl bg-altcolor shadow cursor-pointer  hover:opacity-90 "
            to={item.link ? item.link : "#"}
            onClick={() => !item.link && commingSoonAlert()}
          >
            <div className="px-2 me-1 *:w-8 *:h-8 text-altcolor">
              {item.icon}
            </div>
            <div className="w-full flex justify-between items-center">
              <div>
                <h4 className="text-altcolor text-sm">{item.title}</h4>
                <p className="text-sm">{item.desc}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </Page>
  );
};

export default SettingsPage;
