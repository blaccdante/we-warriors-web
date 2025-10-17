/**
 * WarriorBot AI Service
 * Enhanced AI integration with multiple providers
 * Supports: Ollama, Hugging Face, Gemini, Groq, and fallback responses
 */

class WarriorBotAI {
    constructor() {
        this.providers = {
            // Preferred: OpenAI ChatGPT
            openai: {
                enabled: false,
                apiKey: null, // DO NOT hardcode; load via config/localStorage or call through your backend proxy
                baseUrl: 'https://api.openai.com/v1',
                model: 'gpt-4o-mini'
            },
            // Optional local/dev providers
            ollama: {
                enabled: false,
                baseUrl: 'http://localhost:11434',
                model: 'llama3.2:3b', // Fast, good for health topics
            },
            huggingface: {
                enabled: false,
                apiKey: null, // Set this in config
                model: 'microsoft/DialoGPT-large',
            },
            gemini: {
                enabled: false,
                apiKey: null, // Set this in config
                model: 'gemini-1.5-flash',
            },
            groq: {
                enabled: false,
                apiKey: null, // Set this in config
                model: 'llama3-8b-8192',
            }
        };

        this.contextPrompt = `You are WarriorBot, an AI companion for people with sickle cell disease and their supporters. You are part of the "We Warriors" community website.

CORE IDENTITY:
- You are empathetic, encouraging, and knowledgeable about sickle cell disease
- You provide emotional support, medical information (not advice), and community resources
- You use the warrior theme: strength, hope, faith, and resilience
- Your tagline: "From Pain comes Strength • Through Faith we Hope"
- BE DIRECT and helpful - when someone asks for encouragement, GIVE encouragement immediately

RESPONSE GUIDELINES:
- When someone asks for encouragement, give immediate uplifting words, don't ask what they need
- When someone mentions hydroxyurea (even misspelled), explain what it is directly
- When someone needs hope, provide Bible verses and warrior affirmations right away
- When someone asks about pain, give practical pain management tips immediately
- Be conversational and personal, not robotic

MEDICAL GUIDELINES:
- Provide general information about sickle cell disease
- Always include disclaimer: "This is general information. Always consult your healthcare provider for medical decisions"
- Recognize crisis situations and provide immediate support resources
- Know about treatments: hydroxyurea, blood transfusions, pain management, gene therapy

RESPONSE STYLE:
- Use warrior terminology: "warrior," "fighter," "strength"
- Include relevant emojis: 💪🦅💜🌟🙏
- Be hopeful but realistic
- Give specific, actionable advice
- Make responses personal and warm
- Address the user's immediate need first, then ask follow-ups

CRISIS DETECTION:
If someone mentions severe pain, emergency symptoms, suicidal thoughts, or crisis:
- Provide immediate support and resources
- Suggest calling emergency services if severe
- Offer crisis hotline numbers
- Stay with them through the conversation

EXAMPLES:
User: "I need encouragement"
Response: "Warrior, you are absolutely amazing! Every day you face sickle cell with incredible courage..."

User: "Tell me about hydroxyurea"
Response: "Hydroxyurea is one of the most important medications for sickle cell warriors! Here's how it works..."

Stay focused on sickle cell, health, faith, community support, and warrior themes. Always be helpful and direct.`;

        this.fallbackResponses = {
            default: "I'm here to support you, warrior! 💪 Could you tell me more about what you're experiencing or what specific help you need? I can provide information about sickle cell management, connect you with resources, or just listen.",
            
            error: "I'm experiencing some technical difficulties right now, but I'm still here for you, warrior! 🤖💜 Let me know what you need help with, and I'll do my best to support you with the resources I have available."
        };
    }

    // Initialize AI providers based on available configuration
    async initialize() {
        try {
            // Check if Ollama is running locally
            await this.checkOllama();
            
            // Load API keys from config if available
            this.loadConfig();
            
            console.log('WarriorBot AI initialized with providers:', this.getAvailableProviders());
        } catch (error) {
            console.log('WarriorBot AI initialized in fallback mode');
        }
    }

    async checkOllama() {
        try {
            const response = await fetch(`${this.providers.ollama.baseUrl}/api/tags`, {
                method: 'GET',
                timeout: 2000
            });
            
            if (response.ok) {
                this.providers.ollama.enabled = true;
                console.log('🦾 Ollama detected - Local AI enabled!');
            }
        } catch (error) {
            console.log('Ollama not available - using cloud providers');
        }
    }

