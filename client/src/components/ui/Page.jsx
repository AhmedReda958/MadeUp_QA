import { Link } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";

const Header = ({ title, children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    const main = document.querySelector("#main-app");

    const onScroll = () => {
      let lastScroll = 0;
      main.addEventListener("scroll", () => {
        let currentScroll = main.scrollTop;

        if (currentScroll > lastScroll) {
          setIsSticky(false);
          setIsShown(false);
        } else if (currentScroll < 100) {
          setIsSticky(false);
        } else if (currentScroll < 450) {
          setIsShown(true);
        } else {
          setIsSticky(true);
          setIsShown(true);
        }
        lastScroll = currentScroll;
      });
    };

    onScroll();

    return () => {
      main.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Transition
      show={isShown}
      as={Fragment}
      enter="ease duration-[.4s]"
      enterFrom=" -translate-y-64"
      enterTo=" translate-y-0"
      leave="ease duration-[.4s]"
      leaveFrom="-translate-y-64 "
      leaveTo="translate-y-0  "
    >
      <div
        className={` contianer w-full z-20 bg-maincolor mb-3 ${
          isSticky && "fixed top-0 left-0 py-0 mb-0"
        }`}
      >
        <div
          className={`flex justify-between items-center h-12 ${
            isSticky &&
            "m-auto  w-full h-16 px-5 max-w-[768px] drop-shadow-sm bg-maincolor"
          }`}
        >
          <div className="flex items-center">
            <h1 className="font-bold text-2xl font-logo text-black dark:text-white ps-1">
              MadeUp
            </h1>
            <h2 className="ms-5 border-s-2 border-body-alt ps-3 text-lg">
              {title}
            </h2>
          </div>
          {/* back link */}

          {children ? (
            children
          ) : (
            <Link
              to={-1}
              className="pt-1 pe-3 cursor-pointer transition-all hover:text-primary duration-100 ease-in-out"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </Link>
          )}
        </div>
      </div>
    </Transition>
  );
};

const Page = (props) => {
  const { title, children, className, loading = false, header = true } = props;

  // component animations
  const [animate, setAnimate] = useState(false);
  useEffect(() => setAnimate(true), []);

  return (
    <div className={`${className}`}>
      {header && <Header title={title} />}
      <Transition
        as={"div"}
        show={animate}
        enter="transform transition duration-[.4s] ease-out"
        enterFrom="opacity-0 "
        enterTo="opacity-100 "
      >
        <div className="px-30">{!loading ? children : <LoadingSpinner />}</div>
      </Transition>
    </div>
  );
};

Page.Header = Header;
export default Page;
