import React from "react";
import CircularProgress from "@mui/material/CircularProgress"; // Menggunakan Material-UI CircularProgress sebagai loader

const CircleLoader = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
    <CircularProgress />
  </div>
);

export default CircleLoader;
