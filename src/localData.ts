import { Course, Assignment, AssignmentSubmission, StudentProgress, ChatMessage, Notification, SalesReport } from './types';

// Let's seed initial data
export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    description: 'រៀនពីមូលដ្ឋានរហូតដល់កម្រិតអាជីពក្នុងការបង្កើតវេបសាយទំនើបៗជាមួយ React.js, Tailwind CSS និង Node.js។ គ្របដណ្តប់លើការភ្ជាប់ Database និងការដាក់ដំណើរការវេបសាយនៅលើ cloud ល្បឿនលឿន។',
    price: 49.00,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    duration: '24 ម៉ោង (36 lesson)',
    instructor: 'លោកគ្រូ សុខ វិបុល',
    category: 'Programming',
    rating: 4.9,
    isDownloaded: false,
    lessons: [
      { id: 'l1_1', title: 'មេរៀនទី១៖ សេចក្តីផ្តើមអំពី React និងការតម្លើងបរិស្ថានការងារ', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '15:20' },
      { id: 'l1_2', title: 'មេរៀនទី២៖ ការប្រើប្រាស់ components, props និង state', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '20:45' },
      { id: 'l1_3', title: 'មេរៀនទី៣៖ ការភ្ជាប់ APIs ជាមួយ Axios និង Fetch', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '25:10' },
      { id: 'l1_4', title: 'មេរៀនទី៤៖ ការរៀបចំទម្រង់បែបផែន Navigation ជាមួយ React Router', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '18:30' },
      { id: 'l1_5', title: 'មេរៀនទី៥៖ ការអនុវត្តផ្ទាល់ បង្កើត Dashboard លក់ទំនិញ', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', duration: '32:15' }
    ]
  },
  {
    id: 'c2',
    title: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី',
    description: 'ស្វែងយល់ពីរបៀបរចនាផ្ទៃកម្មវិធីទូរស័ព្ទ និងវេបសាយឱ្យស្អាត ទាក់ទាញ និងងាយស្រួលប្រើប្រាស់។ រៀនគូរ Wireframe ជាមួយ Figma ព្រមទាំងយុទ្ធសាស្ត្រជ្រើសរើសព័ត៌មានពណ៌ និងអក្សរ។',
    price: 35.00,
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80',
    duration: '15 ម៉ោង (20 lesson)',
    instructor: 'អ្នកគ្រូ លី ដានី',
    category: 'Design',
    rating: 4.8,
    isDownloaded: false,
    lessons: [
      { id: 'l2_1', title: 'មេរៀនទី១៖ អ្វីទៅជា UI និង UX? ខុសគ្នាយ៉ាងដូចម្តេច?', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '12:10' },
      { id: 'l2_2', title: 'មេរៀនទី២៖ មូលដ្ឋានគ្រឹះនៃ Figma និងការបង្កើត Grid System', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '22:40' },
      { id: 'l2_3', title: 'មេរៀនទី៣៖ ការជ្រើសរើសព័ណ៌ (Color Palette) និងការប្រើប្រាស់ Fonts', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', duration: '16:50' },
      { id: 'l2_4', title: 'មេរៀនទី៤៖ ការរចនា Mobile App Screens សម្រាប់ iOS & Android', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '28:15' }
    ]
  },
  {
    id: 'c3',
    title: 'ភាសាអង់គ្លេសសម្រាប់ការប្រាស្រ័យទាក់ទងក្នុងអាជីព (Career English)',
    description: 'ត្រៀមខ្លួនសម្រាប់ទីផ្សារការងារលំដាប់អន្តរជាតិ! រៀនសរសេរអ៊ីមែលផ្លូវការ ការធ្វើបទបង្ហាញបែបមានទំនុកចិត្ត និងការសម្ភាសន៍ការងារជាភាសាអង់គ្លេសប្រកបដោយប្រសិទ្ធភាពខ្ពស់។',
    price: 25.00,
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    duration: '12 ម៉ោង (18 lesson)',
    instructor: 'លោកគ្រូ ចាន់ សុភី',
    category: 'Language',
    rating: 4.7,
    isDownloaded: false,
    lessons: [
      { id: 'l3_1', title: 'Unit 1: Effective Business Introductions', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '14:30' },
      { id: 'l3_2', title: 'Unit 2: Professional Email Etiquette & Formatting', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '19:15' },
      { id: 'l3_3', title: 'Unit 3: Acing Job Interviews & Explaining Your Skills', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '23:50' }
    ]
  },
  {
    id: 'c4',
    title: 'យុទ្ធសាស្ត្រទីផ្សារឌីជីថល Digital Marketing តម្រង់ទិសពាណិជ្ជកម្មខ្មែរ',
    description: 'ជម្រុញការលក់របស់អ្នកនៅលើបណ្តាញសង្គមដ៏ពេញនិយម! រៀនប្រើប្រាស់ Facebook Ads, TikTok Ads និងល្បិចសរសេរ content (Copywriting) ទាក់ទាញចិត្តអតិថិជន និងបំបែកកំណត់ត្រាលក់។',
    price: 29.00,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    duration: '18 ម៉ោង (24 lesson)',
    instructor: 'លោកគ្រូ រិទ្ធី សោភ័ណ',
    category: 'Marketing',
    rating: 4.6,
    isDownloaded: false,
    lessons: [
      { id: 'l4_1', title: 'មេរៀនទី១៖ ស្វែងយល់ពី Customer Persona នៅក្នុងទីផ្សារកម្ពុជា', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', duration: '18:10' },
      { id: 'l4_2', title: 'មេរៀនទី២៖ ក្បួនសរសេរ Caption លក់ទំនិញឱ្យផ្ទុះការគាំទ្រ (AIDA Model)', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '22:30' },
      { id: 'l4_3', title: 'មេរៀនទី៣៖ ការបង្កើត និងគ្រប់គ្រង Campaign ផ្សាយពាណិជ្ជកម្មលើ Facebook', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '29:45' }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    title: 'កិច្ចការទី១៖ បង្កើត Component សាមញ្ញនិងបញ្ចូន Props',
    description: 'ចូរបង្កើត Functional Component មួយឈ្មោះថា UserCard ដែលទទួល Props ដូចជា name, email និង profileImage រួចបង្ហាញនៅក្នុង interface ស្អាតបាតមួយដោយប្រើ Tailwind CSS។',
    deadline: '2026-06-05T23:59:00Z'
  },
  {
    id: 'a2',
    courseId: 'c1',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    title: 'កិច្ចការទី២៖ បង្កើត Todo-List App ជាមួយ LocalStorage',
    description: 'ចូរបង្កើតកម្មវិធីកត់ត្រាកិច្ចការប្រចាំថ្ងៃ ដោយអនុញ្ញាតឱ្យបន្ថែម លុប និងកត់ចំណាំថាបានធ្វើរួច រួចរក្សាទុកទិន្នន័យទាំងអស់នេះក្នុង LocalStorage ដើម្បីកុំឱ្យបាត់បង់ពេល Refresh ទំព័រ។',
    deadline: '2026-06-12T23:59:00Z'
  },
  {
    id: 'a3',
    courseId: 'c2',
    courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី',
    title: 'កិច្ចការទី១៖ រៀបចំ Wireframe សម្រាប់ App កុម្ម៉ង់អាហារ',
    description: 'ចូរគូរ Mockup/Wireframe សម្រាប់ទំព័រដើម (Homepage) របស់ App កុម្ម៉ង់អាហារនៅលើទូរស័ព្ទដៃ ដោយកំណត់ទីតាំង Search-bar, Categories, Trending Food, and Navigation bar។ ធានាថាការរៀបចំមានលំដាប់លំដោយលំហូរល្អ (User flow)។',
    deadline: '2026-06-08T23:59:00Z'
  }
];

export const INITIAL_ASSIGNMENT_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub1',
    assignmentId: 'a1',
    assignmentTitle: 'កិច្ចការទី១៖ បង្កើត Component សាមញ្ញនិងបញ្ចូន Props',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    studentName: 'គឹម ហេង',
    studentId: 'st1',
    submittedAt: '2026-05-24T14:32:00Z',
    score: 95,
    feedback: 'ធ្វើបានល្អណាស់! កូដមានសណ្តាប់ធ្នាប់ ព្រមទាំងរចនា Interface ស្អាតប្លែក និងឆ្លើយតបបានយ៉ាងល្អនៅលើទូរស័ព្ទ។',
    status: 'graded'
  },
  {
    id: 'sub2',
    assignmentId: 'a3',
    assignmentTitle: 'កិច្ចការទី១៖ រៀបចំ Wireframe សម្រាប់ App កុម្ម៉ង់អាហារ',
    courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី',
    studentName: 'សុជាតិ សុភ័ក្ត្រ',
    studentId: 'st2',
    submittedAt: '2026-05-27T09:15:00Z',
    score: 88,
    feedback: 'Wireframe រៀបចំបានសមរម្យ ប៉ុន្តែគួរតែបន្ថែមចន្លោះ White-space បន្ថែមទៀតនៅជុំវិញរូបភាព ដើម្បីកាត់បន្ថយភាពចង្អៀត។',
    status: 'graded'
  },
  {
    id: 'sub3',
    assignmentId: 'a1',
    assignmentTitle: 'កិច្ចការទី១៖ បង្កើត Component សាមញ្ញនិងបញ្ចូន Props',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    studentName: 'លីណា វណ្ណៈ',
    studentId: 'st3',
    submittedAt: '2026-05-28T03:45:00Z',
    score: -1,
    feedback: '',
    status: 'submitted'
  }
];

