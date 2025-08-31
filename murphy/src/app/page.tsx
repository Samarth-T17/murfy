import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { Mic, Library, Headphones, Sparkles, Play, Users, Globe } from 'lucide-react'
import Navigation from '@/components/Navigation'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <Headphones className="h-10 w-10" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Murphy
              </h1>
            </div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              AI-Powered Podcast Generator
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your ideas into professional, multilingual podcasts in seconds. 
              Create engaging content with AI-generated scripts and natural voice synthesis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate-podcast">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
                  <Mic className="h-5 w-5 mr-2" />
                  Create Your First Podcast
                </Button>
              </Link>
              <Link href="/podcasts">
                <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-50 px-8 py-3">
                  <Library className="h-5 w-5 mr-2" />
                  Browse Podcasts
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Why Choose Murphy?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 rounded-full bg-purple-100 w-fit mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>AI-Generated Content</CardTitle>
                <CardDescription>
                  Transform simple ideas into engaging podcast scripts with advanced AI technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Professional script generation</li>
                  <li>• Multiple theme options</li>
                  <li>• Customizable content length</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 rounded-full bg-blue-100 w-fit mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Create podcasts in 7 different languages with natural-sounding voices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• English, Hindi, Bengali</li>
                  <li>• French, German, Italian</li>
                  <li>• Tamil and more coming</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="p-3 rounded-full bg-green-100 w-fit mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Multiple Voice Options</CardTitle>
                <CardDescription>
                  Choose from various AI voices to create dynamic conversations and presentations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Male and female voices</li>
                  <li>• Natural speech patterns</li>
                  <li>• Conversation-style dialogue</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Share Your Idea</h4>
                <p className="text-muted-foreground">
                  Simply describe your podcast topic and choose your preferred theme and speakers
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">AI Creates Content</h4>
                <p className="text-muted-foreground">
                  Our AI generates professional scripts with engaging dialogue and natural flow
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">Download & Share</h4>
                <p className="text-muted-foreground">
                  Get high-quality audio files in multiple languages ready for publishing
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Create Amazing Podcasts?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of creators who are already using Murphy to bring their ideas to life through the power of AI.
          </p>
          <Link href="/generate-podcast">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Start Creating Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default HomePage