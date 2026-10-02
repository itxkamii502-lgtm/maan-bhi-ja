export type LanguageMode = 'roman' | 'ur' | 'en';
export type RelationshipTone = 'bestie' | 'romantic';

export interface MemoryPromise {
  id: string;
  title: string;
  description: string;
  tag: string;
  emoji: string;
}

export interface DateOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
}

export interface LoveCoupon {
  id: string;
  title: string;
  perk: string;
  code: string;
  redeemed?: boolean;
}

export interface PunishmentOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
}

export interface ProposalPayload {
  id?: string;
  adminKey?: string;
  relationshipTone: RelationshipTone;
  senderName: string;
  receiverName: string;
  language: LanguageMode;
  headline: string;
  subheadline: string;
  letter: string;
  // Section visibility toggles
  showPromises: boolean;
  showForgiveGame: boolean;
  showPunishmentGame: boolean;
  showDateInvite: boolean;
  showCoupons: boolean;
  enableBackgroundAudio?: boolean;
  promises: MemoryPromise[];
  punishments: PunishmentOption[];
  dateOptions: DateOption[];
  coupons: LoveCoupon[];
  themeColor: 'rose' | 'amber' | 'violet';
  customLoveNote?: string;
}

export interface ProposalEvent {
  id: string;
  proposalId: string;
  eventType:
    | 'page_view'
    | 'page_refresh'
    | 'envelope_opened'
    | 'audio_toggled'
    | 'no_dodged'
    | 'forgiven_yes'
    | 'punishment_chosen'
    | 'date_selected'
    | 'note_submitted'
    | 'coupon_claimed';
  data?: Record<string, any>;
  timestamp: string;
  device?: string;
}

export interface ProposalAnalytics {
  totalViews: number;
  totalRefreshes: number;
  envelopeOpened: boolean;
  envelopeOpenedAt?: string | null;
  timesNoDodged: number;
  isForgiven: boolean;
  forgivenAt?: string | null;
  chosenPunishment?: string | null;
  selectedDate?: string | null;
  customNote?: string | null;
  claimedCoupons: string[];
  lastActiveAt?: string | null;
  events: ProposalEvent[];
}

