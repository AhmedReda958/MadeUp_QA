import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";

import useAlert from "@/utils/hooks/useAlert";
import LoginFrom from "./LoginFrom";
import RegisterFrom from "./RegisterFrom";
import { Transition } from "@headlessui/react";
import { IonPage } from "@ionic/react";

const LoginPage = () => {
  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  // login and register switch
  const [isLoginFrom, setIsloginFrom] = useState(true);

  const app = useSelector((state) => state.app);

  const navigate = () => {};
  const Alert = useAlert();

  const { logedin, loading, error, userToken } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (userToken && logedin) navigate("/");
  }, []);

  useEffect(() => {
    if (error) Alert({ type: "error", title: "Wrong username or password" });
  }, [error]);

  return (
    <IonPage>
      <Transition as={Fragment} show={animate}>
        <main className="font-body min-h-screen min-w-screen  bg-dark-alt text-white bg-center bg-[url('/img/login.jpeg')] bg-cover bg-blend-multiply">
          <div className="relative container w-full min-h-screen no-scrollbar max-w-[768px] mx-auto md-7 overflow-y-auto scroll-smooth bg-center bg-[url('/img/login.jpeg')] bg-cover ">
            <div className=" absolute top-0 left-0 w-full h-full bg-gradient-to-tr    to-primary  from-gred-light  via-black opacity-80 mix-blend-soft-light"></div>
            <div className=" absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black "></div>
            <div className="min-h-screen h-full  px-10 bg-transparent backdrop-blur-[6px] backdrop-brightness-50 ">
              <header className="flex justify-between items-center py-8 ">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                >
                  <h2 className=" text-3xl font-bold text-white ">
                    {isLoginFrom ? "Login" : "Sign up"}
                  </h2>
                </Transition.Child>

                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 -translate-x-10"
                  enterTo="opacity-100 scale-100 translate-x-0"
                >
                  <span className="font-display text-md">العربية</span>
                </Transition.Child>
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
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.6s]"
                    enterFrom="opacity-0 scale-0"
                    enterTo="opacity-100 scale-100"
                  >
                    <i className="fa-brands fa-facebook"></i>
                  </Transition.Child>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[.8s]"
                    enterFrom="opacity-0 scale-0"
                    enterTo="opacity-100 scale-100"
                  >
                    <i className="fa-brands fa-x-twitter"></i>
                  </Transition.Child>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[1s]"
                    enterFrom="opacity-0 scale-0"
                    enterTo="opacity-100 scale-100"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </Transition.Child>
                  <Transition.Child
                    as={"div"}
                    enter="ease-in-out duration-[1.2s]"
                    enterFrom="opacity-0 scale-0"
                    enterTo="opacity-100 scale-100"
                  >
                    <i className="fa-brands fa-google"></i>
                  </Transition.Child>
                </div>
              </div>
              {/* version */}
            </div>
          </div>
          <div className=" absolute bottom-2 text-center w-full text-gray-500 text-sm">
            {"Version " + import.meta.env.VITE_VERSION}
          </div>
        </main>
      </Transition>
    </IonPage>
  );
};

export default LoginPage;
