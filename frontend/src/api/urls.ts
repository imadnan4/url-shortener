import api from "./axios"

export interface ShortenResponse {
  short_code: string
  short_url: string
  original_url: string
}

export interface StatsResponse {
  short_code: string
  click_count: number
  original_url: string
  created_at: string
}

export interface ShortenInput {
  url: string
  custom_code?: string
}

// POST /api/shorten
export const shortenUrl = async (
  input: ShortenInput
): Promise<ShortenResponse> => {
  const payload: ShortenInput = { url: input.url }
  if (input.custom_code?.trim()) {
    payload.custom_code = input.custom_code.trim()
  }
  const res = await api.post<ShortenResponse>("/api/shorten", payload)
  return res.data
}

// GET /api/stats/:code
export const getStats = async (code: string): Promise<StatsResponse> => {
  const res = await api.get<StatsResponse>(`/api/stats/${code}`)
  return res.data
}
