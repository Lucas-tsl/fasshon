function Star({ filled, half = false }: { filled: boolean; half?: boolean }) {
  const gradientId = "star-half-gradient";
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      {half ? (
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      ) : null}
      <path
        d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 6-5.2-2.8-5.2 2.8 1-6-4.3-4.2 5.9-.8L10 1.5z"
        fill={half ? `url(#${gradientId})` : filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={`flex items-center gap-1 ${size === "md" ? "text-base" : "text-sm"}`}>
      <div className="flex text-accent">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={rounded >= i} half={rounded === i - 0.5} />
        ))}
      </div>
      {count !== undefined ? (
        <span className="text-xs text-foreground/50">
          {value.toFixed(1)} ({count} avis)
        </span>
      ) : null}
    </div>
  );
}