    loadConfig() {
        // Check for API keys in localStorage or config
        const config = localStorage.getItem('warriorbot-ai-config');
        if (config) {
            try {
                const parsed = JSON.parse(config);
                
                if (parsed.openai?.apiKey) {
                    this.providers.openai.apiKey = parsed.openai.apiKey;
                    this.providers.openai.enabled = true;
                    if (parsed.openai.baseUrl) this.providers.openai.baseUrl = parsed.openai.baseUrl;
                    if (parsed.openai.model) this.providers.openai.model = parsed.openai.model;
                    if (parsed.openai.proxyPath) this.providers.openai.proxyPath = parsed.openai.proxyPath; // e.g., '/api/warriorbot'
                }
                
                if (parsed.huggingface?.apiKey) {
                    this.providers.huggingface.apiKey = parsed.huggingface.apiKey;
                    this.providers.huggingface.enabled = true;
                }
                
                if (parsed.gemini?.apiKey) {
                    this.providers.gemini.apiKey = parsed.gemini.apiKey;
                    this.providers.gemini.enabled = true;
                }
                
                if (parsed.groq?.apiKey) {
                    this.providers.groq.apiKey = parsed.groq.apiKey;
                    this.providers.groq.enabled = true;
                }
            } catch (error) {
                console.log('Config parsing error:', error);
            }
        }
    }

    getAvailableProviders() {
        return Object.keys(this.providers).filter(provider => this.providers[provider].enabled);
    }

    // Main AI response generation
    async generateResponse(userMessage, conversationHistory = []) {
        console.log('🤖 WarriorBot AI generating response for:', userMessage);
        
        // Crisis detection - always handle locally for reliability
        if (this.detectCrisis(userMessage)) {
            console.log('🚨 Crisis detected, using local response');
            return this.handleCrisis(userMessage);
        }

        // Try AI providers in order of preference
        const providers = this.getAvailableProviders();
        console.log('📡 Available AI providers:', providers);
        
        if (providers.length === 0) {
            console.log('❌ No AI providers available, using fallback');
            return this.getFallbackResponse(userMessage);
        }
        
        for (const providerName of providers) {
            try {
                console.log(`🔄 Trying provider: ${providerName}`);
                const response = await this.callProvider(providerName, userMessage, conversationHistory);
                if (response && response.length > 10) {
                    console.log(`✅ Got response from ${providerName}: ${response.substring(0, 100)}...`);
                    return this.enhanceResponse(response, userMessage);
                }
            } catch (error) {
                console.log(`❌ Provider ${providerName} failed:`, error);
                continue;
            }
        }

        // Fallback to hardcoded intelligent responses
        console.log('🔄 All AI providers failed, using intelligent fallback');
        return this.getFallbackResponse(userMessage);
    }

    async callProvider(provider, message, history) {
        switch (provider) {
            case 'openai':
                return await this.callOpenAI(message, history);
            case 'ollama':
                return await this.callOllama(message, history);
            case 'huggingface':
                return await this.callHuggingFace(message, history);
            case 'gemini':
                return await this.callGemini(message, history);
            case 'groq':
                return await this.callGroq(message, history);
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    async callOllama(message, history) {
        const prompt = this.buildPrompt(message, history);
        
        const response = await fetch(`${this.providers.ollama.baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: this.providers.ollama.model,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 500,
                }
            })
        });

        const data = await response.json();
        return data.response;
    }

    async callHuggingFace(message, history) {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${this.providers.huggingface.model}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.providers.huggingface.apiKey}`,
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    inputs: {
                        past_user_inputs: history.filter(h => h.sender === 'user').map(h => h.message).slice(-3),
                        generated_responses: history.filter(h => h.sender === 'bot').map(h => h.message).slice(-3),
                        text: message
                    },
                    parameters: {
                        max_length: 500,
                        temperature: 0.7,
                    }
                }),
            }
        );

