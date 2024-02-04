import { useState } from "react";
import Toolbar from "./components/toolBar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="dark">
      <div className=" h-screen w-screen bg-light text-body-alt dark:bg-dark dark:text-secondary-alt">
        <main className="container w-full mx-auto p-4 px-5 md-7">
          <Outlet />
        </main>
        <Toolbar />
      </div>
    </div>
  );
}

export default App;
