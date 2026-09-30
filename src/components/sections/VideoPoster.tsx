"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { Play } from "../ui/Icons";

/**
 * The real 45-second ad, click-to-play (§1.10, §2.4): a static poster frame from the ad itself until the visitor taps.
 * The file is never requested before that, so it never counts against the initial load. Never autoplay.
 */
export function VideoPoster({
  src,
  poster,
  playLabel,
  caption,
}: {
  src: string;
  poster: string;
  playLabel: string;
  caption: string;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <figure className={`video ${playing ? "video--playing" : ""}`}>
      <div className="video__frame">
        {playing ? (
          <video src={src} poster={poster} controls autoPlay playsInline preload="auto" className="video__el">
            {/* the ad is captioned in Georgian on screen */}
          </video>
        ) : (
          <button
            type="button"
            className="video__poster"
            aria-label={`${playLabel}: ${caption}`}
            onClick={() => {
              track("video_play");
              setPlaying(true);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} width={540} height={960} alt="" loading="lazy" decoding="async" />
            <span className="video__play">
              <Play size={22} />
            </span>
          </button>
        )}
      </div>
      <figcaption className="t-meta video__caption">{caption}</figcaption>
    </figure>
  );
}
