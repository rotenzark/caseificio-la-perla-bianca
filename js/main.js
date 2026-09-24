/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'caseificio-la-perla-bianca',    // usato per localStorage lang
    whatsapp: {
      number: '',                     // '39xxxxxxxxxx' — vuoto = niente wiring
      message: 'Ciao! Vorrei informazioni.',
      ids: ['ctaPrenota', 'heroWhatsapp', 'doveWhatsapp', 'barWhatsapp'],
    },
    /* orari: per giorno (0=domenica) un array di finestre [inizio, fine]
       in minuti-stringa 'HH:MM'. Fine oltre '24:00' = scavalca mezzanotte
       (es. ['18:00','24:30'] = apre alle 18, chiude alle 00:30 del giorno
       dopo). Giorno chiuso = []. */
    /* Scheda Google (24/9/2026): lun–sab 09:30–19:00 continuato, domenica chiuso. (Il titolare scrive che d'estate chiude alle 20: da confermare.) */
    hours: {
      0: [],
      1: [['09:30', '19:00']],
      2: [['09:30', '19:00']],
      3: [['09:30', '19:00']],
      4: [['09:30', '19:00']],
      5: [['09:30', '19:00']],
      6: [['09:30', '19:00']],
    },
    hoursStatusId: 'orarioStato',     // elemento testo stato
    hoursTableSelector: '[data-day]', // righe/li con data-day da evidenziare
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 960,
    /* dizionario EN: SOLO overlay — l'HTML è la versione italiana.
       Forma storica a due lingue, resta valida e invariata. */
    EN: {
      "intro.skip": "skip",
      "nav.home": "Caseificio La Perla Bianca, back to top",
      "nav.apri": "Open the menu",
      "marchio.s": "dairy · Viale Monza 281, Milan",
      "nav.perle": "The string of pearls",
      "nav.notte": "At two in the morning",
      "nav.banco": "The counter",
      "nav.voci": "Reviews",
      "nav.dove": "Where & hours",
      "cta.chiama": "Call",
      "cta.chiama2": "Call +39 02 6885 3988",
      "h.kicker": "Dairy · Viale Monza 281, Precotto, Milan",
      "h.h1": "Made last night.",
      "h.sub": "The buffalo milk arrives from the Lodi countryside <em>at two in the morning</em>. It is stretched before dawn, in the workshop behind the counter, and at 9.30 the mozzarella is ready: with the ricotta, the braids, the burrata. It is called Perla Bianca, white pearl, because buffalo mozzarella glistens like a pearl: so says Antonio, who has been making it for thirty-five years.",
      "h.nastro": "«Every day buffalo mozzarella and fresh dairy» — it is written on the sign",
      "h.cta1": "Call +39 02 6885 3988",
      "h.cta2": "The string of pearls",
      "h.alt": "Antonio in the workshop lifts the stretched mozzarella curd with a wooden paddle, as it stretches from the steel vat",
      "h.cap": "«It isn't mozzarella if it doesn't stretch»: their words, under this photo",
      "p.k": "the buffalo-milk dairy",
      "p.h": "The string of pearls.",
      "p.p": "Everything that comes out of the workshop at night, <em>one pearl at a time</em>. Sold by weight, eaten the same day.",
      "f1.t": "Buffalo mozzarella",
      "f1.d": "in 500 g and 250 g: the big cut, customers say, makes the difference",
      "f2.t": "Bocconcini and nodini",
      "f2.d": "the small pearls, the ones in the water",
      "f3.t": "Braids and the big braid",
      "f3.d": "braided by hand, on the paper with the logo",
      "f4.t": "Burrata",
      "f4.d": "with gorgonzola or pistachio too",
      "f5.t": "Stracciatella",
      "f5.d": "in a tub, by weight",
      "f6.t": "Ricotta",
      "f6.d": "fresh, in its basket, and baked",
      "f7.t": "Smoked provola and scamorza",
      "f7.d": "buffalo and cow's milk",
      "f8.t": "Primo sale",
      "f8.d": "in its various flavours",
      "f9.t": "Buffalo blue, taleggio and gorgonzola",
      "f9.d": "the aged ones customers call «the treat»",
      "p.a1": "Dozens of white mozzarellas float in their water, with the caption of their post «Le perle bianche»",
      "p.c1": "«The white pearls», from their Instagram",
      "p.a2": "A mozzarella braid tied with raffia on the paper with the buffalo logo and the address Viale Monza 281",
      "p.c2": "The braid, on the paper with the logo",
      "p.a3": "A basket ricotta just turned out, with the marks of the basket, on a plate",
      "p.c3": "The basket ricotta",
      "p.a4": "Two ricottas in their baskets and the mozzarella bag with the La Perla Bianca logo",
      "p.c4": "The ricottas and the bag with the logo",
      "n.k": "how it is made",
      "n.h": "At two in the morning.",
      "n.p": "That is when the milk arrives. From then until 9.30 everything happens, <em>in the workshop you can see from the shop</em>.",
      "s1.t": "The milk arrives",
      "s1.d": "Buffalo milk from the Lodi countryside, from a herd of fifteen hundred: it arrives every night, all nights.",
      "s2.t": "It is stretched",
      "s2.d": "Curd, stretching, shaping: mozzarellas, bocconcini, braids, burratas, ricottas. By hand, in the workshop behind the counter.",
      "s3.t": "On the counter",
      "s3.d": "The shop opens. What you see in the water was made a few hours earlier.",
      "r1.t": "Only as much as is needed",
      "r1.d": "No leftovers for the next day: when something runs out, it runs out. Better to come in the morning.",
      "r2.t": "More than a kilo? Book it",
      "r2.d": "A phone call the day before, and the mozzarella for the party or the restaurant is ready.",
      "n.a1": "The dairy's refrigerated counter with mozzarellas, small ricottas and caciotta cheeses on trays",
      "n.c1": "The counter, in the morning",
      "n.a2": "The grey sign with the buffalo logo and the words: Every day buffalo mozzarella and fresh dairy",
      "n.c2": "The sign, on Viale Monza",
      "b.k": "the rest of the counter",
      "b.h": "Not only mozzarella.",
      "b.p": "Around the pearls, the counter of a southern Italian grocer: <em>cheeses, cured meats, bread, taralli</em>, and the Campanian products customers recognise at first glance.",
      "e1.t": "Cheeses",
      "e1.d": "aged cow's and buffalo cheeses, cut to order",
      "e2.t": "Cured meats",
      "e2.d": "sliced on the spot, the country pancetta",
      "e3.t": "Bread and taralli",
      "e3.d": "bread by weight, taralli from Puglia",
      "e4.t": "Campanian pantry",
      "e4.d": "pasta, preserves, wines",
      "b.pt": "The lunchtime sandwich",
      "b.pd": "Filled on the spot with what is on the counter, mozzarella included. And the mozzarella roll with cured ham and rocket, to take away.",
      "b.a1": "A hand holds a mozzarella roll with cured ham and rocket",
      "b.c1": "The roll with cured ham and rocket",
      "b.a2": "The shop shelves with packs of pasta and taralli",
      "b.c2": "The shelves: pasta and taralli",
      "b.a3": "The blackboard outside the shop: Caseificio La Perla Bianca, buffalo mozzarella and cheeses of our own production, special sandwiches filled with our products",
      "b.c3": "The blackboard outside: «cheeses of our own production», «sandwiches filled with our products»",
      "c.k": "who is here",
      "c.h": "Zi Peppe and Don Antonio.",
      "c.p": "That is how they introduce themselves. <em>Antonio makes the mozzarella</em>, at night, since 1989 when he started in a dairy «cleaning the buckets first», in his words. <em>Giuseppe is at the counter</em>: he is the one customers name, eleven times, in their reviews.",
      "c1.t": "Antonio",
      "c1.d": "The cheesemaker. Thirty-five years of milk, the latest part in this workshop.",
      "c2.t": "Giuseppe",
      "c2.d": "At the counter: he explains the cheeses, suggests the cut, makes the sandwich. «At Peppe's it feels like home», a customer writes.",
      "c.a1": "The sticker with the buffalo logo and the words La Perla Bianca on the glass door of the shop",
      "c.c1": "The buffalo on the door",
      "v.k": "the reviews",
      "v.h": "What people write.",
      "v.p": "In the 62 Google reviews with a text, <em>42 talk about the mozzarella, 24 about freshness, 19 about kindness, 17 about the ricotta</em>. And those who grew up with buffalo mozzarella, from Campania and Naples, write it: they vouch for it. The owner replies, to the criticisms too, explaining how it is made and how to keep it.",
      "v.badge": "76 reviews on Google",
      "v.cit": "«A pearl with the flavours of the old days»",
      "v.citda": "From a Google review (translated)",
      "v.btn": "Read the reviews on Google",
      "d.k": "where and when",
      "d.h": "Viale Monza 281, Precotto.",
      "d.p": "One block from the Precotto stop on the red metro line, with <em>the grey sign and the buffalo on the door</em>. Open from 9.30 am to 7 pm, all day, Monday to Saturday.",
      "d.n1": "<b>In the morning there is everything</b>; by the end of the day something may have run out.",
      "d.n2": "<b>For more than a kilo</b>, a phone call the day before.",
      "d.n3": "<b>Home delivery</b> in the area with Deliveroo too.",
      "d.tel": "Call +39 02 6885 3988",
      "d.strada": "Directions",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "d.mappa": "Map: Caseificio La Perla Bianca, Viale Monza 281, Milan",
      "d.alt": "The entrance of the dairy on Viale Monza with the street number 281 and the sign above the door",
      "d.cap": "Number 281, Viale Monza",
      "do.h": "The questions we get asked.",
      "qa.1": "Do you make the mozzarella yourselves?",
      "ra.1": "Yes: the buffalo milk arrives from the Lodi countryside at two in the morning and is worked before dawn in the workshop behind the counter, which you can see from the shop. At 9.30 the mozzarella is ready.",
      "qa.2": "Is it mozzarella from Campania?",
      "ra.2": "No: it is mozzarella made from buffalo milk of the Lodi countryside, made in Milan every night. Among those who buy it there are many people from Campania and Naples, and they write it in their reviews.",
      "qa.3": "Can I book?",
      "ra.3": "Yes, with a phone call to +39 02 6885 3988: for more than a kilo it is better to book the day before, because only what is needed is made, and when it runs out, it runs out.",
      "qa.4": "How do I keep the mozzarella?",
      "ra.4": "In its own liquid, and in the fridge if you don't eat it right away, taking it out a little before eating. It is a fresh, delicate product: best bought the same day.",
      "qa.5": "Do you make sandwiches?",
      "ra.5": "Yes: sandwiches filled on the spot with the products on the counter, mozzarella included, for lunch. And the mozzarella roll with cured ham and rocket.",
      "qa.6": "What are your hours?",
      "ra.6": "Monday to Saturday from 9.30 am to 7 pm, no break. Closed on Sunday. In the morning there is everything; by the end of the day something may have run out.",
      "piede.s": "dairy · buffalo mozzarella and fresh dairy every day · Milan, Precotto",
      "piede.d": "Caseificio La Perla Bianca · Viale Monza 281, 20126 Milan · <a href='tel:+390268853988'>+39 02 6885 3988</a>",
      "piede.b": "Demo website made by <a href='https://bespokestud.io' target='_blank' rel='noopener'>Bespoke Studio</a> · texts, hours and services from the business's public sources and from the NoiZona2 article of July 2025; photographs published by the business and by customers on the Google listing.",
      "b.chiama": "Call",
      "b.perle": "Pearls",
      "b.orari": "Hours",
      "b.mappa": "Map",
      "lb.chiudi": "Close",
    },
    /* MULTILINGUA (V4) — per i siti con più di due lingue, al posto di EN:
         LANGS: { en: {chiave:'...'}, ar: {chiave:'...'} }
       L'italiano resta SEMPRE la lingua del DOM e non ha dizionario.
       Se si valorizza EN e non LANGS, il comportamento è identico a prima. */
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],   // lingue che ribaltano dir=rtl
    /* etichette dello stato orari per lingua non-IT; l'IT è nel codice.
       Chiave mancante = fallback all'inglese, poi all'italiano. */
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ═══ FIRMA · Caseificio La Perla Bianca — «Fatta stanotte.» ═══
     Le perle che si formano: ogni [data-perla] del filo parte con la perla a scala zero e si gonfia quando
     entra in vista (back.out), poi il riflesso scorre; la perla grande dell'apertura luccica in loop; il filo
     si disegna con lo scroll. Regole: niente è nascosto dal CSS; senza GSAP o con motion ridotto le perle
     sono già formate (stato finale). */

  var voci = Array.prototype.slice.call(document.querySelectorAll('[data-perla]'));
  var perleVive = hasGsap && hasST && !reducedMotion;
  voci.forEach(function (li) { li.setAttribute('data-stato', perleVive ? 'latte' : 'perla'); });
  if (perleVive) {
    voci.forEach(function (li, i) {
      var p = li.querySelector('.perla'), luce = li.querySelector('.perla__luce'), testo = li.querySelectorAll('b, span:not(.perla):not(.perla__luce)');
      gsap.set(p, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(testo, { opacity: 0, x: 10 });
      ScrollTrigger.create({
        trigger: li, start: 'top 86%', once: true,
        onEnter: function () {
          li.setAttribute('data-stato', 'si-forma');
          var tl = gsap.timeline({ onComplete: function () { li.setAttribute('data-stato', 'perla'); } });
          tl.to(p, { scale: 1, duration: .7, ease: 'back.out(2.2)' }, 0)
            .to(testo, { opacity: 1, x: 0, duration: .5, stagger: .06, ease: 'power2.out' }, .15);
          if (luce) gsap.fromTo(luce, { x: '-40%' }, { x: '60%', duration: 1.2, ease: 'sine.inOut', delay: .3 });
        }
      });
    });
    /* il filo si disegna scorrendo */
    var filo = document.getElementById('filo');
    if (filo) {
      filo.style.setProperty('--filo', '0');
      ScrollTrigger.create({
        trigger: filo, start: 'top 80%', end: 'bottom 70%', scrub: 0.5,
        onUpdate: function (self) { filo.style.setProperty('--filo', self.progress.toFixed(3)); }
      });
    }
    /* la perla grande luccica */
    var luceGrande = document.getElementById('perlaLuce');
    if (luceGrande) gsap.fromTo(luceGrande, { x: '-30%' }, { x: '70%', duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    /* le perle della testata e dell'intro luccicano anche loro, piano */
    gsap.utils.toArray('.marchio .perla__luce').forEach(function (el) { gsap.fromTo(el, { x: '-20%' }, { x: '50%', duration: 2.6, ease: 'sine.inOut', repeat: -1, yoyo: true }); });
  }

  /* entrata: chiamata dal plumbing a fine intro. La perla grande si forma, il testo sale. */
  window.bespokeHeroEntrance = function () {
    if (!hasGsap || reducedMotion) return;
    var pg = document.getElementById('perlaGrande');
    if (pg) gsap.from(pg, { scale: 0, duration: .9, ease: 'back.out(1.8)', transformOrigin: '50% 50%' });
    gsap.from('.apertura__testo > *', { y: 18, opacity: 0, duration: .6, stagger: .08, ease: 'power3.out', delay: .25 });
    gsap.from('.apertura__foto', { y: 24, opacity: 0, duration: .8, ease: 'power3.out', delay: .7 });
  };
})();
