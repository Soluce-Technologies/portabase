import {Icon} from "@iconify/react";
import {CircleHelp, KeyRound} from "lucide-react";


export const providerSwitch = (provider: string) => {
    switch (provider) {
        case "google":
            return (
                <div className="p-4">
                    <Icon icon={"logos:google"} height="24" />
                </div>
            );
        case "credential":
            return (
                <div className="flex flex-row gap-x-2 items-center p-4">
                    <KeyRound height="24" />
                    <span>Email and Password</span>
                </div>
            );
        default:
            return (
                <div className="flex flex-row gap-x-2 items-center p-4">
                    <CircleHelp height="24" />
                    <span>No credentials</span>
                </div>
            );
    }
}