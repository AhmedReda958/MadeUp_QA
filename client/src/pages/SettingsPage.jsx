import Page from "@/components/ui/Page";
import React from "react";
import ProfilePic from "@/components/ProfilePic";
import { useSelector } from "react-redux";
import {
  InboxArrowDownIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const settingsList = [
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
    title: "Personal information",
    desc: "your name, user name and bio",
    icon: <UserIcon />,
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

const SettingsPage = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <Page title={"Settings"} className="z-50">
      <div className="flex items-center flex-col">
        <ProfilePic data={userInfo} className="w-24 h-24 shadow " />
        <h3 className="mt-1 text-lg text-altcolor font-bold">
          {userInfo.fullName}
        </h3>
      </div>
      <div className="mt-3 py-2">
        {settingsList.map((item, index) => (
          <div
            key={index}
            className="flex items-center  ps-2 pe-4 py-3 mb-3 rounded-xl bg-altcolor shadow cursor-pointer  hover:opacity-90 "
          >
            <div className="px-2 me-1 *:w-8 *:h-8 text-altcolor">
              {item.icon}
            </div>
            <div className="w-full flex justify-between items-center">
              <div>
                <h4 className="text-altcolor">{item.title}</h4>
                <p className="text-sm">{item.desc}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
};

export default SettingsPage;
