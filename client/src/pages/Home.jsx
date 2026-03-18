import { Helmet } from 'react-helmet-async';
import HeroEditorial from '../components/sections/HeroEditorial';
import ManifestoSection from '../components/sections/ManifestoSection';
import ClientsMarquee from '../components/sections/ClientsMarquee';
import StatsSection from '../components/sections/StatsSection';
import ServicesGrid from '../components/sections/ServicesGrid';
import HeroSlider from '../components/sections/HeroSlider';
import WhyUsSection from '../components/sections/WhyUsSection';
import PortfolioPreview from '../components/sections/PortfolioPreview';
import CTABand from '../components/sections/CTABand';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Rokit Media – Creative Printing & Design Agency | Nigeria & UK</title>
        <meta
          name="description"
          content="Nigeria's leading creative agency for large format printing, branding, graphic design, and web design. Nationwide delivery from Abuja."
        />
      </Helmet>

      <HeroEditorial />
      <HeroSlider />
      <ClientsMarquee />
      <ManifestoSection />
      <StatsSection />
      <ServicesGrid />
      <WhyUsSection />
      <PortfolioPreview />
      <CTABand />
    </>
  );
}
