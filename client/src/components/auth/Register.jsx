import logo from '../../assets/logo.png'
import { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/slices/userSlice'
import { setRegisterModal } from '../../store/slices/modalSlice'

import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import useToast from '../../hooks/useToast'

export default function Register({
    onSwitch
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: null,
        imagePreview: null
    });

    const inputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const imageFile = e.target.files[0];
        setFormData({
            ...formData,
            avatar: imageFile,
            imagePreview: URL.createObjectURL(imageFile),
        });

        inputRef.current = e.target;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData.avatar);
        try {
            const response = await axios.post(
                '/api/v1/users/register',
                {
                    username: formData.registerusername,
                    password: formData.registerpassword,
                    email: formData.registeremail,
                    avatar: formData.avatar
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.data && response.data.message) {
                // console.log(response.data)
                // alert(response.data.message);
                if (inputRef.current) {
                    inputRef.current.value = '';
                }
                setFormData({
                    registerusername: '',
                    registeremail: '',
                    registerpassword: '',
                    avatar: null,
                    imagePreview: null
                });
                dispatch(setUser(response.data.data.user));
                dispatch(setRegisterModal(false));
                useToast({
                    message: `Registered user ${response.data.data.user.username}`,
                    type: 'success',
                    icon: <FaCheckCircle className='text-green-400 text-lg' />,
                })
                navigate(`/u/${response.data.data.user.username}`);
            } else {
                // alert("An error occurred while submitting the form");
                useToast({
                    message: "Registration Failed",
                    type: 'error',
                    icon: <MdError className='text-red-400 text-xl' />,
                })
            }
        }
        catch (err) {
            console.log(err);
            useToast({
                message: "Registration Failed",
                type: 'error',
                icon: <MdError className='text-red-400 text-xl' />,
            })
        }
    };

    return (
        <section className='w-[60vw] rounded-[2rem]'>
            <div className="flex items-center justify-center bg-[#293040] px-4 sm:px-6 lg:px-8 py-4 rounded-[2rem] text-white">
                <div className="xl:mx-auto xl:w-full xl:max-w-xl 2xl:max-w-xl">
                    <div className="mb-2 flex justify-center">
                        <img src={logo} alt="logo" className="w-16 h-16" />
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight ">
                        Sign up to create account
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-4 flex justify-between"
                    >
                        <div className="space-y-3 w-[45%]">
                            <div>
                                <label htmlFor="registerusername" className="text-base font-medium text-gray-200">
                                    {' '}
                                    Username{' '}
                                </label>
                                <div className="mt-1">
                                    <input
                                        id='registerusername'
                                        name='registerusername'
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="e.g. generic_user123"
                                        onChange={handleChange}
                                        value={formData.registerusername}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="registeremail" className="text-base font-medium text-gray-200">
                                    {' '}
                                    Email address{' '}
                                </label>
                                <div className="mt-1">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Enter your email"
                                        id="registeremail"
                                        name='registeremail'
                                        onChange={handleChange}
                                        value={formData.registeremail}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="registerpassword" className="text-base font-medium text-gray-200">
                                        {' '}
                                        Password{' '}
                                    </label>
                                </div>
                                <div className="mt-1">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Password"
                                        id="registerpassword"
                                        name='registerpassword'
                                        onChange={handleChange}
                                        value={formData.registerpassword}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-col items-center mx-auto">
                                <label htmlFor="productImage" className="block mb-1 text-white">
                                    Avatar Image:
                                </label>
                                <input
                                    type="file"
                                    id="productImage"
                                    name="productImage"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full border border-gray-400 bg-gradient-to-r from-gray-900 to-black rounded"

                                />

                                {/* Display image preview */}
                                {
                                    formData.imagePreview ? (
                                        <div className="mt-2 h-40 w-40 bg-gray-800 flex items-center justify-center">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Product Preview"
                                                className="mt-2 max-h-40 mx-auto"
                                            />
                                        </div>
                                    )
                                        : (
                                            <div className="mt-2 h-40 w-40 bg-gray-800 flex items-center justify-center">
                                                <p className="text-gray-400 text-sm">Image Preview</p>
                                            </div>
                                        )
                                }
                            </div>
                        </div>
                    </form>

                    <p className="mt-2 text-center text-base text-gray-300">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitch}
                            className="font-semibold transition-all duration-200 hover:underline"
                        >
                            Sign In
                        </button>
                    </p>

                </div>
            </div>
        </section>
    )
}
