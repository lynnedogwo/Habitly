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
