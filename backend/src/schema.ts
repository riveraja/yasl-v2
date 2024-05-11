import { uuid, text, pgTable, boolean, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const urls = pgTable('urls',{
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    longUrl: text('longurl').notNull().unique(),
    shortHash: text('shorthash').notNull(),
    createdAt: text('created_at').notNull()
})

export const users = pgTable('users',{
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    user: text('user').notNull(),
    email: text('email').notNull().unique(),
    isActive: boolean('is_active')
})

export const visits = pgTable('visits',{
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    count: integer('count')
})