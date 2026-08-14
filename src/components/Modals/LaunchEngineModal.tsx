import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundManager } from '../../utils/audio';
import {
  X,
  Cpu,
  CheckCircle2,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface LaunchEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ArchitectResponse {
  ok: boolean;
  proposal?: {
    id: string;
    type: string;
    objective: string;
    status: string;
    architect?: {
      id: string;
      provider: string;
      model: string;
    };
    architecture: string;
    authority?: {
      ownerApprovalRequired: boolean;
      automaticallyApproved: boolean;
      automaticallyDeployable: boolean;
    };
  };
  error?: {
    code?: string;
    message?: string;
  };
}

const ENGINE_URL = (
  import.meta.env.VITE_GIE_ENGINE_URL ||
  'https://gie-engine.leh-oct1772.workers.dev'
).replace(/\/+$/, '');

export const LaunchEngineModal: React.FC<
  LaunchEngineModalProps
> = ({ isOpen, onClose }) => {
  const [objective, setObjective] = useState('');
  const [running, setRunning] = useState(false);
  const [proposal, setProposal] =
    useState<ArchitectResponse['proposal'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunArchitect = async () => {
    const cleanObjective = objective.trim();

    if (!cleanObjective || running) {
      return;
    }

    soundManager.playScan();

    setRunning(true);
    setProposal(null);
    setError(null);

    try {
      const response = await fetch(
        `${ENGINE_URL}/api/v1/agents/architect/proposal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            objective: cleanObjective
          })
        }
      );

      const data =
        (await response.json()) as ArchitectResponse;

      if (!response.ok || !data.ok || !data.proposal) {
        throw new Error(
          data.error?.message ||
            `GIE Engine returned HTTP ${response.status}.`
        );
      }

      setProposal(data.proposal);
      soundManager.playChime();
    } catch (err) {
      console.error('GIE_ARCHITECT_REQUEST_ERROR', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to communicate with the GIE Engine.'
      );
    } finally {
      setRunning(false);
    }
  };

  const handleClose = () => {
    if (running) {
      return;
    }

    soundManager.playClick();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }}
          className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border-2 border-cyan-400/80 bg-slate-950 p-6 font-mono text-slate-200 shadow-[0_0_40px_rgba(0,240,255,0.4)]"
        >
          {/* HEADER */}
          <div className="mb-4 flex items-center justify-between border-b border-cyan-500/30 pb-3">
            <div className="flex items-center space-x-2">
              <Cpu
                className={`h-5 w-5 text-cyan-400 ${
                  running ? 'animate-pulse' : ''
                }`}
              />

              <div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-cyan-300">
                  GIE SYSTEM ARCHITECT
                </h2>

                <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-cyan-200/60">
                  Geometric Intelligence Engine
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={running}
              className="rounded border border-slate-700 bg-slate-900 p-1 text-slate-400 transition-colors hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* AUTHORITY */}
            <div className="rounded border border-amber-400/30 bg-amber-950/20 p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Owner-Controlled Architecture
              </div>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                The Architect may analyze and design proposed
                GIE work. It cannot deploy production changes,
                alter accepted GIE mathematics, allocate funds,
                spend funds, or activate paid services without
                owner authorization.
              </p>
            </div>

            {/* OBJECTIVE */}
            <div>
              <label
                htmlFor="gie-build-objective"
                className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-cyan-300"
              >
                Build Objective
              </label>

              <textarea
                id="gie-build-objective"
                value={objective}
                onChange={(event) =>
                  setObjective(event.target.value)
                }
                disabled={running}
                placeholder="Tell the GIE Architect what you want designed or built next..."
                rows={6}
                className="w-full resize-y rounded border border-cyan-500/40 bg-slate-900/80 p-3 text-sm leading-relaxed text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* RUN */}
            <button
              type="button"
              onClick={handleRunArchitect}
              disabled={running || !objective.trim()}
              className={`flex w-full items-center justify-center space-x-2 rounded border py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                running || !objective.trim()
                  ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-500'
                  : 'cursor-pointer border-cyan-400 bg-cyan-950 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:bg-cyan-900'
              }`}
            >
              <Zap className="h-4 w-4 text-amber-300" />

              <span>
                {running
                  ? 'GIE ARCHITECT ANALYZING...'
                  : 'GENERATE BUILD ARCHITECTURE'}
              </span>
            </button>

            {/* ACTIVE REQUEST */}
            {running && (
              <div className="overflow-hidden rounded-full border border-cyan-500/30 bg-slate-900">
                <motion.div
                  className="h-2 w-1/3 bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400"
                  animate={{
                    x: ['-100%', '300%']
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </div>
            )}

            {/* ERROR */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="rounded border border-red-500/50 bg-red-950/30 p-4"
              >
                <div className="flex items-center text-xs font-bold uppercase text-red-300">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Engine Request Failed
                </div>

                <div className="mt-2 text-xs leading-relaxed text-red-200/80">
                  {error}
                </div>
              </motion.div>
            )}

            {/* REAL ARCHITECT RESPONSE */}
            {proposal && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                className="space-y-4 rounded border border-emerald-500/50 bg-slate-900/90 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 pb-3">
                  <span className="flex items-center text-xs font-bold uppercase text-emerald-400">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" />
                    Architect Proposal Generated
                  </span>

                  <span className="rounded border border-amber-500/40 bg-amber-950 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                    {proposal.status}
                  </span>
                </div>

                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded border border-cyan-500/20 bg-slate-950 p-3">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                      Proposal ID
                    </span>

                    <span className="mt-1 block break-all text-cyan-300">
                      {proposal.id}
                    </span>
                  </div>

                  <div className="rounded border border-cyan-500/20 bg-slate-950 p-3">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                      Architect
                    </span>

                    <span className="mt-1 block text-cyan-300">
                      {proposal.architect?.id ||
                        'gie-system-architect'}
                    </span>
                  </div>
                </div>

                <div className="rounded border border-cyan-500/20 bg-slate-950 p-3">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-500">
                    Objective
                  </span>

                  <div className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                    {proposal.objective}
                  </div>
                </div>

                <div className="rounded border border-cyan-400/30 bg-[#020a12] p-4">
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    GIE Architecture Proposal
                  </div>

                  <div className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200">
                    {proposal.architecture}
                  </div>
                </div>

                <div className="rounded border border-amber-400/30 bg-amber-950/20 p-3 text-[10px] leading-relaxed text-amber-200">
                  OWNER APPROVAL REQUIRED — This proposal has
                  not been automatically approved or deployed.
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};