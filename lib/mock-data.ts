// Realistic mock database for Al-Rakabiyyah digital ecosystem in Sudan.

export interface Person {
  id: string;
  name: string;
  fatherId?: string;
  motherId?: string;
  spouseId?: string;
  title?: string;
  avatarUrl?: string;
  birthYear?: string;
  deathYear?: string;
  bio?: string;
  profession?: "scholar" | "academic" | "doctor" | "engineer" | "lawyer" | "businessman" | "martyr" | "youth" | "student" | "woman" | "other";
  state: string; // Sudanese State
  locality: string;
  village: string;
  branch: string; // Branch name
  family: string; // Immediate family house name
  phone?: string;
  email?: string;
  nationalId?: string;
  isRegistered: boolean;
  membershipId?: string;
  joinDate?: string;
  achievements?: string[];
  documents?: string[];
}

export interface StateStats {
  state: string;
  familiesCount: number;
  branchesCount: number;
  membersCount: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "أخبار رسمية" | "مناسبات" | "بيان رسمي" | "توعية" | "تاريخ";
  image?: string;
  date: string;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  isUpcoming: boolean;
  image?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  category: "اجتماعي" | "تكافل" | "زكاة" | "تبرعات" | "اشتراكات" | "مساعدات" | "وظائف";
  ctaText: string;
  details: string;
}

