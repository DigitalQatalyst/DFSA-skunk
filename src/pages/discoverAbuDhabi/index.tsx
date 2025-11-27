import DirectorySection from '../../components/discoverAbuDhabi/DirectorySection';
import GrowthAreasSection from '../../components/discoverAbuDhabi/GrowthAreasSection';
import SimpleHeroSection from '../../components/discoverAbuDhabi/SimpleHeroSection';
import AbuDhabiMap from '../../components/discoverAbuDhabi/AbuDhabiMap';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';

export function DiscoverAbuDhabi() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <SimpleHeroSection />
        <div id="abu-dhabi-map">
          <AbuDhabiMap />
        </div>
        <GrowthAreasSection />
        <DirectorySection />
      </main>
      <Footer />
    </>
  );
}
