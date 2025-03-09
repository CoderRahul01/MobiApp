"use client";

import { useState, useEffect, useRef } from "react";
import { BACKEND_URL, WORKER_API_URL } from "@/config";
import { useRouter } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { MoveUpRight, ChevronRight, Sparkles } from "lucide-react";
import axios from "axios";
import { prompts } from "@/lib/constants"
import { motion } from "motion/react"
import { containerVariants, itemVariants } from "@/lib/animation-variants"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function Prompt() {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"NEXTJS" | "REACT_NATIVE">("NEXTJS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(promptRef.current) {
      promptRef.current.focus();
    }
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      if(!token) {
        setIsSignedIn(true);
        setIsSubmitting(false);
        return;
      }
      
      const response = await axios.post(`${BACKEND_URL}/project`, {
        prompt: prompt,
        type: type,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Send prompt to worker
      await axios.post(`${WORKER_API_URL}/prompt`, {
        projectId: response.data.projectId,
        prompt: prompt,
      });

      router.push(`/project/${response.data.projectId}`);
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       className="w-full"
    >
      <div className="px-4 py-2 sm:static sm:w-auto fixed bottom-0 left-0 w-full">
        <div className="flex flex-row gap-2 mb-4 justify-center">
          <Button 
            variant={type === "NEXTJS" ? "default" : "outline"} 
            onClick={() => setType("NEXTJS")}
            className={`relative overflow-hidden rounded-full px-6 py-2 
              ${type === "NEXTJS" 
                ? `${isDarkMode ? "bg-primary/90" : "bg-primary"} hover:bg-primary text-primary-foreground shadow-md` 
                : "hover:bg-primary/10"}`
            }
          >
            {type === "NEXTJS" && !isDarkMode && (
              <motion.div 
                className="absolute inset-0 bg-white opacity-10"
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
            <span className="relative z-10">NextJS</span>
          </Button>
          <Button 
            variant={type === "REACT_NATIVE" ? "default" : "outline"} 
            onClick={() => setType("REACT_NATIVE")}
            className={`relative overflow-hidden rounded-full px-6 py-2 
              ${type === "REACT_NATIVE" 
                ? `${isDarkMode ? "bg-primary/90" : "bg-primary"} hover:bg-primary text-primary-foreground shadow-md` 
                : "hover:bg-primary/10"}`
            }
          >
            {type === "REACT_NATIVE" && !isDarkMode && (
              <motion.div 
                className="absolute inset-0 bg-white opacity-10"
                animate={{ 
                  opacity: [0.1, 0.2, 0.1],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            )}
            <span className="relative z-10">React Native</span>
          </Button>
        </div>
        
        <motion.form 
          variants={itemVariants} 
          onSubmit={(e) => onSubmit(e)} 
          className={`relative w-full border backdrop-blur-sm border-primary/20 ${isDarkMode ? 'bg-background/50' : 'bg-white/80'} focus-within:outline-1 focus-within:outline-primary/40 rounded-xl shadow-sm transition-all hover:shadow-md`}
        >
          <div className="absolute top-2 left-3">
            <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-primary/40' : 'text-primary/60'}`} />
          </div>
          
          <div className="p-2 pl-10">
            <Textarea
              ref={promptRef}
              value={prompt}
              placeholder="Write your prompt here..."
              onChange={(e) => setPrompt(e.target.value)}
              className={`w-full placeholder:text-muted-foreground/60 bg-transparent border-none shadow-none text-md rounded-none focus-visible:ring-0 min-h-16 max-h-80 resize-none outline-none ${isDarkMode ? '' : 'placeholder:text-slate-400/70'}`}
            />
          </div>

          <div className="p-2 flex items-center justify-end">
            <Button
              type="submit"
              className={`relative h-10 w-10 cursor-pointer rounded-full ${isDarkMode ? 'bg-primary/90 dark:hover:bg-primary' : 'bg-primary hover:bg-primary-foreground hover:text-primary'} flex items-center justify-center shadow-sm transition-all duration-300 hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={!prompt || isSubmitting}
            >
              {!isDarkMode && !isSubmitting && (
                <motion.div 
                  className="absolute inset-0 rounded-full bg-white/10"
                  animate={{ 
                    scale: [1, 1.15, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
              <MoveUpRight className="w-5 h-5 text-primary-foreground" />
            </Button>
          </div>
        </motion.form>
      </div>

      <motion.div 
        variants={itemVariants} 
        className="flex flex-row flex-wrap mt-4 sm:flex-nowrap w-full gap-2 sm:gap-2 justify-center items-center px-4"
      >
        <div className="w-full flex flex-wrap gap-2 justify-center">
          {prompts.map((prompt) => (
            <div 
              onClick={() => setPrompt(prompt.title)} 
              key={prompt.id} 
              className={`border ${isDarkMode ? 'dark:border-primary/20 dark:bg-background/30' : 'border-primary/10 bg-white/50'} hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-sm`}
            >
              <p className="text-muted-foreground text-sm">{prompt.title}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <AlertDialog open={isSignedIn} onOpenChange={setIsSignedIn}>
        <AlertDialogContent className={`border border-primary/20 ${isDarkMode ? 'dark:bg-background/90' : 'bg-white/95'} backdrop-blur-md text-foreground rounded-xl shadow-lg`}>
          <AlertDialogHeader>
           <div className="flex items-center gap-2">
            <ChevronRight className="text-primary" />
            <AlertDialogTitle className="text-foreground">You are not signed in</AlertDialogTitle>
           </div>
             <AlertDialogDescription className="text-muted-foreground">
               Please sign in to access this feature. Your data is safe and will not be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-0 rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction className={`cursor-pointer ${isDarkMode ? 'bg-primary' : 'bg-primary'} text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-0 rounded-full`}>Sign in</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

