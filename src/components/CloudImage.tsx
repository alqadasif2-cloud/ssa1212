import React, { useState, useEffect } from 'react';
import { getCachedMediaData } from '../services/firebase';

interface CloudImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | null | undefined;
  alt?: string;
  className?: string;
}

export const CloudImage: React.FC<CloudImageProps> = ({
  src,
  alt = '',
  className = '',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | null>(() => getCachedMediaData(src));
  const [isLoading, setIsLoading] = useState(() => Boolean(src && !getCachedMediaData(src)));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!src) {
      setCurrentSrc(null);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const cached = getCachedMediaData(src);
    if (cached) {
      setCurrentSrc(cached);
      setIsLoading(false);
      setHasError(false);
    } else {
      setCurrentSrc(src);
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-800/80 text-slate-500 font-bold text-xs select-none ${className}`}
      >
        📷
      </div>
    );
  }

  return (
    <img
      src={currentSrc || src}
      alt={alt}
      className={`${className} ${isLoading ? 'opacity-50 animate-pulse' : 'opacity-100'} transition-opacity`}
      loading="lazy"
      onError={() => setHasError(true)}
      {...props}
    />
  );
};
