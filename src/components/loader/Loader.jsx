import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="border-t-4 border-blue-600 border-solid rounded-full h-12 w-12 animate-spin"></div>
    </div>
  );
};

export default Loader;
