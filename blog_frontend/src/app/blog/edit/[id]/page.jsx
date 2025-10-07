"use client"

import React, { useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import NavigationBar from "@/components/navbar"
import { AuthContext } from "@/context/AuthContext"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"
import { Loader2 } from "lucide-react"

const categories = ["Technology", "Lifestyle", "Education", "Health", "Travel"]

export default function EditPostPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, loading } = useContext(AuthContext)

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [fetching, setFetching] = useState(true)
    const [saving, setSaving] = useState(false)

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            toast.error("You must be logged in to edit a post.")
            router.push("/auth")
        }
    }, [user, loading, router])

    // Fetch existing post data
    useEffect(() => {
        if (!id) return
        const fetchPost = async () => {
            try {
                const res = await axiosInstance.get(`/posts/${id}/`)
                const post = res.data
                setTitle(post.title || "")
                setContent(post.content || "")
                setCategory(post.category || "")
                setImagePreview(post.cover_image || "")
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch post.")
                router.push("/")
            } finally {
                setFetching(false)
            }
        }
        fetchPost()
    }, [id, router])

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setCoverImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("title", title)
        formData.append("content", content)
        formData.append("category", category)
        if (coverImage) {
            formData.append("cover_image", coverImage)
        }

        setSaving(true)
        try {
            await axiosInstance.patch(`/posts/${id}/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            toast.success("Post updated successfully.")
            router.push(`/blog/${id}`)
        } catch (err) {
            console.error(err)
            toast.error("Failed to update post.")
        } finally {
            setSaving(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        )
    }

    return (
        <>
            <NavigationBar />
            <div className="min-h-screen bg-background p-6 tracking-tight">
                <div className="mx-auto max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">Edit Blog Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter your blog post title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={category} onValueChange={setCategory} required>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Cover Image */}
                                <div className="space-y-2">
                                    <Label htmlFor="cover-image">Cover Image</Label>
                                    <Input id="cover-image" type="file" accept="image/*" onChange={handleImageChange} />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Cover preview"
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <RichTextEditor value={content} onChange={setContent} />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        onClick={() => router.push(`/blog/${id}`)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" size="lg" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}
