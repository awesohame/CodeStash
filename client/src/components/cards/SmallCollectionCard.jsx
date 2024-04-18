import { twMerge } from "tailwind-merge"
import { Link } from "react-router-dom"

export default function SmallCollectionCard({
    collections,
    className = "",
}) {
    return (
        <div className={twMerge("", className)}>
            {
                collections.slice(0, 2).map(collection => (
                    <Link
                        to={`/${collection?.uniqueSlug}`}
                        key={collection._id}
                        className='w-full h-24 bg-[#384157] rounded-lg mb-2'
                    >
                        <div className="flex flex-col items-center justify-between h-full my-2 px-4 py-4 w-full bg-[#293040] text-gray-300 rounded-lg hover:bg-[#202632] hover:text-gray-300 transition-colors duration-200 ease-in-out">
                            <div className="flex h-[50%] w-full items-center">
                                <div className="grow font-semibold text-lg/6">
                                    {collection.title?.substring(0, 15)?.trim()}
                                    {collection.title?.length > 15 && '...'}
                                </div>
                                <div className="grow text-right text-sm/6">
                                    {new Date(collection.createdAt).toLocaleDateString('en-GB')}
                                </div>
                            </div>
                            <div className="w-full text-sm">
                                {
                                    collection.stashes.length === 0
                                        ? "No stashes"
                                        :
                                        collection.stashes.length > 1
                                            ? `${collection.stashes.length} stashes`
                                            : `${collection.stashes.length} stash`
                                }
                            </div>
                            <div className="h-[50%] w-full text-gray-400 font-thin">
                                {collection.description?.substring(0, 50)?.trim()}
                                {collection.description?.length > 27 && '...'}
                            </div>

                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
