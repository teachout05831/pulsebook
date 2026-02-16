'use client'

interface Props {
  name: string
  color: string
  size?: 'sm' | 'md'
  onRemove?: () => void
}

export function TagBadge({ name, color, size = 'sm', onRemove }: Props) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70"
          aria-label={`Remove ${name}`}
        >
          &times;
        </button>
      )}
    </span>
  )
}
