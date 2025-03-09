'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Header } from '@/components/Header'
import { motion } from 'motion/react'
import { containerVariants, itemVariants } from '@/lib/animation-variants' 
import { ThemeButton } from '@/components/theme-button'
import { Sparkles, User } from 'lucide-react'

export function Appbar() {
  return (
    <motion.div 
    	variants={containerVariants}
     	initial="hidden"
     	animate="visible"
    	className="flex items-center mt-4 justify-between backdrop-blur-sm rounded-2xl border border-primary/10 bg-background/40 shadow-sm px-6 py-3"
    >
      <Header />

      <motion.div variants={itemVariants} className="flex gap-4 items-center justify-center">
        <ThemeButton />

        <SignedOut>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SignInButton>
              <button
                className="border border-primary/20 hover:bg-primary/10 text-foreground bg-background/50 cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <motion.span
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                >Sign In</motion.span>
              </button>
            </SignInButton>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <SignUpButton>
              <button
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <motion.span
                  initial={{ y: 0 }}
                  whileHover={{ y: -2 }}
                >Sign Up</motion.span>
              </button>
            </SignUpButton>
          </motion.div>
        </SignedOut>

        <SignedIn>
          <div className="relative">
            <motion.div 
              className="absolute inset-0 z-0 pointer-events-none"
              whileHover="hover"
              initial="initial"
              animate="animate"
            >
              <motion.div
                variants={{
                  animate: { 
                    scale: [1, 1.05, 1],
                    transition: {
                      scale: {
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 2,
                        repeatDelay: 5
                      }
                    }
                  }
                }}
                className="absolute inset-0 rounded-full"
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-primary/10 origin-bottom pointer-events-none"
                variants={{
                  initial: { 
                    scaleY: 0,
                    opacity: 0
                  },
                  hover: { 
                    scaleY: 1,
                    opacity: 0.7,
                    transition: { duration: 0.3 }
                  }
                }}
              />
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-primary/20 pointer-events-none"
                variants={{
                  initial: { opacity: 0, width: "30%" },
                  hover: { opacity: 1, width: "75%" },
                  animate: {
                    opacity: [0, 0.5, 0],
                    transition: {
                      opacity: {
                        repeat: Infinity,
                        duration: 2,
                        repeatDelay: 3
                      }
                    }
                  }
                }}
              />
            </motion.div>
            
            <motion.div
              className="relative z-10 bg-background/50 border border-primary/10 rounded-full p-1"
              whileHover={{ scale: 1.1 }}
              initial={{ scale: 1 }}
            >
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  }
                }}
              />
            </motion.div>
          </div>
        </SignedIn>
      </motion.div>
    </motion.div>
  );
}

