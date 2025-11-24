import React from 'react';
import { MitreTechnique, Tactic, ConfidenceLevel } from '../types';
import { TACTIC_COLORS } from '../constants';

interface ResultCardProps {
  technique: MitreTechnique;
}

const ResultCard: React.FC<ResultCardProps> = ({ technique }) => {
  const confidenceColor = 
    technique.confidence === ConfidenceLevel.High ? "text-green-400 border-green-400/30 bg-green-900/20" :
    technique.confidence === ConfidenceLevel.Medium ? "text-yellow-400 border-yellow-400/30 bg-yellow-900/20" :
    "text-red-400 border-red-400/30 bg-red-900/20";

  return (
    <div className="bg-cyber-800 border border-cyber-700 rounded-lg p-5 hover:border-cyber-accent/50 transition-all group shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="font-mono text-cyber-accent text-sm font-bold bg-cyber-900 px-2 py-0.5 rounded border border-cyber-700">
              {technique.id}{technique.subTechniqueId ? `.${technique.subTechniqueId}` : ''}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${confidenceColor} font-semibold uppercase tracking-wider`}>
              {technique.confidence} Conf.
            </span>
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-cyber-accent transition-colors">
            {technique.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {technique.tactics.map((tactic) => (
          <span 
            key={tactic}
            className={`text-xs px-2 py-1 rounded border ${TACTIC_COLORS[tactic as Tactic] || "bg-gray-800 text-gray-300 border-gray-600"}`}
          >
            {tactic}
          </span>
        ))}
      </div>

      <div className="bg-cyber-900/50 rounded p-3 border border-cyber-700/50 mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          <span className="text-cyber-accent font-semibold">Reasoning: </span> 
          {technique.reasoning}
        </p>
      </div>

      {technique.detection_suggestions && technique.detection_suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-cyber-700/50">
           <p className="text-xs text-gray-400 uppercase font-semibold mb-2 flex items-center">
             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             Detection Suggestion
           </p>
           <ul className="list-disc list-inside text-sm text-gray-400 pl-1">
             {technique.detection_suggestions.map((ds, idx) => (
               <li key={idx} className="mb-1">{ds}</li>
             ))}
           </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;