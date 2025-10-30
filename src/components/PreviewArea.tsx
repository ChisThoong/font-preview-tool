
import React, { forwardRef, useMemo } from 'react';
import type { TextOptions, BackgroundOptions } from '../types';

interface PreviewAreaProps {
  text: string;
  textOptions: TextOptions;
  backgroundOptions: BackgroundOptions;
}

export const PreviewArea = forwardRef<HTMLDivElement, PreviewAreaProps>(
  ({ text, textOptions, backgroundOptions }, ref) => {
    
    const containerStyle = useMemo<React.CSSProperties>(() => ({
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundColor: backgroundOptions.transparent ? 'transparent' : backgroundOptions.color,
    }), [backgroundOptions]);

    const textStyle = useMemo<React.CSSProperties>(() => {
      const style: React.CSSProperties = {
        fontFamily: textOptions.fontFamily,
        fontSize: `${textOptions.fontSize}px`,
        color: textOptions.fontColor,
        textAlign: textOptions.textAlign,
        whiteSpace: 'pre-wrap',
        lineHeight: 1.2,
      };

      if (textOptions.shadow.enabled) {
        style.textShadow = `${textOptions.shadow.offsetX}px ${textOptions.shadow.offsetY}px ${textOptions.shadow.blur}px ${textOptions.shadow.color}`;
      }
      
      if (textOptions.outline.enabled) {
        style.WebkitTextStroke = `${textOptions.outline.width}px ${textOptions.outline.color}`;
      }

      return style;
    }, [textOptions]);

    return (
      <div className="w-full h-full max-w-7xl aspect-video bg-gray-800/50 rounded-lg shadow-2xl shadow-black/30 overflow-hidden">
        <div ref={ref} style={containerStyle}>
            <div style={{ padding: '40px' }}>
                <span style={textStyle}>{text}</span>
            </div>
        </div>
      </div>
    );
  }
);
