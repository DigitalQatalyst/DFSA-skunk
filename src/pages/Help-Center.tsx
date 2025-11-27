import { HelpCenterPage } from '../components/HelpCenter/HelpCenterPage'
import DashboardLayout from './dashboard/DashboardLayout'
import { useAuth } from '../components/Header'
import { useState } from 'react'

export function HelpCenterRoute() {
  const { user } = useAuth()
  const isLoggedIn = Boolean(user)
  const [onboardingComplete] = useState(true) // Help center doesn't require onboarding

  return (
    <DashboardLayout
      onboardingComplete={onboardingComplete}
      setOnboardingComplete={() => {}} // No-op for help center
      isLoggedIn={isLoggedIn}
    >
      <HelpCenterPage />
    </DashboardLayout>
  )
}
export default HelpCenterRoute
