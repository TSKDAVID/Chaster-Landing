/**
 * Maximum lengths per copy slot, in characters (DESIGN-GUIDELINES §1.15, Georgian first).
 * Keys are dotted paths into `Copy`; `*` matches one path segment (an array index or a record key).
 * Slots the architect did not list (marked "added") carry a limit chosen to fit the layout.
 */
export const LIMITS: Record<string, number> = {
  "meta.title": 60,
  "meta.description": 155,

  "nav.how": 14,
  "nav.modules": 14,
  "nav.faq": 14,

  "cta.primary": 18,
  "cta.short": 12,
  "cta.mid": 60,

  "hero.h1": 42,
  "hero.lead": 140,
  "hero.note": 60,
  "hero.alt": 32,
  "hero.threadNote": 60, // added: labels the demo thread as an illustration
  // hero.threads.*.messages: customer <= 60, chaster <= 140 (checked separately); result <= 40
  "hero.threads.*.result.text": 40,

  "types.label": 12,
  "types.*": 12,

  "day.h2": 48,
  "day.lead": 160,
  "day.without": 20,
  "day.with": 20,
  "day.q": 40,
  "day.gap": 30, // added
  "day.withoutReply": 60,
  "day.withoutOutcome": 60,
  "day.withReply": 140,
  "day.withFollowup": 40, // added
  "day.withHandoff": 140, // added
  "day.withOutcome": 60,
  "day.videoCaption": 60,
  "day.note": 80,

  "desk.h2": 48,
  "desk.lead": 160,
  "desk.hint": 40, // added
  "desk.demo": 40,
  "desk.silent": 48, // added
  "desk.callouts.*.title": 32,
  "desk.callouts.*.body": 90,
  "desk.sample.rows.*.preview": 40,

  "setup.h2": 48,
  "setup.lead": 140,
  "setup.steps.*.title": 28,
  "setup.steps.*.body": 90,
  "setup.unit": 6, // added

  "build.h2": 48,
  "build.lead": 140,
  "build.coreTitle": 24,
  "build.coreNote": 60,
  "build.addonsTitle": 24,
  "build.addonsNote": 60,
  "build.needs": 24, // added
  "build.example": 40, // added
  "build.modules.*.name": 18,
  "build.modules.*.line": 80,
  "build.modules.*.q": 50,
  "build.modules.*.a": 110,
  "build.dep.*.*": 60,
  "build.plan.title": 20,
  "build.plan.per": 10,
  "build.plan.trial": 60,
  "build.plan.reassure": 80,
  "build.plan.included": 24,

  "rules.h2": 48,
  "rules.lead": 140,
  "rules.items.*.rule": 60,
  "rules.items.*.proof": 110,

  "founder.name": 40,
  "founder.role": 40,
  "founder.body": 220,
  "founder.cta": 20,

  "faq.h2": 40,
  "faq.lead": 120,
  "faq.alt": 40,
  "faq.items.*.q": 70,
  "faq.items.*.a": 320,

  "final.h2": 40,
  "final.note": 60,
  "final.altTitle": 40,
  "final.altQr": 60,

  "footer.legalMissing": 120,

  "notFound.title": 32,
  "notFound.body": 90,
  "notFound.link": 24,
};

/** Per-speaker limits for chat messages in the hero threads (§1.15: customer <= 60, chaster <= 140). */
export const CHAT_LIMITS = { customer: 60, owner: 140, chaster: 140 } as const;
