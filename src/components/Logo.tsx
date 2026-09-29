export function Logo({ size = 30 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl bg-brand shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="#fff">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </div>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-xl text-forest ${className}`}>Retain</span>
  )
}
