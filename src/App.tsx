/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Crosshair, Terminal, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function getMMTTime() {
  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 6.5)); // MMT is UTC+6:30
}

/**
 * Phase 1 & Phase 2 mathematical logic based on intervals and last results
 * to generate initial three prediction seeds.
 */
function generateSeedNumbers(nums: number[], prems: number[], isFirstHalf: boolean): number[] {
  const n1 = nums[0]; const p1 = prems[0];
  const n2 = nums[1]; const p2 = prems[1];
  const n3 = nums[2]; 

  let t1, t2, t3;

  if (isFirstHalf) {
    // Phase 1: Matrix Reversal & Premium Hash
    t1 = Math.abs(n1 - p1) % 10;
    t2 = (n2 + n3 + 3) % 10;
    t3 = Math.abs((n1 * 3) - n2) % 10;
  } else {
    // Phase 2: Golden Average & Trend Continuation
    t1 = Math.round((n1 + n2) / 2) % 10;
    t2 = (p1 + p2) % 10;
    t3 = (10 - n1) % 10;
  }

  // Fallback for NaN cases due to missing data
  if (Number.isNaN(t1)) t1 = 3;
  if (Number.isNaN(t2)) t2 = 7;
  if (Number.isNaN(t3)) t3 = 1;

  // Ensure 3 unique numbers are returned
  const numbers: number[] = [];
  const addUnique = (n: number) => {
    let val = n;
    let iterations = 0;
    // Walk up by 1 if a collision occurs
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
 * Super Max Logic for determining if the next result will be BIG (5-9) or SMALL (0-4).
 * Uses a combination of pattern continuation, streak breaking, and premium-based quantum shifts.
 */
function calculateSuperMaxSize(nums: number[], prems: number[]): string {
  const getS = (n: number) => n >= 5 ? 'BIG' : 'SMALL';
  const sizes = nums.map(getS);

  // 1. Trend Analysis (Look at previous 3-4 sizes)
  let trendBias = 'UNKNOWN';
  if (sizes[0] === sizes[1] && sizes[1] === sizes[2]) {
    // Streak of 3: Decide whether to follow or break the streak based on Premium volatility
    const premiumVol = prems[0] + prems[1];
    trendBias = premiumVol % 2 === 0 ? sizes[0] : (sizes[0] === 'BIG' ? 'SMALL' : 'BIG');
  } else if (sizes[0] !== sizes[1] && sizes[1] !== sizes[2] && sizes[2] !== sizes[3]) {
    // Zigzag pattern (Big -> Small -> Big -> Small) -> Predict continuation
    trendBias = sizes[0] === 'BIG' ? 'SMALL' : 'BIG'; 
  } else {
    // General historical weight mapping (count most occurrences in the short window)
    const bigCount = sizes.slice(0, 4).filter(s => s === 'BIG').length;
    trendBias = bigCount >= 2 ? 'BIG' : 'SMALL';
  }

  // 2. Quantum Premium Modulation (Super Max Layer)
  // Look at total premium value sum to act as a noise/entropy filter
  const pSum = prems.reduce((a, b) => a + b, 0);
  const quantumShift = pSum % 10;
  
  if (quantumShift > 7) {
    // Extreme volatility -> invert the standard trend prediction
    return trendBias === 'BIG' ? 'SMALL' : 'BIG';
  }
  
  return trendBias;
}

/**
 * Selects the optimal single 'best' number out of the 3 candidates.
 * Forces the 'best' number to STRICTLY align with the predicted Size (Big/Small).
 */
function determineBestNumber(numbers: number[], nums: number[], finalSize: string): { numbers: number[], best: number } {
  const n1 = nums[0];
  const isLastEven = n1 % 2 === 0;
  let best = numbers[0];
  
  // Color Stroke Alignment: Wingo/BigWin colors map logically as Red(Even), Green(Odd).
  // Try to find a candidate number that matches the parity (color) of the last result to follow the common streak.
  const streakMatch = numbers.find(n => (n % 2 === 0) === isLastEven);
  if (streakMatch !== undefined) {
    best = streakMatch;
  }

  // Super Max Consistency Check: Force 'best' to strictly align with 'finalSize'
  if (finalSize === 'BIG' && best < 5) {
    // We predicted BIG but best is SMALL. Find an existing BIG candidate or forge one.
    const bigNum = numbers.find(n => n >= 5);
    if (bigNum !== undefined) {
      best = bigNum;
    } else {
      best = (best + 5) % 10;
      if (best < 5) best += 5; // Absolute guarantee
      numbers[0] = best; // Inject it cleanly into the predictions list
    }
  } else if (finalSize === 'SMALL' && best >= 5) {
    // We predicted SMALL but best is BIG. Find an existing SMALL candidate or forge one.
    const smallNum = numbers.find(n => n < 5);
    if (smallNum !== undefined) {
      best = smallNum;
    } else {
      best = best % 5;
      numbers[0] = best; // Inject it cleanly into the predictions list
    }
  }

  return { numbers, best };
}

/**
 * Main prediction orchestrator. 
 * Connects history parsing, target seeding, pattern calculation, and size alignments.
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
  const isFirstHalf = thirtySecInterval % 2 === 0;

  // 2. Extract numerical vectors (Target Numbers and 2-digit Premium Hashes) from raw history payload
  const nums = historyList.slice(0, 5).map(item => parseInt(item.number || "0"));
  const prems = historyList.slice(0, 5).map(item => parseInt(item.premium?.slice(-2) || "0"));

  // 3. Generate 3 distinct target seeds based on mathematical models over recent intervals
  const numbers = generateSeedNumbers(nums, prems, isFirstHalf);

  // 4. Determine Macro Target Size (Big vs Small) using "Super Max" Pattern mapping logic
  const finalSize = calculateSuperMaxSize(nums, prems);

  // 5. Select the absolute Best Target, rigorously aligning it against the calculated bounds
  const finalPrediction = determineBestNumber(numbers, nums, finalSize);

  return { numbers: finalPrediction.numbers, best: finalPrediction.best, size: finalSize };
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<{ numbers: number[], best: number, size?: string } | null>(null);
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
    setLogs(['CONNECTION ESTABLISHED...', 'INJECTING PAYLOAD...', 'BYPASSING FIREWALL...']);

    let localLogs = ['CONNECTION ESTABLISHED...', 'INJECTING PAYLOAD...', 'BYPASSING FIREWALL...'];
    const interval = setInterval(() => {
      const fakeLogs = [
        'DECRYPTING HASH...', 
        'ANALYZING PATTERNS...', 
        'CALCULATING PROBABILITIES...', 
        'EXTRACTING SEED...',
        'BYPASSING SECURITY...',
        'ACCESSING DATABASE...'
      ];
      const lg = fakeLogs[Math.floor(Math.random() * fakeLogs.length)];
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
        setLogs(prev => [...prev.slice(-7), 'ACCESS GRANTED. DATA EXFILTRATED.']);
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-md bg-black border-2 border-[#0f0] shadow-[0_0_40px_rgba(0,255,0,0.6)] p-6 flex flex-col gap-6 font-mono">
              {/* Grid Lines background */}
              <div className="absolute inset-0 pointer-events-none border-[#0f0]/20 bg-[linear-gradient(to_right,#00ff0010_1px,transparent_1px),linear-gradient(to_bottom,#00ff0010_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <div className="flex justify-between items-center border-b border-[#0f0] pb-3 z-10">
                <div className="flex items-center gap-3 text-[#0f0]">
                  <Terminal className="w-6 h-6" />
                  <h2 className="text-2xl font-bold tracking-widest drop-shadow-[0_0_5px_#0f0]">SYSTEM HACK</h2>
                </div>
                <button onClick={closeHack} className="text-[#0f0] hover:text-black hover:bg-[#0f0] transition-colors p-1 z-20 border border-transparent hover:border-[#0f0]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="z-10 min-h-[200px] flex flex-col justify-center">
                {loading ? (
                  <div className="flex flex-col gap-3">
                    <div className="mb-6 flex justify-center">
                      <Crosshair className="w-16 h-16 animate-spin text-[#0f0] opacity-90 drop-shadow-[0_0_10px_#0f0]" style={{ animationDuration: '3s' }} />
                    </div>
                    {logs.map((log, i) => (
                      <div key={i} className="text-sm text-[#0f0] font-medium opacity-90">
                        <span className="text-xs mr-2 opacity-50">{'>'}</span> {log}
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Period and Last Number Info */}
                    <div className="bg-[#0f0]/10 p-4 border border-[#0f0]/40 rounded flex flex-col gap-2 shadow-[inset_0_0_15px_rgba(0,255,0,0.1)]">
                      <div className="flex justify-between items-center border-b border-[#0f0]/30 pb-2">
                        <span className="text-xs tracking-wider opacity-80 uppercase">Target Period (Next)</span>
                        <span className="font-bold text-lg drop-shadow-[0_0_5px_#0f0]">{nextIssue}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs tracking-wider opacity-80 uppercase">Last Period</span>
                        <span className="font-bold text-sm opacity-90">{list[0]?.issueNumber || 'UNKNOWN'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs tracking-wider opacity-80 uppercase">Last Result</span>
                        <span className="font-bold text-2xl text-white drop-shadow-[0_0_5px_#0f0] bg-[#0f0]/30 px-3 py-1 rounded">
                          {list[0]?.number ?? '-'}
                        </span>
                      </div>
                    </div>

                    {/* Predicted Numbers */}
                    <div className="border border-[#0f0]/60 p-5 relative bg-black">
                      <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] sm:text-xs font-bold tracking-widest flex items-center gap-2 text-[#0f0] border border-[#0f0] shadow-[0_0_10px_#0f0] animate-pulse">
                        <Zap className="w-4 h-4" fill="currentColor" /> SUPER MAX PREDICTION
                      </div>
                      <div className="flex justify-around items-center mt-3">
                        {prediction?.numbers.map((num, i) => (
                          <div 
                            key={i} 
                            className={`text-4xl font-black w-14 h-16 flex items-center justify-center border ${
                              num === prediction.best 
                              ? 'bg-[#0f0] text-black border-[#0f0] shadow-[0_0_20px_#0f0] scale-110' 
                              : 'bg-black text-[#0f0] border-[#0f0]/50 shadow-[inset_0_0_10px_rgba(0,255,0,0.2)]'
                            } transition-all`}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Number & Size Highlight */}
                    <div className="flex gap-4 w-full">
                      <div className="flex-[0.8] flex flex-col items-center justify-center bg-[linear-gradient(45deg,#003300,#00ff00)] text-black p-4 font-bold border border-white/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 Mix-blend-overlay"></div>
                        <span className="text-[10px] sm:text-xs tracking-widest opacity-90 uppercase z-10 mb-1 text-center">Target Size</span>
                        <span className="text-3xl sm:text-4xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 glow-text mt-1">
                          {prediction?.size}
                        </span>
                      </div>

                      <div className="flex-[1.2] flex flex-col items-center justify-center bg-[linear-gradient(45deg,#003300,#00ff00)] text-black p-4 font-bold border border-white/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 Mix-blend-overlay"></div>
                        <span className="text-[10px] sm:text-xs tracking-widest opacity-90 uppercase z-10 mb-1 text-center">Optimal Number</span>
                        <span className="text-6xl sm:text-7xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] z-10 glow-text">
                          {prediction?.best}
                        </span>
                      </div>
                    </div>

                  </motion.div>
                )}
              </div>
            </div>
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

