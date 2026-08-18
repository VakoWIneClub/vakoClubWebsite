import React from 'react';
import { motion } from 'framer-motion';

// Shared scroll-reveal wrapper for pages migrated to the copa design system — same fade+slide-up
// used throughout src/pages/tienda/ElMundoDeLaCopaLanding.jsx, extracted so other pages don't
// redefine it locally.
export const COPA_EASE = [0.2, 0.8, 0.2, 1];

const Reveal = ({ children, className, delay = 0, ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -12% 0px' }}
    transition={{ duration: 0.7, ease: COPA_EASE, delay }}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
