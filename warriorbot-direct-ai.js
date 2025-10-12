/**
 * Direct WarriorBot AI - Simple implementation that works
 * Bypasses the complex integration and directly calls Groq API
 */

class DirectWarriorBotAI {
    constructor() {
        // Get API key from localStorage or use fallback
        this.apiKey = null;
        this.loadConfig();
    }
    
    loadConfig() {
        const config = localStorage.getItem('warriorbot-ai-config');
        if (config) {
            try {
                const parsed = JSON.parse(config);
                
                // Check for Groq first
                if (parsed.groq?.apiKey) {
                    this.apiKey = parsed.groq.apiKey;
                    this.provider = 'groq';
                    console.log('🔑 Direct AI loaded with Groq API');
                } 
                // Then check for Gemini
                else if (parsed.gemini?.apiKey) {
                    this.apiKey = parsed.gemini.apiKey;
                    this.provider = 'gemini';
                    console.log('🔑 Direct AI loaded with Gemini API');
                } 
                else {
                    console.log('❌ No API key found in config');
                }
            } catch (error) {
                console.log('Config error:', error);
            }
        }
    }
    
    async generateResponse(userMessage) {
        console.log('🤖 Direct AI generating response for:', userMessage);
        
        // Crisis detection - handle locally
        if (this.detectCrisis(userMessage)) {
            console.log('🚨 Crisis detected, using local response');
            return this.handleCrisis(userMessage);
        }
        
        // Try AI if available
        if (this.apiKey) {
            try {
                console.log(`🔄 Calling ${this.provider} API directly...`);
                
                let aiResponse;
                if (this.provider === 'groq') {
                    aiResponse = await this.callGroqDirect(userMessage);
                } else if (this.provider === 'gemini') {
                    aiResponse = await this.callGeminiDirect(userMessage);
                }
                
                if (aiResponse && aiResponse.length > 20) {
                    console.log('✅ Got AI response:', aiResponse.substring(0, 100) + '...');
                    return aiResponse;
                }
            } catch (error) {
                console.log('❌ AI failed:', error);
            }
        }
        
        // Enhanced fallback
        console.log('🔄 Using enhanced fallback');
        return this.getSmartFallback(userMessage);
    }
    
