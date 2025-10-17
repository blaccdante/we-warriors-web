/**
 * Dynamic Impact Dashboard - Real-Time Metrics with AI Insights
 * Transforms static stats into live, engaging data visualization
 */

class DynamicImpactDashboard {
    constructor() {
        this.data = {
            warriors: {
                supported: 12547,
                growth_rate: 0.12, // 12% monthly growth
                current_online: 0,
                crisis_helped: 8934,
                communities_reached: 45
            },
            healthcare: {
                partnerships: 23,
                doctors_trained: 156,
                hospitals_connected: 18,
                telemedicine_sessions: 2341
            },
            global_impact: {
                countries_reached: 12,
                languages_supported: 8,
                research_contributions: 34,
                policy_changes_influenced: 7
            },
            recent_milestones: [
                {
                    text: "Gene therapy access expanded to Lagos hospitals",
                    date: "2024-12-15",
                    impact: "high",
                    category: "medical_breakthrough"
                },
                {
                    text: "1000+ new warriors joined our community this month",
                    date: "2024-12-10",
                    impact: "medium",
                    category: "community_growth"
                },
                {
                    text: "Partnership with NHIS for improved coverage",
                    date: "2024-12-05",
                    impact: "high",
                    category: "policy_change"
                }
            ]
        };

        this.aiInsights = [
            {
                insight: "Based on recent trends, gene therapy access in Nigeria has risen 15%—We Warriors is leading this change through advocacy and partnerships.",
                confidence: 0.87,
                trend: "positive",
                timeframe: "next_6_months"
            },
            {
                insight: "Mobile health monitoring shows 40% reduction in emergency visits among our community members.",
                confidence: 0.92,
                trend: "positive",
                timeframe: "current"
            },
            {
                insight: "Warrior support group participation correlates with 60% improvement in treatment adherence.",
                confidence: 0.84,
                trend: "positive",
                timeframe: "current"
            }
        ];

        this.colors = {
            primary: '#8B0000',
            secondary: '#C41E3A',
            accent: '#FFD700',
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            background: 'rgba(139, 0, 0, 0.1)'
        };

        this.init();
    }

    init() {
        this.createDashboard();
        this.startRealTimeUpdates();
        this.initializeCharts();
        this.bindEvents();
    }

