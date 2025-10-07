"use client"

import dynamic from "next/dynamic"

const BlogPostsClient = dynamic(() => import("./BlogPostsClient"), { ssr: false })

export default function Page() {
    return <BlogPostsClient />
}
