/**
 * Sickle Cell News Fetcher
 * Fetches and displays the latest sickle cell disease news and research updates
 */

class SickleCellNewsFetcher {
    constructor() {
        this.newsContainer = document.getElementById('newsGrid');
        console.log('News container found:', !!this.newsContainer);
        
        if (!this.newsContainer) {
            console.error('News container not found!');
            return;
        }
        
        this.init();
    }
    
    init() {
        console.log('Initializing Sickle Cell News Fetcher...');
        this.fetchNews();
    }
    
    async fetchNews() {
        console.log('Starting to fetch real news...');
        try {
            const realNews = await this.fetchRealNews();
            if (realNews && realNews.length > 0) {
                console.log('Got real news:', realNews.length, 'articles');
                this.displayNews(realNews);
            } else {
                console.log('No real news found, showing message');
                this.showNoNewsMessage();
            }
        } catch (error) {
            console.error('Error fetching real news:', error);
            this.showNoNewsMessage();
        }
    }
    
    async fetchRealNews() {
        console.log('Attempting to fetch from RSS feeds...');
        
        const rssFeeds = [
            'https://rss.cnn.com/rss/edition.rss', // General health news
            'https://feeds.reuters.com/reuters/healthNews', // Reuters health
            // We'll use a CORS proxy service to access these feeds
        ];
        
        try {
            // Try using RSS2JSON service for CORS-free RSS access
            const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://rss.cnn.com/rss/edition.rss&count=10';
            const response = await fetch(rssUrl);
            
            if (!response.ok) {
                throw new Error('RSS fetch failed');
            }
            
            const data = await response.json();
            console.log('RSS data received:', data);
            
            if (data.items && data.items.length > 0) {
                // Filter for sickle cell related content
                const sickleCellNews = data.items.filter(item => 
                    item.title.toLowerCase().includes('sickle cell') ||
                    item.description.toLowerCase().includes('sickle cell') ||
                    item.title.toLowerCase().includes('gene therapy') ||
                    item.description.toLowerCase().includes('anemia')
                );
                
                return sickleCellNews.slice(0, 6).map(item => ({
                    title: item.title,
                    summary: this.stripHtml(item.description).substring(0, 200) + '...',
                    date: new Date(item.pubDate).toLocaleDateString(),
                    source: 'CNN Health',
                    url: item.link,
                    image: item.enclosure?.link || null,
                    type: 'news'
                }));
            }
            
            return [];
        } catch (error) {
            console.error('Real news fetch failed:', error);
            return [];
        }
    }
    
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    
    showNoNewsMessage() {
        if (!this.newsContainer) return;
        
        this.newsContainer.innerHTML = `
            <div class="no-news-message" style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📰</div>
                <h3 style="color: var(--text-primary); margin-bottom: 1rem;">Stay Tuned for Latest Updates</h3>
                <p style="color: var(--text-secondary); font-size: 1.1rem; max-width: 500px; margin: 0 auto;">
                    We're working to bring you the latest sickle cell disease news, research updates, and community stories. 
                    Check back soon for breaking developments in treatment and care.
                </p>
                <div style="margin-top: 2rem;">
                    <a href="information/research.html" style="background: var(--primary-color); color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; margin: 0 0.5rem;">Research Updates</a>
                    <a href="community/blog.html" style="background: transparent; color: var(--primary-color); padding: 0.75rem 2rem; border: 2px solid var(--primary-color); border-radius: 8px; text-decoration: none; margin: 0 0.5rem;">Community Blog</a>
                </div>
            </div>
        `;
    }
    
