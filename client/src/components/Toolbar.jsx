import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openLoginPopup } from "@/redux/slices/appSlice";

const links = [
  { to: "/", icon: "fa-compass" },
  { to: "/notification", icon: "fa-bell" },
  { to: "/messages", icon: "fa-envelope" },
  { to: "/ahmedreda958", icon: "fa-user" },
];
const iconClasses = "far";
const activeClasses = "text-alt";
const pendingClasses = "pending";

const Toolbar = () => {
  const appStore = useSelector((state) => state.app);
  const dispatch = useDispatch();

  return (
    <div className="bg-light dark:bg-dark-alt dark:text-white fixed bottom-0 left-0 w-full px-4 pt-4 pb-[5px] rounded-t-[30px]">
      <div className="bg-light-alt dark:bg-dark w-full h-12 text-xl rounded-t-[20px] rounded-b-[30px] flex items-center justify-evenly">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            onClick={(e) => {
              if (!appStore.isLogedin) {
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
