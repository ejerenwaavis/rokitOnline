import { Helmet } from 'react-helmet-async';
import PhotoEnhancerSection from '../components/sections/PhotoEnhancer/PhotoEnhancer';
// import { rokitTheme } from '../components/sections/PhotoEnhancer/enhancerTheme'; // default — omit prop to use it

export default function PhotoEnhancerPage() {
  return (
    <>
      <Helmet>
        <title>AI Photo Enhancer | Rokit Media</title>
        <meta
          name="description"
          content="Restore and upscale old, blurry, or vintage photos to HD quality with AI-powered face restoration and enhancement."
        />
      </Helmet>
      <div style={{ paddingTop: '5rem' }}>
        <PhotoEnhancerSection />
      </div>
    </>
  );
}
