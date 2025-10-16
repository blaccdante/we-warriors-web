/**
 * WarriorBot - AI Companion for Sickle Cell Warriors
 * "From Pain comes Strength • Through Faith we Hope"
 * 
 * Features:
 * - 24/7 Crisis Support
 * - Faith-Based Encouragement
 * - Medical Guidance
 * - Animated Warrior Avatar
 * - Voice & Text Input
 * - Emergency Resource Connection
 */

class WarriorBot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.conversations = this.loadConversations();
        this.conversationHistory = [];
        this.warriorStates = ['idle', 'listening', 'thinking', 'speaking', 'encouraging'];
        this.currentState = 'idle';
        
        // Initialize AI system
        this.aiSystem = null;
        this.initializeAI();
        this.faithVerses = [
            {
                verse: "Isaiah 40:31",
                text: "Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."
            },
            {
                verse: "Philippians 4:13",
                text: "I can do all things through Christ who strengthens me."
            },
            {
                verse: "Romans 8:28",
                text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
            },
            {
                verse: "2 Corinthians 12:9",
                text: "My grace is sufficient for you, for my power is made perfect in weakness."
            },
            {
                verse: "Jeremiah 29:11",
                text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future."
            }
        ];
        
        this.crisisResponses = [
            {
                keywords: ['pain', 'crisis', 'hurt', 'agonizing', 'severe', 'emergency'],
                responses: [
                    "I'm here with you, warrior! 💪 First, let's get you through this crisis. Try these immediate steps:\n\n🌡️ **Stay warm** - Use heating pads on painful areas\n💧 **Hydrate** - Drink plenty of water\n🌬️ **Deep breathing** - In for 4, hold for 4, out for 4\n📞 **Consider calling your doctor** if pain is 8/10 or higher\n\nYou are stronger than this pain. Would you like me to help you find the nearest emergency room or call a crisis hotline?",
                    
                    "Hey brave warrior! 🦅 I know this pain feels overwhelming, but remember: 'Those who hope in the Lord will renew their strength' (Isaiah 40:31).\n\n**Immediate help:**\n• Take your prescribed pain medication\n• Apply heat to painful areas\n• Stay hydrated - small sips if nauseous\n• Try meditation or prayer\n\n**When to seek help:**\n• Pain over 7/10 that doesn't improve\n• Shortness of breath\n• Fever over 101°F\n• Signs of stroke\n\nWant me to connect you with emergency resources or guide you through breathing exercises?"
                ]
            },
            {
                keywords: ['sad', 'depressed', 'hopeless', 'scared', 'alone', 'afraid'],
                responses: [
                    "Sweet warrior, I feel your heart right now. 💜 You are NOT alone in this fight - you have an entire community of warriors standing with you, and most importantly, you have divine strength within you.\n\n'The Lord your God is with you, the Mighty Warrior who saves' (Zephaniah 3:17)\n\nIt's okay to feel scared or sad. These emotions are valid, but they don't define your story. You've survived every crisis before this one, and you'll survive this too.\n\nWould you like to:\n• Talk to a counselor (I can connect you)\n• Read some warrior stories for inspiration\n• Have a prayer together\n• Learn some coping techniques",
                    
                    "Precious warrior, your feelings matter and they're completely understandable. Living with sickle cell takes incredible courage every single day. 🌟\n\n**Remember your strength:**\n• You wake up fighting every day\n• You've overcome countless challenges\n• You inspire others just by existing\n• You are fearfully and wonderfully made\n\n'Be strong and courageous! Do not be afraid or discouraged, for the Lord your God is with you wherever you go' (Joshua 1:9)\n\nCan I help you connect with our support community or would you prefer some encouraging warrior stories?"
                ]
            }
        ];

        this.medicalGuidance = {
            'hydroxyurea': "Hydroxyurea is a game-changer for many warriors! 💊 It helps reduce pain crises by increasing fetal hemoglobin. Common tips from our community:\n\n• Take it at the same time daily\n• Stay hydrated (extra important!)\n• Monitor blood counts regularly\n• Side effects like mouth sores can be managed\n• It may take 3-6 months to see full benefits\n\nAlways consult your healthcare team for personalized advice. Would you like me to connect you with our healthcare provider resources?",
            
            'pain management': "Pain management is so personal for each warrior. Here's what our community has learned works:\n\n**During crisis:**\n• Heat therapy (heating pads, warm baths)\n• Meditation and breathing exercises\n• Distraction techniques (music, movies, games)\n• Prescribed medications as directed\n\n**Prevention:**\n• Stay hydrated always\n• Avoid extreme temperatures\n• Regular exercise (gentle)\n• Stress management\n• Good sleep hygiene\n\nRemember: You know your body best. Advocate for yourself! Need help finding pain specialists or support groups?",
            
            'blood transfusion': "Blood transfusions can be lifesaving for warriors! 🩸 Here's what you should know:\n\n**Benefits:**\n• Reduces sickling\n• Improves oxygen delivery\n• Can prevent complications\n• May reduce pain crises\n\n**What to expect:**\n• Usually takes 2-4 hours\n• Monitored closely for reactions\n• May feel more energetic after\n• Regular blood tests needed\n\n**Questions for your team:**\n• How often will I need them?\n• What are my hemoglobin goals?\n• Iron overload monitoring?\n\nWant me to help you prepare questions for your next appointment?"
        };

        this.init();
    }
    
    async initializeAI() {
        try {
            if (window.WarriorBotAI) {
                this.aiSystem = new window.WarriorBotAI();
                await this.aiSystem.initialize();
                console.log('🤖 WarriorBot AI system ready!');
            }
        } catch (error) {
            console.log('WarriorBot running in legacy mode');
        }
    }

    init() {
        this.createBotInterface();
        this.bindEvents();
        this.startAvatarAnimation();
        
        // Show welcome message after page load
        setTimeout(() => {
            if (!localStorage.getItem('warriorbot_welcomed')) {
                this.showWelcomeMessage();
                localStorage.setItem('warriorbot_welcomed', 'true');
            }
        }, 3000);
    }

    createBotInterface() {
        const botHTML = `
            <div id="warriorbot-container" class="warriorbot-closed">
                <!-- Floating Action Button -->
                <div id="warriorbot-fab" class="warriorbot-fab">
                    <div class="warrior-avatar-mini">
                        <div class="warrior-wings"></div>
                        <div class="warrior-body"></div>
                        <div class="pulse-ring"></div>
                    </div>
                    <div class="notification-badge" id="bot-notification" style="display: none;">1</div>
                </div>

                <!-- Chat Interface -->
                <div id="warriorbot-chat" class="warriorbot-chat">
                    <div class="chat-header">
                        <div class="warrior-avatar">
                            <div class="avatar-container">
                                <div class="warrior-wings ${this.currentState}"></div>
                                <div class="warrior-body ${this.currentState}"></div>
                                <div class="warrior-halo"></div>
                            </div>
                        </div>
                        <div class="bot-info">
                            <h3>WarriorBot</h3>
                            <p class="bot-status">Hybrid AI + Expert Knowledge • Always Here for You</p>
                        </div>
                        <button id="close-bot" class="close-btn">&times;</button>
                    </div>

                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be populated here -->
                    </div>

                    <div class="chat-input-container">
                        <div class="quick-actions">
                            <button class="quick-btn crisis-btn" data-message="I'm having a pain crisis, help!">🚨 Crisis Help</button>
                            <button class="quick-btn faith-btn" data-message="I need encouragement and hope">🙏 Need Hope</button>
                            <button class="quick-btn resource-btn" data-message="Show me resources">📚 Resources</button>
                        </div>
                        <div class="input-area">
                            <input type="text" id="chat-input" placeholder="Type your message, warrior..." maxlength="500">
                            <button id="voice-btn" class="voice-btn" title="Voice input">🎤</button>
                            <button id="send-btn" class="send-btn">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', botHTML);
        this.addBotStyles();
    }

    addBotStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* WarriorBot Styles */
            #warriorbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Inter', sans-serif;
            }

            .warriorbot-fab {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%);
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(139, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                transition: all 0.3s ease;
                animation: gentlePulse 3s ease-in-out infinite;
            }

            .warriorbot-fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(139, 0, 0, 0.4);
            }

            .warrior-avatar-mini {
                position: relative;
                width: 30px;
                height: 30px;
            }

            .warrior-wings {
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                width: 25px;
                height: 15px;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                border-radius: 50% 50% 0 0;
                animation: wingFlap 2s ease-in-out infinite;
            }

            .warrior-wings::before,
            .warrior-wings::after {
                content: '';
                position: absolute;
                top: 0;
                width: 12px;
                height: 15px;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                border-radius: 50% 50% 0 0;
            }

            .warrior-wings::before {
                left: -8px;
                transform: rotate(-30deg);
            }

            .warrior-wings::after {
                right: -8px;
                transform: rotate(30deg);
            }

            .warrior-body {
                width: 20px;
                height: 25px;
                background: linear-gradient(135deg, #4A90E2, #7BB3F0);
                border-radius: 50% 50% 40% 40%;
                position: relative;
                margin: 0 auto;
            }

            .warrior-body::before {
                content: '💪';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 10px;
            }

            .pulse-ring {
                position: absolute;
                top: -5px;
                left: -5px;
                width: 70px;
                height: 70px;
                border: 2px solid rgba(139, 0, 0, 0.3);
                border-radius: 50%;
                animation: pulse 2s ease-out infinite;
            }

            .notification-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #FF4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }

            .warriorbot-chat {
                display: none;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                position: absolute;
                bottom: 80px;
                right: 0;
                overflow: hidden;
                border: 2px solid var(--blood-color);
            }

            :root[data-theme="dark"] .warriorbot-chat {
                background: #2C2C2C !important;
                border-color: var(--blood-light) !important;
                color: #E8E8E8 !important;
            }
            
            :root[data-theme="dark"] .chat-header {
                background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%) !important;
            }
            
            :root[data-theme="dark"] .bot-info h3,
            :root[data-theme="dark"] .bot-status {
                color: white !important;
                background: none !important;
                text-shadow: none !important;
            }
            
            /* Target potential black rectangle sources */
            :root[data-theme="dark"] .bot-info {
                background: none !important;
            }
            
            :root[data-theme="dark"] .bot-info h3:before,
            :root[data-theme="dark"] .bot-info h3:after,
            :root[data-theme="dark"] .bot-status:before,
            :root[data-theme="dark"] .bot-status:after {
                display: none !important;
            }
            
            :root[data-theme="dark"] .bot-info h3::selection,
            :root[data-theme="dark"] .bot-status::selection {
                background: rgba(200, 30, 58, 0.3) !important;
                color: white !important;
            }
            
            :root[data-theme="dark"] .bot-info h3::-moz-selection,
            :root[data-theme="dark"] .bot-status::-moz-selection {
                background: rgba(200, 30, 58, 0.3) !important;
                color: white !important;
            }

            #warriorbot-container.warriorbot-open .warriorbot-chat {
                display: flex;
                flex-direction: column;
                animation: slideUpFadeIn 0.3s ease-out;
            }

            .chat-header {
                background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .warrior-avatar {
                width: 50px;
                height: 50px;
                position: relative;
            }

            .avatar-container {
                width: 100%;
                height: 100%;
                position: relative;
            }

            .warrior-avatar .warrior-wings {
                position: absolute;
                top: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 25px;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                border-radius: 50% 50% 0 0;
            }

            .warrior-avatar .warrior-body {
                width: 35px;
                height: 40px;
                background: linear-gradient(135deg, #4A90E2, #7BB3F0);
                border-radius: 50% 50% 40% 40%;
                margin: 0 auto;
                position: relative;
                top: 5px;
            }

            .warrior-halo {
                position: absolute;
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 15px;
                border: 2px solid #FFD700;
                border-radius: 50%;
                border-bottom: none;
                opacity: 0.8;
                animation: haloGlow 3s ease-in-out infinite;
            }

            .bot-info h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 700;
                color: white;
                background: transparent;
                user-select: none;
            }

            .bot-status {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
                color: white;
                background: transparent;
                user-select: none;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                margin-left: auto;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .message {
                max-width: 85%;
                padding: 12px 16px;
                border-radius: 18px;
                line-height: 1.4;
                font-size: 14px;
                position: relative;
                animation: messageSlideIn 0.3s ease-out;
            }

            .message.bot {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                color: #2d3748;
                align-self: flex-start;
                border-bottom-left-radius: 6px;
                border: 1px solid rgba(139, 0, 0, 0.1);
            }

            .message.user {
                background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 6px;
            }

            :root[data-theme="dark"] .message.bot {
                background: #3A3A3A;
                color: #E8E8E8;
                border: 1px solid rgba(200, 30, 58, 0.3);
            }
            
            :root[data-theme="dark"] .message.user {
                background: linear-gradient(135deg, #8B0000 0%, #C41E3A 100%);
                color: white;
            }
            
            :root[data-theme="dark"] .typing-indicator {
                background: #3A3A3A;
                color: #E8E8E8;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 18px;
                border-bottom-left-radius: 6px;
                align-self: flex-start;
                max-width: 85%;
            }

            .typing-dots {
                display: flex;
                gap: 4px;
            }

            .typing-dots span {
                width: 6px;
                height: 6px;
                background: #8B0000;
                border-radius: 50%;
                animation: typingDots 1.4s ease-in-out infinite;
            }

            .typing-dots span:nth-child(1) { animation-delay: 0s; }
            .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

            .chat-input-container {
                padding: 15px;
                border-top: 1px solid rgba(0, 0, 0, 0.1);
            }

            :root[data-theme="dark"] .chat-input-container {
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                background: #2C2C2C;
            }
            
            :root[data-theme="dark"] .quick-btn {
                border-color: rgba(200, 30, 58, 0.6);
                color: #E8E8E8;
                background: rgba(44, 44, 44, 0.8);
            }
            
            :root[data-theme="dark"] .quick-btn:hover,
            :root[data-theme="dark"] .quick-btn.active {
                background: var(--blood-color);
                color: white;
                border-color: var(--blood-color);
            }
            
            :root[data-theme="dark"] .crisis-btn {
                border-color: #ff6666;
                color: #ff6666;
            }
            
            :root[data-theme="dark"] .crisis-btn:hover {
                background: #ff4444;
                color: white;
            }
            
            :root[data-theme="dark"] .faith-btn {
                border-color: #ffd700;
                color: #ffd700;
            }
            
            :root[data-theme="dark"] .faith-btn:hover {
                background: #ffd700;
                color: #333;
            }

            .quick-actions {
                display: flex;
                gap: 3px;
                margin-bottom: 6px;
                flex-wrap: wrap;
                padding: 0;
            }

            .quick-btn {
                padding: 3px 6px;
                border: 1px solid var(--blood-color);
                background: transparent;
                color: var(--blood-color);
                border-radius: 12px;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
                line-height: 1.2;
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .quick-btn:hover,
            .quick-btn.active {
                background: var(--blood-color);
                color: white;
            }

            .crisis-btn { border-color: #ff4444; color: #ff4444; }
            .crisis-btn:hover { background: #ff4444; }
            .faith-btn { border-color: #ffd700; color: #ffd700; }
            .faith-btn:hover { background: #ffd700; color: #333; }

            .input-area {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            #chat-input {
                flex: 1;
                padding: 12px;
                border: 2px solid rgba(139, 0, 0, 0.2);
                border-radius: 25px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }

            #chat-input:focus {
                border-color: var(--blood-color);
            }

            :root[data-theme="dark"] #chat-input {
                background: #3A3A3A;
                color: #E8E8E8;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            :root[data-theme="dark"] #chat-input:focus {
                border-color: var(--blood-light);
                background: #404040;
            }
            
            :root[data-theme="dark"] #chat-input::placeholder {
                color: #B8B8B8;
            }

            .voice-btn,
            .send-btn {
                padding: 12px;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
            }

            .voice-btn {
                background: linear-gradient(135deg, #4A90E2, #7BB3F0);
                color: white;
            }

            .send-btn {
                background: linear-gradient(135deg, #8B0000, #C41E3A);
                color: white;
            }

            .voice-btn:hover,
            .send-btn:hover {
                transform: scale(1.1);
            }

            /* Animations */
            @keyframes gentlePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            @keyframes wingFlap {
                0%, 100% { transform: translateX(-50%) rotateZ(0deg); }
                25% { transform: translateX(-50%) rotateZ(-5deg); }
                75% { transform: translateX(-50%) rotateZ(5deg); }
            }

            @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                100% { transform: scale(1.3); opacity: 0; }
            }

            @keyframes haloGlow {
                0%, 100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
                50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
            }

            @keyframes slideUpFadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes typingDots {
                0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
                40% { transform: scale(1.2); opacity: 1; }
            }

            /* Responsive */
            @media (max-width: 480px) {
                .warriorbot-chat {
                    width: 90vw;
                    height: 60vh;
                    right: 5vw;
                    bottom: 80px;
                    max-height: 500px;
                }
                
                #warriorbot-container {
                    bottom: 15px;
                    right: 15px;
                }
                
                .quick-actions {
                    gap: 2px;
                    margin-bottom: 4px;
                    padding: 0;
                }
                
                .quick-btn {
                    padding: 2px 4px;
                    font-size: 9px;
                    border-radius: 10px;
                    flex: 1;
                    min-width: 0;
                    min-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 1.1;
                }
                
                .chat-messages {
                    padding: 12px;
                }
                
                .message {
                    font-size: 13px;
                    max-width: 90%;
                    padding: 10px 14px;
                }
                
                .chat-input-container {
                    padding: 10px;
                }
                
                #chat-input {
                    font-size: 13px;
                    padding: 10px;
                }
            }
            
            /* Tablet and small desktop */
            @media (max-width: 768px) and (min-width: 481px) {
                .warriorbot-chat {
                    width: 360px;
                    height: 500px;
                    right: 10px;
                    bottom: 75px;
                }
                
                .quick-btn {
                    padding: 3px 7px;
                    font-size: 10px;
                    min-height: 22px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const fab = document.getElementById('warriorbot-fab');
        const closeBtn = document.getElementById('close-bot');
        const sendBtn = document.getElementById('send-btn');
        const voiceBtn = document.getElementById('voice-btn');
        const chatInput = document.getElementById('chat-input');
        const quickBtns = document.querySelectorAll('.quick-btn');

        fab.addEventListener('click', () => this.toggleBot());
        closeBtn.addEventListener('click', () => this.closeBot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const message = btn.dataset.message;
                this.sendMessage(message);
            });
        });
    }

    toggleBot() {
        const container = document.getElementById('warriorbot-container');
        const notification = document.getElementById('bot-notification');
        
        if (this.isOpen) {
            this.closeBot();
        } else {
            container.classList.add('warriorbot-open');
            container.classList.remove('warriorbot-closed');
            this.isOpen = true;
            notification.style.display = 'none';
            
            // Focus input
            setTimeout(() => {
                document.getElementById('chat-input').focus();
            }, 300);
        }
    }

    closeBot() {
        const container = document.getElementById('warriorbot-container');
        container.classList.remove('warriorbot-open');
        container.classList.add('warriorbot-closed');
        this.isOpen = false;
    }

    sendMessage(message = null) {
        const input = document.getElementById('chat-input');
        const messageText = message || input.value.trim();
        
        if (!messageText) return;

        // Clear input if not using quick button
        if (!message) input.value = '';

        // Add user message
        this.addMessage(messageText, 'user');

        // Show typing indicator
        this.showTyping();

        // Process response with AI
        setTimeout(async () => {
            this.hideTyping();
            const response = await this.generateResponse(messageText);
            this.addMessage(response, 'bot');
        }, 1500 + Math.random() * 1000); // Random delay for natural feel
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = this.formatMessage(text);
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to conversation history for AI context
        this.conversationHistory.push({
            message: text,
            sender: sender,
            timestamp: Date.now()
        });
        
        // Keep only last 20 messages for performance
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }

        // Update avatar state
        if (sender === 'bot') {
            this.updateAvatarState('speaking');
            setTimeout(() => this.updateAvatarState('idle'), 3000);
        }
    }

    formatMessage(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '• '); // Keep bullet points
    }

    showTyping() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span>WarriorBot is thinking</span>
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        this.updateAvatarState('thinking');
    }

    hideTyping() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async generateResponse(userMessage) {
        const responseType = this.determineResponseType(userMessage);
        
        if (responseType === 'expert') {
            // Use expert knowledge for medical/crisis topics
            return this.getExpertResponse(userMessage);
        } else {
            // Use AI for emotional/spiritual support
            return await this.getAIResponse(userMessage);
        }
    }
    
    determineResponseType(message) {
        const lowerMessage = message.toLowerCase();
        
        // Medical/Health topics -> Expert responses
        const medicalKeywords = [
            'hydroxyurea', 'medication', 'medicine', 'drug', 'treatment',
            'crisis', 'pain crisis', 'emergency', 'hospital', 'doctor',
            'sickle cell', 'disease', 'symptoms', 'diagnosis', 'medical',
            'blood test', 'hemoglobin', 'anemia', 'infection',
            'vaso-occlusive', 'acute chest syndrome', 'stroke'
        ];
        
        for (let keyword of medicalKeywords) {
            if (lowerMessage.includes(keyword)) {
                return 'expert';
            }
        }
        
        // Default to AI for emotional/spiritual support
        return 'ai';
    }
    
    async getAIResponse(userMessage) {
        try {
            // Try Direct AI first (simple and reliable)
            if (window.DirectWarriorBotAI) {
                const directAI = new window.DirectWarriorBotAI();
                const response = await directAI.generateResponse(userMessage);
                if (response && response.trim().length > 0) {
                    return `🧠 **AI Support**\n\n${response}`;
                }
            }
            
            // Try complex AI system if available
            if (this.aiSystem) {
                const response = await this.aiSystem.generateResponse(userMessage, this.conversationHistory);
                if (response && response.trim().length > 0) {
                    return `🧠 **AI Support**\n\n${response}`;
                }
            }
            
            // Fallback to expert response if AI fails
            console.log('AI unavailable, using expert fallback');
            return this.getExpertResponse(userMessage);
        } catch (error) {
            console.log('AI response failed, using expert fallback:', error);
            return this.getExpertResponse(userMessage);
        }
    }
    
    getExpertResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Hydroxyurea Information
        if (lowerMessage.includes('hydroxyurea') || lowerMessage.includes('medication')) {
            return `📚 **EXPERT KNOWLEDGE**

💊 **Hydroxyurea - Complete Warrior Guide**

**How It Helps:**
• **Reduces pain crises** by 50% in many patients
• **Increases fetal hemoglobin (HbF)** which doesn't sickle
• **Decreases hospitalizations** and acute chest syndrome
• **May prevent organ damage** over time

**Important Details:**
• **Daily medication** - usually one capsule per day
• **Regular monitoring** - blood tests every 3-4 months
• **Takes 3-6 months** to see full benefits
• **Works for about 70%** of people with sickle cell

**Common Side Effects:**
• Lowered white blood cell count (temporary)
• Darkening of skin/nails (harmless)
• Mild nausea (usually goes away)

**Key Points:**
• ✅ Safe for pregnancy planning (discuss with doctor)
• ✅ Can be taken long-term
• ✅ Covered by most insurance
• ✅ Generic versions available

*Always follow your hematologist's guidance on dosing and monitoring.*`;
        }
        
        // Pain Crisis Management
        if (lowerMessage.includes('crisis') || lowerMessage.includes('pain')) {
            return `📚 **EXPERT KNOWLEDGE**

🚨 **Sickle Cell Pain Crisis - Immediate Action Plan**

**RIGHT NOW - At Home:**
🌡️ **Warmth** - Heating pads, warm baths, blankets
💧 **Hydration** - Drink water steadily (avoid ice-cold)
💊 **Pain Medicine** - Take prescribed medications as directed
🛌 **Rest** - Find comfortable positions, avoid activity
🫁 **Breathe** - Deep, slow breaths to help with pain
📱 **Support** - Call someone for emotional support

**SEEK EMERGENCY CARE IF:**
• Pain is **10/10 severe** and not improving with home treatment
• **Difficulty breathing** or chest pain
• **High fever** (over 101°F/38.3°C)
• **Signs of stroke**: sudden weakness, confusion, vision changes, severe headache
• **Priapism** (males): painful erection lasting >2 hours
• **Severe abdominal pain** with vomiting

**HOSPITAL PREPARATION:**
• Bring your **pain management plan**
• List of **current medications**
• **Emergency contacts**
• **Comfort items** (phone charger, blanket)
• **Advocate** if possible

🦅 **You are a warrior. You WILL get through this crisis.** 💪`;
        }
        
        // Sickle Cell Disease Education
        if (lowerMessage.includes('sickle cell') || lowerMessage.includes('disease') || lowerMessage.includes('learn')) {
            return `📚 **EXPERT KNOWLEDGE**

📚 **Sickle Cell Disease - Complete Warrior Knowledge**

**What It Is:**
Sickle cell disease is a genetic condition where red blood cells become crescent-shaped ("sickled") instead of round. These sickled cells can block blood flow, causing pain and organ damage.

**Types:**
• **HbSS** (Sickle Cell Anemia) - most severe
• **HbSC** - usually milder
• **HbS Beta Thalassemia** - varies in severity

**Common Symptoms:**
🔴 **Pain crises** - most common symptom
🔴 **Fatigue and weakness** - from anemia
🔴 **Frequent infections** - spleen damage
🔴 **Delayed growth** - in children
🔴 **Vision problems** - retinal damage
🔴 **Shortness of breath** - from anemia

**Treatment Options:**
💊 **Hydroxyurea** - reduces crises
💊 **Voxelotor (Oxbryta)** - reduces sickling
💊 **Crizanlizumab (Adakveo)** - prevents crises
🩸 **Blood transfusions** - for severe complications
🦴 **Bone marrow transplant** - potential cure for some

**You Are Not Alone:**
100,000+ Americans have sickle cell disease. You're part of a strong warrior community! 🦅

*Work closely with a hematologist who specializes in sickle cell disease.*`;
        }
        
        // Bible Verses / Faith - can be AI or expert
        if (lowerMessage.includes('bible') || lowerMessage.includes('verse') || lowerMessage.includes('faith')) {
            return `🙏 **Bible Verses for Warriors - Strength & Hope**

**For Strength in Suffering:**
*"He gives strength to the weary and increases the power of the weak."* - Isaiah 40:29

*"I can do all things through Christ who strengthens me."* - Philippians 4:13

*"The Lord your God is with you, the Mighty Warrior who saves."* - Zephaniah 3:17

**For Hope in Dark Times:**
*"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."* - Jeremiah 29:11

*"Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."* - Isaiah 40:31

**For Comfort in Pain:**
*"Come to me, all you who are weary and burdened, and I will give you rest."* - Matthew 11:28

*"The Lord is close to the brokenhearted and saves those who are crushed in spirit."* - Psalm 34:18

You are God's beloved warrior - never forget that! 🌟`;
        }
        
        // Encouragement - use expert knowledge version
        if (lowerMessage.includes('encourage') || lowerMessage.includes('hope') || lowerMessage.includes('support')) {
            return `💪 **You Are an Incredible Warrior**

Listen to me - **you are absolutely extraordinary**. Every single day you wake up and face challenges that would break most people, yet here you are, still fighting, still hoping, still believing. That makes you a true warrior! 🦅

**Your Strength is Limitless:**
• You've survived **100%** of your worst days
• Every crisis you've faced has made you stronger
• Your courage inspires others, even when you don't see it
• You are living proof that the human spirit is unbreakable

**Remember This Truth:**
Your condition does **NOT** define you. You are defined by:
• Your heart full of love
• Your spirit that refuses to quit
• Your hope that lights the way for others
• Your faith that moves mountains

*"Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."* - Isaiah 40:31

**You Are:**
🌟 **Stronger** than you realize
🌟 **Braver** than you believe  
🌟 **More loved** than you know
🌟 **More valuable** than precious gems
🌟 **Chosen** for an incredible purpose

**From pain comes strength. Through faith we hope. You are living proof of both.** 💜

Keep fighting, keep believing, keep inspiring. The world needs your light! 🦅✨`;
        }
        
        // Default encouraging response
        return `🦅 **Hello, mighty warrior!**

I'm here to walk alongside you on your journey. Whether you need:

💪 **Encouragement** - When your spirit needs lifting
💊 **Medical Information** - Expert knowledge about treatments  
🚨 **Crisis Support** - Immediate help during difficult times
🙏 **Spiritual Guidance** - Bible verses and faith-based comfort
💜 **Emotional Support** - Someone who understands your struggles
📚 **Education** - Learning about sickle cell disease

I'm equipped with both AI intelligence for emotional support and expert medical knowledge to give you the most helpful response for your specific need.

**"From pain comes strength • Through faith we hope"** - that's your story, warrior! 🌟

What's on your heart today? I'm here to help in whatever way you need most.`;
    }

    updateAvatarState(state) {
        const wings = document.querySelector('.warrior-avatar .warrior-wings');
        const body = document.querySelector('.warrior-avatar .warrior-body');
        
        if (wings && body) {
            wings.className = `warrior-wings ${state}`;
            body.className = `warrior-body ${state}`;
        }
        
        this.currentState = state;
    }

    showWelcomeMessage() {
        const notification = document.getElementById('bot-notification');
        notification.style.display = 'flex';
        
        // Auto-open after 5 seconds if user hasn't interacted
        setTimeout(() => {
            if (!this.isOpen) {
                this.toggleBot();
                setTimeout(() => {
                    this.addMessage(`Hey there, warrior! 🌟 

I'm WarriorBot, your **Hybrid AI Companion**. I noticed you're new here, so I wanted to introduce myself!

🧠 **I combine AI intelligence with expert medical knowledge** to give you the best possible support:

• **🧠 AI Support** for encouragement, conversation, and emotional care
• **📚 Expert Knowledge** for medical information, crisis help, and health education

I'm here 24/7 to help you with:
• **Crisis support** during pain episodes
• **Encouragement** when you need hope  
• **Medical guidance** about treatments like hydroxyurea
• **Faith-based support** with Bible verses and prayer
• **Community** connection with fellow warriors

Feel free to ask me anything - I'll automatically choose the best way to help you! You're never alone in this fight! 💪

*"Those who hope in the Lord will soar on wings like eagles"* - Isaiah 40:31 🦅`, 'bot');
                }, 500);
            }
        }, 5000);
    }

    toggleVoiceInput() {
        // This would integrate with Web Speech API in a real implementation
        alert('Voice input feature coming soon! For now, please type your message. 🎤');
    }

    loadConversations() {
        return JSON.parse(localStorage.getItem('warriorbot_conversations') || '[]');
    }

    saveConversations() {
        localStorage.setItem('warriorbot_conversations', JSON.stringify(this.conversations));
    }

    startAvatarAnimation() {
        // Continuous subtle animations for the avatar
        setInterval(() => {
            if (this.currentState === 'idle') {
                // Random small movements to make avatar feel alive
                if (Math.random() < 0.1) { // 10% chance every interval
                    this.updateAvatarState('listening');
                    setTimeout(() => {
                        if (this.currentState === 'listening') {
                            this.updateAvatarState('idle');
                        }
                    }, 2000);
                }
            }
        }, 3000);
    }
}

// Initialize WarriorBot when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.WarriorBot = new WarriorBot();
    });
} else {
    window.WarriorBot = new WarriorBot();
}