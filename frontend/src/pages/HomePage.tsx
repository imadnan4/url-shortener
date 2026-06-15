import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { ShortenForm } from "@/components/ShortenForm"
import { ResultCard } from "@/components/ResultCard"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShortenResponse } from "@/api/urls"

export function HomePage() {
  const [result, setResult] = useState<ShortenResponse | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-start justify-center p-6">
        <div className="w-full max-w-md space-y-4 pt-12">
          <Card>
            <CardHeader>
              <CardTitle>Shorten a URL</CardTitle>
              <CardDescription>
                Paste a long link and get a short one back.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShortenForm onResult={setResult} />
            </CardContent>
          </Card>
          {result && <ResultCard result={result} />}
        </div>
      </main>
    </div>
  )
}
