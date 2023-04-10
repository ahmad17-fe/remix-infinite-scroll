import React, { useEffect, useRef } from "react";
import type { ReactNode, FC } from "react";

interface InfiniteScrollProps {
  loading: boolean;
  children: ReactNode;
  loadNext: () => void;
  hashMore: boolean;
}

const InfiniteScroll: FC<InfiniteScrollProps> = ({
  children,
  loadNext,
  loading,
  hashMore,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (hashMore) {
          if (entry.isIntersecting && !loading) {
            loadNext();
          }
        }
      });
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loading, loadNext, hashMore]);

  return (
    <>
      {children}
      {hashMore ? !loading ? <div ref={targetRef}></div> : null : null}
    </>
  );
};

export default InfiniteScroll;
