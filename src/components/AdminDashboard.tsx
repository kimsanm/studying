import React, { useState } from 'react';
import {
  TrendingUp, Users, BookOpen, Layers, PlusCircle, Trash, Landmark,
  Download, FileText, CheckCircle2, MessageSquare, Star, ArrowRight,
  TrendingDown, Plus, Video, Calendar, Printer, ShieldAlert
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Course, SalesReport, StudentProgress, AssignmentSubmission, ChatMessage, Lesson } from '../types';

interface AdminDashboardProps {
  courses: Course[];
  sales: SalesReport[];
  students: StudentProgress[];
  submissions: AssignmentSubmission[];
  messages: ChatMessage[];
  onAddCourse: (newCourse: Course) => void;
  onGradeSubmission: (submissionId: string, score: number, feedback: string) => void;
  onSelectStudentChat: (studentName: string) => void;
  onDeleteCourse: (courseId: string) => void;
}

export default function AdminDashboard({
  courses,
  sales,
  students,
  submissions,
  messages,
  onAddCourse,
  onGradeSubmission,
  onSelectStudentChat,
  onDeleteCourse
}: AdminDashboardProps) {
  // Tabs: 'analytics' | 'courses' | 'students' | 'assignments'
  const [activeTab, setActiveTab] = useState<'analytics' | 'courses' | 'students' | 'assignments'>('analytics');

  // New Course Form State
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [coursePrice, setCoursePrice] = useState('29.00');
  const [courseCategory, setCourseCategory] = useState('Programming');
  const [courseImg, setCourseImg] = useState('https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=800&q=80');
  const [instructor, setInstructor] = useState('លោកគ្រូ សុខ វិបុល');
  const [lessonsDraft, setLessonsDraft] = useState<Omit<Lesson, 'id'>[]>([
    { title: 'មេរៀនទី១៖ សេចក្តីផ្តើម និងការរៀបចំ Workspace', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '12:30' },
    { title: 'មេរៀនទី២៖ ការសរសេរកម្មវិធីអនុវត្តដំបូង', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '18:15' }
  ]);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonUrl, setNewLessonUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4');
  const [newLessonDur, setNewLessonDur] = useState('15:00');

  // Homework grading state
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState(90);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Selected student for Detailed Performance Report
  const [selectedReportStudent, setSelectedReportStudent] = useState<string | null>(null);

  // Calculated Metrics
  const totalRevenue = sales.reduce((sum, item) => sum + item.amount, 0);
  const totalEnrollments = sales.length;
  const avgProgress = students.length > 0
    ? Math.round(students.reduce((sum, item) => sum + item.progressPercentage, 0) / students.length)
    : 0;

  // Recharts Sales Data formatting
  const chartSalesData = sales.map(s => ({
    date: new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    amount: s.amount
  }));

  // Recharts course distribution
  const courseCountData = courses.map(c => {
    const enrolls = sales.filter(s => s.courseId === c.id).length;
    return { name: c.title.substring(0, 16) + '...', enrollments: enrolls };
  });

  const handleAddLessonDraft = () => {
    if (!newLessonTitle) return;
    setLessonsDraft([...lessonsDraft, {
      title: newLessonTitle,
      videoUrl: newLessonUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: newLessonDur || '10:00'
    }]);
    setNewLessonTitle('');
  };

  const handleRemoveLessonDraft = (index: number) => {
    setLessonsDraft(lessonsDraft.filter((_, i) => i !== index));
  };

  const handleSubmitCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle || lessonsDraft.length === 0) return;

    const finalLessons: Lesson[] = lessonsDraft.map((l, index) => ({
      id: `lesson_${Date.now()}_${index}`,
      ...l
    }));

    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: courseTitle,
      description: courseDesc,
      price: parseFloat(coursePrice),
      thumbnail: courseImg,
      duration: `${lessonsDraft.length} Lesson`,
      instructor: instructor,
      category: courseCategory,
      lessons: finalLessons,
      rating: 5.0,
      isDownloaded: false
    };

    onAddCourse(newCourse);

    // Reset Form
    setCourseTitle('');
    setCourseDesc('');
    setLessonsDraft([
      { title: 'មេរៀនទី១៖ សេចក្តីផ្តើម និងការរៀបចំ Workspace', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '12:30' }
    ]);
    alert('វគ្គសិក្សាថ្មីត្រូវបានបញ្ចូលដោយជោគជ័យ! Published successfully.');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmissionId) return;
    onGradeSubmission(selectedSubmissionId, gradeScore, gradeFeedback);
    setSelectedSubmissionId(null);
    setGradeFeedback('');
  };

  return (
    <div className="space-y-6" id="admin-dashboard-root">
      {/* Tab Select Controller */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 pt-2">
        {[
          { id: 'analytics', label: 'ផ្ទាំងរបាយការណ៍លក់ & វិភាគ (Sales Analytics)', icon: TrendingUp },
          { id: 'courses', label: 'គ្រប់គ្រងវគ្គសិក្សា & Upload (Manage & Upload)', icon: BookOpen },
          { id: 'students', label: 'តាមដានសិស្ស & Report (Student Tracking)', icon: Users },
          { id: 'assignments', label: 'កែកិច្ចការផ្ទះ (Grade Homework)', icon: FileText }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            id={`admin-tab-btn-${tab.id}`}
            className={`flex items-center gap-2 cursor-pointer font-medium px-4 py-3 text-xs md:text-sm border-b-2 transition select-none ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-605 text-blue-600 font-extrabold bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-105 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* RENDER ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Sales metrics grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono tracking-wider">ចំណូលសរុប (REVENUE)</span>
              <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">${totalRevenue.toFixed(2)}</div>
              <p className="text-[10px] text-slate-505 text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                <span>+14.2% បើធៀបនឹងខែមុន</span>
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono tracking-wider">សិស្សចុះឈ្មោះសរុប (ENROLLMENTS)</span>
              <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{totalEnrollments} នាក់</div>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span>+8.3% ចុះឈ្មោះថ្មីៗ</span>
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase text-slate-505 text-slate-500 font-mono tracking-wider">វឌ្ឍនភាពសិក្សាជាមធ្យម (AVG PROGRESS)</span>
              <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{avgProgress}%</div>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-amber-500" />
                <span>ការសិក្សាមានប្រសិទ្ធភាព</span>
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase text-slate-500 font-mono tracking-wider">វគ្គសិក្សាកំពុងលក់ (STORE COURSES)</span>
              <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">{courses.length} មុខវិជ្ជា</div>
              <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                <Layers className="w-3 h-3 text-indigo-550 text-indigo-505" />
                <span>សកម្មទាំងអស់</span>
              </p>
            </div>
          </div>

          {/* Analytical charts utilizing recharts guidelines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-4">
                របាយការណ៍លក់ប្រចាំថ្ងៃ (Sales Revenue Trend)
              </h3>
              <div className="h-64">
                {chartSalesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartSalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                      <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center">
                    មិនទាន់មានទិន្នន័យទូទាត់ប្រាក់នៅឡើយ។ No Transactions.
                  </div>
                )}
              </div>
            </div>

            {/* Course popularity Chart */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-500 mb-4">
                ការចុះឈ្មោះរៀនតាមមុខវិជ្ជា (Enrollments Distribution)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseCountData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-15} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                    <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {courseCountData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sales Transaction logs with KHQR bank metadata */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs uppercase tracking-wider font-mono text-slate-700">
                  ប្រតិបត្តិការទូទាត់ប្រាក់ដែលផ្ទៀងផ្ទាត់រួច (Verified Transactions)
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 py-0.5 px-2 rounded-full font-mono">
                SECURE ENDPOINT DIRECT
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-505 text-slate-500 border-b border-slate-200 font-medium">
                    <th className="p-4 text-[11px] uppercase">កូដប្រតិបត្តិការ (TXID)</th>
                    <th className="p-4 text-[11px] uppercase">ឈ្មោះសិស្ស (Buyer)</th>
                    <th className="p-4 text-[11px] uppercase">វគ្គសិក្សា (Course)</th>
                    <th className="p-4 text-[11px] uppercase">ធនាគារ (Bank Gateway)</th>
                    <th className="p-4 text-[11px] uppercase text-right">តម្លៃ (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {sales.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-[10px] text-slate-400 select-all">{item.transactionId}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">{item.buyerName}</div>
                        <div className="text-[10px] text-slate-500">{item.buyerEmail}</div>
                      </td>
                      <td className="p-4 truncate max-w-xs">{item.courseTitle}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 bg-slate-50 text-emerald-700 font-medium py-1 px-2.5 rounded-full border border-slate-200 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.bankUsed}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-600 text-right">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MANAGE & UPLOAD COURSES */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Course Creator Form */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">បញ្ចូលវគ្គសិក្សាថ្មី (Upload New Video Course)</h3>
                <p className="text-[11px] text-slate-500">បំពេញទិន្នន័យដើម្បីបន្ថែមវីដេអូមេរៀន និងតម្លៃសិក្សា</p>
              </div>
            </div>

            <form onSubmit={handleSubmitCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">ចំណងជើងវគ្គសិក្សា (Khmer/English)</label>
                  <input
                    type="text"
                    required
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="ឧ. វគ្គសិក្សា Flutter Dev ឆ្នាំ២០២៦"
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-505 text-slate-500 mb-1.5 font-medium">គ្រូឧទ្ទេស (Instructor Name)</label>
                  <input
                    type="text"
                    required
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="លោកគ្រូ..."
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1.5 font-medium">ការពិពណ៌នាវគ្គសិក្សា (Detail description)</label>
                <textarea
                  rows={2}
                  required
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="รៀបរាប់ពីផែនការសិក្សា គោលបំណង និងលទ្ធផលទទួលបាន..."
                  className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-3 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">តម្លៃសិក្សាសរុប / USD</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-blue-500 outline-none transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">ប្រភេទមុខវិជ្ជា/Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-blue-500 outline-none transition cursor-pointer"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Digital Design</option>
                    <option value="Language">Language Learning</option>
                    <option value="Marketing">Marketing & Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-505 text-slate-500 mb-1.5 font-medium">រូបភាពតំណាង / Thumbnail URL</label>
                  <input
                    type="text"
                    required
                    value={courseImg}
                    onChange={(e) => setCourseImg(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-850 text-slate-800 text-xs rounded-xl px-3 py-2.5 focus:border-blue-500 outline-none transition font-sans text-[10px]"
                  />
                </div>
              </div>

              {/* Sub-form to include lessons within this course */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">បញ្ចូលបញ្ជីមេរៀន (Lesson Playlist Config)</span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">{lessonsDraft.length} lessons draft</span>
                </div>

                <div className="space-y-3 mb-4">
                  {lessonsDraft.map((lesson, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 p-2.5 rounded-lg text-xs">
                      <div className="truncate pr-4 flex-1">
                        <div className="font-medium text-slate-900 truncate">{lesson.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">{lesson.videoUrl}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-mono text-slate-500 text-[10px]">{lesson.duration}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveLessonDraft(idx)}
                          className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Adding specific lesson fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="ឈ្មោះមេរៀន ឧ. មេរៀនទី១..."
                    className="bg-white border border-slate-200 text-slate-800 text-xs p-2 rounded-lg outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLessonUrl}
                      onChange={(e) => setNewLessonUrl(e.target.value)}
                      placeholder="លីងវីដេអូ MP4/YouTube..."
                      className="flex-1 bg-white border border-slate-200 text-slate-800 text-[10px] p-2 rounded-lg outline-none"
                    />
                    <input
                      type="text"
                      value={newLessonDur}
                      onChange={(e) => setNewLessonDur(e.target.value)}
                      placeholder="15:00"
                      className="w-16 bg-white border border-slate-200 text-slate-800 text-xs p-2 rounded-lg outline-none text-center"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddLessonDraft}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-805 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer select-none transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បូកសែមេរៀនទៅក្នុងបញ្ជី Draft</span>
                </button>
              </div>

              <button
                type="submit"
                id="btn-publish-course"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-5 h-5" />
                <span>ចុះផ្សាយវគ្គសិក្សាជាផ្លូវការ / Publish Platform Course</span>
              </button>
            </form>
          </div>

          {/* List of active courses currently sold */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
              វគ្គសិក្សាកំពុងដំណើរការ ({courses.length})
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {courses.map(course => (
                <div key={course.id} className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 hover:bg-slate-100/55 transition">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-12 object-cover rounded-lg border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{course.title}</h4>
                    <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 py-0.5 px-2 rounded-full font-sans uppercase">
                      {course.category}
                    </span>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{course.lessons.length} Lesson</span>
                      <span>•</span>
                      <strong className="text-emerald-600 font-mono">${course.price.toFixed(2)}</strong>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`តើអ្នកពិតជាចង់លុបវគ្គសិក្សានេះមែនទេ? Delete: ${course.title}`)) {
                        onDeleteCourse(course.id);
                      }
                    }}
                    className="text-red-500 hover:text-red-600 p-1 self-center hover:bg-red-50 rounded transition"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER STUDENT PROGRESS TRACKING & DETAILED PERFORMANCE REPORT */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-800">
                បញ្ជីសិស្ស និងកម្រិតវឌ្ឍនភាព (Detailed Student Enrolled Status)
              </h3>
              <span className="text-[11px] text-slate-500 font-mono font-bold">ACTIVE TRACKER</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-505 text-slate-500 font-medium">
                    <th className="p-4">ឈ្មោះសិស្ស / Email</th>
                    <th className="p-4">វគ្គសិក្សាដែលបានជាវ</th>
                    <th className="p-1 text-center font-bold">វឌ្ឍនភាព / Progress</th>
                    <th className="p-4 text-center">មេរៀនជោគជ័យ / Lessons</th>
                    <th className="p-4 text-right">របាយការណ៍ / Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.map((student, idx) => (
                    <tr key={`${student.studentId}-${student.courseId}-${idx}`} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
                            <span className="text-xs font-bold text-blue-600">{student.studentName.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{student.studentName}</div>
                            <div className="text-[10px] text-slate-500">{student.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 truncate max-w-xs text-slate-700 font-medium">{student.courseTitle}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-24 bg-slate-150 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div className="bg-emerald-550 bg-emerald-500 h-full rounded" style={{ width: `${student.progressPercentage}%` }} />
                          </div>
                          <span className="font-mono font-bold text-slate-800 text-xs">{student.progressPercentage}%</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-center text-slate-500">
                        {student.lessonsCompleted.length} / 4
                      </td>
                      <td className="p-1 text-right pr-4">
                        <button
                          onClick={() => setSelectedReportStudent(`${student.studentId}_${student.courseId}`)}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-1 px-3 rounded-lg transition flex items-center justify-center gap-1 ml-auto cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>លម្អិត</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GENERATE DETAILED PERFORMANCE REPORT CARDS FOR CHOSEN STUDENT */}
          {selectedReportStudent && (
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-250 border-blue-500/20 shadow-lg space-y-4 font-sans" id="detailed-student-performance-report">
              {(() => {
                const [stId, coId] = selectedReportStudent.split('_');
                const progressRecord = students.find(s => s.studentId === stId && s.courseId === coId);
                if (!progressRecord) return <p className="text-xs text-red-500">ផ្ទៀងផ្ទាត់មិនឃើញទិន្នន័យ។</p>;

                // Grades query
                const studentSubmissions = submissions.filter(sub => sub.studentId === stId && sub.courseTitle === progressRecord.courseTitle);
                const totalGraded = studentSubmissions.filter(s => s.score !== -1);
                const averageScore = totalGraded.length > 0
                  ? Math.round(totalGraded.reduce((sum, item) => sum + item.score, 0) / totalGraded.length)
                  : -1;

                return (
                  <div>
                    {/* Header bar / Cambodia style letterheads */}
                    <div className="flex justify-between items-start border-b border-slate-205 border-slate-200 pb-4">
                      <div>
                        <div className="text-[10px] text-blue-600 tracking-widest font-mono font-bold">KHMER ONLINE ACADEMY</div>
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          របាយការណ៍សិក្សាផ្លូវការ (Detailed Performance Report)
                        </h4>
                        <p className="text-xs text-slate-500">ប្រព័ន្ធវិភាគវាយតម្លៃស្វ័យប្រវត្ត</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.print()}
                          className="bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer border border-slate-200 transition"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>បោះពុម្ព (Print Report)</span>
                        </button>
                        <button
                          onClick={() => setSelectedReportStudent(null)}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg transition"
                        >
                          បិទវិញ
                        </button>
                      </div>
                    </div>

                    {/* Report grids */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ព័ត៌មានលម្អិតសិស្ស</span>
                        <div className="text-sm font-bold text-slate-950">{progressRecord.studentName}</div>
                        <div className="text-xs text-slate-600 font-mono truncate">{progressRecord.studentEmail}</div>
                        <div className="text-[11px] text-slate-550 mt-1">ID: {progressRecord.studentId}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ស្ថានភាពមុខវិជ្ជា</span>
                        <div className="text-xs text-slate-900 font-semibold line-clamp-1">{progressRecord.courseTitle}</div>
                        <div className="text-xs flex items-center gap-2 mt-1">
                          <span className="text-slate-500">មេរៀនបញ្ចប់៖</span>
                          <span className="font-mono font-bold text-blue-600">{progressRecord.lessonsCompleted.length} chapters</span>
                        </div>
                        <div className="text-xs flex items-center gap-2">
                          <span className="text-slate-500">កម្រិតសិក្សា៖</span>
                          <span className="font-mono font-bold text-emerald-600">{progressRecord.progressPercentage}%</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">លទ្ធផលGPA & ពិន្ទុជាមធ្យម</span>
                        <div className="text-2xl font-bold font-mono text-amber-600">
                          {averageScore !== -1 ? `${averageScore} / 100` : 'រង់ចាំពិន្ទុ (N/A)'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {averageScore >= 90 ? 'និទ្ទេស ៖ A (ល្អប្រសើរអស្ចារ្យ)' :
                           averageScore >= 80 ? 'និទ្ទេស ៖ B (ល្អណាស់)' :
                           averageScore >= 70 ? 'និទ្ទេស ៖ C (ល្អសមរម្យ)' :
                           averageScore !== -1 ? 'និទ្ទេស ៖ D/E' : 'មិនទាន់មានការវាយតម្លៃ'}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Completed Log lists */}
                    <div className="mt-6 font-sans">
                      <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-widest mb-3">
                        កិច្ចការ និងសកម្មភាពបញ្ជូន (Assignment Submission Logs):
                      </h5>
                      {studentSubmissions.length > 0 ? (
                        <div className="space-y-3">
                          {studentSubmissions.map(sub => (
                            <div key={sub.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center gap-4">
                              <div>
                                <span className="font-bold text-slate-900 block">{sub.assignmentTitle}</span>
                                <span className="text-[10px] text-slate-500 font-mono">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                                {sub.feedback && (
                                  <div className="mt-1 text-[11px] text-amber-700 italic bg-amber-50 p-1.5 rounded border border-amber-100">
                                    " {sub.feedback} "
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <span className={`inline-block py-0.5 px-2.5 rounded-full font-mono font-bold ${
                                  sub.score !== -1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-505'
                                }`}>
                                  {sub.score !== -1 ? `${sub.score} pt` : ' Ungraded'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">មិនទាន់មានការធ្វើកិច្ចការនៅឡើយទេ។ No registered homework.</p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* RENDER ASSIGNMENT GRADING HANDLER */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-3 mb-4">
               can-grade-homeworks (Grade Homeworks)
            </h3>

            {submissions.filter(s => s.status === 'submitted' || s.score === -1).length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                អបអរសាទរ! គ្មានសិស្សណាម្នាក់កំពុងរង់ចាំការកែកិច្ចការឡើយ។ All submissions graded.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.filter(s => s.status === 'submitted' || s.score === -1).map(sub => (
                  <div key={sub.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap justify-between items-start gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-50 text-indigo-705 border border-indigo-150 px-2 py-0.5 rounded font-bold uppercase">
                          {sub.courseTitle.split(' ')[0]}
                        </span>
                        <span className="text-xs text-slate-500">ផ្ញើដោយ៖ {sub.studentName}</span>
                      </div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-900">{sub.assignmentTitle}</h4>
                      <p className="text-xs text-slate-500">
                        កាលបរិច្ឆេទផ្ញើ៖ {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="w-full sm:w-auto self-center">
                      <button
                        onClick={() => setSelectedSubmissionId(sub.id)}
                        id={`btn-open-grade-modal-${sub.id}`}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        កែពិន្ទុ & ផ្តល់យោបល់ (Grade Homework)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal popup directly on page for fast interactive grading */}
          {selectedSubmissionId && (
            <div className="p-5 bg-white border border-blue-500/30 rounded-2xl shadow-lg space-y-4" id="grading-modal-panel">
              <div className="flex justify-between items-center border-b border-slate-205 pb-2">
                <h4 className="text-xs md:text-sm font-bold text-slate-900 uppercase">ផ្តល់ពិន្ទុ កិច្ចការផ្ទះសិស្ស</h4>
                <button
                  onClick={() => setSelectedSubmissionId(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs"
                >
                  បោះបង់
                </button>
              </div>

              <form onSubmit={handleGradeSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">ពិន្ទុ (Score out of 100)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="100"
                      value={gradeScore}
                      onChange={(e) => setGradeScore(parseInt(e.target.value))}
                      className="w-full bg-white border border-slate-205 text-slate-900 p-2 text-xs rounded-lg font-mono font-bold outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">មតិកែលម្អ (Teacher Feedback)</label>
                    <input
                      type="text"
                      required
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      placeholder="ឧ. ធ្វើបានល្អណាស់ប្អូន! កូដមានសណ្តាប់ធ្នាប់..."
                      className="w-full bg-white border border-slate-205 text-slate-900 p-2 text-xs rounded-lg outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  id="btn-submit-graded-homework"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  យល់ព្រមរក្សាទុកពិន្ទុ (Save Score & Notify Student)
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
