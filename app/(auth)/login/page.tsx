import {PageParams} from "@/types/next";
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LayoutAdmin} from "@/components/layout";
import {signIn} from "@/auth/auth";
import {redirect} from "next/navigation";
import {AuthError} from "@auth/core/errors";



export default async function SignInPage(props: {
    searchParams: { callbackUrl: string | undefined }
}) {

    const SIGNIN_ERROR_URL = "localhost:8887"

    return (
        // <div className="mx-auto grid w-[350px] gap-6">
        //     <div className="grid gap-2 text-center">
        //         <h1 className="text-3xl font-bold">Login</h1>
        //         <p className="text-balance text-muted-foreground">
        //             Enter your email and password below to login to your account
        //         </p>
        //     </div>
        //     <div className="grid gap-4">
        //         <div className="grid gap-2">
        //             <Label htmlFor="email">Email</Label>
        //             <Input
        //                 id="email"
        //                 type="email"
        //                 placeholder="exemple@portabase.com"
        //                 required
        //             />
        //         </div>
        //         <div className="grid gap-2">
        //             <div className="flex items-center">
        //                 <Label htmlFor="password">Password</Label>
        //                 <Link
        //                     href="/forgot-password"
        //                     className="ml-auto inline-block text-sm underline"
        //                 >
        //                     Forgot your password?
        //                 </Link>
        //             </div>
        //             <Input id="password" type="password" required/>
        //         </div>
        //         <Button type="submit" className="w-full">
        //             Login
        //         </Button>
        //     </div>
        //     <div className="mt-2 text-center text-sm">
        //         Don&apos;t have an account?{" "}
        //         <Link href="#" className="underline">
        //             Sign up
        //         </Link>
        //     </div>
        // </div>
        <div className="flex flex-col gap-2">
            <form
                action={async (formData) => {
                    "use server"
                    console.log(formData)

                    try {
                        console.log(formData)
                        await signIn("credentials", formData)
                    } catch (error) {
                        console.log("error")
                        // if (error instanceof AuthError) {
                        //     return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                        // }
                        // throw error
                    }
                }}
            >
                <label htmlFor="email">
                    Email
                    <input name="email" id="email"/>
                </label>
                <label htmlFor="password">
                    Password
                    <input name="password" id="password"/>
                </label>
                <input type="submit" value="Sign In"/>
            </form>

        </div>
    )
}