// 1. Ancestry/Genealogy Tree Mock Database
export const peopleDatabase: Person[] = [
  // Ancestral Core Linage (Tracing to Rikab and Ghulamallah)
  {
    id: "1",
    name: "الشيخ غلام الله بن عايد",
    birthYear: "1350م",
    deathYear: "1410م",
    bio: "مؤسس منارة دنقلا العجوز والجد الجامع لمعظم السادة الركابية في السودان، قدم من اليمن لتعليم القرآن والعلوم الشرعية.",
    state: "الولاية الشمالية",
    locality: "دنقلا",
    village: "دنقلا العجوز",
    branch: "الأصول",
    family: "بيت الجد الأكبر",
    isRegistered: false,
  },
  {
    id: "2",
    name: "الشيخ ركاب بن غلام الله",
    fatherId: "1",
    birthYear: "1380م",
    deathYear: "1450م",
    bio: "الابن الأكبر للشيخ غلام الله، وعنه تفرعت بطون الركابية الكبرى في شتى أنحاء السودان.",
    state: "الولاية الشمالية",
    locality: "دنقلا",
    village: "دنقلا العجوز",
    branch: "الركابية الكبرى",
    family: "بيت ركاب",
    isRegistered: false,
  },
  {
    id: "3",
    name: "الشيخ حبيب بن ركاب",
    fatherId: "2",
    birthYear: "1410م",
    deathYear: "1482م",
    bio: "عالم وصاحب خلوة شهيرة لتحفيظ القرآن الكريم ونشر الدعوة في ربوع السودان الشمالي.",
    state: "الولاية الشمالية",
    locality: "الدبة",
    village: "الغابة",
    branch: "الحبيباب",
    family: "آل حبيب",
    isRegistered: false,
  },
  {
    id: "4",
    name: "الشيخ علي بن حبيب",
    fatherId: "3",
    birthYear: "1440م",
    deathYear: "1515م",
    bio: "من كبار المتصوفة وأعلام الهدى في القرن الخامس عشر الميلادي.",
    state: "الخرطوم",
    locality: "أم درمان",
    village: "الفتيحاب",
    branch: "الحبيباب",
    family: "آل علي",
    isRegistered: false,
  },

  // Modern registered and notable members
  {
    id: "101",
    name: "البروفيسور الطيب الركابي",
    fatherId: "4",
    title: "رئيس المجلس العلمي الأعلى",
    birthYear: "1954م",
    bio: "أستاذ الهندسة النووية بجامعة الخرطوم، باحث رائد في الطاقات المتجددة وله أكثر من 50 بحثاً عالمياً.",
    profession: "academic",
    state: "الخرطوم",
    locality: "الخرطوم",
    village: "الرياض",
    branch: "الحبيباب",
    family: "آل الطيب",
    phone: "+249912345678",
    email: "altayeb@alrikabiyyah.org",
    nationalId: "101020304050",
    isRegistered: true,
    membershipId: "RK-2026-0001",
    joinDate: "2024-01-15",
    achievements: ["جائزة الدولة التقديرية للعلوم والآداب 2021", "عضوية أكاديمية العلوم الأفريقية"],
  },
  {
    id: "102",
    name: "الشيخ عبد المجيد الركابي",
    fatherId: "4",
    title: "خطيب مسجد السادة الركابية ببحري",
    birthYear: "1962م",
    bio: "داعية إسلامي ومستشار فقهي مرموق، خريج جامعة أم درمان الإسلامية وله جهود دعوية مشهودة.",
    profession: "scholar",
    state: "الخرطوم",
    locality: "بحري",
    village: "شمبات",
    branch: "الصادقآب",
    family: "آل عبد المجيد",
    phone: "+249911112222",
    email: "abdulmajeed@alrikabiyyah.org",
    nationalId: "102030405060",
    isRegistered: true,
    membershipId: "RK-2026-0002",
    joinDate: "2024-02-10",
    achievements: ["مؤلف كتاب 'منارة الهدى في نسب الركابية الكبرى'", "إشراف على مجمع الركابية القرآني"],
  },
  {
    id: "103",
    name: "الدكتورة مريم عثمان الركابي",
    title: "استشارية طب الأطفال وجراحة القلب",
    birthYear: "1978م",
    bio: "رئيسة قسم القلب للأطفال بمستشفى الخرطوم التعليمي ومؤسسة جمعية قلوب الركابية التكافلية لعلاج الأطفال مجاناً.",
    profession: "doctor",
    state: "الجزيرة",
    locality: "مدني",
    village: "فداسي الحليماب",
    branch: "الحليماب",
    family: "آل عثمان",
    phone: "+249912223333",
    email: "maryam@alrikabiyyah.org",
    nationalId: "103040506070",
    isRegistered: true,
    membershipId: "RK-2026-0003",
    joinDate: "2024-03-01",
    achievements: ["مبادرة القلوب الدافئة الطبية لعلاج النازحين", "أفضل طبيب سوداني مبادر 2023"],
  },
  {
    id: "104",
    name: "المهندس عمر الفاروق الركابي",
    title: "مدير البنية التحتية والاتصالات",
    birthYear: "1985م",
    bio: "خبير نظم الشبكات وتطبيقات المدن الذكية، أشرف على مشروع الحوسبة الرقمية الشاملة والربط الإلكتروني للأسر الركابية.",
    profession: "engineer",
    state: "نهر النيل",
    locality: "شندي",
    village: "المتمة",
    branch: "الفاروقاب",
    family: "آل الفاروق",
    phone: "+249913334444",
    email: "omar@alrikabiyyah.org",
    nationalId: "104050607080",
    isRegistered: true,
    membershipId: "RK-2026-0004",
    joinDate: "2024-04-18",
    achievements: ["بناء البوابة الجغرافية للأسر السودانية", "جائزة التميز الهندسي العربي"],
  },
  {
    id: "105",
    name: "المستشار القانوني أحمد الركابي",
    title: "أمين الشؤون القانونية والمظالم",
    birthYear: "1970م",
    bio: "قاضي سابق بالمحكمة العليا ومستشار صياغة التشريعات، كاتب ومحامٍ يدافع عن حقوق الفئات الضعيفة وتوثيق أوقاف الركابية.",
    profession: "lawyer",
    state: "الخرطوم",
    locality: "أم درمان",
    village: "المهندسين",
    branch: "الشبابآب",
    family: "آل أحمد",
    phone: "+249914445555",
    email: "ahmed.legal@alrikabiyyah.org",
    nationalId: "105060708090",
    isRegistered: true,
    membershipId: "RK-2026-0005",
    joinDate: "2024-05-02",
  },
  {
    id: "106",
    name: "السيد صلاح الدين الركابي",
    title: "أمين صندوق التكافل والاستثمار",
    birthYear: "1965م",
    bio: "رئيس مجموعة الركابي القابضة للأعمال الزراعية والاستيراد، أحد كبار الداعمين لمشاريع الزواج الجماعي وتمليك المشاريع الإنتاجية الصغيرة.",
    profession: "businessman",
    state: "الخرطوم",
    locality: "الخرطوم",
    village: "كافوري",
    branch: "الذهبآب",
    family: "آل صلاح",
    phone: "+249915556666",
    email: "salah.biz@alrikabiyyah.org",
    nationalId: "106070809000",
    isRegistered: true,
    membershipId: "RK-2026-0006",
    joinDate: "2024-05-20",
  },
  {
    id: "107",
    name: "الشهيد الدكتور محمد أمين الركابي",
    title: "شهيد الواجب الطوعي والإنساني",
    birthYear: "1994م",
    deathYear: "2024م",
    bio: "استشهد أثناء تأدية واجبه المهني والإنساني في إنقاذ وعلاج جرحى ومصابي الحرب بمركز صحي بحري التكافلي تحت القصف المستمر.",
    profession: "martyr",
    state: "الخرطوم",
    locality: "بحري",
    village: "حلة حمد",
    branch: "الأمينآب",
    family: "آل أمين",
    isRegistered: true,
    membershipId: "RK-SH-0007",
    joinDate: "2024-06-01",
    achievements: ["وسام الشرف الإنساني من الهلال الأحمر السوداني 2024"],
  },
  {
    id: "108",
    name: "الشاب المهندس حسن الركابي",
    title: "رئيس مبادرة شباب التكافل والإغاثة",
    birthYear: "1997م",
    bio: "يقود غرف الطوارئ الشبابية وتوزيع الإمدادات الغذائية والطبية للنازحين في ولايات السودان المختلفة.",
    profession: "youth",
    state: "الجزيرة",
    locality: "المناقل",
    village: "القرية 24",
    branch: "الحسينآب",
    family: "آل حسن",
    phone: "+249916667777",
    email: "hassan.youth@alrikabiyyah.org",
    nationalId: "107080900111",
    isRegistered: true,
    membershipId: "RK-2026-0008",
    joinDate: "2024-07-12",
  },
  {
    id: "109",
    name: "الطالبة فاطمة الركابي",
    title: "رئيسة رابطة طلاب الركابية بالجامعات السودانية",
    birthYear: "2003م",
    bio: "طالبة بكلية الطب جامعة الخرطوم، حائزة على المرتبة الأولى في الشهادة السودانية وناشطة في تنظيم كورسات التقوية الرقمية للطلاب النازحين.",
    profession: "student",
    state: "القضارف",
    locality: "القضارف",
    village: "حي المطار",
    branch: "الفضلآب",
    family: "آل فضل",
    phone: "+249917778888",
    email: "fatima.stud@alrikabiyyah.org",
    nationalId: "108090011222",
    isRegistered: true,
    membershipId: "RK-2026-0009",
    joinDate: "2024-08-05",
  },
  {
    id: "110",
    name: "الأستاذة آمنة سليمان الركابي",
    title: "رئيسة جمعية المرأة الركابية المنتجة",
    birthYear: "1972م",
    bio: "رائدة عمل مجتمعي وتدريب نسوي، أسست 12 مشغلاً يدوياً لتدريب وتأهيل الأرامل ونساء الأسر المتعففة على الخياطة وصناعات الأغذية المحلية في ولاية نهر النيل.",
    profession: "woman",
    state: "نهر النيل",
    locality: "عطبرة",
    village: "الداخلة",
    branch: "سليمانآب",
    family: "آل سليمان",
    phone: "+249918889999",
    email: "amna.women@alrikabiyyah.org",
    nationalId: "109000112233",
    isRegistered: true,
    membershipId: "RK-2026-0010",
    joinDate: "2024-08-15",
  }
];

