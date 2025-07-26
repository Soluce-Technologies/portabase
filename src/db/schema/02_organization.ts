import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { project } from "./05_project";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {invitation, OrganizationInvitation} from "@/db/schema/04_invitation";
import {member, OrganizationMember} from "@/db/schema/03_member";
import {User} from "@/db/schema/01_user";

export const organization = pgTable("organization", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    metadata: text("metadata"),
});


export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
    projects: many(project),
}));



export const organizationSchema = createSelectSchema(organization);
export type Organization = z.infer<typeof organizationSchema>;

export type OrganizationWithMembers = Organization & {
    members: OrganizationMember[];
};

export type MemberWithUser = OrganizationMember & {
    user: User;
};

export type OrganizationWithMembersAndUsers = Organization & {
    members: MemberWithUser[];
    invitations: OrganizationInvitation[];
};