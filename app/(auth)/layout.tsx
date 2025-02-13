import React from "react";
import {LayoutAdmin} from "@/components/layout";


export default async function Layout({children}: { children: React.ReactNode }) {


    return (
        <LayoutAdmin>
            <div
                className="w-full h-full grid "
            >
                <div className="flex items-center justify-center py-12">
                    {children}
                </div>
            </div>
        </LayoutAdmin>
    )
}