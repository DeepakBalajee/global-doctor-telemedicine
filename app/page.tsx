import { HeroSection } from '@/components/home/HeroSection'
import { TrustIndicators } from '@/components/home/TrustIndicators'
import { SpecialtyGrid } from '@/components/home/SpecialtyGrid'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeatureSection } from '@/components/home/FeatureSection'
import { DoctorCTA } from '@/components/home/DoctorCTA'
import { SecuritySection } from '@/components/home/SecuritySection'
import { FinalCTA } from '@/components/home/FinalCTA'

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. HERO SECTION & DOCTOR SEARCH */}
      <HeroSection />

      {/* 2. TRUST INDICATORS */}
      <TrustIndicators />

      {/* 3. CARE BY SPECIALTY GRID */}
      <SpecialtyGrid />

      {/* 4. HOW IT WORKS 4-STEP PROCESS */}
      <HowItWorks />

      {/* 5. PATIENT EXPERIENCE FEATURES */}
      <FeatureSection />

      {/* 6. DOCTOR CTA & WORKSTATION PREVIEW */}
      <DoctorCTA />

      {/* 7. HEALTHCARE SECURITY & PRIVACY PRINCIPLES */}
      <SecuritySection />

      {/* 8. FINAL CALL TO ACTION */}
      <FinalCTA />
    </div>
  )
}
