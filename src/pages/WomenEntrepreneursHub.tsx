import React from 'react'
import { Header } from '../components/Header';
import { AuthProvider } from '../context/AuthProvider';
import { Footer } from '../components/Footer'
import HeroSection from '../components/women-entrepreneurs/HeroSection'
import RegionalHighlights from '../components/women-entrepreneurs/RegionalHighlights'
import FeaturedStories from '../components/women-entrepreneurs/FeaturedStories'
import EcosystemMap from '../components/women-entrepreneurs/EcosystemMap'
import PlatformOfferings from '../components/women-entrepreneurs/PlatformOfferings'
import ProgramsInitiatives from '../components/women-entrepreneurs/ProgramsInitiatives'
import GetInvolved from '../components/women-entrepreneurs/GetInvolved'
const WomenEntrepreneursPage: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col w-full min-h-screen bg-white">
        <Header
          toggleSidebar={() => {}}
          sidebarOpen={false}
          data-id="enterprise-journey-header"
        />
        <main className="flex-1" role="main">
          <HeroSection 
            onExploreClick={() => {
              // Scroll to featured stories section
              const element = document.getElementById('featured-stories');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            onShareClick={() => {
              // Scroll to ecosystem map section
              const element = document.getElementById('ecosystem-map');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
          <RegionalHighlights />
          <FeaturedStories />
          <EcosystemMap />
          <PlatformOfferings />
          <ProgramsInitiatives />
          <GetInvolved />
        </main>
        <Footer data-id="enterprise-journey-footer" />
      </div>
    </AuthProvider>
  )
}
export default WomenEntrepreneursPage
