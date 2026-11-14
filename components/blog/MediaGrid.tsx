import { Children, type ReactNode } from "react";

/*
 * Lays portrait media (phone screenshots, vertical video, phone photos)
 * side by side so each one doesn't eat a full screen of vertical scroll.
 *
 * MDX usage (string props only -- next-mdx-remote blocks JS expressions):
 *
 *   <MediaGrid caption="..." aspect="9/16">
 *     <Media src="/a.jpg" alt="..." label="..." position="top" />
 *     <Media src="/b.mp4" poster="/b.jpg" alt="..." video="true" />
 *   </MediaGrid>
 */

interface MediaProps {
  src: string;
  alt: string;
  /** Short label shown under the tile. */
  label?: string;
  /** Any value renders a <video> instead of an image. */
  video?: string;
  poster?: string;
  /** CSS object-position for the crop, e.g. "top" for phone screenshots. */
  position?: string;
  /** Set by MediaGrid. */
  aspect?: string;
}

export function Media({ src, alt, label, video, poster, position, aspect = "9/16" }: MediaProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
        style={{ aspectRatio: aspect }}
      >
        {video ? (
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            muted
            preload="metadata"
            aria-label={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <a href={src} target="_blank" rel="noopener noreferrer" aria-label={`${alt} (full size)`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              style={{ objectPosition: position ?? "center" }}
            />
          </a>
        )}
      </div>
      {label && <span className="text-xs font-mono text-neutral-500">{label}</span>}
    </div>
  );
}

interface MediaGridProps {
  children: ReactNode;
  caption?: string;
  /** Tile aspect ratio, e.g. "9/16" (default) or "4/3". */
  aspect?: string;
}

export default function MediaGrid({ children, caption, aspect = "9/16" }: MediaGridProps) {
  const tiles = Children.toArray(children).filter(
    (c): c is React.ReactElement<MediaProps> => typeof c === "object" && c !== null && "props" in c,
  );
  const cols = tiles.length >= 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";

  return (
    <figure className="media-grid my-8">
      <div className={`grid ${cols} gap-3`}>
        {tiles.map((tile) => (
          <Media key={tile.props.src} {...tile.props} aspect={aspect} />
        ))}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-neutral-500 italic">{caption}</figcaption>}
    </figure>
  );
}
