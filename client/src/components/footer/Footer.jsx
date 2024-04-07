import React from 'react'
import logo from '../../assets/logo.png'
import { NavLink, Link } from 'react-router-dom'
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FaInstagram } from "react-icons/fa6";

import { useSelector } from 'react-redux'

const footerItems = [
    {
        title: 'About',
        to: 'help/about'
    },
    {
        title: 'Suggestions',
        to: 'help/suggestions'
    },
    {
        title: 'Contact',
        to: 'help/contact'
    },
]

const socialItems = [
    {
        to: 'https://www.linkedin.com/in/sohamaversekar/',
        icon: <FaLinkedinIn className='h-6 w-6' />
    },
    {
        to: 'https://github.com/awesohame',
        icon: <FaGithub className='h-6 w-6' />
    },
    {
        to: 'https://www.instagram.com/awesohame/',
        icon: <FaInstagram className='h-6 w-6' />
    },
    {
        to: 'https://leetcode.com/awesohame/',
        icon: <SiLeetcode className='h-6 w-6' />
    }
]

export default function Footer() {
    const onMobile = useSelector(state => state.device.onMobile)

    return (
        <section className="flex justify-around overflow-hidden bg-[#293040] text-gray-300 py-2 w-full">
            {!onMobile &&
                <div className='flex items-center w-1/4 '>
                    {/* <Link to='/'>
                    <img src={logo} alt="CodeStash Logo" className='h-12 w-12' />
                </Link> */}
                    <span className='text-[#eae935] text-xl'>© CodeStash</span>

                </div>
            }

            {!onMobile && <div className='flex flex-col items-start lg:flex-row justify-center lg:items-center w-1/3 '>
                {
                    footerItems.map((item, index) => (
                        <NavLink
                            to={item.to}
                            key={index}
                            className={
                                ({ isActive }) => (isActive ? 'text-[#D5B263]' : 'mx-2 text-sm sm:text-base md:text-lg text-gray-300 hover:text-[#D5B263]')
                            }
                        >
                            {item.title}
                        </NavLink>
                    ))
                }
            </div>}

            <div className='flex items-center justify-center w-1/4 lg:justify-end'>
                {
                    socialItems.map((item, index) => (
                        <Link
                            to={item.to}
                            target='_blank'
                            rel='noreferrer'
                            key={index}
                            className='mx-2 text-sm sm:text-base md:text-lg text-gray-300 hover:text-[#D5B263]'
                        >
                            {item.icon}
                        </Link>
                    ))
                }
            </div>
        </section>
    )
}
