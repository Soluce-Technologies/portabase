"use client"
import {ComboBox} from "@/components/wrappers/common/combobox";
import {useSidebar} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth/auth-client";
import {CreateOrganizationModal} from "@/components/wrappers/dashboard/organization/create-organisation-modal";
import {useState} from "react";

export function OrganizationCombobox() {
    const router = useRouter();
    const {state} = useSidebar();
    const {data: organizations, refetch} = authClient.useListOrganizations();
    const {data: activeOrganization, refetch: refetchActiveOrga} = authClient.useActiveOrganization();
    const [openModal, setOpenModal] = useState(false);

    if (!organizations) return null;

    const values = organizations.map(org => ({ value: org.slug, label: org.name }));

    const onValueChange = async (slug: string) => {
        await authClient.organization.setActive({ organizationSlug: slug });
        router.refresh();
    };

    const handleReload = () => {
        refetch();
        refetchActiveOrga();
        router.refresh();
    };

    return (
        <>
            <CreateOrganizationModal
                open={openModal}
                onSuccess={handleReload}
                onOpenChange={setOpenModal}
            />
            {state === "expanded" && (
                <ComboBox
                    sideBar
                    values={values}
                    defaultValue={activeOrganization?.slug}
                    onValueChangeAction={onValueChange}
                    onAddItemAction={() => setOpenModal(true)}
                    addItemLabel="Create new organization"
                />
            )}
        </>
    );
}
