"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContainerConfig = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={600} 
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark" // Matches your app's theme
    />
  );
};

export default ToastContainerConfig;