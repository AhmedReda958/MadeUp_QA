import ProfilePic from "@/components/ProfilePic";
import Modal from "@/components/ui/Modal";
import Page from "@/components/ui/Page";
import { setTheme } from "@/redux/slices/appSlice";
import { logout } from "@/redux/slices/authSlice";
import { useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import postsImg from "@/assets/imgs/onlinefriends.svg";
import { Transition } from "@headlessui/react";
import SearchBar from "@/components/SearchBar";
import { Tooltip } from "flowbite-react";
import { copyToClipboard } from "@/utils/helpers";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const SettingsModal = ({ opened, close }) => {
  const { auth, app } = useSelector((state) => state);
  const dispatch = useDispatch();
  return (
    <Modal opened={opened} close={() => close()}>
      <div className=" grid grid-cols-2 gap-8 gap-x-12 text-white *:w-24 *:h-24 *:rounded-xl *:bg-dark *:dark:bg-dark-alt ">
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-[.2s]"
          enterFrom="opacity-0 scale-0 "
          enterTo="opacity-100 scal-100"
        >
          <div
            className="hover:opacity-80 p-3 pt-4  flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
            onClick={() => {
              dispatch(setTheme());
              // close();
            }}
          >
            {app.isDarkTheme ? (
              <>
                <i className="fa fa-sun text-3xl"></i>
                <span className="text-sm pt-2">Light</span>{" "}
              </>
            ) : (
              <>
                <i className="fa fa-moon text-3xl"></i>
                <span className="text-sm pt-2">Dark</span>{" "}
              </>
            )}
          </div>
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-[.4s]"
          enterFrom="opacity-0 scale-0 "
          enterTo="opacity-100 scal-100"
        >
          {auth.logedin ? (
            <div
              className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
              onClick={() => {
                dispatch(logout());
                setOpenSettings(false);
              }}
            >
              <i className="fa-solid fa-arrow-right-from-bracket text-3xl"></i>
              <span className="text-sm pt-2">Logout</span>
            </div>
          ) : (
            <Link
              to="/login"
              className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
            >
              <i className="fa-solid fa-door-open text-3xl"></i>
              <span className="text-sm pt-2">Login</span>
            </Link>
          )}
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-[.6s]"
          enterFrom="opacity-0 scale-0 "
          enterTo="opacity-100 scal-100"
        >
          <Link
            to={auth.logedin ? "settings" : "/login"}
            className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt"
          >
            <i className="fa-solid fa-gear text-3xl"></i>
            <span className="text-sm pt-2">Settings</span>
          </Link>
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-[.8s]"
          enterFrom="opacity-0 scale-0 "
          enterTo="opacity-100 scal-100"
        >
          <div className="hover:opacity-80 p-3 pt-4 flex items-center justify-start flex-col font-display cursor-pointer shadow-md shadow-dark-alt">
            <i className="fa-solid fa-earth-africa text-3xl"></i>
            <span className="text-sm pt-2">العربية</span>
          </div>
        </Transition.Child>
      </div>
    </Modal>
  );
};

function HomePage() {
  const [openSettigs, setOpenSettings] = useState(false);

  const auth = useSelector((state) => state.auth);

  return (
    <>
      {/* header */}
      <Page header={false}>
        <Page.Header title="Discovery">
          <div className="flex ">
            <button
              className="text-altcolor"
              onClick={() => setOpenSettings(true)}
            >
              <AdjustmentsHorizontalIcon className="w-7 h-7" />
            </button>
            {auth.logedin && (
              <Link
                to={`/${auth.userInfo.username}`}
                className="ps-4 drop-shadow-xl"
              >
                <ProfilePic
                  data={auth.userInfo}
                  className="h-10 w-10"
                  border={false}
                />
              </Link>
            )}
          </div>
        </Page.Header>
        <SettingsModal
          opened={openSettigs}
          close={() => setOpenSettings(false)}
        />
        <div className="my-6">
          <SearchBar />
        </div>
        <div>
          <img
            src={postsImg}
            className="w-[270px] m-auto mt-20 opacity-90 "
            alt=""
            draggable="false"
          />
          <div className="pt-12 ps-3 text m-auto w-80">
            <p className="text-center">
              You don't have any users you follow, to show messages in your
              timeline follow some frinds to see their answers or
            </p>
          </div>
          <div className="flex justify-center">
            <Tooltip content="Copied!" trigger="click">
              <span
                className="text-primary underline text-center w-full"
                onClick={() =>
                  copyToClipboard(window.location.href + auth.userInfo.username)
                }
              >
                Share your Account
              </span>
            </Tooltip>
          </div>
        </div>

        <button
          className="text-2xl button-lg absolute right-10 bottom-28 z-10 hidden"
          onClick={() => setOpenSettings(true)}
        >
          <i className="fa fa-bars"></i>
        </button>
      </Page>
    </>
  );
}

export default HomePage;
