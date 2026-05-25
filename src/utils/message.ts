import { AxiosError } from "axios"
import { toast } from "sonner";

export const successMesssage = (message: string) => {
    toast.success(message);
}


export const showError = (error: unknown) => {
    if (error instanceof AxiosError) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || error.message || "An unexpected server error occurred");
    } else if (error instanceof Error) {
        toast.error(error.message || "Something went wrong");
    } else {
        toast.error("An unknown error occurred");
    }
}