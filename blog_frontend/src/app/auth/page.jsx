"use client"

import React, { useContext, useEffect } from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NavigationBar from "@/components/navbar"
import { AuthContext } from "@/context/AuthContext"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"
import { useRouter } from "next/navigation"

export default function AuthPage() {
    const router = useRouter()
    const [loader, setLoader] = useState(false)
    const { user, loading, login } = useContext(AuthContext)
    const [signUpData, setSignUpData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        bio: "",
    })

    const [signInData, setSignInData] = useState({
        identifier: "",
        password: "",
    })

    useEffect(() => {
        if (user) {
            toast.success("You've already logged in")
            router.push('/')
        }
    })

    const handleSignUp = (e) => {
        e.preventDefault()
        setLoader(true)
        axiosInstance.post('/register/', signUpData)
            .then(res => {
                toast.success("Account created successfully! You can now sign in.")
            })
            .catch(err => {
                console.error("Registration error:", err)
                toast.error("Registration failed. Please try again.")
            })
            .finally(() => setLoader(false))
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoader(true)
        try {
            await login(signInData.identifier, signInData.password)
            toast.success("Signed in successfully!")
            setTimeout(() => {
                router.push('/')
            }, 1000)
        } catch (error) {
            toast.error("Sign in failed. Please check your credentials and try again.")
        } finally {
            setLoader(false)
        }
    }

    return (
        <>
            <NavigationBar />
            <div className="flex min-h-screen items-center justify-center bg-background p-6">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
                        <CardDescription>Sign in to your account or create a new one</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="signin">Sign In</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="signin">
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="identifier">Email or Username</Label>
                                        <Input
                                            id="identifier"
                                            placeholder="Enter your email or username"
                                            value={signInData.identifier}
                                            onChange={(e) => setSignInData({ ...signInData, identifier: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            placeholder="Enter your password"
                                            value={signInData.password}
                                            onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Sign In
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                value={signUpData.firstName}
                                                onChange={(e) => setSignUpData({ ...signUpData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                value={signUpData.lastName}
                                                onChange={(e) => setSignUpData({ ...signUpData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            placeholder="johndoe"
                                            value={signUpData.username}
                                            onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            placeholder="example@gmail.com"
                                            value={signUpData.email}
                                            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="Create a password"
                                            value={signUpData.password}
                                            onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            value={signUpData.bio}
                                            onChange={(e) => setSignUpData({ ...signUpData, bio: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
