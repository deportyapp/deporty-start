import {
    pgTable,
    text,
    timestamp,
    uuid,
    uniqueIndex,
    integer,
    boolean,
    date,
    numeric,
    char,
    index,
    primaryKey,
} from 'drizzle-orm/pg-core';

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

export const refreshTokens = pgTable(
    'refresh_tokens',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        tokenHash: text('token_hash').notNull().unique(),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        lastUsedAt: timestamp('last_used_at').notNull().defaultNow(),
        expiresAt: timestamp('expires_at').notNull(),
        revokedAt: timestamp('revoked_at'),
    },
    (table) => ({
        userIdx: index('refresh_tokens_user_idx').on(table.userId),
    })
);

export const federations = pgTable('federations', {
    id: uuid('id').defaultRandom().primaryKey(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
    countryCode: text('country_code').notNull().default('CO'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const leagues = pgTable(
    'leagues',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        federationId: uuid('federation_id')
            .notNull()
            .references(() => federations.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        region: text('region'),
    },
    (table) => ({
        federationNameUnique: uniqueIndex('leagues_federation_name_unique').on(
            table.federationId,
            table.name
        ),
    })
);

export const clubs = pgTable(
    'clubs',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        leagueId: uuid('league_id')
            .notNull()
            .references(() => leagues.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        code: text('code'),
    },
    (table) => ({
        leagueNameUnique: uniqueIndex('clubs_league_name_unique').on(
            table.leagueId,
            table.name
        ),
    })
);

export const athletes = pgTable(
    'athletes',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        firstName: text('first_name').notNull(),
        lastName: text('last_name').notNull(),
        birthYear: integer('birth_year').notNull(),
        gender: char('gender', { length: 1 }).notNull(),
        clubId: uuid('club_id')
            .notNull()
            .references(() => clubs.id, { onDelete: 'restrict' }),
        federated: boolean('federated').notNull().default(false),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        clubIdx: index('idx_athletes_club').on(table.clubId),
        birthIdx: index('idx_athletes_birth').on(table.birthYear),
    })
);

export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    maxEvents: integer('max_events').notNull(),
    note: text('note'),
});

export const ageGroups = pgTable(
    'age_groups',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        categoryId: uuid('category_id')
            .notNull()
            .references(() => categories.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        minAge: integer('min_age').notNull(),
        maxAge: integer('max_age').notNull(),
        birthYears: text('birth_years'),
        isRelayGroup: boolean('is_relay_group').notNull().default(false),
    },
    (table) => ({
        categoryIdx: index('idx_age_groups_category').on(table.categoryId),
        categoryNameUnique: uniqueIndex('age_groups_category_name_unique').on(
            table.categoryId,
            table.name
        ),
    })
);

export const events = pgTable(
    'events',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        name: text('name').notNull(),
        style: text('style').notNull(),
        distanceM: integer('distance_m').notNull(),
        eventType: text('event_type').notNull(),
        relaySwimmers: integer('relay_swimmers'),
        gender: text('gender').notNull(),
    },
    (table) => ({
        nameGenderTypeUnique: uniqueIndex('events_name_gender_type_unique').on(
            table.name,
            table.gender,
            table.eventType
        ),
    })
);

export const categoryEvents = pgTable(
    'category_events',
    {
        categoryId: uuid('category_id')
            .notNull()
            .references(() => categories.id, { onDelete: 'cascade' }),
        eventId: uuid('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.categoryId, table.eventId] }),
        eventIdx: index('idx_category_events_event').on(table.eventId),
    })
);

export const championshipTypes = pgTable('championship_types', {
    id: uuid('id').defaultRandom().primaryKey(),
    code: text('code').notNull().unique(),
    name: text('name').notNull(),
});

export const championships = pgTable(
    'championships',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        federationId: uuid('federation_id')
            .notNull()
            .references(() => federations.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        typeId: uuid('type_id')
            .notNull()
            .references(() => championshipTypes.id),
        dateStart: date('date_start').notNull(),
        dateEnd: date('date_end').notNull(),
        location: text('location').notNull(),
        isQualifier: boolean('is_qualifier').notNull().default(false),
    },
    (table) => ({
        federationNameDateUnique: uniqueIndex('championships_federation_name_date_unique').on(
            table.federationId,
            table.name,
            table.dateStart
        ),
    })
);

export const tournaments = pgTable(
    'tournaments',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        championshipId: uuid('championship_id')
            .notNull()
            .references(() => championships.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        dateStart: date('date_start').notNull(),
        dateEnd: date('date_end').notNull(),
        venue: text('venue').notNull(),
        feesIndividualCop: numeric('fees_individual_cop', { precision: 12, scale: 2 }),
        feesForeignUsd: numeric('fees_foreign_usd', { precision: 12, scale: 2 }),
        allowTimeTrials: boolean('allow_time_trials').notNull().default(false),
        allowClaims: boolean('allow_claims').notNull().default(true),
    },
    (table) => ({
        championshipNameDateUnique: uniqueIndex('tournaments_championship_name_date_unique').on(
            table.championshipId,
            table.name,
            table.dateStart
        ),
    })
);

