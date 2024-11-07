// Language configuration
const LANGUAGES = {
    en: {
        flag: 'gb',
        name: 'English',
        dir: 'ltr'
    },
    fr: {
        flag: 'fr',
        name: 'Français',
        dir: 'ltr'
    },
    ar: {
        flag: 'sa',
        name: 'العربية',
        dir: 'rtl'
    }
};

// Initialize i18next with local storage support
function initializeI18n() {
    const savedLang = localStorage.getItem('userLanguage') || 'en';
    
    i18next.use(i18nextHttpBackend).init({
        lng: savedLang,
        fallbackLng: 'en',
        debug: false,
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    }).then(function(t) {
        updateContent();
        updateLanguageButton(savedLang);
        updateDocumentDirection(savedLang);
    }).catch(function(err) {
        console.error('Error initializing i18next:', err);
    });
}

// Update document direction based on language
function updateDocumentDirection(lang) {
    const dir = LANGUAGES[lang]?.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
}

// Update the language button UI
function updateLanguageButton(lang) {
    const button = document.querySelector('.lang-btn .flag-icon');
    if (button) {
        const flagClass = `flag-icon-${LANGUAGES[lang]?.flag || 'gb'}`;
        button.className = `flag-icon ${flagClass}`;
    }
}

// Update content based on data-i18n attributes
function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        const translation = i18next.t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.innerHTML = translation;
        }
    });
}

// Language switcher function
function changeLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    
    localStorage.setItem('userLanguage', lang);
    
    i18next.changeLanguage(lang).then(function() {
        updateContent();
        updateLanguageButton(lang);
        updateDocumentDirection(lang);
        toggleDropdown();
    }).catch(function(err) {
        console.error('Error changing language:', err);
    });
}

// Toggle dropdown function
function toggleDropdown() {
    const dropdown = document.getElementById('langDropdown');
    if (!dropdown) return;
    
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('langDropdown');
    const langBtn = document.querySelector('.lang-btn');
    
    if (!dropdown || !langBtn) return;
    
    if (!langBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeI18n); 