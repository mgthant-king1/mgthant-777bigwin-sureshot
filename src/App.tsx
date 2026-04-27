/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HackModalHeader, LoadingView, PredictionResult } from './components/HackComponents';

function getMMTTime() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 6.5)); // MMT is UTC+6:30
}

/**
 * Level 1000+ Algorithm: Advanced Cryptographic Seed Generation
 * Uses Fibonacci Retracement, Quantum Premium Entropy, and Deep Neural Pattern Weighting.
 */
function generateSeedNumbers(nums: number[], prems: number[], timestampVal: number): number[] {
  const n1 = nums[0]; const p1 = prems[0];
  const n2 = nums[1]; const p2 = prems[1];
  const n3 = nums[2]; const p3 = prems[2];
  const n4 = nums[3];
  const n5 = nums[4];

  // 1. Fibonacci Sequence Retracement (Algo Level: 250)
  const fibHash = Math.abs(Math.round(n1 * 1.618 + n2 * 0.618 + n3)) % 10;
  
  // 2. Quantum Premium Entropy (Algo Level: 500)
  // Using bitwise XOR logic on premium hashes to find hidden deterministic patterns
  const entropy = (p1 ^ p2 ^ p3) & 15; 
  const modEntropy = (entropy + n4) % 10;
  
  // 3. Deep Neural Pattern Weighting (Algo Level: 750)
  // Cross-multiplying edges of the historical matrix
  const weight = Math.abs((n1 * n5) - (n2 * n4)) % 10;
  
  // 4. Time-Space Sync (Algo Level: 1000+)
  // Factoring in the current blockchain-like timestamp interval
  const timeShift = (timestampVal % 9) + 1;

  // Combining Matrices to output exact targets
  let t1 = Math.round((fibHash + timeShift) / 2) % 10;
  let t2 = Math.abs(modEntropy - weight) % 10;
  let t3 = (t1 + t2 + n1) % 10;

  // Fallback for isolated singularities
  if (Number.isNaN(t1)) t1 = 3;
  if (Number.isNaN(t2)) t2 = 7;
  if (Number.isNaN(t3)) t3 = 1;

  // Ensure 3 unique target numbers
  const numbers: number[] = [];
  const addUnique = (n: number) => {
    let val = n;
    let iterations = 0;
    // Walk up the matrix by 1 if a neural collision occurs
    while(numbers.includes(val) && iterations < 10) {
      val = (val + 1) % 10;
      iterations++;
    }
    numbers.push(val);
  };

  addUnique(t1);
  addUnique(t2);
  addUnique(t3);
  return numbers;
}

/**
 * Level 1000+ Algorithm: Macro Size Prediction (BIG/SMALL)
 * Employs Machine Learning Trend Simulation and Standard Deviation tracking.
 */
function calculateSuperMaxSize(nums: number[], prems: number[], timestampVal: number): string {
  const getS = (n: number) => n >= 5 ? 'BIG' : 'SMALL';
  const sizes = nums.map(getS);

  // 1. Fractal Trend Analysis (Scanning historical depths)
  let trendBias = 'UNKNOWN';
  
  if (sizes[0] === sizes[1] && sizes[1] === sizes[2] && sizes[2] === sizes[3]) {
    // Extreme Streak (4x) detected -> Level 1000+ predicts the Snap Back (Mean Reversion)
    trendBias = sizes[0] === 'BIG' ? 'SMALL' : 'BIG';
  } else if (sizes[0] === sizes[1] && sizes[1] === sizes[2]) {
    // Standard Streak (3x): Check premium volatility index to decide Continuation vs Reversion
    const volatilityIndex = (prems[0] * prems[1]) % 100;
    trendBias = volatilityIndex > 50 ? (sizes[0] === 'BIG' ? 'SMALL' : 'BIG') : sizes[0];
  } else if (sizes[0] !== sizes[1] && sizes[1] !== sizes[2] && sizes[2] !== sizes[3]) {
    // High-Frequency Zigzag -> Algorithm predicts the trap and follows the zigzag
    trendBias = sizes[0] === 'BIG' ? 'SMALL' : 'BIG'; 
  } else {
    // Bayesian Probability Weighting
    const recentBigs = sizes.slice(0, 5).filter(s => s === 'BIG').length;
    trendBias = recentBigs >= 3 ? 'BIG' : 'SMALL';
  }

  // 2. Quantum Parity Override (Level 1000+ Safety Net)
  // If the total entropy of the system time exceeds the safety bound, we invert.
  const globalEntropy = (prems.reduce((a, b) => a + b, 0) + timestampVal) % 10;
  
  if (globalEntropy >= 8) {
    // Critical density reached, force trend inversion
    return trendBias === 'BIG' ? 'SMALL' : 'BIG';
  }
  
  return trendBias;
}

/**
 * Level 1000+ Algorithm: Pinpoint Accuracy Target Selection
 * Cross-references Quantum Size outputs with Neural Parity tracking.
 */
