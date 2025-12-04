import React from 'react';
import { AnalysisResult } from '../types';
import ResultCard from './ResultCard';

interface AnalysisViewProps {
  results: AnalysisResult[] | null;
  isLoading: boolean;
  error: string | null;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ results, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-cyber-900 relative overflow-hidden">
        {/* Scanning Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-[10%] w-full animate-scan pointer-events-none"></div>
        
        <div className="w-16 h-16 border-4 border-cyber-700 border-t-cyber-accent rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-mono text-cyber-accent animate-pulse">ANALYZING ARTIFACTS</h3>
        <p className="text-gray-500 mt-2 font-mono text-sm">Querying MITRE Knowledge Base...</p>
        
        <div className="mt-8 w-64 space-y-2">
            <div className="h-1 bg-cyber-800 rounded overflow-hidden">
                <div className="h-full bg-cyber-accent animate-pulse-fast w-2/3"></div>
            </div>
            <div className="h-1 bg-cyber-800 rounded overflow-hidden">
                <div className="h-full bg-cyber-accent animate-pulse-fast w-1/2 delay-75"></div>
            </div>
             <div className="h-1 bg-cyber-800 rounded overflow-hidden">
                <div className="h-full bg-cyber-accent animate-pulse-fast w-4/5 delay-150"></div>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-cyber-900">
        <div className="text-center max-w-md p-6 border border-red-900/50 bg-red-900/10 rounded-lg">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold text-red-400 mb-2">Analysis Failed</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-cyber-900 text-gray-500">
        <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <p className="text-lg font-medium">Ready to Map</p>
        <p className="text-sm opacity-60 mt-1">Provide input on the left to begin analysis.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-cyber-900 p-6 scrollbar-hide">
      <div className="space-y-8">
        {results.map((result, idx) => (
            <div key={idx} className="animate-[fadeIn_0.5s_ease-out]">
                 {/* Input Source Header for Bulk Mode */}
                 {result.input_source && (
                    <div className="mb-2 pl-4 border-l-2 border-cyber-accent/30">
                        <p className="text-xs text-cyber-accent uppercase tracking-widest mb-1">Source Input {idx + 1}</p>
                        <p className="text-gray-400 font-mono text-xs truncate opacity-80">{result.input_source}</p>
                    </div>
                 )}

                 <div className="mb-4 p-6 bg-gradient-to-br from-cyber-800 to-cyber-900 border border-cyber-700 rounded-xl shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <h2 className="text-2xl font-bold text-white mb-2">Analysis Report</h2>
                             <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">{result.summary}</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex flex-col items-end">
                                <span className="text-xs text-gray-500 uppercase tracking-widest mb-1">Risk Score</span>
                                <span className={`text-4xl font-mono font-bold ${
                                    result.overall_risk_score > 75 ? "text-red-500" : 
                                    result.overall_risk_score > 40 ? "text-yellow-500" : "text-green-500"
                                }`}>
                                    {result.overall_risk_score}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-4 pt-4 border-t border-cyber-700/50">
                        <div>
                            <span className="text-xs text-gray-500 uppercase block mb-1">Primary Tactic</span>
                            <span className="text-cyber-accent font-semibold">{result.primary_tactic || "Unknown"}</span>
                        </div>
                         <div>
                            <span className="text-xs text-gray-500 uppercase block mb-1">Techniques Mapped</span>
                            <span className="text-white font-semibold">{result.mappings.length}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-200">Identified Techniques</h3>
                        <span className="text-xs text-gray-500 font-mono">MITRE ATT&CK v15</span>
                    </div>
                    
                    {result.mappings.length === 0 ? (
                       <p className="text-gray-500 italic">No specific MITRE techniques were confidently mapped to this input.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {result.mappings.map((tech, i) => (
                                <ResultCard key={`${idx}-${tech.id}-${i}`} technique={tech} />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Divider if multiple results */}
                {results.length > 1 && idx < results.length - 1 && (
                     <div className="my-8 border-t border-dashed border-cyber-700 w-full" />
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisView;