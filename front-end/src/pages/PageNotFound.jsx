import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link } from "react-router-dom";
import { Button, Illustration } from "../components";

const PageNotFound = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="p-10 w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0">
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center">
        <p className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wider text-gray-300">
          404
        </p>
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-gray-300 mt-2">
          Page Not Found
        </p>
        <p className="text-lg md:text-xl lg:text-xl text-gray-500 my-12">
          Sorry, the page you are looking for could not be found.
        </p>
        <Link to="/" className="flex items-center justify-center w-80">
          <Button
            type="submit"
            color="white"
            bgColor={currentColor}
            borderRadius="10px"
            fullWidth
          >
            Go Back
          </Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          ></svg>
        </Link>
      </div>
      <div className="w-1/2 lg:h-full flex lg:items-end justify-center p-4">
        <Illustration />
      </div>
    </div>
  );
};

export default PageNotFound;
