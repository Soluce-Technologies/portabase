import {PropsWithChildren} from 'react';
import {twx} from "@/lib/twx";
import {cn} from "@/lib/utils";

export const Page = ({children}: PropsWithChildren<{}>) => {
    return (
        <div className="flex flex-1 flex-col gap-4 px-10 py-6">{children}</div>
    );
};

export const PageHeader = twx.div((props)=>[
    cn(`flex justify-between`, props.className),
])

export const PageTitle = twx.h1((props)=>[
    cn(`text-3xl font-bold mb-6`, props.className),
])



export const PageDescription = twx.h2((props)=>[
    cn(`text-s mb-6 text-gray-700`, props.className),
])


export const PageActions = twx.h1((props)=>[
    cn(`flex gap-4`, props.className),
])


export const PageContent = ({children}: PropsWithChildren<{}>) => {
    return (
        <div className="">{children}</div>
    );
};

