"use client";

import {ComboBox} from "@/components/wrappers/common/combobox";
import {useSidebar} from "@/components/ui/sidebar";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth/auth-client";


export function OrganizationCombobox() {
    const router = useRouter();
    const {state} = useSidebar();

    const {data: organizations, refetch} = authClient.useListOrganizations();
    const {data: activeOrganization, refetch: refetchActiveOrga} = authClient.useActiveOrganization();

    if (!organizations) return null;

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
        router.refresh();

    };

    const handleReset = () => {
        refetch();
        refetchActiveOrga()
        router.refresh();
    }

    return <>{state === "expanded" &&
        <ComboBox sideBar values={values} defaultValue={activeOrganization?.slug} onValueChange={onValueChange}
                  reload={handleReset}/>}</>;
}
