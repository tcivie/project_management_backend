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

const sortedEnLanguages = Object.fromEntries(
    Object.entries(enLanguages).sort(([, a], [, b]) => a.localeCompare(b)),
);

console.log(sortedEnLanguages);

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
        this.languageEmojis = {
            ar: 'U+1F1E6 U+1F1EA', // Arabic - Egypt
            bn: 'U+1F1E7 U+1F1E9', // Bengali - Bangladesh
            zh: 'U+1F1E8 U+1F1F3', // Chinese - China
            en: 'U+1F1FA U+1F1F8', // English - United States
            fr: 'U+1F1EB U+1F1F7', // French - France
            de: 'U+1F1E9 U+1F1EA', // German - Germany
            hi: 'U+1F1EE U+1F1F3', // Hindi - India
            id: 'U+1F1EE U+1F1E9', // Indonesian - Indonesia
            it: 'U+1F1EE U+1F1F9', // Italian - Italy
            ja: 'U+1F1EF U+1F1F5', // Japanese - Japan
            jv: 'U+1F1EE U+1F1E9', // Javanese - Indonesia
            ko: 'U+1F1F0 U+1F1F7', // Korean - South Korea
            ms: 'U+1F1F2 U+1F1F9', // Malay - Malaysia
            mr: 'U+1F1EE U+1F1F3', // Marathi - India
            pa: 'U+1F1EE U+1F1F3', // Punjabi - India
            pt: 'U+1F1E7 U+1F1F7', // Portuguese - Brazil
            ru: 'U+1F1F7 U+1F1FA', // Russian - Russia
            es: 'U+1F1EA U+1F1F8', // Spanish - Spain
            sw: 'U+1F1F9 U+1F1FF', // Swahili - Tanzania
            ta: 'U+1F1EE U+1F1F3', // Tamil - India
            te: 'U+1F1EE U+1F1F3', // Telugu - India
            tr: 'U+1F1F9 U+1F1F7', // Turkish - Turkey
            uk: 'U+1F1FA U+1F1E6', // Ukrainian - Ukraine
            ur: 'U+1F1F5 U+1F1F0', // Urdu - Pakistan
            vi: 'U+1F1FB U+1F1F3', // Vietnamese - Vietnam
            he: 'U+1F1EE U+1F1F1', // Hebrew - Israel
            pl: 'U+1F1F5 U+1F1F1', // Polish - Poland
            fa: 'U+1F1EE U+1F1F7', // Persian - Iran
            ro: 'U+1F1F7 U+1F1F4', // Romanian - Romania
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
