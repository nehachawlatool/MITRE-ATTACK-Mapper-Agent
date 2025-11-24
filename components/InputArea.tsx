import React from 'react';
import { EXAMPLES } from '../constants';
import { ExampleScenario } from '../types';

interface InputAreaProps {
  input: string;
  setInput: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ input, setInput, onAnalyze, isAnalyzing }) => {
  const handleExampleClick = (example: ExampleScenario) => {
    setInput(example.content);
  };

  return (
    <div className="flex flex-col h-full bg-cyber-800 border-r border-cyber-700 p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-cyber-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Input Source
        </h2>
        <span className="text-xs text-gray-500 bg-cyber-900 px-2 py-1 rounded">Text / Log / Code</span>
      </div>

      <div className="flex-grow relative group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste threat intelligence report, Splunk query, YARA rule, or incident description here..."
          className="w-full h-full bg-cyber-900 text-gray-300 p-4 rounded-lg border border-cyber-700 focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent outline-none resize-none font-mono text-sm leading-relaxed transition-all"
        />
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-600 rounded-tl pointer-events-none group-focus-within:border-cyber-accent transition-colors"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-600 rounded-tr pointer-events-none group-focus-within:border-cyber-accent transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-600 rounded-bl pointer-events-none group-focus-within:border-cyber-accent transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-600 rounded-br pointer-events-none group-focus-within:border-cyber-accent transition-colors"></div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-semibold">Load Example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => handleExampleClick(ex)}
                disabled={isAnalyzing}
                className="text-xs bg-cyber-700 hover:bg-cyber-600 text-gray-300 py-1.5 px-3 rounded transition-colors border border-cyber-600 hover:border-cyber-500 disabled:opacity-50"
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onAnalyze}
          disabled={!input.trim() || isAnalyzing}
          className={`w-full py-3 rounded-lg font-bold tracking-wide text-white transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]
            ${!input.trim() || isAnalyzing 
              ? 'bg-gray-700 cursor-not-allowed opacity-50 shadow-none' 
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.99] border border-cyan-400'
            }`}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              MAPPING TTPs...
            </span>
          ) : (
            'ANALYZE & MAP'
          )}
        </button>
      </div>
    </div>
  );
};

export default InputArea;