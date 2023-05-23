const enLanguages = {
    en: 'English',
    es: 'Spanish',
    zh: 'Chinese',
    ar: 'Arabic',
    pt: 'Portuguese',
    fr: 'French',
    ru: 'Russian',
    ja: 'Japanese',
    de: 'German',
    ko: 'Korean',
    it: 'Italian',
    tr: 'Turkish',
    pl: 'Polish',
    vi: 'Vietnamese',
    uk: 'Ukrainian',
    ro: 'Romanian',
    nl: 'Dutch',
    sv: 'Swedish',
    fa: 'Persian',
    cs: 'Czech',
    el: 'Greek',
    da: 'Danish',
    fi: 'Finnish',
    hu: 'Hungarian',
    th: 'Thai',
    no: 'Norwegian',
    he: 'Hebrew',
    id: 'Indonesian',
    hi: 'Hindi',
    sk: 'Slovak',
};

const nativeLanguages = {
    en: 'English',
    es: 'Español',
    zh: '中文',
    ar: 'العربية',
    pt: 'Português',
    fr: 'Français',
    ru: 'Русский',
    ja: '日本語',
    de: 'Deutsch',
    ko: '한국어',
    it: 'Italiano',
    tr: 'Türkçe',
    pl: 'Polski',
    vi: 'Tiếng Việt',
    uk: 'Українська',
    ro: 'Română',
    nl: 'Nederlands',
    sv: 'Svenska',
    fa: 'فارسی',
    cs: 'Česky',
    el: 'Ελληνικά',
    da: 'Dansk',
    fi: 'Suomi',
    hu: 'Magyar',
    th: 'ไทย',
    no: 'Norsk',
    he: 'עברית',
    id: 'Bahasa Indonesia',
    hi: 'हिन्दी',
    sk: 'Slovenčina',
};

class Languages {
    constructor() {
        this.english = enLanguages;
        this.native = nativeLanguages;
        this.languageEmojis = {
            en: 'U+1F1FA U+1F1F8', // United States
            es: 'U+1F1EA U+1F1F8', // Spain
            zh: 'U+1F1E8 U+1F1F3', // China
            ar: 'U+1F1E6 U+1F1F7', // Saudi Arabia
            pt: 'U+1F1E7 U+1F1F7', // Portugal
            fr: 'U+1F1EB U+1F1F7', // France
            ru: 'U+1F1F7 U+1F1FA', // Russia
            ja: 'U+1F1EF U+1F1F5', // Japan
            de: 'U+1F1E9 U+1F1EA', // Germany
            ko: 'U+1F1F0 U+1F1F7', // South Korea
            it: 'U+1F1EE U+1F1F9', // Italy
            tr: 'U+1F1F9 U+1F1F7', // Turkey
            pl: 'U+1F1F5 U+1F1F1', // Poland
            vi: 'U+1F1FB U+1F1F3', // Vietnam
            uk: 'U+1F1FA U+1F1E6', // Ukraine
            ro: 'U+1F1F7 U+1F1F4', // Romania
            nl: 'U+1F1F3 U+1F1F1', // Netherlands
            sv: 'U+1F1F8 U+1F1EA', // Sweden
            fa: 'U+1F1F5 U+1F1F7', // Iran
            cs: 'U+1F1E8 U+1F1FF', // Czech Republic
            el: 'U+1F1EC U+1F1F7', // Greece
            da: 'U+1F1E9 U+1F1F0', // Denmark
            fi: 'U+1F1EB U+1F1EE', // Finland
            hu: 'U+1F1ED U+1F1FA', // Hungary
            th: 'U+1F1F9 U+1F1ED', // Thailand
            no: 'U+1F1F3 U+1F1F4', // Norway
            he: 'U+1F1EE U+1F1F1', // Israel
            id: 'U+1F1EE U+1F1E9', // Indonesia
            hi: 'U+1F1EC U+1F1F7', // India
            sk: 'U+1F1F8 U+1F1F0', // Slovakia
        };
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

    get_all() {
        const combinedDict = {};

        Object.keys(this.english).forEach((key) => {
            combinedDict[key] = {
                nameInEnglish: this.english[key],
                nameInNative: this.native[key],
                emoji: this.languageEmojis[key],
            };
        });
        return combinedDict;
    }
}
module.exports = new Languages();
