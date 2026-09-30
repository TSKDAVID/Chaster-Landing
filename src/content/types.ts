import type { BusinessType, ModuleId, SignalId } from "@/config/modules";

/**
 * The copy contract. Fable 5.1 fills every string here, in `ka.ts` first and `en.ts` second.
 * Length limits (characters, Georgian first) live in `limits.ts` and are enforced by `npm run check:copy`.
 *
 * Tokens resolved at render time from config, so numbers never drift from the pricing file:
 *   {days}  trial length      {from}  base price, e.g. "20 ₾"      {min}  minutes to go live
 *   {name}  (build.needs)     the module a module depends on
 */

export type ChatMsg = {
  from: "customer" | "chaster" | "owner";
  text: string;
  time: string; // 24-hour, "14:30"
  photo?: boolean; // Chaster sent a catalog photo with this message
};

export type HeroThread = {
  name: string; // fictional customer, first name + initial
  channel: "messenger" | "instagram";
  messages: ChatMsg[]; // customer / chaster alternating, 3-5 messages
  result: { text: string; signal: SignalId }; // the line that lands last; the signal cell takes the module colour
};

export type FaqItem = { q: string; a: string };

export type DeskRow = {
  name: string;
  time: string;
  channel: "messenger" | "instagram";
  preview: string;
  handling: "ai" | "you" | "closed";
};

export type Copy = {
  meta: { title: string; description: string };
  a11y: { skip: string; openMenu: string; closeMenu: string; language: string; mainNav: string };
  nav: { how: string; modules: string; faq: string; langSelf: string; langOther: string; langOtherName: string };
  cta: { primary: string; short: string; mid: string };

  hero: {
    h1: string;
    lead: string;
    note: string; // trial + price anchor
    alt: string; // live demo link
    threadNote: string; // labels the demo thread as an illustration (law 6)
    threads: Record<BusinessType, HeroThread>;
  };
  types: { label: string } & Record<BusinessType, string>;

  /** Product UI strings: copied EXACTLY from the operator app's dictionaries (formal register). */
  ui: {
    aiAnswering: string;
    youAnswering: string;
    closed: string;
    takeOver: string;
    resumeAi: string;
    closeChat: string;
    sentByAi: string;
    ai: string; // short row label in the inbox list
    you: string;
    photo: string;
    writeReply: string;
    send: string;
    inboxTitle: string;
    all: string;
    messenger: string;
    instagram: string;
    onTheBook: string;
    manage: string;
  };

  day: {
    h2: string;
    lead: string;
    without: string;
    with: string;
    q: string;
    seen: string;
    gap: string;
    withoutReply: string;
    withoutOutcome: string;
    withReply: string;
    withFollowup: string;
    withHandoff: string;
    withOutcome: string;
    videoCaption: string;
    videoPlay: string;
    note: string;
  };

  desk: {
    h2: string;
    lead: string;
    hint: string;
    demo: string;
    silent: string;
    callouts: { title: string; body: string }[]; // 3
    sample: {
      selectedName: string;
      rows: DeskRow[];
      thread: ChatMsg[];
      pendingCustomer: ChatMsg; // arrives after take-over
      aiReply: ChatMsg; // sent once the AI is resumed
      booking: string;
    };
  };

  setup: {
    h2: string;
    lead: string;
    steps: { title: string; body: string }[]; // 5, times come from config
    unit: string; // "min", shown beside the cell numerals
    clockLabel: string; // a11y: "minute {n}"
  };

  build: {
    h2: string;
    lead: string;
    coreTitle: string;
    coreNote: string;
    addonsTitle: string;
    addonsNote: string;
    needs: string; // "needs {name}"
    example: string; // label over the expanded example
    modules: Record<ModuleId, { name: string; line: string; q: string; a: string }>;
    dep: { media: { on: string; off: string }; resources: { on: string; off: string } };
    plan: {
      title: string;
      per: string;
      trial: string;
      reassure: string;
      included: string;
      stripLabel: string;
    };
  };

  rules: {
    h2: string;
    lead: string;
    items: { rule: string; proof: string; signal: SignalId }[]; // 7
  };
  founder: { name: string; role: string; body: string; cta: string; photoAlt: string };

  faq: { h2: string; lead: string; alt: string; items: FaqItem[] }; // 8

  final: {
    h2: string;
    note: string;
    altTitle: string;
    altQr: string;
    messenger: string;
    instagram: string;
  };

  footer: {
    legalMissing: string; // dev-only marker shown while the owner's company data is empty
    contact: string;
    privacy: string;
    terms: string;
    deletion: string;
    rights: string;
  };

  notFound: { title: string; body: string; link: string };

  consent: { text: string; accept: string; decline: string };
};
