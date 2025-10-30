
import React, { useState, useCallback, useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewArea } from './components/PreviewArea';
import type { TextOptions, BackgroundOptions, UploadedFont } from './types';
import { DEFAULT_FONTS } from './constants';

const DEFAULT_SHADOW: TextOptions['shadow'] = {
  enabled: true,
  offsetX: 2,
  offsetY: 2,
  blur: 4,
  color: '#000000'
};

const DEFAULT_OUTLINE: TextOptions['outline'] = {
  enabled: false,
  width: 2,
  color: '#000000'
};

const App: React.FC = () => {
  const [text, setText] = useState<string>('DIỄM XƯA');
  const [textOptions, setTextOptions] = useState<TextOptions>({
    fontFamily: 'Roboto',
    fontSize: 72,
    fontColor: '#FFFFFF',
    textAlign: 'center',
    shadow: DEFAULT_SHADOW,
    outline: DEFAULT_OUTLINE
  });
  const [backgroundOptions, setBackgroundOptions] = useState<BackgroundOptions>({
    color: '#1a202c',
    transparent: false,
  });
  const [uploadedFonts, setUploadedFonts] = useState<UploadedFont[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleFontUpload = useCallback((file: File) => {
    if (!file || (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf'))) {
      alert('Please upload a valid .ttf or .otf font file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const fontName = file.name.replace(/\.(ttf|otf)$/i, '');
      const fontDataUrl = reader.result as string;

      const styleId = `dynamic-font-${fontName.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const newStyle = document.createElement('style');
      newStyle.id = styleId;
      newStyle.innerHTML = `
        @font-face {
          font-family: "${fontName}";
          src: url(${fontDataUrl});
        }
      `;
      document.head.appendChild(newStyle);
      
      setUploadedFonts(prev => {
        if (prev.some(f => f.name === fontName)) {
            return prev;
        }
        return [...prev, { name: fontName }];
      });
      setTextOptions(prev => ({ ...prev, fontFamily: fontName }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDownload = useCallback((format: 'png' | 'jpeg') => {
    if (previewRef.current === null) {
      return;
    }
    setIsLoading(true);
    const downloader = format === 'png' ? toPng : toJpeg;
    downloader(previewRef.current, { cacheBust: true, quality: 0.95, backgroundColor: backgroundOptions.transparent ? 'transparent' : undefined })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `font-preview.${format}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [previewRef, backgroundOptions.transparent]);

  const handleResetEffects = useCallback(() => {
    setTextOptions(prev => ({
      ...prev,
      shadow: DEFAULT_SHADOW,
      outline: DEFAULT_OUTLINE,
    }));
  }, []);

  const allFonts = [...DEFAULT_FONTS, ...uploadedFonts.map(f => ({ name: f.name, family: f.name }))];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col lg:flex-row">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 lg:hidden sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-center text-cyan-400">Font Preview Tool</h1>
      </header>
      <div className="w-full lg:w-[380px] lg:min-w-[380px] bg-gray-800 p-6 lg:h-screen lg:overflow-y-auto">
        <ControlsPanel
          text={text}
          setText={setText}
          textOptions={textOptions}
          setTextOptions={setTextOptions}
          backgroundOptions={backgroundOptions}
          setBackgroundOptions={setBackgroundOptions}
          allFonts={allFonts}
          onFontUpload={handleFontUpload}
          onDownload={handleDownload}
          isLoading={isLoading}
          onResetEffects={handleResetEffects}
        />
      </div>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gray-900">
        <PreviewArea
          ref={previewRef}
          text={text}
          textOptions={textOptions}
          backgroundOptions={backgroundOptions}
        />
      </main>
    </div>
  );
};

export default App;
