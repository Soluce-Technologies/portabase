import {boolean, pgTable, text, timestamp, uuid} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {database} from "@/db/schema/06_database";
import {relations} from "drizzle-orm";

export const agent = pgTable("agents", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull().notNull(),
    description: text("description").notNull(),
    isArchived: boolean("is_archived").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    lastContact: timestamp("last_contact"),
});

export const agentSchema = createSelectSchema(agent);
export type Agent = z.infer<typeof agentSchema>;


export const agentRelations = relations(agent, ({ many }) => ({
    databases: many(database),
}));