// 2. Geographic Statistics Matrix
export const geographicStats: StateStats[] = [
  { state: "الخرطوم", familiesCount: 1450, branchesCount: 24, membersCount: 8900 },
  { state: "الولاية الشمالية", familiesCount: 1890, branchesCount: 32, membersCount: 12500 },
  { state: "نهر النيل", familiesCount: 1200, branchesCount: 18, membersCount: 7400 },
  { state: "الجزيرة", familiesCount: 1320, branchesCount: 22, membersCount: 8100 },
  { state: "سنار", familiesCount: 540, branchesCount: 10, membersCount: 3200 },
  { state: "النيل الأبيض", familiesCount: 680, branchesCount: 12, membersCount: 4100 },
  { state: "القضارف", familiesCount: 420, branchesCount: 8, membersCount: 2600 },
  { state: "كسلا", familiesCount: 310, branchesCount: 6, membersCount: 1800 },
  { state: "البحر الأحمر", familiesCount: 250, branchesCount: 5, membersCount: 1400 },
  { state: "ولايات كردفان", familiesCount: 510, branchesCount: 9, membersCount: 3100 },
  { state: "ولايات دارفور", familiesCount: 380, branchesCount: 7, membersCount: 2200 },
];

// Global Dashboard / Database Statistics Counters
export const globalStatistics = {
  totalRegisteredMembers: 55400,
  totalFamiliesCount: 8950,
  totalBranchesCount: 163,
  activeStatesCount: 11,
  scholarsCount: 142,
  academicsCount: 385,
  doctorsCount: 290,
  engineersCount: 512,
  lawyersCount: 180,
  businessmenCount: 95,
  martyrsCount: 114,
  youthCount: 12400,
  studentsCount: 8500,
  womenCount: 14600,
};

