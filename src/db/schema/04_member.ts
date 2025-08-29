import {pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import {user} from "@/db/schema/02_user";
import {organization} from "@/db/schema/03_organization";
import {relations} from "drizzle-orm";
import {createSelectSchema} from "drizzle-zod";
import {z} from "zod";
import {timestamps} from "@/db/schema/00_common";


export const member = pgTable("member", {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    ...timestamps
});

export const memberRelations = relations(member, ({ one }) => ({
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
}));


export const organizationMemberSchema = createSelectSchema(member);
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;