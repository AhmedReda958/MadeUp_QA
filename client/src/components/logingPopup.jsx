import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  openLoginPopup,
  closeLoginPopup,
  setTheme,
} from "@/redux/slices/appSlice";
import { logout } from "@/redux/slices/userSlice";

const LoginPopup = () => {
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const userStore = useSelector((state) => state.user);

  //   useLayoutEffect(() => {
  //     session?.user && setOpened(false);
  //   });
  return (
    <div
      className={`fixed  h-full w-full z-20 ${
        !appStore.isLoginOpened && "hidden"
      }`}
    >
      <div
        className=" fixed h-full w-full top-0 left-0 bg-gray-800 opacity-50"
        onClick={() => dispatch(closeLoginPopup())}
      ></div>
      <div className="fixed bottom-0 h-2/3 w-full z-20 bg-light dark:bg-dark text-body dark:text-secondary rounded-tr-[35px] rounded-tl-[100px] pt-10 px-10">
        <h2>Login</h2>
        {appStore.logedin ? (
          <div className="">
            {" "}
            <button onClick={() => dispatch(logout())}>logout</button>{" "}
          </div>
        ) : (
          <button onClick={() => dispatch(setTheme())}>login</button>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
