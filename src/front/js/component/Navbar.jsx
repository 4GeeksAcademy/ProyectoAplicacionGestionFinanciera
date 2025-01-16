import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsCash } from "react-icons/bs";
import { FaRegEnvelope } from "react-icons/fa";
import { IoAnalytics } from "react-icons/io5";
import { CiHome } from "react-icons/ci";
import { MdOutlineGroups } from "react-icons/md";
import { IoPersonOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { IoHelp } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";


import '/workspaces/ProyectoAplicacionGestionFinanciera/src/front/styles/Navbar.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {collapsed ? ">" : "<"}
      </button>
      <div className="sidebar-menu">
        <ul>
          <li>
            <CiHome /> <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <BsCash /> <Link to="/currency">Currency Conversion</Link>
          </li>
          <li>
            <FaRegEnvelope /> <Link to="/messages">Messages</Link>
          </li>
          <li>
            <IoAnalytics /> <Link to="/analytics">Analytics</Link>
          </li>
          <li>
            <MdOutlineGroups /> <Link to="/groups">Groups</Link>
          </li>
          <li>
            <IoPersonOutline /> <Link to="/profile">Profile</Link>
          </li>
          <li>
            <CiSettings /> <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-bottom">
        <ul>
          <li>
            <IoHelp /> <Link to="/help">Help</Link>
          </li>
          <li>
            <IoIosLogOut /> <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer">
            <span>© 2025 SafeHaven</span>
      </div>
    </div>
  );
}

