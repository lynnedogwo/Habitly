# Habit Tracker MVP

A simple, single-user web app for tracking daily habits. Add a habit, mark it done each day, and watch your streak grow.

Built as part of the Ship & Found Bootcamp, Week 4 Ship Log task.

## What This Is

Habit Tracker MVP lets you:
- Add a habit by name
- Mark it done for today
- Unmark it if you marked it by mistake
- Edit a habit's name
- Delete a habit
- See a running streak count for each habit
- See a running streak count and a 7-day streak row for each habit
- See a Dashboard with Completed Today and Today's Progress summary cards
- Navigate between Dashboard, My Habits, and Settings through a side nav
- Customize the app through a full Settings page: theme, notification preferences, display name, display picture, push notifications, and a delete-all-data reset
There is no login. The app uses a single fixed user record, and all data is stored in a real PostgreSQL database, not the browser.

## Who This Is For

Anyone who wants to track a small number of daily habits (2 to 10) without creating an account or installing anything. Built first as a personal tool and portfolio piece, not as a multi-user product.

## What This Is Not (Out of Scope for v1)

- No login or multiple accounts
- No habit categories or tags
- No quantity-based habits (only done / not done)
- No weekly or custom frequency habits, daily only
- No charts or analytics beyond the streak number
- No mobile app
- No AI features
- No vector database or search
Notifications and push notifications were originally out of scope for v1 but were added deliberately afterward, see the Project Journal for that decision.
These are documented decisions, not oversights. Keeping v1 this small was intentional, to ship something real and working in one week.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL

All services used are on free tiers, sufficient to build and test for several weeks without payment.

## How It Works

- Each habit belongs to a single, automatically created user record.
- Marking a habit "done" creates a `HabitEntry` row for that habit and today's date.
- Streaks are not stored directly. They are calculated by reading a habit's entries, ordered by date, and counting backward from today until a gap is found.
- "Today" is based on the browser's local date. There is no timezone conversion in v1.

## Data Model

```prisma
model User {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  habits    Habit[]
}
// Additional fields added later for Settings:
// displayName, profilePicture, notificationsEnabled, pushSubscriptions
model Habit {
  id        String       @id @default(cuid())
  name      String
  createdAt DateTime     @default(now())
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  entries   HabitEntry[]
}

model HabitEntry {
  id        String   @id @default(cuid())
  date      DateTime
  done      Boolean  @default(true)
  habitId   String
  habit     Habit    @relation(fields: [habitId], references: [id])

  @@unique([habitId, date])
}
```
// Added later to support push notifications:
// model PushSubscription { linked to User, stores browser push subscription data }

## Setup

1. Clone this repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Set up your `DATABASE_URL` environment variable, pointing to a free-tier PostgreSQL database.
4. Run the initial Prisma migration:
   ```
   npx prisma migrate dev
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## Key Decisions and Why

- **No login in v1:** Removes setup friction. A single fixed user record still stores data in a real database, so the door stays open for real accounts later.
- **Streak resets on first missed day:** Simplest rule to build, test, and explain. No grace periods in v1.
- **No local storage:** Data lives in PostgreSQL through Prisma from the start, so nothing needs to be rebuilt when accounts are added later.
- **Built by describing features to an AI coding tool:** No hand-written code, per the project's build constraint.
- **Notifications made real, not just placeholders:** Originally planned as a visual-only badge, but changed to track real events once it became clear a placeholder would not actually be useful to test.
- **Profile picture stored directly in the database:** Avoids adding a separate paid file storage service, keeping everything on free tiers.
- **Push notifications added despite being more complex than in-app notifications:** Chosen deliberately to make the app genuinely useful day to day. Uses the free, standard Web Push API, no paid service required.
- **Settings page combined into fewer, tighter sections after initial build:** Reworked the layout after the first version felt too spread out, grouping display name and picture into one Profile section.

## Known Limitations

- No timezone handling. If your system clock or timezone is wrong, "today" may show incorrectly.
- Single user only. Not meant to be shared publicly as a multi-user tool yet.
- No safeguards against free-tier database limits, though usage at this scale should stay well within them.
- Push notifications require the user to grant browser permission. If denied, they simply will not arrive.

## Project Journal

See `JOURNAL.md` for a running log of what was built, decided, and parked each day.

## Status

Version 1 (MVP), built in Week 4 of the Ship & Found Bootcamp.