    async fetchFromAPIs() {
        const newsData = [];
        
        try {
            // Try fetching from multiple sources
            const promises = [
                this.fetchPubMedArticles(),
                this.fetchGeneralNews()
            ];
            
            const results = await Promise.allSettled(promises);
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    newsData.push(...result.value);
                }
            });
            
            if (newsData.length > 0) {
                this.displayNews(newsData.slice(0, 6)); // Show top 6 articles
            } else {
                throw new Error('No news data retrieved from APIs');
            }
            
        } catch (error) {
            console.error('Error fetching from APIs:', error);
            throw error;
        }
    }
    
    async fetchPubMedArticles() {
        try {
            // This is a simplified example - in production you'd need proper API keys and handling
            const searchTerms = 'sickle cell disease OR sickle cell anemia OR gene therapy sickle cell';
            const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerms)}&retmax=5&sort=pub_date&retmode=json`;
            
            // Note: This would require CORS handling or a backend proxy
            // For now, we'll return mock data
            return this.getMockResearchNews();
            
        } catch (error) {
            console.warn('PubMed fetch failed:', error);
            return [];
        }
    }
    
    async fetchGeneralNews() {
        try {
            // This would require a News API key
            // For now, we'll return mock data
            return this.getMockGeneralNews();
            
        } catch (error) {
            console.warn('General news fetch failed:', error);
            return [];
        }
    }
    
    getMockResearchNews() {
        return [
            {
                title: "New Gene Therapy Shows Promise for Sickle Cell Disease",
                summary: "Recent clinical trials demonstrate significant improvements in patients treated with CRISPR-based gene therapy, with 95% showing reduced pain crises.",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                source: "Nature Medicine",
                url: "https://www.nature.com/nm/",
                image: null,
                type: "research"
            },
            {
                title: "FDA Approves Breakthrough Sickle Cell Treatment",
                summary: "The FDA has approved a new treatment that targets the root cause of sickle cell disease, offering hope to thousands of patients worldwide.",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                source: "FDA News",
                url: "https://www.fda.gov/",
                image: null,
                type: "treatment"
            }
        ];
    }
    
    getMockGeneralNews() {
        return [
            {
                title: "Global Initiative Launched to Combat Sickle Cell Disease",
                summary: "World Health Organization announces new global initiative to improve access to sickle cell care in developing countries, particularly in Africa.",
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                source: "WHO",
                url: "https://www.who.int/",
                image: null,
                type: "global"
            },
            {
                title: "Patient Advocacy Groups Unite for Better Sickle Cell Care",
                summary: "Major patient advocacy organizations join forces to push for better insurance coverage and access to innovative treatments.",
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                source: "Sickle Cell Disease Association",
                url: "https://www.sicklecelldisease.org/",
                image: null,
                type: "advocacy"
            }
        ];
    }
    
    getFallbackNews() {
        return [
            {
                title: "Revolutionary Gene Therapy Offers Hope for Sickle Cell Patients",
                summary: "Scientists have developed a groundbreaking gene therapy that could potentially cure sickle cell disease by correcting the genetic defect at its source.",
                date: "January 15, 2025",
                source: "Medical Research Journal",
                url: "information/research.html",
                image: null,
                type: "research"
            },
            {
                title: "New Treatment Reduces Pain Episodes by 70% in Clinical Trial",
                summary: "A promising new medication has shown remarkable results in reducing the frequency and severity of painful vaso-occlusive crises in sickle cell patients.",
                date: "January 12, 2025",
                source: "Clinical Trials Today",
                url: "information/diagnosis-treatment.html",
                image: null,
                type: "treatment"
            },
            {
                title: "Global Health Initiative Expands Sickle Cell Care Access",
                summary: "International health organizations announce major funding to improve sickle cell disease care and awareness in underserved communities worldwide.",
                date: "January 10, 2025",
                source: "Global Health News",
                url: "community/blog.html",
                image: null,
                type: "global"
            },
            {
                title: "Young Researcher Wins Award for Sickle Cell Innovation",
                summary: "A 25-year-old researcher with sickle cell disease herself has won a prestigious award for developing a new early detection method for complications.",
                date: "January 8, 2025",
                source: "Science Innovation Awards",
                url: "community/warrior-stories.html",
                image: null,
                type: "innovation"
            },
            {
                title: "Patient Registry Study Reveals Key Insights",
                summary: "The largest-ever patient registry study provides new insights into sickle cell disease patterns, helping doctors better understand treatment outcomes.",
                date: "January 5, 2025",
                source: "Patient Registry Consortium",
                url: "information/research.html",
                image: null,
                type: "study"
            },
            {
                title: "Community Support Programs Show Mental Health Benefits",
                summary: "New research demonstrates that community support programs significantly improve mental health outcomes for sickle cell patients and their families.",
                date: "January 3, 2025",
                source: "Community Health Research",
                url: "support/support-groups.html",
                image: null,
                type: "community"
            }
        ];
    }
    
    displayNews(newsData) {
        if (!this.newsContainer) return;
        
        // Clear loading state
        this.newsContainer.innerHTML = '';
        
        newsData.forEach(article => {
            const newsCard = this.createNewsCard(article);
            this.newsContainer.appendChild(newsCard);
        });
        
        console.log(`Displayed ${newsData.length} news articles`);
    }
    
    displayFallbackNews() {
        console.log('Displaying fallback news...');
        this.displayNews(this.fallbackNews);
    }
    
    displayErrorMessage() {
        if (!this.newsContainer) return;
        
        this.newsContainer.innerHTML = `
            <div class="news-error" style="text-align: center; padding: 2rem; color: #ff6b6b;">
                <h3>Unable to load news</h3>
                <p>Please check back later for the latest sickle cell news and updates.</p>
            </div>
        `;
    }
    
    createNewsCard(article) {
        const card = document.createElement('article');
        card.className = 'news-card scroll-reveal';
        
        const typeIcon = this.getTypeIcon(article.type);
        const imageHtml = article.image ? 
            `<img src="${article.image}" alt="${article.title}" class="news-image">` :
            `<div class="news-image" style="display: flex; align-items: center; justify-content: center; font-size: 3rem; background: linear-gradient(135deg, #ff6b6b, #4ecdc4);">${typeIcon}</div>`;
        
        card.innerHTML = `
            ${imageHtml}
            <div class="news-content">
                <div class="news-date">${article.date}</div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-summary">${article.summary}</p>
                <div class="news-source">
                    <span class="news-source-name">${article.source}</span>
                    <a href="${article.url}" class="news-read-more" target="_blank" rel="noopener noreferrer">Read More</a>
                </div>
            </div>
        `;
        
        return card;
    }
    
    getTypeIcon(type) {
        const icons = {
            research: '🔬',
            treatment: '💊',
            global: '🌍',
            advocacy: '📢',
            innovation: '💡',
            study: '📊',
            community: '🤝',
            default: '📰'
        };
        
        return icons[type] || icons.default;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking for news grid...');
    const newsGrid = document.getElementById('newsGrid');
    
    if (newsGrid) {
        console.log('News grid found, initializing news fetcher...');
        try {
            window.sickleCellNews = new SickleCellNewsFetcher();
            console.log('News fetcher initialized successfully');
        } catch (error) {
            console.error('Error initializing news fetcher:', error);
        }
    } else {
        console.log('No news grid found on this page');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SickleCellNewsFetcher;
}