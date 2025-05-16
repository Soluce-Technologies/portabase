import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";
import { defaultStatements as orgDefaultStatements, adminAc as orgAdminAc } from "better-auth/plugins/organization/access";

const statement = {
    ...defaultStatements,
    ...orgDefaultStatements,
    project: ["create", "list", "update", "delete"],
    database: ["create", "list", "update", "delete", "backup"],
    agent: ["create", "list", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

const superadmin = ac.newRole({
    project: ["create", "list", "update", "delete"],
    database: ["create", "list", "update", "delete"],
    agent: ["create", "list", "update", "delete"],
    ...adminAc.statements,
    ...orgAdminAc.statements,
});

const admin = ac.newRole({
    project: ["create", "list", "update", "delete"],
    database: ["create", "list", "update", "delete"],
    agent: ["create", "list", "update", "delete"],
    ...adminAc.statements,
});

const user = ac.newRole({
    project: [],
    database: [],
    agent: [],
});

const pending = ac.newRole({
    project: [],
    database: [],
    agent: [],
});

//org
const orgMember = ac.newRole({
    project: ["list"],
    database: ["list"],
    agent: ["list"],
});

const orgAdmin = ac.newRole({
    project: ["create", "update"],
    ...orgAdminAc.statements,
});

const orgOwner = ac.newRole({
    project: ["create", "update", "delete"],
    ...orgAdminAc.statements,
});

export { ac, admin, superadmin, user, pending, orgAdmin, orgMember, orgOwner };
