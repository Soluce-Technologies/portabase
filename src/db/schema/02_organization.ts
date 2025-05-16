import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./01_user";
import { relations } from "drizzle-orm";
import { project } from "./03_project";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const organization = pgTable("organization", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    metadata: text("metadata"),
});

export const member = pgTable("member", {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
});

export const invitation = pgTable("invitation", {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    inviterId: uuid("inviter_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
    invitations: many(invitation),
    projects: many(project),
}));

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

export const invitationRelations = relations(invitation, ({ one }) => ({
    organization: one(organization, {
        fields: [invitation.organizationId],
        references: [organization.id],
    }),
    inviter: one(user, {
        fields: [invitation.inviterId],
        references: [user.id],
    }),
}));

export const organizationSchema = createSelectSchema(organization);
export type Organization = z.infer<typeof organizationSchema>;

export const organizationMemberSchema = createSelectSchema(member);
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;

export const organizationInvitationSchema = createSelectSchema(invitation);
export type OrganizationInvitation = z.infer<typeof organizationInvitationSchema>;
