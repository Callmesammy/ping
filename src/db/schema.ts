import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const pings = pgTable('pings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  tag: text('tag').notNull(),
  status: text('status').notNull().default('VOTING'), // DRAFT, INVITED, VOTING, LOCKED, COMPLETED
  createdBy: text('created_by').notNull().default('Guest User'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const venues = pgTable('venues', {
  id: text('id').primaryKey(),
  pingId: text('ping_id').notNull(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  address: text('address').notNull(),
  votes: integer('votes').notNull().default(0),
  price: text('price').notNull().default('$$'),
  imageUrl: text('image_url').notNull(),
  tag: text('tag').notNull().default('HOT'),
});

export const votes = pgTable('votes', {
  id: text('id').primaryKey(),
  pingId: text('ping_id').notNull(),
  venueId: text('venue_id').notNull(),
  userName: text('user_name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const timeSlots = pgTable('time_slots', {
  id: text('id').primaryKey(),
  pingId: text('ping_id').notNull(),
  slotTime: text('slot_time').notNull(),
  votes: integer('votes').notNull().default(0),
});
