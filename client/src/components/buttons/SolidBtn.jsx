import { twMerge } from "tailwind-merge";

export default function SolidBtn(
    {
        btnText = "Button",
        onClick = () => {
            console.log("No action provided for button click")
        },
        className = "",
        btnIcon = <></>,
        disabled = false,
    }
) {
    return (
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <button
                type="button"
                disabled={disabled}
                className={twMerge(
                    "flex justify-evenly items-center border-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm",
                    className,
                    disabled ? "bg-gray-300 cursor-not-allowed text-gray-500" : ""
                )}
                onClick={onClick}
            >
                {btnIcon}
                {btnText}
            </button>
        </div>
    )
}
