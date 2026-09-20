Change the app styling by changing the background color, font type and button color
# Project Journal

## September 3, 2026

### What I worked on
Focused on turning the base habit tracker into something that actually feels usable day to day, styling, navigation, dashboard summary data, and fixing a couple of bugs that came up along the way.

### Changes made

**Styling**
- Set background color to `#FEFEFE`.
- Set primary button color to `#8B3DFF`.
- Applied Inter as the font across the whole app.
- Made all buttons fully rounded.

**Navigation**
- Added a persistent side navigation bar with three sections: Dashboard, My Habits, Settings.
- Dashboard shows the streak view and daily overview.
- My Habits holds the full habit list with add, edit, delete, and mark-done controls.
- Settings is a placeholder page for now, not functional yet.

**Dashboard**
- Added an "Add Habit" button directly on the Dashboard. It reuses the existing add-habit logic instead of duplicating it.
- Added a "Completed Today" card showing habits done today out of total habits.
- Added a "Today's Progress" card showing the same data as a percentage with a progress bar.
- Added a daily streak row per habit, showing the last several days. Days marked done are shown in the primary color. Today is highlighted in the primary color when marked done.

**Notifications and profile (top right header)**
- Added a notification bell and profile icon to the top right of the header.
- Decided notifications should be functional, not just placeholders: a new habit being added now creates a real notification.
- Decided notifications should **not** disappear or mark as read for now. They just accumulate. Chose this to keep v1 simple. Will revisit if the list grows long enough to need a read/unread state.
- The profile icon stays a placeholder for now, since login and accounts are still out of scope for this version.

### Bugs found and fixed

**Bug 1: Could not add a habit**
- The add-habit flow was broken and needed investigation before anything else could be tested properly.
- Fixed by having the coding agent trace the form, the API route, and the database call to find where the request was failing.

**Bug 2: "Completed Today" and "Today's Progress" stuck at 0**
- Both dashboard cards showed 0 even after marking a habit done.
- Root cause was that the dashboard was not updating or recalculating after a habit's status changed, it was only reading data on initial page load.
- Fixed so both cards now update immediately when a habit is marked done or unmarked, and stay in sync with each other.

### Decisions and why
- Kept Settings as an empty placeholder rather than building real settings now, to avoid expanding scope before core functionality was solid.
- Made notifications real (not just visual) once it became clear they needed to reflect actual events like new habits being added, but kept the logic simple: no read/unread tracking yet.
- Treated the two dashboard bugs as one investigation since they were likely sharing the same broken data source, rather than debugging them separately.

### What I parked for later
- Real settings functionality.
- Read/unread state for notifications.
- Login and account system (data model already supports this being added later without a rebuild).
- Any timezone handling beyond the browser's local date.

### Next
- Test the app across a few real days to confirm streaks and progress numbers behave correctly over time, not just in a single session.
- Write this week's Build in Public post about the two dashboard bugs, what broke and how they were found.
### Styling & Design Token Refactor
- Parsed `design-tokens.tokens (1).json` and converted all design tokens (colors, spacing, typography, grids, borders, radii, mapped component styles) into CSS custom properties in `:root` within `src/app/globals.css`.
- Refactored existing CSS in `src/app/globals.css` to consume matching token variables (`var(--alias-primary-default)`, `var(--alias-neutral-white)`, `var(--alias-boarder-width-sm)`, `var(--alias-boarder-width-none)`, `var(--brand-scale-150)`).
- Identified non-matching hardcoded values (off-white page background `#FEFEFE`, slate text/borders `#0f172a`, `#e2e8f0`, `#cbd5e1`, hover purple `#782CE6`, and animation timing `0.2s`/`2s`) and preserved them to ensure no layout or visual regressions.
- Verified build and TypeScript compilation with `npx next build`.
## September 19, 2026
What I worked on
Built out the full Settings page. It was left as a placeholder earlier ("Settings coming soon") since login and accounts were out of scope for v1. Today's work added real, working settings without adding a full account system.

## Changes made

## Theme (light/dark mode)
Added a toggle to switch between light and dark mode.
Stored as a browser preference (local storage), since it is a personal display setting, not app data.
Applied across the whole app, not just the Settings page. Defaults to light mode if nothing is saved yet.

## Notification preferences
Added an on/off toggle for notifications.
Stored on the User record in the database, since it needs to persist and affect real backend behavior, not just be a visual setting.
When off, no new notifications are created, in-app or push.

## Display name
Added a field to set and update a display name.
Stored on the existing User record. This is just a label, not a real account or login.
Shown next to the profile icon in the header.

## Display picture
Added the ability to upload a profile picture.
Stored directly in the database through Prisma, rather than using an external file storage service, to stay within the free-tier constraint.
Limited file size and restricted to common image types, with a clear error if the upload doesn't meet those limits.
Falls back to the existing placeholder icon if no picture has been uploaded.

## Real push notifications
Implemented real browser push notifications using the standard Web Push API, so notifications can arrive even when the app or browser tab is closed.
Added a service worker to handle receiving and displaying push notifications.
Notification permission is requested through a clear action in Settings, not automatically on page load.
Added a new database model to store push subscriptions, linked to the user.
New habits now trigger a real push notification, in addition to the existing in-app notification.
Push notifications respect the same on/off preference as in-app notifications.

## Delete all data (reset app)
Added a "Delete All Data" option that removes all habits and habit entries.
Requires a confirmation step before running, since this action cannot be undone.
Does not delete the user's profile, display name, picture, or theme preference, only habit data.
Decisions and why
Kept display name and picture as simple labels, not a real account system, to avoid building login before it's actually needed.
Chose to store the profile picture directly in the database instead of using a separate file storage service, to keep everything on free tiers without adding a new paid dependency.
Treated push notifications as a distinct, larger feature rather than a small addition, since it required new infrastructure (service worker, stored subscriptions, permission handling), not just a UI change.
Required confirmation before deleting all data, since this is the first genuinely destructive action in the app.
What I parked for later
Real login and multi-user accounts. Settings still work per single fixed user record.
Any styling or customization of push notification content beyond the basic new-habit alert.
Commit approach

Committed all six settings features together in one commit this round, since they were built and delivered as a single batch. Plan to go back to committing feature by feature as each one is finished, rather than in one large batch, for clearer history going forward.

## Next
Confirm push notifications actually arrive correctly across a browser restart, not just immediately after granting permission.
Split future feature batches into individual commits as they're completed, instead of committing everything at the end.