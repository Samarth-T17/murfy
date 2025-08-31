// Gemini AI Service
// This file handles the integration with Google's Gemini API for content enhancement

import { GoogleGenerativeAI } from '@google/generative-ai';

export type PodcastContent = {
    title: string;
    description: string;
    content: string;
    names: string[];
};

export interface Theme {
    value: string;
    label: string;
    description: string;
}

// Configuration for different themes and their prompts
const themePrompts = {
    casual: {
        system: "You are a friendly, conversational podcast content enhancer. Make the content feel like a chat between friends.",
        style: "conversational, approachable, use 'we' and 'you', add casual transitions"
    },
    professional: {
        system: "You are a professional content enhancer for business podcasts. Maintain a formal, authoritative tone.",
        style: "formal, structured, authoritative, use industry terminology appropriately"
    },
    educational: {
        system: "You are an educational content enhancer. Focus on clarity, learning objectives, and step-by-step explanations.",
        style: "clear, informative, structured with learning points, use examples and analogies"
    },
    entertaining: {
        system: "You are an entertainment-focused content enhancer. Make the content engaging, fun, and memorable.",
        style: "engaging, humorous where appropriate, use storytelling elements, add hooks"
    },
    storytelling: {
        system: "You are a narrative content enhancer. Structure content with compelling story arcs and dramatic elements.",
        style: "narrative-driven, use story structure, create tension and resolution, vivid descriptions"
    },
    interview: {
        system: "You are an interview-style content enhancer. Structure content as engaging questions and detailed answers.",
        style: "question-answer format, natural conversation flow, follow-up questions"
    },
    news: {
        system: "You are a journalistic content enhancer. Focus on facts, objectivity, and timely information.",
        style: "factual, objective, structured like news reports, include relevant context"
    },
    motivational: {
        system: "You are a motivational content enhancer. Inspire and energize the audience with uplifting content.",
        style: "inspiring, energetic, use action-oriented language, include calls to action"
    }
};

// Enhanced function to generate content from podcast idea
export async function generateContentFromIdea(
    idea: string,
    theme: string,
    names: string[]
): Promise<PodcastContent> {
    const themeConfig = themePrompts[theme as keyof typeof themePrompts];

    if (!themeConfig) {
        throw new Error(`Theme "${theme}" not supported`);
    }

    // Check if we have an API key, if not, fall back to mock
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
        console.warn('No Gemini API key found, using mock generation');
        return mockGenerateFromIdea(idea, theme);
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
System: ${themeConfig.system}

Task: Create a complete podcast episode from the following idea, tailored to the ${theme} theme.
Style guidelines: ${themeConfig.style}

Podcast Idea: "${idea}"

Characters: "${names.join(', ')}"
You will be given the character names, and you must write the entire podcast content as a conversation between only those characters in the following format:
Alice: "…"
Bob: "…"

Requirements:
1. Include an engaging title that captures the essence of the idea.
2. Write a compelling description (2-3 sentences) that would attract listeners.
3. The full podcast script/content should be substantial (at least 500-800 words), written entirely as dialogue between the provided characters (maximum of 3).
4. Only write dialogues do not write things like (laughing etc).
5. Do not return the character names in a separate array — just use them directly in the dialogue.

Respond in this exact JSON format:
{
  "title": "engaging podcast title here",
  "description": "compelling 2-3 sentence description here",
  "content": "complete podcast script/content here in dialogue format (substantial length)"
}
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        // Try to parse JSON response
        try {
            // Clean the response text to extract JSON
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const generatedContent = JSON.parse(jsonMatch[0]);
                return {
                    title: generatedContent.title || `Exploring: ${idea}`,
                    description: generatedContent.description || `An insightful discussion about ${idea}.`,
                    content: generatedContent.content || `In this episode, we dive deep into ${idea}...`,
                    names: generatedContent.names || []
                };
            } else {
                console.warn('No JSON found in Gemini response, using fallback generation');
                return mockGenerateFromIdea(idea, theme);
            }
        } catch {
            console.warn('Failed to parse Gemini response as JSON, using fallback generation');
            return mockGenerateFromIdea(idea, theme);
        }
    } catch (error) {
        console.error('Gemini API error:', error);
        // Fall back to mock generation if API fails
        return mockGenerateFromIdea(idea, theme);
    }
}

// Fallback mock generation function
function mockGenerateFromIdea(idea: string, theme: string): Promise<PodcastContent> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: generateMockTitle(idea, theme),
                description: generateMockDescription(idea, theme),
                content: generateMockContent(idea, theme),
                names: ["Alice", "Bob"]
            });
        }, 2000); // Simulate processing time
    });
}

// Mock generation functions
function generateMockTitle(idea: string, theme: string): string {
    const titleTemplates = {
        casual: `Let's Talk About ${idea}`,
        professional: `Professional Insights: ${idea}`,
        educational: `Understanding ${idea}: A Deep Dive`,
        entertaining: `The Fun Side of ${idea}`,
        storytelling: `The Story Behind ${idea}`,
        interview: `In Conversation: Exploring ${idea}`,
        news: `Breaking Down ${idea}: What You Need to Know`,
        motivational: `Transform Your Perspective on ${idea}`
    };
    
    return titleTemplates[theme as keyof typeof titleTemplates] || `Exploring ${idea}`;
}

