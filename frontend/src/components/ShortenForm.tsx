import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { shortenUrl, type ShortenResponse } from "@/api/urls"
import { toast } from "sonner"

interface Props {
  onResult: (result: ShortenResponse) => void
}

// Handles the create-short-link form.
// On success, calls onResult so the parent page can display it.
export function ShortenForm({ onResult }: Props) {
  const [url, setUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    try {
      setLoading(true)
      const result = await shortenUrl({
        url: url.trim(),
        custom_code: customCode,
      })
      onResult(result)
      setUrl("")
      setCustomCode("")
      toast.success("Short link created")
    } catch (err: unknown) {
      // axios errors carry response.data.message from our AppError JSON
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to shorten URL"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="url">Long URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/some/very/long/path"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customCode">Custom code (optional)</Label>
        <Input
          id="customCode"
          placeholder="my-link"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Shortening..." : "Shorten URL"}
      </Button>
    </form>
  )
}
