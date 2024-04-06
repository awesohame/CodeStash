import logo from '../../assets/logo.png'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register({
    onSwitch
}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(formData);
        try {
            const response = await axios.post(
                '/api/v1/users/register',
                {
                    username: formData.registerusername,
                    password: formData.registerpassword,
                    email: formData.registeremail
                }
            );
            console.log(response);
            if (response.data && response.data.message) {
                // console.log(response.data)
                alert(response.data.message);
                navigate(`/u/${response.data.data.username}`);
            } else {
                alert("An error occurred while submitting the form");
            }
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <section>
            <div className="flex items-center justify-center bg-[#293040] px-4 sm:px-6 lg:px-8 py-8 rounded-xl text-white">
                <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
                    <div className="mb-2 flex justify-center">
                        <img src={logo} alt="logo" className="w-16 h-16" />
                    </div>
                    <h2 className="text-center text-2xl font-bold leading-tight ">
                        Sign up to create account
                    </h2>
                    {/* <p className="mt-2 text-center text-base text-gray-600">
                        Already have an account?{' '}
                        <a
                            href="#"
                            title=""
                            className="font-medium  transition-all duration-200 hover:underline"
                        >
                            Sign In
                        </a>
                    </p> */}
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8"
                    >
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="registerusername" className="text-base font-medium text-gray-200">
                                    {' '}
                                    Username{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        id='registerusername'
                                        name='registerusername'
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="text"
                                        placeholder="e.g. generic_user123"
                                        onChange={handleChange}
                                    ></input>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="registeremail" className="text-base font-medium text-gray-200">
                                    {' '}
                                    Email address{' '}
                                </label>
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="email"
                                        placeholder="Enter your email"
                                        id="registeremail"
                                        name='registeremail'
                                        onChange={handleChange}
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
                                <div className="mt-2">
                                    <input
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        type="password"
                                        placeholder="Password"
                                        id="registerpassword"
                                        name='registerpassword'
                                        onChange={handleChange}
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
                    </form>

                </div>
            </div>
        </section>
    )
}
