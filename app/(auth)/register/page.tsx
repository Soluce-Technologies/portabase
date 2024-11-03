import {PageParams} from "@/types/next";
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LayoutAdmin} from "@/components/layout";
import {RegisterForm} from "@/components/wrappers/Auth/Register/RegisterForm/RegisterForm";


export default async function RoutePage(props: PageParams<{}>) {

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <RegisterForm/>
            {/*<div className="grid gap-2 text-center">*/}
            {/*    <h1 className="text-3xl font-bold">Create an account</h1>*/}
            {/*    <p className="text-balance text-muted-foreground">*/}
            {/*        Enter your email below to login to your account*/}
            {/*    </p>*/}
            {/*</div>*/}
            {/*<div className="grid gap-4">*/}
            {/*    <div className="grid gap-2">*/}
            {/*        <Label htmlFor="email">Email</Label>*/}
            {/*        <Input*/}
            {/*            id="email"*/}
            {/*            type="email"*/}
            {/*            placeholder="m@example.com"*/}
            {/*            required*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*    <div className="grid gap-2">*/}
            {/*        <div className="flex items-center">*/}
            {/*            <Label htmlFor="password">Password</Label>*/}
            {/*            <Link*/}
            {/*                href="/forgot-password"*/}
            {/*                className="ml-auto inline-block text-sm underline"*/}
            {/*            >*/}
            {/*                Forgot your password?*/}
            {/*            </Link>*/}
            {/*        </div>*/}
            {/*        <Input id="password" type="password" required/>*/}
            {/*    </div>*/}
            {/*    <Button type="submit" className="w-full">*/}
            {/*        Login*/}
            {/*    </Button>*/}
            {/*    <Button variant="outline" className="w-full">*/}
            {/*        Login with Google*/}
            {/*    </Button>*/}
            {/*</div>*/}
            {/*<div className="mt-4 text-center text-sm">*/}
            {/*    Don&apos;t have an account?{" "}*/}
            {/*    /!*<Link to="#" className="underline">*!/*/}
            {/*    /!*    Sign up*!/*/}
            {/*    /!*</Link>*!/*/}
            {/*</div>*/}
        </div>

    )
}