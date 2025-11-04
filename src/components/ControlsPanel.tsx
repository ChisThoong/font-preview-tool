import React, { useCallback } from 'react';
import type { TextOptions, BackgroundOptions, Font } from '../types';
import { UploadIcon, DownloadIcon, CopyIcon, LoadingIcon } from './icons';

interface ControlsPanelProps {
  text: string;
  setText: (text: string) => void;
  textOptions: TextOptions;
  setTextOptions: (options: TextOptions | ((prev: TextOptions) => TextOptions)) => void;
  backgroundOptions: BackgroundOptions;
  setBackgroundOptions: (options: BackgroundOptions | ((prev: BackgroundOptions) => BackgroundOptions)) => void;
  allFonts: Font[];
  onFontUpload: (file: File) => void;
  onDownload: (format: 'png' | 'jpeg') => void;
  isLoading: boolean;
  onResetEffects: () => void;
}

const ControlSection: React.FC<{ title: string; children: React.ReactNode; onReset?: () => void }> = ({ title, children, onReset }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
      <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">{title}</h3>
      {onReset && (
        <button onClick={onReset} className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 px-1.5 py-0.5 rounded transition">Reset</button>
      )}
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const LabeledControl: React.FC<{ label: string; htmlFor: string; children: React.ReactNode }> = ({ label, htmlFor, children }) => (
    <div>
        <label htmlFor={htmlFor} className="block text-xs text-gray-400 mb-1">{label}</label>
        {children}
    </div>
);

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  text, setText, textOptions, setTextOptions, backgroundOptions, setBackgroundOptions,
  allFonts, onFontUpload, onDownload, isLoading, onResetEffects
}) => {

  const handleTextOptionsChange = <K extends keyof TextOptions>(key: K, value: TextOptions[K]) => {
    setTextOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleShadowChange = <K extends keyof TextOptions['shadow']>(key: K, value: TextOptions['shadow'][K]) => {
    setTextOptions(prev => ({...prev, shadow: {...prev.shadow, [key]: value}}));
  };

  const handleOutlineChange = <K extends keyof TextOptions['outline']>(key: K, value: TextOptions['outline'][K]) => {
    setTextOptions(prev => ({...prev, outline: {...prev.outline, [key]: value}}));
  };

  const copyCssToClipboard = useCallback(() => {
    const { fontFamily, fontSize, fontColor, textAlign, shadow, outline } = textOptions;
    const styles = [
        `font-family: '${fontFamily}', sans-serif;`,
        `font-size: ${fontSize}px;`,
        `color: ${fontColor};`,
        `text-align: ${textAlign};`,
    ];
    if (shadow.enabled) {
        styles.push(`text-shadow: ${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color};`);
    }
    if (outline.enabled) {
        styles.push(`-webkit-text-stroke: ${outline.width}px ${outline.color};`);
    }
    const cssString = styles.join('\n');
    navigator.clipboard.writeText(cssString).then(() => {
        alert('CSS styles copied to clipboard!');
    }, (err) => {
        console.error('Failed to copy CSS: ', err);
    });
  }, [textOptions]);


  return (
    <div className="flex flex-col h-full">
      
      <ControlSection title="Text & Font">
        <LabeledControl label="Text Content" htmlFor="text-input">
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 text-sm bg-gray-700 border border-gray-600 rounded focus:ring-1 focus:ring-cyan-500 focus:outline-none transition"
            rows={2}
          />
        </LabeledControl>

        <div className="grid grid-cols-[1fr_auto] gap-2">
            <LabeledControl label="Font Family" htmlFor="font-select">
                <select
                  id="font-select"
                  value={textOptions.fontFamily}
                  onChange={(e) => handleTextOptionsChange('fontFamily', e.target.value)}
                  className="w-full p-2 text-sm bg-gray-700 border border-gray-600 rounded focus:ring-1 focus:ring-cyan-500 focus:outline-none transition"
                >
                  {allFonts.map(font => <option key={font.name} value={font.family}>{font.name}</option>)}
                </select>
            </LabeledControl>
            <div className="flex items-end">
                <label htmlFor="font-upload" className="cursor-pointer p-2 bg-cyan-600 hover:bg-cyan-700 rounded inline-block transition text-white">
                    <UploadIcon />
                </label>
                <input id="font-upload" type="file" accept=".ttf,.otf" className="hidden" onChange={(e) => e.target.files && onFontUpload(e.target.files[0])} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <LabeledControl label={`Size: ${textOptions.fontSize}px`} htmlFor="font-size">
                <input id="font-size" type="range" min="12" max="300" value={textOptions.fontSize} onChange={(e) => handleTextOptionsChange('fontSize', parseInt(e.target.value, 10))} className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            </LabeledControl>
            
            <LabeledControl label="Color" htmlFor="font-color">
                <input id="font-color" type="color" value={textOptions.fontColor} onChange={(e) => handleTextOptionsChange('fontColor', e.target.value)} className="w-full h-8 p-0.5 bg-gray-700 border border-gray-600 rounded cursor-pointer" />
            </LabeledControl>
        </div>

        {/* <LabeledControl label="Alignment" htmlFor="text-align">
            <div className="flex items-center bg-gray-700 border border-gray-600 rounded">
                {(['left', 'center', 'right'] as TextAlign[]).map(align => (
                    <button key={align} onClick={() => handleTextOptionsChange('textAlign', align)} className={`flex-1 p-1.5 transition ${textOptions.textAlign === align ? 'bg-cyan-600 text-white' : 'hover:bg-gray-600 text-gray-400'}`}>
                       {align === 'left' ? <AlignLeftIcon/> : align === 'center' ? <AlignCenterIcon/> : <AlignRightIcon/>}
                    </button>
                ))}
            </div>
        </LabeledControl> */}
      </ControlSection>

      <ControlSection title="Effects" onReset={onResetEffects}>
        {/* Shadow Controls */}
        <div className="p-2 bg-gray-700/50 rounded">
            <div className="flex items-center mb-2">
                <input type="checkbox" id="shadow-enable" checked={textOptions.shadow.enabled} onChange={e => handleShadowChange('enabled', e.target.checked)} className="w-3.5 h-3.5 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500" />
                <label htmlFor="shadow-enable" className="ml-2 text-xs font-medium">Text Shadow</label>
            </div>
            {textOptions.shadow.enabled && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <LabeledControl label={`X: ${textOptions.shadow.offsetX}px`} htmlFor="shadow-x"><input id="shadow-x" type="range" min="-20" max="20" value={textOptions.shadow.offsetX} onChange={e => handleShadowChange('offsetX', parseInt(e.target.value,10))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" /></LabeledControl>
                    <LabeledControl label={`Y: ${textOptions.shadow.offsetY}px`} htmlFor="shadow-y"><input id="shadow-y" type="range" min="-20" max="20" value={textOptions.shadow.offsetY} onChange={e => handleShadowChange('offsetY', parseInt(e.target.value,10))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" /></LabeledControl>
                    <LabeledControl label={`Blur: ${textOptions.shadow.blur}px`} htmlFor="shadow-blur"><input id="shadow-blur" type="range" min="0" max="40" value={textOptions.shadow.blur} onChange={e => handleShadowChange('blur', parseInt(e.target.value,10))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" /></LabeledControl>
                    <LabeledControl label="Color" htmlFor="shadow-color"><input id="shadow-color" type="color" value={textOptions.shadow.color} onChange={e => handleShadowChange('color', e.target.value)} className="w-full h-6 p-0.5 bg-gray-700 border border-gray-600 rounded cursor-pointer" /></LabeledControl>
                </div>
            )}
        </div>
        {/* Outline Controls */}
        <div className="p-2 bg-gray-700/50 rounded">
            <div className="flex items-center mb-2">
                <input type="checkbox" id="outline-enable" checked={textOptions.outline.enabled} onChange={e => handleOutlineChange('enabled', e.target.checked)} className="w-3.5 h-3.5 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500" />
                <label htmlFor="outline-enable" className="ml-2 text-xs font-medium">Outline (Stroke)</label>
            </div>
            {textOptions.outline.enabled && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                     <LabeledControl label={`Width: ${textOptions.outline.width}px`} htmlFor="outline-width"><input id="outline-width" type="range" min="1" max="15" value={textOptions.outline.width} onChange={e => handleOutlineChange('width', parseInt(e.target.value,10))} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" /></LabeledControl>
                     <LabeledControl label="Color" htmlFor="outline-color"><input id="outline-color" type="color" value={textOptions.outline.color} onChange={e => handleOutlineChange('color', e.target.value)} className="w-full h-6 p-0.5 bg-gray-700 border border-gray-600 rounded cursor-pointer" /></LabeledControl>
                </div>
            )}
        </div>
      </ControlSection>

      <ControlSection title="Background">
        <div className="grid grid-cols-2 gap-3">
          <LabeledControl label="Color" htmlFor="bg-color">
              <input 
                id="bg-color" 
                type="color" 
                value={backgroundOptions.color} 
                onChange={(e) => setBackgroundOptions(prev => ({...prev, color: e.target.value, transparent: false }))}
                className="w-full h-8 p-0.5 bg-gray-700 border border-gray-600 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={backgroundOptions.transparent}
              />
          </LabeledControl>
          <div className="flex items-end pb-1">
            <input 
              type="checkbox" 
              id="bg-transparent" 
              checked={backgroundOptions.transparent} 
              onChange={e => setBackgroundOptions(prev => ({ ...prev, transparent: e.target.checked }))} 
              className="w-3.5 h-3.5 text-cyan-600 bg-gray-600 border-gray-500 rounded focus:ring-cyan-500"
            />
            <label htmlFor="bg-transparent" className="ml-2 text-xs font-medium text-gray-300">Transparent</label>
          </div>
        </div>
      </ControlSection>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
            <button onClick={() => onDownload('png')} disabled={isLoading} className="flex items-center justify-center p-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold rounded transition">
                {isLoading ? <LoadingIcon /> : <DownloadIcon />} <span className="ml-1.5">PNG</span>
            </button>
            <button onClick={() => onDownload('jpeg')} disabled={isLoading} className="flex items-center justify-center p-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white font-bold rounded transition">
                {isLoading ? <LoadingIcon /> : <DownloadIcon />} <span className="ml-1.5">JPG</span>
            </button>
            <button onClick={copyCssToClipboard} className="col-span-2 flex items-center justify-center p-2 text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold rounded transition">
                <CopyIcon /> <span className="ml-1.5">Copy CSS</span>
            </button>
        </div>
      </div>
    </div>
  );
};