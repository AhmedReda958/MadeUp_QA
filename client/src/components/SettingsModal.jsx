import { logout } from "@/redux/slices/authSlice";
import { Transition } from "@headlessui/react";
import Modal from "@/components/ui/Modal";
import { setTheme, share } from "@/redux/slices/appSlice";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SettingsModal = ({ opened = false, close = () => {} }) => {
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
export default SettingsModal;
