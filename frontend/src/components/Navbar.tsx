import { Link } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link01Icon } from "@hugeicons/core-free-icons"

export function Navbar() {
  return (
    <nav className="border-b px-6 py-3">
      <Link to="/" className="flex items-center gap-2 text-sm font-medium">
        <HugeiconsIcon icon={Link01Icon} size={18} />
      </Link>
    </nav>
  )
}
