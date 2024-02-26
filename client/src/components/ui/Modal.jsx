import React from "react";

const Modal = ({ children, opened, close }) => {
  return (
    <div
      className={`fixed top-0 left-0 z-50 w-screen h-screen backdrop-blur-sm ${
        !opened && "hidden"
      }`}
    >
      <div
        className="w-screen h-screen bg-black opacity-80 transition-opacity
      "
        onClick={() => close()}
      ></div>
      <div className=" w-64 absolute top-1/4 left-1/2 -translate-x-1/2 p-6">
        {children}
      </div>
    </div>
  );
};

export default Modal;
