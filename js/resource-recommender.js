/**
 * Personalized Resource Recommender - AI-Powered Pathways
 * Smart quiz system that recommends tailored resources based on user needs
 */

class ResourceRecommender {
    constructor() {
        this.recommendations = [];
        this.userProfile = {};
        
        this.resources = {
            medical: [
                { title: "Hydroxyurea Guide", url: "/information/diagnosis-treatment.html", tags: ["medication", "treatment"] },
                { title: "Pain Crisis Management", url: "/support/about-sickle-cell.html", tags: ["crisis", "pain"] },
                { title: "Gene Therapy Info", url: "/information/gene-therapy-guide.html", tags: ["advanced", "treatment"] }
            ],
            support: [
                { title: "Support Groups", url: "/support/support-groups.html", tags: ["community", "emotional"] },
                { title: "Counseling Services", url: "/support/counseling.html", tags: ["mental-health", "professional"] },
                { title: "Warrior Stories", url: "/community/warrior-stories.html", tags: ["inspiration", "community"] }
            ],
            local: [
                { title: "Lagos Medical Centers", url: "/pages/group-finder.html", tags: ["lagos", "medical"] },
                { title: "Nigerian Healthcare Resources", url: "/support/resources.html", tags: ["nigeria", "healthcare"] }
            ]
        };

        this.init();
    }

    init() {
        this.createRecommenderInterface();
        this.bindEvents();
        this.checkForReturningUser();
    }

    createRecommenderInterface() {
        const recommenderHTML = `
            <div id="resource-recommender" class="recommender-popup" style="display: none;">
                <div class="recommender-content">
                    <div class="recommender-header">
                        <h3>🎯 Find Your Perfect Resources</h3>
                        <p>Quick questions to personalize your experience</p>
                        <button class="close-recommender">&times;</button>
                    </div>
                    
                    <div class="quiz-container" id="quiz-container">
                        <div class="quiz-step active" data-step="1">
                            <h4>Where are you located?</h4>
                            <div class="options">
                                <button class="option-btn" data-value="lagos">Lagos</button>
                                <button class="option-btn" data-value="abuja">Abuja</button>
                                <button class="option-btn" data-value="other-nigeria">Other Nigeria</button>
                                <button class="option-btn" data-value="international">International</button>
                            </div>
                        </div>
                        
                        <div class="quiz-step" data-step="2">
                            <h4>What's your biggest challenge right now?</h4>
                            <div class="options">
                                <button class="option-btn" data-value="pain-management">Managing pain crises</button>
                                <button class="option-btn" data-value="medical-care">Finding good medical care</button>
                                <button class="option-btn" data-value="emotional-support">Need emotional support</button>
                                <button class="option-btn" data-value="information">Learning about treatments</button>
                            </div>
                        </div>
                        
                        <div class="quiz-step" data-step="3">
                            <h4>How can we best help you?</h4>
                            <div class="options">
                                <button class="option-btn" data-value="resources">Send me resources</button>
                                <button class="option-btn" data-value="community">Connect with community</button>
                                <button class="option-btn" data-value="professional">Professional support</button>
                                <button class="option-btn" data-value="all">All of the above</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="recommendations" id="recommendations" style="display: none;">
                        <h4>✨ Personalized for You</h4>
                        <div id="recommendations-list"></div>
                        <button class="btn-primary" id="save-preferences">Save My Preferences</button>
                    </div>
                </div>
            </div>
            
            <style>
            .recommender-popup {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .recommender-content {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                position: relative;
            }
            .recommender-header {
                background: linear-gradient(135deg, #8B0000, #C41E3A);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 20px 20px 0 0;
                position: relative;
            }
            .close-recommender {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            .quiz-container {
                padding: 30px;
            }
            .quiz-step {
                display: none;
            }
            .quiz-step.active {
                display: block;
            }
            .quiz-step h4 {
                text-align: center;
                margin-bottom: 20px;
                color: #333;
            }
            .options {
                display: grid;
                gap: 10px;
            }
            .option-btn {
                padding: 15px 20px;
                border: 2px solid #dee2e6;
                background: white;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }
            .option-btn:hover {
                border-color: #8B0000;
                background: #f8f9fa;
            }
            .recommendations {
                padding: 30px;
            }
            .recommendation-item {
                padding: 15px;
                border: 1px solid #dee2e6;
                border-radius: 10px;
                margin-bottom: 15px;
                background: #f8f9fa;
            }
            .btn-primary {
                width: 100%;
                padding: 15px;
                background: #8B0000;
                color: white;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 20px;
            }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', recommenderHTML);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.handleQuizAnswer(e.target);
            }
            if (e.target.classList.contains('close-recommender')) {
                this.hideRecommender();
            }
            if (e.target.id === 'save-preferences') {
                this.saveUserPreferences();
            }
        });
    }

    showRecommender() {
        document.getElementById('resource-recommender').style.display = 'flex';
    }

    hideRecommender() {
        document.getElementById('resource-recommender').style.display = 'none';
    }

    checkForReturningUser() {
        const hasVisited = localStorage.getItem('warrior_visited');
        if (!hasVisited) {
            setTimeout(() => {
                this.showRecommender();
            }, 10000);
            localStorage.setItem('warrior_visited', 'true');
        }
    }

    handleQuizAnswer(button) {
        const step = parseInt(button.closest('.quiz-step').dataset.step);
        const value = button.dataset.value;
        
        this.userProfile[`step${step}`] = value;
        
        // Move to next step
        const nextStep = step + 1;
        const currentStep = document.querySelector('.quiz-step.active');
        const nextStepElement = document.querySelector(`[data-step="${nextStep}"]`);
        
        if (nextStepElement) {
            currentStep.classList.remove('active');
            nextStepElement.classList.add('active');
        } else {
            this.generateRecommendations();
        }
    }

    generateRecommendations() {
        const recs = [];
        const { step1: location, step2: challenge, step3: preference } = this.userProfile;

        // Location-based recommendations
        if (location === 'lagos') {
            recs.push(...this.resources.local.filter(r => r.tags.includes('lagos')));
        }

        // Challenge-based recommendations
        if (challenge === 'pain-management') {
            recs.push(...this.resources.medical.filter(r => r.tags.includes('pain')));
        } else if (challenge === 'emotional-support') {
            recs.push(...this.resources.support.filter(r => r.tags.includes('emotional')));
        }

        this.showRecommendations(recs);
    }

    showRecommendations(recs) {
        const container = document.getElementById('recommendations-list');
        container.innerHTML = recs.map(rec => `
            <div class="recommendation-item">
                <h5>${rec.title}</h5>
                <a href="${rec.url}" class="btn-link">View Resource →</a>
            </div>
        `).join('');

        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('recommendations').style.display = 'block';
    }

    saveUserPreferences() {
        localStorage.setItem('warrior_profile', JSON.stringify(this.userProfile));
        this.hideRecommender();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    new ResourceRecommender();
    console.log('🎯 Resource Recommender loaded successfully!');
});