
"use client"
import { motion, Variants } from 'framer-motion'


const svgVariants: Variants = {
  hidden: { rotate: -180 },
  visible: {
    rotate: 0,
    transition: { duration: 1 }

  }
}
const pathVariants: Variants = {
  hidden: {
    opacity: 0,
    pathLength: 0
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    transition: { duration: 2, ease: "easeInOut" }
  }
}
export default function Header() {
  return (
    <div className="bg-green-700 h-20">
      <motion.svg className="pizza-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
        variants={svgVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.path
          fill="none"
          d="M40 40 L80 40 C80 40 80 80 40 80 C40 80 0 80 0 40 C0 40 0 0 40 0Z"
          variants={pathVariants}
        />
        <motion.path
          fill="none"
          d="M50 30 L50 -10 C50 -10 90 -10 90 30 Z"
          variants={pathVariants}
        />
      </motion.svg>
      <h2 className="text-yellow-500 font-bold text-4xl">DEDAN KIMATHI UNIVERSITY <br /><span className="text-2xl"> OF TECHNOLOGY</span></h2>
    </div>
  )
}
