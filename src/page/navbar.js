import React from "react";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm p-2 rounded">
      <div className="d-flex justify-content-between w-100">
        <button className="btn-toggle" onClick={toggleSidebar}>☰</button>
        <img src="" alt="" />
      </div>
    </nav>
  );
};

export default Navbar;
