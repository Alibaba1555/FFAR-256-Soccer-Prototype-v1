// Edit these fixtures to change the prototype week, fees, players or products.
// Each five-a-side lineup lists Green's five positions, then Cream's five.
// Position order for each team: GK, LD, RD, LF, RF. null is an open spot.
window.ClubData = {
  brand: 'Title',
  week: ['2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27','2026-11-28','2026-11-29'],
  featured: 'sun-pickup',
  sessions: [
    { id: 'tue-afterwork', mode: 'pickup', title: 'After-work pickup', date: '2026-11-24', start: '18:00', end: '19:00', level: 'All levels', ages: '16–18', fee: 12,
      players: ['Sam',null,'Kai','Maya',null,null,'Cam','Léo',null,'Jules'] },
    { id: 'thu-lights', mode: 'pickup', title: 'Under the lights', date: '2026-11-26', start: '19:30', end: '20:30', level: 'Intermediate', ages: '18+', fee: 14,
      players: ['Rae','Tom',null,'Ari','Noa','Julien',null,'Remy','Ali','Eli'] },
    { id: 'sat-juniors', mode: 'pickup', title: 'Junior kickabout', date: '2026-11-28', start: '10:00', end: '11:00', level: 'Beginner-friendly', ages: '10–13', fee: 8,
      players: [null,'Milo',null,'Lou',null,'Ari',null,'Zoé','Jin',null] },
    { id: 'sun-pickup', mode: 'pickup', title: 'Sunday Pickup', date: '2026-11-29', start: '14:00', end: '15:00', level: 'Beginner-friendly', ages: '18+', fee: 12,
      players: ['Alex','Mia','Theo',null,'Oli','Léa',null,'Max','Jo',null] },

    // These are separate rental windows on the same pitch.
    { id: 'mon-rental', mode: 'field', title: 'Monday field rental', date: '2026-11-23', start: '17:00', end: '18:00', ages: 'All ages', level: 'Private group', fee: 90 },
    { id: 'wed-rental', mode: 'field', title: 'Midweek field rental', date: '2026-11-25', start: '19:00', end: '20:00', ages: 'All ages', level: 'Private group', fee: 110 },
    { id: 'fri-rental', mode: 'field', title: 'Friday field rental', date: '2026-11-27', start: '18:00', end: '19:00', ages: 'All ages', level: 'Private group', fee: 110 },
    { id: 'sun-rental', mode: 'field', title: 'Sunday field rental', date: '2026-11-29', start: '11:00', end: '12:00', ages: 'All ages', level: 'Private group', fee: 100 }
  ],
  products: [
    {id:'shirt', name:'Striped terrace shirt', category:'Vintage jersey', price:45, image:'striped-shirt.webp', alt:'Green and ivory striped soccer shirt with a folded collar.', specs:'Size M · Second-hand · Good condition', description:'A soft collared shirt with wide green stripes. Check the rail beside the café for this sample find.'},
    {id:'shoes', name:'Gum-sole indoors', category:'Footwear', price:65, image:'indoor-shoes.webp', alt:'Cream leather indoor soccer shoes with green detailing and gum soles.', specs:'US 9 · New · Indoor sole', description:'Low-profile indoor shoes with a flat gum sole. A sample from the equipment shelf.'},
    {id:'socks', name:'Matchday socks', category:'Accessories', price:12, image:'match-socks.webp', alt:'Rust-orange soccer socks with ivory hoops.', specs:'Sizes S–L · New · One pair', description:'Ribbed knee-highs with a double stripe. Pick up a spare pair from the pitch-side kit dispenser.'}
  ],
  events: {
    screening: {type:'Match screening',title:'Matchday watch party',date:'Sat, Nov 28 · 15:00–17:00',place:'Screening room & café',entry:'Free entry · All ages',description:'Grab a seat for a match on the big screen. Friends, families and fans can drop in together. The café counter stays open through halftime.',arrival:'Walk in from the café side. Seating is first come, first served.'},
    cup: {type:'Community fundraiser',title:'Community Cup',date:'Sun, Nov 29 · 16:00–18:00',place:'Pitch 01',entry:'Suggested $5 CAD donation · All ages welcome to watch',description:'A friendly five-a-side tournament to help buy boots, balls and training bibs for local youth players. Come cheer from the sideline.',arrival:'Spectators can drop in. Team enquiries go through the pitch-side welcome desk.'}
  },
  rooms: {
    pitch:{title:'Pitch 01',description:'One indoor turf field with five players a side. Join an open lineup or reserve the whole pitch for your group.'},
    shop:{title:'Club shop',description:'A rotating rail of second-hand jerseys, indoor shoes and a kit dispenser for last-minute essentials.'},
    cafe:{title:'Café',description:'Coffee, a quick snack and a view of the pitch. There’s room to stay for a chat after the final whistle.'},
    screen:{title:'Screening room',description:'A projector, benches and space to gather on matchdays. Visitors can come just to watch.'}
  }
};
