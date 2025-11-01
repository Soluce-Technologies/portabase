"use client"

import {useState} from "react";
import {Plus} from "lucide-react";

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {AdminOrganizationForm} from "@/components/wrappers/dashboard/admin/organization/admin-organization-form";

type AdminOrganizationAddModalProps = {}


export const AdminOrganizationAddModal = (props: AdminOrganizationAddModalProps) => {


    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus/> add
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>add organization</DialogTitle>
                    <DialogDescription>
                        your description
                    </DialogDescription>
                    <AdminOrganizationForm onSuccess={() => setOpen(false)}/>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
