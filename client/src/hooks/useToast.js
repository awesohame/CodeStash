import toast from "react-hot-toast";

export default function useToast(
    {
        message = "",
        type = "success",
        duration = 4000,
        icon = "✅",
        style = {
            borderRadius: "10px",
            background: "#384157",
            color: "#fff",
            fontSize: "1rem",
        },
    }
) {
    const toastId = toast[type](message, {
        duration,
        icon,
        style,
    });

    return toastId;
}