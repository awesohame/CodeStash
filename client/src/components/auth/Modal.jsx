import { Undo2 } from "lucide-react"

export default function Modal({ open, onClose, children }) {
    return (
        //backdrop
        <div onClick={onClose}
            className={`w-full fixed inset-0 flex justify-center items-center transition-colors ${open ? "visible bg-black/20" : "invisible"}`}
        >

            {/* modal */}

            <div
                onClick={(e) => e.stopPropagation()}
                className={`bg-white rounded-xl shadow transition-all w-[30%] ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors]"
                    onClick={onClose}
                >
                    <Undo2 size={24} />
                </button>
                {children}
            </div>
        </div>
    )
}