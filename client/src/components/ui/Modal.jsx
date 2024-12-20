import { Fragment } from "react";
import { Transition } from "@headlessui/react";

const Modal = ({ children, opened, close }) => {
  return (
    <Transition as={Fragment} show={opened}>
      <div
        className={`fixed top-0 left-0 z-50 w-screen h-screen backdrop-blur-sm ${
          !opened && "hidden"
        }`}
      >
        <Transition.Child
          as={"div"}
          enter="ease duration-300"
          enterFrom="opacity-0 "
          enterTo="opacity-100 "
        >
          <div
            className="w-screen h-screen bg-black opacity-80"
            onClick={() => close()}
          ></div>
        </Transition.Child>

        <div className=" w-64 absolute top-1/4 left-1/2 -translate-x-1/2 p-6 ">
          {children}
        </div>
      </div>
    </Transition>
  );
};

export default Modal;
