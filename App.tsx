import React, { useState } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import AnalysisView from './components/AnalysisView';
import { AnalysisResult } from './types';
import { mapToMitre } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await mapToMitre(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-cyber-900 text-gray-100 font-sans overflow-hidden">
      <Header />
      
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Input */}
        <div className="w-full md:w-1/3 lg:w-2/5 h-1/2 md:h-full z-10">
          <InputArea 
            input={input} 
            setInput={setInput} 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* Right Side: Results */}
        <div className="w-full md:w-2/3 lg:w-3/5 h-1/2 md:h-full bg-cyber-900 relative">
          <AnalysisView 
            result={result}
            isLoading={isAnalyzing}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;