import logo from '../../assets/logo.png'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useToast from '../../hooks/useToast'

import { setUser } from '../../store/slices/userSlice'
import { setLoginModal } from '../../store/slices/modalSlice'

import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

import axios from 'axios'


export default function Login(
    {
        onSwitch
    }
) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginusername: '',
        loginpassword: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        try {
            const response = await axios.post(
                '/api/v1/users/login',
                {
                    username: formData.loginusername,
                    password: formData.loginpassword
                }
            );
            if (response.data && response.data.message) {
                // console.log(response.data)
                // alert(response.data.message);
                dispatch(setUser(response.data.data.user));
                dispatch(setLoginModal(false));
                useToast({
                    message: `Logged in as ${response?.data?.data?.user?.username}`,
                    type: 'success',
                    icon: <FaCheckCircle className='text-green-400 text-lg' />,
                })
                navigate(`/u/${response?.data?.data?.user?.username}`);
            } else {
                // alert("An error occurred while submitting the form");
                useToast({
                    message: "No Credentials Found",
                    type: 'error',
                    icon: <MdError className='text-red-400 text-xl' />,
                })
            }
        }
        catch (err) {
            console.log(err);
            useToast({
                message: "Incorrect Credentials",
                type: 'error',
                icon: <MdError className='text-red-400 text-xl' />,
            })
        }
    };

    return (
        <section className='w-full'>
            <div className="flex items-center justify-center bg-[#293040] px-4 sm:px-6 lg:px-8 py-8 rounded-xl text-white">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className="mb-2 flex justify-center">
                        <img src={logo} alt="logo" className="w-16 h-16" />
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight ">
                        Sign in to your account
                    </h2>
                    <form
                        className="mt-8"
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="loginusername" className="text-base font-medium text-gray-200">
                                    {' '}
                                    Username{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id='loginusername'
                                        name='loginusername'
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="loginpassword" className="text-base font-medium text-gray-200">
                                        {' '}
                                        Password{' '}
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id='loginpassword'
                                        name='loginpassword'
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                    onClick={handleSubmit}
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-center text-sm text-gray-300 ">
                            Don&apos;t have an account?{' '}
                            <button
                                onClick={onSwitch}
                                title=""
                                className="font-semibold  transition-all duration-200 hover:underline"
                            >
                                Create a free account
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}
