import { Helmet } from 'react-helmet-async';
import HeroSlider from '../components/sections/HeroSlider';
import StatsSection from '../components/sections/StatsSection';
import ServicesGrid from '../components/sections/ServicesGrid';
import WhyUsSection from '../components/sections/WhyUsSection';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import CTABand from '../components/sections/CTABand';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Rokit Media – Creative Printing & Design Agency | Osogbo, Nigeria</title>
        <meta
          name="description"
          content="Nigeria's leading creative agency for large format printing, branding, graphic design, and web design. Nationwide delivery from Osogbo."
        />
      </Helmet>

      <HeroSlider />
      <StatsSection />
      <ServicesGrid />
      <WhyUsSection />
      <PortfolioPreview />
      <ClientsMarquee />
      <CTABand />
    </>
  );
}
