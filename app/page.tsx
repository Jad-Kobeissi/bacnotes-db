"use client"
import Link from "next/link";
import { motion } from "motion/react"
function Nav() {
  return <nav></nav>
}
function Home() {
  return (
    <div className="text-center my-30 flex flex-col gap-20 px-2" id="home">
      <div>
        <div className="flex items-center justify-center flex-col w-full">
          <h1 className="text-[2.5rem] sm:text-[3rem] font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent overflow-hidden leading-[1.5em]">
            Your School Social Hub for Academic Success
          </h1>
          <p className="text-lg sm:text-xl text-(--secondary-text) mb-8 max-w-2xl mx-auto">
            Connect with peers, share knowledge, and excel in your studies with
            AI-powered tools designed for Beirut Annunciation Orthodox College
            students.
          </p>
        </div>
        <div className="flex min-[600px]:gap-8 gap-3 max-[600px]:flex-col items-center justify-center">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-md max-[600px]:w-[75%] px-10 py-1 text-[1rem] font-bold">
            Get Started
            <svg
              className="w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="#ffffff"
            >
              <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
            </svg>
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}} className="border border-(--secondary-text) rounded-md px-10 py-1 text-[1rem] font-bold max-[600px]:w-[75%]">
            SignIn
          </motion.button>
        </div>
      </div>
      <div>
      <img
        src="/hero-background.jpeg"
        className="rounded-lg mx-auto max-w-200 w-5/6 shadow-xl"
        alt="Hero Image"
      />
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <>
      <Home />
    </>
  );
}
