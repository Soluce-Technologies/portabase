import { pgTable, text, boolean, timestamp, uuid, integer, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { Agent, agent } from "./04_agent";
import { Project, project } from "./03_project";
import { relations } from "drizzle-orm";
import { dbmsEnum, statusEnum } from "./types";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const database = pgTable("databases", {
    id: uuid("id").primaryKey().defaultRandom(),
    agentDatabaseId: uuid("agent_database_id").notNull().defaultRandom(),
    name: text("name").notNull(),
    dbms: dbmsEnum("dbms").notNull(),
    description: text("description").notNull(),
    backupPolicy: text("backup_policy"),
    isWaitingForBackup: boolean("is_waiting_for_backup").default(false).notNull(),
    backupToRestore: text("backup_to_restore"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    agentId: uuid("agent_id")
        .notNull()
        .references(() => agent.id, { onDelete: "cascade" }),
    lastContact: timestamp("last_contact"),

    projectId: uuid("project_id")
        .references(() => project.id)
        .notNull(),
});

export const backup = pgTable(
    "backups",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        status: statusEnum("status").default("waiting").notNull(),
        file: text("file"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at"),
        databaseId: uuid("database_id")
            .notNull()
            .references(() => database.id, { onDelete: "cascade" }),
    },
    (table) => [uniqueIndex("database_id_status_unique").on(table.databaseId, table.status)]
);

export const restoration = pgTable("restorations", {
    id: uuid("id").primaryKey().defaultRandom(),
    status: statusEnum("status").default("waiting").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at"),
    backupId: uuid("backup_id")
        .notNull()
        .references(() => backup.id, { onDelete: "cascade" }),
    databaseId: uuid("database_id").references(() => database.id, { onDelete: "cascade" }),
});

export const databaseRelations = relations(database, ({ one, many }) => ({
    agent: one(agent, { fields: [database.agentId], references: [agent.id] }),
    project: one(project, { fields: [database.projectId], references: [project.id] }),
    backups: many(backup),
    restorations: many(restoration),
}));

export const backupRelations = relations(backup, ({ one, many }) => ({
    database: one(database, { fields: [backup.databaseId], references: [database.id] }),
    restorations: many(restoration),
}));

export const restorationRelations = relations(restoration, ({ one }) => ({
    backup: one(backup, { fields: [restoration.backupId], references: [backup.id] }),
    database: one(database, { fields: [restoration.databaseId], references: [database.id] }),
}));

export const databaseSchema = createSelectSchema(database);
export type Database = z.infer<typeof databaseSchema>;

export const backupSchema = createSelectSchema(backup);
export type Backup = z.infer<typeof backupSchema>;

export const restorationSchema = createSelectSchema(restoration);
export type Restoration = z.infer<typeof restorationSchema>;

export type DatabaseWith = Database & {
    agent: Agent;
    project: Project;
    backups: Backup[];
    restorations: Restoration[];
};
