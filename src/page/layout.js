import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar isOpen={isSidebarOpen} />
      <div id="page-content-wrapper">
        <Navbar toggleSidebar={toggleSidebar} />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
