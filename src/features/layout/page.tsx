import {PropsWithChildren} from 'react';

export const Page = ({children}: PropsWithChildren<{}>) => {
    return (
        <div className="flex flex-1 flex-col gap-4 px-10 py-6">{children}</div>
    );
};

export const PageHeader = ({children}: PropsWithChildren<{}>) => {
    return (
        <div className="flex justify-between">{children}</div>
    );
};

export const PageTitle = ({children}: PropsWithChildren<{}>) => {
    return (
        <h1 className="text-3xl font-bold mb-6">{children}</h1>
    );
};

export const PageDescription = ({children}: PropsWithChildren<{}>) => {
    return (
        <h2 className="text-s mb-6 text-gray-700">{children}</h2>
    );
};

export const PageActions = ({children}: PropsWithChildren<{}>) => {
    return (
        <h1 className="flex gap-4">{children}</h1>
    );
};


export const PageContent = ({children}: PropsWithChildren<{}>) => {
    return (
        <div className="">{children}</div>
    );
};