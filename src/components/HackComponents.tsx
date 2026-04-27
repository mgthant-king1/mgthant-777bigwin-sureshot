import { Crosshair, Terminal, X, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export function HackModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center border-b border-[#0f0] pb-3 z-10">
      <div className="flex items-center gap-3 text-[#0f0]">
        <Terminal className="w-6 h-6" />
        <h2 className="text-2xl font-bold tracking-widest drop-shadow-[0_0_5px_#0f0]">စနစ်ကို ဟက်နေပါသည်...</h2>
      </div>
      <button onClick={onClose} className="text-[#0f0] hover:text-black hover:bg-[#0f0] transition-colors p-1 z-20 border border-transparent hover:border-[#0f0]">
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

export function LoadingView({ logs }: { logs: string[] }) {
  return (
    <div className="flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0f0]/5 animate-pulse pointer-events-none z-10" style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 255, 0, 0.25) 50%)', backgroundSize: '100% 4px' }}></div>
      <div className="mb-6 flex justify-center">
        <Crosshair className="w-16 h-16 animate-spin text-[#0f0] opacity-90 drop-shadow-[0_0_10px_#0f0]" style={{ animationDuration: '3s' }} />
      </div>
      {logs.map((log, i) => (
        <div key={i} className="text-sm text-[#0f0] font-medium opacity-90 z-20 relative">
          <span className="text-xs mr-2 opacity-50">{'>'}</span> {log}
        </div>
      ))}
    </div>
  );
}

interface Prediction {
  numbers: number[];
  best: number;
  size?: string;
  metrics?: any;
}

interface PredictionResultProps {
  prediction: Prediction;
  nextIssue: string;
  lastRecord: any;
}

export function PredictionResult({ prediction, nextIssue, lastRecord }: PredictionResultProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Target Period & Last Record Info */}
      <motion.div variants={item} className="bg-[#0f0]/10 p-4 border border-[#0f0]/40 rounded flex flex-col gap-2 shadow-[inset_0_0_15px_rgba(0,255,0,0.1)]">
        <div className="flex justify-between items-center border-b border-[#0f0]/30 pb-2">
          <span className="text-[10px] sm:text-xs tracking-wider opacity-80 uppercase">ပစ်မှတ်ထားမည့် ပွဲစဉ် (နောက်ပွဲစဉ်)</span>
          <span className="font-bold text-base sm:text-lg drop-shadow-[0_0_5px_#0f0]">{nextIssue}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] sm:text-xs tracking-wider opacity-80 uppercase">နောက်ဆုံးထွက်ခဲ့သော ပွဲစဉ်</span>
          <span className="font-bold text-[10px] sm:text-sm opacity-90">{lastRecord?.issueNumber || 'UNKNOWN'}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-[10px] sm:text-xs tracking-wider opacity-80 uppercase">နောက်ဆုံး ရလဒ်</span>
          <span className="font-bold text-2xl text-white drop-shadow-[0_0_5px_#0f0] bg-[#0f0]/30 px-3 py-1 rounded">
            {lastRecord?.number ?? '-'}
          </span>
        </div>
      </motion.div>

      {/* Predicted Numbers */}
      <motion.div variants={item} className="border border-[#0f0]/60 p-5 relative bg-black">
        <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] sm:text-xs font-bold tracking-widest flex items-center gap-2 text-[#0f0] border border-[#0f0] shadow-[0_0_10px_#0f0] animate-pulse">
          <Zap className="w-4 h-4" fill="currentColor" /> အမြင့်ဆုံး ခန့်မှန်းချက် [LEVEL 1000+]
        </div>
        <div className="flex justify-around items-center mt-3">
          {prediction?.numbers.map((num, i) => (
            <div 
              key={i} 
              className={`text-4xl font-black w-14 h-16 flex items-center justify-center border relative cursor-default ${
                num === prediction.best 
                ? 'bg-[#0f0] text-black border-[#0f0] shadow-[0_0_20px_#0f0] scale-110 hover:scale-[1.25] hover:shadow-[0_0_35px_#0f0]' 
                : 'bg-black text-[#0f0] border-[#0f0]/50 shadow-[inset_0_0_10px_rgba(0,255,0,0.2)] hover:scale-110 hover:shadow-[0_0_15px_#0f0] hover:border-[#0f0]'
              } transition-all duration-300 hover:z-10`}
            >
              {num}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Size & Best Number Highlight */}
      <motion.div variants={item} className="flex gap-4 w-full">
        <div className="flex-[0.8] flex flex-col items-center justify-center bg-[linear-gradient(45deg,#003300,#00ff00)] text-black p-4 font-bold border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 mix-blend-overlay"></div>
          <span className="text-[10px] sm:text-xs tracking-widest opacity-90 uppercase z-10 mb-1 text-center font-black">ခန့်မှန်း အရွယ်အစား</span>
          <span className="text-xl sm:text-2xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 glow-text mt-1">
            {prediction?.size === 'BIG' ? 'ကြီး (BIG)' : 'သေး (SMALL)'}
          </span>
        </div>

        <div className="flex-[1.2] flex flex-col items-center justify-center bg-[linear-gradient(45deg,#003300,#00ff00)] text-black p-4 font-bold border border-white/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 mix-blend-overlay"></div>
          <span className="text-[10px] sm:text-xs tracking-widest opacity-90 uppercase z-10 mb-1 text-center font-black">အကောင်းဆုံး ခန့်မှန်းဂဏန်း</span>
          <span className="text-6xl sm:text-7xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 glow-text">
            {prediction?.best}
          </span>
        </div>
      </motion.div>

      {/* Advanced Metrics / Scan Results */}
      {prediction?.metrics && (
        <motion.div variants={item} className="grid grid-cols-3 gap-2 mt-4 text-[#0f0]">
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Quantum Entropy</span>
            <span className="font-mono font-bold text-sm">{prediction.metrics.entropy}</span>
          </div>
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Pattern Density</span>
            <span className="font-mono font-bold text-sm">{prediction.metrics.patternDensity}</span>
          </div>
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">System Confidence</span>
            <span className="font-mono font-bold text-sm">{prediction.metrics.confidence}</span>
          </div>
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Algorithm Depth</span>
            <span className="font-mono font-bold text-sm">{prediction.metrics.algoDepth}</span>
          </div>
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Temporal Sync</span>
            <span className="font-mono font-bold text-sm">{prediction.metrics.temporalSync}</span>
          </div>
          <div className="border border-[#0f0]/30 bg-[#0f0]/5 rounded p-2 text-center flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-wider opacity-70">Neural Activity</span>
            <span className="font-mono font-bold text-[11px] sm:text-xs">{prediction.metrics.neuralActivity}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
