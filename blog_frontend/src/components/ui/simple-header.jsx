"use client"

import React, { useContext } from 'react'
import { NotebookPen } from 'lucide-react'
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { MenuToggle } from '@/components/ui/menu-toggle'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function SimpleHeader() {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const { user, logout } = useContext(AuthContext)

	const handleLogout = () => {
		logout()
		router.push('/auth')
	}

	const handleCategorySelect = (category) => {
		router.push(`/blogs?category=${category}`)
		setOpen(false)
	}

	const linksForAuthenticatedUsers = [
		{ label: 'Home', href: '/' },
		{ label: 'Blogs', href: '/blogs' },
		{ label: 'Create', href: '/create' },
	]

	const linksForGuests = [
		{ label: 'Home', href: '/' },
		{ label: 'Blogs', href: '/blogs' },
	]

	const links = user ? linksForAuthenticatedUsers : linksForGuests

	const categories = ['Health', 'Travel', 'Technology', 'Lifestyle', 'Education']

	return (
		<header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky pt-5 w-full border-b backdrop-blur-lg tracking-tight">
			<nav className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<NotebookPen className="size-6" />
					<p className="font-mono text-lg font-bold tracking-tighter">BLOG</p>
				</div>

				{/* Desktop Links */}
				<div className="hidden items-center gap-2 lg:flex text-lg">
					{links.map((link, idx) => (
						<a key={idx} href={link.href} className={buttonVariants({ variant: 'ghost' })}>
							{link.label}
						</a>
					))}

					{/* Categories Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost">Categories</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							{categories.map((category) => (
								<DropdownMenuItem
									key={category}
									onClick={() => handleCategorySelect(category)}
								>
									{category}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{user ? (
						<Button onClick={handleLogout}>Logout</Button>
					) : (
						<>
							<Button variant="outline" onClick={() => router.push('/auth')}>Sign In</Button>
							<Button onClick={() => router.push('/auth/register')}>Get Started</Button>
						</>
					)}
				</div>

				{/* Mobile Menu */}
				<Sheet open={open} onOpenChange={setOpen}>
					<Button size="icon" variant="outline" className="lg:hidden">
						<MenuToggle
							strokeWidth={2.5}
							open={open}
							onOpenChange={setOpen}
							className="size-6"
						/>
					</Button>

					<SheetContent
						className="bg-background/95 supports-[backdrop-filter]:bg-background/80 gap-0 backdrop-blur-lg"
						showClose={false}
						side="left"
					>
						<div className="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
							{links.map((link, idx) => (
								<a
									key={idx}
									href={link.href}
									className={buttonVariants({ variant: 'ghost', className: 'justify-start' })}
								>
									{link.label}
								</a>
							))}

							{/* Categories for Mobile */}
							<div className="mt-2">
								<p className="font-semibold mb-1 text-sm text-muted-foreground">Categories</p>
								{categories.map((category) => (
									<Button
										key={category}
										variant="ghost"
										className="justify-start w-full"
										onClick={() => handleCategorySelect(category)}
									>
										{category}
									</Button>
								))}
							</div>
						</div>

						<SheetFooter className="flex flex-col gap-2">
							{user ? (
								<Button onClick={handleLogout}>Logout</Button>
							) : (
								<>
									<Button variant="outline" onClick={() => router.push('/auth')}>Sign In</Button>
									<Button onClick={() => router.push('/auth/register')}>Get Started</Button>
								</>
							)}
						</SheetFooter>
					</SheetContent>
				</Sheet>
			</nav>
		</header>
	)
}
