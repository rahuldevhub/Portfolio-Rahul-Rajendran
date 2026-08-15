import { type HTMLAttributes } from "react";

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns on desktop. Default: 12. */
  cols?: 2 | 3 | 4 | 6 | 12;
  /** Gap between cells. Default: "default". */
  gap?: "sm" | "default" | "lg" | "none";
}

interface ColProps extends HTMLAttributes<HTMLDivElement> {
  /** Column span (1–12). Default: full width. */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Start column (1–12). Optional. */
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

const colsMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const gapMap = {
  none: "gap-0",
  sm: "gap-4",
  default: "gap-6 md:gap-8",
  lg: "gap-8 md:gap-12",
};

const spanMap: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const startMap: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
};

/** 12-column grid wrapper. */
export function Grid({
  cols = 12,
  gap = "default",
  className = "",
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={[
        "grid",
        colsMap[cols],
        gapMap[gap],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

/** Grid column cell — controls span and start position. */
export function Col({
  span,
  start,
  className = "",
  children,
  ...props
}: ColProps) {
  return (
    <div
      className={[
        span ? spanMap[span] : "col-span-full",
        start ? startMap[start] : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
