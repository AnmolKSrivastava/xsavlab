import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

const CountUpNumber = ({
  end,
  start = 0,
  duration = 1.6,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();
    const totalChange = end - start;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = start + totalChange * eased;
      setValue(nextValue);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, start, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUpNumber;
