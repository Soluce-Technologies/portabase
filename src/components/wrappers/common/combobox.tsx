"use client";

import {useEffect, useState} from "react";

import {Check, ChevronDown} from "lucide-react";

import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {FormControl} from "@/components/ui/form";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";
import {CreateOrganizationModal} from "@/components/wrappers/dashboard/organization/create-organisation-modal";

export type comboBoxProps = {
    values: Array<{ value: string; label: string }>;
    defaultValue?: string;
    onValueChange?: any;
    searchField?: boolean;
    sideBar?: boolean;
    reload?: () => void;

};

export function ComboBox(props: comboBoxProps) {
    const {
        values: choices,
        defaultValue: defaultChoice = "",
        onValueChange,
        searchField = false,
        sideBar = false
    } = props;

    const [value, setValue] = useState<string>();

    useEffect(() => {
        setValue(defaultChoice);
    }, [defaultChoice]);

    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    return (
        <div>
            <CreateOrganizationModal
                open={openModal}
                onSuccess={() => {
                    props.reload?.();
                }}
                onOpenChange={setOpenModal}
            />

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {sideBar ? (
                        <SidebarMenuButton>
                            {value ? choices.find((choice) => choice.value === value)?.label : "Select choice..."}
                            <ChevronDown className="ml-auto"/>
                        </SidebarMenuButton>
                    ) : (
                        <Button variant="outline" role="combobox" aria-expanded={open}
                                className="w-full justify-between">
                            {value ? choices.find((choice) => choice.value === value)?.label : "Select choice..."}
                            <ChevronDown className="opacity-50"/>
                        </Button>
                    )}
                </PopoverTrigger>
                <PopoverContent className="p-0 popover-content-width-full">
                    <Command>
                        {searchField ? <CommandInput placeholder="Search choice..." className="h-9"/> : null}
                        <CommandList>
                            <CommandEmpty>No choice found.</CommandEmpty>
                            <CommandGroup>
                                {choices.map((choice) => (
                                    <CommandItem
                                        key={choice.value}
                                        value={choice.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue);
                                            onValueChange(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {choice.label}
                                        <Check
                                            className={cn("ml-auto", value === choice.value ? "opacity-100" : "opacity-0")}/>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                    <Separator/>
                    {sideBar ? (
                        <SidebarMenuButton onClick={() => {
                            setOpen(false)
                            setOpenModal(true)
                        }
                        }>+ Create new organization</SidebarMenuButton>
                    ) : null}
                </PopoverContent>
            </Popover>
        </div>
    );
}

export type comboBoxFormItemProps = comboBoxProps & {
    value: any;
    name: any;
    onChange: any;
};

/** Combobox to use when working with zodForm. */
export function ComboBoxFormItem(props: comboBoxFormItemProps) {
    const {values: choices, searchField = false, value, name, onChange} = props;

    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button variant="outline" role="combobox" aria-expanded={open}
                            className={cn("w-full justify-between", !value && "text-muted-foreground")}>
                        {value ? choices.find((choice) => choice.value === value)?.label : `Select ${name}`}
                        <ChevronDown className="opacity-50"/>
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0 popover-content-width-full">
                <Command>
                    {searchField ? <CommandInput placeholder="Search choice..." className="h-9"/> : null}
                    <CommandList>
                        <CommandEmpty>No {name} found.</CommandEmpty>
                        <CommandGroup>
                            {choices.map((choice) => (
                                <CommandItem
                                    value={choice.label}
                                    key={choice.value}
                                    onSelect={() => {
                                        onChange(choice.value);
                                        setOpen(false);
                                    }}
                                >
                                    {choice.label}
                                    <Check
                                        className={cn("ml-auto", choice.value === value ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
