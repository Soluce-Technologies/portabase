"use client";

import { ComboBox } from "@/components/wrappers/common/combobox";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export function OrganizationCombobox() {
    const router = useRouter();

    const { data: organizations } = authClient.useListOrganizations();
    const { data: activeOrganization } = authClient.useActiveOrganization();

    if (!organizations) return null;

    console.log("organizations", organizations);
    console.log("activeOrganization", activeOrganization);

    const values = organizations.map((organization) => {
        return {
            value: organization.slug,
            label: organization.name,
        };
    });

    const onValueChange = async (slug: string) => {
        await authClient.organization.setActive({
            organizationSlug: slug,
        });
        router.replace(`/dashboard/${slug}/home`);
        router.refresh();
    };
    const { state } = useSidebar();

    return <>{state === "expanded" && <ComboBox sideBar values={values} defaultValue={activeOrganization?.slug} onValueChange={onValueChange} />}</>;
}
