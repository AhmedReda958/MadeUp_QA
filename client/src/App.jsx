import { useSelector, useDispatch } from "react-redux";
import Toolbar from "./components/Toolbar";
import { Outlet } from "react-router-dom";
import LoginPopup from "./components/logingPopup";
import { useGetUserDetailsQuery } from "@/redux/services/authServices";
import { useEffect } from "react";
import { setCredentials } from "./redux/slices/authSlice";

function App() {
  const app = useSelector((state) => state.app);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  // automatically authenticate user if token is found
  const autoAuth = useGetUserDetailsQuery("userDetails", {
    // perform a refetch every 15mins
    pollingInterval: 900000,
  });
  const { data, isFetching } = autoAuth;

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);
  return (
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <div className=" min-h-screen min-w-screen no-scrollbar bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main className="container w-full mx-auto p-4 px-5 md-7 overflow-y-auto">
          <Outlet />
        </main>
        <Toolbar />
        <LoginPopup IsOpened={true} />
      </div>
    </div>
  );
}

export default App;
