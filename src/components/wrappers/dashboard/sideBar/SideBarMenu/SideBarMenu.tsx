"use client";

import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu as SM,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export type SidebarMenuProps = {
    baseUrl: string;
    items: SidebarItem[];
};

type SidebarItemContent = {
    title: string;
    url: string;
    icon: JSX.Element;
    dropdown?: {
        title: string;
        url: string;
    }[];
};

type SidebarListItem = {
    type: "list";
    content: SidebarItemContent;
};

type SidebarCollapseItem = {
    type: "collapse";
    title: string;
    content: SidebarItemContent[];
};

export type SidebarItem = SidebarListItem | SidebarCollapseItem;

export const SidebarMenu = (props: SidebarMenuProps) => {
    const pathname = usePathname();

    useEffect(() => {
        const currentUrl = pathname;

        const currentItem = props.items.find((item) => {
            if (item.type === "list") {
                return `${props.baseUrl}/${item.content.url}` === currentUrl;
            } else if (item.type === "collapse") {
                return item.content.some((content) => `${props.baseUrl}/${content.url}` === currentUrl);
            }
            return false;
        });

        if (currentItem) {
            if (currentItem.type === "list") {
                setActiveItem(currentItem.content.title);
            } else if (currentItem.type === "collapse") {
                setActiveItem(currentItem.title!);
            }
        } else {
            setActiveItem("");
        }
    }, [pathname]);

    const [activeItem, setActiveItem] = useState("");
    const handleItemClick = (title: string) => {
        setActiveItem(title);
    };

    return (
        <SM>
            {props.items.map((item, index) =>
                item.type === "collapse" ? (
                    <Collapsible defaultOpen key={index} className={`group/collapsible`}>
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    {item.title ?? "Please define a title"}
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarGroupContent>
                                    {item.content.map((content) => (
                                        <SidebarMenuItem key={content.title}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    className={cn(
                                                        buttonVariants({
                                                            size: "lg",
                                                            variant: activeItem === content.title ? "secondary" : "ghost",
                                                        }),
                                                        "justify-start p-0"
                                                    )}
                                                    href={`${props.baseUrl}/${content.url}`}
                                                    onClick={() => handleItemClick(content.title)}
                                                >
                                                    {content.icon}
                                                    <span>{content.title}</span>
                                                </Link>
                                            </SidebarMenuButton>

                                            {content.dropdown && (
                                                <SidebarMenuAction>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <SidebarMenuAction>
                                                                <MoreHorizontal />
                                                            </SidebarMenuAction>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent side="right" align="start">
                                                            {content.dropdown.map((dropdown) => (
                                                                <Link href={`${props.baseUrl}/${dropdown.url}`} className="justify-start p-0">
                                                                    <DropdownMenuItem>
                                                                        <span>{dropdown.title ?? "Please define a title"}</span>
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </SidebarMenuAction>
                                            )}
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                ) : (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuButton asChild>
                            <Link
                                className={cn(
                                    buttonVariants({
                                        size: "lg",
                                        variant: activeItem === item.content.title ? "secondary" : "ghost",
                                    }),
                                    "justify-start p-0"
                                )}
                                href={`${props.baseUrl}/${item.content.url}`}
                                onClick={() => handleItemClick(item.content.title)}
                            >
                                {item.content.icon}
                                <span>{item.content.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )
            )}
        </SM>
    );
};
