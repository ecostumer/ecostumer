import { getCurrentOrg } from '@/auth/auth'

import { NavLink } from './nav-link'
import { Button } from './ui/button'

export function Tabs() {
  const currentOrg = getCurrentOrg()
  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        {/* <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/org/${currentOrg}`}>Projetos</NavLink>
        </Button> */}
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/org/${currentOrg}/members`}>Membros</NavLink>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
        >
          <NavLink href={`/org/${currentOrg}/settings`}>
            Configurações & Faturamento
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}
