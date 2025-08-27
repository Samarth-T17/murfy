"use client";

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import {
    Sparkles,
    Copy,
    Trash2,
    Save,
    Wand2,
    FileText,
    Zap,
    CheckCircle,
    AlertCircle,
    Info,
    Mic,
    Volume2,
    Users,
    Plus,
    X,
    UserPlus,
    Play,
    Pause,
    Download,
    Headphones
} from 'lucide-react'
import { generateContentFromIdea } from '@/gemini/content'
import type { PodcastContent } from '@/gemini/content'

const themes = [
    {
        value: 'casual',
        label: 'Casual & Friendly',
        description: 'Conversational and approachable tone',
        icon: Users,
        color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
        value: 'professional',
        label: 'Professional',
        description: 'Formal and business-oriented',
        icon: FileText,
        color: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    {
        value: 'educational',
        label: 'Educational',
        description: 'Informative and teaching-focused',
        icon: Info,
        color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
        value: 'entertaining',
        label: 'Entertaining',
        description: 'Engaging and fun approach',
        icon: Zap,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
        value: 'storytelling',
        label: 'Storytelling',
        description: 'Narrative-driven content',
        icon: Volume2,
        color: 'bg-orange-100 text-orange-800 border-orange-200'
    },
    {
        value: 'interview',
        label: 'Interview Style',
        description: 'Question and answer format',
        icon: Mic,
        color: 'bg-red-100 text-red-800 border-red-200'
    },
    {
        value: 'news',
        label: 'News/Current Events',
        description: 'Journalistic and factual',
        icon: AlertCircle,
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
        value: 'motivational',
        label: 'Motivational',
        description: 'Inspiring and uplifting',
        icon: CheckCircle,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
];

const voiceOptions = [
    {
        name: "Natalie",
        voice_id: "en-US-natalie",
        style: "Conversational"
    },
    {
        name: "Ken",
        voice_id: "en-US-ken",
        style: "Conversational"
    },
    {
        name: "Sarah",
        voice_id: "en-US-sarah",
        style: "Conversational"
    },
    {
        name: "Marcus",
        voice_id: "en-US-marcus",
        style: "Conversational"
    },
    {
        name: "Emma",
        voice_id: "en-US-emma",
        style: "Conversational"
    }
]

const Page = () => {
    const [podcastIdea, setPodcastIdea] = useState<string>('');
    const [speakerNames, setSpeakerNames] = useState<string[]>([]);
    const [selectedVoiceForNewSpeaker, setSelectedVoiceForNewSpeaker] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<PodcastContent>({
        title: '',
        description: '',
        content: '',
        names: []
    });

    const [editedContent, setEditedContent] = useState<PodcastContent>({
        title: '',
        description: '',
        content: '',
        names: []
    });

    const [selectedTheme, setSelectedTheme] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [activeTab, setActiveTab] = useState('generated');
    const [editingContent, setEditingContent] = useState(false);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string>('');
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [wordCounts, setWordCounts] = useState({
        generatedTitle: 0,
        generatedDescription: 0,
        generatedContent: 0,
        editedTitle: 0,
        editedDescription: 0,
        editedContent: 0
    });

    const SPEAKER_MAX_LIMIT = 5;

    // Update word counts when content changes
    React.useEffect(() => {
        const counts = {
            generatedTitle: generatedContent.title.trim().split(/\s+/).filter(word => word.length > 0).length,
            generatedDescription: generatedContent.description.trim().split(/\s+/).filter(word => word.length > 0).length,
            generatedContent: generatedContent.content.trim().split(/\s+/).filter(word => word.length > 0).length,
            editedTitle: editedContent.title.trim().split(/\s+/).filter(word => word.length > 0).length,
            editedDescription: editedContent.description.trim().split(/\s+/).filter(word => word.length > 0).length,
            editedContent: editedContent.content.trim().split(/\s+/).filter(word => word.length > 0).length,
        };
        setWordCounts(counts);
    }, [generatedContent, editedContent]);

    // Helper functions for managing speaker voices
    const addSpeakerVoice = () => {
        if (selectedVoiceForNewSpeaker && !speakerNames.includes(selectedVoiceForNewSpeaker) && speakerNames.length < SPEAKER_MAX_LIMIT) {
            const selectedVoice = voiceOptions.find(voice => voice.voice_id === selectedVoiceForNewSpeaker);
            setSpeakerNames([...speakerNames, selectedVoice?.name || selectedVoiceForNewSpeaker]);
            setSelectedVoiceForNewSpeaker('');
            toast.success(`Added ${selectedVoice?.name} as a speaker`, {
                description: `You now have ${speakerNames.length + 1} speaker${speakerNames.length + 1 > 1 ? 's' : ''}`,
            });
        } else if (speakerNames.includes(selectedVoiceForNewSpeaker)) {
            toast.error('This voice is already selected');
        } else if (speakerNames.length >= SPEAKER_MAX_LIMIT) {
            toast.error(`Maximum ${SPEAKER_MAX_LIMIT} speakers allowed`);
        } else {
            toast.error('Please select a voice');
        }
    };

    const removeSpeakerName = (nameToRemove: string) => {
        if (speakerNames.length <= 1) {
            toast.error('At least one speaker is required');
            return;
        }
        setSpeakerNames(speakerNames.filter(name => name !== nameToRemove));
        toast.success(`Removed ${nameToRemove} from speakers`);
    };

    const resetSpeakerNames = () => {
        setSpeakerNames([]);
        setSelectedVoiceForNewSpeaker('');
        toast.info('Reset speakers');
    };

    // Get available voices that haven't been selected yet
    const getAvailableVoices = () => {
        return voiceOptions.filter(voice => !speakerNames.includes(voice.name));
    };

    // Audio generation functions
    const generateAudio = async (content: PodcastContent) => {
        if (!content.content.trim()) {
            toast.error('No content available to generate audio');
            return;
        }

        if (speakerNames.length === 0) {
            toast.error('No speakers available for audio generation');
            return;
        }

        // Map speaker names to their corresponding voice IDs
        const voices = speakerNames.map(speakerName => {
            const voice = voiceOptions.find(v => v.name === speakerName);
            return voice ? voice.voice_id : voiceOptions[0].voice_id; // fallback to first voice
        });

        setIsGeneratingAudio(true);
        toast.info('Generating podcast audio... This may take a few minutes.');

        try {
            const response = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content.content,
                    names: speakerNames,
                    speakers: voices
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate audio');
            }

            // Convert base64 to blob and create URL
            const audioBlob = new Blob([Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))], {
                type: data.mimeType
            });
            const audioUrl = URL.createObjectURL(audioBlob);

            setGeneratedAudioUrl(audioUrl);
            toast.success('🎵 Audio generated successfully!', {
                description: 'Your podcast is ready to listen to',
                duration: 4000,
            });

        } catch (error) {
            console.error('Audio generation error:', error);
            toast.error('Failed to generate audio', {
                description: error instanceof Error ? error.message : 'Unknown error occurred',
            });
        } finally {
            setIsGeneratingAudio(false);
        }
    };

    const playPauseAudio = () => {
        if (!audioRef) return;

        if (isPlayingAudio) {
            audioRef.pause();
            setIsPlayingAudio(false);
        } else {
            audioRef.play();
            setIsPlayingAudio(true);
        }
    };

    const downloadAudio = () => {
        if (!generatedAudioUrl) return;

        const link = document.createElement('a');
        link.href = generatedAudioUrl;
        link.download = `podcast-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('Audio download started!');
    };

    // Clean up audio URL when component unmounts
    React.useEffect(() => {
        return () => {
            if (generatedAudioUrl) {
                URL.revokeObjectURL(generatedAudioUrl);
            }
        };
    }, [generatedAudioUrl]);

    const handleEditedContentChange = (field: keyof PodcastContent, value: string) => {
        setEditedContent(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generatePodcastContent = async () => {
        if (!selectedTheme) {
            toast.error('Please select a theme first');
            return;
        }

        if (!podcastIdea.trim()) {
            toast.error('Please enter your podcast idea first');
            return;
        }

        if (speakerNames.length === 0) {
            toast.error('Please add at least one speaker');
            return;
        }

        setIsGenerating(true);
        toast.info('Generating podcast content from your idea...');

        try {
            // Use the Gemini service to generate content from idea with dynamic speaker names
            const generatedPodcast = await generateContentFromIdea(podcastIdea, selectedTheme, speakerNames);

            setGeneratedContent(generatedPodcast);
            setEditedContent(generatedPodcast); // Initialize edited content with generated content
            setHasGenerated(true);
            setActiveTab('generated');
            toast.success('Podcast content generated successfully! 🎉');
        } catch (error) {
            console.error('Generation error:', error);
            toast.error('Failed to generate podcast content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = (content: PodcastContent) => {
        const fullContent = `📻 PODCAST CONTENT\n\n` +
            `🎯 Title: ${content.title}\n\n` +
            `📝 Description:\n${content.description}\n\n` +
            `📜 Content:\n${content.content}\n\n` +
            `---\nGenerated with Murphy Podcast Creator`;

        navigator.clipboard.writeText(fullContent).then(() => {
            toast.success('Content copied to clipboard! 📋', {
                description: 'Ready to paste into your favorite editor',
                duration: 3000,
            });
        }).catch(() => {
            toast.error('Failed to copy content to clipboard');
        });
    };

    const discardContent = (type: 'generated' | 'edited') => {
        if (type === 'generated') {
            setGeneratedContent({ title: '', description: '', content: '', names: [] });
            setEditedContent({ title: '', description: '', content: '', names: [] });
            setHasGenerated(false);
            setPodcastIdea('');
            toast.success('Generated content discarded');
        } else {
            setEditedContent({ ...generatedContent }); // Reset to original generated content
            toast.success('Edited content reset to original');
        }
    };

    const finalizeContent = async (content: PodcastContent, type: 'generated' | 'edited') => {
        // Here you would save the finalized content to your backend
        const contentType = type === 'generated' ? 'AI-Generated' : 'Edited';
        const themeLabel = themes.find(t => t.value === selectedTheme)?.label || 'None';

        toast.success(
            `🎉 ${contentType} content finalized and saved! (${themeLabel} theme)`,
            {
                description: `Title: "${content.title.slice(0, 50)}${content.title.length > 50 ? '...' : ''}"`,
                duration: 4000,
            }
        );

        // Generate audio automatically after finalizing
        if (speakerNames.length > 0) {
            await generateAudio(content);
        }

        // Optional: Reset state or redirect user
        console.log('Finalized content:', {
            type,
            theme: selectedTheme,
            originalIdea: podcastIdea,
            wordCount: {
                title: content.title.trim().split(/\s+/).filter(word => word.length > 0).length,
                description: content.description.trim().split(/\s+/).filter(word => word.length > 0).length,
                content: content.content.trim().split(/\s+/).filter(word => word.length > 0).length,
            },
            content
        });
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                        <Mic className="h-6 w-6" />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Create Podcast Content
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {"Simply share your podcast idea and let AI create professional, engaging content tailored to your chosen theme. "}
                    {"Generate complete episodes with titles, descriptions, and full scripts in seconds."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Idea Input & Theme Selection */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5" />
                                AI Content Generation
                            </CardTitle>
                            <CardDescription>
                                Enter your podcast idea, choose speakers, and select a theme to generate complete content
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className='mb-3' htmlFor="podcast-idea">Podcast Idea</Label>
                                <Textarea
                                    id="podcast-idea"
                                    placeholder="Describe your podcast idea... (e.g., 'The impact of artificial intelligence on modern education')"
                                    value={podcastIdea}
                                    onChange={(e) => setPodcastIdea(e.target.value)}
                                    rows={16}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-400 resize-none min-h-42"
                                />
                                <div className="text-xs text-muted-foreground mt-1">
                                    {podcastIdea.trim().split(/\s+/).filter(word => word.length > 0).length} words
                                </div>
                            </div>
                            <div>
                                <Label className="mb-3" htmlFor="theme-select">Select Theme</Label>
                                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                                    <SelectTrigger className='w-full p-3'>
                                        <SelectValue placeholder="Choose a theme..." />
                                    </SelectTrigger>
                                    <SelectContent className='w-full'>
                                        {themes.map((theme) => (
                                            <SelectItem key={theme.value} value={theme.value}>
                                                <div className="flex items-center gap-3">
                                                    <theme.icon className="h-4 w-4" />
                                                    <div className='flex items-center justify-center gap-2'>
                                                        <div className="font-medium text-sm">{theme.label}</div>
                                                        <div className="text-xs text-muted-foreground">{theme.description}</div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Speaker Names Section */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <Label htmlFor="speaker-names">Podcast Speakers</Label>
                                    <Badge variant="outline" className="text-xs">
                                        {speakerNames.length}/{SPEAKER_MAX_LIMIT} speakers
                                    </Badge>
                                </div>

                                {/* Current Speakers */}
                                <div className="space-y-2 mb-3">
                                    {speakerNames.map((name, index) => {
                                        const voice = voiceOptions.find(v => v.name === name);
                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-full bg-primary/10">
                                                        <Users className="h-3 w-3 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-sm">{name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Speaker {index + 1}
                                                    </Badge>
                                                    {voice && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {voice.style}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {speakerNames.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSpeakerName(name)}
                                                        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Add New Speaker */}
                                {speakerNames.length < SPEAKER_MAX_LIMIT && getAvailableVoices().length > 0 && (
                                    <div className="flex gap-2">
                                        <Select value={selectedVoiceForNewSpeaker} onValueChange={setSelectedVoiceForNewSpeaker}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select a voice..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableVoices().map((voice) => (
                                                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-3 w-3" />
                                                            <span className="font-medium">{voice.name}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {voice.style}
                                                            </Badge>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        onClick={addSpeakerVoice}
                                                        disabled={!selectedVoiceForNewSpeaker}
                                                        size="sm"
                                                        className="shrink-0"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Add speaker (max {SPEAKER_MAX_LIMIT})</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}

                                {/* Show message when all voices are used */}
                                {speakerNames.length < SPEAKER_MAX_LIMIT && getAvailableVoices().length === 0 && (
                                    <div className="text-xs text-muted-foreground p-2 bg-amber-50 rounded border-l-2 border-amber-200">
                                        <Info className="h-3 w-3 inline mr-1" />
                                        All available voices have been selected. Remove a speaker to add a different voice.
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetSpeakerNames}
                                        className="text-xs"
                                    >
                                        <UserPlus className="h-3 w-3 mr-1" />
                                        Reset Speakers
                                    </Button>
                                </div>

                                <div className="text-xs text-muted-foreground mt-2 p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                                    <Info className="h-3 w-3 inline mr-1" />
                                    Select from {voiceOptions.length} available AI voices. Speakers will be used in the generated podcast dialogue. Maximum {SPEAKER_MAX_LIMIT} speakers allowed.
                                </div>
                            </div>

                            {selectedTheme && (
                                <div className="p-4 bg-gradient-to-r from-muted/50 to-muted rounded-lg border-l-4 border-primary">
                                    <div className="flex items-center gap-2 mb-2">
                                        {React.createElement(themes.find(t => t.value === selectedTheme)?.icon || Info, {
                                            className: "h-4 w-4"
                                        })}
                                        <Badge variant="outline" className={themes.find(t => t.value === selectedTheme)?.color}>
                                            {themes.find(t => t.value === selectedTheme)?.label}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {themes.find(t => t.value === selectedTheme)?.description}
                                    </p>
                                </div>
                            )}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={generatePodcastContent}
                                            disabled={isGenerating || !selectedTheme || !podcastIdea.trim() || speakerNames.length === 0}
                                            className="w-full relative overflow-hidden group"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                                                    Generate Podcast Content
                                                </>
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Enter your podcast idea, select a theme, and add speakers to generate complete content</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            {/* Progress indicator when generating */}
                            {isGenerating && (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground text-center">
                                        AI is enhancing your content...
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            )}

                            {/* API Key Notice */}
                            {!process.env.NEXT_PUBLIC_GEMINI_API_KEY && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        No Gemini API key configured. Using mock enhancement for demonstration.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Content Display */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Podcast Content</CardTitle>
                            <CardDescription>
                                AI-generated podcast content based on your idea and theme
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="generated">AI Generated</TabsTrigger>
                                    <TabsTrigger value="edited" disabled={!hasGenerated}>
                                        Edited Version {hasGenerated && <Badge className="ml-2" variant="secondary">Ready</Badge>}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="generated" className="space-y-4">
                                    {hasGenerated ? (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                        <Badge variant="outline" className={themes.find(t => t.value === selectedTheme)?.color}>
                                                            Generated with {themes.find(t => t.value === selectedTheme)?.label} theme
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {speakerNames.length} speaker{speakerNames.length > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                {speakerNames.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {speakerNames.map((name, index) => (
                                                            <Badge key={index} variant="secondary" className="text-xs">
                                                                {name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="generated-title">Generated Title</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.generatedTitle} words
                                                    </Badge>
                                                </div>
                                                <Input
                                                    id="generated-title"
                                                    value={generatedContent.title}
                                                    readOnly
                                                    className="bg-muted/50"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="generated-description">Generated Description</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.generatedDescription} words
                                                    </Badge>
                                                </div>
                                                <Textarea
                                                    id="generated-description"
                                                    value={generatedContent.description}
                                                    readOnly
                                                    rows={3}
                                                    className="bg-muted/50 resize-none"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="generated-content">Generated Content</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.generatedContent} words
                                                    </Badge>
                                                </div>
                                                <Textarea
                                                    id="generated-content"
                                                    value={generatedContent.content}
                                                    readOnly
                                                    rows={12}
                                                    className="bg-muted/50 resize-none"
                                                />
                                            </div>

                                            {/* Audio Player Section */}
                                            {(generatedAudioUrl || isGeneratingAudio) && (
                                                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Headphones className="h-4 w-4 text-purple-600" />
                                                            <span className="font-medium text-purple-800">Generated Audio</span>
                                                            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                                                                MP3
                                                            </Badge>
                                                        </div>
                                                        {!isGeneratingAudio && generatedAudioUrl && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={downloadAudio}
                                                                className="hover:bg-purple-100"
                                                            >
                                                                <Download className="h-3 w-3 mr-1" />
                                                                Download
                                                            </Button>
                                                        )}
                                                    </div>

                                                    {isGeneratingAudio ? (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />
                                                                <span className="text-sm text-purple-700">Generating audio...</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Skeleton className="h-2 w-full" />
                                                                <Skeleton className="h-2 w-3/4" />
                                                            </div>
                                                            <p className="text-xs text-purple-600">This may take a few minutes depending on content length</p>
                                                        </div>
                                                    ) : generatedAudioUrl ? (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={playPauseAudio}
                                                                    className="shrink-0"
                                                                >
                                                                    {isPlayingAudio ? (
                                                                        <Pause className="h-4 w-4" />
                                                                    ) : (
                                                                        <Play className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <div className="flex-1">
                                                                    <audio
                                                                        ref={setAudioRef}
                                                                        src={generatedAudioUrl}
                                                                        onPlay={() => setIsPlayingAudio(true)}
                                                                        onPause={() => setIsPlayingAudio(false)}
                                                                        onEnded={() => setIsPlayingAudio(false)}
                                                                        controls
                                                                        className="w-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {speakerNames.map((name, index) => (
                                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                                        {name}: {voiceOptions[index % voiceOptions.length].name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}

                                            <div className="flex justify-between pt-4 border-t">
                                                <div className="flex gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => copyToClipboard(generatedContent)}
                                                                    className="group"
                                                                >
                                                                    <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Copy
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Copy generated content to clipboard</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => generateAudio(generatedContent)}
                                                                    disabled={isGeneratingAudio}
                                                                    className="group hover:bg-blue-50"
                                                                >
                                                                    <Volume2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Generate Audio
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Generate audio from this content</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => discardContent('generated')}
                                                                    className="group hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Discard
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Discard all generated content</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <Button
                                                    onClick={() => finalizeContent(generatedContent, 'generated')}
                                                    className="group"
                                                >
                                                    <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Finalize Generated
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <div className="max-w-md mx-auto">
                                                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                <h3 className="text-lg font-medium mb-2">No content generated yet</h3>
                                                <p className="text-sm mb-4">Enter your podcast idea, add speakers, and select a theme to generate complete podcast content.</p>

                                                {(!podcastIdea.trim() || !selectedTheme || speakerNames.length === 0) && (
                                                    <Alert className="mt-4">
                                                        <Info className="h-4 w-4" />
                                                        <AlertDescription>
                                                            {!podcastIdea.trim()
                                                                ? 'Enter your podcast idea first.'
                                                                : !selectedTheme
                                                                    ? 'Select a theme to get started.'
                                                                    : 'Add at least one speaker to generate content.'
                                                            }
                                                        </AlertDescription>
                                                    </Alert>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="edited" className="space-y-4">
                                    {hasGenerated ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-orange-600" />
                                                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                                        Editable Version
                                                    </Badge>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        <Users className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-xs text-muted-foreground">
                                                            {speakerNames.length} speaker{speakerNames.length > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingContent(!editingContent)}
                                                    className="hover:bg-white/60"
                                                >
                                                    {editingContent ? 'Stop Editing' : 'Enable Editing'}
                                                </Button>
                                            </div>

                                            {speakerNames.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {speakerNames.map((name, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="edited-title">Edited Title</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.editedTitle} words
                                                    </Badge>
                                                </div>
                                                <Input
                                                    id="edited-title"
                                                    value={editedContent.title}
                                                    onChange={(e) => handleEditedContentChange('title', e.target.value)}
                                                    disabled={!editingContent}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="edited-description">Edited Description</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.editedDescription} words
                                                    </Badge>
                                                </div>
                                                <Textarea
                                                    id="edited-description"
                                                    value={editedContent.description}
                                                    onChange={(e) => handleEditedContentChange('description', e.target.value)}
                                                    rows={3}
                                                    disabled={!editingContent}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <Label htmlFor="edited-content">Edited Content</Label>
                                                    <Badge variant="outline" className="text-xs">
                                                        {wordCounts.editedContent} words
                                                    </Badge>
                                                </div>
                                                <Textarea
                                                    id="edited-content"
                                                    value={editedContent.content}
                                                    onChange={(e) => handleEditedContentChange('content', e.target.value)}
                                                    rows={12}
                                                    disabled={!editingContent}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                                                />
                                            </div>

                                            {/* Audio Player Section for Edited Content */}
                                            {(generatedAudioUrl || isGeneratingAudio) && (
                                                <div className="p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Headphones className="h-4 w-4 text-orange-600" />
                                                            <span className="font-medium text-orange-800">Generated Audio</span>
                                                            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                                                MP3
                                                            </Badge>
                                                        </div>
                                                        {!isGeneratingAudio && generatedAudioUrl && (
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => generateAudio(editedContent)}
                                                                    disabled={isGeneratingAudio}
                                                                    className="hover:bg-orange-100"
                                                                >
                                                                    <Volume2 className="h-3 w-3 mr-1" />
                                                                    Regenerate
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={downloadAudio}
                                                                    className="hover:bg-orange-100"
                                                                >
                                                                    <Download className="h-3 w-3 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {isGeneratingAudio ? (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600" />
                                                                <span className="text-sm text-orange-700">Generating audio from edited content...</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Skeleton className="h-2 w-full" />
                                                                <Skeleton className="h-2 w-3/4" />
                                                            </div>
                                                            <p className="text-xs text-orange-600">This may take a few minutes depending on content length</p>
                                                        </div>
                                                    ) : generatedAudioUrl ? (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={playPauseAudio}
                                                                    className="shrink-0"
                                                                >
                                                                    {isPlayingAudio ? (
                                                                        <Pause className="h-4 w-4" />
                                                                    ) : (
                                                                        <Play className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                <div className="flex-1">
                                                                    <audio
                                                                        ref={setAudioRef}
                                                                        src={generatedAudioUrl}
                                                                        onPlay={() => setIsPlayingAudio(true)}
                                                                        onPause={() => setIsPlayingAudio(false)}
                                                                        onEnded={() => setIsPlayingAudio(false)}
                                                                        controls
                                                                        className="w-full"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {speakerNames.map((name, index) => (
                                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                                        {name}: {voiceOptions[index % voiceOptions.length].name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}

                                            <div className="flex justify-between pt-4 border-t">
                                                <div className="flex gap-2">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => copyToClipboard(editedContent)}
                                                                    className="group"
                                                                >
                                                                    <Copy className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Copy
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Copy edited content to clipboard</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => generateAudio(editedContent)}
                                                                    disabled={isGeneratingAudio}
                                                                    className="group hover:bg-orange-50"
                                                                >
                                                                    <Volume2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Generate Audio
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Generate audio from edited content</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() => discardContent('edited')}
                                                                    className="group hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                                    Reset
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Reset to original generated content</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <Button
                                                    onClick={() => finalizeContent(editedContent, 'edited')}
                                                    className="group bg-gradient-to-r bg-black"
                                                >
                                                    <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                                    Finalize Edited
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <div className="max-w-md mx-auto">
                                                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                                <h3 className="text-lg font-medium mb-2">No content to edit yet</h3>
                                                <p className="text-sm mb-4">Generate content first to enable editing capabilities.</p>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Page