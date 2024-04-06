import { twMerge } from "tailwind-merge";

export default function OutlineBtn(
    {
        btnText = "Button",
        onClick = () => { },
        className = "",
    }
) {
    return (
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <button
                type="button"
                className={twMerge(
                    "rounded-md border-2 px-3 py-2 text-sm font-semibold shadow-sm",
                    className
                )}
                onClick={onClick}
            >
                {btnText}
            </button>
        </div>
    )
}