// Preset for BEST FRIEND in Roman Urdu
export const PRESET_BEST_FRIEND_ROMAN: ProposalPayload = {
  relationshipTone: 'bestie',
  senderName: 'Kamran',
  receiverName: 'My Bestie',
  language: 'roman',
  headline: 'Yaar Maan Jao Na... Best Friends Don’t Fight Like This! 🥺🍕',
  subheadline: 'A special apology for the most irreplaceable friend in my life',
  letter: `Suno meri bestie,

Mujhe pata hai meri ghalti thi aur tum mujh se bohot naraaz ho. Sach bataoon to jab se tumne baat karna band kiya hai, din bilkul ajeeb aur boring guzar raha hai. Meri saari bak-bak aur roz ke qissay sunne wala koi nahi hai.

Hum dono ne itna kuch saath share kiya hai, itni yaadein hain humari... kya humari itni gehri dosti is chhoti si larayi se kamzor ho sakti hai? Hargiz nahi!

Main kaan pakad kar dil se sorry bol raha hoon. Treat meri taraf se pakki hai, jo mangwao gi woh milega! Ab jaldi se apna ghussa khatam karo aur maan jao na please! 🥺❤️`,
  showPromises: true,
  showForgiveGame: true,
  showPunishmentGame: true,
  showDateInvite: true,
  showCoupons: true,
  enableBackgroundAudio: false,
  promises: [
    {
      id: 'bf1',
      title: '24/7 Venting Partner',
      description: 'Jab bhi mood kharab ho ya kisi par ghussa nikaalna ho, main bina judge kiye tumhari baat sunoonga.',
      tag: 'Loyalty',
      emoji: '🎧',
    },
    {
      id: 'bf2',
      title: 'Food & Chai Treat On Me',
      description: 'Har baar jab bhi larayi hogi, treat meri taraf se hogi (Pizza, Burgers ya Biryani).',
      tag: 'Treats',
      emoji: '🍕',
    },
    {
      id: 'bf3',
      title: 'No More Silly Mistakes',
      description: 'Jo ghalti is baar hui, promise karta hoon aainda aisi bewakoofi dobara nahi dohraoonga.',
      tag: 'Improvement',
      emoji: '🤞',
    },
    {
      id: 'bf4',
      title: 'Hamesha Tumhari Side',
      description: 'Duniya kisi ke bhi khilaaf ho jaye, tumhara best friend hamesha tumhari dhaal ban kar khada rahega.',
      tag: 'Friendship',
      emoji: '🤝',
    },
  ],
  punishments: [
    {
      id: 'p1',
      title: 'Badi Wali Pizza & Ice Cream Treat',
      description: 'Mera bill tum bharoge! Loaded pizza, extra cheese aur double scoop ice cream mere hisaab se.',
      icon: '🍕',
      tag: 'Foodie Penalty',
    },
    {
      id: 'p2',
      title: '10 Uthak Baithak on Video Call',
      description: 'Live video call par dono kaan pakad kar 10 uthak baithak laga kar sorry bolna hoga!',
      icon: '👂',
      tag: 'Classic Saza',
    },
    {
      id: 'p3',
      title: '1 Din Tak Meri Har Baat Man-na',
      description: 'Agley 24 ghante tak koi argument nahi. Jo main kahungi, wahi hoga! Full order mode.',
      icon: '🤐',
      tag: 'Royal Command',
    },
    {
      id: 'p4',
      title: 'Voice Note Par Gaana Ga Kar Sunao',
      description: 'Apni aawaz mein mera favorite gaana poora gaa kar WhatsApp par voice note bhejo.',
      icon: '🎤',
      tag: 'Singing Dare',
    },
    {
      id: 'p5',
      title: 'Midnight Long Drive & Karak Chai',
      description: 'Raat ke 12 baje mujhe thandi hawa mein chai aur dessert khilane le jana hoga.',
      icon: '☕',
      tag: 'Night Drive',
    },
  ],
  dateOptions: [
    {
      id: 'chai_drive',
      title: 'Karak Chai & Long Drive Hangout',
      description: 'Garam chai, thandi hawa, car mein favorite songs aur endless gossip.',
      icon: '☕',
      tag: 'Bestie Classic',
    },
    {
      id: 'food_treat',
      title: 'Unlimited Fast Food Feast (My Treat)',
      description: 'Burgers, loaded fries, pizza aur shake jo tumhara dil chahe.',
      icon: '🍔',
      tag: 'Foodie Peace',
    },
    {
      id: 'cafe_chill',
      title: 'Aesthetic Cafe & Dessert Catchup',
      description: 'Sukoon se baith kar baatein aur tumhari pasand ka dessert.',
      icon: '🍰',
      tag: 'Chill Vibe',
    },
    {
      id: 'gaming_movie',
      title: 'Binge Watching & Snack Marathon',
      description: 'Netflix, chips, popcorn aur tumhari marzi ki shows.',
      icon: '🎬',
      tag: 'Cozy Hangout',
    },
  ],
  coupons: [
    {
      id: 'bc1',
      title: 'Free Treat Card (Redeem Anytime)',
      perk: 'Is card ko dikha kar tum kisi bhi waqt mujh se pizza ya biryani mangwa sakti ho!',
      code: 'BESTIE-FOOD-PASS',
    },
    {
      id: 'bc2',
      title: 'Instant Argument Solver Card',
      perk: 'Whenever we disagree, show this and you win immediately without debate.',
      code: 'YOU-WIN-ALWAYS',
    },
    {
      id: 'bc3',
      title: 'Emergency 3 AM Call Lifeline',
      perk: 'Raat ke 3 bajay bhi call karo gi to main jaag kar sunoonga.',
      code: 'LIFELINE-3AM',
    },
  ],
  themeColor: 'rose',
};

