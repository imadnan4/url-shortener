import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { HomePage } from "./pages/HomePage"
import { StatePage } from "./pages/StatsPage"

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stats/:code" element={<StatePage />} />
      </Routes>
    </BrowserRouter>
  )
}
