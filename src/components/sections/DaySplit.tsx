import { withBase } from "@/config/site";
import type { ChatMsg } from "@/content/types";
import type { Copy } from "@/content";
import { MessageRow, ResultLine, ThreadFrame } from "../thread/parts";
import { DayWith } from "./DayWith";
import { VideoPoster } from "./VideoPoster";

/**
 * S2. One „ფასი?“ at 23:40, twice (§1.12, v1.2): two real Messenger threads, no legend to learn. Left, seen at 23:41 and
 * answered at 11:20 the next morning; the outcome carries the red "missed" cell. Right, Chaster answers at 23:41.
 * The "without" panel takes the narrower split: relief gets more room than pain.
 */
export function DaySplit({ copy }: { copy: Copy }) {
  const d = copy.day;
  const withMessages: ChatMsg[] = [
    { from: "customer", text: d.q, time: "23:40" },
    { from: "chaster", text: d.withReply, time: "23:41", photo: true },
    { from: "customer", text: d.withFollowup, time: "23:41" },
    { from: "chaster", text: d.withHandoff, time: "23:42" },
  ];

  return (
    <section id="day" aria-labelledby="day-h2" className="surface-ink sec sec--standard">
      <div className="wrap">
        <div className="day__head lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <h2 id="day-h2" className="t-h2 lg:col-span-4">
            {d.h2}
          </h2>
          <p className="t-lead day__lead lg:col-span-3">{d.lead}</p>
        </div>

        <div className="day__split lg:grid lg:grid-cols-7 lg:gap-x-6 xl:gap-x-8">
          <div className="day__without lg:col-span-3">
            <ThreadFrame name={d.without} channel="messenger" meta="23:40" logLabel={d.without}>
              <MessageRow msg={{ from: "customer", text: d.q, time: "23:40" }} />
              <p className="seen t-meta tnum">
                {d.seen} · 23:41
              </p>
              <p className="gap-line t-meta">
                <span>{d.gap}</span>
              </p>
              <MessageRow msg={{ from: "owner", text: d.withoutReply, time: "11:20" }} />
              <ResultLine text={d.withoutOutcome} signal="missed" />
            </ThreadFrame>
          </div>

          <div className="day__with lg:col-span-4">
            <DayWith messages={withMessages} copy={copy} />
          </div>
        </div>

        <div className="day__foot">
          <div className="day__video">
            <VideoPoster
              src={withBase("/media/chaster-ad.mp4")}
              poster={withBase("/media/chaster-ad-poster.webp")}
              playLabel={d.videoPlay}
              caption={d.videoCaption}
            />
          </div>
          <p className="t-meta day__note">{d.note}</p>
        </div>
      </div>
    </section>
  );
}