// Preset for BEST FRIEND in Urdu
export const PRESET_BEST_FRIEND_URDU: ProposalPayload = {
  relationshipTone: 'bestie',
  senderName: 'کامران',
  receiverName: 'میری سب سے اچھی دوست',
  language: 'ur',
  headline: 'یار پلیز مان جاؤ نا... بہترین دوست ایسے نہیں لڑتے! 🥺🍕',
  subheadline: 'زندگی کی سب سے مخلص اور انمول دوست کے نام ایک خاص معافی نامہ',
  letter: `سنو میری بہترین دوست،

مجھے اچھی طرح احساس ہے کہ مجھ سے غلطی ہوئی ہے اور آپ کا ناراض ہونا بالکل بجا ہے۔ سچ بتاؤں تو جب سے آپ نے بات کرنا بند کیا ہے، میرا دن اداس اور بے مزہ گزر رہا ہے۔ میری فضول باتیں اور روزمرہ کے قصے سننے والا کوئی نہیں۔

ہماری اتنی پیاری اور گہری دوستی ہے، کیا ہم اس چھوٹی سی غلط فہمی کو اپنی دوستی کے درمیان آنے دیں گے؟ ہرگز نہیں!

میں کان پکڑ کر دل سے معافی مانگتا ہوں۔ صلح کی دعوت میری طرف سے پکی ہے، جو پسند ہو کھائیے گا۔ اب جلدی سے غصہ ختم کیجئے اور وہی پرانی مسکراہٹ لے آئیے! 🥺❤️`,
  showPromises: true,
  showForgiveGame: true,
  showPunishmentGame: true,
  showDateInvite: true,
  showCoupons: true,
  promises: [
    {
      id: 'bf1',
      title: 'ہمیشہ توجہ سے سننا',
      description: 'جب بھی موڈ اداس ہو، میں بنا کسی بحث کے آپ کے دل کی بات سنوں گا۔',
      tag: 'ہمدردی',
      emoji: '🎧',
    },
    {
      id: 'bf2',
      title: 'ہر لڑائی کے بعد من پسند ٹریٹ',
      description: 'صلح کروانے کے لیے پیزا، برگر یا بریانی ہمیشہ میری طرف سے ہو گی۔',
      tag: 'کھانا پینا',
      emoji: '🍕',
    },
    {
      id: 'bf3',
      title: 'غلطی کا اعادہ نہ کرنا',
      description: 'جس بات سے آپ کو دکھ پہنچا ہے، وعدہ ہے آئندہ ایسا کبھی نہیں ہو گا۔',
      tag: 'اصلاح',
      emoji: '🤞',
    },
    {
      id: 'bf4',
      title: 'ہر موڑ پر پکی دوستی',
      description: 'حالات جیسے بھی ہوں، آپ کا یہ دوست ہمیشہ آپ کے ساتھ کھڑا رہے گا۔',
      tag: 'وفاداری',
      emoji: '🤝',
    },
  ],
  punishments: [
    {
      id: 'p1',
      title: 'بڑی پیزا اور آئس کریم کی دعوت',
      description: 'میرے من پسند ریستوران میں سارا خرچہ آپ کا ہو گا، بنا کسی نخرے کے۔',
      icon: '🍕',
      tag: 'کھانے کا جرمانہ',
    },
    {
      id: 'p2',
      title: 'ویڈیو کال پر کان پکڑ کر 10 اٹھک بیٹھک',
      description: 'لائیو ویڈیو کال پر کان پکڑ کر معافی کی دس اٹھک بیٹھک لگانا ہوں گی۔',
      icon: '👂',
      tag: 'کلاسیک سزا',
    },
    {
      id: 'p3',
      title: 'ایک دن کے لیے مکمل حکم برداری',
      description: 'چوبیس گھنٹے تک کوئی بحث نہیں، جو میں کہوں گی وہی حرفِ آخر ہو گا۔',
      icon: '🤐',
      tag: 'شاہی حکم',
    },
    {
      id: 'p4',
      title: 'وائس نوٹ پر گانا گا کر سنانا',
      description: 'واٹس ایپ وائس نوٹ پر میرا پسندیدہ گانا گا کر سنانا ہو گا۔',
      icon: '🎤',
      tag: 'گانے کی سزا',
    },
    {
      id: 'p5',
      title: 'رات گئے کڑک چائے اور لانگ ڈرائیو',
      description: 'ٹھنڈی ہوا میں کار ڈرائیو، گپ شپ اور گرم چائے کی خاص ٹریٹ۔',
      icon: '☕',
      tag: 'پرسکون سفر',
    },
  ],
  dateOptions: [
    {
      id: 'chai_drive',
      title: 'لانگ ڈرائیو اور کڑک چائے',
      description: 'ٹھنڈی ہوا، پسندیدہ گانے اور پرسکون گپ شپ۔',
      icon: '☕',
      tag: 'دوستی سپیشل',
    },
    {
      id: 'food_treat',
      title: 'فاسٹ فوڈ اور پیزا پارٹی',
      description: 'پیزا، فرائز اور کولڈ ڈرنکس کی مکمل دعوت میری طرف سے۔',
      icon: '🍔',
      tag: 'ٹیسٹی ٹریٹ',
    },
    {
      id: 'cafe_chill',
      title: 'خوبصورت کیفے اور ڈیزرٹ',
      description: 'کسی پرسکون کیفے میں چاکلیٹ کیک اور میٹھی باتیں کا سیشن۔',
      icon: '🍰',
      tag: 'میٹھی یاد',
    },
    {
      id: 'gaming_movie',
      title: 'مووی نائٹ اور سنیکس',
      description: 'آپ کی پسندیدہ فلم اور بے شمار پاپ کارن۔',
      icon: '🎬',
      tag: 'سکون کا وقت',
    },
  ],
  coupons: [
    {
      id: 'bc1',
      title: 'مفت دعوت کا واؤچر',
      perk: 'یہ کارڈ دکھا کر آپ جب چاہیں پیزا یا آئس کریم منگوا سکتی ہیں!',
      code: 'BESTIE-FOOD-PASS',
    },
    {
      id: 'bc2',
      title: 'ہر بحث جیتنے کا گولڈن کارڈ',
      perk: 'جب بھی ہم میں تکرار ہو، یہ کارڈ پیش کر کے آپ بغیر سوال کے جیت جائیں گی۔',
      code: 'YOU-WIN-ALWAYS',
    },
    {
      id: 'bc3',
      title: 'ایمرجنسی مدد اور دلی تسلی کارڈ',
      perk: 'رات گئے بھی اگر پریشانی ہو تو فورا کال کرنے کی کھلی اجازت۔',
      code: 'LIFELINE-3AM',
    },
  ],
  themeColor: 'rose',
};

