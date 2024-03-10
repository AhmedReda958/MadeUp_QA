import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const iconClasses = "far";
const activeClasses = "text-primary";
const pendingClasses = "pending";

const Toolbar = () => {
  const { userInfo, logedin } = useSelector((state) => state.auth);

  let username = userInfo.username;
  const links = [
    { to: "/", icon: "fa-compass" },
    { to: "/notification", icon: "fa-bell", count: !logedin ? 2 : null },
    { to: "/messages", icon: "fa-envelope", count: !logedin ? 3 : null },
    { to: `/${username}`, icon: "fa-user" },
  ];

  useEffect(() => {
    username = userInfo.username;
  }, [logedin]);

  return (
    <div className=" fixed z-30 bottom-0 left-0 w-full pt-4 px-6 pb-5 ">
      <div className=" relative bg-dark  dark:bg-gray-300/70 text-white dark:text-dark backdrop-blur-lg max-w-96 m-auto h-14 text-xl rounded-t-[20px] rounded-b-[30px] flex items-center justify-around px-4">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={logedin || link.to === "/" ? link.to : "/login"}
            className={({ isActive, isPending }) =>
              isPending ? pendingClasses : isActive ? activeClasses : ""
            }
          >
            <div className=" relative">
              {link.count && (
                <span className=" absolute -top-1 -right-2 rounded-full bg-primary w-4 h-4 text-xs text-white text-center">
                  {link.count}
                </span>
              )}

              <i className={`${iconClasses} ${link.icon}`}></i>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
