'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

export type NavLinkProps = ComponentProps<typeof Link> & {
  shouldMatchExact?: boolean
}

export function NavLink({ shouldMatchExact = false, ...props }: NavLinkProps) {
  const pathname = usePathname()

  const isCurrent =
    props.href === '/' || shouldMatchExact
      ? pathname === props.href
      : pathname.startsWith(props.href.toString())

  return <Link {...props} prefetch={false} data-current={isCurrent} />
}