export const minimumMarks = pgTable(
    'minimum_marks',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        eventId: uuid('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
        ageGroupId: uuid('age_group_id').references(() => ageGroups.id, { onDelete: 'cascade' }),
        gender: char('gender', { length: 1 }).notNull(),
        championshipTypeId: uuid('championship_type_id')
            .notNull()
            .references(() => championshipTypes.id),
        timeValue: text('time_value').notNull(),
        year: integer('year').notNull(),
    },
    (table) => ({
        eventIdx: index('idx_minimum_marks_event').on(table.eventId),
        typeIdx: index('idx_minimum_marks_type').on(table.championshipTypeId),
        uniqueMark: uniqueIndex('minimum_marks_unique').on(
            table.eventId,
            table.categoryId,
            table.ageGroupId,
            table.gender,
            table.championshipTypeId,
            table.year
        ),
    })
);

export const entries = pgTable(
    'entries',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        athleteId: uuid('athlete_id')
            .notNull()
            .references(() => athletes.id, { onDelete: 'cascade' }),
        eventId: uuid('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        tournamentId: uuid('tournament_id')
            .notNull()
            .references(() => tournaments.id, { onDelete: 'cascade' }),
        entryTime: text('entry_time'),
        status: text('status').notNull().default('pending'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        athleteEventTournamentUnique: uniqueIndex('entries_athlete_event_tournament_unique').on(
            table.athleteId,
            table.eventId,
            table.tournamentId
        ),
    })
);

export const results = pgTable(
    'results',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        entryId: uuid('entry_id')
            .notNull()
            .references(() => entries.id, { onDelete: 'cascade' }),
        timeValue: text('time_value').notNull(),
        place: integer('place').notNull(),
        points: integer('points').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        entryUnique: uniqueIndex('results_entry_unique').on(table.entryId),
        placeIdx: index('idx_results_place').on(table.place),
    })
);

export const rankings = pgTable(
    'rankings',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        year: integer('year').notNull(),
        eventId: uuid('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
        ageGroupId: uuid('age_group_id').references(() => ageGroups.id, { onDelete: 'cascade' }),
        gender: char('gender', { length: 1 }).notNull(),
        position: integer('position').notNull(),
        athleteId: uuid('athlete_id')
            .notNull()
            .references(() => athletes.id, { onDelete: 'cascade' }),
        timeValue: text('time_value').notNull(),
    },
    (table) => ({
        rankingUnique: uniqueIndex('rankings_unique').on(
            table.year,
            table.eventId,
            table.categoryId,
            table.ageGroupId,
            table.gender,
            table.position
        ),
        eventIdx: index('idx_rankings_event').on(table.eventId),
        athleteIdx: index('idx_rankings_athlete').on(table.athleteId),
    })
);

export const relayTeams = pgTable(
    'relay_teams',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        tournamentId: uuid('tournament_id')
            .notNull()
            .references(() => tournaments.id, { onDelete: 'cascade' }),
        eventId: uuid('event_id')
            .notNull()
            .references(() => events.id, { onDelete: 'cascade' }),
        clubId: uuid('club_id')
            .notNull()
            .references(() => clubs.id, { onDelete: 'cascade' }),
        name: text('name'),
    },
    (table) => ({
        relayTeamUnique: uniqueIndex('relay_teams_unique').on(
            table.tournamentId,
            table.eventId,
            table.clubId
        ),
    })
);

export const relayTeamMembers = pgTable(
    'relay_team_members',
    {
        relayTeamId: uuid('relay_team_id')
            .notNull()
            .references(() => relayTeams.id, { onDelete: 'cascade' }),
        athleteId: uuid('athlete_id')
            .notNull()
            .references(() => athletes.id, { onDelete: 'cascade' }),
        laneOrder: integer('lane_order').notNull(),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.relayTeamId, table.athleteId] }),
        relayLaneUnique: uniqueIndex('relay_team_members_lane_unique').on(
            table.relayTeamId,
            table.laneOrder
        ),
    })
);

export const relayResults = pgTable(
    'relay_results',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        relayTeamId: uuid('relay_team_id')
            .notNull()
            .references(() => relayTeams.id, { onDelete: 'cascade' }),
        timeValue: text('time_value').notNull(),
        place: integer('place').notNull(),
        points: integer('points').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => ({
        relayTeamUnique: uniqueIndex('relay_results_team_unique').on(table.relayTeamId),
    })
);

export const teamScores = pgTable(
    'team_scores',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        tournamentId: uuid('tournament_id')
            .notNull()
            .references(() => tournaments.id, { onDelete: 'cascade' }),
        clubId: uuid('club_id').references(() => clubs.id, { onDelete: 'cascade' }),
        leagueId: uuid('league_id').references(() => leagues.id, { onDelete: 'cascade' }),
        totalPoints: integer('total_points').notNull().default(0),
    },
    (table) => ({
        teamScoreUnique: uniqueIndex('team_scores_unique').on(
            table.tournamentId,
            table.clubId,
            table.leagueId
        ),
    })
);

export const awards = pgTable('awards', {
    id: uuid('id').defaultRandom().primaryKey(),
    tournamentId: uuid('tournament_id')
        .notNull()
        .references(() => tournaments.id, { onDelete: 'cascade' }),
    awardType: text('award_type').notNull(),
    athleteId: uuid('athlete_id').references(() => athletes.id),
    clubId: uuid('club_id').references(() => clubs.id),
    leagueId: uuid('league_id').references(() => leagues.id),
    eventId: uuid('event_id').references(() => events.id),
    place: integer('place'),
    note: text('note'),
});
