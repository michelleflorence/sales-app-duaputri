import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const BarLoader = () => {
  return (
    <Box
      sx={{
        width: "80%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <LinearProgress />
      <p className="text-black dark:text-white">Loading...</p>
    </Box>
  );
};

export default BarLoader;
