import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const parts = pgTable('parts', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    quantity: integer('quantity').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});
