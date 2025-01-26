"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Shirt, ArrowLeft } from "lucide-react"

export default function PageNotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center bg-white rounded-lg shadow-xl p-8">
        {/* Animated shirts falling */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-500"
            initial={{ y: -50, x: Math.random() * window.innerWidth, rotate: 0, opacity: 0 }}
            animate={{
              y: window.innerHeight + 50,
              rotate: 360,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
              delay: Math.random() * 2,
            }}
          >
            <Shirt size={30} />
          </motion.div>
        ))}

        {/* 404 Text */}
        <motion.h1
          className="text-6xl font-bold text-blue-600 mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.p
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Oops! You are on wrong page.
        </motion.p>

        {/* Animated shirt */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <Shirt size={120} className="mx-auto text-blue-500" />
        </motion.div>

        {/* Return to Shop button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-lg inline-flex items-center hover:bg-blue-600 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2" size={20} />
            Return to Shop
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

