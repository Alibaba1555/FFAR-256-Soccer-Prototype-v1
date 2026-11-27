// Edit these fixtures to change the prototype week, fees, players or products.
// Each five-a-side lineup lists Green's five positions, then Cream's five.
// Position order for each team: GK, LD, RD, LF, RF. null is an open spot.
window.ClubData = {
  brand: "Fut de l'ile",
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
    {"id": "arsenal", "price": 76, "name": "Arsenal jersey", "category": "Football jersey", "image": "kits/arsenal.webp", "alt": "Arsenal football shirt. Navy and burgundy hoops.", "specs": "Navy and burgundy hoops", "description": "A fine gold line runs around the foldover collar and sleeve cuffs, picking up the gold lettering across the chest.", "priceReference": "The Kitman · 2007/08 third shirt, size L · £39.99", "priceUrl": "https://www.thekitman.co.uk/product/2007-08-arsenal-third-shirt-l/"},
    {"id": "bayern-munich", "price": 80, "name": "Bayern Munich jersey", "category": "Football jersey", "image": "kits/bayern-munich.jpg", "alt": "Bayern Munich football shirt. Red and blue stripes.", "specs": "Red and blue stripes", "description": "Wide vertical stripes run down the front. Three white shoulder stripes frame the gold badge at the centre of the chest.", "priceReference": "Myretrokits · 2014/15 home shirt, Lewandowski print · CA$80", "priceUrl": "https://myretrokits.com/products/bayern-munich-2014-15-lewandowski-home-jersey-1"},
    {"id": "paris-saint-germain", "price": 34, "name": "Paris Saint-Germain jersey", "category": "Football jersey", "image": "kits/paris-saint-germain.jpg", "alt": "Paris Saint-Germain football shirt. Navy with a centre stripe.", "specs": "Navy with a centre stripe", "description": "A narrow red and white stripe runs from the collar to the hem, interrupted by the Fly Emirates lettering.", "priceReference": "Revive Sports · 2014/15 home shirt, youth size 12–13 · £17.99", "priceUrl": "https://revivesports.co.uk/shop/paris-saint-germain-shirt-kids-12-13-blue-home-2014-2015-nike-soccer-jersey-5860"},
    {"id": "sporting-cp", "price": 264, "name": "Sporting CP jersey", "category": "Football jersey", "image": "kits/sporting-cp.webp", "alt": "Sporting CP football shirt. Green and white hoops.", "specs": "Green and white hoops", "description": "The hoops continue across the sleeves. A square black PT sponsor and an off-centre Reebok wordmark stand out against the white bands.", "priceReference": "KitComps · 2002/03 home shirt, median of four resale transactions · £140", "priceUrl": "https://kitcomps.com/kits/sporting-cp-2002-03-home/"},
    {"id": "greece", "price": 72, "name": "Greece jersey", "category": "Football jersey", "image": "kits/greece.jpg", "alt": "Greece football shirt. Blue No. 20.", "specs": "Blue No. 20", "description": "White panels curve from the collar over the shoulders. A dotted number 20 sits beside the Greek crest.", "priceReference": "Headlock · 2004 home shirt, size L · £38", "priceUrl": "https://headlock.co/products/greece-2004-adidas-home-football-shirt-blue-l"},
    {"id": "brazil", "price": 70, "name": "Brazil jersey", "category": "Football jersey", "image": "kits/brazil.jpg", "alt": "Brazil football shirt. Yellow with green panels.", "specs": "Yellow with green panels", "description": "Tapered green panels frame the bright yellow front. Five stars sit above the crest on the left chest.", "priceReference": "Classic 90 · Brazil 2002 retro home shirt · £36.99", "priceUrl": "https://classic-90.com/products/brazil-2002-home-shirt"},
    {id:'shirt', hidden:true, name:'Striped terrace shirt', category:'Vintage jersey', price:45, image:'striped-shirt.webp', alt:'Green and ivory striped soccer shirt with a folded collar.', specs:'Size M · Second-hand · Good condition', description:'A soft collared shirt with wide green stripes.'},
    {id:'shoes', hidden:true, name:'Gum-sole indoors', category:'Footwear', price:65, image:'indoor-shoes.webp', alt:'Cream leather indoor soccer shoes with green detailing and gum soles.', specs:'US 9 · New · Indoor sole', description:'Low-profile indoor shoes with a flat gum sole. A sample from the equipment shelf.'},
    {id:'socks', hidden:true, name:'Matchday socks', category:'Accessories', price:12, image:'match-socks.webp', alt:'Rust-orange soccer socks with ivory hoops.', specs:'Sizes S–L · New · One pair', description:'Ribbed knee-highs with a double stripe. Pick up a spare pair from the pitch-side kit dispenser.'}
  ],
  events: {
    screening: {type:'Match screening',title:'Matchday watch party',date:'Sat, Nov 28 · 15:00–17:00',place:'Pitch-side seating area',entry:'Free entry · All ages',description:'Watch the match live on the projector beside the 11-a-side field.',arrival:'Seating is first come, first served.'},
    cup: {type:'Community fundraiser',title:'Community Cup',date:'Sun, Nov 29 · 16:00–18:00',place:'Pitch 01',entry:'Suggested $5 CAD donation · All ages welcome to watch',description:'A friendly five-a-side tournament to help buy boots, balls and training bibs for local youth players. Come cheer from the sideline.',arrival:'Spectators can drop in. Team enquiries go through the pitch-side welcome desk.'}
  },
  rooms: {
    pitch:{title:'5-a-side court 1',description:'One indoor turf field with five players a side. Join an open lineup or reserve the whole pitch for your group.'},
    shop:{title:'Club shop',description:'A rotating rail of second-hand jerseys, indoor shoes and a kit dispenser for last-minute essentials.'},
    court2:{title:'5-a-side court 2',description:'The second small-sided court sits beside Court 1.'},
    locker1:{title:'Locker room 1',description:'Changing room beside the two smaller courts.'},
    locker2:{title:'Locker room 2',description:'Changing room next to the club shop.'},
    field11:{title:'11-a-side field',description:'The main field runs alongside the two smaller courts, with seating at the near end.'},
    screen:{title:'Seating and live viewing',description:'A projector, benches and space to gather on matchdays. Visitors can come just to watch.'}
  }
};
