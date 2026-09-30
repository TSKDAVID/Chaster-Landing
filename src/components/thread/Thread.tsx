"use client";

import { useEffect, useRef, useState } from "react";
import type { SignalId } from "@/config/modules";
import type { ChatMsg } from "@/content/types";
import { MessageRow, ResultLine, ThreadFrame, type MsgState } from "./parts";

/** How long the typing cells pulse before a Chaster message lands (§1.9 "Type"). */
const TYPE_MS = 900;
const CUSTOMER_GAP_MS = 900;

type Props = {
  messages: ChatMsg[];
  name: string;
  channel: "messenger" | "instagram";
  meta?: string;
  status: string;
  result?: { text: string; signal: SignalId };
  /** `mount` starts after `startDelay`; `view` starts when the thread first scrolls into view. */
  autoplay: "mount" | "view";
  startDelay?: number;
  onResult?: () => void;
  photoLabel: string;
  aiLabel?: string;
  logLabel: string;
  className?: string;
};

/**
 * A conversation that plays itself once (§1.9 "Type"). Restarting is the parent's job: change the `key`, which
 * remounts it with fresh state, so there is no reset logic here and no state is set synchronously in an effect.
 *
 * Every message is always in the DOM and pending ones are `visibility: hidden`, so the thread keeps its final height
 * from the first paint (no layout shift). With `prefers-reduced-motion` the CSS shows everything at once.
 */
export function Thread({
  messages,
  name,
  channel,
  meta,
  status,
  result,
  autoplay,
  startDelay = 0,
  onResult,
  photoLabel,
  aiLabel,
  logLabel,
  className,
}: Props) {
  const [step, setStep] = useState(1); // messages fully shown; the first customer message is always visible
  const [typing, setTyping] = useState(false);
  const [resultOn, setResultOn] = useState(false);
  const [started, setStarted] = useState(autoplay === "mount");
  const rootRef = useRef<HTMLDivElement>(null);
  // the callback lives in a ref so a new identity from the parent can never restart the timers
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  });

  // `view`: wait until the thread is actually on screen
  useEffect(() => {
    if (autoplay !== "view" || started) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay, started]);

  useEffect(() => {
    if (!started) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    let t = startDelay;
    for (let k = 1; k < messages.length; k++) {
      if (messages[k].from === "customer") {
        t += CUSTOMER_GAP_MS;
        at(t, () => setStep(k + 1));
      } else {
        t += 250;
        at(t, () => setTyping(true));
        t += TYPE_MS;
        at(t, () => {
          setTyping(false);
          setStep(k + 1);
        });
      }
    }
    t += 500;
    at(t, () => {
      setResultOn(true);
      onResultRef.current?.();
    });
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [started, messages, startDelay]);

  return (
    <div ref={rootRef}>
      <ThreadFrame name={name} channel={channel} meta={meta} status={status} logLabel={logLabel} className={className}>
        {messages.map((m, i) => {
          const state: MsgState = i < step ? "shown" : i === step && typing ? "typing" : "pending";
          return (
            <MessageRow
              key={i}
              msg={m}
              state={state}
              photoLabel={photoLabel}
              aiLabel={m.from === "chaster" ? aiLabel : undefined}
            />
          );
        })}
        {result ? <ResultLine text={result.text} signal={result.signal} shown={resultOn} /> : null}
      </ThreadFrame>
    </div>
  );
}
