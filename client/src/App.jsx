import { useSelector, useDispatch } from "react-redux";
import Toolbar from "./components/Toolbar";
import { Outlet } from "react-router-dom";
import LoginPopup from "./components/logingPopup";
import { useGetUserDetailsQuery } from "@/redux/services/authServices";
import { useEffect } from "react";
import { setCredentials } from "./redux/slices/authSlice";

function App() {
  const app = useSelector((state) => state.app);
  const dispatch = useDispatch();
  // automatically authenticate user if token is found
  const { data, isFetching } = useGetUserDetailsQuery("userDetails", {
    // perform a refetch every 15mins
    pollingInterval: 900000,
  });

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);
  return (
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <div className=" h-screen w-screen bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main className="container w-full mx-auto p-4 px-5 md-7">
          <Outlet />
        </main>
        <Toolbar />
        <LoginPopup IsOpened={true} />
      </div>
    </div>
  );
}

export default App;
