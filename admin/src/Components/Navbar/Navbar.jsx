import React from 'react'
import './Navbar.css'
import nav_logo from '../../assets/nav_logo.svg'
import navProfile from '../../assets/nav_profile.svg'
const Navbar = () => {
  return (
    <div className='navbar'> 
      <img src={nav_logo} alt="" className='nav-logo'/>
      <img src={navProfile} alt=""  className='nav-profile' />
    </div>
  )
}

export default Navbar
