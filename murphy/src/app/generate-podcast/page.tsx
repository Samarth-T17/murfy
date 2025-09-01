"use client";

import React, { useState, useRef } from 'react'
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
    Headphones,
} from 'lucide-react'
import voicesData from '@/lib/voices'
import { generateContentFromIdea } from '@/gemini/content'
import type { PodcastContent } from '@/gemini/content'
import { langVoiceMap } from '@/lib/langVoiceType'
import Navigation from '@/components/Navigation';

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
const langToVoiceOptions: { [lang: string]: VoiceOption[] } = {
    english: voicesData.englishVoiceOptions,
    hindi: voicesData.hindiVoiceOptions,
    bengali: voicesData.bengaliVoiceOptions,
    french: voicesData.frenchVoiceOptions,
    german: voicesData.germanVoiceOptions,
    italian: voicesData.italianVoiceOptions,
    tamil: voicesData.tamilVoiceOptions,
};
const supportedLanguages = [
    { code: "english", label: "English" },
    { code: "hindi", label: "Hindi" },
    { code: "bengali", label: "Bengali" },
    { code: "french", label: "French" },
    { code: "german", label: "German" },
    { code: "italian", label: "Italian" },
    { code: "tamil", label: "Tamil" }
];

// Combine all voice options into one array for the current implementation
const voiceOptions = [
    ...voicesData.englishVoiceOptions,
    ...voicesData.hindiVoiceOptions,
    ...voicesData.bengaliVoiceOptions,
    ...voicesData.frenchVoiceOptions,
    ...voicesData.germanVoiceOptions,
    ...voicesData.italianVoiceOptions,
    ...voicesData.tamilVoiceOptions
];


