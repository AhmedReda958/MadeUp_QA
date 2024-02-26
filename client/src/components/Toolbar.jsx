import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openLoginPopup } from "@/redux/slices/appSlice";
import { useEffect } from "react";

const iconClasses = "far";
const activeClasses = "text-primary";
const pendingClasses = "pending";

const Toolbar = () => {
  const { userInfo, logedin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  let username = userInfo.username;
  const links = [
    { to: "/", icon: "fa-compass" },
    { to: "/notification", icon: "fa-bell" },
    { to: "/messages", icon: "fa-envelope" },
    { to: `/${username}`, icon: "fa-user" },
  ];

  useEffect(() => {
    username = userInfo.username;
  }, [logedin]);

  return (
    <div className=" fixed z-30 bottom-0 left-0 w-full pt-4 px-6 pb-5 drop-shadow-4xl ">
      <div className=" relative bg-dark dark:bg-gray-300 text-white dark:text-dark  max-w-96 m-auto h-14 text-xl rounded-t-[20px] rounded-b-[30px] flex items-center justify-around px-4">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            onClick={(e) => {
              if (!logedin) {
                e.preventDefault();
                dispatch(openLoginPopup());
              }
            }}
            className={({ isActive, isPending }) =>
              isPending ? pendingClasses : isActive ? activeClasses : ""
            }
          >
            <i className={`${iconClasses} ${link.icon}`}></i>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
