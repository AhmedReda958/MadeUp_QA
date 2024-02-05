import { logout, setTheme } from "@/redux/slices/appSlice";
import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const LoginPopup = ({ IsOpened = false }) => {
  const [opened, setOpened] = useState(IsOpened);
  // const [Logedin, setLogedin] = useState(false);

  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();

  //   useLayoutEffect(() => {
  //     session?.user && setOpened(false);
  //   });

  console.log(app);
  return (
    <div className={`fixed  h-full w-full z-20 ${!opened && "hidden"}`}>
      <div
        className=" fixed h-full w-full top-0 left-0 bg-gray-800 opacity-50"
        onClick={() => setOpened(false)}
      ></div>
      <div className="fixed bottom-0 h-2/3 w-full z-20 bg-light dark:bg-dark text-body dark:text-secondary rounded-tr-[35px] rounded-tl-[100px] pt-10 px-10">
        <h2>Login</h2>
        {app.logedin ? (
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
