"use client"

import React, { useContext, useEffect } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import NavigationBar from "@/components/navbar"
import { useRouter } from "next/navigation"
import { AuthContext } from "@/context/AuthContext"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

const categories = ["Technology", "Lifestyle", "Education", "Health", "Travel"]

export default function CreatePostPage() {
    const router = useRouter()
    const { user, loading } = useContext(AuthContext)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

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

        try {
            const res = await axiosInstance.post("/posts/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            toast.success("You have posted your blog.")
            router.push("/")
        } catch (err) {
            console.error(err)
            toast.error("Something went wrong while creating the post.")
        }
    }

    useEffect(() => {
        if (!loading && !user) {
            toast.error("You must be logged in to create a post.")
            router.push('/auth')
        }
    }, [user, loading, router])

    return (
        <>
            <NavigationBar />
            <div className="min-h-screen bg-background p-6 tracking-tight">
                <div className="mx-auto max-w-4xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">Create New Blog Post</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content</Label>
                                    <RichTextEditor value={content} onChange={setContent} />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" size="lg">
                                        Publish Post
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
