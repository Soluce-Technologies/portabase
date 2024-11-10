import {LayoutAdmin} from "@/components/layout";
import Image from 'next/image';
import {currentUser, requiredCurrentUser} from "@/auth/current-user";
import {redirect} from "next/navigation";

export default async function Layout({children}: { children: React.ReactNode }) {

    const user = await currentUser()

    if(user){
        redirect('/dashboard')
    }

    return (
        <LayoutAdmin>
            <div
                // className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]"
                className="w-full h-full grid "
            >
                <div className="flex items-center justify-center py-12">
                    {children}
                </div>
                {/*<div className="hidden bg-muted lg:block ">*/}
                {/*    <img*/}
                {/*        src="/background.jpg"*/}
                {/*        alt="Image"*/}
                {/*        width="1920"*/}
                {/*        height="1080"*/}
                {/*        className="h-full w-full object-cover dark:brightness-[0.5] dark:grayscale"*/}
                {/*    />*/}
                {/*    <div className="absolute bottom-6 right-6 z-10">*/}
                {/*        <Image src="/logo-inverse-title-white.png" alt="Logo Portabase" width={250} height={250}/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </LayoutAdmin>
    )
}