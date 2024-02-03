import { useState } from "react";
import Toolbar from "./components/toolBar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="dark">
      <div className=" h-screen w-screen bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <Outlet />
        <Toolbar />
      </div>
    </div>
  );
}

export default App;
