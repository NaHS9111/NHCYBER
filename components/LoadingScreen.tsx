"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type LoadingScreenProps = {
  onFinish?: () => void;
  /** Total duration in ms for the full plomb → or transformation. */
  duration?: number;
};

/**
 * First-paint ritual: a leaden grey particle slowly becomes gold before
 * the site reveals itself — "de plomb à or" made literal in the opening
 * second.
 */
export default function LoadingScreen({
  onFinish,
  duration = 2600,
}: LoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const effectiveDuration = prefersReducedMotion ? 500 : duration;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, effectiveDuration);
    return () => clearTimeout(timer);
  }, [effectiveDuration, onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-noir"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <div className="relative flex flex-col items-center gap-6">
            <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
              <defs>
                <radialGradient id="lead-to-gold" cx="50%" cy="50%" r="50%">
                  <animate
                    attributeName="fx"
                    values="50%"
                    dur="0.01s"
                  />
                  <stop offset="0%" stopColor="#F2EDE3">
                    <animate
                      attributeName="stop-color"
                      values="#6B6B63; #B8934A"
                      dur={`${effectiveDuration}ms`}
                      fill="freeze"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#2B2B2B">
                    <animate
                      attributeName="stop-color"
                      values="#2B2B2B; #0D0D0D"
                      dur={`${effectiveDuration}ms`}
                      fill="freeze"
                    />
                  </stop>
                </radialGradient>
              </defs>
              <motion.circle
                cx="36"
                cy="36"
                r="10"
                fill="url(#lead-to-gold)"
                initial={{ scale: 0.85, filter: "drop-shadow(0 0 0px rgba(184,147,74,0))" }}
                animate={{
                  scale: [0.85, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 0px rgba(184,147,74,0))",
                    "drop-shadow(0 0 0px rgba(184,147,74,0))",
                    "drop-shadow(0 0 10px rgba(184,147,74,0.65))",
                  ],
                }}
                transition={{ duration: effectiveDuration / 1000, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>

            <motion.p
              className="font-serif text-xs uppercase tracking-[0.35em] text-gris"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 0.6, 1], color: ["#6B6B63", "#6B6B63", "#B8934A"] }}
              transition={{ duration: effectiveDuration / 1000, ease: "easeInOut" }}
            >
              de plomb à or
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
