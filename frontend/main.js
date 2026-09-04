const API_URL = 'http://localhost:5000';
const languages = [
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'kannada', name: 'Kannada', flag: '🇮🇳' },
  { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
  { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
  { code: 'malayalam', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
  { code: 'bengali', name: 'Bengali', flag: '🇮🇳' }
];
let selectedLanguage = 'English';
const translations = {
  English: {
    collegeName: 'Aditya College of Engineering & Technology', aiOnline: 'AI Online', languageLabel: 'Language', login: 'Login', signIn: 'Sign in', signUp: 'Sign up', logout: 'Logout', uploadTitle: '📄 Upload Document', uploadSubtitle: 'Upload college PDFs to train AdiBot', dragDrop: 'Drag & drop PDF here', or: '— or —', browse: 'Browse File', uploadProcess: '⬆️ Upload & Process', recentQuestions: '🕐 Recent Questions', noHistory: 'No history yet', faqTitle: '✨ AI Generated FAQs', faqSubtitle: 'Questions based on your uploaded document', generateFaqs: '✨ Generate FAQs', faqEmpty: 'Generate FAQs after uploading a document.', tryAsking: '💡 Try Asking', chatTitle: '💬 Chat with AdiBot', clear: 'Clear Chat', export: '📥 Export', send: 'Send', welcomeLine: "Hello! I'm <strong>AdiBot</strong>, your AI assistant for Aditya College of Engineering & Technology!", welcomeInstruction: 'Please upload a college document first, then ask me anything! 🎓', placeholder: 'Ask anything about Aditya College...', suggestions: { courses: 'What courses are offered?', fees: 'What is the fee structure?', admissions: 'Tell me about admissions', hostel: 'What are hostel facilities?', principal: 'Who is the principal?', placements: 'What are placement details?' }
  },
  Hindi: {
    collegeName: 'आदित्य कॉलेज ऑफ इंजीनियरिंग एंड टेक्नोलॉजी', aiOnline: 'AI ऑनलाइन', languageLabel: 'भाषा', login: 'लॉग इन', signIn: 'साइन इन', signUp: 'साइन अप', logout: 'लॉग आउट', uploadTitle: '📄 दस्तावेज़ अपलोड करें', uploadSubtitle: 'AdiBot को प्रशिक्षित करने के लिए कॉलेज PDF अपलोड करें', dragDrop: 'PDF यहां खींचकर छोड़ें', or: '— या —', browse: 'फ़ाइल चुनें', uploadProcess: '⬆️ अपलोड करें', recentQuestions: '🕐 हाल के प्रश्न', noHistory: 'अभी तक कोई इतिहास नहीं', faqTitle: '✨ AI द्वारा बनाए गए FAQ', faqSubtitle: 'आपके अपलोड किए गए दस्तावेज़ पर आधारित प्रश्न', generateFaqs: '✨ FAQ बनाएं', faqEmpty: 'दस्तावेज़ अपलोड करने के बाद FAQ बनाएं।', tryAsking: '💡 पूछकर देखें', chatTitle: '💬 AdiBot से बात करें', clear: 'चैट साफ़ करें', export: '📥 निर्यात करें', send: 'भेजें', welcomeLine: 'नमस्ते! मैं <strong>AdiBot</strong> हूं, आदित्य कॉलेज ऑफ इंजीनियरिंग एंड टेक्नोलॉजी का AI सहायक!', welcomeInstruction: 'कृपया पहले कॉलेज का दस्तावेज़ अपलोड करें, फिर मुझसे कुछ भी पूछें! 🎓', placeholder: 'आदित्य कॉलेज के बारे में कुछ भी पूछें...', suggestions: { courses: 'कौन से पाठ्यक्रम उपलब्ध हैं?', fees: 'शुल्क संरचना क्या है?', admissions: 'प्रवेश के बारे में बताएं', hostel: 'छात्रावास की सुविधाएं क्या हैं?', principal: 'प्रधानाचार्य कौन हैं?', placements: 'प्लेसमेंट का विवरण क्या है?' }
  },
  Kannada: {
    collegeName: 'ಆದಿತ್ಯ ಕಾಲೇಜ್ ಆಫ್ ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಟೆಕ್ನಾಲಜಿ', aiOnline: 'AI ಆನ್‌ಲೈನ್', languageLabel: 'ಭಾಷೆ', login: 'ಲಾಗಿನ್', signIn: 'ಸೈನ್ ಇನ್', signUp: 'ಸೈನ್ ಅಪ್', logout: 'ಲಾಗ್ ಔಟ್', uploadTitle: '📄 ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', uploadSubtitle: 'AdiBot ತರಬೇತಿಗಾಗಿ ಕಾಲೇಜು PDFಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', dragDrop: 'PDF ಅನ್ನು ಇಲ್ಲಿ ಎಳೆದು ಬಿಡಿ', or: '— ಅಥವಾ —', browse: 'ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ', uploadProcess: '⬆️ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', recentQuestions: '🕐 ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು', noHistory: 'ಇನ್ನೂ ಇತಿಹಾಸವಿಲ್ಲ', faqTitle: '✨ AI ರಚಿಸಿದ FAQಗಳು', faqSubtitle: 'ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಯ ಆಧಾರದ ಪ್ರಶ್ನೆಗಳು', generateFaqs: '✨ FAQ ಗಳನ್ನು ರಚಿಸಿ', faqEmpty: 'ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ನಂತರ FAQಗಳನ್ನು ರಚಿಸಿ.', tryAsking: '💡 ಇವನ್ನು ಕೇಳಿ ನೋಡಿ', chatTitle: '💬 ಆಡಿಬಾಟ್ ಜೊತೆ ಮಾತನಾಡಿ', clear: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ', export: '📥 ರಫ್ತು ಮಾಡಿ', send: 'ಕಳುಹಿಸಿ', welcomeLine: 'ನಮಸ್ಕಾರ! ನಾನು <strong>AdiBot</strong>, ಆದಿತ್ಯ ಕಾಲೇಜ್ ಆಫ್ ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ಟೆಕ್ನಾಲಜಿಯ AI ಸಹಾಯಕ.', welcomeInstruction: 'ಮೊದಲು ಕಾಲೇಜಿನ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, ನಂತರ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ! 🎓', placeholder: 'ಆದಿತ್ಯ ಕಾಲೇಜಿನ ಬಗ್ಗೆ ಏನು ಬೇಕಾದರೂ ಕೇಳಿ...', suggestions: { courses: 'ಯಾವ ಕೋರ್ಸ್‌ಗಳು ಲಭ್ಯವಿವೆ?', fees: 'ಶುಲ್ಕ ರಚನೆ ಏನು?', admissions: 'ಪ್ರವೇಶದ ಬಗ್ಗೆ ತಿಳಿಸಿ', hostel: 'ಹಾಸ್ಟೆಲ್ ಸೌಲಭ್ಯಗಳು ಯಾವುವು?', principal: 'ಪ್ರಾಂಶುಪಾಲರು ಯಾರು?', placements: 'ಪ್ಲೇಸ್‌ಮೆಂಟ್ ವಿವರಗಳು ಯಾವುವು?' }
  },
  Tamil: {
    collegeName: 'ஆதித்யா பொறியியல் மற்றும் தொழில்நுட்பக் கல்லூரி', aiOnline: 'AI ஆன்லைன்', languageLabel: 'மொழி', login: 'உள்நுழைவு', signIn: 'உள்நுழைக', signUp: 'பதிவு செய்க', logout: 'வெளியேறு', uploadTitle: '📄 ஆவணத்தைப் பதிவேற்றவும்', uploadSubtitle: 'AdiBot-ஐப் பயிற்றுவிக்க கல்லூரி PDF-களைப் பதிவேற்றவும்', dragDrop: 'PDF-ஐ இங்கே இழுத்து விடவும்', or: '— அல்லது —', browse: 'கோப்பைத் தேர்ந்தெடுக்கவும்', uploadProcess: '⬆️ பதிவேற்றி செயலாக்கவும்', recentQuestions: '🕐 சமீபத்திய கேள்விகள்', noHistory: 'வரலாறு இல்லை', faqTitle: '✨ AI உருவாக்கிய FAQகள்', faqSubtitle: 'நீங்கள் பதிவேற்றிய ஆவணத்தின் அடிப்படையிலான கேள்விகள்', generateFaqs: '✨ FAQகளை உருவாக்கவும்', faqEmpty: 'ஆவணத்தைப் பதிவேற்றிய பிறகு FAQகளை உருவாக்கவும்.', tryAsking: '💡 கேட்டு பாருங்கள்', chatTitle: '💬 AdiBot உடன் பேசுங்கள்', clear: 'அரட்டையை அழிக்கவும்', export: '📥 ஏற்றுமதி', send: 'அனுப்பு', welcomeLine: 'வணக்கம்! நான் <strong>AdiBot</strong>, ஆதித்யா கல்லூரியின் AI உதவியாளர்!', welcomeInstruction: 'முதலில் கல்லூரி ஆவணத்தைப் பதிவேற்றி, பின்னர் எதையும் கேளுங்கள்! 🎓', placeholder: 'ஆதித்யா கல்லூரியைப் பற்றி எதையும் கேளுங்கள்...', suggestions: { courses: 'என்ன படிப்புகள் வழங்கப்படுகின்றன?', fees: 'கட்டண அமைப்பு என்ன?', admissions: 'சேர்க்கை பற்றி கூறுங்கள்', hostel: 'விடுதி வசதிகள் என்ன?', principal: 'முதல்வர் யார்?', placements: 'வேலைவாய்ப்பு விவரங்கள் என்ன?' }
  },
  Telugu: {
    collegeName: 'ఆదిత్య కాలేజ్ ఆఫ్ ఇంజినీరింగ్ అండ్ టెక్నాలజీ', aiOnline: 'AI ఆన్‌లైన్', languageLabel: 'భాష', login: 'లాగిన్', signIn: 'సైన్ ఇన్', signUp: 'సైన్ అప్', logout: 'లాగ్ అవుట్', uploadTitle: '📄 డాక్యుమెంట్ అప్‌లోడ్ చేయండి', uploadSubtitle: 'AdiBot శిక్షణ కోసం కళాశాల PDFలను అప్‌లోడ్ చేయండి', dragDrop: 'PDFను ఇక్కడికి లాగి వదలండి', or: '— లేదా —', browse: 'ఫైల్ ఎంచుకోండి', uploadProcess: '⬆️ అప్‌లోడ్ చేసి ప్రాసెస్ చేయండి', recentQuestions: '🕐 ఇటీవలి ప్రశ్నలు', noHistory: 'ఇంకా చరిత్ర లేదు', faqTitle: '✨ AI రూపొందించిన FAQలు', faqSubtitle: 'మీరు అప్‌లోడ్ చేసిన డాక్యుమెంట్ ఆధారిత ప్రశ్నలు', generateFaqs: '✨ FAQలను రూపొందించండి', faqEmpty: 'డాక్యుమెంట్ అప్‌లోడ్ చేసిన తర్వాత FAQలను రూపొందించండి.', tryAsking: '💡 అడిగి చూడండి', chatTitle: '💬 AdiBotతో మాట్లాడండి', clear: 'చాట్ క్లియర్ చేయండి', export: '📥 ఎగుమతి', send: 'పంపండి', welcomeLine: 'హలో! నేను <strong>AdiBot</strong>, ఆదిత్య కళాశాల AI సహాయకుడిని!', welcomeInstruction: 'ముందుగా కళాశాల డాక్యుమెంట్‌ను అప్‌లోడ్ చేసి, తరువాత ఏదైనా అడగండి! 🎓', placeholder: 'ఆదిత్య కళాశాల గురించి ఏదైనా అడగండి...', suggestions: { courses: 'ఏ కోర్సులు అందుబాటులో ఉన్నాయి?', fees: 'ఫీజు నిర్మాణం ఏమిటి?', admissions: 'అడ్మిషన్ల గురించి చెప్పండి', hostel: 'హాస్టల్ సదుపాయాలు ఏమిటి?', principal: 'ప్రిన్సిపల్ ఎవరు?', placements: 'ప్లేస్‌మెంట్ వివరాలు ఏమిటి?' }
  },
  Malayalam: {
    collegeName: 'ആദിത്യ കോളേജ് ഓഫ് എഞ്ചിനീയറിംഗ് ആൻഡ് ടെക്നോളജി', aiOnline: 'AI ഓൺലൈൻ', languageLabel: 'ഭാഷ', login: 'ലോഗിൻ', signIn: 'സൈൻ ഇൻ', signUp: 'സൈൻ അപ്പ്', logout: 'ലോഗ് ഔട്ട്', uploadTitle: '📄 ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്യുക', uploadSubtitle: 'AdiBot പരിശീലിപ്പിക്കാൻ കോളേജ് PDFകൾ അപ്‌ലോഡ് ചെയ്യുക', dragDrop: 'PDF ഇവിടെ വലിച്ചിടുക', or: '— അല്ലെങ്കിൽ —', browse: 'ഫയൽ തിരഞ്ഞെടുക്കുക', uploadProcess: '⬆️ അപ്‌ലോഡ് ചെയ്ത് പ്രോസസ്സ് ചെയ്യുക', recentQuestions: '🕐 സമീപകാല ചോദ്യങ്ങൾ', noHistory: 'ചരിത്രമൊന്നുമില്ല', faqTitle: '✨ AI സൃഷ്ടിച്ച FAQകൾ', faqSubtitle: 'നിങ്ങൾ അപ്‌ലോഡ് ചെയ്ത ഡോക്യുമെന്റിനെ അടിസ്ഥാനമാക്കിയുള്ള ചോദ്യങ്ങൾ', generateFaqs: '✨ FAQകൾ സൃഷ്ടിക്കുക', faqEmpty: 'ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്ത ശേഷം FAQകൾ സൃഷ്ടിക്കുക.', tryAsking: '💡 ചോദിച്ച് നോക്കൂ', chatTitle: '💬 AdiBot-നോട് സംസാരിക്കുക', clear: 'ചാറ്റ് മായ്ക്കുക', export: '📥 എക്സ്പോർട്ട്', send: 'അയയ്ക്കുക', welcomeLine: 'ഹലോ! ഞാൻ <strong>AdiBot</strong>, ആദിത്യ കോളേജിന്റെ AI സഹായി!', welcomeInstruction: 'ആദ്യം കോളേജ് ഡോക്യുമെന്റ് അപ്‌ലോഡ് ചെയ്യുക, തുടർന്ന് എന്തും ചോദിക്കാം! 🎓', placeholder: 'ആദിത്യ കോളേജിനെക്കുറിച്ച് എന്തും ചോദിക്കൂ...', suggestions: { courses: 'ഏതൊക്കെ കോഴ്സുകളാണ് ലഭ്യമായത്?', fees: 'ഫീസ് ഘടന എന്താണ്?', admissions: 'അഡ്മിഷനെക്കുറിച്ച് പറയൂ', hostel: 'ഹോസ്റ്റൽ സൗകര്യങ്ങൾ എന്തൊക്കെയാണ്?', principal: 'പ്രിൻസിപ്പൽ ആരാണ്?', placements: 'പ്ലേസ്‌മെന്റ് വിവരങ്ങൾ എന്താണ്?' }
  },
  Marathi: {
    collegeName: 'आदित्य कॉलेज ऑफ इंजिनिअरिंग अँड टेक्नॉलॉजी', aiOnline: 'AI ऑनलाइन', languageLabel: 'भाषा', login: 'लॉग इन', signIn: 'साइन इन', signUp: 'साइन अप', logout: 'लॉग आउट', uploadTitle: '📄 दस्तऐवज अपलोड करा', uploadSubtitle: 'AdiBot ला प्रशिक्षित करण्यासाठी कॉलेज PDF अपलोड करा', dragDrop: 'PDF येथे ड्रॅग करून सोडा', or: '— किंवा —', browse: 'फाइल निवडा', uploadProcess: '⬆️ अपलोड करून प्रक्रिया करा', recentQuestions: '🕐 अलीकडील प्रश्न', noHistory: 'अद्याप इतिहास नाही', faqTitle: '✨ AI निर्मित FAQ', faqSubtitle: 'तुम्ही अपलोड केलेल्या दस्तऐवजावर आधारित प्रश्न', generateFaqs: '✨ FAQ तयार करा', faqEmpty: 'दस्तऐवज अपलोड केल्यानंतर FAQ तयार करा.', tryAsking: '💡 विचारून पहा', chatTitle: '💬 AdiBot शी बोला', clear: 'चॅट साफ करा', export: '📥 निर्यात', send: 'पाठवा', welcomeLine: 'नमस्कार! मी <strong>AdiBot</strong>, आदित्य कॉलेजचा AI सहाय्यक आहे!', welcomeInstruction: 'प्रथम कॉलेजचा दस्तऐवज अपलोड करा आणि मग मला काहीही विचारा! 🎓', placeholder: 'आदित्य कॉलेजबद्दल काहीही विचारा...', suggestions: { courses: 'कोणते अभ्यासक्रम उपलब्ध आहेत?', fees: 'शुल्क रचना काय आहे?', admissions: 'प्रवेशाबद्दल सांगा', hostel: 'वसतिगृहाच्या सुविधा काय आहेत?', principal: 'प्राचार्य कोण आहेत?', placements: 'प्लेसमेंटचा तपशील काय आहे?' }
  },
  Bengali: {
    collegeName: 'আদিত্য কলেজ অফ ইঞ্জিনিয়ারিং অ্যান্ড টেকনোলজি', aiOnline: 'AI অনলাইন', languageLabel: 'ভাষা', login: 'লগইন', signIn: 'সাইন ইন', signUp: 'সাইন আপ', logout: 'লগআউট', uploadTitle: '📄 ডকুমেন্ট আপলোড করুন', uploadSubtitle: 'AdiBot প্রশিক্ষণের জন্য কলেজের PDF আপলোড করুন', dragDrop: 'PDF এখানে টেনে আনুন', or: '— অথবা —', browse: 'ফাইল বেছে নিন', uploadProcess: '⬆️ আপলোড ও প্রক্রিয়া করুন', recentQuestions: '🕐 সাম্প্রতিক প্রশ্ন', noHistory: 'এখনও কোনো ইতিহাস নেই', faqTitle: '✨ AI তৈরি FAQ', faqSubtitle: 'আপনার আপলোড করা ডকুমেন্টের ভিত্তিতে প্রশ্ন', generateFaqs: '✨ FAQ তৈরি করুন', faqEmpty: 'ডকুমেন্ট আপলোড করার পরে FAQ তৈরি করুন।', tryAsking: '💡 জিজ্ঞাসা করে দেখুন', chatTitle: '💬 AdiBot-এর সঙ্গে কথা বলুন', clear: 'চ্যাট পরিষ্কার করুন', export: '📥 এক্সপোর্ট', send: 'পাঠান', welcomeLine: 'হ্যালো! আমি <strong>AdiBot</strong>, আদিত্য কলেজের AI সহকারী!', welcomeInstruction: 'প্রথমে কলেজের ডকুমেন্ট আপলোড করুন, তারপর আমাকে যেকোনো প্রশ্ন করুন! 🎓', placeholder: 'আদিত্য কলেজ সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...', suggestions: { courses: 'কোন কোন কোর্স দেওয়া হয়?', fees: 'ফি কাঠামো কী?', admissions: 'ভর্তি সম্পর্কে বলুন', hostel: 'হোস্টেলের সুবিধাগুলি কী কী?', principal: 'অধ্যক্ষ কে?', placements: 'প্লেসমেন্টের বিবরণ কী?' }
  }
};

// Chat History
let chatHistory = JSON.parse(localStorage.getItem('adibotHistory') || '[]');
let currentUser = null;

// Elements
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileInfo = document.getElementById('fileInfo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadArea = document.getElementById('uploadArea');
const languageSelect = document.getElementById('languageSelect');
const generateFaqsBtn = document.getElementById('generateFaqsBtn');
const faqList = document.getElementById('faqList');
const guestActions = document.getElementById('guestActions');
const userBadge = document.getElementById('userBadge');
const userNameText = document.getElementById('userNameText');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authMessage = document.getElementById('authMessage');
const nameField = document.getElementById('nameField');
const closeAuthModal = document.getElementById('closeAuthModal');

let authMode = 'login';

function saveLanguage() {
  localStorage.setItem('adibotLanguage', selectedLanguage);
}

function applyTranslations(language = selectedLanguage) {
  selectedLanguage = translations[language] ? language : 'English';
  const translation = translations[selectedLanguage];
  document.querySelectorAll('[data-i18n]').forEach(element => {
    if (element.dataset.i18n === 'welcomeLine') {
      element.innerHTML = translation.welcomeLine;
    } else {
      element.textContent = translation[element.dataset.i18n] || element.textContent;
    }
  });
  document.querySelectorAll('[data-suggestion]').forEach(button => {
    button.textContent = translation.suggestions[button.dataset.suggestion];
  });
  languageSelect.value = selectedLanguage;
  chatInput.placeholder = translation.placeholder;
  authSubmitBtn.textContent = authMode === 'signup' ? translation.signUp : translation.login;
  updateHistory();
}

function updateLanguageUI() {
  applyTranslations(selectedLanguage);
}

function loadLanguage() {
  const savedLanguage = localStorage.getItem('adibotLanguage');
  if (languages.some(language => language.name === savedLanguage)) {
    selectedLanguage = savedLanguage;
  }
  applyTranslations(selectedLanguage);
}

function getAuthHeaders() {
  const token = localStorage.getItem('adibotAuthToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function setFaqMessage(message, className = 'faq-empty') {
  faqList.innerHTML = `<p class="${className}">${message}</p>`;
}

async function generateFAQs() {
  if (!currentUser) {
    addBotMessage('Please log in before generating FAQs.');
    openAuthModal('login');
    return;
  }

  generateFaqsBtn.disabled = true;
  generateFaqsBtn.classList.add('loading');
  generateFaqsBtn.textContent = `${translations[selectedLanguage].generateFaqs}...`;
  setFaqMessage(`${translations[selectedLanguage].faqSubtitle}...`, 'faq-loading');

  try {
    const response = await fetch(`${API_URL}/generate-faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ language: selectedLanguage })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to generate FAQs.');

    const faqs = Array.isArray(data.faqs) ? data.faqs.filter(Boolean).slice(0, 8) : [];
    if (faqs.length === 0) {
      setFaqMessage(translations[selectedLanguage].faqEmpty);
      return;
    }
    faqList.innerHTML = faqs.map((question, index) =>
      `<button class="faq-item" type="button" data-question="${escapeHtml(question)}">${index + 1}. ${escapeHtml(question)}</button>`
    ).join('');
  } catch (error) {
    setFaqMessage(error.message || translations[selectedLanguage].faqEmpty, 'faq-error');
  } finally {
    generateFaqsBtn.disabled = false;
    generateFaqsBtn.classList.remove('loading');
    generateFaqsBtn.textContent = translations[selectedLanguage].generateFaqs;
  }
}

function askFAQ(question) {
  chatInput.value = question;
  sendMessage();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
}

function updateAuthUI() {
  const hasUser = !!currentUser;
  guestActions.classList.toggle('hidden', hasUser);
  userBadge.classList.toggle('hidden', !hasUser);

  if (hasUser) {
    userNameText.textContent = currentUser.name || 'User';
    uploadBtn.disabled = !fileInput.files[0];
    sendBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
    sendBtn.disabled = true;
  }
}

async function restoreSession() {
  const token = localStorage.getItem('adibotAuthToken');
  if (!token) {
    currentUser = null;
    updateAuthUI();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('session invalid');
    }

    const data = await response.json();
    currentUser = data.user;
    updateAuthUI();
  } catch (error) {
    localStorage.removeItem('adibotAuthToken');
    localStorage.removeItem('adibotUser');
    currentUser = null;
    updateAuthUI();
  }
}

function openAuthModal(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  nameField.classList.toggle('hidden', !isSignup);
  authSubmitBtn.textContent = isSignup ? translations[selectedLanguage].signUp : translations[selectedLanguage].login;
  authMessage.textContent = '';
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  if (isSignup) {
    authName.focus();
  } else {
    authEmail.focus();
  }
}

function closeAuthModalUI() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
  authForm.reset();
  authMessage.textContent = '';
}

async function submitAuthForm(event) {
  event.preventDefault();
  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value.trim()
  };

  if (authMode === 'signup') {
    payload.name = authName.value.trim();
  }

  if (!payload.email || !payload.password || (authMode === 'signup' && !payload.name)) {
    authMessage.textContent = 'Please fill in all required fields.';
    authMessage.className = 'auth-message error';
    return;
  }

  authSubmitBtn.disabled = true;
  authMessage.textContent = authMode === 'signup' ? 'Creating account...' : 'Signing in...';
  authMessage.className = 'auth-message';

  try {
    const response = await fetch(`${API_URL}/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    currentUser = data.user;
    localStorage.setItem('adibotAuthToken', data.token);
    localStorage.setItem('adibotUser', JSON.stringify(data.user));
    updateAuthUI();
    closeAuthModalUI();
    addSuccessMessage(`✅ Welcome, ${currentUser.name}!`);
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.className = 'auth-message error';
  } finally {
    authSubmitBtn.disabled = false;
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('adibotAuthToken');
  localStorage.removeItem('adibotUser');
  updateAuthUI();
  addSuccessMessage('✅ Logged out successfully.');
}

const authButtons = document.querySelectorAll('.auth-btn');
authButtons.forEach(button => {
  button.addEventListener('click', () => openAuthModal(button.dataset.mode));
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => openAuthModal(tab.dataset.mode));
});

closeAuthModal.addEventListener('click', closeAuthModalUI);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuthModalUI();
});
authForm.addEventListener('submit', submitAuthForm);
logoutBtn.addEventListener('click', logoutUser);
languageSelect.addEventListener('change', () => {
  selectedLanguage = languageSelect.value;
  saveLanguage();
  applyTranslations(selectedLanguage);
});
generateFaqsBtn.addEventListener('click', generateFAQs);
faqList.addEventListener('click', (event) => {
  const faqButton = event.target.closest('.faq-item');
  if (faqButton) askFAQ(faqButton.dataset.question);
});

// Browse Button Click
browseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!currentUser) {
    addBotMessage('Please log in to upload a PDF and use AdiBot.');
    openAuthModal('login');
    return;
  }
  fileInput.click();
});

