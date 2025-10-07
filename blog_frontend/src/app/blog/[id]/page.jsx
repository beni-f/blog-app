"use client"

import React, { useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import NavigationBar from "@/components/navbar"
import axiosInstance from "@/lib/axios"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { AuthContext } from "@/context/AuthContext"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function BlogDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState("")
    const [deleting, setDeleting] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        axiosInstance
            .get(`/posts/${id}/`)
            .then((res) => {
                setPost(res.data)
                setComments(res.data.comments || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error fetching post:", err)
                setLoading(false)
                router.push("/404")
            })
    }, [id, router])

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        const commentData = {
            post: post.id,
            content: newComment,
        }

        try {
            setLoading(true)
            const res = await axiosInstance.post("/comments/", commentData)
            setComments((prev) => [...prev, res.data])
            setNewComment("")
            toast.success("Comment added!")
        } catch (err) {
            console.error(err)
            toast.error("Failed to add comment")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        router.push(`/blog/edit/${id}`)
    }

    const handleDelete = async () => {
        try {
            setDeleting(true)
            await axiosInstance.delete(`/posts/${id}/`)
            toast.success("Post deleted successfully")
            router.push("/blogs")
        } catch (err) {
            console.error("Error deleting post:", err)
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
        )
    }

    if (!post) {
        return <div className="min-h-screen flex items-center justify-center">Post not found</div>
    }

    const isAuthor = user && user.username === post.author

    return (
        <>
            <NavigationBar />
            <div className="min-h-screen bg-background">
                <article className="mx-auto max-w-4xl px-6 py-12">
                    <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            {new Date(post.created_at).toLocaleDateString()}, by {post.author}
                        </div>

                        {isAuthor && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handleEdit} className="cursor-pointer">
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>

                                <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="flex items-center text-black cursor-pointer">
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Delete
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your blog post.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                disabled={deleting}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {deleting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    "Delete Post"
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>

                    <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">{post.title}</h1>

                    <div className="mb-8">
                        <Badge variant="secondary" className="text-sm">
                            {post.category}
                        </Badge>
                    </div>

                    <div className="mb-12">
                        <img
                            src={post.cover_image || "/placeholder.svg"}
                            alt={post.title}
                            className="h-auto w-full rounded-lg object-cover"
                        />
                    </div>

                    <div
                        className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4 prose-p:leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Comments Section */}
                    <div className="mt-16 border-t pt-12">
                        <h2 className="mb-8 text-3xl font-bold">Comments ({comments.length})</h2>

                        <div className="space-y-6 mb-8">
                            {comments.map((comment) => (
                                <Card key={comment.id} className="p-6">
                                    <div className="flex gap-4">
                                        <Avatar>
                                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="font-semibold">{comment.author}</span>
                                                <span className="text-sm text-muted-foreground">{comment.date}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card className="p-6">
                            <h3 className="mb-4 text-xl font-semibold">Add a Comment</h3>
                            <form onSubmit={handleAddComment} className="space-y-4">
                                <Input
                                    placeholder="Write your comment here..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="min-h-[100px]"
                                    required
                                />
                                <Button type="submit">Post Comment</Button>
                            </form>
                        </Card>
                    </div>
                </article>
            </div>
        </>
    )
}
