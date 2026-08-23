// Standalone AI × Engineering section disabled — AI capability lives in Technical Profile.
// Restore by uncommenting the import and <AIEngineering /> below.
// import { AIEngineering } from '@/components/AIEngineering'
import { About } from '@/components/About'
import { Contact } from '@/components/Contact'
import { CoreExpertise } from '@/components/CoreExpertise'
import { Cursor } from '@/components/Cursor'
import { Education } from '@/components/Education'
import { EngineeringMindset } from '@/components/EngineeringMindset'
import { ExperienceTimeline } from '@/components/ExperienceTimeline'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Navbar } from '@/components/Navbar'
import { ProjectShowcase } from '@/components/ProjectShowcase'
import { ScaleSection } from '@/components/ScaleSection'
import { ScrollProgress } from '@/components/ScrollProgress'

export default function App() {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-bg focus:px-4 focus:py-2 focus:text-text focus:border focus:border-border"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <CoreExpertise />
        <ScaleSection />
        <ProjectShowcase />
        {/* <AIEngineering /> — disabled; AI × Engineering is covered in Technical Profile */}
        <EngineeringMindset />
        <ExperienceTimeline />
        <Education />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
