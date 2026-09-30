"use client";

import { useEffect, useRef, useState } from "react";
import type { Copy } from "@/content";
import type { ChatMsg, DeskRow } from "@/content/types";
import { Cell } from "../cell/Cell";
import { ChannelMark, MessageRow, Status, type MsgState } from "../thread/parts";

type Mode = "ai" | "you";
type Filter = "all" | "messenger" | "instagram";

export function Marker({ n }: { n: number }) {
  return (
    <span className="marker" aria-hidden="true">
      {n}
    </span>
  );
}

/**
 * The real app's desk, rebuilt: flat inbox rows, a thread with the handover bar, a booking strip (§1.12 S3). It is
 * interactive on purpose: the visitor presses "Take over", sees the status flip and the AI go silent, then hands back
 * and watches it answer the message that was waiting. UI strings are copied exactly from the app's dictionaries.
 */
export function DeskFrame({ copy }: { copy: Copy }) {
  const { ui, desk } = copy;
  const s = desk.sample;
  const [mode, setMode] = useState<Mode>("ai");
  const [filter, setFilter] = useState<Filter>("all");
  const [pending, setPending] = useState(false); // the customer's follow-up has arrived
  const [aiTyping, setAiTyping] = useState(false);
  const [aiReplied, setAiReplied] = useState(false);
  const [owner, setOwner] = useState<ChatMsg[]>([]);
  const [draft, setDraft] = useState("");
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const takeOver = () => {
    setMode("you");
    if (!pending) later(700, () => setPending(true));
  };

  const resume = () => {
    setMode("ai");
    // the AI only answers what nobody has answered yet
    if (pending && owner.length === 0 && !aiReplied) {
      setAiTyping(true);
      later(900, () => {
        setAiTyping(false);
        setAiReplied(true);
      });
    }
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setOwner((o) => [...o, { from: "owner", text, time: "14:41" }]);
    setDraft("");
  };

  const rows: DeskRow[] = s.rows
    .filter((r) => filter === "all" || r.channel === filter)
    .map((r) => (r.name === s.selectedName ? { ...r, handling: mode } : r));

  const aiState: MsgState = aiTyping ? "typing" : aiReplied ? "shown" : "pending";
  const handlingLabel = (h: DeskRow["handling"]) => (h === "ai" ? ui.ai : h === "you" ? ui.you : ui.closed);

  return (
    <div className="desk" data-mode={mode}>
      {/* inbox list: flat rows, hairline dividers, selected row inverts */}
      <div className="desk__list">
        <div className="desk__list-head">
          <span className="desk__title">{ui.inboxTitle}</span>
          <div className="seg" role="group" aria-label={ui.inboxTitle}>
            {(["all", "messenger", "instagram"] as const).map((f) => (
              <button key={f} type="button" className="seg__btn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f === "all" ? ui.all : f === "messenger" ? ui.messenger : ui.instagram}
              </button>
            ))}
          </div>
          <Marker n={1} />
        </div>
        <ul className="desk__rows">
          {rows.map((r) => (
            <li key={r.name} className="inbox-row" aria-current={r.name === s.selectedName ? "true" : undefined}>
              <div className="inbox-row__top">
                <span className="inbox-row__name">{r.name}</span>
                <span className="inbox-row__time tnum">{r.time}</span>
              </div>
              <div className="inbox-row__preview">{r.preview}</div>
              <div className="inbox-row__meta">
                <ChannelMark channel={r.channel} size={12} />
                <span className="inbox-row__who">
                  {handlingLabel(r.handling)}
                  <Cell
                    size={8}
                    state={
                      r.handling === "ai"
                        ? { kind: "signal", id: "inbox" }
                        : r.handling === "you"
                          ? { kind: "outline" }
                          : { kind: "solid", color: "var(--color-muted)" }
                    }
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* thread */}
      <div className="desk__thread">
        <header className="desk__thread-head">
          <span className="thread__who">
            <ChannelMark channel="messenger" size={16} className="thread__channel" />
            <span className="thread__name">{s.selectedName}</span>
          </span>
          <Status
            text={mode === "ai" ? ui.aiAnswering : ui.youAnswering}
            signal="inbox"
            outline={mode === "you"}
          />
        </header>

        <div className="desk__handover">
          {mode === "ai" ? (
            <button type="button" className="ghost-btn" onClick={takeOver}>
              {ui.takeOver}
            </button>
          ) : (
            <button type="button" className="ghost-btn" onClick={resume}>
              {ui.resumeAi}
            </button>
          )}
          <Marker n={2} />
        </div>

        <div className="desk__msgs" role="log" aria-live="polite" aria-label={s.selectedName}>
          {s.thread.map((m, i) => (
            <MessageRow key={i} msg={m} aiLabel={m.from === "chaster" ? ui.sentByAi : undefined} />
          ))}
          <MessageRow msg={s.pendingCustomer} state={pending ? "shown" : "pending"} />
          {owner.map((m, i) => (
            <MessageRow key={`o${i}`} msg={m} />
          ))}
          <MessageRow msg={s.aiReply} state={aiState} aiLabel={ui.sentByAi} />
          <p className="desk__silent t-meta" data-on={mode === "you"}>
            <Cell size={9} state={{ kind: "outline" }} />
            {desk.silent}
          </p>
        </div>

        <form className="desk__composer" onSubmit={send} inert={mode !== "you"} data-on={mode === "you"}>
          <input
            type="text"
            className="desk__input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={ui.writeReply}
            aria-label={ui.writeReply}
          />
          <button type="submit" className="ghost-btn">
            {ui.send}
          </button>
        </form>
      </div>

      {/* context: the booking strip */}
      <aside className="desk__ctx">
        <p className="desk__ctx-title">{ui.onTheBook}</p>
        <div className="desk__booking">
          <Cell size={12} state={{ kind: "signal", id: "bookings" }} />
          <span className="tnum">{s.booking}</span>
        </div>
        <span className="desk__ctx-action">{ui.manage}</span>
        <Marker n={3} />
      </aside>
    </div>
  );
}
