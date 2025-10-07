"use client"

import Hero from "@/components/hero";
import NavigationBar from "@/components/navbar";
import Posts from "@/components/posts";
import { AuthContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { useContext } from "react";


export default function Home() {
  const { user, loading } = useContext(AuthContext)

  if (!user && loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your content...</p>
      </div>
    )
  }

  return (
    <>
      <NavigationBar />
      <Hero />
      <Posts />
    </>
  )
}