import {DataTable} from "@/components/wrappers/common/table/data-table";
import {usersColumnsAdmin} from "@/components/wrappers/dashboard/admin/columns-users";
import {MemberWithUser, Organization, OrganizationWithMembers} from "@/db/schema/03_organization";
import {OrganizationInvitation} from "@/db/schema/05_invitation";
import {organizationMemberColumns} from "@/components/wrappers/dashboard/settings/columns-organization-members";


interface SettingsOrganizationMembersTableProps {
    organization: OrganizationWithMembers
}

export const SettingsOrganizationMembersTable = ({organization}: SettingsOrganizationMembersTableProps) => {
    return (
        <div className="flex flex-col h-full  py-4">
            <div className="flex gap-4 h-fit justify-between">
                <h1>List of Organization members</h1>
            </div>
            <div className="mt-5 h-full">
                <DataTable columns={organizationMemberColumns} data={organization.members as MemberWithUser[]}/>
            </div>
        </div>
    )
}