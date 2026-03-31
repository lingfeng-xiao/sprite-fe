import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LifeCommandType } from '@/types/api'

interface CommandTypeSelectorProps {
  value: LifeCommandType
  onChange: (value: LifeCommandType) => void
  options?: LifeCommandType[]
  className?: string
}

const defaultOptions: LifeCommandType[] = ['ASK', 'TASK', 'RESEARCH', 'ACTION', 'LEARNING', 'DECISION']

export function CommandTypeSelector({
  value,
  onChange,
  options = defaultOptions,
  className,
}: CommandTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LifeCommandType)}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((type) => (
          <SelectItem key={type} value={type}>
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
