"use client";

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
import { Mic, Library, Home, Headphones, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';

export default function Navigation() {
    const { data: session, status } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
        toast.success('Signed out successfully');
    };

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                            <Headphones className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Murphy
                        </span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" className="gap-2">
                                <Home className="h-4 w-4" />
                                Home
                            </Button>
                        </Link>
                        
                        {session && (
                            <>
                                <Link href="/podcasts">
                                    <Button variant="ghost" className="gap-2">
                                        <Library className="h-4 w-4" />
                                        Podcasts
                                    </Button>
                                </Link>
                                <Link href="/generate-podcast">
                                    <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <Mic className="h-4 w-4" />
                                        Create
                                    </Button>
                                </Link>
                            </>
                        )}

                        {status === "loading" ? (
                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>
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
                                            <p className="font-medium">{session.user.username || session.user.name}</p>
                                            <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
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
                                    <Button variant="ghost">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