        const result = await response.json();
        return result.generated_text || result.response;
    }

    async callGemini(message, history) {
        const prompt = this.buildPrompt(message, history);
        
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.providers.gemini.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    async callOpenAI(message, history) {
        // Prefer hitting a backend proxy if configured (recommended)
        if (this.providers.openai.proxyPath) {
            const response = await fetch(this.providers.openai.proxyPath, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    provider: 'openai',
                    model: this.providers.openai.model,
                    system: this.contextPrompt,
                    history,
                    message
                })
            });
            if (!response.ok) throw new Error(`Proxy error ${response.status}`);
            const data = await response.json();
            return data.reply || data.content || data.message || JSON.stringify(data);
        }
        // Direct client-side call (for local/dev only). Do NOT ship with real keys embedded.
        const messages = [
            { role: 'system', content: this.contextPrompt },
            ...history.map(h => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.message })).slice(-6),
            { role: 'user', content: message }
        ];
        const url = `${this.providers.openai.baseUrl}/chat/completions`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.providers.openai.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.providers.openai.model,
                messages,
                temperature: 0.7,
                max_tokens: 600,
                stream: false
            })
        });
        if (!response.ok) throw new Error(`OpenAI API error ${response.status}`);
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        return content;
    }

    async callGroq(message, history) {
        const messages = [
            { role: 'system', content: this.contextPrompt },
            ...history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.message
            })).slice(-6),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.providers.groq.apiKey}`,
                'Content-Type': 'application/json',
                'User-Agent': 'WarriorBot/1.0',
            },
            body: JSON.stringify({
                model: this.providers.groq.model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 600,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from Groq API');
        }
        
        return data.choices[0].message.content;
    }

    buildPrompt(message, history) {
        let prompt = this.contextPrompt + '\n\n';
        
        // Add recent conversation history
        if (history.length > 0) {
            prompt += 'Recent conversation:\n';
            history.slice(-4).forEach(item => {
                const role = item.sender === 'user' ? 'User' : 'WarriorBot';
                prompt += `${role}: ${item.message}\n`;
            });
            prompt += '\n';
        }
        
        prompt += `User: ${message}\nWarriorBot:`;
        return prompt;
    }

    detectCrisis(message) {
        const crisisKeywords = [
            'emergency', 'crisis', 'severe pain', 'can\'t breathe', 'chest pain',
            'suicide', 'kill myself', 'end it all', 'hospital', 'ambulance',
            'stroke', 'can\'t move', 'unconscious', 'bleeding', 'overdose'
        ];
        
        const lowerMessage = message.toLowerCase();
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    }

    handleCrisis(message) {
        // Use the existing crisis response system for reliability
        const crisisResponses = [
            "🚨 I'm here with you, warrior. This sounds like you need immediate help. Please consider:\n\n📞 **Emergency Services**: Call 911 if you're in severe distress\n🏥 **Go to ER**: If you're having severe pain, breathing problems, or stroke symptoms\n💙 **Crisis Hotline**: 988 (Suicide & Crisis Lifeline)\n\nYou are not alone. Can you tell me more about what you're experiencing right now?",
            
            "🦅 Brave warrior, I hear you and I'm concerned for your safety. Please reach out for immediate help:\n\n🚑 **Call 911** for medical emergencies\n📱 **Text 741741** for crisis text line\n☎️ **Call 988** for mental health crisis\n\nYour life matters. You've survived every crisis before this one. What immediate support do you need right now?"
        ];
        
        return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
    }

    getFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Encouragement and hope - be more direct and supportive
        if (lowerMessage.includes('encouragement') || lowerMessage.includes('encourage') || 
            lowerMessage.includes('hope') || lowerMessage.includes('faith') || 
            lowerMessage.includes('prayer') || lowerMessage.includes('discouraged') ||
            lowerMessage.includes('sad') || lowerMessage.includes('down') || 
            lowerMessage.includes('tough day') || lowerMessage.includes('difficult')) {
            
            const encouragingResponses = [
                "💪 Listen to me, warrior - you are absolutely incredible! Every single day you wake up and face sickle cell disease with courage that most people will never understand. That makes you a true fighter! 🦅\n\n'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' - Isaiah 40:31\n\nYour pain is real, your struggle is valid, but your strength is LIMITLESS. You've survived every single bad day so far - that's a 100% success rate! What's one small thing that brought you even a moment of peace today?",
                
                "🌟 Sweet warrior, I see your heart and I want you to know something important - you are making a difference just by existing! Your journey with sickle cell is teaching others about resilience, showing them what real courage looks like.\n\n'Be strong and courageous! Do not be afraid or discouraged, for the Lord your God is with you wherever you go.' - Joshua 1:9\n\n✨ **Remember these truths:**\n• You are braver than you believe\n• You are stronger than you seem\n• You are loved more than you know\n• Your story matters and inspires others\n\nFrom pain comes strength, warrior. What's one victory - big or small - you can celebrate today? 💜",
                
                "🙏 Precious warrior, I felt called to remind you of something powerful today - God doesn't make mistakes, and you are fearfully and wonderfully made! Even with sickle cell, especially with sickle cell, you shine with a light that can't be dimmed.\n\n'And we know that in all things God works for the good of those who love him.' - Romans 8:28\n\n🦅 **Your warrior spirit shows in:**\n• How you get up every morning despite pain\n• How you advocate for yourself and others\n• How you find joy in small moments\n• How you inspire others without even knowing it\n\nYour struggles are building something beautiful in you and through you. Keep flying, eagle! What's one blessing you can name today, even if it's small?"
            ];
            
            return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
        }
        
        // Pain management
        if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
            return "💪 I understand pain is such a difficult part of the warrior journey. Here are some strategies that help many in our community:\n\n🌡️ Heat therapy (heating pads, warm baths)\n🌬️ Deep breathing exercises\n💧 Stay hydrated\n🎵 Distraction techniques (music, movies)\n💊 Take prescribed medications as directed\n\nWhat pain management techniques have you tried? I'm here to help you explore more options.";
        }
        
        // Medical questions (including common misspellings)
        if (lowerMessage.includes('hydroxyurea') || lowerMessage.includes('hydroxurea') || 
            lowerMessage.includes('hydrox') || lowerMessage.includes('treatment') || 
            lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
            
            if (lowerMessage.includes('hydrox')) {
                return "💊 Ah, you're asking about **Hydroxyurea** (also called Droxia or Siklos) - one of the most important medications for sickle cell warriors! 🦅\n\n**How it works:**\n• Increases fetal hemoglobin (HbF) production\n• Reduces sickling of red blood cells\n• Decreases pain crises and hospitalizations\n• May reduce need for blood transfusions\n\n**What to expect:**\n• Takes 3-6 months to see full benefits\n• Taken daily, usually as capsules\n• Regular blood monitoring needed\n• Most warriors tolerate it well\n\n**Common questions:**\n• \"Will it cure me?\" - No, but it significantly improves quality of life\n• \"Side effects?\" - Mouth sores, nail changes (usually mild)\n• \"Can I stop taking it?\" - Only with doctor guidance\n\n*Remember: This is general information. Always work with your healthcare team for personalized treatment decisions.*\n\nWhat specific aspect of hydroxyurea would you like to know more about, warrior? 💪";
            }
            
            return "💊 Great question about sickle cell treatment! I can share general information, but always consult your healthcare provider for medical decisions.\n\nWhat specific aspect of treatment are you curious about? I can discuss:\n• Hydroxyurea and how it works\n• Blood transfusions\n• Pain management options\n• New treatments like gene therapy\n• Managing side effects";
        }
        
        // Default encouraging response
        return "Hello, mighty warrior! 🦅 I'm here to support you on your journey. Whether you need:\n\n💪 **Encouragement** during tough times\n🏥 **Health information** about sickle cell\n👥 **Community resources** and connections\n🙏 **Faith-based support** and prayer\n\nI'm ready to help. What's on your heart today?";
    }

    enhanceResponse(aiResponse, userMessage) {
        // Add warrior terminology and emojis if not present
        let enhanced = aiResponse;
        
        // Add warrior greeting if not present
        if (!enhanced.toLowerCase().includes('warrior') && Math.random() < 0.3) {
            enhanced = enhanced.replace(/^/, 'Warrior, ');
        }
        
        // Add relevant emoji if none present
        if (!/[\u{1F000}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u.test(enhanced)) {
            const emojis = ['💪', '🦅', '💜', '🌟'];
            enhanced += ` ${emojis[Math.floor(Math.random() * emojis.length)]}`;
        }
        
        // Add medical disclaimer for health-related topics
        if (userMessage.toLowerCase().includes('treatment') || 
            userMessage.toLowerCase().includes('medication') ||
            userMessage.toLowerCase().includes('doctor')) {
            enhanced += '\n\n*Remember: This is general information. Always consult your healthcare provider for medical decisions.*';
        }
        
        return enhanced;
    }
}

// Export for use in WarriorBot
window.WarriorBotAI = WarriorBotAI;