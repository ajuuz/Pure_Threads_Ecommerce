import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserRoute from "./Routeing/UserRoute.jsx";
import AdminRoute from "./Routeing/AdminRoute.jsx";

import { Toaster } from "sonner";
import { ToastContainer } from "react-toastify";


const App = () => {

  return (
    <div>
      <Router>
      <ToastContainer/>
      <Toaster position="bottom-center"  richColors/> {/* Toast container */}
        <Routes>
          <Route path="/*" element={<UserRoute/>} />
          <Route path="/admin*" element={<AdminRoute/>} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
