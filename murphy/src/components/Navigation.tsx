"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from '@/components/ui/sheet';
import { Mic, Library, Home, Headphones, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

export default function Navigation() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
        toast.success('Signed out successfully');
    };

    const closeSheet = () => setIsOpen(false);

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl">
                        <div className="p-1.5 sm:p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                            <Headphones className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Murphy
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3 lg:gap-4">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2 text-sm">
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>

                        {session && (
                            <>
                                <Link href="/podcasts">
                                    <Button variant="ghost" className="gap-2 text-sm">
                                        <Library className="h-4 w-4" />
                                        Podcasts
                                    </Button>
                                </Link>
                                <Link href="/generate-podcast">
                                    <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm px-3 lg:px-4">
                                        <Mic className="h-4 w-4" />
                                        <span className="hidden lg:inline">Create</span>
                                        <span className="lg:hidden">New</span>
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Desktop User Menu */}
                        {status === "loading" ? (
                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-sm">
                                                {session.user.username?.charAt(0).toUpperCase() ||
                                                    session.user.name?.charAt(0).toUpperCase() ||
                                                    'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium text-sm">{session.user.username || session.user.name}</p>
                                            <p className="w-[200px] truncate text-xs text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-sm">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-sm">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 text-sm"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/signin">
                                    <Button variant="ghost" className="text-sm px-3">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm px-3">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center gap-2">
                        {status === "loading" ? (
                            <div className="h-7 w-7 rounded-full bg-muted animate-pulse" />
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-7 w-7 rounded-full p-3">
                                        <Avatar className="h-7 w-7">
                                            <AvatarFallback className="text-xs">
                                                {session.user.username?.charAt(0).toUpperCase() ||
                                                    session.user.name?.charAt(0).toUpperCase() ||
                                                    'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            <p className="font-medium text-sm">{session.user.username || session.user.name}</p>
                                            <p className="w-[150px] truncate text-xs text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-sm">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-sm">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 text-sm"
                                        onClick={handleSignOut}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : null}

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-9 w-9 p-3"
                                    aria-label="Toggle menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] sm:w-[350px] p-3">
                                <SheetHeader className="text-left">
                                    <SheetTitle className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                            <Headphones className="h-4 w-4" />
                                        </div>
                                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            Murphy
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                
                                <div className="mt-8 flex flex-col space-y-4">
                                    <SheetClose asChild>
                                        <Link href="/">
                                            <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base" onClick={closeSheet}>
                                                <Home className="h-5 w-5" />
                                                Home
                                            </Button>
                                        </Link>
                                    </SheetClose>

                                    {session ? (
                                        <>
                                            <SheetClose asChild>
                                                <Link href="/podcasts">
                                                    <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-base" onClick={closeSheet}>
                                                        <Library className="h-5 w-5" />
                                                        Podcasts
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/generate-podcast">
                                                    <Button className="w-full justify-start gap-3 h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={closeSheet}>
                                                        <Mic className="h-5 w-5" />
                                                        Create Podcast
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </>
                                    ) : (
                                        <div className="space-y-4 pt-4">
                                            <SheetClose asChild>
                                                <Link href="/auth/signin">
                                                    <Button variant="outline" className="w-full h-12 text-base" onClick={closeSheet}>
                                                        Sign In
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link href="/auth/signup">
                                                    <Button className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={closeSheet}>
                                                        Sign Up
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
