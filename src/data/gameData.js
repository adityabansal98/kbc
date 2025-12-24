// Prize ladder structure
export const PRIZE_LADDER = [
    { level: 1, amount: '₹1,000', isMilestone: false },
    { level: 2, amount: '₹2,000', isMilestone: false },
    { level: 3, amount: '₹3,000', isMilestone: false },
    { level: 4, amount: '₹5,000', isMilestone: true },
    { level: 5, amount: '₹10,000', isMilestone: false },
    { level: 6, amount: '₹20,000', isMilestone: false },
    { level: 7, amount: '₹40,000', isMilestone: true },
    { level: 8, amount: '₹80,000', isMilestone: false },
    { level: 9, amount: '₹1,60,000', isMilestone: false },
    { level: 10, amount: '₹3,20,000', isMilestone: true },
    { level: 11, amount: '₹6,40,000', isMilestone: false },
    { level: 12, amount: '₹12,50,000', isMilestone: true },
    { level: 13, amount: '₹25,00,000', isMilestone: false },
    { level: 14, amount: '₹1 Crore', isMilestone: true },
    { level: 15, amount: '₹7 Crores', isMilestone: true },
];

// Fallback questions - used when API fails
// These are kept as backup questions in case Gemini API is unavailable
export const FALLBACK_QUESTIONS = [
    {
        id: 1,
        question: 'कौन सा ग्रह लाल ग्रह के नाम से जाना जाता है?',
        options: ['शुक्र', 'मंगल', 'बृहस्पति', 'शनि'],
        correctAnswer: 1, // Index of correct option (0-based)
    },
    {
        id: 2,
        question: 'फ्रांस की राजधानी कौन सी है?',
        options: ['लंदन', 'बर्लिन', 'पेरिस', 'मैड्रिड'],
        correctAnswer: 2,
    },
    {
        id: 3,
        question: '"रोमियो और जूलियट" नाटक किसने लिखा था?',
        options: ['चार्ल्स डिकेंस', 'विलियम शेक्सपियर', 'जेन ऑस्टेन', 'मार्क ट्वेन'],
        correctAnswer: 1,
    },
    {
        id: 4,
        question: 'सोने का रासायनिक प्रतीक क्या है?',
        options: ['Go', 'Gd', 'Au', 'Ag'],
        correctAnswer: 2,
    },
    {
        id: 5,
        question: 'कौन सा महासागर सबसे बड़ा है?',
        options: ['अटलांटिक महासागर', 'हिंद महासागर', 'आर्कटिक महासागर', 'प्रशांत महासागर'],
        correctAnswer: 3,
    },
    {
        id: 6,
        question: 'द्वितीय विश्व युद्ध किस वर्ष में समाप्त हुआ?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
    },
    {
        id: 7,
        question: 'सबसे छोटी अभाज्य संख्या कौन सी है?',
        options: ['0', '1', '2', '3'],
        correctAnswer: 2,
    },
    {
        id: 8,
        question: 'पौधे वायुमंडल से कौन सी गैस अवशोषित करते हैं?',
        options: ['ऑक्सीजन', 'नाइट्रोजन', 'कार्बन डाइऑक्साइड', 'हाइड्रोजन'],
        correctAnswer: 2,
    },
    {
        id: 9,
        question: 'मोना लिसा की पेंटिंग किसने बनाई थी?',
        options: ['विंसेंट वैन गॉग', 'पाब्लो पिकासो', 'लियोनार्डो दा विंची', 'माइकलएंजेलो'],
        correctAnswer: 2,
    },
    {
        id: 10,
        question: 'निर्वात में प्रकाश की गति (लगभग) कितनी है?',
        options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
        correctAnswer: 0,
    },
    {
        id: 11,
        question: 'गुइडो वैन रॉसम ने कौन सी प्रोग्रामिंग भाषा बनाई थी?',
        options: ['जावा', 'पायथन', 'जावास्क्रिप्ट', 'C++'],
        correctAnswer: 1,
    },
    {
        id: 12,
        question: 'पानी का आणविक सूत्र क्या है?',
        options: ['H2O2', 'H2O', 'HO2', 'H3O'],
        correctAnswer: 1,
    },
    {
        id: 13,
        question: 'पहला iPhone किस वर्ष में जारी किया गया था?',
        options: ['2005', '2006', '2007', '2008'],
        correctAnswer: 2,
    },
    {
        id: 14,
        question: 'दुनिया का सबसे बड़ा स्तनपायी कौन सा है?',
        options: ['अफ्रीकी हाथी', 'नीली व्हेल', 'जिराफ', 'ध्रुवीय भालू'],
        correctAnswer: 1,
    },
    {
        id: 15,
        question: 'सापेक्षता के सिद्धांत की खोज किसने की थी?',
        options: ['आइजैक न्यूटन', 'अल्बर्ट आइंस्टीन', 'स्टीफन हॉकिंग', 'गैलीलियो गैलीली'],
        correctAnswer: 1,
    },
];