    async callGroqDirect(message) {
        const contextPrompt = `You are WarriorBot, an AI companion for people with sickle cell disease. You are empathetic, encouraging, and knowledgeable.

IMPORTANT INSTRUCTIONS:
- When someone asks for "encouragement", give immediate uplifting words
- When someone mentions "hydroxyurea" (even misspelled), explain what it is
- Be direct, warm, and helpful - don't ask unnecessary questions
- Use warrior terminology and include emojis like 💪🦅💜🌟
- Include Bible verses when appropriate
- Always be encouraging and supportive

Examples:
User: "encouragement" → Give immediate encouragement with Bible verse
User: "hydroxyurea" → Explain the medication directly
User: "pain" → Give practical pain management tips

Be the AI companion these warriors need!`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [
                    { role: 'system', content: contextPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 500,
                stream: false
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    }
    
    async callGeminiDirect(message) {
        const contextPrompt = `You are WarriorBot, an AI companion for people with sickle cell disease. You are empathetic, encouraging, and knowledgeable.

IMPORTANT INSTRUCTIONS:
- When someone asks for "encouragement", give immediate uplifting words with Bible verses
- When someone mentions "hydroxyurea" (even misspelled), explain what it is directly
- Be direct, warm, and helpful - don't ask unnecessary questions
- Use warrior terminology and include emojis like 💪🦅💜🌟
- Include Bible verses when appropriate
- Always be encouraging and supportive

Examples:
User: "encouragement" → Give immediate encouragement with Bible verse
User: "hydroxyurea" → Explain the medication directly
User: "pain" → Give practical pain management tips

Be the AI companion these warriors need!`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${contextPrompt}\n\nUser message: "${message}"\n\nRespond as WarriorBot:`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    }
                })
            }
        );
        
        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Invalid response format from Gemini API');
        }
        
        return data.candidates[0].content.parts[0].text;
    }
    
    detectCrisis(message) {
        const crisisKeywords = [
            'emergency', 'crisis', 'severe pain', 'can\'t breathe', 'chest pain',
            'suicide', 'kill myself', 'end it all', 'hospital', 'ambulance'
        ];
        
        const lowerMessage = message.toLowerCase();
        return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    }
    
    handleCrisis(message) {
        return `🚨 I'm here with you, warrior. This sounds like you need immediate help. Please consider:

📞 **Emergency Services**: Call 911 if you're in severe distress
🏥 **Go to ER**: If you're having severe pain, breathing problems, or stroke symptoms  
💙 **Crisis Hotline**: 988 (Suicide & Crisis Lifeline)
📱 **Text Crisis Line**: Text 741741

You are not alone. Can you tell me more about what you're experiencing right now?`;
    }
    
    getSmartFallback(message) {
        const lowerMessage = message.toLowerCase();
        
        // Encouragement - be direct!
        if (lowerMessage.includes('encouragement') || lowerMessage.includes('encourage') || 
            lowerMessage.includes('hope') || lowerMessage.includes('discouraged') ||
            lowerMessage.includes('sad') || lowerMessage.includes('down')) {
            
            const encouragingResponses = [
                `💪 Listen to me, warrior - you are absolutely incredible! Every single day you wake up and face sickle cell disease with courage that most people will never understand. That makes you a true fighter! 🦅

"Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." - Isaiah 40:31

Your pain is real, your struggle is valid, but your strength is LIMITLESS. You've survived every single bad day so far - that's a 100% success rate! 

What's weighing on your heart today, warrior? I'm here to listen. 💜`,

                `🌟 Sweet warrior, I want you to know something powerful - you are making a difference just by existing! Your journey with sickle cell is teaching others about resilience, showing them what real courage looks like.

"Be strong and courageous! Do not be afraid or discouraged, for the Lord your God is with you wherever you go." - Joshua 1:9

✨ **Remember these truths:**
• You are braver than you believe
• You are stronger than you seem  
• You are loved more than you know
• Your story matters and inspires others

From pain comes strength, warrior. You are a living testimony of God's power! 💜🦅`
            ];
            
            return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
        }
        
        // Hydroxyurea - direct explanation
        if (lowerMessage.includes('hydrox') || lowerMessage.includes('hydroxurea')) {
            return `💊 Ah, you're asking about **Hydroxyurea** (also called Droxia or Siklos) - one of the most important medications for sickle cell warriors! 🦅

**How it works:**
• Increases fetal hemoglobin (HbF) production
• Reduces sickling of red blood cells  
• Decreases pain crises and hospitalizations
• May reduce need for blood transfusions

**What to expect:**
• Takes 3-6 months to see full benefits
• Taken daily, usually as capsules
• Regular blood monitoring needed
• Most warriors tolerate it well

**Common questions:**
• "Will it cure me?" - No, but it significantly improves quality of life
• "Side effects?" - Mouth sores, nail changes (usually mild)  
• "Can I stop taking it?" - Only with doctor guidance

*Remember: This is general information. Always work with your healthcare team for personalized treatment decisions.*

What specific aspect of hydroxyurea would you like to know more about, warrior? 💪`;
        }
        
        // Pain management
        if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('aching')) {
            return `💪 I understand pain is such a difficult part of the warrior journey. Here are strategies that help many in our community:

🌡️ **Heat therapy** (heating pads, warm baths)
🌬️ **Deep breathing** exercises - in for 4, hold for 4, out for 4
💧 **Stay hydrated** - dehydration can trigger crises
🎵 **Distraction techniques** (music, movies, prayer)
💊 **Take prescribed medications** as directed
🙏 **Prayer and meditation** for spiritual strength

**When to seek help:**
• Pain over 7/10 that doesn't improve
• Shortness of breath
• Fever over 101°F
• Signs of stroke

"He heals the brokenhearted and binds up their wounds." - Psalm 147:3

What type of pain are you experiencing today, warrior? I'm here to support you through this. 💜`;
        }
        
        // Default encouraging response
        return `Hello, mighty warrior! 🦅 I'm here to support you on your journey. Whether you need:

💪 **Encouragement** during tough times
🏥 **Health information** about sickle cell  
👥 **Community resources** and connections
🙏 **Faith-based support** and prayer

I'm ready to help. What's on your heart today?

"From pain comes strength • Through faith we hope" - that's not just our motto, that's your story! 🌟`;
    }
}

// Make it globally available
window.DirectWarriorBotAI = DirectWarriorBotAI;