// 3. News Feed Database
export const newsDatabase: NewsItem[] = [
  {
    id: "news-1",
    title: "انعقاد الملتقى السنوي العام للسادة الركابية بنهر النيل",
    summary: "تحت شعار 'التراحم والتكافل يجمعنا'، عقد السادة الركابية ملتقاهم السنوي بعطبرة لمناقشة تفعيل لجان الطوارئ الإنسانية وتوفير مأوى للأسر الوافدة.",
    content: "تحت رعاية الأمانة العامة للمجلس الأعلى للسادة الركابية، وبحضور عدد كبير من أعيان وعلماء وشباب الطائفة، انعقد الملتقى التفاكري السنوي بولاية نهر النيل. ناقش الملتقى العديد من القضايا الوطنية والمجتمعية الملحة، وعلى رأسها خطة الصمود والتكافل لتوفير سبل العيش الكريمة للأسر التي تضررت من الأوضاع الحالية في الخرطوم ومختلف ولايات البلاد. كما تم الإعلان عن تدشين 'صندوق الطوارئ العاجل' بمساهمة مقدرة من رجال الأعمال الركابية.",
    category: "أخبار رسمية",
    date: "2026-08-10",
    featured: true,
  },
  {
    id: "news-2",
    title: "بيان هام من المجلس الأعلى حول توثيق أوقاف الركابية والمنشآت التاريخية",
    summary: "أصدرت اللجنة القانونية بالمجلس الأعلى بياناً تؤكد فيه بدء تشكيل لجنة وطنية برئاسة خبراء لتوثيق وحصر الأوقاف التاريخية والمساجد والخلاوي والمنشآت الأثرية.",
    content: "صرح المستشار القانوني أحمد الركابي بأن المجلس الأعلى اعتمد رسمياً الميزانية التشغيلية لأعمال الحصر الرقمي الشامل لجميع الأوقاف التابعة للسادة الركابية بالسودان، بما يضمن حمايتها قانونياً وتسجيلها إلكترونياً. وسيتم فتح نافذة لأبناء الأسرة لتقديم الوثائق والمخطوطات التاريخية التي بحوزتهم لتسهيل عمليات التثبت والتوثيق الأثري والشرعي.",
    category: "بيان رسمي",
    date: "2026-08-05",
    featured: true,
  },
  {
    id: "news-3",
    title: "صندوق التكافل يدشن المرحلة الرابعة لكفالة الأيتام والطلاب المتفوقين",
    summary: "تستهدف الحملة الجديدة كفالة أكثر من 1200 يتيم ورعاية 500 طالب جامعي في التخصصات الطبية والهندسية من أبناء الركابية.",
    content: "أعلنت أمانة الخدمات الاجتماعية والتكافلية بالمنصة عن فتح باب التسجيل وتحديث البيانات للأسر الحاضنة للأيتام وطلاب الجامعات لتلقي الدعم المباشر والمستمر للمرحلة الرابعة، بتمويل كامل من الاشتراكات الشهرية وتبرعات المحسنين من أبناء السادة الركابية بالسودان والمغتربين بالخارج.",
    category: "أخبار رسمية",
    date: "2026-07-28",
    featured: false,
  },
  {
    id: "news-4",
    title: "مخطوط تاريخي نادر يكشف تفاصيل جديدة عن رحلة الشيخ غلام الله بن عايد",
    summary: "تمكن الباحثون في مركز المعرفة والتراث الركابي من تحقيق ونشر وثيقة مكتوبة تعود للقرن الثامن الهجري تسجل ترحيب ملوك النوبة بالشيخ غلام الله.",
    content: "أظهر التحقيق العلمي الدقيق للمخطوطة التاريخية التي تم العثور عليها في مكتبة خلوة دنقلا العجوز، تفاصيل نادرة جداً حول الدور الدعوي والتعليمي الرائد للشيخ غلام الله بن عايد وجهوده الاستثنائية في إرساء دعائم الوحدة الدينية والثقافية في أواسط السودان. المخطوطة باتت متاحة رقمياً بالكامل بمكتبة الركابية للمهتمين بالبحث التاريخي والأنساب.",
    category: "تاريخ",
    date: "2026-07-15",
    featured: false,
  },
];

