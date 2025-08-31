"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  FileText,
  Headphones,
  Clock,
  Volume2,
  Copy,
  CheckCircle,
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
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="mb-6">
                    <Skeleton className="h-6 w-24 mb-4" />
                    <Skeleton className="h-10 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-full" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-32 w-full mb-4" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!podcast) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="text-center py-16">
                    <Music className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
                    <h3 className="text-2xl font-semibold mb-4">Podcast not found</h3>
                    <p className="text-muted-foreground mb-6">
                        The podcast you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/podcasts">
                        <Button>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Podcasts
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const availableLanguages = getAvailableLanguages(podcast);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto p-6 max-w-4xl">
            {/* Navigation */}
            <div className="mb-6">
                <Link href="/podcasts" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Podcasts
                </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {podcast.description}
                        </h1>
                        <p className="text-muted-foreground text-lg mb-4">
                            {podcast.idea}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(podcast.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>{getWordCount(podcast.podcastTextContent)} words</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{getEstimatedDuration(podcast.podcastTextContent)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={shareCurrentUrl}
                            className="hover:bg-purple-50"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(podcast.podcastTextContent)}
                            className="hover:bg-purple-50"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Language Selection */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Headphones className="h-5 w-5" />
                        Available Languages
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableLanguages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant={selectedLanguage === lang.code ? "default" : "outline"}
                                onClick={() => setSelectedLanguage(lang.code)}
                                className="justify-start h-auto p-3"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Audio Player */}
            {availableLanguages.map((lang) => {
                const audioUrl = podcast.urls[lang.code as keyof typeof podcast.urls];
                if (!audioUrl || lang.code !== selectedLanguage) return null;
                
                return (
                    <Card key={lang.code} className="mb-6 border-l-4 border-l-purple-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Volume2 className="h-5 w-5" />
                                {lang.flag} {lang.label} Audio
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        size="lg"
                                        onClick={() => playPauseAudio(lang.code)}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    >
                                        {isPlaying[lang.code] ? (
                                            <Pause className="h-5 w-5 mr-2" />
                                        ) : (
                                            <Play className="h-5 w-5 mr-2" />
                                        )}
                                        {isPlaying[lang.code] ? 'Pause' : 'Play'}
                                    </Button>
                                    
                                    <Button
                                        variant="outline"
                                        onClick={() => downloadAudio(lang.code)}
                                        className="hover:bg-purple-50"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    
                                    <div className="flex-1 text-sm text-muted-foreground">
                                        {currentTime[lang.code] && duration[lang.code] && (
                                            <span>
                                                {formatTime(currentTime[lang.code])} / {formatTime(duration[lang.code])}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
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
                                    className="w-full"
                                />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Podcast Transcript
                    </CardTitle>
                    <CardDescription>
                        Full text content of the podcast
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-gray max-w-none">
                        <div className="p-6 bg-muted/30 rounded-lg border whitespace-pre-wrap leading-relaxed">
                            {podcast.podcastTextContent}
                        </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">{getWordCount(podcast.podcastTextContent)} words</Badge>
                            <Badge variant="outline">{getEstimatedDuration(podcast.podcastTextContent)} estimated</Badge>
                            <Badge variant="outline">{availableLanguages.length} language{availableLanguages.length !== 1 ? 's' : ''}</Badge>
                        </div>
                        
                        <Button
                            variant="outline"
                            onClick={() => copyToClipboard(podcast.podcastTextContent)}
                            className="hover:bg-purple-50"
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Transcript
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </div>
        </div>
    );
}
