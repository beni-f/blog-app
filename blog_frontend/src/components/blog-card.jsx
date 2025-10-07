"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export const BlogPostCard = ({
    id,
    coverImage,
    title,
    createdAt,
    category,
    className,
}) => {
    const router = useRouter()

    return (
        <div
            className={cn(
                "w-full max-w-sm overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer hover:shadow-xl transition-shadow",
                className
            )}
        >
            {/* Cover Image */}
            <div className="relative h-64">
                <img
                    src={coverImage || "/placeholder.svg"}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="p-5 space-y-3">
                {/* Title */}
                <h3 className="text-xl font-bold line-clamp-2">{title}</h3>

                {/* Date and Category */}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{new Date(createdAt).toLocaleDateString()}</span>
                    <Badge variant="secondary">{category}</Badge>
                </div>

                {/* See More Button */}
                <div className="pt-2">
                    <Button
                        size="sm"
                        onClick={() => router.push(`/blog/${id}`)}
                        className="w-full"
                    >
                        See More
                    </Button>
                </div>
            </div>
        </div>
    )
}
