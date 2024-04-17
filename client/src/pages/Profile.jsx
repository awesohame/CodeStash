import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

import OneLineStashCard from "../components/cards/OneLineStashCard"
import SolidBtn from "../components/buttons/SolidBtn"

import { navbarHeight } from "../components/navbar/Navbar"

function Profile() {
    const navigate = useNavigate()
    const user = useSelector(state => state.user.data)
    const { username } = useParams()
    const [isLoggedUser, setIsLoggedUser] = useState(user?.username === username)
    const [stashes, setStashes] = useState([])
    console.log(username)
    useEffect(() => {
        setIsLoggedUser(user?.username === username)
    }, [username])

    useEffect(() => {
        async function getStashes() {
            const stashArr = await axios.get(`/api/v1/stashes/users/${username}`)
            // console.log(stashArr.data.data)
            setStashes(stashArr.data.data);
        }
        getStashes()
    }, [username])

    const handleViewAllStashes = () => {
        navigate(`/u/${username}/stashes`)
    }


    return (
        <div
            className='flex items-center justify-between w-full bg-[#202632] px-20 py-10'
            style={{ height: `calc(100vh - ${navbarHeight + 50}px)` }}
        >
            <div className='bg-[#384157] rounded-lg w-[63%] h-full flex flex-col justify-between py-6 px-8'>
                <div className="w-full text-[#D5B263] text-2xl font-extrabold">
                    {
                        isLoggedUser
                            ? "Your Stashes"
                            : `${username}'s Stashes`

                    }
                </div>
                <div>
                    <OneLineStashCard
                        stashes={stashes}
                        className=""
                    />
                    {
                        stashes.length !== 0 && stashes.length < 4 &&
                        <div className="text-[#D5B263] text-lg font-semibold text-center mt-4">
                            No more stashes to show
                        </div>
                    }
                    {
                        stashes.length === 0 &&
                        <div className="text-[#D5B263] text-lg font-semibold text-center mt-4">
                            No stashes to show
                        </div>
                    }
                </div>
                <div>
                    <SolidBtn
                        btnText="View All Stashes"
                        onClick={handleViewAllStashes}
                        className="bg-[#D5B263] hover:bg-[#D4B15E] text-[#293040] hover:text-[#202632] border-none text-sm lg:text-lg px-2 py-1 lg:px-3 lg:py-2 hover"
                        disabled={stashes.length < 4}
                    />
                </div>
            </div>
            <div className="bg-[#384157] rounded-lg w-[30%] h-full">

            </div>
        </div>
    )
}

export default Profile