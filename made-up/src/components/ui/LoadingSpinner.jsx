import React from "react";
import { quantum } from "ldrs";

quantum.register();

// Default values shown

function LoadingSpinner() {
  return (
    <div className="text-2xl text-center mt-10">
      {/* <i className="fa fa-spinner fa-spin-pulse "></i> */}
      <l-quantum size="45" speed="1.5" color="#3b82f6"></l-quantum>
    </div>
  );
}

export default LoadingSpinner;