// Preset ROMAN URDU Romantic
export const PRESET_ROMAN_URDU: ProposalPayload = {
  relationshipTone: 'romantic',
  senderName: 'Kamran',
  receiverName: 'Meri Jaan',
  language: 'roman',
  headline: 'Please Maan Jao Na... 🥺❤️',
  subheadline: 'A sincere apology from the deepest corner of my heart',
  letter: `Meri pyari jaan,

Mujhe pata hai ke meri wajah se tumhara dil dukha hai, aur sach kahoon to jab se tum mujh se naraz hui ho, mera dil kisi cheez mein nahi lag raha. Tumhari ek muskurahat mere pooray din ki thakan mita deti hai, aur tumhari khamoshi mujhe andar se bechain kar deti hai.

Main maanta hoon ke ghalti meri thi. Main perfect nahi hoon, lekin tumhare liye mera pyaar 100% sacha hai. Humare darmiyan koi bhi larayi humare rishte se badi nahi ho sakti.

Kaan pakad ke, dil se sorry bol raha hoon... Kya tum apne Kamran ko ek baar maaf karke apni pyari si smile wapis la sakti ho? ❤️`,
  showPromises: true,
  showForgiveGame: true,
  showPunishmentGame: true,
  showDateInvite: true,
  showCoupons: true,
  promises: [
    {
      id: '1',
      title: 'Pehla Promise: Tumhein Hamesha Sunoonga',
      description: 'Jab bhi tum baat karna chaho gi, main bina arguments ke tumhari har baat dhyan se sunoonga.',
      tag: 'Understanding',
      emoji: '👂',
    },
    {
      id: '2',
      title: 'Doosra Promise: No More Ghussa',
      description: 'Chhoti baaton par be-wajah react karne ke bajaye hamesha patience aur pyaar se samjhoonga.',
      tag: 'Patience',
      emoji: '🕊️',
    },
    {
      id: '3',
      title: 'Teesra Promise: Tumhari Khushi First',
      description: 'Tumhari hansi meri sab se badi priority hai. Kabhi tumhari aankhon mein ansoo nahi aane doonga.',
      tag: 'Care',
      emoji: '✨',
    },
    {
      id: '4',
      title: 'Chautha Promise: Always Standing By You',
      description: 'Achhe waqt mein bhi aur mushkil waqt mein bhi, main hamesha tumhara haath thame rahoonga.',
      tag: 'Loyalty',
      emoji: '🤝',
    },
  ],
  punishments: [
    {
      id: 'p1',
      title: 'Chocolates & Flowers Delivery with Apology Note',
      description: 'Tumhari favorite chocolates aur fresh gulab ka bouquet ghar deliver karwana hoga.',
      icon: '💐',
      tag: 'Sweet Penalty',
    },
    {
      id: 'p2',
      title: '10 Uthak Baithak on Video Call',
      description: 'Video call par dono kaan pakad kar 10 uthak baithak laga kar sorry bolna hoga!',
      icon: '👂',
      tag: 'Cute Saza',
    },
    {
      id: 'p3',
      title: '1 Din Tak Meri Har Baat Man-na (Zero Inkaar)',
      description: 'Agley 24 ghante ke liye tum mere order par chaloge, no complaints!',
      icon: '👑',
      tag: 'Queen Order',
    },
    {
      id: 'p4',
      title: 'Voice Note Par Pyara Sa Romantic Song',
      description: 'Apni aawaz mein mera manpasand gaana ga kar voice note bhejna hoga.',
      icon: '🎤',
      tag: 'Voice Dare',
    },
    {
      id: 'p5',
      title: 'Special Late Night Ice Cream Treat',
      description: 'Midnight par tumhari favorite flavor ki ice cream khilane le jana hoga.',
      icon: '🍦',
      tag: 'Midnight Date',
    },
  ],
  dateOptions: [
    {
      id: 'icecream',
      title: 'Late Night Ice Cream & Peaceful Talks',
      description: 'Tumhari favorite flavor ki ice cream aur sukoon bhari baatein.',
      icon: '🍦',
      tag: 'Sweet & Cozy',
    },
    {
      id: 'dinner',
      title: 'Romantic Candlelight Dinner',
      description: 'Tumhari pasand ke restaurant mein tumhara favorite khana mere treat par.',
      icon: '🍝',
      tag: 'Special Evening',
    },
    {
      id: 'drive',
      title: 'Long Drive, Chai & Favorite Playlist',
      description: 'Khula rasta, thandi hawa, garam karak chai aur hum dono.',
      icon: '☕',
      tag: 'Peaceful Drive',
    },
    {
      id: 'movie',
      title: 'Cozy Movie Night & Snacks Treat',
      description: 'Jo movie tum kaho gi wahi chalegi, with unlimited chocolates & popcorn.',
      icon: '🎬',
      tag: 'Cozy Night',
    },
  ],
  coupons: [
    {
      id: 'c1',
      title: 'Golden Pass: Win Any Argument',
      perk: 'Is coupon ke zariye tum kisi bhi behas ko unconditionally jeet sakti ho!',
      code: 'ARGUMENT-WIN-100',
    },
    {
      id: 'c2',
      title: 'Unlimited Hugs & Cuddles Pass',
      perk: 'Whenever you feel sad or need comfort, redeemable anytime 24/7.',
      code: 'WARM-HUG-INFINITY',
    },
    {
      id: 'c3',
      title: 'Late Night Cravings Delivery',
      perk: 'Midnight par chocolates, fries ya pizza mangwane ka VIP pass.',
      code: 'CRAVINGS-TREAT',
    },
  ],
  themeColor: 'rose',
};

