import { useState } from "react"
import { Link } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Copy01Icon,
  CheckmarkCircle01Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import type { ShortenResponse } from "@/api/urls"
import { toast } from "sonner"

interface Props {
  result: ShortenResponse
}

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.short_url)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HugeiconsIcon icon={Link01Icon} size={18} />
          Your short link is ready
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <a
            href={result.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate rounded-md border px-3 py-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            {result.short_url}
          </a>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            <HugeiconsIcon
              icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
              size={16}
              className="mr-1"
            />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>

        <p className="truncate text-sm text-muted-foreground">
          → {result.original_url}
        </p>

        <Link
          to={`/stats/${result.short_code}`}
          className="text-sm underline underline-offset-4"
        >
          View stats
        </Link>
      </CardContent>
    </Card>
  )
}
