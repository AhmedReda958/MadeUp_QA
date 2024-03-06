import { useSelector, useDispatch } from "react-redux";
import Toolbar from "./components/Toolbar";
import { Outlet } from "react-router-dom";
import { useGetUserDetailsQuery } from "@/redux/services/authServices";
import { useEffect } from "react";
import { setCredentials } from "./redux/slices/authSlice";

function App() {
  const app = useSelector((state) => state.app);
  const logedin = useSelector((state) => state.auth.logedin);
  const dispatch = useDispatch();
  // automatically authenticate user if token is found
  const autoAuth =
    logedin &
    useGetUserDetailsQuery("userDetails", {
      // perform a refetch every 15mins
      pollingInterval: 900000,
    });
  const { data, isFetching } = autoAuth;

  useEffect(() => {
    if (data) dispatch(setCredentials(data));
  }, [data, dispatch]);
  return (
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <div className="font-body min-h-screen min-w-screen  bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto p-4 px-5 md-7 overflow-y-auto scroll-smooth">
          <Outlet />
        </main>
        <Toolbar />
      </div>
    </div>
  );
}

export default App;
