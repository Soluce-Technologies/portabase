import { pgTable, text, boolean, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Organization, organization } from "./02_organization";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { Database, database } from "./05_database";

export const project = pgTable("projects", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull().notNull(),
    isArchived: boolean("is_archived").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    organizationId: uuid("organization_id")
        .notNull()
        .references(() => organization.id),
});

export const projectRelations = relations(project, ({ one, many }) => ({
    organization: one(organization, {
        fields: [project.organizationId],
        references: [organization.id],
    }),
    databases: many(database),
}));

export const projectSchema = createSelectSchema(project);
export type Project = z.infer<typeof projectSchema>;

export type ProjectWith = Project & {
    databases: Database[];
    organization: Organization;
};
