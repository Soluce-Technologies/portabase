import {LoadingSpinner} from "@/components/wrappers/common/loading/LoadingSpinner";

export default function Loading() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <LoadingSpinner size={50} />
        </div>
    )
}