export const INITIAL_STUDENT_PROGRESS: StudentProgress[] = [
  {
    studentId: 'st1',
    studentName: 'គឹម ហេង',
    studentEmail: 'kim.heng@gmail.com',
    courseId: 'c1',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    progressPercentage: 60,
    lessonsCompleted: ['l1_1', 'l1_2', 'l1_3'],
    lastAccessed: '2026-05-28T08:12:00Z'
  },
  {
    studentId: 'st1',
    studentName: 'គឹម ហេង',
    studentEmail: 'kim.heng@gmail.com',
    courseId: 'c2',
    courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី',
    progressPercentage: 25,
    lessonsCompleted: ['l2_1'],
    lastAccessed: '2026-05-27T10:45:00Z'
  },
  {
    studentId: 'st2',
    studentName: 'សុជាតិ សុភ័ក្ត្រ',
    studentEmail: 'socheat.s@gmail.com',
    courseId: 'c2',
    courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី',
    progressPercentage: 50,
    lessonsCompleted: ['l2_1', 'l2_2'],
    lastAccessed: '2026-05-28T01:30:00Z'
  },
  {
    studentId: 'st3',
    studentName: 'លីណា វណ្ណៈ',
    studentEmail: 'lina.vannak99@gmail.com',
    courseId: 'c1',
    courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)',
    progressPercentage: 40,
    lessonsCompleted: ['l1_1', 'l1_2'],
    lastAccessed: '2026-05-28T05:22:00Z'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', senderId: 'st1', senderName: 'គឹម ហេង', senderRole: 'student', text: 'សួស្តីបាទលោកគ្រូ! តើក្នុងវគ្គសិក្សា React នេះ យើងនឹងបង្រៀនពីការធ្វើ Global State ជាមួយ Zustand ដែរឬទេបាទ?', timestamp: '2026-05-28T02:00:00Z' },
  { id: 'm2', senderId: 'teacher', senderName: 'លោកគ្រូ សុខ វិបុល', senderRole: 'teacher', text: 'បាទសួស្តីប្អូនហេង! ពិតជាមានបង្រៀនប្អូន។ មេរៀនចុងក្រោយយើងផ្តោតលើ Zustand និងការគ្រប់គ្រង state ធំៗក្នុងកម្មវិធីលំដាប់ផលិតកម្ម (Production code)។', timestamp: '2026-05-28T02:05:00Z' },
  { id: 'm3', senderId: 'st1', senderName: 'គឹម ហេង', senderRole: 'student', text: 'អរគុណច្រើនបាទលោកគ្រូ! ល្អអស្ចារ្យណាស់ ខ្ញុំទន្ទឹងរង់ចាំរៀនដល់ចំណុចនោះណាស់!', timestamp: '2026-05-28T02:07:00Z' },
  { id: 'm4', senderId: 'st2', senderName: 'សុជាតិ សុភ័ក្ត្រ', senderRole: 'student', text: 'សួស្តីអ្នកគ្រូដានី តើ Figma របស់ខ្ញុំអាច Export រូបភាពជា SVG ទៅប្រើជា Icon ក្នុងទូរស័ព្ទដោយមិនបាច់ប្រើ PNG បានទេ?', timestamp: '2026-05-28T04:10:00Z' }
];

