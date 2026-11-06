interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  stroke?: number
  label?: string
  caption?: string
}

export default function ProgressRing({
  value,
  max = 100,
  size = 132,
  stroke = 10,
  label,
  caption,
}: ProgressRingProps) {
  const safeMax = max || 1
  const percent = Math.max(0, Math.min(100, (value / safeMax) * 100))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div
      className="progress-ring"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={Math.round(safeMax)}
      aria-label={caption ? `${label ?? `${Math.round(percent)}%`} ${caption}` : undefined}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-center">
        <strong>{label ?? `${Math.round(percent)}%`}</strong>
        {caption && <span>{caption}</span>}
      </div>
    </div>
  )
}