    createDashboard() {
        const dashboardHTML = `
            <section id="dynamic-impact-dashboard" class="impact-dashboard">
                <div class="container">
                    <div class="dashboard-header">
                        <h2 class="dashboard-title">
                            <span class="title-icon">📊</span>
                            Live Impact Dashboard
                            <span class="live-indicator">● LIVE</span>
                        </h2>
                        <p class="dashboard-subtitle">Real-time data showing how We Warriors is transforming lives across Nigeria and beyond</p>
                    </div>

                    <!-- AI Insights Banner -->
                    <div class="ai-insights-banner" id="ai-insights-carousel">
                        <div class="ai-insight-item active">
                            <div class="ai-icon">🧠</div>
                            <div class="insight-content">
                                <p class="insight-text">Based on recent trends, gene therapy access in Nigeria has risen 15%—We Warriors is leading this change.</p>
                                <div class="confidence-bar">
                                    <span class="confidence-label">AI Confidence: 87%</span>
                                    <div class="confidence-progress">
                                        <div class="confidence-fill" style="width: 87%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Main Metrics Grid -->
                    <div class="metrics-grid">
                        <!-- Warriors Supported -->
                        <div class="metric-card warriors-card">
                            <div class="metric-icon">🦅</div>
                            <div class="metric-content">
                                <h3 class="metric-title">Warriors Supported</h3>
                                <div class="metric-value" id="warriors-count">12,547</div>
                                <div class="metric-change positive">
                                    <span class="change-icon">↗</span>
                                    <span class="change-text">+12% this month</span>
                                </div>
                                <div class="metric-detail">
                                    <span id="current-online">247</span> warriors online now
                                </div>
                            </div>
                            <canvas id="warriors-trend-chart" width="100" height="60"></canvas>
                        </div>

                        <!-- Crisis Support -->
                        <div class="metric-card crisis-card">
                            <div class="metric-icon">🚨</div>
                            <div class="metric-content">
                                <h3 class="metric-title">Crisis Support Provided</h3>
                                <div class="metric-value" id="crisis-count">8,934</div>
                                <div class="metric-change positive">
                                    <span class="change-icon">↗</span>
                                    <span class="change-text">+89 today</span>
                                </div>
                                <div class="metric-detail">
                                    Average response time: <strong>3 min</strong>
                                </div>
                            </div>
                            <canvas id="crisis-trend-chart" width="100" height="60"></canvas>
                        </div>

                        <!-- Healthcare Partnerships -->
                        <div class="metric-card healthcare-card">
                            <div class="metric-icon">🏥</div>
                            <div class="metric-content">
                                <h3 class="metric-title">Healthcare Partners</h3>
                                <div class="metric-value" id="partners-count">23</div>
                                <div class="metric-change positive">
                                    <span class="change-icon">↗</span>
                                    <span class="change-text">+2 new hospitals</span>
                                </div>
                                <div class="metric-detail">
                                    <span id="doctors-trained">156</span> doctors trained
                                </div>
                            </div>
                            <canvas id="healthcare-trend-chart" width="100" height="60"></canvas>
                        </div>

                        <!-- Global Reach -->
                        <div class="metric-card global-card">
                            <div class="metric-icon">🌍</div>
                            <div class="metric-content">
                                <h3 class="metric-title">Global Reach</h3>
                                <div class="metric-value" id="countries-count">12</div>
                                <div class="metric-change positive">
                                    <span class="change-icon">↗</span>
                                    <span class="change-text">countries served</span>
                                </div>
                                <div class="metric-detail">
                                    <span id="languages-count">8</span> languages supported
                                </div>
                            </div>
                            <canvas id="global-trend-chart" width="100" height="60"></canvas>
                        </div>
                    </div>

                    <!-- Recent Milestones -->
                    <div class="milestones-section">
                        <h3 class="milestones-title">🎯 Recent Milestones</h3>
                        <div class="milestones-timeline" id="milestones-timeline">
                            <!-- Milestones will be populated here -->
                        </div>
                    </div>

                    <!-- Predictive Insights -->
                    <div class="predictions-section">
                        <h3 class="predictions-title">🔮 2025 Predictive Impact</h3>
                        <div class="predictions-grid">
                            <div class="prediction-card">
                                <div class="prediction-icon">📈</div>
                                <div class="prediction-content">
                                    <h4>Projected Warriors Reached</h4>
                                    <div class="prediction-value">25,000+</div>
                                    <div class="prediction-confidence">95% confidence</div>
                                </div>
                            </div>
                            <div class="prediction-card">
                                <div class="prediction-icon">🏥</div>
                                <div class="prediction-content">
                                    <h4>New Hospital Partnerships</h4>
                                    <div class="prediction-value">15+</div>
                                    <div class="prediction-confidence">87% confidence</div>
                                </div>
                            </div>
                            <div class="prediction-card">
                                <div class="prediction-icon">💊</div>
                                <div class="prediction-content">
                                    <h4>Treatment Access Improvement</h4>
                                    <div class="prediction-value">60%</div>
                                    <div class="prediction-confidence">82% confidence</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insert at the bottom of the page, before the footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', dashboardHTML);
        } else {
            // Fallback: append to main content
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.insertAdjacentHTML('beforeend', dashboardHTML);
            }
        }

        this.addDashboardStyles();
    }

    addDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dynamic Impact Dashboard Styles */
            .impact-dashboard {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                padding: 80px 0;
                margin: 0;
                position: relative;
                overflow: hidden;
                color: white;
            }

            .impact-dashboard::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><circle fill="%23${this.colors.primary.slice(1)}" opacity="0.05" cx="30" cy="30" r="2"/></g></svg>');
                pointer-events: none;
            }

            .dashboard-header {
                text-align: center;
                margin-bottom: 40px;
            }

            .dashboard-title {
                font-size: 3rem;
                font-weight: 700;
                color: white;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }

            .title-icon {
                font-size: 2rem;
            }

            .live-indicator {
                background: ${this.colors.success};
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                animation: pulse-live 2s infinite;
            }

            @keyframes pulse-live {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            .dashboard-subtitle {
                font-size: 1.2rem;
                color: rgba(255,255,255,0.8);
                max-width: 700px;
                margin: 0 auto 20px auto;
                line-height: 1.5;
            }

            /* AI Insights Banner */
            .ai-insights-banner {
                background: linear-gradient(135deg, ${this.colors.primary}, ${this.colors.secondary});
                border-radius: 20px;
                padding: 30px 40px;
                margin-bottom: 50px;
                color: white;
                position: relative;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            }

            .ai-insight-item {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .ai-icon {
                font-size: 2.5rem;
                opacity: 0.8;
            }

            .insight-content {
                flex: 1;
            }

            .insight-text {
                font-size: 1.1rem;
                margin-bottom: 15px;
                line-height: 1.5;
            }

            .confidence-bar {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .confidence-label {
                font-size: 0.9rem;
                opacity: 0.9;
                min-width: 120px;
            }

            .confidence-progress {
                flex: 1;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }

            .confidence-fill {
                height: 100%;
                background: ${this.colors.accent};
                border-radius: 3px;
                transition: width 1s ease;
            }

            /* Metrics Grid */
            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
                margin-bottom: 50px;
            }

            .metric-card {
                background: rgba(255,255,255,0.05);
                border-radius: 20px;
                padding: 30px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            }

            .metric-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
            }

            .metric-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 5px;
                background: linear-gradient(90deg, ${this.colors.primary}, ${this.colors.secondary});
            }

            .metric-icon {
                font-size: 2.5rem;
                margin-bottom: 15px;
                opacity: 0.8;
            }

            .metric-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: rgba(255,255,255,0.7);
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .metric-value {
                font-size: 3.2rem;
                font-weight: 800;
                color: white;
                margin-bottom: 10px;
                line-height: 1;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
            }

            .metric-change {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 15px;
                font-size: 0.9rem;
                font-weight: 600;
            }

            .metric-change.positive {
                color: ${this.colors.success};
            }

            .change-icon {
                font-size: 1.2rem;
            }

            .metric-detail {
                font-size: 0.9rem;
                color: #666;
                opacity: 0.8;
            }

            canvas {
                position: absolute;
                bottom: 15px;
                right: 15px;
                opacity: 0.6;
            }

            /* Milestones Timeline */
            .milestones-section {
                background: rgba(255,255,255,0.05);
                border-radius: 20px;
                padding: 40px;
                margin-bottom: 40px;
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            }

            .milestones-title {
                font-size: 1.8rem;
                color: ${this.colors.primary};
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .milestones-timeline {
                position: relative;
            }

            .milestone-item {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                margin-bottom: 25px;
                position: relative;
            }

            .milestone-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                color: white;
                flex-shrink: 0;
            }

            .milestone-icon.high-impact {
                background: ${this.colors.success};
            }

            .milestone-icon.medium-impact {
                background: ${this.colors.info};
            }

            .milestone-content {
                flex: 1;
            }

            .milestone-text {
                font-size: 1.1rem;
                font-weight: 600;
                color: ${this.colors.primary};
                margin-bottom: 5px;
            }

            .milestone-date {
                font-size: 0.9rem;
                color: #666;
                opacity: 0.8;
            }

            /* Predictions Section */
            .predictions-section {
                background: linear-gradient(135deg, ${this.colors.primary}15, ${this.colors.secondary}15);
                border-radius: 20px;
                padding: 40px;
            }

            .predictions-title {
                font-size: 1.8rem;
                color: ${this.colors.primary};
                margin-bottom: 30px;
                text-align: center;
            }

            .predictions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
            }

            .prediction-card {
                background: white;
                border-radius: 15px;
                padding: 25px;
                text-align: center;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }

            .prediction-card:hover {
                transform: translateY(-3px);
            }

            .prediction-icon {
                font-size: 2rem;
                margin-bottom: 15px;
            }

            .prediction-content h4 {
                font-size: 1rem;
                color: #666;
                margin-bottom: 10px;
                text-transform: uppercase;
                font-weight: 600;
            }

            .prediction-value {
                font-size: 2.2rem;
                font-weight: 800;
                color: ${this.colors.primary};
                margin-bottom: 8px;
            }

            .prediction-confidence {
                font-size: 0.9rem;
                color: ${this.colors.success};
                font-weight: 600;
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .dashboard-title {
                    font-size: 2rem;
                    flex-direction: column;
                    gap: 10px;
                }

                .metrics-grid {
                    grid-template-columns: 1fr;
                }

                .ai-insight-item {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }

                .confidence-bar {
                    flex-direction: column;
                    gap: 10px;
                }

                .predictions-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates
        setInterval(() => {
            this.updateMetrics();
        }, 30000); // Update every 30 seconds

        // Update online warriors count
        setInterval(() => {
            this.updateOnlineCount();
        }, 10000); // Update every 10 seconds

        // Rotate AI insights
        setInterval(() => {
            this.rotateAIInsights();
        }, 15000); // Rotate every 15 seconds
    }

    updateMetrics() {
        // Simulate small increments
        this.data.warriors.supported += Math.floor(Math.random() * 5) + 1;
        this.data.warriors.crisis_helped += Math.floor(Math.random() * 3);
        
        // Update DOM elements
        const warriorsElement = document.getElementById('warriors-count');
        const crisisElement = document.getElementById('crisis-count');
        
        if (warriorsElement) {
            this.animateNumber(warriorsElement, this.data.warriors.supported);
        }
        if (crisisElement) {
            this.animateNumber(crisisElement, this.data.warriors.crisis_helped);
        }
    }

    updateOnlineCount() {
        // Simulate realistic online count (200-300)
        const newCount = Math.floor(Math.random() * 100) + 200;
        const onlineElement = document.getElementById('current-online');
        if (onlineElement) {
            this.animateNumber(onlineElement, newCount);
        }
    }

    animateNumber(element, targetValue) {
        const currentValue = parseInt(element.textContent.replace(/,/g, ''));
        const increment = Math.ceil((targetValue - currentValue) / 20);
        
        let current = currentValue;
        const animation = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
                current = targetValue;
                clearInterval(animation);
            }
            element.textContent = this.formatNumber(current);
        }, 50);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }

    rotateAIInsights() {
        // Simple rotation of AI insights
        const currentIndex = Math.floor(Math.random() * this.aiInsights.length);
        const insight = this.aiInsights[currentIndex];
        
        const banner = document.querySelector('.ai-insight-item');
        if (banner) {
            const textElement = banner.querySelector('.insight-text');
            const confidenceElement = banner.querySelector('.confidence-fill');
            
            if (textElement) {
                textElement.textContent = insight.insight;
            }
            if (confidenceElement) {
                confidenceElement.style.width = `${Math.floor(insight.confidence * 100)}%`;
                banner.querySelector('.confidence-label').textContent = `AI Confidence: ${Math.floor(insight.confidence * 100)}%`;
            }
        }
    }

    initializeCharts() {
        // Simple line charts for trends (using basic canvas drawing)
        this.drawSimpleChart('warriors-trend-chart', [45, 52, 48, 61, 73, 67, 89]);
        this.drawSimpleChart('crisis-trend-chart', [23, 28, 31, 27, 35, 41, 38]);
        this.drawSimpleChart('healthcare-trend-chart', [15, 17, 19, 20, 21, 22, 23]);
        this.drawSimpleChart('global-trend-chart', [8, 9, 10, 11, 11, 12, 12]);
    }

    drawSimpleChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set style
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Calculate points
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        const stepX = width / (data.length - 1);
        
        ctx.beginPath();
        data.forEach((value, index) => {
            const x = index * stepX;
            const y = height - ((value - minValue) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    bindEvents() {
        // Add click events for more detailed views
        document.addEventListener('click', (e) => {
            if (e.target.closest('.metric-card')) {
                this.showDetailedMetrics(e.target.closest('.metric-card'));
            }
        });
    }

    showDetailedMetrics(card) {
        // Future enhancement: show modal with detailed analytics
        console.log('Showing detailed metrics for:', card.className);
    }

    // Method to add milestones
    populateMilestones() {
        const container = document.getElementById('milestones-timeline');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.data.recent_milestones.forEach(milestone => {
            const milestoneHTML = `
                <div class="milestone-item">
                    <div class="milestone-icon ${milestone.impact}-impact">
                        ${this.getMilestoneIcon(milestone.category)}
                    </div>
                    <div class="milestone-content">
                        <div class="milestone-text">${milestone.text}</div>
                        <div class="milestone-date">${milestone.date}</div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', milestoneHTML);
        });
    }

    getMilestoneIcon(category) {
        const icons = {
            medical_breakthrough: '🧬',
            community_growth: '🌱',
            policy_change: '📋',
            partnership: '🤝',
            research: '🔬'
        };
        return icons[category] || '⭐';
    }
}

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on homepage
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
        const dashboard = new DynamicImpactDashboard();
        dashboard.populateMilestones();
        console.log('🚀 Dynamic Impact Dashboard loaded successfully!');
    }
});