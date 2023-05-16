const enLanguages = {
    ar: 'Arabic',
    bn: 'Bengali',
    zh: 'Chinese',
    en: 'English',
    fr: 'French',
    de: 'German',
    hi: 'Hindi',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    jv: 'Javanese',
    ko: 'Korean',
    ms: 'Malay',
    mr: 'Marathi',
    pa: 'Punjabi',
    pt: 'Portuguese',
    ru: 'Russian',
    es: 'Spanish',
    sw: 'Swahili',
    ta: 'Tamil',
    te: 'Telugu',
    tr: 'Turkish',
    uk: 'Ukrainian',
    ur: 'Urdu',
    vi: 'Vietnamese',
    he: 'Hebrew',
    pl: 'Polish',
    fa: 'Persian',
    ro: 'Romanian',
};

const nativeLanguages = {
    zh: '中文',
    es: 'español',
    en: 'English',
    hi: 'हिन्दी',
    ar: 'العربية',
    pt: 'português',
    bn: 'বাংলা',
    ru: 'русский язык',
    ja: '日本語',
    pa: 'ਪੰਜਾਬੀ',
    jv: 'ꦧꦱꦗꦮ',
    id: 'Bahasa Indonesia',
    ms: 'Bahasa Melayu',
    de: 'Deutsch',
    fr: 'français',
    tr: 'Türkçe',
    vi: 'Tiếng Việt',
    ko: '한국어',
    ta: 'தமிழ்',
    it: 'italiano',
    ur: 'اردو',
    pl: 'język polski',
    uk: 'українська мова',
    ro: 'limba română',
    fa: 'فارسی',
    th: 'ไทย',
    nl: 'Nederlands',
    hu: 'magyar',
    he: 'עברית',
    sv: 'svenska',
};

class Languages {
    constructor() {
        this.english = enLanguages;
        this.native = nativeLanguages;
    }

    codes() {
        return Object.keys(this.english);
    }

    getBoth(code) {
        if (code in this.english && code in this.native) {
            return [this.english[code], this.native[code]];
        }
        return null;
    }
}

module.exports = new Languages();