// Preset URDU Romantic
export const PRESET_URDU: ProposalPayload = {
  relationshipTone: 'romantic',
  senderName: 'کامران',
  receiverName: 'میری جان',
  language: 'ur',
  headline: 'مان جاؤ نا... دل سے معافی نامہ 🥺❤️',
  subheadline: 'ایک مخلصانہ التجا اور محبت بھرا پیغام، صرف آپ کے لیے',
  letter: `میری پیاری جان،

مجھے اچھی طرح احساس ہے کہ میری کسی بات یا عمل سے آپ کا دل دکھا ہے۔ سچ تو یہ ہے کہ جب سے آپ مجھ سے ناراض ہوئی ہیں، میری پوری دنیا جیسے بے رونق ہو گئی ہے۔ آپ کی مسکراہٹ میرے لیے سب کچھ ہے، اور آپ کی یہ خفگی مجھ سے برداشت نہیں ہو رہی۔

میں انسان ہوں، مجھ سے غلطی ہوئی ہے، لیکن آپ کے لیے میرا پیار ہر غلطی اور ہر شکوے سے کہیں زیادہ بڑا ہے۔ ہماری محبت کسی بھی ناراضگی سے کہیں زیادہ قیمتی ہے۔

میں اپنے دل کی گہرائیوں سے آپ سے معافی مانگتا ہوں۔ کیا آپ اپنے کامران کی اس معافی کو قبول کر کے وہی خوبصورت مسکراہٹ اپنے چہرے پر لائیں گی؟ ❤️`,
  showPromises: true,
  showForgiveGame: true,
  showPunishmentGame: true,
  showDateInvite: true,
  showCoupons: true,
  promises: [
    {
      id: '1',
      title: 'پہلا عہد: دل کی بات توجہ سے سننا',
      description: 'اب سے ہر بات کو پہلے سمجھوں گا اور آپ کے جذبات کا پورا احترام کروں گا۔',
      tag: 'احترام',
      emoji: '👂',
    },
    {
      id: '2',
      title: 'دوسرا عہد: صبر اور نرم مزاجی',
      description: 'غصے یا بحث کے بجائے ہمیشہ نرمی اور محبت سے معاملے کو سلجھاؤں گا۔',
      tag: 'صبر و محبت',
      emoji: '🕊️',
    },
    {
      id: '3',
      title: 'تیسرا عہد: آپ کی مسکراہٹ کی حفاظت',
      description: 'آپ کی آنکھوں میں کبھی اداسی نہیں آنے دوں گا، یہ میرا پکا وعدہ ہے۔',
      tag: 'خوشی',
      emoji: '✨',
    },
    {
      id: '4',
      title: 'چوتھا عہد: ہر موڑ پر ساتھ نبھانا',
      description: 'زندگی کی ہر خوشی اور ہر مشکل میں میرا ہاتھ ہمیشہ آپ کے ہاتھ میں رہے گا۔',
      tag: 'وفاداری',
      emoji: '🤝',
    },
  ],
  punishments: [
    {
      id: 'p1',
      title: 'چاکلیٹس اور سرخ گلابوں کا نذرانہ',
      description: 'گھر پر تازہ گلابوں کا گلدستہ اور پسندیدہ چاکلیٹس کا پارسل ڈیلیور کروانا ہو گا۔',
      icon: '💐',
      tag: 'میٹھی سزا',
    },
    {
      id: 'p2',
      title: 'ویڈیو کال پر کان پکڑ کر 10 اٹھک بیٹھک',
      description: 'لائیو ویڈیو کال پر کان پکڑ کر مسکراتے ہوئے دس اٹھک بیٹھک لگانا ہوں گی۔',
      icon: '👂',
      tag: 'روایتی سزا',
    },
    {
      id: 'p3',
      title: 'ایک دن کے لیے مکمل فرماں برداری',
      description: 'پورے 24 گھنٹے تک ہر بات پر "جی بالکل" کہنا ہو گا، کوئی تکرار نہیں۔',
      icon: '👑',
      tag: 'شاہی فرمان',
    },
    {
      id: 'p4',
      title: 'وائس نوٹ پر گانا گا کر سنانا',
      description: 'اپنی آواز میں میرا پسندیدہ رومانوی گانا گا کر واٹس ایپ پر بھیجنا ہو گا۔',
      icon: '🎤',
      tag: 'نغمہ سرائی',
    },
    {
      id: 'p5',
      title: 'رات کے وقت من پسند آئس کریم کی دعوت',
      description: 'رات گئے خاص طور پر آئس کریم کی دکان پر لے جا کر ٹریٹ دینا ہو گی۔',
      icon: '🍦',
      tag: 'میٹھی شام',
    },
  ],
  dateOptions: [
    {
      id: 'icecream',
      title: 'رات کے وقت آئس کریم اور پرسکون باتیں',
      description: 'آپ کی پسندیدہ آئس کریم اور دل کی تسلی بخش گفتگو۔',
      icon: '🍦',
      tag: 'میٹھی یاد',
    },
    {
      id: 'dinner',
      title: 'شمع دانوں کے جلو میں رومانوی ڈنر',
      description: 'آپ کے من پسند ریسٹورنٹ میں ایک خاص اور پروقار شام۔',
      icon: '🍝',
      tag: 'خاص شام',
    },
    {
      id: 'drive',
      title: 'خوشگوار لانگ ڈرائیو اور کڑک چائے',
      description: 'ٹھنڈی ہوا، رومانوی نغمے، چائے اور صرف ہم دونوں۔',
      icon: '☕',
      tag: 'پرسکون سفر',
    },
    {
      id: 'movie',
      title: 'گھر پر مووی نائٹ اور چاکلیٹس',
      description: 'آپ کی پسندیدہ فلم اور بے شمار چاکلیٹس کا نذرانہ۔',
      icon: '🎬',
      tag: 'آرام دہ وقت',
    },
  ],
  coupons: [
    {
      id: 'c1',
      title: 'گولڈن واؤچر: ہر بحث جیتنے کا حق',
      perk: 'یہ واؤچر پیش کرنے پر آپ بنا کسی سوال کے فوری طور پر بحث جیت جائیں گی!',
      code: 'ARGUMENT-WIN-100',
    },
    {
      id: 'c2',
      title: 'بے لوث محبت اور پناہ کا کارڈ',
      perk: 'جب بھی دل اداس ہو، چوبیس گھنٹے تسلی اور محبت کا پاس۔',
      code: 'WARM-HUG-INFINITY',
    },
    {
      id: 'c3',
      title: 'رات گئے من پسند کھانے کا واؤچر',
      perk: 'کسی بھی وقت چاکلیٹ، پیزا یا میٹھا منگوانے کی مکمل چھٹی۔',
      code: 'CRAVINGS-TREAT',
    },
  ],
  themeColor: 'rose',
};

