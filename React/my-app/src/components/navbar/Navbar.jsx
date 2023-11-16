import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.scss';

const Navbar = () => {
  const location = useLocation();
  const [isResponsive, setIsResponsive] = useState(false);

  const toggleNavbar = () => {
    setIsResponsive(!isResponsive);
  };

  return (
    <>
      <div className={`topnav ${isResponsive ? 'responsive' : ''}`} id="myTopnav">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''} 
          onClick={() => setIsResponsive(false)}>
          Zadat atributy
        </Link>
        <Link 
          to="/dependencies" 
          className={location.pathname === '/dependencies' ? 'active' : ''} 
          onClick={() => setIsResponsive(false)}>
          Zadat závislosti
        </Link>
        <Link 
          to="/problems" 
          className={location.pathname === '/problems' ? 'active' : ''} 
          onClick={() => setIsResponsive(false)}>
          Problémy
        </Link>
        <a href="#" className="icon" onClick={toggleNavbar}>
          <i className="fa fa-bars"></i>
        </a>
      </div>
    </>
  );
};

export default Navbar;
