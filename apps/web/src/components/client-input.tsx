import { Command as CommandPrimitive } from 'cmdk'
import { Check, User } from 'lucide-react'
import Image from 'next/image'
import { type KeyboardEvent, useCallback, useRef, useState } from 'react'

import { cn } from '../lib/utils'
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Skeleton } from './ui/skeleton'

export interface ClientOption {
  id: string
  name: string
  avatarUrl: string | null
}

type AutoCompleteProps = {
  name: string
  options: ClientOption[]
  emptyMessage: string
  value?: ClientOption | null
  onValueChange?: (value: ClientOption | null) => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export const AutoComplete = ({
  name,
  options,
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setOpen] = useState(false)
  const [selected, setSelected] = useState<ClientOption | null>(value || null)
  const [inputValue, setInputValue] = useState<string>(value?.name || '')

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) {
        return
      }

      if (!isOpen) {
        setOpen(true)
      }

      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options.find(
          (option) => option.name.toLowerCase() === input.value.toLowerCase(),
        )
        if (optionToSelect) {
          setSelected(optionToSelect)
          onValueChange?.(optionToSelect)
        }
      }

      if (event.key === 'Escape') {
        input.blur()
      }
    },
    [isOpen, options, onValueChange],
  )

  const handleBlur = useCallback(() => {
    setOpen(false)
    setInputValue(selected?.name || '')
  }, [selected])

  const handleSelectOption = useCallback(
    (selectedOption: ClientOption) => {
      setInputValue(selectedOption.name)
      setSelected(selectedOption)
      onValueChange?.(selectedOption)

      setTimeout(() => {
        inputRef?.current?.blur()
      }, 0)
    },
    [onValueChange],
  )

  return (
    <>
      <input type="hidden" name={name} value={value?.id} />
      <CommandPrimitive onKeyDown={handleKeyDown}>
        <div>
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="text-base"
          />
        </div>
        <div className="relative mt-1">
          <div
            className={cn(
              'absolute top-0 z-10 w-full rounded-xl bg-white outline-none animate-in fade-in-0 zoom-in-95',
              isOpen ? 'block' : 'hidden',
            )}
          >
            <CommandList className="rounded-lg ring-1 ring-slate-200">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selected?.id === option.id
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className={cn(
                          'flex w-full items-center gap-2',
                          !isSelected ? 'pl-8' : null,
                        )}
                      >
                        {isSelected ? <Check className="w-4" /> : null}
                        {option.avatarUrl ? (
                          <Image
                            src={option.avatarUrl}
                            alt={option.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <User className="h-6 w-6 rounded-full bg-gray-200 p-1" />
                        )}
                        {option.name}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading && options.length === 0 ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        </div>
      </CommandPrimitive>
    </>
  )
}