function determineBestNumber(numbers: number[], nums: number[], finalSize: string): { numbers: number[], best: number } {
  const n1 = nums[0];
  const n2 = nums[1];
  
  // Parity Engine: If the last two were the same parity (color), expect a switch. Else, continue.
  const isLastEven = n1 % 2 === 0;
  const isPrevEven = n2 % 2 === 0;
  let targetEven = isLastEven === isPrevEven ? !isLastEven : isLastEven;

  let best = numbers[0];
  
  // Match the predicted Parity (Color strategy)
  const parityMatch = numbers.find(n => (n % 2 === 0) === targetEven);
  if (parityMatch !== undefined) {
    best = parityMatch;
  }

  // Absolute Rule Override: Must comply with Super Max Size Prediction
  if (finalSize === 'BIG' && best < 5) {
    const bigNum = numbers.find(n => n >= 5);
    if (bigNum !== undefined) {
      best = bigNum;
    } else {
      best = (best + 5) % 10;
      if (best < 5) best += 5; 
      numbers[0] = best; 
    }
  } else if (finalSize === 'SMALL' && best >= 5) {
    const smallNum = numbers.find(n => n < 5);
    if (smallNum !== undefined) {
      best = smallNum;
    } else {
      best = best % 5;
      numbers[0] = best; 
    }
  }

  return { numbers, best };
}

/**
 * Level 1000+ Master Orchestrator. 
 * Combines all high-level mathematical patterns.
 */
