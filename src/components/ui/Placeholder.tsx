interface PlaceholderProps {
  /** Descriptive label for what will replace this placeholder. */
  label: string;
  /** Aspect ratio as "width/height" CSS string. Default: "16/9". */
  aspect?: string;
  /** Additional CSS classes. */
  className?: string;
  /** "video" shows a play button; "image" shows a camera. Default: "image". */
  type?: "image" | "video";
}

/**
 * Labeled placeholder for images, videos, and other media.
 * Reads as a designed "asset goes here" slot — not a blank void.
 * Trivial to replace: swap this component for <Image>, <video>, etc.
 *
 * Visual treatment:
 *   - Solid hairline border (not dashed — dashed reads broken)
 *   - Fine dot grid via CSS radial-gradient — tonal, barely-there texture
 *   - Centered icon at 40% opacity — present but not competing
 *   - Label in mono, uppercase — intentional annotation
 */
export function Placeholder({
  label,
  aspect = "16/9",
  className = "",
  type = "image",
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={[
        "relative flex items-center justify-center overflow-hidden",
        "rounded-[var(--radius-lg)]",
        "select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        aspectRatio: aspect,
        backgroundColor: "var(--bg)",
        border: "1px solid var(--border)",
        /* Subtle dot grid — uses border color dots on bg base */
        backgroundImage:
          "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Centered content */}
      <div className="relative flex flex-col items-center gap-2.5 p-6 text-center">
        {type === "video" ? (
          /* Play circle */
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              border: "1.5px solid var(--text-muted)",
              opacity: 0.4,
            }}
            aria-hidden="true"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              style={{ color: "var(--text-muted)", marginLeft: "2px" }}
            >
              <path d="M2.5 1.5l9 5-9 5V1.5z" fill="currentColor" />
            </svg>
          </div>
        ) : (
          /* Camera icon */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ color: "var(--text-muted)", opacity: 0.38 }}
          >
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}

        <span
          className="text-[10px] font-medium tracking-[0.08em] uppercase"
          style={{
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono, monospace)",
            opacity: 0.65,
            maxWidth: "22ch",
            lineHeight: 1.5,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
