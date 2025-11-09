import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { project } from "./06_project";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {invitation, OrganizationInvitation} from "@/db/schema/05_invitation";
import {member, OrganizationMember} from "@/db/schema/04_member";
import {User} from "@/db/schema/02_user";
import {timestamps} from "@/db/schema/00_common";
import {organizationNotificationChannel} from "@/db/schema/09_notification-channel";

export const organization = pgTable("organization", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    logo: text("logo"),
    metadata: text("metadata"),
    ...timestamps
});


export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
    projects: many(project),
    notificationChannels: many(organizationNotificationChannel),
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