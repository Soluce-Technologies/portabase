"use client";

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {
    ChevronDown,
    MoreHorizontal
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@radix-ui/react-collapsible";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export type SidebarItem = {
    title: string;
    url: string;
    redirect?: boolean;
    not_from_base_url?: boolean;
    icon: React.ElementType;
    dropdown?: SidebarItem[];
    submenu?: SidebarItem[];
    details?: boolean;
};

export type SidebarGroupItem = {
    label: string;
    type: "list" | "collapse";
    group_content: SidebarItem[];
};

type SidebarMenuCustomBaseProps = {
    baseUrl: string;
    items: SidebarGroupItem[];
};

export const SidebarMenuCustomBase = ({ baseUrl, items }: SidebarMenuCustomBaseProps) => {
    const pathname = usePathname();
    const [activeItem, setActiveItem] = useState("");

    useEffect(() => {
        const normalize = (url: string) => url.split("?")[0].replace(/\/$/, "");

        const findActiveUrl = () => {
            const normalizedPathname = normalize(pathname);
            console.log(normalizedPathname);
            for (const group of items) {
                for (const item of group.group_content) {
                    const itemUrl = normalize(item.url);

                    const fullUrl = item.not_from_base_url
                        ? itemUrl
                        : normalize(`${baseUrl}${itemUrl}`);

                    if (
                        normalizedPathname === fullUrl ||
                        (item.details && normalizedPathname.startsWith(`${fullUrl}/`))
                    ) {
                        return itemUrl;
                    }

                    if (item.submenu) {
                        for (const subItem of item.submenu) {
                            const subItemUrl = normalize(subItem.url);
                            const subFullUrl = normalize(`${baseUrl}${subItemUrl}`);

                            if (
                                normalizedPathname === subFullUrl ||
                                (subItem.details && normalizedPathname.startsWith(`${subFullUrl}/`))
                            ) {
                                return subItemUrl;
                            }
                        }
                    }
                }
            }

            return "";
        };

        const activeUrl = findActiveUrl();
        setActiveItem(activeUrl);
    }, [pathname, baseUrl, items]);

    return (
        <SidebarMenu>
            {items.map((group, index) => (
                <Collapsible key={index} defaultOpen disabled={group.type === "list"}>
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                {group.label ?? "Missing label"}
                                {group.type === "collapse" && (
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                )}
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                {group.group_content.map((item, index) => (
                                    <SidebarMenuItem key={index} className="mb-1">
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={
                                                    item.redirect || item.not_from_base_url
                                                        ? item.url
                                                        : `${baseUrl}${item.url}`
                                                }
                                                target={item.redirect ? "_blank" : ""}
                                                className={cn(
                                                    buttonVariants({
                                                        size: "lg",
                                                        variant: activeItem === item.url ? "secondary" : "ghost"
                                                    }),
                                                    "justify-start p-0",
                                                    "hover:bg-gray-700"
                                                )}
                                                onClick={() => setActiveItem(item.url)}
                                            >
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>

                                        {item.submenu && (
                                            <SidebarMenuSub>
                                                {item.submenu.map((sub, idx) => (
                                                    <SidebarMenuSubItem key={idx}>
                                                        <SidebarMenuSubButton asChild>
                                                            <Link
                                                                href={`${baseUrl}${sub.url}`}
                                                                className={cn(
                                                                    buttonVariants({
                                                                        size: "lg",
                                                                        variant: activeItem === sub.url ? "secondary" : "ghost"
                                                                    }),
                                                                    "justify-start p-0",
                                                                    "hover:bg-gray-700"
                                                                )}
                                                                onClick={() => setActiveItem(sub.url)}
                                                            >
                                                                <sub.icon />
                                                                {sub.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ))}
                                            </SidebarMenuSub>
                                        )}

                                        {item.dropdown && (
                                            <SidebarMenuAction>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <MoreHorizontal />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent side="right" align="start">
                                                        {item.dropdown.map((dropdown, idx) => (
                                                            <DropdownMenuItem key={idx} asChild>
                                                                <Link
                                                                    href={
                                                                        dropdown.redirect || dropdown.not_from_base_url
                                                                            ? dropdown.url
                                                                            : `${baseUrl}${dropdown.url}`
                                                                    }
                                                                    className="justify-start p-0"
                                                                    target={dropdown.redirect ? "_blank" : ""}
                                                                    onClick={() => setActiveItem(dropdown.url)}
                                                                >
                                                                    <span>{dropdown.title}</span>
                                                                </Link>
                                                            </DropdownMenuItem>
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
            ))}
        </SidebarMenu>
    );
};
