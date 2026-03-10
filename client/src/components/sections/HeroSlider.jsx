import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: '/assets/images/1-no-text.jpg',
    title: 'Prints That Make an Impact',
    subtitle: 'Large format, banners, stationery — crafted with precision and passion',
    cta: { label: 'Explore Services', to: '/services' },
    cta2: { label: 'Get a Quote', to: '/portal/quotes/new' },
  },
  {
    image: '/assets/images/strip-1.jpg',
    title: 'Your Brand, Elevated',
    subtitle: 'From concept to creation — branding that tells your story',
    cta: { label: 'View Our Work', to: '/gallery' },
    cta2: { label: 'Start a Project', to: '/portal/orders/new' },
  },
  {
    image: '/assets/images/strip-2.jpg',
    title: 'Design with Love',
    subtitle: 'Every pixel, every line — crafted to represent your vision perfectly',
    cta: { label: 'Our Portfolio', to: '/gallery' },
    cta2: { label: 'Contact Us', to: '/contact' },
  },
];

export default function HeroSlider() {
  return (
    <section className="relative h-screen min-h-[600px]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-screen min-h-[600px] flex items-center">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-2xl">
                  <div className="w-12 h-1 bg-rokit-orange mb-6" />
                  <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 font-light">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to={slide.cta.to} className="btn-primary">
                      {slide.cta.label} <ArrowRight size={18} />
                    </Link>
                    <Link to={slide.cta2.to} className="btn-white">
                      {slide.cta2.label}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Side badge */}
              <div className="absolute right-8 bottom-20 hidden lg:flex flex-col items-center gap-2">
                <div className="w-0.5 h-16 bg-white/30" />
                <span className="text-white/50 text-xs tracking-widest rotate-90 origin-center translate-y-10">SCROLL</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nationwide delivery badge */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-rokit-orange/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <Play size={14} className="text-white fill-white" />
          <span className="text-white text-sm font-semibold tracking-wide">
            NATIONWIDE DELIVERY ACROSS NIGERIA
          </span>
          <Play size={14} className="text-white fill-white" />
        </div>
      </div>
    </section>
  );
}
