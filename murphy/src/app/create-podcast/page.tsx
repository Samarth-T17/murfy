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
import { toast } from 'sonner'
import { Sparkles, Copy, Trash2, Save, Wand2 } from 'lucide-react'
import { enhanceContentWithGemini } from '@/lib/gemini'
import type { PodcastContent } from '@/lib/gemini'

const themes = [
  { value: 'casual', label: 'Casual & Friendly', description: 'Conversational and approachable tone' },
  { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching-focused' },
  { value: 'entertaining', label: 'Entertaining', description: 'Engaging and fun approach' },
  { value: 'storytelling', label: 'Storytelling', description: 'Narrative-driven content' },
  { value: 'interview', label: 'Interview Style', description: 'Question and answer format' },
  { value: 'news', label: 'News/Current Events', description: 'Journalistic and factual' },
  { value: 'motivational', label: 'Motivational', description: 'Inspiring and uplifting' }
];

const Page = () => {
  const [userContent, setUserContent] = useState<PodcastContent>({
    title: '',
    description: '',
    content: ''
  });

  const [aiContent, setAiContent] = useState<PodcastContent>({
    title: '',
    description: '',
    content: ''
  });

  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAiGenerated, setHasAiGenerated] = useState(false);
  const [activeTab, setActiveTab] = useState('user');
  const [editingAi, setEditingAi] = useState(false);

  const handleUserContentChange = (field: keyof PodcastContent, value: string) => {
    setUserContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAiContentChange = (field: keyof PodcastContent, value: string) => {
    setAiContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateAiContent = async () => {
    if (!selectedTheme) {
      toast.error('Please select a theme first');
      return;
    }

    if (!userContent.title || !userContent.description || !userContent.content) {
      toast.error('Please fill in all user content fields first');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Use the Gemini service to enhance content
      const enhancedContent = await enhanceContentWithGemini(userContent, selectedTheme);

      setAiContent(enhancedContent);
      setHasAiGenerated(true);
      setActiveTab('ai');
      toast.success('Content enhanced successfully!');
    } catch {
      toast.error('Failed to generate AI content');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (content: PodcastContent) => {
    const fullContent = `Title: ${content.title}\n\nDescription: ${content.description}\n\nContent:\n${content.content}`;
    navigator.clipboard.writeText(fullContent);
    toast.success('Content copied to clipboard!');
  };

  const discardContent = (type: 'user' | 'ai') => {
    if (type === 'user') {
      setUserContent({ title: '', description: '', content: '' });
      toast.success('User content discarded');
    } else {
      setAiContent({ title: '', description: '', content: '' });
      setHasAiGenerated(false);
      toast.success('AI content discarded');
    }
  };

  const finalizeContent = (content: PodcastContent, type: 'user' | 'ai') => {
    // Here you would save the finalized content to your backend
    toast.success(`${type === 'user' ? 'Original' : 'AI-enhanced'} content finalized and saved!`);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Podcast Content</h1>
        <p className="text-muted-foreground">
          Write your podcast content and enhance it with AI using different themes and styles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                AI Enhancement
              </CardTitle>
              <CardDescription>
                Choose a theme to enhance your content with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme-select">Select Theme</Label>
                <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a theme..." />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div>
                          <div className="font-medium">{theme.label}</div>
                          <div className="text-sm text-muted-foreground">{theme.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTheme && (
                <div className="p-3 bg-muted rounded-lg">
                  <Badge variant="outline" className="mb-2">
                    {themes.find(t => t.value === selectedTheme)?.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {themes.find(t => t.value === selectedTheme)?.description}
                  </p>
                </div>
              )}

              <Button 
                onClick={generateAiContent} 
                disabled={isGenerating || !selectedTheme}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Enhance with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Podcast Content Editor</CardTitle>
              <CardDescription>
                Create and edit your podcast content with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">Original Content</TabsTrigger>
                  <TabsTrigger value="ai" disabled={!hasAiGenerated}>
                    AI Enhanced {hasAiGenerated && <Badge className="ml-2" variant="secondary">Ready</Badge>}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="user" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-title">Podcast Title</Label>
                      <Input
                        id="user-title"
                        placeholder="Enter your podcast title..."
                        value={userContent.title}
                        onChange={(e) => handleUserContentChange('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-description">Description</Label>
                      <Textarea
                        id="user-description"
                        placeholder="Brief description of your podcast episode..."
                        value={userContent.description}
                        onChange={(e) => handleUserContentChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="user-content">Podcast Content</Label>
                      <Textarea
                        id="user-content"
                        placeholder="Write your podcast script or main content here..."
                        value={userContent.content}
                        onChange={(e) => handleUserContentChange('content', e.target.value)}
                        rows={12}
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(userContent)}
                          disabled={!userContent.title && !userContent.description && !userContent.content}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => discardContent('user')}
                          disabled={!userContent.title && !userContent.description && !userContent.content}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Discard
                        </Button>
                      </div>
                      <Button 
                        onClick={() => finalizeContent(userContent, 'user')}
                        disabled={!userContent.title || !userContent.description || !userContent.content}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Finalize Original
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-4">
                  {hasAiGenerated ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          Enhanced with {themes.find(t => t.value === selectedTheme)?.label} theme
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAi(!editingAi)}
                        >
                          {editingAi ? 'Stop Editing' : 'Edit AI Content'}
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="ai-title">Enhanced Title</Label>
                        <Input
                          id="ai-title"
                          value={aiContent.title}
                          onChange={(e) => handleAiContentChange('title', e.target.value)}
                          disabled={!editingAi}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ai-description">Enhanced Description</Label>
                        <Textarea
                          id="ai-description"
                          value={aiContent.description}
                          onChange={(e) => handleAiContentChange('description', e.target.value)}
                          rows={3}
                          disabled={!editingAi}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ai-content">Enhanced Content</Label>
                        <Textarea
                          id="ai-content"
                          value={aiContent.content}
                          onChange={(e) => handleAiContentChange('content', e.target.value)}
                          rows={12}
                          disabled={!editingAi}
                        />
                      </div>

                      <div className="flex justify-between pt-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => copyToClipboard(aiContent)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => discardContent('ai')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Discard
                          </Button>
                        </div>
                        <Button onClick={() => finalizeContent(aiContent, 'ai')}>
                          <Save className="h-4 w-4 mr-2" />
                          Finalize Enhanced
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No AI-enhanced content yet.</p>
                      <p className="text-sm">Fill out the original content and select a theme to generate AI-enhanced version.</p>
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