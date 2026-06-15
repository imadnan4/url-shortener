import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Chart01Icon } from "@hugeicons/core-free-icons"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStats, type StatsResponse } from "@/api/urls"

// Route: /stats/:code
// Fetches stats for the given short code on mount.
// Three states to handle: loading, error (404), and success.
export function StatsPage() {
  const { code } = useParams<{ code: string }>()
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getStats(code)
        setStats(data)
      } catch {
        setError("Short link not found")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [code])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-start justify-center p-6">
        <div className="w-full max-w-md pt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HugeiconsIcon icon={Chart01Icon} size={18} />
                Stats for /{code}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading && (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              {stats && (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Original URL:{" "}
                    </span>
                    <a
                      href={stats.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all underline underline-offset-4"
                    >
                      {stats.original_url}
                    </a>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Clicks: </span>
                    <span className="font-medium">{stats.click_count}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Created: </span>
                    {new Date(stats.created_at).toLocaleString()}
                  </div>
                </div>
              )}

              <Link
                to="/"
                className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                Shorten another link
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