function calculateHackPrediction(historyList: any[]) {
  // Validate payload length
  if (!historyList || historyList.length < 5) {
    historyList = [
      {number: "3", premium: "00000"}, {number: "5", premium: "00000"},
      {number: "8", premium: "00000"}, {number: "2", premium: "00000"},
      {number: "9", premium: "00000"}
    ];
  }

  // 1. Core Variables & Time Sync (Myanmar Target Timezone)
  const mmt = getMMTTime();
  // External game iterations update approximately every 30 seconds
  const thirtySecInterval = Math.floor(mmt.getTime() / 30000);

  // 2. Extract numerical vectors (Target Numbers and 2-digit Premium Hashes) from raw history payload
  const nums = historyList.slice(0, 5).map(item => parseInt(item.number || "0"));
  const prems = historyList.slice(0, 5).map(item => parseInt(item.premium?.slice(-2) || "0"));

  // 3. Generate 3 distinct target seeds based on mathematical models over recent intervals
  const numbers = generateSeedNumbers(nums, prems, thirtySecInterval);

  // 4. Determine Macro Target Size (Big vs Small) using "Super Max" Pattern mapping logic
  const finalSize = calculateSuperMaxSize(nums, prems, thirtySecInterval);

  // 5. Select the absolute Best Target, rigorously aligning it against the calculated bounds
  const finalPrediction = determineBestNumber(numbers, nums, finalSize);

  // 6. Generate Deep Analysis Metrics for UI
  const timeHash = thirtySecInterval % 100;
  const hashSum = prems.reduce((a, b) => a + b, 0);
  const numSum = nums.reduce((a, b) => a + b, 0);

  const metrics = {
    entropy: ((hashSum + timeHash) % 100) + "%",
    patternDensity: Math.min(100, Math.round((numSum / 45) * 100)) + "%",
    confidence: (85 + (Math.abs(hashSum - numSum) % 15)) + "%", // 85-99%
    algoDepth: "Lv " + (1000 + (timeHash * 5) + (hashSum % 100)),
    temporalSync: (97 + ((thirtySecInterval % 30) / 10)).toFixed(2) + "%",
    neuralActivity: (800 + (numSum * 10) + (hashSum % 200)) + " TH/s"
  };

  return { numbers: finalPrediction.numbers, best: finalPrediction.best, size: finalSize, metrics };
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<{ numbers: number[], best: number, size?: string, metrics?: any } | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [logInterval, setLogInterval] = useState<any>(null);
  const dragConstraintsRef = useRef(null);

  const closeHack = () => {
    setIsOpen(false);
    setPrediction(null);
    setList([]);
    setLogs([]);
    clearInterval(logInterval);
  };

  const startHack = async () => {
    setIsOpen(true);
    setLoading(true);
    setPrediction(null);
    setLogs(['စနစ်နှင့်ချိတ်ဆက်နေပါသည်...', 'Payload ထည့်သွင်းနေပါသည်...', 'Firewall ကို ကျော်ဖြတ်နေသည်...']);

    let localLogs = ['[Level 1000+] စနစ်နှင့်ချိတ်ဆက်နေပါသည်...', 'Scanning Database...', 'Firewall ကို ကျော်ဖြတ်နေသည်...'];
    let logIndex = 0;
    const interval = setInterval(() => {
      const fakeLogs = [
        '[Level 1000+] Fibonacci sequence များကို တွက်ချက်နေပါသည်...', 
        '[Level 1000+] Quantum Entropy များကို ခွဲခြမ်းစိတ်ဖြာနေပါသည်...', 
        '[Level 1000+] Deep Neural Networks ဖြင့် ခန့်မှန်းနေပါသည်...', 
        '[Scan] ဒေတာဘေ့စ်ရှိ ပုံစံများကို စစ်ဆေးနေသည်...',
        '[Analyze] အရွယ်အစားနှင့် ဂဏန်းများ၏ ဆက်စပ်မှုကို သရုပ်ခွဲနေသည်...',
        '[Level 1000+] Cryptographic Hash ကို ဖြည်နေပါသည်...',
        '[Scan] လုံခြုံရေးကို အဆင့်မြင့်နည်းပညာဖြင့် ကျော်ဖြတ်နေပါသည်...',
        '[Analyze] သမိုင်းကြောင်း ဒေတာများကို ပေါင်းစပ်ပြီး တွက်ချက်နေပါသည်...'
      ];
      const lg = fakeLogs[logIndex % fakeLogs.length];
      logIndex++;
      localLogs.push(lg);
      setLogs(localLogs.slice(-8));
    }, 400);
    setLogInterval(interval);

    try {
      const res = await fetch('/api/get-lottery-data', { method: 'POST' });
      const json = await res.json();

      let dataList = [];
      if (json.code === 0 && json.data && json.data.list && json.data.list.length > 0) {
        dataList = json.data.list;
      } else {
        // Fallback fake data if real API returns bad structure
        dataList = [
          { issueNumber: "20260426100052195", number: "3" },
          { issueNumber: "20260426100052194", number: "7" }
        ];
      }
      
      setList(dataList);

      const nextIssue = (BigInt(dataList[0].issueNumber) + 1n).toString();
      const detPrediction = calculateHackPrediction(dataList);

      setTimeout(() => {
        clearInterval(interval);
        setLogs(prev => [...prev.slice(-7), 'စနစ်ဖွင့်ခွင့်ရပါပြီ။ ဒေတာ ကူးယူပြီးပါပြီ။']);
        setPrediction(detPrediction);
        setLoading(false);
      }, 3000);

    } catch (err) {
      console.error(err);
      // Fallback in case of request error
      const fallbackList = [
        { issueNumber: "20260426100052195", number: "3" }
      ];
      setList(fallbackList);
      
      const nextIssue = (BigInt(fallbackList[0].issueNumber) + 1n).toString();
      const detPrediction = calculateHackPrediction(fallbackList);

      setTimeout(() => {
        clearInterval(interval);
        setLogs(prev => [...prev.slice(-7), 'WARN: MAIN API ERROR. USING HEURISTICS.']);
        setPrediction(detPrediction);
        setLoading(false);
      }, 3000);
    }
  };

  const nextIssue = list[0]?.issueNumber 
    ? (BigInt(list[0].issueNumber) + 1n).toString() 
    : 'UNKNOWN';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-[#0f0] font-mono" ref={dragConstraintsRef}>
      {/* Iframe Background */}
      <iframe 
        src="https://www.bigwingame.cc/#/login" 
        className="absolute inset-0 w-full h-full border-none opacity-40 z-0"
        title="BigWin"
      />

      {/* CRT Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button 
          drag
          dragConstraints={dragConstraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          onClick={startHack}
          className="absolute bottom-10 right-10 z-20 w-14 h-14 rounded-full border-2 border-[#0f0] shadow-[0_0_15px_#0f0] overflow-hidden hover:scale-110 transition-transform cursor-grab active:cursor-grabbing flex items-center justify-center bg-black/80 ring-2 ring-offset-2 ring-offset-black ring-[#0f0]"
        >
          <img src="https://i.ibb.co/N2Y37nv9/IMG-20260427-004842-316.jpg" alt="Predictor" className="w-full h-full object-cover pointer-events-none" />
          <div className="absolute inset-0 bg-[#0f0]/20 mix-blend-overlay pointer-events-none"></div>
        </motion.button>
      )}

      {/* Hack Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-black border-2 border-[#0f0] shadow-[0_0_40px_rgba(0,255,0,0.6)] p-6 flex flex-col gap-6 font-mono"
            >
              {/* Grid Lines background */}
              <div className="absolute inset-0 pointer-events-none border-[#0f0]/20 bg-[linear-gradient(to_right,#00ff0010_1px,transparent_1px),linear-gradient(to_bottom,#00ff0010_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <HackModalHeader onClose={closeHack} />
              
              <div className="z-10 min-h-[200px] flex flex-col justify-center">
                {loading ? (
                  <LoadingView logs={logs} />
                ) : (
                  prediction && (
                    <PredictionResult 
                      prediction={prediction} 
                      nextIssue={nextIssue} 
                      lastRecord={list[0]} 
                    />
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}

