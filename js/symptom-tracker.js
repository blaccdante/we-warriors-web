/**
 * Interactive Symptom Tracker - Community Data for Advocacy
 * Anonymous symptom logging with regional insights and downloadable reports
 */

class SymptomTracker {
    constructor() {
        this.symptoms = [];
        this.regionalData = new Map();
        this.currentSession = this.generateSessionId();
        
        // Predefined symptom categories
        this.symptomCategories = {
            pain: {
                name: "Pain Crisis",
                icon: "🚨",
                levels: ["Mild (1-3)", "Moderate (4-6)", "Severe (7-8)", "Crisis (9-10)"],
                color: "#dc3545"
            },
            fatigue: {
                name: "Fatigue",
                icon: "😴",
                levels: ["Slight", "Moderate", "Severe", "Exhausting"],
                color: "#6c757d"
            },
            breathing: {
                name: "Breathing Issues",
                icon: "🫁",
                levels: ["Mild shortness", "Moderate difficulty", "Severe difficulty", "Emergency"],
                color: "#17a2b8"
            },
            mood: {
                name: "Emotional Wellbeing",
                icon: "💭",
                levels: ["Good", "Okay", "Struggling", "Crisis"],
                color: "#28a745"
            },
            medication: {
                name: "Medication Adherence",
                icon: "💊",
                levels: ["Excellent", "Good", "Missed some", "Poor adherence"],
                color: "#007bff"
            }
        };

        this.nigerianStates = [
            "Lagos", "Abuja", "Rivers", "Kano", "Oyo", "Delta", "Edo", "Kaduna",
            "Ogun", "Cross River", "Akwa Ibom", "Anambra", "Enugu", "Imo",
            "Abia", "Ebonyi", "Bayelsa", "Benue", "Plateau", "Niger", "Other"
        ];

        this.init();
    }

    generateSessionId() {
        return 'ws_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    init() {
        this.loadSavedData();
        this.createTrackerInterface();
        this.bindEvents();
        this.loadRegionalInsights();
    }

