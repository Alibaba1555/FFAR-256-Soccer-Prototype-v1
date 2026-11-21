# Title

An English-language FFAR 256 prototype for a Montréal indoor soccer facility. The sample week is November 23–29, 2026, in Montréal time. “Title” is the working name.

## Run

Extract the whole ZIP to a folder, then double-click **index.html** in Edge, Chrome, Firefox or Safari. Keep the scripts, stylesheet and assets together. The prototype uses local files and runs offline.

## One-minute demo

1. Select **Find a game**, then select November 29 in the date filter and **View lineup** on Sunday Pickup.
2. Choose a shirt marked **+**. Select a second open shirt to see the ball pass between the positions. **Any open spot** also works.
3. Enter a nickname if desired and confirm. Return to the lineup to see your shirt and the updated number of openings.
4. Open **My tickets** to replay a ticket. **Release booking** restores its spot for another demonstration.

For a group rental, use **Book a field**, choose a time and reserve the whole pitch. The price is per field. Pickup prices are per player.

Tickets stay in this browser when local storage is available. If browser settings prevent local saving, the current page keeps them in memory until it closes or reloads. All prices, people, merchandise and events are illustrative. The prototype processes no payments and shares no bookings between visitors.

## Edit

- **data.js** — change the `brand` value when the group chooses a name. Edit sample sessions, players, prices, events, shop items and room descriptions here. Pickup players are listed in the position order explained at the top of the file.
- **index.html** — page structure, homepage text, event posters and concept floor plan.
- **styles.css** — colours, fonts, responsive layout, shirts, ticket design and motion.
- **pitch.js** — projected field, lineup coordinates, goal nets and ball movement.
- **app.js** — schedule filters, bookings, tickets and navigation.
- **assets/** — bundled WebP concept photographs, club mark and local Roboto typefaces. The photos are AI-generated illustrations of the proposed venue and stock. The Roboto font license is in **assets/fonts/LICENSE.txt**.

For a static host such as GitHub Pages, place index.html and its sibling files in the same publishing directory.

Filter by date, earliest kickoff (Montréal time), listed age group and session level. Searches outside the sample schedule return no matches. Select a shirt to tilt the model and roll the ball to its feet. Occupied positions can be inspected. Reduced motion applies the final position immediately.
