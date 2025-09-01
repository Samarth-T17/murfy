"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Calendar, 
  FileText,
  Headphones,
  Clock,
  Volume2,
  Copy,
  Music,
  Mic
} from 'lucide-react';
import { Podcast } from '@/lib/firebase';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

const supportedLanguages = [
    { code: "english", label: "English", flag: "🇺🇸" },
    { code: "hindi", label: "Hindi", flag: "🇮🇳" },
    { code: "bengali", label: "Bengali", flag: "🇧🇩" },
    { code: "french", label: "French", flag: "🇫🇷" },
    { code: "german", label: "German", flag: "🇩🇪" },
    { code: "italian", label: "Italian", flag: "🇮🇹" },
    { code: "tamil", label: "Tamil", flag: "🇮🇳" }
];

export default function PodcastDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [podcast, setPodcast] = useState<Podcast | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
    const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({});
    const audioRefs = useRef<{[key: string]: HTMLAudioElement | null}>({});
    const [currentTime, setCurrentTime] = useState<{[key: string]: number}>({});
    const [duration, setDuration] = useState<{[key: string]: number}>({});

    // Memoized callback for setting audio refs to prevent infinite re-renders
    const setAudioRef = useCallback((lang: string) => {
        return (el: HTMLAudioElement | null) => {
            audioRefs.current[lang] = el;
        };
    }, []);

    useEffect(() => {
        if (params.id) {
            fetchPodcast(params.id as string);
        }
    }, [params.id]);

    const fetchPodcast = async (id: string) => {
        try {
            const response = await fetch(`/api/podcasts/${id}`);
            if (response.ok) {
                const data = await response.json();
                setPodcast(data);
                // Set default language to first available language
                const availableLanguages = getAvailableLanguages(data);
                if (availableLanguages.length > 0) {
                    setSelectedLanguage(availableLanguages[0].code);
                }
            } else {
                toast.error('Podcast not found');
                router.push('/podcasts');
            }
        } catch (error) {
            console.error('Error fetching podcast:', error);
            toast.error('Failed to load podcast');
        } finally {
            setLoading(false);
        }
    };

    const getAvailableLanguages = (podcast: Podcast) => {
        return supportedLanguages.filter(lang => 
            podcast.urls[lang.code as keyof typeof podcast.urls]
        );
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getWordCount = (text: string) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const getEstimatedDuration = (text: string) => {
        const wordCount = getWordCount(text);
        const wordsPerMinute = 150; // Average speaking rate
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `~${minutes} min`;
    };

    const playPauseAudio = (lang: string) => {
        const audio = audioRefs.current[lang];
        if (!audio) return;

        if (isPlaying[lang]) {
            audio.pause();
            setIsPlaying(prev => ({ ...prev, [lang]: false }));
        } else {
            // Pause all other audio
            Object.entries(audioRefs.current).forEach(([otherLang, otherAudio]) => {
                if (otherLang !== lang && otherAudio) {
                    otherAudio.pause();
                    setIsPlaying(prev => ({ ...prev, [otherLang]: false }));
                }
            });
            
            audio.play();
            setIsPlaying(prev => ({ ...prev, [lang]: true }));
        }
    };

    const downloadAudio = (lang: string) => {
        if (!podcast) return;
        const url = podcast.urls[lang as keyof typeof podcast.urls];
        if (!url) return;

        const link = document.createElement('a');
        link.href = url;
        link.download = `${podcast.description}-${lang}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Download started!');
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Content copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy content');
        }
    };

    const shareCurrentUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Podcast link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <Navigation />
                <div className="container mx-auto p-6 max-w-5xl">
                    {/* Enhanced Loading Header */}
                    <div className="mb-12">
                        <Skeleton className="h-6 w-32 mb-8" />
                        <div className="text-center">
                            <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
                            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
                            <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
                            <div className="flex justify-center gap-6 mb-8">
                                <Skeleton className="h-20 w-32 rounded-2xl" />
                                <Skeleton className="h-20 w-32 rounded-2xl" />
                                <Skeleton className="h-20 w-32 rounded-2xl" />
                            </div>
                            <div className="flex justify-center gap-4">
                                <Skeleton className="h-12 w-32 rounded-lg" />
                                <Skeleton className="h-12 w-32 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Language Selection Skeleton */}
                    <Card className="mb-8 border-0 shadow-lg bg-white/70 dark:bg-gray-900/70">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-48 mb-2" />
                                    <Skeleton className="h-4 w-64" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Audio Player Skeleton */}
                    <Card className="mb-8 border-0 shadow-xl bg-white/70 dark:bg-gray-900/70">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-6 w-56 mb-2" />
                                    <Skeleton className="h-4 w-72" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-14 w-32 rounded-lg" />
                                <Skeleton className="h-14 w-28 rounded-lg" />
                                <div className="flex-1">
                                    <Skeleton className="h-10 w-32 ml-auto rounded-lg" />
                                </div>
                            </div>
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </CardContent>
                    </Card>
                    
                    {/* Content Skeleton */}
                    <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex-1">
                                    <Skeleton className="h-7 w-48 mb-2" />
                                    <Skeleton className="h-4 w-80" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full rounded-2xl mb-8" />
                            <div className="flex flex-col sm:flex-row justify-between gap-6">
                                <div className="flex gap-3">
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                    <Skeleton className="h-8 w-28 rounded-full" />
                                    <Skeleton className="h-8 w-32 rounded-full" />
                                </div>
                                <Skeleton className="h-12 w-48 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!podcast) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
                <Navigation />
                <div className="container mx-auto p-6 max-w-5xl">
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="inline-flex items-center justify-center p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 mb-8">
                                <Music className="h-16 w-16 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Podcast not found
                            </h3>
                            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                                The podcast you&apos;re looking for doesn&apos;t exist or has been removed.
                            </p>
                            <Link href="/podcasts">
                                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-12 px-8">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Podcasts
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const availableLanguages = getAvailableLanguages(podcast);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            <Navigation />
            
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-4 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-3/4 -right-4 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-300/10 to-blue-300/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative container mx-auto p-6 max-w-5xl">
                {/* Enhanced Navigation */}
                <div className="mb-8">
                    <Link href="/podcasts" className="inline-flex items-center text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors group">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="font-medium">Back to Podcasts</span>
                    </Link>
                </div>

                {/* Enhanced Header Section */}
                <div className="mb-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 mb-2">
                            <Mic className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            {podcast.idea}
                        </h1>
                        <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed mb-8">
                            {podcast.description}
                        </p>
                        
                        {/* Enhanced Stats Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-6 p-6 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 max-w-3xl mx-auto">
                            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">{formatDate(podcast.createdAt).split(',')[0]}</p>
                                    <p className="text-xs text-muted-foreground">Created</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border hidden sm:block"></div>
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">{getWordCount(podcast.podcastTextContent)}</p>
                                    <p className="text-xs text-muted-foreground">Words</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-border hidden sm:block"></div>
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-semibold">{getEstimatedDuration(podcast.podcastTextContent)}</p>
                                    <p className="text-xs text-muted-foreground">Duration</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={shareCurrentUrl}
                                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Podcast
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => copyToClipboard(podcast.podcastTextContent)}
                                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Transcript
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Language Selection */}
                <Card className="mb-8 border-0 shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                                <Headphones className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Available Languages</CardTitle>
                                <CardDescription className="text-base">
                                    Choose your preferred language for audio playback
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {availableLanguages.map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant={selectedLanguage === lang.code ? "default" : "outline"}
                                    onClick={() => setSelectedLanguage(lang.code)}
                                    className={`justify-start h-auto p-4 transition-all duration-200 ${
                                        selectedLanguage === lang.code 
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg" 
                                            : "bg-white/50 dark:bg-gray-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200/50 dark:border-purple-800/50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{lang.flag}</span>
                                        <div className="text-left">
                                            <p className="font-semibold">{lang.label}</p>
                                            <p className="text-xs opacity-75">Audio available</p>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Enhanced Audio Player */}
                {availableLanguages.map((lang) => {
                    const audioUrl = podcast.urls[lang.code as keyof typeof podcast.urls];
                    if (!audioUrl || lang.code !== selectedLanguage) return null;
                    
                    return (
                        <Card key={lang.code} className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white/80 to-purple-50/50 dark:from-gray-900/80 dark:to-purple-950/30 backdrop-blur-sm overflow-hidden">
                            {/* Gradient Border Effect */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500"></div>
                            
                            <CardHeader className="pb-6 relative">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
                                        <Volume2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <span className="text-2xl">{lang.flag}</span>
                                            {lang.label} Audio Player
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            High-quality AI-generated podcast audio
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-3">
                                        <Button
                                            size="lg"
                                            onClick={() => playPauseAudio(lang.code)}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 h-14 px-8"
                                        >
                                            {isPlaying[lang.code] ? (
                                                <Pause className="h-5 w-5 mr-3" />
                                            ) : (
                                                <Play className="h-5 w-5 mr-3" />
                                            )}
                                            <span className="text-lg font-semibold">
                                                {isPlaying[lang.code] ? 'Pause' : 'Play'}
                                            </span>
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={() => downloadAudio(lang.code)}
                                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 h-14 px-6"
                                        >
                                            <Download className="h-5 w-5 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                    
                                    <div className="flex-1 text-right">
                                        {currentTime[lang.code] && duration[lang.code] && (
                                            <div className="text-sm text-muted-foreground bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-200/30 dark:border-purple-800/30">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-mono">
                                                        {formatTime(currentTime[lang.code])} / {formatTime(duration[lang.code])}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Enhanced Audio Player */}
                                <div className="relative">
                                    <audio
                                        ref={setAudioRef(lang.code)}
                                        src={audioUrl}
                                        onPlay={() => setIsPlaying(prev => ({ ...prev, [lang.code]: true }))}
                                        onPause={() => setIsPlaying(prev => ({ ...prev, [lang.code]: false }))}
                                        onEnded={() => setIsPlaying(prev => ({ ...prev, [lang.code]: false }))}
                                        onTimeUpdate={(e) => {
                                            const audio = e.target as HTMLAudioElement;
                                            setCurrentTime(prev => ({ ...prev, [lang.code]: audio.currentTime }));
                                        }}
                                        onLoadedMetadata={(e) => {
                                            const audio = e.target as HTMLAudioElement;
                                            setDuration(prev => ({ ...prev, [lang.code]: audio.duration }));
                                        }}
                                        controls
                                        className="w-full h-12 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(147,51,234,0.1) 100%)'
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {/* Enhanced Content Section */}
                <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm">
                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">Podcast Transcript</CardTitle>
                                <CardDescription className="text-base">
                                    Complete written content of the podcast episode
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent>
                        <div className="prose prose-gray max-w-none">
                            <div className="relative p-8 bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-gray-800/80 dark:to-purple-950/20 rounded-2xl border border-purple-200/30 dark:border-purple-800/30 backdrop-blur-sm">
                                {/* Decorative Quote Mark */}
                                <div className="absolute top-4 left-4 text-purple-300 dark:text-purple-700 text-6xl font-serif leading-none">&ldquo;</div>
                                
                                <div className="relative z-10 whitespace-pre-wrap leading-relaxed text-lg text-gray-800 dark:text-gray-200 pl-8">
                                    {podcast.podcastTextContent}
                                </div>
                                
                                {/* Decorative Quote Mark */}
                                <div className="absolute bottom-4 right-4 text-purple-300 dark:text-purple-700 text-6xl font-serif leading-none">&rdquo;</div>
                            </div>
                        </div>
                        
                        <Separator className="my-8 bg-gradient-to-r from-transparent via-purple-300 to-transparent dark:via-purple-700" />
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-purple-200/50 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 px-3 py-1">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {getWordCount(podcast.podcastTextContent)} words
                                </Badge>
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-blue-200/50 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 px-3 py-1">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {getEstimatedDuration(podcast.podcastTextContent)} estimated
                                </Badge>
                                <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 border-green-200/50 dark:border-green-800/50 text-green-700 dark:text-green-300 px-3 py-1">
                                    <Headphones className="h-3 w-3 mr-1" />
                                    {availableLanguages.length} language{availableLanguages.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                            
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => copyToClipboard(podcast.podcastTextContent)}
                                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-purple-200/50 dark:border-purple-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 px-6"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Full Transcript
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
