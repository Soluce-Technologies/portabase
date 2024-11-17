import {PageParams} from "@/types/next";
import {Button} from "@/components/ui/button";
import {redirect} from "next/navigation";

export default async function RoutePage(props: PageParams<{}>) {
    redirect("/dashboard/agents")

    // return(
    //     <div>
    //     <h1>Ok</h1>
    //         <Button>Button</Button>
    //     </div>
    // )
}