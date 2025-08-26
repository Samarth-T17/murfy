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
    Users
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

const Page = () => {
    const [podcastIdea, setPodcastIdea] = useState<string>('');
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
            // Use the Gemini service to generate content from idea
            const generatedPodcast = await generateContentFromIdea(podcastIdea, selectedTheme);

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
            setGeneratedContent({ title: '', description: '', content: '' , names: []});
            setEditedContent({ title: '', description: '', content: '' , names: []});
            setHasGenerated(false);
            setPodcastIdea('');
            toast.success('Generated content discarded');
        } else {
            setEditedContent({ ...generatedContent }); // Reset to original generated content
            toast.success('Edited content reset to original');
        }
    };

    const finalizeContent = (content: PodcastContent, type: 'generated' | 'edited') => {
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
                                Enter your podcast idea and choose a theme to generate complete content
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
                                                    <div>
                                                        <div className="font-medium">{theme.label}</div>
                                                        <div className="text-sm text-muted-foreground">{theme.description}</div>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                            disabled={isGenerating || !selectedTheme || !podcastIdea.trim()}
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
                                        <p>Enter your podcast idea and select a theme to generate complete content</p>
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
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                    <Badge variant="outline" className={themes.find(t => t.value === selectedTheme)?.color}>
                                                        Generated with {themes.find(t => t.value === selectedTheme)?.label} theme
                                                    </Badge>
                                                </div>
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
                                                <p className="text-sm mb-4">Enter your podcast idea and select a theme to generate complete podcast content.</p>

                                                {(!podcastIdea.trim() || !selectedTheme) && (
                                                    <Alert className="mt-4">
                                                        <Info className="h-4 w-4" />
                                                        <AlertDescription>
                                                            {!podcastIdea.trim() ? 'Enter your podcast idea first.' : 'Select a theme to get started.'}
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
                                                    className="group bg-gradient-to-r from-orange-600 to-blue-600 hover:from-orange-700 hover:to-blue-700"
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