import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { project } from "./05_project";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {invitation} from "@/db/schema/04_invitation";
import {member} from "@/db/schema/03_member";

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