function generateMockDescription(idea: string, theme: string): string {
    const descriptionTemplates = {
        casual: `Join us for a friendly conversation about ${idea}. We'll explore different perspectives and share insights that'll help you understand this topic better.`,
        
        professional: `This episode provides a comprehensive professional analysis of ${idea}. We examine industry best practices, strategic implications, and actionable insights for business leaders.`,
        
        educational: `Learn everything you need to know about ${idea} in this educational deep-dive. We break down complex concepts into easy-to-understand segments with practical examples.`,
        
        entertaining: `Get ready for an entertaining exploration of ${idea}! We'll uncover surprising facts, share engaging stories, and keep you hooked throughout this fun-filled episode.`,
        
        storytelling: `Discover the compelling narrative surrounding ${idea}. This episode weaves together personal stories, dramatic moments, and powerful insights into an unforgettable listening experience.`,
        
        interview: `An engaging conversation exploring ${idea} through thoughtful questions and insightful answers. We uncover new perspectives and valuable wisdom from expert voices.`,
        
        news: `Stay informed with the latest developments and analysis regarding ${idea}. This news-focused episode provides factual information, current updates, and expert commentary.`,
        
        motivational: `Find inspiration and motivation through our exploration of ${idea}. This uplifting episode energizes you with actionable strategies and positive insights for personal growth.`
    };
    
    return descriptionTemplates[theme as keyof typeof descriptionTemplates] || `An insightful discussion about ${idea}.`;
}

function generateMockContent(idea: string, theme: string): string {
    const baseContent = `Welcome to today's episode where we're exploring ${idea}. This is a fascinating topic that touches many aspects of our lives.

Let's start by understanding what ${idea} really means. At its core, this concept represents something that affects how we think, work, and interact with the world around us.

First, let's examine the background. The origins of ${idea} can be traced back through various developments and innovations. Understanding this history helps us appreciate where we are today.

Next, we'll look at the current state. Today, ${idea} manifests in numerous ways across different industries and communities. The impact is both immediate and far-reaching.

We should also consider the challenges. Like any significant concept, ${idea} comes with its own set of obstacles and considerations that we need to address thoughtfully.

But there are also tremendous opportunities. When we approach ${idea} with the right mindset and strategies, the potential for positive impact is enormous.

Let's discuss practical applications. How can you apply insights about ${idea} in your daily life? What steps can you take to benefit from this understanding?

Looking ahead, the future of ${idea} holds exciting possibilities. Emerging trends and developments suggest we're only beginning to scratch the surface of what's possible.

Finally, let's wrap up with key takeaways. The most important thing to remember about ${idea} is that it's not just a theoretical concept – it's something that can genuinely improve your life when understood and applied correctly.`;

    // Add theme-specific enhancements
    switch (theme) {
        case 'casual':
            return `Hey everyone! Welcome back to the show. Today we're diving into something really interesting - ${idea}. Grab your coffee and let's chat about this together.\n\n${baseContent}\n\nThanks for spending time with us today! Don't forget to share this episode with friends who might find it interesting. See you next time!`;
            
        case 'professional':
            return `Good morning, and welcome to our professional insights series. Today we're conducting a strategic analysis of ${idea}.\n\n${baseContent}\n\nIn conclusion, these insights provide valuable considerations for industry professionals looking to understand and leverage ${idea} effectively.`;
            
        case 'educational':
            return `Welcome to today's learning session. By the end of this episode, you'll have a comprehensive understanding of ${idea}.\n\nLearning Objectives:\n- Understand the fundamentals of ${idea}\n- Identify practical applications\n- Recognize opportunities and challenges\n\n${baseContent}\n\nRemember to take notes and apply these concepts in your own context. Learning is most effective when combined with practice.`;
            
        case 'entertaining':
            return `Welcome to the show! Today we're going on an entertaining journey to explore ${idea}. Buckle up - this is going to be fun!\n\n${baseContent}\n\nWasn't that fascinating? We hope you enjoyed this entertaining look at ${idea}. Stay tuned for more engaging content!`;
            
        case 'storytelling':
            return `Once upon a time, in a world much like ours, people began to discover the power of ${idea}...\n\n${baseContent}\n\nAnd so our story of ${idea} continues to unfold, with each of us playing a part in its ongoing narrative.`;
            
        case 'interview':
            return `Welcome to our interview series. Today I'm excited to explore ${idea} through an engaging conversation.\n\nHost: Let's start with the basics. How would you explain ${idea} to someone hearing about it for the first time?\n\nGuest: ${baseContent}\n\nHost: That's incredibly insightful. Thank you for sharing your expertise with us today.`;
            
        case 'news':
            return `This is your news update on ${idea}. Here are the key facts and latest developments you need to know.\n\n${baseContent}\n\nWe'll continue monitoring developments in ${idea} and bring you updates as they emerge. Stay informed with our continued coverage.`;
            
        case 'motivational':
            return `You have incredible potential, and today's episode about ${idea} will help you unlock it. Get ready to be inspired!\n\n${baseContent}\n\nRemember, every great journey begins with understanding. Take what you've learned about ${idea} and use it to create positive change in your life. You've got this!`;
            
        default:
            return baseContent;
    }
}

