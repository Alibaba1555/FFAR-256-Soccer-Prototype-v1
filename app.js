/* Booking, weekly schedule and the supporting club pages. */
(() => {
  'use strict';
  const {brand, sessions, week, products, events, rooms, featured} = window.ClubData;
  const {spots, Lineup, renderTurf, reducedMotion} = window.ClubPitch;
  const $ = id => document.getElementById(id);
  const sessionById = new Map(sessions.map(session => [session.id, session]));
  const storageKey = 'ffar256.title.bookings.v1';
  const booking = $('booking-dialog');
  const info = $('info-dialog');
  const view = {mode: 'pickup', day: 'all', session: null, spot: null, inspected: null, page: 'lineup', info: null};
  const shortDate = new Intl.DateTimeFormat('en-CA', {weekday:'short', month:'short', day:'numeric', timeZone:'UTC'});
  const weekday = new Intl.DateTimeFormat('en-CA', {weekday:'short', timeZone:'UTC'});
  const dayDate = day => new Date(day+'T12:00:00Z');
  const dateText = day => shortDate.format(dayDate(day));
  const dayText = day => weekday.format(dayDate(day));
  const times = s => `${s.start}–${s.end}`;
  const ages = s => s.ages === 'All ages' ? s.ages : `Ages ${s.ages}`;
  const escapeText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
  const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  let canSave = true;
  let tickets = readTickets({});
  let bookingOpener = null;
  let infoOpener = null;
  let flight = null;
  let issueTimer = 0;
  const lineup = new Lineup($('field-scene'), chooseSpot);

  function readTickets(fallback) {
    try {
      const text = localStorage.getItem(storageKey);
      if (!text) return {};
      const saved = JSON.parse(text);
      const result = {};
      for (const [id, record] of Object.entries(saved || {})) {
        const s = sessionById.get(id);
        if (!s || !record || typeof record.name !== 'string' || !/^T-[A-F0-9]{6}$/.test(record.code)) continue;
        if (s.mode === 'pickup' && (!Number.isInteger(record.spot) || record.spot < 0 || record.spot >= spots.length || s.players[record.spot])) continue;
        result[id] = {name:record.name.slice(0,18), code:record.code, spot:s.mode==='field' ? null : record.spot};
      }
      return result;
    } catch {
      return fallback;
    }
  }

  function writeTickets(next) {
    tickets = next;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      canSave = true;
    } catch {
      canSave = false;
    }
    updateTicketCount();
    renderCards();
  }

  function updateTicketCount() {
    const count = Object.keys(tickets).length;
    $('ticket-count').hidden = !count;
    $('ticket-count').textContent = String(count);
    $('my-tickets').setAttribute('aria-label', `My tickets, ${count} saved`);
    const game = sessionById.get(featured);
    const saved = Boolean(tickets[game.id]);
    const pass = $('feature-pass');
    pass.setAttribute('aria-label', (saved ? 'Open ticket for ' : 'Open the lineup for ')+game.title);
    pass.querySelector('.pass-main b').textContent = game.title;
    pass.querySelector('.pass-main span').textContent = game.start+' · '+(saved ? 'View ticket' : 'View lineup');
    pass.querySelector('.pass-date strong').textContent = Number(game.date.slice(-2));
    pass.querySelector('.pass-date small').textContent = new Intl.DateTimeFormat('en-CA',{month:'short',timeZone:'UTC'}).format(dayDate(game.date));
  }

  function openSpots(s) {
    const owned = tickets[s.id]?.spot;
    return s.players ? s.players.reduce((sum, player, i) => sum + Number(!player && i !== owned), 0) : 0;
  }

  function availability(s) {
    if (s.mode === 'field') return tickets[s.id] ? 'Field booked' : 'Field available';
    const count = openSpots(s);
    return count ? `${count} ${count === 1 ? 'spot' : 'spots'} left` : 'Full lineup';
  }

  function renderDays() {
    const buttons = [{key:'all', label:'All days'}, ...week.map(date => ({
      key:date, label:`${dayText(date)} ${Number(date.slice(-2))}`
    }))];
    $('days').innerHTML = buttons.map(d => `<button data-day="${d.key}" aria-pressed="${view.day === d.key}">${d.label}</button>`).join('');
  }

  const miniObserver = new ResizeObserver(entries => {
    for (const {target} of entries) {
      const session = sessionById.get(target.dataset.preview);
      if (session && target.isConnected) renderMini(target,session);
    }
  });

  function renderMini(canvas,s) {
    const players = s.players?.slice();
    if (players && tickets[s.id]) players[tickets[s.id].spot] = 'You';
    renderTurf(canvas, {mini:true, rental:s.mode === 'field', players});
  }

  function renderCards() {
    miniObserver.disconnect();
    const matches = sessions.filter(s => s.mode === view.mode && (view.day === 'all' || s.date === view.day));
    const colours = ['#244b38','#364f40','#475337','#1b4a39'];
    $('session-grid').innerHTML = matches.map(s => {
      const field = s.mode === 'field';
      const action = tickets[s.id] ? 'View ticket' : field ? 'Book field' : 'View lineup';
      return `<article class="session-card">
        <div class="match-banner" style="--banner:${colours[sessions.indexOf(s)%4]}">
          <div class="date-stamp"><span class="short-day">${dayText(s.date)}</span><strong>${Number(s.date.slice(-2))}</strong></div>
          <canvas class="mini-pitch" data-preview="${s.id}" aria-hidden="true"></canvas>
        </div>
        <div class="session-body"><p class="session-kind">${availability(s)}</p><h3>${s.title}</h3>
          <p class="session-meta">${icon('clock')}${times(s)}</p><p class="session-age">${s.level} · ${ages(s)}</p>
          <div class="session-bottom"><span class="session-price"><b>$${s.fee}</b> CAD / ${field ? 'field' : 'player'}</span><button class="text-button" data-open="${s.id}" aria-label="${action} for ${s.title}">${action}</button></div>
        </div></article>`;
    }).join('');
    if (!matches.length) {
      $('session-grid').innerHTML = `<p class="empty-schedule">No ${view.mode === 'pickup' ? 'pickup sessions' : 'field rentals'} on ${dateText(view.day)}. <button class="text-button" id="show-week">Show all days</button></p>`;
      $('show-week').addEventListener('click', () => changeDay('all', true));
    }
    $('session-grid').querySelectorAll('canvas').forEach(c => {
      renderMini(c, sessionById.get(c.dataset.preview));
      miniObserver.observe(c);
    });
    $('schedule-status').textContent = `${matches.length} ${view.mode === 'pickup' ? 'open-play sessions' : 'field rentals'} shown.`;
  }

  function changeDay(day, focusFilter = false) {
    view.day = day;
    // Keep the active filter button in the document when it has keyboard focus.
    $('days').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.day === day)));
    renderCards();
    if (focusFilter) $('days').querySelector(`[data-day="${day}"]`).focus();
  }

  function changeMode(mode) {
    view.mode = mode;
    document.querySelectorAll('.mode-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    changeDay('all');
  }

  function closeNav() {
    $('main-nav').classList.remove('is-open');
    $('menu-toggle').setAttribute('aria-expanded','false');
    $('menu-toggle').setAttribute('aria-label','Open navigation');
  }

  function syncScrollLock() {
    document.body.classList.toggle('dialog-open', booking.open || info.open);
  }

  function focusWithoutScroll(element) {
    if (element?.isConnected) element.focus({preventScroll:true});
  }

  function closeBooking() {
    if (booking.open) booking.close();
  }

  function closeInfo() {
    if (info.open) info.close();
  }

  function flyFromMiniature(source) {
    if (!source || reducedMotion() || view.page !== 'lineup') return;
    const first = source.getBoundingClientRect();
    const last = $('field-scene').getBoundingClientRect();
    if (first.width < 1 || last.width < 1 || first.bottom < 0 || first.top > innerHeight) return;
    const clone = document.createElement('canvas');
    clone.className = 'pitch-flight';
    clone.setAttribute('aria-hidden','true');
    clone.width = source.width;
    clone.height = source.height;
    const context = clone.getContext('2d');
    context.fillStyle = '#1d402e';
    context.fillRect(0,0,clone.width,clone.height);
    context.drawImage(source,0,0);
    Object.assign(clone.style, {left:first.left+'px',top:first.top+'px',width:first.width+'px',height:first.height+'px'});
    booking.append(clone);
    const end = `translate(${last.left-first.left}px,${last.top-first.top}px) scale(${last.width/first.width},${last.height/first.height})`;
    flight = clone.animate([
      {transform:'none',opacity:.96}, {transform:end,opacity:.86,offset:.78}, {transform:end,opacity:0}
    ], {duration:530,easing:'cubic-bezier(.22,.76,.25,1)'});
    flight.onfinish = flight.oncancel = () => clone.remove();
  }

  function openSession(id, opener, options = {}) {
    const s = sessionById.get(id);
    if (!s) return;
    closeInfo();
    closeNav();
    bookingOpener = opener;
    view.session = s;
    view.spot = tickets[id]?.spot ?? null;
    view.inspected = null;
    $('booking-name').value = '';
    if (!booking.open) booking.showModal();
    syncScrollLock();
    if (tickets[id] && !options.lineup) {
      showTicket(false);
      return;
    }
    showLineup();
    flyFromMiniature(options.source);
  }

  function showLineup() {
    view.page = 'lineup';
    $('ticket-frame').hidden = true;
    $('booking-frame').hidden = false;
    booking.setAttribute('aria-labelledby','booking-title');
    const s = view.session;
    const rental = s.mode === 'field';
    $('book-kicker').textContent = `Match centre / ${rental ? 'Full field' : 'Open play'}`;
    $('booking-title').textContent = rental ? 'Book the pitch.' : 'Pick your spot.';
    $('summary-type').textContent = rental ? 'Private field rental' : 'Five-a-side pickup';
    $('summary-name').textContent = s.title;
    $('summary-facts').innerHTML = [
      ['Date', dateText(s.date)],['Kickoff',times(s)],['Level',s.level],['Players',ages(s)],['Rate',`$${s.fee} CAD / ${rental ? 'field' : 'player'}`]
    ].map(([k,v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('booking-scroll').scrollTop = 0;
    view.spot = tickets[s.id]?.spot ?? view.spot;
    lineup.load(s,tickets[s.id]);
    lineup.update(view.spot,tickets[s.id],false);
    updateBooking();
    focusWithoutScroll($('booking-title'));
  }

  function updateBooking() {
    const s = view.session;
    const ticket = tickets[s.id];
    const rental = s.mode === 'field';
    const chosen = spots[view.spot];
    const inspected = spots[view.inspected];
    const detail = $('pick-detail');
    const confirm = $('confirm-booking');
    $('board-score').textContent = ticket ? (rental ? 'Field reserved' : `You’re in · ${availability(s)}`) : availability(s);
    $('arena-bottom').innerHTML = rental ? '<span>Private rental · Both goals included</span>' :
      `<span class="team-key"><i class="green"></i>Green<i class="cream"></i>Cream</span>${!ticket && openSpots(s) ? '<button class="any-spot" id="any-spot">Any open spot</button>' : '<span>5-a-side</span>'}`;
    if ($('any-spot')) $('any-spot').addEventListener('click', () => {
      // Keep repeated taps useful by moving to the next available shirt.
      const available = spots.map((_, i) => i).filter(i => !s.players[i]);
      if (available.length) chooseSpot(available[(available.indexOf(view.spot)+1) % available.length], true);
    });
    const full = !rental && !ticket && openSpots(s) === 0;
    $('name-field').hidden = !!ticket || full;
    detail.classList.toggle('is-selected', !!ticket || !!chosen || rental);
    if (ticket) {
      detail.innerHTML = `<b>${rental ? 'Your group has the field.' : 'You’re on the lineup.'}</b><p>${rental ? 'Both teams share this rental window.' : `${chosen.team} team · ${chosen.name}`}</p>`;
    } else if (rental) {
      detail.innerHTML = '<b>One pitch for your group.</b><p>This price covers the entire hour. Bring up to 10 players for five-a-side.</p>';
    } else if (full) {
      detail.innerHTML = '<b>This session is full.</b><p>Check the weekly schedule for another game.</p>';
    } else if (inspected && s.players[view.inspected]) {
      detail.innerHTML = `<b>${escapeText(s.players[view.inspected])} · Spot taken</b><p>${inspected.team} team · ${inspected.name}. Choose a shirt marked + to join.</p>`;
    } else if (chosen) {
      detail.innerHTML = `<b>${chosen.team} team · ${chosen.name}</b><p>This is a starting position. You can switch during the game.</p>`;
    } else {
      detail.innerHTML = '<b>Choose a shirt marked +.</b><p>Joining solo? Pick either team or use “Any open spot”.</p>';
    }
    confirm.disabled = !ticket && !rental && !chosen;
    confirm.textContent = ticket ? 'View my ticket' : rental ? `Reserve field · $${s.fee}` : `Confirm spot · $${s.fee}`;
    $('foot-selection').textContent = ticket ? 'Booking confirmed' : rental ? 'Whole pitch selected' :
      full ? 'No open positions' : chosen ? `${chosen.team} · ${chosen.name}` : inspected ? `${s.players[view.inspected]} · Spot taken` : 'Select an open position';
  }

  function chooseSpot(i, refocusAny = false) {
    const s = view.session;
    if (!s || s.mode !== 'pickup' || tickets[s.id]) return;
    view.inspected = i;
    view.spot = s.players[i] ? null : i;
    lineup.update(view.spot,null);
    updateBooking();
    if (refocusAny) focusWithoutScroll($('any-spot'));
  }

  function confirmBooking() {
    const s = view.session;
    if (!s || view.page !== 'lineup') return;
    // Re-read other tabs' bookings before applying this local change.
    const latest = canSave ? readTickets(tickets) : tickets;
    if (latest[s.id]) {
      tickets = latest;
      showTicket(false);
      return;
    }
    if (s.mode === 'pickup' && (view.spot === null || s.players[view.spot])) return;
    const bytes = crypto.getRandomValues(new Uint8Array(3));
    const code = 'T-'+Array.from(bytes,n => n.toString(16).padStart(2,'0')).join('').toUpperCase();
    const record = {name:$('booking-name').value.trim() || 'You',spot:s.mode === 'field' ? null : view.spot,code};
    writeTickets({...latest,[s.id]:record});
    lineup.update(view.spot,record,false);
    updateBooking();
    const score = $('board-score');
    score.textContent = s.mode === 'field' ? 'FIELD RESERVED' : 'YOU’RE IN';
    if (reducedMotion()) {
      showTicket(true);
    } else {
      view.page = 'issuing';
      $('confirm-booking').disabled = true;
      score.classList.remove('score-flip');
      void score.offsetWidth;
      score.classList.add('score-flip');
      issueTimer = window.setTimeout(() => {
        if (booking.open && view.page === 'issuing' && view.session === s) showTicket(true);
      }, 420);
    }
    $('notice').textContent = `Demo ticket confirmed for ${s.title}.`;
  }

  function showTicket(issued) {
    const s = view.session;
    const ticket = tickets[s.id];
    if (!ticket) { showLineup(); return; }
    const rental = s.mode === 'field';
    const position = rental ? null : spots[ticket.spot];
    view.page = 'ticket';
    flight?.cancel();
    $('booking-frame').hidden = true;
    const panel = $('ticket-frame');
    panel.hidden = false;
    panel.classList.toggle('issued',issued);
    panel.innerHTML = `<button class="icon-button dark-close" id="close-ticket" aria-label="Close ticket">${icon('close')}</button>
      <p class="eyebrow">Matchday ticket</p><h2 id="ticket-heading" tabindex="-1">${issued ? 'You’re in.' : 'Your ticket.'}</h2>
      <article class="match-ticket"><div class="ticket-band"><strong>${escapeText(brand)}</strong><span>${rental ? 'Full field' : 'Open play'}</span></div>
        <h3>${s.title}</h3><p class="ticket-time">${dateText(s.date)} · ${times(s)}</p>
        <dl class="ticket-grid"><div><dt>Booked for</dt><dd>${escapeText(ticket.name)}</dd></div><div><dt>Pitch</dt><dd>Indoor 01</dd></div>
          <div><dt>${rental ? 'Access' : 'Team'}</dt><dd>${rental ? 'Private rental' : position.team}</dd></div>
          <div><dt>${rental ? 'Capacity' : 'Starting position'}</dt><dd>${rental ? '10 players' : position.name}</dd></div></dl>
        <div class="ticket-stub"><div><small class="stub-small">${ticket.code} · Demo ticket</small><b>See you on the pitch.</b></div><div class="barcode" aria-hidden="true"></div></div>
      </article><div class="ticket-actions"><button id="back-lineup" class="button primary">${rental ? 'View field' : 'View lineup'}</button><button id="back-schedule" class="button secondary">Back to schedule</button></div>
      <p class="ticket-note">${canSave ? 'Saved in My tickets in this browser.' : 'Available in My tickets while this page is open.'} Demo booking · No payment.</p>`;
    booking.setAttribute('aria-labelledby','ticket-heading');
    $('close-ticket').addEventListener('click',closeBooking);
    $('back-lineup').addEventListener('click',() => {view.inspected=null;showLineup();});
    $('back-schedule').addEventListener('click',() => {
      closeBooking();
      changeMode(s.mode);
      $('play').scrollIntoView({behavior:reducedMotion()?'instant':'smooth'});
      focusWithoutScroll(document.querySelector(`[data-open="${s.id}"]`));
    });
    focusWithoutScroll($('ticket-heading'));
  }

  function showInfo(html, type, opener) {
    if (opener) infoOpener = opener;
    view.info = type;
    $('info-content').innerHTML = html;
    if (!info.open) info.showModal();
    info.scrollTop = 0;
    syncScrollLock();
    focusWithoutScroll($('info-title'));
  }

  function showTickets(opener) {
    const ids = Object.keys(tickets).sort((a,b) => sessionById.get(a).date.localeCompare(sessionById.get(b).date) || sessionById.get(a).start.localeCompare(sessionById.get(b).start));
    const list = ids.map(id => {
      const s = sessionById.get(id);
      const ticket = tickets[id];
      const what = s.mode === 'field' ? 'Whole pitch' : `${spots[ticket.spot].team} · ${spots[ticket.spot].name}`;
      return `<li><strong>${s.title}</strong><small>${dateText(s.date)} · ${s.start} · ${what}</small><div class="saved-actions">
        <button class="text-button" data-ticket="${id}">Open ticket</button>
        <button class="text-button" data-release="${id}">Release booking</button></div><div class="release-slot"></div></li>`;
    }).join('');
    showInfo(`<p class="eyebrow">Your matchdays</p><h2 id="info-title" tabindex="-1">My tickets.</h2>${ids.length ? `<ul class="saved-list">${list}</ul>` : '<p>Your bookings will appear here once you pick a spot or reserve a field.</p><button id="empty-find" class="button primary">Find a game</button>'}`, 'tickets', opener);
    $('empty-find')?.addEventListener('click',() => {
      closeInfo(); changeMode('pickup'); $('play').scrollIntoView();
      focusWithoutScroll(document.querySelector('.mode-switch button'));
    });
  }

  function renderShop() {
    $('shop-grid').innerHTML = products.map(p => `<button class="product-card" data-product="${p.id}" aria-label="View ${p.name}, ${p.price} Canadian dollars">
      <div class="product-img"><img loading="lazy" src="assets/${p.image}" alt="${p.alt}"></div>
      <div class="product-info"><strong>${p.name}</strong><span>$${p.price} CAD</span></div><small>${p.category}</small></button>`).join('');
  }

  function showRoom(id) {
    const item = rooms[id];
    document.querySelectorAll('[data-room]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.room===id)));
    $('room-description').innerHTML = `<strong>${item.title}</strong><p>${item.description}</p>`;
  }

  document.addEventListener('click',e => {
    const button = e.target.closest('button,a');
    if (!button) return;
    const d = button.dataset;
    if (d.mode) { changeMode(d.mode); closeNav(); }
    if (d.day) changeDay(d.day);
    if (d.open) openSession(d.open,button,{source:button.closest('.session-card').querySelector('canvas')});
    if (d.room) showRoom(d.room);
    if (d.event) {
      const ev = events[d.event];
      showInfo(`<p class="eyebrow">${ev.type}</p><h2 id="info-title" tabindex="-1">${ev.title}</h2>
        <div class="detail-specs"><b>${ev.date}</b><span>${ev.place}</span><span>${ev.entry}</span></div><p>${ev.description}</p><p>${ev.arrival}</p>`, 'event', button);
    }
    if (d.product) {
      const p = products.find(item => item.id===d.product);
      showInfo(`<p class="eyebrow">Club shop / ${p.category}</p><h2 id="info-title" tabindex="-1">${p.name}</h2>
        <img class="info-image" src="assets/${p.image}" alt="${p.alt}"><div class="detail-specs"><b>$${p.price} CAD</b><span>${p.specs}</span></div><p>${p.description}</p>`, 'product', button);
    }
    if (d.ticket) openSession(d.ticket,$('my-tickets'));
    if (d.release) {
      const slot = button.closest('li').querySelector('.release-slot');
      slot.innerHTML = `<div class="release-check"><p>Release this demo booking and return it to the schedule?</p><div class="saved-actions"><button class="text-button" data-release-yes="${d.release}">Yes, release</button><button class="text-button" data-keep="${d.release}">Keep ticket</button></div></div>`;
      focusWithoutScroll(slot.querySelector('[data-keep]'));
    }
    if (d.keep) {
      const row = button.closest('li');
      row.querySelector('.release-slot').replaceChildren();
      focusWithoutScroll(row.querySelector('[data-release]'));
    }
    if (d.releaseYes) {
      const latest = {...(canSave ? readTickets(tickets) : tickets)};
      delete latest[d.releaseYes];
      writeTickets(latest);
      showTickets();
      $('notice').textContent='Booking released.';
    }
  });

  $('menu-toggle').addEventListener('click',() => {
    const open = $('main-nav').classList.toggle('is-open');
    $('menu-toggle').setAttribute('aria-expanded',String(open));
    $('menu-toggle').setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  $('main-nav').addEventListener('click',e => { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown',e => {
    if (e.key === 'Escape' && $('main-nav').classList.contains('is-open')) {
      closeNav();
      focusWithoutScroll($('menu-toggle'));
    }
  });
  $('feature-pass').addEventListener('click',() => openSession(featured,$('feature-pass')));
  $('my-tickets').addEventListener('click',() => {closeNav();showTickets($('my-tickets'));});
  $('confirm-booking').addEventListener('click',confirmBooking);
  $('close-booking').addEventListener('click',closeBooking);
  $('close-info').addEventListener('click',closeInfo);
  for (const dialog of [booking,info]) {
    dialog.addEventListener('click',e => {
      if (e.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (e.clientX<rect.left || e.clientX>rect.right || e.clientY<rect.top || e.clientY>rect.bottom) dialog.close();
    });
    dialog.addEventListener('close',() => {
      syncScrollLock();
      if (dialog === booking) {
        window.clearTimeout(issueTimer);
        flight?.cancel(); flight=null;
        if (!info.open && (!document.activeElement || document.activeElement===document.body || document.activeElement===dialog)) {
          const fallback=document.querySelector(`[data-open="${view.session?.id}"]`);
          focusWithoutScroll(bookingOpener?.isConnected ? bookingOpener : fallback);
        }
      } else if (!booking.open && document.activeElement===document.body) focusWithoutScroll(infoOpener);
    });
  }
  window.addEventListener('storage',e => {
    if (e.key !== storageKey && e.key !== null) return;
    tickets=readTickets(tickets);
    updateTicketCount();renderCards();
    if (info.open && view.info==='tickets') showTickets();
    if (booking.open && view.session) {
      const record=tickets[view.session.id];
      view.spot=record?.spot ?? null;
      view.inspected=null;
      if (view.page==='ticket' && record) showTicket(false);
      else showLineup();
    }
  });

  document.title = brand+' — Indoor soccer in Montréal';
  document.querySelectorAll('[data-brand]').forEach(el => { el.textContent = brand; });
  document.querySelector('.site-header .brand').setAttribute('aria-label',brand+' home');
  const weekFormat = new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  $('week-label').textContent = weekFormat.formatRange(dayDate(week[0]),dayDate(week[week.length-1]));
  renderDays();
  renderCards();
  renderShop();
  showRoom('pitch');
  updateTicketCount();
})();

