import { twMerge } from "tailwind-merge"

import { Link } from "react-router-dom"

export default function OneLineStashCard({
    stashes,
    className = "",
}) {
    return (
        <div className={twMerge("", className)}>
            {
                stashes.slice(0, 4).map(stash => (
                    <Link
                        to={`/${stash?.uniqueSlug}`}
                        key={stash._id}
                        className='w-full h-24 bg-[#384157] rounded-lg mb-2'
                    >
                        <div className="flex items-center justify-between my-2 px-8 py-4 w-full bg-[#293040] text-gray-300 rounded-lg">
                            <div className="w-[20%] font-semibold">
                                {stash.title?.substring(0, 15)}
                                {stash.title.length > 15 && '...'}
                            </div>
                            <div className="w-[40%] text-gray-400 font-thin">
                                {stash.description?.substring(0, 27)}
                                {stash.description.length > 27 && '...'}
                            </div>
                            <div className="w-[20%] text-right">
                                {new Date(stash.createdAt).toLocaleDateString('en-GB')}
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    );
}
