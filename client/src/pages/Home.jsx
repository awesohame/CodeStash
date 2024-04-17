import React from 'react'
import logoName from '../assets/logoName.png'
import SolidBtn from '../components/buttons/SolidBtn'
import { FaCirclePlus } from "react-icons/fa6";

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


export default function Home() {
    const navigate = useNavigate()

    const onMobile = useSelector(state => state.device.onMobile)

    const handleCreateStash = () => {
        navigate('/create-stash')
    }

    return (
        <main className="relative flex flex-col items-center w-full px-4 md:flex-row sm:px-24 p-8 bg-[#202632]">
            <div className="flex items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pr-10">
                <div className="text-left">
                    <h2
                        className="text-4xl font-extrabold leading-10 tracking-tight text-[#D5B263] sm:text-5xl sm:leading-none md:text-6xl">
                        Code, Notes, Text
                    </h2>
                    <p className="max-w-md mx-auto mt-3 text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Stash your code snippets, notes, and text in one place to access them from any device.
                    </p>
                    <div className="mt-5 sm:flex md:mt-8">
                        <SolidBtn
                            btnText="Create Stash"
                            onClick={handleCreateStash}
                            className="bg-green-400 border-green-400 hover:bg-green-500 hover:border-green-500 text-sm lg:text-xl px-3 py-2 lg:px-6 lg:py-3 w-1/2 lg:w-full"
                            btnIcon={<FaCirclePlus className="mr-1 lg:mr-2 h-[1.25rem] w-[1.25rem]" />}
                        />
                    </div>
                </div>
            </div>
            {!onMobile &&
                <div className="flex justify-center items-center py-5 md:w-1/2 md:pb-20 md:pt-10 md:pl-10">
                    <div className="relative w-4/5 p-3 rounded  md:p-8">
                        <div className="rounded-full text-black w-full">
                            <img src={logoName} alt="CodeStash Logo" />
                        </div>
                    </div>
                </div>
            }
        </main>
    )
}
