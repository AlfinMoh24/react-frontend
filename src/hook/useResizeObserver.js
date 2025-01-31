import { useEffect } from 'react';

// Debouncing helper function
const debounce = (func, delay) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
};

// Custom hook to observe resize events
const useResizeObserver = (callback) => {
  useEffect(() => {
    const debounceResize = debounce(() => {
      callback();
    }, 200); // Delay time in milliseconds

    const resizeObserver = new ResizeObserver(() => {
      debounceResize();
    });

    resizeObserver.observe(document.body); // You can observe a specific element instead of document.body

    return () => {
      resizeObserver.disconnect(); // Clean up when the component unmounts
    };
  }, [callback]);
};

export default useResizeObserver;
