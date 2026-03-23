import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

/**
 * LazyImage — loads images with IntersectionObserver,
 * shows a skeleton placeholder while loading, then fades in.
 */
export function LazyImage({ src, alt, className = '', placeholderClassName = '', referrerPolicy }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${placeholderClassName}`}>
      {/* Skeleton placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-surface-border animate-pulse rounded" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-border/50 text-secondary">
          <span className="text-[10px] font-mono uppercase">Err</span>
        </div>
      )}

      {/* Actual image — only rendered when in viewport */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        />
      )}
    </div>
  );
}
