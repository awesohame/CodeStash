import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

import StashCard from "../components/cards/StashCard"

import { navbarHeight } from "../components/navbar/Navbar"

function Profile() {
    const user = useSelector(state => state.user.data)
    const { username } = useParams()
    const [isLoggedUser, setIsLoggedUser] = useState(user?.username === username)

    useEffect(() => {
        setIsLoggedUser(user?.username === username)
    }, [username])


    return (
        <div
            className='flex items-center justify-between w-full bg-[#202632] px-20 py-10'
            style={{ height: `calc(100vh - ${navbarHeight + 50}px)` }}
        >
            <div className='bg-[#384157] rounded-lg w-[63%] h-full'>

            </div>
            <div className="bg-[#384157] rounded-lg w-[30%] h-full">

            </div>
        </div>
    )
}

export default Profile