export const INITIAL_SALES_REPORTS: SalesReport[] = [
  { id: 's1', courseId: 'c1', courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)', amount: 49.00, buyerName: 'គឹម ហេង', buyerEmail: 'kim.heng@gmail.com', timestamp: '2026-05-20T10:15:00Z', bankUsed: 'ABA Bank', transactionId: 'TRX-829104-ABA' },
  { id: 's2', courseId: 'c2', courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី', amount: 35.00, buyerName: 'គឹម ហេង', buyerEmail: 'kim.heng@gmail.com', timestamp: '2026-05-21T09:30:00Z', bankUsed: 'Wing Bank', transactionId: 'TRX-748291-WING' },
  { id: 's3', courseId: 'c2', courseTitle: 'សិល្បៈនៃការរចនា UI/UX Mobile & Web Design សម្រាប់អ្នកជំនាន់ថ្មី', amount: 35.00, buyerName: 'សុជាតិ សុភ័ក្ត្រ', buyerEmail: 'socheat.s@gmail.com', timestamp: '2026-05-24T15:45:00Z', bankUsed: 'ABA Bank', transactionId: 'TRX-910243-ABA' },
  { id: 's4', courseId: 'c1', courseTitle: 'វគ្គសិក្សាបង្កើតគ្រប់គ្រងវេបសាយ Full-Stack React & Node (KH)', amount: 49.00, buyerName: 'លីណា វណ្ណៈ', buyerEmail: 'lina.vannak99@gmail.com', timestamp: '2026-05-26T11:20:00Z', bankUsed: 'Acleda Bank', transactionId: 'TRX-104928-ACLED' },
  { id: 's5', courseId: 'c3', courseTitle: 'ភាសាអង់គ្លេសសម្រាប់ការប្រាស្រ័យទាក់ទងក្នុងអាជីព (Career English)', amount: 25.00, buyerName: 'ម៉ៅ សម្បត្តិ', buyerEmail: 'mao.sambath@gmail.com', timestamp: '2026-05-27T08:05:00Z', bankUsed: 'ABA Bank', transactionId: 'TRX-304918-ABA' }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'ការចុះឈ្មោះជោគជ័យ', message: 'អ្នកបានចុះឈ្មោះចូលរៀនក្នុងវគ្គសិក្សា "Full-Stack React & Node" ដោយជោគជ័យតាមរយៈ ABA KHQR!', type: 'success', timestamp: '2026-05-28T01:00:00Z', read: false },
  { id: 'n2', title: 'ការរំលឹកកាលកំណត់កិច្ចការ', message: 'កិច្ចការ៖ "បង្កើត Component សាមញ្ញនិងបញ្ចូន Props" នឹងដល់កាលកំណត់ប្រគល់នៅថ្ងៃទី 05 ខែមិថុនា ឆ្នាំ 2026 ខាងមុខនេះ។', type: 'warning', timestamp: '2026-05-28T03:00:00Z', read: false },
  { id: 'n3', title: 'មតិយោបល់លើកិច្ចការ', message: 'លោកគ្រូ សុខ វិបុល បានកែ និងផ្តល់ពិន្ទុ ៩៥/១០០ លើ "កិច្ចការទី១៖ props" របស់អ្នករួចរាល់ហើយ។', type: 'info', timestamp: '2026-05-28T04:30:00Z', read: true }
];
