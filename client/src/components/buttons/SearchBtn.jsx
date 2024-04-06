import { twMerge } from 'tailwind-merge'
import { Search } from 'lucide-react'

export default function PlusBtn(
    {
        onClick = () => { },
        className = "",
    }
) {
    return (
        <button
            type="button"
            className={twMerge(
                "rounded-full bg-black px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
                className
            )}
        >
            <Search className="h-4 w-4" />
        </button>
    )
}

