"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mic, 
  Calendar, 
  User, 
  Search, 
  Play, 
  Download,
  Clock,
  FileText,
  Headphones,
  ArrowRight,
  Music,
  Globe,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';
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
        fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
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
            <div className="container mx-auto p-6 max-w-7xl">
                <div className="mb-8">
                    <Skeleton className="h-12 w-96 mb-4" />
                    <Skeleton className="h-6 w-[600px]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full mb-4" />
                                <div className="flex gap-2 mb-4">
                                    <Skeleton className="h-6 w-16" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto p-6 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        <Headphones className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Podcast Library
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Discover and listen to AI-generated podcasts
                        </p>
                    </div>
                </div>

                {/* Tabs for All Podcasts and My Podcasts */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="all" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            All Podcasts
                            <Badge variant="secondary" className="ml-1">
                                {allPodcasts.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="my" className="flex items-center gap-2" disabled={!session?.user}>
                            <UserCheck className="h-4 w-4" />
                            My Podcasts
                            <Badge variant="secondary" className="ml-1">
                                {myPodcasts.length}
                            </Badge>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
                
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Music className="h-5 w-5" />
                        <span>{filteredPodcasts.length} podcast{filteredPodcasts.length !== 1 ? 's' : ''} available</span>
                    </div>
                    <Link href="/generate-podcast">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <Mic className="h-4 w-4 mr-2" />
                            Create New Podcast
                        </Button>
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search podcasts by description or idea..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="all">All Languages</option>
                        {supportedLanguages.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Podcasts Grid */}
            {filteredPodcasts.length === 0 ? (
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <Headphones className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
                        {activeTab === 'my' ? (
                            !session?.user ? (
                                <>
                                    <h3 className="text-2xl font-semibold mb-4">Sign in to view your podcasts</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Create an account or sign in to save and manage your personal podcast collection.
                                    </p>
                                    <Link href="/auth/signin">
                                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                            <User className="h-4 w-4 mr-2" />
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-semibold mb-4">No personal podcasts yet</h3>
                                    <p className="text-muted-foreground mb-6">
                                        You haven't created any podcasts yet. Start by generating your first AI-powered podcast!
                                    </p>
                                    <Link href="/generate-podcast">
                                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                            <Mic className="h-4 w-4 mr-2" />
                                            Create Your First Podcast
                                        </Button>
                                    </Link>
                                </>
                            )
                        ) : (
                            <>
                                <h3 className="text-2xl font-semibold mb-4">No podcasts found</h3>
                                <p className="text-muted-foreground mb-6">
                                    {searchTerm || selectedLanguage !== 'all' 
                                        ? 'Try adjusting your search filters or explore all available podcasts.'
                                        : 'No podcasts are available at the moment. Be the first to create one!'
                                    }
                                </p>
                                <Link href="/generate-podcast">
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <Mic className="h-4 w-4 mr-2" />
                                        Create New Podcast
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPodcasts.map((podcast) => (
                        <Card key={podcast._id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                                            {podcast.description}
                                        </CardTitle>
                                        <CardDescription className="mt-2 line-clamp-3">
                                            {podcast.idea}
                                        </CardDescription>
                                    </div>
                                    <Mic className="h-5 w-5 text-purple-500 flex-shrink-0 ml-2" />
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                {/* Content Preview */}
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {podcast.podcastTextContent}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        <span>{getWordCount(podcast.podcastTextContent)} words</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(podcast.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Available Languages */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Headphones className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Available in:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {getAvailableLanguages(podcast).map((lang) => (
                                            <Badge 
                                                key={lang.code} 
                                                variant="secondary" 
                                                className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200"
                                            >
                                                {lang.label}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <Link href={`/podcasts/${podcast._id}`} className="block">
                                    <Button className="w-full group/btn bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <Play className="h-4 w-4 mr-2" />
                                        Listen Now
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
}
