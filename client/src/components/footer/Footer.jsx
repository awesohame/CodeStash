import React from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { FaInstagram } from "react-icons/fa6";

const footerItems = [
    {
        title: 'About',
        to: '/about'
    },
    {
        title: 'Suggestions',
        to: '/suggestions'
    },
    {
        title: 'Contact',
        to: '/contact'
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
    return (
        <section className="relative overflow-hidden bg-[#293040] text-gray-300 py-8 px-12">
            <div className="container relative z-10 mx-auto px-4">
                <div className="-m-8 flex flex-wrap items-center justify-between">
                    <div className="w-auto p-8">
                        <a href="#">
                            <div className="inline-flex items-center">
                                <img src={logo} alt="logo" className="w-16 h-16" />
                                <span className="ml-4 text-lg font-bold text-[#eae935]">CodeStash</span>
                            </div>
                        </a>
                    </div>
                    <div className="w-auto p-8">
                        <ul className="-m-5 flex flex-wrap items-center">
                            {
                                footerItems.map((item, idx) => (
                                    <li className="p-5" key={idx}>
                                        <Link to={item.to} className="font-medium  hover:text-[#D5B263]">
                                            {item.title}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className="w-auto p-8">
                        <div className="-m-1.5 flex flex-wrap">
                            {
                                socialItems.map((item, idx) => (
                                    <div key={idx} className='mx-4'>
                                        <a
                                            href={item.to}
                                            className="p-1.5 hover:text-[#D5B263] transition-colors duration-200 h-8 w-8"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {item.icon}
                                        </a>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
