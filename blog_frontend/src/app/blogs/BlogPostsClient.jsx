"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BlogPostCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import NavigationBar from "@/components/navbar"
import { useSearchParams } from "next/navigation"
import axiosInstance from "@/lib/axios"

const categoriesList = ["All", "Technology", "Lifestyle", "Education", "Health", "Travel"]

export default function BlogPostsClient() {
    const searchParams = useSearchParams()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("All")

    useEffect(() => {
        const category = searchParams?.get("category")
        if (category) setSelectedCategory(category)
    }, [searchParams])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosInstance.get("/posts/")
                setPosts(response.data)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch posts")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const filteredPosts =
        selectedCategory === "All"
            ? posts
            : posts.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase())

    if (loading) return <p className="text-center mt-10">Loading posts...</p>
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

    return (
        <>
            <NavigationBar />
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-12">
                        <h1 className="mb-4 text-4xl font-bold text-balance md:text-5xl">Blog Posts</h1>
                        <p className="text-lg text-muted-foreground">Explore our latest articles and insights</p>
                    </div>
                    <div className="mb-12 flex flex-wrap gap-3">
                        {categoriesList.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className="rounded-full"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    <motion.div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="wait">
                            {filteredPosts.map((post) => (
                                <motion.div key={post.id} layout>
                                    <BlogPostCard
                                        id={post.id}
                                        coverImage={post.cover_image}
                                        title={post.title}
                                        createdAt={post.created_at}
                                        category={post.category}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredPosts.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-lg text-muted-foreground">No blog posts found in this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
