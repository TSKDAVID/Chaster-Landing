import { CHANNEL_GLYPHS } from "@/brand/channels.generated";
import { signalVar, type SignalId } from "@/config/modules";
import type { ChatMsg } from "@/content/types";
import { CellMatrix } from "../cell/CellMatrix";
import { Cell } from "../cell/Cell";
import { PICTOGRAMS } from "../cell/bitmaps";

/** Messenger / Instagram glyph as a functional label (monochrome, currentColor), never a logo wall (§1.10). */
export function ChannelMark({ channel, size = 16, className }: { channel: "messenger" | "instagram"; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d={CHANNEL_GLYPHS[channel]} />
    </svg>
  );
}

/** Three cells pulsing in sequence: the Type motion's typing indicator. Animation lives in CSS. */
export function TypingCells() {
  return (
    <span className="typing-cells" aria-hidden="true">
      <Cell size={8} state={{ kind: "solid", color: "var(--color-ink)" }} />
      <Cell size={8} state={{ kind: "solid", color: "var(--color-ink)" }} />
      <Cell size={8} state={{ kind: "solid", color: "var(--color-ink)" }} />
    </span>
  );
}

/** Status is text plus a tiny square cell (the app's `.ch-status`), never a pill or a green dot (§1.10). */
export function Status({
  text,
  signal = "inbox",
  outline = false,
}: {
  text: string;
  signal?: SignalId;
  /** The white outline ring: a chat the owner is handling themselves ("yours", §1.5). */
  outline?: boolean;
}) {
  return (
    <span className="status">
      <span>{text}</span>
      <Cell size={9} state={outline ? { kind: "outline" } : { kind: "signal", id: signal }} />
    </span>
  );
}

/**
 * A sent photo. Real photos come from the owner and are sampled into cells at build time (§1.10); until then it is the
 * media pictogram in a frame, labelled with the app's own "Photo" string.
 */
export function PixelPhoto({ label }: { label: string }) {
  return (
    <div className="pphoto" role="img" aria-label={label}>
      <CellMatrix rows={PICTOGRAMS.media} cell={6} signal="media" />
      <span className="pphoto__label">{label}</span>
    </div>
  );
}

export type MsgState = "shown" | "typing" | "pending";

/**
 * One message. Pending messages stay in the layout (`visibility: hidden`) so the thread never reflows while it plays,
 * which keeps CLS at zero. Customer messages sit left, Chaster's and the owner's sit right.
 */
export function MessageRow({
  msg,
  state = "shown",
  photoLabel,
  aiLabel,
}: {
  msg: ChatMsg;
  state?: MsgState;
  photoLabel?: string;
  aiLabel?: string;
}) {
  const outgoing = msg.from !== "customer";
  return (
    <div className="msg" data-from={msg.from} data-state={state}>
      <div className="msg__bubble">{msg.text}</div>
      {msg.photo && photoLabel ? <PixelPhoto label={photoLabel} /> : null}
      {msg.time || aiLabel ? (
        <div className="msg__meta tnum">
          {msg.time}
          {aiLabel ? <span>{msg.time ? " · " : ""}{aiLabel}</span> : null}
        </div>
      ) : null}
      {outgoing ? (
        <div className="msg__typing">
          <TypingCells />
        </div>
      ) : null}
    </div>
  );
}

/** The line that lands last: a signal cell in the matching module colour plus what just happened. */
export function ResultLine({ text, signal, shown = true }: { text: string; signal: SignalId; shown?: boolean }) {
  return (
    <div className="result" data-shown={shown} style={{ "--sig": signalVar(signal) } as React.CSSProperties}>
      <Cell size={12} state={{ kind: "signal", id: signal }} />
      <span>{text}</span>
    </div>
  );
}

/** The frame every thread sits in: a structure-radius panel with a hairline header. */
export function ThreadFrame({
  name,
  channel,
  meta,
  status,
  statusSignal,
  children,
  className = "",
  logLabel,
}: {
  name: string;
  channel: "messenger" | "instagram";
  meta?: string;
  status?: string;
  statusSignal?: SignalId;
  children: React.ReactNode;
  className?: string;
  logLabel: string;
}) {
  return (
    <div className={`thread ${className}`}>
      <header className="thread__head">
        <span className="thread__who">
          <ChannelMark channel={channel} size={16} className="thread__channel" />
          <span className="thread__name">{name}</span>
          {meta ? <span className="thread__meta tnum">{meta}</span> : null}
        </span>
        {status ? <Status text={status} signal={statusSignal} /> : null}
      </header>
      <div className="thread__body" role="log" aria-label={logLabel}>
        {children}
      </div>
    </div>
  );
}
