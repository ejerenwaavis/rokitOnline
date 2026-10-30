import { Helmet } from 'react-helmet-async';
import PhotoEnhancerSection from '../components/sections/PhotoEnhancer/PhotoEnhancer';

export default function PhotoEnhancerPage() {
  return (
    <>
      <Helmet>
        <title>AI Photo Enhancer — Tools at rOKIt</title>
        <meta
          name="description"
          content="Restore and upscale old, blurry, or vintage photos to HD quality with AI-powered face restoration and enhancement."
        />
        <meta property="og:title" content="AI Photo Enhancer — Tools at rOKIt" />
        <meta
          property="og:description"
          content="Restore and upscale old, blurry, or vintage photos to HD quality."
        />
      </Helmet>

      <div className="font-v4-body text-paper py-12">
        <PhotoEnhancerSection />
      </div>
    </>
  );
}
