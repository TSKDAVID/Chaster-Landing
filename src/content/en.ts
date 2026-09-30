import type { Copy } from "./types";

/**
 * PROVISIONAL English copy. Same shape and the same limits as `ka.ts`; English adapts to the Georgian layout,
 * never the other way round (law 5). Fable 5.1 replaces it after Georgian is done.
 */
export const en: Copy = {
  meta: {
    title: "Chaster: Messenger and Instagram on one desk",
    description:
      "Chaster answers your page's customers on Messenger and Instagram: prices, hours, bookings. Step in whenever you want. Try it free.",
  },

  a11y: {
    skip: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    mainNav: "Main navigation",
  },

  nav: {
    how: "How it works",
    modules: "Modules, price",
    faq: "Questions",
    langSelf: "EN",
    langOther: "ქარ",
    langOtherName: "ქართული",
  },

  cta: {
    primary: "Connect your page",
    short: "Connect",
    mid: "Ready in {min} minutes. Start today.",
  },

  hero: {
    h1: "“Price?” Chaster already replied.",
    lead: "Chaster answers your page's customers on Messenger and Instagram: prices, hours, bookings. Step in yourself whenever you like.",
    note: "{days} days free, then from {from} a month",
    alt: "or try it live: message us",
    threadNote: "Illustration: a made-up business and customer",
    threads: {
      shop: {
        name: "Nino K.",
        channel: "instagram",
        messages: [
          { from: "customer", text: "Price?", time: "23:40" },
          {
            from: "chaster",
            text: "Hello. This coat is 189 ₾, sizes M and L are in stock.",
            time: "23:41",
            photo: true,
          },
          { from: "customer", text: "Do you deliver in Tbilisi?", time: "23:42" },
          {
            from: "chaster",
            text: "Yes, delivery in Tbilisi is 6 ₾. The team will confirm the details.",
            time: "23:42",
          },
        ],
        result: { text: "Price and photo already sent", signal: "catalog" },
      },
      beauty: {
        name: "Ana B.",
        channel: "messenger",
        messages: [
          { from: "customer", text: "Hi, do you have a free nail slot tomorrow?", time: "19:05" },
          {
            from: "chaster",
            text: "Hello. Tomorrow is free at 11:00, 15:00 and 17:30. A manicure with Maka is 35 ₾.",
            time: "19:05",
          },
          { from: "customer", text: "Book me at 15:00", time: "19:06" },
          { from: "chaster", text: "Booked for tomorrow at 15:00 with Maka. See you then.", time: "19:06" },
        ],
        result: { text: "Booked: tomorrow 15:00 · Maka", signal: "bookings" },
      },
      stay: {
        name: "Giorgi M.",
        channel: "messenger",
        messages: [
          { from: "customer", text: "Room for two from 12 to 15 October?", time: "20:12" },
          {
            from: "chaster",
            text: "Yes, the room with a balcony is free: 3 nights, 240 ₾. Sending photos.",
            time: "20:12",
            photo: true,
          },
          { from: "customer", text: "Great, book it", time: "20:14" },
          {
            from: "chaster",
            text: "Booked 12–15 October. Please send your name and phone number.",
            time: "20:14",
          },
        ],
        result: { text: "Booked: 12–15 October, 3 nights", signal: "bookings" },
      },
      food: {
        name: "Dato Ch.",
        channel: "messenger",
        messages: [
          { from: "customer", text: "Table for 4 today at 20:00?", time: "17:48" },
          {
            from: "chaster",
            text: "Yes, a table for 4 is free at 20:00. Shall I book it?",
            time: "17:48",
          },
          { from: "customer", text: "Yes please. How much is khinkali?", time: "17:49" },
          {
            from: "chaster",
            text: "Booked for 20:00, table for 4. Khinkali is 1.20 ₾ each.",
            time: "17:49",
          },
        ],
        result: { text: "Table for 4: today 20:00", signal: "bookings" },
      },
      clinic: {
        name: "Tamar G.",
        channel: "messenger",
        messages: [
          { from: "customer", text: "How much is a consultation and when can I come?", time: "08:55" },
          {
            from: "chaster",
            text: "A consultation is 80 ₾. Dr. Beridze is free tomorrow at 10:30 and 16:00.",
            time: "08:55",
          },
          { from: "customer", text: "Book me at 10:30", time: "08:56" },
          { from: "chaster", text: "Booked for tomorrow at 10:30 with Dr. Beridze.", time: "08:56" },
        ],
        result: { text: "Visit: tomorrow 10:30 · Dr. Beridze", signal: "bookings" },
      },
      other: {
        name: "Levan B.",
        channel: "messenger",
        messages: [
          { from: "customer", text: "Are you open today? Where are you?", time: "09:20" },
          {
            from: "chaster",
            text: "We're open today 10:00 to 19:00. Address: 12 Rustaveli Ave, Tbilisi.",
            time: "09:20",
          },
        ],
        result: { text: "Hours and address sent", signal: "hours" },
      },
    },
  },

  types: {
    label: "Business:",
    shop: "Shop",
    beauty: "Salon",
    stay: "Stay",
    food: "Restaurant",
    clinic: "Clinic",
    other: "Other",
  },

  // copied exactly from the operator app (src/lib/i18n/en.ts)
  ui: {
    aiAnswering: "AI answering",
    youAnswering: "You answering",
    closed: "Closed",
    takeOver: "Take over",
    resumeAi: "Resume AI",
    closeChat: "Close chat",
    sentByAi: "Sent by AI auto-reply",
    ai: "AI",
    you: "You",
    photo: "Photo",
    writeReply: "Write your reply",
    send: "Send",
    inboxTitle: "Inbox",
    all: "All",
    messenger: "Messenger",
    instagram: "Instagram",
    onTheBook: "On the book",
    manage: "Manage",
  },

  day: {
    h2: "11:40 p.m. The same “Price?”",
    lead: "One message, two outcomes. On the left the reply came in the morning, on the right it came the same minute.",
    without: "Without Chaster",
    with: "With Chaster",
    q: "Price?",
    seen: "Seen",
    gap: "No reply all night",
    withoutReply: "Good morning. 189 ₾. Still interested?",
    withoutOutcome: "The customer bought elsewhere",
    withReply: "Hello. This coat is 189 ₾, sizes M and L are in stock.",
    withFollowup: "I'll take M",
    withHandoff: "Great. A team member will confirm the details.",
    withOutcome: "Price and photo sent overnight, the customer is waiting",
    videoCaption: "45 seconds: what a late reply costs",
    videoPlay: "Play video",
    note: "Illustration: a made-up shop and customer.",
  },

  desk: {
    h2: "You decide who answers",
    lead: "Every conversation is on one desk. The AI answers, but you take over with one tap and hand back with another.",
    hint: "Try it: press “Take over”",
    demo: "Try it on our page in Messenger",
    silent: "The AI stays silent until you hand back",
    callouts: [
      {
        title: "Two channels, one list",
        body: "Messenger and Instagram share one inbox. Filter by channel when you need to.",
      },
      {
        title: "Step in with one tap",
        body: "“Take over” and the AI goes quiet. “Resume AI” and it answers again.",
      },
      {
        title: "A chat booking in your schedule",
        body: "A booking made in chat appears in your schedule automatically.",
      },
    ],
    sample: {
      selectedName: "Nino K.",
      rows: [
        { name: "Nino K.", time: "14:33", channel: "messenger", preview: "Book me", handling: "ai" },
        { name: "Giorgi M.", time: "13:05", channel: "instagram", preview: "Price?", handling: "ai" },
        { name: "Ana B.", time: "11:48", channel: "messenger", preview: "Thanks, goodbye", handling: "closed" },
        { name: "Dato Ch.", time: "10:20", channel: "messenger", preview: "What's the address?", handling: "ai" },
        { name: "Tamar G.", time: "09:14", channel: "instagram", preview: "Do you have a photo?", handling: "you" },
      ],
      thread: [
        { from: "customer", text: "Can I come tomorrow at 15:00?", time: "14:32" },
        { from: "chaster", text: "Yes, 15:00 is free with Maka. Shall I book it?", time: "14:32" },
        { from: "customer", text: "Please do", time: "14:33" },
        { from: "chaster", text: "Booked for tomorrow at 15:00 with Maka.", time: "14:33" },
      ],
      pendingCustomer: { from: "customer", text: "Could I move it to 16:00?", time: "14:40" },
      aiReply: { from: "chaster", text: "Yes, 16:00 is free. I've moved it.", time: "14:41" },
      booking: "Tomorrow, 15:00 · Maka",
    },
  },

  setup: {
    h2: "Live in {min} minutes, no developer",
    lead: "No website and no developer needed. Connect your page, add your prices and hours. Chaster does the rest.",
    steps: [
      { title: "Connect your page", body: "Press the button and confirm access with Facebook." },
      { title: "Pick your pages", body: "Your Facebook page and the Instagram linked to it." },
      { title: "Add questions and prices", body: "Write down what people often ask and what your products cost." },
      { title: "Set hours and bookings", body: "Working days, hours and booking rules." },
      { title: "First reply sent", body: "Chaster answered the first message on its own." },
    ],
    unit: "min",
    clockLabel: "minute {n}",
  },

  build: {
    h2: "Pick your modules, see the price",
    lead: "The base has the inbox, questions and hours. You add the rest to fit your business.",
    coreTitle: "In the base",
    coreNote: "These three are in every plan.",
    addonsTitle: "Extra modules",
    addonsNote: "Switch on only what you need.",
    needs: "needs {name}",
    example: "What your customer sees",
    modules: {
      inbox: {
        name: "Inbox",
        line: "Messenger and Instagram in one list. The AI answers, you step in when you want.",
        q: "I'd like to place an order",
        a: "A team member will confirm that for you. They'll write here soon.",
      },
      knowledge: {
        name: "Questions",
        line: "Teach Chaster your Q&A and general information.",
        q: "Do you deliver outside Tbilisi?",
        a: "Yes, 2–3 days to the regions. Delivery is 8 ₾.",
      },
      hours: {
        name: "Hours, address",
        line: "Address, phone and opening hours in every answer.",
        q: "Are you open today?",
        a: "We're open 10:00–19:00 today. Address: 12 Rustaveli.",
      },
      catalog: {
        name: "Catalog",
        line: "Products and services with prices, variants and stock.",
        q: "Price?",
        a: "Jacket: 189 ₾. Sizes M and L in stock.",
      },
      media: {
        name: "Photos",
        line: "Chaster sends the catalog photo when a customer asks for it.",
        q: "Do you have a photo?",
        a: "Yes, sending it now.",
      },
      bookings: {
        name: "Bookings",
        line: "Hourly, all-day and multi-day bookings, right in the chat.",
        q: "Is tomorrow at 15:00 possible?",
        a: "Yes, 15:00 is free. Shall I book it?",
      },
      resources: {
        name: "Team and rooms",
        line: "Staff and rooms with their own hours, no double bookings.",
        q: "Book me with Maka",
        a: "Maka works 11:00 to 19:00 tomorrow. Booked at 15:00.",
      },
    },
    dep: {
      media: {
        on: "Photos need the catalog, so the catalog is on too.",
        off: "The catalog is off, so photos are off too.",
      },
      resources: {
        on: "Team needs bookings, so bookings are on too.",
        off: "Bookings are off, so team is off too.",
      },
    },
    plan: {
      title: "Your plan",
      per: "/ month",
      trial: "The first {days} days are free",
      reassure: "Try it free first, then decide.", // OWNER: replace with the real terms once decided
      included: "In your plan",
      stripLabel: "Chosen modules",
    },
  },

  rules: {
    h2: "Rules Chaster never breaks",
    lead: "These promises describe how the product behaves. They are not ad copy.",
    items: [
      {
        rule: "Answers only from your data",
        proof: "Chaster uses your questions, catalog, hours and bookings, and nothing else.",
        signal: "knowledge",
      },
      {
        rule: "Quotes prices as you wrote them",
        proof: "Price and currency pass from the catalog exactly. It never converts currency.",
        signal: "catalog",
      },
      {
        rule: "If it doesn't know, it doesn't invent",
        proof: "When it has no answer, it tells the customer it will check with the team.",
        signal: "hours",
      },
      {
        rule: "Customer wants a person? You'll know",
        proof: "Chaster tells the customer a team member will write, and flags the chat.",
        signal: "inbox",
      },
      {
        rule: "When you step in, Chaster goes quiet",
        proof: "Until you hand back, the AI sends no message at all.",
        signal: "inbox",
      },
      {
        rule: "It won't allow a double booking",
        proof: "One staff member can't be booked twice at the same time. The database enforces it.",
        signal: "resources",
      },
      {
        rule: "Works through Meta's official API",
        proof: "You connect with Facebook and messages arrive the official way. We never ask for your password.",
        signal: "inbox",
      },
    ],
  },

  founder: {
    name: "",
    role: "",
    body: "This is my product and I answer for it personally. If you want to know anything, message me directly and I'll reply myself.", // OWNER: rewrite in your own voice
    cta: "Message me directly",
    photoAlt: "Chaster's founder",
  },

  faq: {
    h2: "Common questions",
    lead: "Just as customers write to you: the question first, then the answer.",
    alt: "Another question? Message us",
    items: [
      {
        q: "Could Facebook block my page because of this?",
        a: "Chaster works through Meta's official API: you connect with Facebook and messages arrive the official way. We don't ask for your password and we don't use unofficial scripts.",
      },
      {
        q: "What happens when the free period ends?",
        a: "After the free period you choose a plan with your modules. You'll see the exact terms before any payment.", // OWNER: confirm billing behaviour
      },
      {
        q: "Do I need a card to start?",
        a: "The terms for the free period are shown in the app before you connect.", // OWNER: replace with the real answer (card or no card)
      },
      {
        q: "Will customers know an automatic system is replying?",
        a: "Chaster writes in your page's name, briefly and naturally. You can see which replies the AI sent and which you sent, and you can step in at any time.",
      },
      {
        q: "What if it answers wrongly?",
        a: "It only uses your data, and when it has no answer it promises to check with the team. Every AI reply is saved so you can review and correct it.",
      },
      {
        q: "Can I reply myself?",
        a: "Yes. Step in with one tap, and the AI stays silent until you hand back.",
      },
      {
        q: "Which languages does it understand?",
        a: "Chaster replies in the language of the customer's latest message.",
      },
      {
        q: "What data do you keep, and how do I delete it?",
        a: "We keep conversations, catalog and bookings, which we need to answer. You can request deletion on the data deletion page.",
      },
    ],
  },

  final: {
    h2: "Your time is free.",
    note: "{days} days free, then from {from}.",
    altTitle: "Or try it live first",
    altQr: "Scan and message us on Messenger",
    messenger: "Messenger",
    instagram: "Instagram",
  },

  footer: {
    legalMissing: "OWNER: add the company name and ID code (src/config/owner.ts)",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    deletion: "Data deletion",
    rights: "All rights reserved",
  },

  notFound: {
    title: "A block is missing",
    body: "This page doesn't exist. Getting back to the start is one tap away.",
    link: "Back to the start",
  },

  consent: {
    text: "We measure which buttons work so we can improve the site. Allow it?",
    accept: "Yes",
    decline: "No",
  },
};
