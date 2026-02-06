import { pgTable, text, timestamp, uuid, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: text('role').notNull(), // We can perform clearer role management later or use an enum
    countryCode: text('country_code'),
    city: text('city'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const countries = pgTable('countries', {
    code: text('code').primaryKey(),
    name: text('name').notNull(),
    locale: text('locale').notNull(),
    language: text('language').notNull(),
    timezone: text('timezone').notNull(),
    currency: text('currency').notNull(),
    currencySymbol: text('currency_symbol').notNull(),
    phoneCode: text('phone_code').notNull(),
});

export const cities = pgTable(
    'cities',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        countryCode: text('country_code')
            .notNull()
            .references(() => countries.code, { onDelete: 'cascade' }),
        name: text('name').notNull(),
    },
    (table) => ({
        countryNameUnique: uniqueIndex('cities_country_name_unique').on(
            table.countryCode,
            table.name
        ),
    })
);

export const passwordResetTokens = pgTable('password_reset_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
