import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.png';


const NavBar = () => {

  const navigate = useNavigate();

  const[showMenu, setShowMenu] = useState(false)
  const[token, setToken] = useState(true)

  return (
    <div className='flex items-center justify-between px-3 py-4 shadow-sm bg-white'>
      <div className='flex items-center gap-2'>
        <img onClick={()=>navigate('/')} src={logo} alt="HealthConnect Logo" className='h-10 w-auto' />
      </div>
         <ul className='flex items-center gap-4 font-bold text-xs'>
        <NavLink to="/" className={({ isActive }) => 
          isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"
        }>
          <li>HOME</li>
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => 
          isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"
        }>
          <li>ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => 
          isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"
        }>
          <li>ABOUT</li>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => 
          isActive ? "text-[#4361ee]" : "hover:text-[#4361ee]"
        }>
          <li>CONTACT</li>
        </NavLink>
      </ul>
      <div className='flex items-center gap-4'>
        {
          token
          ? <div className='relative group flex items-center cursor-pointer'>
              <div className='flex items-center'>
                <img src={'/src/assets/profile_pic.png'} alt="profile pic" className='h-6 w-6 rounded-full object-cover' />
                <img src={'/src/assets/dropdown_icon.svg'} alt="dropdown" className='h-4 w-4' />
              </div>
              <div className='absolute top-full right-0 bg-white shadow-md rounded-md p-2 z-50 min-w-[180px] hidden group-hover:block'>
                <p onClick={()=>navigate('my-profile')} className='block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded cursor-pointer text-left transition-colors'>My Profile</p>
                <p onClick={()=>navigate('my-appointments')} className='block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded cursor-pointer text-left transition-colors'>My Appointments</p>
                <p onClick={()=>setToken(false)} className='block w-full py-2 px-4 hover:text-[#4361ee] hover:bg-gray-100 rounded cursor-pointer text-left transition-colors'>Logout</p>
              </div>
          </div>
          :<button onClick={()=>navigate('/login')} className='px-6 py-2.5 bg-[#4361ee] text-white rounded-full font-medium hover:bg-[#3651d4] transition-colors hidden md:block'>
             Create Account
        </button>
        }  
      </div>
    </div>
  )
}

export default NavBar
