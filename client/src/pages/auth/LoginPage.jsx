import { useState, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import useAlert from "@/utils/hooks/useAlert";
import { Link, useNavigate } from "react-router-dom";
import LoginFrom from "./LoginFrom";
import RegisterFrom from "./RegisterFrom";

const LoginPage = () => {
  const [isLoginFrom, setIsloginFrom] = useState(true);

  const app = useSelector((state) => state.app);

  const navigate = useNavigate();
  const Alert = useAlert();

  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userToken) navigate("/");
  }, []);

  useEffect(() => {
    if (error) Alert({ type: "error", title: "Wrong username or password" });
  }, [error]);

  return (
    <div className={app.isDarkTheme ? "dark" : "light"}>
      <main className="font-body min-h-screen min-w-screen  bg-dark-alt text-white bg-center bg-[url('/img/login.jpeg')] bg-cover bg-blend-multiply">
        <div className="relative container w-full h-screen no-scrollbar max-w-[768px] mx-auto md-7 overflow-y-auto scroll-smooth bg-center bg-[url('/img/login.jpeg')] bg-cover ">
          <div className=" absolute top-0 left-0 w-full h-full bg-gradient-to-tr    to-primary  from-gred-light  via-black opacity-80 mix-blend-soft-light"></div>
          <div className=" absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black "></div>

          <div className="h-full  px-10 bg-transparent backdrop-blur-[6px] backdrop-brightness-50 ">
            <header className="flex justify-between items-center py-8 mb-6">
              <h2 className="ms-5 text-2xl font-bold text-white ">
                {isLoginFrom ? "Login" : "Sign up"}
              </h2>

              <Link
                to="/"
                className="pt-1 pe-3 cursor-pointer transition-all hover:text-primary duration-100 ease-in-out"
              >
                <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </header>
            <h1 className=" font-logo text-white text-center text-5xl mb-10 pt-24">
              MadeUp
            </h1>

            {isLoginFrom ? <LoginFrom /> : <RegisterFrom />}
            <div
              className=" mt-4 text-center  block text-white cursor-pointer"
              onClick={() => setIsloginFrom(!isLoginFrom)}
            >
              {isLoginFrom ? "Create new account" : "Have an account?"}
            </div>
            <div className="text-center mt-10">
              <div className="flex items-center justify-between">
                <div className="h-[1px] w-full bg-white"></div>
                <div className=" w-80 font-display">On click sign</div>
                <div className="h-[1px] w-full bg-white"></div>
              </div>
              <div
                className="flex justify-evenly mt-4 text-3xl *:rounded-lg *:p-3 *:block *:shadow-xl *:cursor-pointer
              "
              >
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-x-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-google"></i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
