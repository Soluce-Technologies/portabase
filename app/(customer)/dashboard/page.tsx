import {PageParams} from "@/types/next";
import {Button} from "@/components/ui/button";

export default async function RoutePage(props: PageParams<{}>) {

    return(
        <div>
        <h1>Ok</h1>
            <Button>Button</Button>
        </div>
    )
}