import { twMerge } from "tailwind-merge"

import { Link } from "react-router-dom"

export default function OneLineStashCard({
    stashes,
    className = "",
}) {
    return (
        <div className={twMerge("", className)}>
            {
                stashes.slice(0, 3).map(stash => (
                    <Link
                        to={`/${stash?.uniqueSlug}`}
                        key={stash._id}
                        className='w-full h-24 bg-[#384157] rounded-lg mb-2'
                    >
                        <div className="flex items-center justify-between my-2 px-8 py-[0.9rem] w-full bg-[#293040] text-gray-300 rounded-lg hover:bg-[#202632] hover:text-gray-300 transition-colors duration-200 ease-in-out">
                            <div className="w-[20%] font-semibold text-lg/6">
                                {stash.title?.substring(0, 15)?.trim()}
                                {stash.title.length > 15 && '...'}
                            </div>
                            <div className="w-[40%] text-gray-400 font-thin">
                                {stash.description?.substring(0, 24)?.trim()}
                                {stash.description.length > 24 && '...'}
                            </div>
                            <div className="w-[20%] text-right text-sm">
                                {new Date(stash.createdAt).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}
