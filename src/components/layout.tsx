import { twx } from "@/lib/twx";
import { cn } from "@/lib/utils";

export const LayoutAdmin = twx.div((props) => [`w-full h-screen flex flex-col gap-4 mx-auto `]);
export const Layout = twx.div((props) => [`max-w-5xl w-full flex-col flex  gap-4 mx-auto px-4 `]);

export const LayoutTitle = twx.h1((props) => [cn(`text-4xl font-bold mt-5 `, props.className)]);

export const LayoutDescription = twx.p((props) => [`text-lg text-muted-foreground`]);
