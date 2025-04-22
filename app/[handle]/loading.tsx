import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex items-center gap-2">
                <Loader className="animate-spin h-8 w-8 text-gray-500" />
                <h1 className="text-4xl font-bold">Loading latest tweets...</h1>
            </div>
        </div>
    )
}