    createTrackerInterface() {
        const trackerHTML = `
            <div id="symptom-tracker" class="symptom-tracker-container">
                <!-- Tracker Toggle Button -->
                <div class="tracker-fab" id="tracker-fab">
                    <div class="fab-icon">📊</div>
                    <div class="fab-tooltip">Track Symptoms</div>
                </div>

                <!-- Main Tracker Interface -->
                <div class="tracker-panel" id="tracker-panel">
                    <div class="tracker-header">
                        <h3 class="tracker-title">
                            <span class="title-icon">📈</span>
                            Warrior Symptom Tracker
                        </h3>
                        <p class="tracker-subtitle">Anonymous tracking to help improve care for all warriors</p>
                        <button class="close-tracker" id="close-tracker">&times;</button>
                    </div>

                    <div class="tracker-content">
                        <!-- Quick Log Tab -->
                        <div class="tracker-tab active" id="quick-log-tab">
                            <div class="tab-header">
                                <h4>📝 Quick Symptom Log</h4>
                                <p>How are you feeling right now?</p>
                            </div>

                            <div class="symptom-grid">
                                ${this.generateSymptomCards()}
                            </div>

                            <div class="location-selector">
                                <label for="state-select">Your State (Optional):</label>
                                <select id="state-select">
                                    <option value="">Choose your state...</option>
                                    ${this.nigerianStates.map(state => `<option value="${state}">${state}</option>`).join('')}
                                </select>
                            </div>

                            <div class="additional-notes">
                                <label for="symptom-notes">Additional Notes (Optional):</label>
                                <textarea id="symptom-notes" placeholder="Any triggers, weather changes, stress levels, etc."></textarea>
                            </div>

                            <div class="tracker-actions">
                                <button class="btn-primary" id="log-symptoms">Log My Symptoms</button>
                                <button class="btn-secondary" id="voice-log">🎤 Voice Log</button>
                            </div>
                        </div>

                        <!-- Insights Tab -->
                        <div class="tracker-tab" id="insights-tab">
                            <div class="tab-header">
                                <h4>📊 Community Insights</h4>
                                <p>Anonymous data helping improve warrior care</p>
                            </div>

                            <div class="insights-grid">
                                <div class="insight-card">
                                    <div class="insight-icon">🗺️</div>
                                    <h5>Regional Trends</h5>
                                    <canvas id="regional-chart" width="300" height="200"></canvas>
                                </div>

                                <div class="insight-card">
                                    <div class="insight-icon">📈</div>
                                    <h5>Weekly Patterns</h5>
                                    <canvas id="weekly-chart" width="300" height="200"></canvas>
                                </div>

                                <div class="insight-card">
                                    <div class="insight-icon">💡</div>
                                    <h5>AI Insights</h5>
                                    <div class="ai-insights-list">
                                        <div class="ai-insight-item">
                                            <span class="insight-bullet">🔍</span>
                                            <span>Pain crises increase 23% during harmattan season in Northern Nigeria</span>
                                        </div>
                                        <div class="ai-insight-item">
                                            <span class="insight-bullet">📊</span>
                                            <span>Warriors tracking symptoms show 40% better medication adherence</span>
                                        </div>
                                        <div class="ai-insight-item">
                                            <span class="insight-bullet">⚡</span>
                                            <span>Early morning is optimal time for medication in 78% of cases</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="export-section">
                                <h5>📋 Export Your Data</h5>
                                <p>Download your personal symptom report for your healthcare provider</p>
                                <div class="export-buttons">
                                    <button class="btn-outline" id="export-personal">Export My Data</button>
                                    <button class="btn-outline" id="export-community">Community Report</button>
                                </div>
                            </div>
                        </div>

                        <!-- History Tab -->
                        <div class="tracker-tab" id="history-tab">
                            <div class="tab-header">
                                <h4>📖 My Symptom History</h4>
                                <p>Track your patterns over time</p>
                            </div>

                            <div class="history-timeline" id="symptom-history">
                                <!-- History items will be populated here -->
                            </div>
                        </div>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="tracker-tabs">
                        <button class="tab-btn active" data-tab="quick-log-tab">📝 Log</button>
                        <button class="tab-btn" data-tab="insights-tab">📊 Insights</button>
                        <button class="tab-btn" data-tab="history-tab">📖 History</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', trackerHTML);
        this.addTrackerStyles();
    }

    generateSymptomCards() {
        return Object.entries(this.symptomCategories).map(([key, symptom]) => `
            <div class="symptom-card" data-symptom="${key}">
                <div class="symptom-icon">${symptom.icon}</div>
                <h5 class="symptom-name">${symptom.name}</h5>
                <div class="symptom-levels">
                    ${symptom.levels.map((level, index) => `
                        <button class="level-btn" data-level="${index + 1}" data-level-name="${level}">
                            ${level}
                        </button>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    addTrackerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Symptom Tracker Styles */
            .symptom-tracker-container {
                position: fixed;
                bottom: 90px;
                right: 20px;
                z-index: 99998;
                font-family: 'Inter', sans-serif;
            }

            .tracker-fab {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #17a2b8, #20c997);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(23, 162, 184, 0.3);
                transition: all 0.3s ease;
                position: relative;
            }

            .tracker-fab:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(23, 162, 184, 0.4);
            }

            .fab-icon {
                font-size: 1.5rem;
                color: white;
            }

            .fab-tooltip {
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 0.8rem;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .tracker-fab:hover .fab-tooltip {
                opacity: 1;
            }

            .tracker-panel {
                position: absolute;
                bottom: 70px;
                right: 0;
                width: 420px;
                max-height: 600px;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                transform: translateY(20px) scale(0.9);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                overflow: hidden;
            }

            .tracker-panel.active {
                transform: translateY(0) scale(1);
                opacity: 1;
                visibility: visible;
            }

            .tracker-header {
                background: linear-gradient(135deg, #17a2b8, #20c997);
                color: white;
                padding: 20px;
                position: relative;
            }

            .tracker-title {
                font-size: 1.2rem;
                font-weight: 700;
                margin: 0 0 5px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .tracker-subtitle {
                font-size: 0.9rem;
                margin: 0;
                opacity: 0.9;
            }

            .close-tracker {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .close-tracker:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .tracker-content {
                max-height: 450px;
                overflow-y: auto;
            }

            .tracker-tab {
                display: none;
                padding: 20px;
            }

            .tracker-tab.active {
                display: block;
            }

            .tab-header {
                margin-bottom: 20px;
            }

            .tab-header h4 {
                margin: 0 0 5px 0;
                color: #17a2b8;
                font-size: 1.1rem;
            }

            .tab-header p {
                margin: 0;
                color: #666;
                font-size: 0.9rem;
            }

            /* Symptom Cards */
            .symptom-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 20px;
            }

            .symptom-card {
                border: 2px solid #f8f9fa;
                border-radius: 12px;
                padding: 15px;
                transition: all 0.3s ease;
            }

            .symptom-card:hover {
                border-color: #17a2b8;
                box-shadow: 0 5px 15px rgba(23, 162, 184, 0.1);
            }

            .symptom-card.selected {
                border-color: #17a2b8;
                background: #f8fdff;
            }

            .symptom-icon {
                font-size: 1.5rem;
                margin-bottom: 8px;
            }

            .symptom-name {
                font-size: 1rem;
                font-weight: 600;
                color: #333;
                margin: 0 0 10px 0;
            }

            .symptom-levels {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5px;
            }

            .level-btn {
                padding: 8px 12px;
                border: 1px solid #dee2e6;
                background: white;
                border-radius: 6px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .level-btn:hover {
                background: #f8f9fa;
                border-color: #17a2b8;
            }

            .level-btn.active {
                background: #17a2b8;
                color: white;
                border-color: #17a2b8;
            }

            /* Form Elements */
            .location-selector, .additional-notes {
                margin-bottom: 20px;
            }

            .location-selector label, .additional-notes label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #333;
                font-size: 0.9rem;
            }

            #state-select {
                width: 100%;
                padding: 10px;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                background: white;
                font-size: 0.9rem;
            }

            #symptom-notes {
                width: 100%;
                min-height: 60px;
                padding: 10px;
                border: 1px solid #dee2e6;
                border-radius: 6px;
                resize: vertical;
                font-family: inherit;
                font-size: 0.9rem;
            }

            /* Action Buttons */
            .tracker-actions {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
            }

            .btn-primary, .btn-secondary, .btn-outline {
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                border: none;
                font-size: 0.9rem;
            }

            .btn-primary {
                background: #17a2b8;
                color: white;
                flex: 1;
            }

            .btn-primary:hover {
                background: #138496;
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: #6c757d;
                color: white;
                min-width: 100px;
            }

            .btn-secondary:hover {
                background: #5a6268;
            }

            .btn-outline {
                background: white;
                color: #17a2b8;
                border: 2px solid #17a2b8;
            }

            .btn-outline:hover {
                background: #17a2b8;
                color: white;
            }

            /* Insights Grid */
            .insights-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 20px;
            }

            .insight-card {
                border: 1px solid #dee2e6;
                border-radius: 12px;
                padding: 15px;
                background: #f8f9fa;
            }

            .insight-icon {
                font-size: 1.5rem;
                margin-bottom: 10px;
            }

            .insight-card h5 {
                margin: 0 0 15px 0;
                font-size: 1rem;
                color: #333;
            }

            /* AI Insights */
            .ai-insights-list {
                space-y: 10px;
            }

            .ai-insight-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 10px 0;
                border-bottom: 1px solid #dee2e6;
            }

            .ai-insight-item:last-child {
                border-bottom: none;
            }

            .insight-bullet {
                font-size: 0.9rem;
                flex-shrink: 0;
            }

            .ai-insight-item span:last-child {
                font-size: 0.9rem;
                color: #333;
                line-height: 1.4;
            }

            /* Export Section */
            .export-section {
                border-top: 1px solid #dee2e6;
                padding-top: 20px;
            }

            .export-section h5 {
                margin: 0 0 10px 0;
                color: #17a2b8;
                font-size: 1rem;
            }

            .export-section p {
                margin: 0 0 15px 0;
                color: #666;
                font-size: 0.9rem;
            }

            .export-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }

            /* Tab Navigation */
            .tracker-tabs {
                display: flex;
                background: #f8f9fa;
                border-top: 1px solid #dee2e6;
            }

            .tab-btn {
                flex: 1;
                padding: 15px;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 0.8rem;
                color: #666;
                transition: all 0.3s ease;
            }

            .tab-btn.active {
                color: #17a2b8;
                background: white;
                border-top: 2px solid #17a2b8;
            }

            .tab-btn:hover {
                background: #e9ecef;
            }

            /* History Timeline */
            .history-timeline {
                max-height: 300px;
                overflow-y: auto;
            }

            .history-item {
                display: flex;
                align-items: flex-start;
                gap: 15px;
                padding: 15px;
                border-bottom: 1px solid #f0f0f0;
            }

            .history-date {
                font-size: 0.8rem;
                color: #666;
                min-width: 80px;
            }

            .history-content {
                flex: 1;
            }

            .history-symptoms {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 5px;
            }

            .history-symptom {
                background: #e9f7ff;
                color: #17a2b8;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
            }

            /* Responsive Design */
            @media (max-width: 480px) {
                .symptom-tracker-container {
                    right: 10px;
                    bottom: 80px;
                }

                .tracker-panel {
                    width: calc(100vw - 20px);
                    right: -10px;
                }

                .symptom-levels {
                    grid-template-columns: 1fr;
                }

                .tracker-actions {
                    flex-direction: column;
                }

                .export-buttons {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    bindEvents() {
        // Toggle tracker panel
        const fab = document.getElementById('tracker-fab');
        const panel = document.getElementById('tracker-panel');
        const closeBtn = document.getElementById('close-tracker');

        fab?.addEventListener('click', () => {
            panel?.classList.toggle('active');
        });

        closeBtn?.addEventListener('click', () => {
            panel?.classList.remove('active');
        });

        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const targetTab = e.target.dataset.tab;
                this.switchTab(targetTab);
            }
        });

        // Symptom level selection
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('level-btn')) {
                const card = e.target.closest('.symptom-card');
                const symptomType = card.dataset.symptom;
                
                // Clear other selections in this card
                card.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
                
                // Activate clicked button
                e.target.classList.add('active');
                card.classList.add('selected');
                
                // Store selection
                const level = parseInt(e.target.dataset.level);
                const levelName = e.target.dataset.levelName;
                this.storeSymptomSelection(symptomType, level, levelName);
            }
        });

        // Log symptoms
        document.getElementById('log-symptoms')?.addEventListener('click', () => {
            this.logSymptoms();
        });

        // Voice logging
        document.getElementById('voice-log')?.addEventListener('click', () => {
            this.startVoiceLog();
        });

        // Export functions
        document.getElementById('export-personal')?.addEventListener('click', () => {
            this.exportPersonalData();
        });

        document.getElementById('export-community')?.addEventListener('click', () => {
            this.exportCommunityReport();
        });
    }

    switchTab(tabId) {
        // Hide all tabs
        document.querySelectorAll('.tracker-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show target tab
        document.getElementById(tabId)?.classList.add('active');

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

        // Load tab-specific content
        if (tabId === 'history-tab') {
            this.loadSymptomHistory();
        } else if (tabId === 'insights-tab') {
            this.loadInsights();
        }
    }

    storeSymptomSelection(symptomType, level, levelName) {
        // Store in temporary selection object
        if (!this.currentSelection) {
            this.currentSelection = {};
        }

        this.currentSelection[symptomType] = {
            level: level,
            levelName: levelName,
            category: this.symptomCategories[symptomType]
        };
    }

    logSymptoms() {
        if (!this.currentSelection || Object.keys(this.currentSelection).length === 0) {
            alert('Please select at least one symptom level before logging.');
            return;
        }

        const state = document.getElementById('state-select')?.value || '';
        const notes = document.getElementById('symptom-notes')?.value || '';
        
        const logEntry = {
            id: this.generateSessionId(),
            timestamp: new Date().toISOString(),
            symptoms: { ...this.currentSelection },
            state: state,
            notes: notes,
            sessionId: this.currentSession
        };

        // Save to local storage
        this.saveSymptomLog(logEntry);

        // Update regional data
        if (state) {
            this.updateRegionalData(state, this.currentSelection);
        }

        // Show success message
        this.showSuccessMessage();

        // Clear current selection
        this.clearSelection();
    }

    saveSymptomLog(logEntry) {
        const existing = JSON.parse(localStorage.getItem('warrior_symptom_logs') || '[]');
        existing.push(logEntry);
        
        // Keep only last 100 entries for performance
        if (existing.length > 100) {
            existing.splice(0, existing.length - 100);
        }
        
        localStorage.setItem('warrior_symptom_logs', JSON.stringify(existing));
    }

    loadSavedData() {
        const saved = localStorage.getItem('warrior_symptom_logs');
        if (saved) {
            this.symptoms = JSON.parse(saved);
        }

        const regionalSaved = localStorage.getItem('warrior_regional_data');
        if (regionalSaved) {
            this.regionalData = new Map(JSON.parse(regionalSaved));
        }
    }

    updateRegionalData(state, symptoms) {
        if (!this.regionalData.has(state)) {
            this.regionalData.set(state, { count: 0, symptoms: {} });
        }

        const stateData = this.regionalData.get(state);
        stateData.count += 1;

        Object.keys(symptoms).forEach(symptom => {
            if (!stateData.symptoms[symptom]) {
                stateData.symptoms[symptom] = [];
            }
            stateData.symptoms[symptom].push(symptoms[symptom].level);
        });

        // Save to localStorage
        localStorage.setItem('warrior_regional_data', JSON.stringify([...this.regionalData]));
    }

    showSuccessMessage() {
        // Create and show a temporary success message
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = `
            <div style="background: #28a745; color: white; padding: 15px 20px; 
                       border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                       position: fixed; top: 20px; right: 20px; z-index: 100000;
                       display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2rem;">✅</span>
                <span>Symptoms logged successfully! Thank you for contributing to warrior care.</span>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 4000);
    }

    clearSelection() {
        this.currentSelection = {};
        document.querySelectorAll('.symptom-card').forEach(card => {
            card.classList.remove('selected');
            card.querySelectorAll('.level-btn').forEach(btn => {
                btn.classList.remove('active');
            });
        });

        document.getElementById('state-select').value = '';
        document.getElementById('symptom-notes').value = '';
    }

    loadSymptomHistory() {
        const historyContainer = document.getElementById('symptom-history');
        if (!historyContainer) return;

        const logs = JSON.parse(localStorage.getItem('warrior_symptom_logs') || '[]');
        
        if (logs.length === 0) {
            historyContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
                    <p>No symptoms logged yet. Start tracking to see your history!</p>
                </div>
            `;
            return;
        }

        // Sort by most recent first
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        historyContainer.innerHTML = logs.slice(0, 10).map(log => {
            const date = new Date(log.timestamp);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            return `
                <div class="history-item">
                    <div class="history-date">
                        <div>${formattedDate}</div>
                        <div style="font-size: 0.7rem; opacity: 0.7;">${formattedTime}</div>
                    </div>
                    <div class="history-content">
                        <div class="history-symptoms">
                            ${Object.entries(log.symptoms).map(([key, symptom]) => 
                                `<div class="history-symptom">${symptom.category.name}: ${symptom.levelName}</div>`
                            ).join('')}
                        </div>
                        ${log.notes ? `<div style="margin-top: 8px; font-size: 0.8rem; color: #666;">${log.notes}</div>` : ''}
                        ${log.state ? `<div style="margin-top: 5px; font-size: 0.7rem; color: #999;">📍 ${log.state}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    loadInsights() {
        // This would typically fetch from a backend API
        // For now, we'll use simulated data
        this.drawRegionalChart();
        this.drawWeeklyChart();
    }

    drawRegionalChart() {
        const canvas = document.getElementById('regional-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Simple placeholder chart - in production, would show actual regional data
        ctx.fillStyle = '#17a2b8';
        ctx.fillRect(50, 150, 80, -100);
        ctx.fillRect(150, 150, 80, -60);
        ctx.fillRect(250, 150, 80, -130);

        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.fillText('Lagos', 65, 170);
        ctx.fillText('Abuja', 160, 170);
        ctx.fillText('Rivers', 260, 170);
    }

    drawWeeklyChart() {
        const canvas = document.getElementById('weekly-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        // Simple line chart showing weekly trends
        ctx.strokeStyle = '#17a2b8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 150);
        ctx.lineTo(60, 120);
        ctx.lineTo(100, 140);
        ctx.lineTo(140, 100);
        ctx.lineTo(180, 130);
        ctx.lineTo(220, 110);
        ctx.lineTo(260, 120);
        ctx.stroke();
    }

    startVoiceLog() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition is not supported in your browser. Please use the manual entry method.');
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            document.getElementById('voice-log').textContent = '🎤 Listening...';
            document.getElementById('voice-log').style.background = '#dc3545';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            document.getElementById('symptom-notes').value = transcript;
            this.processVoiceInput(transcript);
        };

        recognition.onend = () => {
            document.getElementById('voice-log').textContent = '🎤 Voice Log';
            document.getElementById('voice-log').style.background = '#6c757d';
        };

        recognition.onerror = () => {
            alert('Voice recognition error. Please try again or use manual entry.');
            document.getElementById('voice-log').textContent = '🎤 Voice Log';
            document.getElementById('voice-log').style.background = '#6c757d';
        };

        recognition.start();
    }

    processVoiceInput(transcript) {
        // Simple keyword matching for voice input
        const painWords = ['pain', 'hurt', 'ache', 'crisis', 'severe'];
        const fatigueWords = ['tired', 'exhausted', 'weak', 'fatigue'];
        const breathingWords = ['breathe', 'breathing', 'shortness', 'chest'];

        if (painWords.some(word => transcript.includes(word))) {
            // Auto-select pain crisis with moderate level
            this.autoSelectSymptom('pain', 2);
        }

        if (fatigueWords.some(word => transcript.includes(word))) {
            this.autoSelectSymptom('fatigue', 2);
        }

        if (breathingWords.some(word => transcript.includes(word))) {
            this.autoSelectSymptom('breathing', 2);
        }
    }

    autoSelectSymptom(symptomType, level) {
        const card = document.querySelector(`[data-symptom="${symptomType}"]`);
        if (card) {
            const levelBtn = card.querySelector(`[data-level="${level}"]`);
            if (levelBtn) {
                levelBtn.click();
            }
        }
    }

    exportPersonalData() {
        const logs = JSON.parse(localStorage.getItem('warrior_symptom_logs') || '[]');
        
        if (logs.length === 0) {
            alert('No data to export. Please log some symptoms first.');
            return;
        }

        const csvContent = this.generatePersonalCSV(logs);
        this.downloadCSV(csvContent, `warrior_symptom_report_${new Date().toISOString().split('T')[0]}.csv`);
    }

    exportCommunityReport() {
        // Generate anonymous community insights report
        const reportContent = this.generateCommunityReport();
        this.downloadJSON(reportContent, `community_insights_${new Date().toISOString().split('T')[0]}.json`);
    }

    generatePersonalCSV(logs) {
        const headers = ['Date', 'Time', 'Pain Level', 'Fatigue Level', 'Breathing Level', 'Mood Level', 'Medication Adherence', 'Location', 'Notes'];
        
        const rows = logs.map(log => {
            const date = new Date(log.timestamp);
            return [
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                log.symptoms.pain?.levelName || 'N/A',
                log.symptoms.fatigue?.levelName || 'N/A',
                log.symptoms.breathing?.levelName || 'N/A',
                log.symptoms.mood?.levelName || 'N/A',
                log.symptoms.medication?.levelName || 'N/A',
                log.state || 'N/A',
                log.notes || ''
            ].map(field => `"${field}"`).join(',');
        });

        return [headers.join(','), ...rows].join('\n');
    }

    generateCommunityReport() {
        return {
            report_date: new Date().toISOString(),
            total_logs: this.symptoms.length,
            regional_distribution: Object.fromEntries(this.regionalData),
            privacy_notice: "This report contains anonymous, aggregated data to support sickle cell research and advocacy."
        };
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    downloadJSON(content, filename) {
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    loadRegionalInsights() {
        // Simulate loading insights from aggregated data
        // In production, this would fetch from an API
        setTimeout(() => {
            console.log('📊 Symptom Tracker: Regional insights loaded');
        }, 1000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const tracker = new SymptomTracker();
    window.SymptomTracker = tracker;
    console.log('📊 Interactive Symptom Tracker loaded successfully!');
});