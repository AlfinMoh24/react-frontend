import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className={`bg-white shadow-sm ${isOpen ? "" : "hidden"}`} id="sidebar">
      <div className="py-4 px-2">
        <h5 className="px-2 ms-2">AdminPerumahan</h5>
        <ul className="list-unstyled list-sidebar mt-4">
          <li 
            className={location.pathname === "/" ? "active" : ""} 
            onClick={() => navigate("/")}
          >
            <i className="fa-solid fa-gauge"></i> Dashboard
          </li>
          <li 
            className={location.pathname === "/penghuni" ? "active" : ""} 
            onClick={() => navigate("/penghuni")}
          >
            <i className="fa-solid fa-user"></i> Penghuni
          </li>
          <li 
            className={location.pathname === "/rumah" ? "active" : ""} 
            onClick={() => navigate("/rumah")}
          >
            <i className="fa-solid fa-house"></i> Rumah
          </li>
          <li 
            className={location.pathname === "/pembayaran" ? "active" : ""} 
            onClick={() => navigate("/pembayaran")}
          >
            <i className="fa-regular fa-credit-card"></i> Pembayaran
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
