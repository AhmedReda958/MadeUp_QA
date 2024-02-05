import { useSelector } from "react-redux";
import Toolbar from "./components/toolBar";
import { Outlet } from "react-router-dom";
import LoginPopup from "./components/logingPopup";

function App() {
  const app = useSelector((state) => state.app);

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
