import { toggleUserDropdown } from '../../store/slices/dropdownSlice'
import { useDispatch, useSelector } from 'react-redux'

import { removeUser } from '../../store/slices/userSlice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import { Link, NavLink } from 'react-router-dom';
import { FaChevronDown, FaLayerGroup } from "react-icons/fa6";
import { FaUser, FaCog, FaBoxes } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

const dropdownItems = [
    {
        name: 'Profile',
        to: '/u/profile',
        icon: <FaUser className='mr-2' />,
    },
    {
        name: 'Settings',
        to: '/u/settings',
        icon: <FaCog className='mr-2' />,
    },
    {
        name: 'My Stashes',
        to: '/u/stashes',
        icon: <FaBoxes className='mr-2' />,
    },
    {
        name: 'My Collections',
        to: '/u/collections',
        icon: <FaLayerGroup className='mr-2' />,
    },
]

export default function UserDropdown() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDropdownOpen = useSelector(state => state.dropdown.userDropdown);
    const user = useSelector(state => state.user.data);

    const toggleDropdown = () => {
        dispatch(toggleUserDropdown());
    }

    const handleLogout = async () => {
        try {
            const response = await axios.get('/api/v1/users/logout')
            if (response.data && response.data.message) {
                alert(response.data.message)
                dispatch(removeUser())
                navigate('/')
            }
            else {
                alert('An error occurred while logging out')
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="z-40 flex items-center justify-center">
            <div className="relative group">
                <button onClick={toggleDropdown} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-300 bg-[#384157] rounded-[0.3rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#293040] focus:ring-blue-500">
                    <span className="mr-2 min-w-24 text-left">{user?.username}</span>
                    <FaChevronDown className={`my-auto h-3 transform transition-transform duration-[600ms] ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <div className={`text-sm absolute w-full right-0 mt-2 py-2 rounded-[0.3rem] shadow-lg bg-[#384157] ring-1 ring-black ring-opacity-5 p-1 space-y-1 ${isDropdownOpen ? '' : 'hidden'}`}>

                    {
                        dropdownItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.to}
                                className={
                                    ({ isActive }) => (isActive ? (
                                        "flex items-center w-full px-2 py-2 text-[#D5B263] bg-[#293040] cursor-pointer rounded-md"
                                    ) : (
                                        "flex items-center w-full px-2 py-2 text-gray-300 hover:text-[#D5B263] hover:bg-[#293040] cursor-pointer rounded-md"
                                    )
                                    )
                                }
                            >
                                {item.icon} {item.name}
                            </NavLink>
                        ))
                    }

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-2 py-2 text-gray-300 hover:text-[#D5B263] hover:bg-[#293040] cursor-pointer rounded-md"
                    >
                        <CiLogout className='mr-2' /> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

