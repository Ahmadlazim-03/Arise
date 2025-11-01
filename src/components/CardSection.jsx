import { motion } from 'framer-motion';

export default function CardSection({ title, children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`card p-5 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-bold mb-3 tracking-tight">{title}</h2>
      )}
      <div>{children}</div>
    </motion.section>
  );
}
