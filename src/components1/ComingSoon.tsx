import React from "react";
import { motion } from "framer-motion";
import { PageFrame } from "@/sfs/components/page/PageFrame";
import comingSoonImg from "../assets/coming-soon.webp"; // adjust path

const ease = [0.16, 1, 0.3, 1] as const;

const ComingSoon: React.FC = () => {
  return (
    <PageFrame tone="surface">
      <section aria-labelledby="coming-soon-title" className="container-x flex min-h-[85vh] flex-col items-center justify-center overflow-hidden pt-28 pb-16 text-center">
        {/* Top Text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="t-label tracking-[0.2em] text-deep uppercase"
        >
          Stay Tuned
        </motion.p>
        <h1 id="coming-soon-title" className="sr-only">
          Coming Soon
        </h1>

        {/* Main Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="relative mt-24 mb-8 flex items-center justify-center"
        >
          <div aria-hidden="true" className="absolute aspect-square w-[min(92vw,34rem)] rounded-full border-[14px] border-tint" />
          <div aria-hidden="true" className="absolute aspect-square w-[min(80vw,28rem)] rounded-full bg-tint/50" />
          <img
            src={comingSoonImg}
            alt="Coming Soon"
            className="relative z-10 w-[min(80vw,26rem)] transition-transform duration-500 hover:scale-[1.03]"
          />
        </motion.div>
      </section>
    </PageFrame>
  );
};

export default ComingSoon;