// File Selected
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileInfo.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#e94560';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = '#cbd5e0';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#cbd5e0';
  if (!currentUser) {
    addBotMessage('Please log in to upload a PDF and use AdiBot.');
    openAuthModal('login');
    return;
  }
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    fileInput.files = e.dataTransfer.files;
    fileInfo.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }
});

// Upload PDF
uploadBtn.addEventListener('click', async () => {
  if (!currentUser) {
    openAuthModal('login');
    showStatus('❌ Please log in first.', 'error');
    return;
  }

  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled = true;
  showStatus('⏳ Processing PDF...', 'loading');

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: getAuthHeaders()
    });
    const data = await response.json();

    if (response.ok) {
      addSuccessMessage('✅ Document uploaded successfully! Generating summary... ⏳');
      showStatus('✅ PDF processed successfully!', 'success');
      try {
        const summaryRes = await fetch(`${API_URL}/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: JSON.stringify({ language: selectedLanguage })
        });
        const summaryData = await summaryRes.json();

        if (summaryData && summaryData.summary) {
          addBotMessage(`📋 Document Summary:\n\n${summaryData.summary}\n\nYou can now ask me anything! 🎓`, [], 0);
        } else {
          addBotMessage('Document ready! Ask me anything about Aditya College! 🎓', [], 0);
        }
      } catch (err) {
        addBotMessage('Document ready! Ask me anything about Aditya College! 🎓', [], 0);
      }
      uploadBtn.disabled = false;
    } else {
      showStatus('❌ ' + (data.error || 'Upload failed'), 'error');
      uploadBtn.disabled = false;
    }
  } catch (error) {
    showStatus('❌ Server not running!', 'error');
    uploadBtn.disabled = false;
  }
});

// Show Status
function showStatus(msg, type) {
  uploadStatus.textContent = msg;
  uploadStatus.className = 'upload-status ' + type;
}

// Add Success Message (Green)
function addSuccessMessage(text) {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble success-bubble">
      <p>${text}</p>
    </div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

// Add Bot Message
function addBotMessage(text, sources = [], confidence = 0) {
  const div = document.createElement('div');
  div.className = 'message bot';

  const confColor = confidence > 70 ? '#48bb78' :
    confidence > 40 ? '#ed8936' : '#e94560';

  const confidenceHTML = confidence > 0 ? `
    <div class="confidence-bar">
      <span class="confidence-label">Confidence:</span>
      <div class="confidence-track">
        <div class="confidence-fill" style="width:${confidence}%;background:${confColor}"></div>
      </div>
      <span class="confidence-value" style="color:${confColor}">${confidence}%</span>
    </div>` : '';

  const sourcesHTML = sources && sources.length > 0 ? `
    <div class="sources-section">
      <p class="sources-title">📚 Sources Used:</p>
      ${sources.map(s => `
        <div class="source-item">
          <span class="source-id">Source ${s.id}</span>
          <span class="source-text">${s.text}</span>
          <span class="source-score" style="color:${confColor}">${s.score}% match</span>
        </div>`).join('')}
    </div>` : '';

  const feedbackHTML = `
    <div class="feedback-section">
      <span class="feedback-label">Was this helpful?</span>
      <button class="feedback-btn" onclick="handleFeedback(this,'up')">👍</button>
      <button class="feedback-btn" onclick="handleFeedback(this,'down')">👎</button>
    </div>`;

  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <p>${text}</p>
      ${confidenceHTML}
      ${sourcesHTML}
      ${feedbackHTML}
    </div>`;

  chatMessages.appendChild(div);
  scrollBottom();
}

// Add User Message
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `
    <div class="avatar">👤</div>
    <div class="bubble"><p>${text}</p></div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

// Typing Indicator
function addTyping() {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typing';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <p style="font-size:12px;color:#718096">
        ⏳ Thinking... (may take 30s first time)
      </p>
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function scrollBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message
async function sendMessage() {
  if (!currentUser) {
    addBotMessage('Please log in before sending messages.');
    openAuthModal('login');
    return;
  }

  const question = chatInput.value.trim();
  if (!question) return;

  addUserMessage(question);
  chatInput.value = '';
  sendBtn.disabled = true;
  addTyping();

  chatHistory.unshift({
    question,
    time: new Date().toLocaleTimeString()
  });
  if (chatHistory.length > 10) chatHistory.pop();
  localStorage.setItem('adibotHistory', JSON.stringify(chatHistory));
  updateHistory();

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ question, language: selectedLanguage }),
      signal: AbortSignal.timeout(60000)
    });
    const data = await response.json();
    removeTyping();

    if (response.ok) {
      const answer = data.answer || 'Sorry I could not find an answer!';
      const sources = data.sources || [];
      const confidence = data.confidence || 0;
      addBotMessage(answer, sources, confidence);
    } else {
      const errorText = data?.error || 'Unable to get response from the server.';
      addBotMessage(`❌ ${errorText}`);
    }
  } catch (error) {
    removeTyping();
    addBotMessage('❌ Cannot connect to server!');
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

// Feedback
function handleFeedback(btn, type) {
  btn.parentElement.innerHTML = type === 'up' ?
    '<span style="color:#48bb78">✅ Thanks for feedback!</span>' :
    '<span style="color:#e94560">Sorry! We will improve!</span>';
}

// Update History
function updateHistory() {
  const container = document.getElementById('historyContainer');
  if (!container) return;
  if (chatHistory.length === 0) {
    container.innerHTML = `<p class="no-history">${translations[selectedLanguage].noHistory}</p>`;
    return;
  }
  container.innerHTML = chatHistory.map(item => `
    <div class="history-item" onclick="loadHistory('${item.question.replace(/'/g, "\\'")}')">
      <div class="history-time">${item.time}</div>
      <div class="history-question">❓ ${item.question}</div>
    </div>`).join('');
}

function loadHistory(question) {
  chatInput.value = question;
  chatInput.focus();
}

// Export Chat
function exportChat() {
  const messages = document.querySelectorAll('.message');
  let exportText = 'AdiBot Chat Export\n';
  exportText += 'Aditya College of Engineering & Technology\n';
  exportText += '==========================================\n';
  exportText += `Date: ${new Date().toLocaleDateString()}\n`;
  exportText += `Time: ${new Date().toLocaleTimeString()}\n`;
  exportText += '==========================================\n\n';

  messages.forEach(msg => {
    const isBot = msg.classList.contains('bot');
    const bubble = msg.querySelector('.bubble p');
    if (bubble) {
      const role = isBot ? '🤖 AdiBot' : '👤 You';
      exportText += `${role}:\n${bubble.textContent}\n\n`;
    }
  });

  exportText += '==========================================\n';
  exportText += 'Exported from AdiBot — Aditya College AI Assistant\n';

  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AdiBot-Chat-${new Date().toLocaleDateString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

clearBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  addSuccessMessage('Chat cleared! Ask me anything about Aditya College 🎓');
});

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentUser) {
      openAuthModal('login');
      addBotMessage('Please log in to use the chatbot.');
      return;
    }
    chatInput.value = btn.textContent;
    sendMessage();
  });
});

// Initialize
loadLanguage();
try {
  const savedUser = JSON.parse(localStorage.getItem('adibotUser') || 'null');
  if (savedUser) {
    currentUser = savedUser;
  }
  updateAuthUI();
  restoreSession();
} catch (error) {
  currentUser = null;
  updateAuthUI();
}
updateHistory();
