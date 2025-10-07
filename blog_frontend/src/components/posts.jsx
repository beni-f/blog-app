"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { AuthorCard } from "@/components/ui/content-card"
import axiosInstance from "@/lib/axios"
import { Loader2 } from "lucide-react"

function SmallPostCard({ id, image, title, date }) {
    return (
        <Link
            href={`/blog/${id}`}
            className="flex items-center gap-3 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
            <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-2 flex-1">
                <p className="text-sm text-gray-500">{date}</p>
                <h4 className="text-md font-semibold line-clamp-2">{title}</h4>
            </div>
        </Link>
    )
}

export default function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance
            .get("/posts/")
            .then((res) => {
                setPosts(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching posts:", err)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        )
    }

    const trendingPosts = posts.slice(0, 3)
    const latestPosts = posts.slice(0, 3)

    console.log(trendingPosts)

    return (
        <>
            <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center pt-10 tracking-tight">
                    Explore Posts
                </h2>
            </div>

            <div className="container mx-auto py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Trending Section */}
                    <div className="lg:w-3/4">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-5 tracking-tight">
                            Trending Posts
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {trendingPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.id}`} className="block">
                                    <AuthorCard
                                        backgroundImage={post.cover_image || "/placeholder.svg"}
                                        author={{
                                            name: post.author,
                                            avatar: post.author ? post.author.charAt(0).toUpperCase() : "U",
                                            date: new Date(post.created_at).toLocaleDateString(),
                                        }}
                                        content={{
                                            title: post.title,
                                            category: post.category,
                                        }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Latest Section */}
                    <div className="lg:w-1/4">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-5 tracking-tight">
                            Latest Posts
                        </h3>
                        <div className="flex flex-col gap-4">
                            {latestPosts.length > 0 ? (
                                latestPosts.map((post) => (
                                    <SmallPostCard
                                        key={post.id}
                                        id={post.id}
                                        image={post.cover_image}
                                        title={post.title}
                                        date={new Date(post.created_at).toLocaleDateString()}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No latest posts available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
