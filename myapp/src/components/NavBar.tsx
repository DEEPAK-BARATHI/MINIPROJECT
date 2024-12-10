import React, { useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import './navbar.css';

const NavBar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">SHORTKUT</div>
      <div className="upgrade-menu">
        {/* <button className="upgrade-button">Upgrade to Premium</button> */}
      </div>
      {/* <div className="account-menu">
        <button onClick={toggleMenu} className="account-button">
          <RiAccountCircleLine size={24} />
        </button> */}
        {/* {isMenuOpen && (
          <div className="dropdown">
            <a className="dropdown-item" href="#profile">Login/Signup</a>
            <div className="border-t my-2"></div>
            <a className="dropdown-item" href="#settings">Dark/Light</a>
            <div className="border-t my-2"></div>
            <a className="dropdown-item" href="#settings">Help</a>
            <div className="border-t my-2"></div>
            <a className="dropdown-item" href="#logout">Logout</a>
          </div>
        )} */}
      {/* </div> */}
    </nav>
  );
};

export default NavBar;
