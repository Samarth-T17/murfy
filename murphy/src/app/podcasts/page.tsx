"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Calendar, 
  User, 
  Search, 
  Play, 
  FileText,
  Headphones,
  ArrowRight,
  Music,
  Globe,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { Podcast } from '@/lib/firebase';
import Navigation from '@/components/Navigation';

const supportedLanguages = [
    { code: "english", label: "English" },
    { code: "hindi", label: "Hindi" },
    { code: "bengali", label: "Bengali" },
    { code: "french", label: "French" },
    { code: "german", label: "German" },
    { code: "italian", label: "Italian" },
    { code: "tamil", label: "Tamil" }
];

export default function PodcastsPage() {
    const { data: session } = useSession();
    const [allPodcasts, setAllPodcasts] = useState<Podcast[]>([]);
    const [myPodcasts, setMyPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all podcasts
                const allResponse = await fetch('/api/podcasts?type=all');
                if (allResponse.ok) {
                    const allData = await allResponse.json();
                    setAllPodcasts(allData);
                }

                // Fetch user's podcasts if logged in
                if (session?.user?.email) {
                    const myResponse = await fetch('/api/podcasts?type=my');
                    if (myResponse.ok) {
                        const myData = await myResponse.json();
                        setMyPodcasts(myData);
                    }
                }
            } catch (error) {
                console.error('Error fetching podcasts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.email]);

    const getCurrentPodcasts = () => {
        return activeTab === 'all' ? allPodcasts : myPodcasts;
    };

    const filteredPodcasts = getCurrentPodcasts().filter((podcast: Podcast) => {
        const matchesSearch = podcast.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            podcast.idea.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedLanguage === 'all') return matchesSearch;
        
        return matchesSearch && podcast.urls[selectedLanguage as keyof typeof podcast.urls];
    });

    const getAvailableLanguages = (podcast: Podcast) => {
        return supportedLanguages.filter(lang => 
            podcast.urls[lang.code as keyof typeof podcast.urls]
        );
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getWordCount = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <Navigation />
                <div className="container mx-auto p-6 max-w-7xl">
                    {/* Enhanced Header Skeleton */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-6">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-3">
                                <Skeleton className="h-10 w-80" />
                                <Skeleton className="h-6 w-96" />
                            </div>
                        </div>
                        
                        {/* Tabs Skeleton */}
                        <div className="mb-8">
                            <Skeleton className="h-12 w-80 rounded-lg" />
                        </div>
                        
                        {/* Search and Filter Skeleton */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <Skeleton className="h-12 flex-1" />
                            <Skeleton className="h-12 w-48" />
                        </div>
                    </div>

                    {/* Enhanced Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                    <div className="flex gap-2">
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-6 w-18" />
                                    </div>
                                    <Skeleton className="h-12 w-full rounded-lg" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Navigation />
            
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-3/4 -right-4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-blue-300/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto p-6 max-w-7xl">
                {/* Enhanced Header Section */}
                <div className="mb-3">
                    <div className="text-center mb-3">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 mb-6">
                            <Headphones className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                            Podcast Library
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed">
                            Discover and listen to AI-generated podcasts crafted with cutting-edge technology
                        </p>
                        
                        {/* Stats Bar */}
                        <div className="flex items-center justify-center gap-8 mt-8 p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                                    <Globe className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{allPodcasts.length}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Total Podcasts</p>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                                    <UserCheck className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{myPodcasts.length}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Your Podcasts</p>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-1">
                                    <Music className="h-5 w-5" />
                                    <span className="text-2xl font-bold">{supportedLanguages.length}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Languages</p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
                        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-14 p-1 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
                            <TabsTrigger 
                                value="all" 
                                className="flex items-center gap-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200"
                            >
                                <Globe className="h-4 w-4" />
                                All Podcasts
                                <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0">
                                    {allPodcasts.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger 
                                value="my" 
                                className="flex items-center gap-2 h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-200" 
                                disabled={!session?.user}
                            >
                                <UserCheck className="h-4 w-4" />
                                My Podcasts
                                <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0">
                                    {myPodcasts.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
                    {/* Action Section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-lg">
                                    {filteredPodcasts.length} podcast{filteredPodcasts.length !== 1 ? 's' : ''} available
                                </p>
                                <p className="text-sm text-muted-foreground">Ready to explore amazing content</p>
                            </div>
                        </div>
                        <Link href="/generate-podcast">
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-6">
                                <Mic className="h-5 w-5 mr-2" />
                                Create New Podcast
                                <Sparkles className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Enhanced Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                placeholder="Search podcasts by description or idea..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-12 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 focus:border-purple-400 dark:focus:border-purple-600 transition-colors"
                            />
                        </div>
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="px-4 py-3 h-12 border border-purple-200/50 dark:border-purple-800/50 rounded-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-w-[180px]"
                        >
                            <option value="all">All Languages</option>
                            {supportedLanguages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Enhanced Podcasts Grid */}
                {filteredPodcasts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 mb-8">
                                <Headphones className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                            </div>
                            {activeTab === 'my' ? (
                                !session?.user ? (
                                    <>
                                        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            Sign in to view your podcasts
                                        </h3>
                                        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                            Create an account or sign in to save and manage your personal podcast collection.
                                        </p>
                                        <Link href="/auth/signin">
                                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8">
                                                <User className="h-5 w-5 mr-2" />
                                                Sign In
                                                <ArrowRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                            No personal podcasts yet
                                        </h3>
                                        <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                            You haven&apos;t created any podcasts yet. Start by generating your first AI-powered podcast!
                                        </p>
                                        <Link href="/generate-podcast">
                                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8">
                                                <Mic className="h-5 w-5 mr-2" />
                                                Create Your First Podcast
                                                <Sparkles className="h-4 w-4 ml-2" />
                                            </Button>
                                        </Link>
                                    </>
                                )
                            ) : (
                                <>
                                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                        No podcasts found
                                    </h3>
                                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                        {searchTerm || selectedLanguage !== 'all' 
                                            ? 'Try adjusting your search filters or explore all available podcasts.'
                                            : 'No podcasts are available at the moment. Be the first to create one!'
                                        }
                                    </p>
                                    <Link href="/generate-podcast">
                                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8">
                                            <Mic className="h-5 w-5 mr-2" />
                                            Create New Podcast
                                            <Sparkles className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPodcasts.map((podcast, index) => (
                            <Card 
                                key={podcast._id} 
                                className="border-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm overflow-hidden relative h-full flex flex-col min-h-[450px]"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animation: ' 0.6s ease-out '
                                }}
                            >
                                {/* Gradient Border Effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                                
                                <CardHeader className="pb-6 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl line-clamp-4 leading-tight min-h-[4.5rem]">
                                                {podcast.idea}
                                            </CardTitle>
                                            <CardDescription className="mt-4 line-clamp-5 text-base leading-relaxed min-h-[6rem]">
                                                {podcast.description}
                                            </CardDescription>
                                        </div>
                                        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 ml-4 flex-shrink-0">
                                            <Mic className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="flex-1 flex flex-col justify-between space-y-6 relative z-10 pb-8">
                                    <div className="space-y-6">
                                        {/* Enhanced Stats */}
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/30">
                                                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <span className="font-medium">{getWordCount(podcast.podcastTextContent)} words</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/30">
                                                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-medium">{formatDate(podcast.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Enhanced Available Languages */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-md bg-green-100 dark:bg-green-900/30">
                                                    <Headphones className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="text-sm font-medium">Available in {getAvailableLanguages(podcast).length} languages:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                                                {getAvailableLanguages(podcast).map((lang) => (
                                                    <Badge 
                                                        key={lang.code} 
                                                        variant="secondary" 
                                                        className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-800 dark:text-purple-200 "
                                                    >
                                                        {lang.label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Action Button - Always at bottom */}
                                    <div className="mt-auto pt-6">
                                        <Link href={`/podcasts/${podcast._id}`} className="block">
                                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-14 text-base font-medium">
                                                <Play className="h-5 w-5 mr-3" />
                                                Listen Now
                                                <ArrowRight className="h-5 w-5 ml-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