type VoiceOption = {
    name: string;
    voice_id: string;
};
const CHARACTER_MAX = 10;
const Page = () => {
    const [podcastIdea, setPodcastIdea] = useState<string>('');
    const [speakerNamesByLang, setSpeakerNamesByLang] = useState<{ [lang: string]: string[] }>({ english: [] });
    const [selectedLang, setSelectedLang] = useState<string>("english");
    const [selectedVoiceForNewSpeakerByLang, setSelectedVoiceForNewSpeakerByLang] = useState<{ [lang: string]: string }>({});
    const [audioFiles, setAudioFiles] = useState<{ [lang: string]: { url: string, fileName: string } }>({});
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
    const [characterNames, setCharacterNames] = useState<string[]>([""]);
    const [selectedAudioLang, setSelectedAudioLang] = useState<string>("english");
    const [characterSpeakerMap, setCharacterSpeakerMap] = useState<{ [lang: string]: { [idx: number]: string } }>({});

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
    const [wordCounts, setWordCounts] = useState({
        generatedTitle: 0,
        generatedDescription: 0,
        generatedContent: 0,
        editedTitle: 0,
        editedDescription: 0,
        editedContent: 0
    });
    const audioRefs = useRef<{ [lang: string]: HTMLAudioElement | null }>({})
    const [isPlayingAudio, setIsPlayingAudio] = useState<{ [lang: string]: boolean }>({})

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
    const handleCharacterNameChange = (idx: number, value: string) => {
        setCharacterNames(prev => {
            const arr = [...prev];
            arr[idx] = value;
            return arr;
        });
    };
    const addCharacter = () => {
        if (characterNames.length < CHARACTER_MAX) setCharacterNames(prev => [...prev, ""]);
    };
    const removeCharacter = (idx: number) => {
        setCharacterNames(prev => prev.filter((_, i) => i !== idx));
        setCharacterSpeakerMap(prev => {
            const newMap: typeof prev = {};
            for (const lang in prev) {
                newMap[lang] = {};
                for (const i in prev[lang]) {
                    if (Number(i) < idx) newMap[lang][i] = prev[lang][i];
                    if (Number(i) > idx) newMap[lang][Number(i) - 1] = prev[lang][i];
                }
            }
            return newMap;
        });
    };

    // Speaker selection per character per language
    const handleSpeakerSelect = (lang: string, idx: number, voiceId: string) => {
        setCharacterSpeakerMap(prev => ({
            ...prev,
            [lang]: { ...(prev[lang] || {}), [idx]: voiceId }
        }));
    };
    // Helper for adding speaker per language
    const addSpeakerVoice = (lang: string) => {
        const selectedVoice = selectedVoiceForNewSpeakerByLang[lang];
        const names = speakerNamesByLang[lang] || [];
        if (selectedVoice && !names.includes(selectedVoice) && names.length < SPEAKER_MAX_LIMIT) {
            const voice = voiceOptions.find((v: VoiceOption) => v.voice_id === selectedVoice);
            setSpeakerNamesByLang(prev => ({
                ...prev,
                [lang]: [...names, voice?.name || selectedVoice]
            }));
            setSelectedVoiceForNewSpeakerByLang(prev => ({ ...prev, [lang]: '' }));
            toast.success(`Added ${voice?.name} as a speaker for ${lang}`);
        } else if (names.includes(selectedVoice)) {
            toast.error('This voice is already selected');
        } else if (names.length >= SPEAKER_MAX_LIMIT) {
            toast.error(`Maximum ${SPEAKER_MAX_LIMIT} speakers allowed`);
        } else {
            toast.error('Please select a voice');
        }
    };

    const removeSpeakerName = (lang: string, nameToRemove: string) => {
        const names = speakerNamesByLang[lang] || [];
        if (names.length <= 1) {
            toast.error('At least one speaker is required');
            return;
        }
        setSpeakerNamesByLang(prev => ({
            ...prev,
            [lang]: names.filter(name => name !== nameToRemove)
        }));
        toast.success(`Removed ${nameToRemove} from ${lang} speakers`);
    };

    const resetSpeakerNames = (lang: string) => {
        setSpeakerNamesByLang(prev => ({
            ...prev,
            [lang]: []
        }));
        setSelectedVoiceForNewSpeakerByLang(prev => ({ ...prev, [lang]: '' }));
        toast.info(`Reset speakers for ${lang}`);
    };

    // Get available voices that haven't been selected yet for a language
    const getAvailableVoices = (lang: string) => {
        const options = langToVoiceOptions[lang] || [];
        return options.filter((voice: VoiceOption) => !(speakerNamesByLang[lang] || []).includes(voice.name));
    };
    const buildLangVoiceMap = () => {
        const map: Record<string, string[]> = {};
        for (const lang of Object.keys(langToVoiceOptions)) {
            map[lang] = characterNames.map((_, idx) => characterSpeakerMap[lang]?.[idx] || "");
        }
        return map;
    };

    // Generate audio using character names and langVoiceMap
    const generateAudio = async () => {
        const langVoiceMap = buildLangVoiceMap();
        // Only include languages where at least one character has a speaker
        const filteredLangVoiceMap: typeof langVoiceMap = {};
        for (const lang in langVoiceMap) {
            if (langVoiceMap[lang].some(v => v)) filteredLangVoiceMap[lang] = langVoiceMap[lang].filter(v => v);
        }
        if (Object.keys(filteredLangVoiceMap).length === 0) {
            toast.error("Please assign at least one speaker for any language.");
            return;
        }
        // Send characterNames and langVoiceMap to backend
        setIsGeneratingAudio(true);
        try {
            console.log("Generated Content: ", generatedContent.content);
            const response = await fetch('/api/generate-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: generatedContent.content,
                    names: characterNames,
                    langVoiceMap: filteredLangVoiceMap,
                    description: generatedContent.description,
                    title: generatedContent.title
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to generate audio');

            // Handle multiple audio files
            const files: { [lang: string]: { url: string, fileName: string } } = {};
            for (const lang in data.files) {
                const file = data.files[lang];
                const audioBlob = new Blob([Uint8Array.from(atob(file.audio), c => c.charCodeAt(0))], { type: file.mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                files[lang] = { url: audioUrl, fileName: file.fileName };
            }
            setAudioFiles(files);
            toast.success('Audio generated for: ' + Object.keys(files).map(l => supportedLanguages.find(sl => sl.code === l)?.label || l).join(', '));
        } catch (e) {
            toast.error("Failed to generate audio");
        } finally {
            setIsGeneratingAudio(false);
        }
    };                    
    // Audio generation functions
    // const generateAudio = async (content: PodcastContent) => {
    //     if (!content.content.trim()) {
    //         toast.error('No content available to generate audio');
    //         return;
    //     }
    //     const langsWithSpeakers = Object.keys(speakerNamesByLang).filter(
    //         lang => (speakerNamesByLang[lang]?.length ?? 0) > 0
    //     );

    //     if (langsWithSpeakers.length === 0) {
    //         toast.error('Please add at least one speaker in any language');
    //         return;
    //     }

    //     // Map speaker names to their corresponding voice IDs for each language
    //     const langVoiceMap: langVoiceMap = {};
    //     for (const lang of langsWithSpeakers) {
    //         const names = speakerNamesByLang[lang] || [];
    //         const voices = names.map(name => {
    //             const voice = (langToVoiceOptions[lang] || []).find((v: VoiceOption) => v.name === name);
    //             return voice ? voice.voice_id : (langToVoiceOptions[lang]?.[0]?.voice_id ?? "");
    //         });
    //         langVoiceMap[lang] = voices;
    //     }

    //     setIsGeneratingAudio(true);
    //     toast.info('Generating podcast audio in selected languages...');
    //     console.log("langVoiceMap ", langVoiceMap);
    //     try {
    //         const response = await fetch('/api/generate-audio', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 content: content.content,
    //                 names: speakerNamesByLang["english"], // or main lang
    //                 langVoiceMap,
    //                 description: content.description,
    //                 title: content.title
    //             }),
    //         });
    //         const data = await response.json();
    //         if (!response.ok) throw new Error(data.error || 'Failed to generate audio');

    //         // Handle multiple audio files
    //         const files: { [lang: string]: { url: string, fileName: string } } = {};
    //         for (const lang in data.files) {
    //             const file = data.files[lang];
    //             const audioBlob = new Blob([Uint8Array.from(atob(file.audio), c => c.charCodeAt(0))], { type: file.mimeType });
    //             const audioUrl = URL.createObjectURL(audioBlob);
    //             files[lang] = { url: audioUrl, fileName: file.fileName };
    //         }
    //         setAudioFiles(files);
    //         toast.success('Audio generated for: ' + Object.keys(files).map(l => supportedLanguages.find(sl => sl.code === l)?.label || l).join(', '));
    //     } catch (error) {
    //         toast.error('Failed to generate audio');
    //     } finally {
    //         setIsGeneratingAudio(false);
    //     }
    // };

    const playPauseAudio = (lang: string) => {
        const audio = audioRefs.current[lang]
        if (!audio) return

        if (isPlayingAudio[lang]) {
            audio.pause()
        } else {
            // pause other audios
            Object.keys(audioRefs.current).forEach(otherLang => {
            if (otherLang !== lang && audioRefs.current[otherLang]) {
                audioRefs.current[otherLang]?.pause()
            }
            })
            audio.play()
        }
    }


    const downloadAudio = (lang: string) => {
        const file = audioFiles[lang];
        if (!file) return;
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Audio download started!');
    };

    // Clean up audio URLs when component unmounts
    React.useEffect(() => {
        return () => {
            Object.values(audioFiles).forEach(file => {
                if (file.url) URL.revokeObjectURL(file.url);
            });
        };
    }, [audioFiles]);

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



        setIsGenerating(true);
        toast.info('Generating podcast content from your idea...');

        try {
            // Use the Gemini service to generate content from idea with dynamic speaker names
            const generatedPodcast = await generateContentFromIdea(podcastIdea, selectedTheme, characterNames);
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
        console.log("Map : ", speakerNamesByLang);

        setGeneratedContent({ ...content });
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
    <div className='w-full'>
        <Navigation />
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
                    Simply share your podcast idea and let AI create professional, engaging content tailored to your chosen theme.
                    Generate complete episodes with titles, descriptions, and full scripts in seconds.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Idea Input, Theme, Characters */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wand2 className="h-5 w-5" />
                                AI Content Generation
                            </CardTitle>
                            <CardDescription>
                                Enter your podcast idea, characters, and select a theme to generate complete content
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
                            {/* Character Settings */}
                            <div className="mb-4">
                                <Label>Characters</Label>
                                {characterNames.map((name, idx) => (
                                    <div key={idx} className="flex items-center gap-2 mb-2">
                                        <Input
                                            value={name}
                                            onChange={e => handleCharacterNameChange(idx, e.target.value)}
                                            placeholder={`Character ${idx + 1}`}
                                            className="flex-1"
                                        />
                                        {characterNames.length > 1 && (
                                            <Button size="sm" variant="ghost" onClick={() => removeCharacter(idx)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {characterNames.length < CHARACTER_MAX && (
                                    <Button size="sm" onClick={addCharacter} className="mt-2">
                                        <Plus className="h-4 w-4 mr-1" /> Add Character
                                    </Button>
                                )}
                            </div>
                            

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={generatePodcastContent}
                                            disabled={isGenerating || !selectedTheme || !podcastIdea.trim() || characterNames.filter(Boolean).length === 0}
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
                                        <p>Enter your podcast idea, select a theme, and add characters to generate complete content</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

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

                {/* Right: Tabs for Content and Audio Settings */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="generated">AI Generated</TabsTrigger>
                            <TabsTrigger value="edited" disabled={!hasGenerated}>
                                Edited Version {hasGenerated && <Badge className="ml-2" variant="secondary">Ready</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="audio">Audio Settings</TabsTrigger>
                        </TabsList>

                        {/* AI Generated Tab */}
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
                                                            {(speakerNamesByLang["english"] || []).length} speaker{(speakerNamesByLang["english"] || []).length > 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                                {(speakerNamesByLang["english"] || []).length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {(speakerNamesByLang["english"] || []).map((name, index) => (
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
                                            {Object.keys(audioFiles).length > 0 && (
                                                <div className="space-y-4">
                                                    {Object.entries(audioFiles).map(([lang, file]) => (
                                                        <div key={lang} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Headphones className="h-4 w-4" />
                                                                <span className="font-medium">{supportedLanguages.find(l => l.code === lang)?.label || lang}</span>
                                                                <Badge variant="outline">{file.fileName}</Badge>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => playPauseAudio(lang)}
                                                                    className="shrink-0"
                                                                >
                                                                    {isPlayingAudio[lang] ? (
                                                                        <Pause className="h-4 w-4" />
                                                                    ) : (
                                                                        <Play className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                                    <div className="flex-1">
                                                                        <audio
                                                                            ref={el => { audioRefs.current[lang] = el }}
                                                                            src={file.url}
                                                                            onPlay={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: true }))}
                                                                            onPause={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                                            onEnded={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                                            controls
                                                                            className="w-full"
                                                                        />
                                                                    </div>

                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => downloadAudio(lang)}
                                                                    className="hover:bg-purple-100"
                                                                >
                                                                    <Download className="h-3 w-3 mr-1" />
                                                                    Download
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
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
                                                                    onClick={() => generateAudio()}
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

                                                {(!podcastIdea.trim() || !selectedTheme || !speakerNamesByLang["english"] || speakerNamesByLang["english"].length === 0) && (
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

                        {/* Edited Version Tab */}
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
                                                            {(speakerNamesByLang["english"] || []).length} speaker{(speakerNamesByLang["english"] || []).length > 1 ? 's' : ''}
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

                                            {(speakerNamesByLang["english"] || []).length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {(speakerNamesByLang["english"] || []).map((name, index) => (
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
                                            {Object.entries(audioFiles).map(([lang, file]) => (
                                                <div key={lang} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-2">
                                                    <Headphones className="h-4 w-4" />
                                                    <span className="font-medium">{supportedLanguages.find(l => l.code === lang)?.label || lang}</span>
                                                    <Badge variant="outline">{file.fileName}</Badge>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => playPauseAudio(lang)}
                                                        className="shrink-0"
                                                    >
                                                        {isPlayingAudio[lang] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                    </Button>

                                                    <audio
                                                        ref={el => { audioRefs.current[lang] = el }}
                                                        src={file.url}
                                                        onPlay={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: true }))}
                                                        onPause={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                        onEnded={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                        controls
                                                        className="flex-1 w-full"
                                                    />

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadAudio(lang)}
                                                        className="hover:bg-purple-100"
                                                    >
                                                        <Download className="h-3 w-3 mr-1" /> Download
                                                    </Button>
                                                    </div>
                                                </div>
                                                ))}

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
                                                                    onClick={() => generateAudio()}
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

                        {/* Audio Settings Tab */}
                        <TabsContent value="audio" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Audio Settings</CardTitle>
                                    <CardDescription>
                                        Map your characters to AI voices for each language.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <Label>Language</Label>
                                        <Select value={selectedAudioLang} onValueChange={setSelectedAudioLang}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {supportedLanguages.map(lang => (
                                                    <SelectItem key={lang.code} value={lang.code}>{lang.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Assign Speakers</Label>
                                        {characterNames.map((char, idx) => (
                                            <div key={idx} className="flex items-center gap-2 mb-2">
                                                <span className="w-32 truncate">{char || `Character ${idx + 1}`}</span>
                                                <Select
                                                    value={characterSpeakerMap[selectedAudioLang]?.[idx] || ""}
                                                    onValueChange={val => handleSpeakerSelect(selectedAudioLang, idx, val)}
                                                >
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Select a voice..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(langToVoiceOptions[selectedAudioLang] || []).map(voice => (
                                                            <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                                                {voice.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        className="mt-6"
                                        onClick={generateAudio}
                                        disabled={isGeneratingAudio}
                                    >
                                        {isGeneratingAudio ? "Generating..." : "Generate Audio"}
                                    </Button>

                                    {/* AUDIO PLAYER SECTION */}
                                    {Object.keys(audioFiles).length > 0 && (
                                        <div className="space-y-4 mt-8">
                                            <Label>Generated Audio Files</Label>
                                            {Object.entries(audioFiles).map(([lang, file]) => (
                                                <div key={lang} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Headphones className="h-4 w-4" />
                                                        <span className="font-medium">{supportedLanguages.find(l => l.code === lang)?.label || lang}</span>
                                                    
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => playPauseAudio(lang)}
                                                            className="shrink-0"
                                                        >
                                                            {isPlayingAudio[lang] ? (
                                                                <Pause className="h-4 w-4" />
                                                            ) : (
                                                                <Play className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <div className="flex-1">
                                                            <audio
                                                                ref={el => { audioRefs.current[lang] = el }}
                                                                src={file.url}
                                                                onPlay={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: true }))}
                                                                onPause={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                                onEnded={() => setIsPlayingAudio(prev => ({ ...prev, [lang]: false }))}
                                                                controls
                                                                className="w-full"
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => downloadAudio(lang)}
                                                            className="hover:bg-purple-100"
                                                        >
                                                            <Download className="h-3 w-3 mr-1" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
)
}

export default Page