// Preset ENGLISH
export const PRESET_ENGLISH: ProposalPayload = {
  relationshipTone: 'romantic',
  senderName: 'Kamran',
  receiverName: 'My Love',
  language: 'en',
  headline: 'Please Forgive Me... 🥺❤️',
  subheadline: 'A sincere letter written straight from my heart to yours',
  letter: `My Dearest,

I know I messed up, and seeing you upset hurts more than words could ever describe. Ever since there has been this silence between us, everything feels grey and out of place. Your laughter is my favorite sound in the whole world, and knowing I caused you pain breaks my heart.

I am not perfect, but what I feel for you is genuine, deep, and unwavering. No misunderstanding or mistake is larger than what we share.

I am truly, deeply sorry from the bottom of my soul. Will you give me a chance to make things right and bring back that radiant smile? ❤️`,
  showPromises: true,
  showForgiveGame: true,
  showPunishmentGame: true,
  showDateInvite: true,
  showCoupons: true,
  promises: [
    {
      id: '1',
      title: 'Promise 1: Listening with an Open Heart',
      description: 'To always pause, hear your thoughts, and understand your feelings before saying a word.',
      tag: 'Empathy',
      emoji: '👂',
    },
    {
      id: '2',
      title: 'Promise 2: Patience Over Pride',
      description: 'To let tenderness lead our conversations instead of impulsive reactions.',
      tag: 'Patience',
      emoji: '🕊️',
    },
    {
      id: '3',
      title: 'Promise 3: Protecting Your Happiness',
      description: 'To treat your peace and joy as my highest and most cherished duty.',
      tag: 'Joy',
      emoji: '✨',
    },
    {
      id: '4',
      title: 'Promise 4: Steadfast Companionship',
      description: 'Through sunny days and stormy nights, to never let go of your hand.',
      tag: 'Loyalty',
      emoji: '🤝',
    },
  ],
  punishments: [
    {
      id: 'p1',
      title: 'Chocolates & Roses Delivery with Apology Card',
      description: 'A box of your favorite chocolates and fresh roses delivered to your doorstep.',
      icon: '💐',
      tag: 'Sweet Fine',
    },
    {
      id: 'p2',
      title: '10 Ear-Holding Squats on Video Call',
      description: 'I will hold my ears and do 10 squats live on camera to earn my forgiveness!',
      icon: '👂',
      tag: 'Classic Penalty',
    },
    {
      id: 'p3',
      title: '1 Full Day of Unconditional Obedience',
      description: 'For 24 hours, your word is my absolute command without any pushback.',
      icon: '👑',
      tag: 'Queen Order',
    },
    {
      id: 'p4',
      title: 'Sing Your Favorite Song on Voice Note',
      description: 'I must record and send a full song chosen by you, no matter how silly I sound.',
      icon: '🎤',
      tag: 'Singing Dare',
    },
    {
      id: 'p5',
      title: 'Late Night Dessert & Scenic Drive',
      description: 'A peaceful night drive with your favorite playlist and ice cream treat on me.',
      icon: '🍦',
      tag: 'Night Treat',
    },
  ],
  dateOptions: [
    {
      id: 'icecream',
      title: 'Late Night Ice Cream & Quiet Talks',
      description: 'Your favorite ice cream flavors and hours of heartfelt conversation.',
      icon: '🍦',
      tag: 'Sweet Moments',
    },
    {
      id: 'dinner',
      title: 'Candlelit Dinner at Your Favorite Spot',
      description: 'Your favorite cuisine, soft music, and an evening dedicated purely to us.',
      icon: '🍝',
      tag: 'Romantic Evening',
    },
    {
      id: 'drive',
      title: 'Scenic Long Drive & Warm Chai',
      description: 'Cool breeze, our favorite acoustic songs, and starlit serenity.',
      icon: '☕',
      tag: 'Serenity',
    },
    {
      id: 'movie',
      title: 'Cozy Movie Night & Endless Snacks',
      description: 'You pick the movie, I provide the popcorn, chocolates, and blankets.',
      icon: '🎬',
      tag: 'Cozy Vibe',
    },
  ],
  coupons: [
    {
      id: 'c1',
      title: 'The Golden Pass: Win Any Dispute',
      perk: 'Present this coupon anytime to win any disagreement instantly, no questions asked.',
      code: 'ARGUMENT-WIN-100',
    },
    {
      id: 'c2',
      title: 'Endless Warm Hugs & Comfort',
      perk: 'Valid for unconditional warm embraces whenever your heart feels heavy.',
      code: 'WARM-HUG-INFINITY',
    },
    {
      id: 'c3',
      title: 'Midnight Cravings Delivery Ticket',
      perk: 'Instant delivery of your favorite snacks or dessert anytime, day or night.',
      code: 'CRAVINGS-TREAT',
    },
  ],
  themeColor: 'rose',
};
