"use client";

import { useCallback, useState } from "react";
import type { Copy } from "@/content";
import type { ChatMsg } from "@/content/types";
import { Thread } from "../thread/Thread";

/** The "with Chaster" thread of S2. Plays once when it scrolls into view; one field cell lights when the outcome lands. */
export function DayWith({ messages, copy }: { messages: ChatMsg[]; copy: Copy }) {
  const [lit, setLit] = useState(false);
  const onResult = useCallback(() => setLit(true), []);
  return (
    <div className="day-with" data-lit={lit ? "1" : "0"}>
      <Thread
        messages={messages}
        name={copy.day.with}
        channel="messenger"
        meta="23:40"
        status={copy.ui.aiAnswering}
        result={{ text: copy.day.withOutcome, signal: "catalog" }}
        autoplay="view"
        onResult={onResult}
        photoLabel={copy.ui.photo}
        logLabel={copy.day.with}
      />
    </div>
  );
}
