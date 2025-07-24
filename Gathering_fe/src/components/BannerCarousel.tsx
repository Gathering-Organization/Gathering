import React, { useEffect, useRef, useCallback, useState } from 'react';
import EmblaCarousel, { EmblaOptionsType } from 'embla-carousel';

interface EmblaCarouselProps {
  options?: EmblaOptionsType;
  slides: React.ReactNode[];
}

const EmblaCarouselComponent: React.FC<EmblaCarouselProps> = ({ options, slides }) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const emblaRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    emblaRef.current?.scrollPrev();
  }, []);

  const scrollNext = useCallback(() => {
    emblaRef.current?.scrollNext();
  }, []);

  const scrollTo = (index: number) => {
    emblaRef.current?.scrollTo(index);
  };

  const onSelect = useCallback(() => {
    if (!emblaRef.current) return;
    setSelectedIndex(emblaRef.current.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      emblaRef.current = EmblaCarousel(viewportRef.current, options);
      emblaRef.current.on('select', onSelect);
      onSelect();
    }

    return () => {
      emblaRef.current?.destroy();
    };
  }, [options, onSelect]);

  return (
    <div className="relative w-full">
      {/* Viewport */}
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full px-2">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md p-3 rounded-full transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollNext}
        className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md p-3 rounded-full transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === selectedIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default EmblaCarouselComponent;
