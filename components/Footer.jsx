import React from 'react'
import logo from '/src/assets/logo.png';

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ------Left Section------ */}    
            <div>
                <img src={logo} alt="HealthConnect Logo" className='mb-5 w-40' />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            </div>
            {/* ------Center Section------ */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>Abot Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* ------Right Section------ */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600 text-sm'>
                    <li>+1-212-456-7890</li>
                    <li>healthconnect@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/*-------Copyright Section-------*/}
            <hr />
            <p className='text-center text-sm py-5'>Copyright © 2024 IOT - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer
