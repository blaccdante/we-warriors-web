/**
 * Gemini AI Integration for WarriorBot
 * Provides AI responses for emotional and spiritual support
 */

class DirectWarriorBotAI {
    constructor() {
        this.apiKey = 'AIzaSyAnXiZuOwuH22tmB-wJ126P8GGlcHXeIfg';
        this.modelName = 'gemini-2.5-flash-preview-05-20';
    }

    async generateResponse(userMessage) {
        try {
            // Simple, safe prompt for emotional/spiritual content
            const contextPrompt = `You are a caring companion helping someone who faces health challenges. Be encouraging, supportive, and uplifting. Use appropriate emojis and be warm and personal.

User: "${userMessage}"

Response:`;

            const requestBody = {
                contents: [{
                    parts: [{
                        text: contextPrompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 400,
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.9
                }
            };
            
            console.log('🤖 Making AI request for emotional support...');
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const candidate = data.candidates[0];
                
                if (candidate.finishReason === 'SAFETY') {
                    throw new Error('Content filtered');
                }
                
                if (candidate.content && 
                    candidate.content.parts && 
                    candidate.content.parts.length > 0 && 
                    candidate.content.parts[0].text) {
                    
                    const aiResponse = candidate.content.parts[0].text.trim();
                    
                    if (aiResponse.length > 0) {
                        console.log('✅ AI response successful');
                        return aiResponse;
                    }
                }
            }
            
            throw new Error('No valid AI response');
            
        } catch (error) {
            console.log('AI response failed:', error.message);
            // Return null so WarriorBot can use expert fallback
            return null;
        }
    }
}

// Make available globally
window.DirectWarriorBotAI = DirectWarriorBotAI;