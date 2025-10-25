import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.png';
import { assets } from '../frontend/src/assets/assets/assets_frontend/assets';

const NavBar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.mobile-menu')) {
        setShowMenu(false);
      }
    };
    const handleEscKey = (event) => {
      if (showMenu && event.key === 'Escape') {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showMenu]);

  return (
    <div className="flex items-center justify-between px-3 py-4 shadow-sm bg-white">
      <div className="flex items-center gap-2">
        <img onClick={() => navigate('/')} src={logo} alt="HealthConnect Logo" className="h-10 w-auto cursor-pointer" />
      </div>

      <ul className="hidden md:flex items-center gap-4 font-bold text-xs">
        <NavLink to="/" className={({ isActive }) => isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"}>
          <li>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"}>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"}>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"}>
          <li>CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="relative group">
            <button className="flex items-center gap-2" aria-label="Profile menu">
              <img src="/src/assets/profile_pic.png" alt="" className="h-6 w-6 rounded-full" />
              <img src="/src/assets/dropdown_icon.svg" alt="" className="h-4 w-4" />
            </button>
            <div className="absolute top-full right-0 bg-white shadow-md rounded-md p-2 z-50 min-w-[180px] hidden group-hover:block">
              <button onClick={() => navigate('my-profile')} className="block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded">
                My Profile
              </button>
              <button onClick={() => navigate('my-appointments')} className="block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded">
                My Appointments
              </button>
              <button onClick={() => setToken(false)} className="block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')} className="px-6 py-2.5 bg-[#4361ee] text-white rounded-full font-medium hover:bg-[#3651d4] transition-colors hidden md:block">
            Create Account
          </button>
        )}

        <button onClick={() => setShowMenu(true)} className="w-6 md:hidden">
          <img src={assets.menu_icon} alt="" className="w-full h-auto" />
        </button>

        <div className={`mobile-menu md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8">
            <img src={assets.logo} alt="HealthConnect Logo" className="h-8 w-auto" />
            <button onClick={() => setShowMenu(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <img src={assets.cross_icon} alt="" className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-4">
            <NavLink to="/" className={({ isActive }) => isActive ? "block w-full py-2 text-[#4361ee]" : "block w-full py-2 hover:text-[#4361ee]"}>
              HOME
            </NavLink>
            <NavLink to="/doctors" className={({ isActive }) => isActive ? "block w-full py-2 text-[#4361ee]" : "block w-full py-2 hover:text-[#4361ee]"}>
              ALL DOCTORS
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "block w-full py-2 text-[#4361ee]" : "block w-full py-2 hover:text-[#4361ee]"}>
              ABOUT US
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "block w-full py-2 text-[#4361ee]" : "block w-full py-2 hover:text-[#4361ee]"}>
              CONTACT US
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
