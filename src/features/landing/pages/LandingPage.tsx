import { Hero } from "../components/Hero"
import { Features } from "../components/Features"
import { HowItWorks } from "../components/HowItWorks"
import { MapPreview } from "../components/MapPreview"

export default function LandingPage() {
  return (
    <main className="bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <MapPreview />
    </main>
  )
}