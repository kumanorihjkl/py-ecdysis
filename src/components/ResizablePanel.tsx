import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface ResizablePanelProps {
  direction: 'horizontal' | 'vertical';
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: [ReactNode, ReactNode];
  onResize?: () => void;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  direction,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  children,
  onResize,
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        const x = e.clientX - rect.left;
        newSize = (x / rect.width) * 100;
      } else {
        const y = e.clientY - rect.top;
        newSize = (y / rect.height) * 100;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
      
      // Call onResize callback during dragging
      if (onResize) {
        onResize();
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Call onResize callback when dragging ends
      if (onResize) {
        onResize();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, direction, minSize, maxSize, onResize]);

  // Use ResizeObserver to detect size changes
  useEffect(() => {
    if (!containerRef.current || !onResize) return;

    const resizeObserver = new ResizeObserver(() => {
      onResize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const isHorizontal = direction === 'horizontal';
  const firstPanelStyle = isHorizontal
    ? { width: `${size}%` }
    : { height: `${size}%` };
  const secondPanelStyle = isHorizontal
    ? { width: `${100 - size}%` }
    : { height: `${100 - size}%` };

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} h-full w-full overflow-hidden`}
    >
      <div style={firstPanelStyle} className="overflow-hidden">
        {children[0]}
      </div>
      
      <div
        className={`${
          isHorizontal
            ? 'w-1 hover:w-2 cursor-col-resize'
            : 'h-1 hover:h-2 cursor-row-resize'
        } bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-150 flex-shrink-0`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`${
            isHorizontal ? 'h-full w-full' : 'w-full h-full'
          } flex items-center justify-center`}
        >
          <div
            className={`${
              isHorizontal
                ? 'h-8 w-1 bg-gray-400 dark:bg-gray-500'
                : 'w-8 h-1 bg-gray-400 dark:bg-gray-500'
            } rounded-full`}
          />
        </div>
      </div>
      
      <div style={secondPanelStyle} className="overflow-hidden">
        {children[1]}
      </div>
    </div>
  );
};