// 4. Events Database
export const eventsDatabase: EventItem[] = [
  {
    id: "event-1",
    title: "الندوة الكبرى: دور الوقف العلمي والقرآني في الحفاظ على الهوية السودانية",
    description: "ندوة حوارية تفاعلية يشارك فيها نخبة من علماء الشريعة والمؤرخين بالمجلس الأعلى لمناقشة إحياء دور المساجد والخلاوي التاريخية الركابية كمنارات إشعاع معرفي.",
    date: "2026-08-25",
    time: "06:00 مساءً",
    location: "بث مباشر عبر المنصة الرقمية وقاعة مجمع الركابية بعطبرة",
    isUpcoming: true,
  },
  {
    id: "event-2",
    title: "اليوم الطبي المفتوح للتطعيم والاستشارات الطبية المجانية للأطفال",
    description: "بمبادرة ورعاية الدكتورة مريم عثمان الركابي وعدد من الكوادر الطبية بالمنظمة، يقام يوم صحي علاجي شامل للأطفال والأسر المتعففة والوافدة.",
    date: "2026-09-02",
    time: "09:00 صباحاً",
    location: "مستشفى الفاشر الطبي / مركز صحي بورتسودان التكافلي",
    isUpcoming: true,
  },
  {
    id: "event-3",
    title: "حفل تكريم المتفوقين في امتحانات الشهادة السودانية والجامعية",
    description: "احتفالية سنوية لتكريم الطلاب المتفوقين دراسياً وعلمياً وتوزيع منح التميز الأكاديمي المقدمة من السادة الركابية.",
    date: "2026-05-12",
    time: "10:00 صباحاً",
    location: "قاعة النيل الكبرى، أم درمان (فعالية سابقة)",
    isUpcoming: false,
  },
];

// 5. Social Services Database
export const servicesDatabase: ServiceItem[] = [
  {
    id: "service-1",
    title: "صندوق التكافل الأسري",
    description: "نظام كفالة ودعم للأسر المتعففة والمتضررة من الأوضاع الاستثنائية، يشمل المساعدات الغذائية والعلاجية الشهرية السريعة.",
    category: "تكافل",
    ctaText: "طلب كفالة أو تقديم دعم",
    details: "يقدم الصندوق إعانات نقدية وعينية للأسر المسجلة والتحقق منها عن طريق ممثلي الفروع والمحليات. يمكنك طلب المساعدة أو التبرع المباشر عبر البوابة الآمنة للمنصة.",
  },
  {
    id: "service-2",
    title: "مبادرة تيسير الزواج الجماعي",
    description: "مبادرة دورية لتيسير زواج الشباب والشابات بتمويل وإشراف أمانة الشؤون الاجتماعية والتكافلية لتعزيز أواصر المودة والتعاون.",
    category: "اجتماعي",
    ctaText: "تسجيل طلب انضمام للمبادرة",
    details: "تشمل المبادرة المساعدة في تجهيز المنازل، المساهمة النقدية وتغطية كامل مصاريف عقد القران الجماعي السنوي تيسيراً وتسهيلاً للشباب.",
  },
  {
    id: "service-3",
    title: "الزكاة والصدقات العاجلة",
    description: "إخراج وتوزيع مصارف الزكاة والصدقات وفق القنوات الشرعية الرسمية لخدمة الفقراء والمساكين وعابري السبيل من أبناء السودان الكرام.",
    category: "زكاة",
    ctaText: "احسب زكاتك وأرسلها الآن",
    details: "توفر الواجهة حاسبة زكاة متطورة للذهب والفضة والأنعام والأموال والمحاصيل الزراعية مع إمكانية تحويل المبالغ مباشرة إلى الحسابات البنكية المعتمدة للمجلس الأعلى.",
  },
  {
    id: "service-4",
    title: "بنك الوظائف وفرص التدريب",
    description: "ربط الكفاءات والشباب الركابي بفرص العمل والتدريب لدى المؤسسات والشركات المملوكة لرجال الأعمال ومجموعة الركابي الاقتصادية.",
    category: "وظائف",
    ctaText: "استعراض الوظائف الشاغرة",
    details: "يمكن للشباب الخريجين رفع السيرة الذاتية واختيار التخصص المهني، كما يمكن لأصحاب الأعمال طرح فرص التوظيف الشاغرة وبرامج التدريب الصيفية.",
  },
];
