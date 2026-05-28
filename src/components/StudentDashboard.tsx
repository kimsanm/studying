import React, { useState } from 'react';
import {
  Video, BookOpen, Layers, CheckCircle, Download, CreditCard,
  MessageCircle, Star, Award, ChevronRight, Bell, Sparkles, Clock, FileText, Send, Share2, Play, Lock, WifiOff
} from 'lucide-react';
import { Course, Assignment, AssignmentSubmission, StudentProgress, Lesson, Notification } from '../types';
import CourseCard from './CourseCard';

interface StudentDashboardProps {
  courses: Course[];
  enrolledCourses: string[]; // Course IDs
  progress: StudentProgress[]; // tracking percentage array
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  notifications: Notification[];
  isOfflineMode: boolean;
  onEnrollClick: (course: Course) => void;
  onLessonComplete: (courseId: string, lessonId: string, completed: boolean) => void;
  onSubmitAssignment: (assignmentId: string, text: string) => void;
  onDownloadCourse: (courseId: string) => void;
}

export default function StudentDashboard({
  courses,
  enrolledCourses,
  progress,
  assignments,
  submissions,
  isOfflineMode,
  onEnrollClick,
  onLessonComplete,
  onSubmitAssignment,
  onDownloadCourse
}: StudentDashboardProps) {
  // Tabs: 'shop' | 'my-learning' | 'assignments'
  const [activeTab, setActiveTab] = useState<'shop' | 'my-learning' | 'assignments'>('shop');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Currently viewing Course/Lesson for video player
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  // Homework answer state
  const [assignmentAnswers, setAssignmentAnswers] = useState<{ [id: string]: string }>({});

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  const myCourses = courses.filter(c => enrolledCourses.includes(c.id));

  const handleLessonToggle = (courseId: string, lessonId: string, completed: boolean) => {
    onLessonComplete(courseId, lessonId, completed);
  };

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const activeLesson = activeCourse?.lessons.find(l => l.id === activeLessonId) || activeCourse?.lessons[0];

  const handleHomeworkSubmit = (assignmentId: string, title: string) => {
    const answer = assignmentAnswers[assignmentId];
    if (!answer?.trim()) return;

    onSubmitAssignment(assignmentId, answer);
    // Clear state
    setAssignmentAnswers({ ...assignmentAnswers, [assignmentId]: '' });
    alert(`កិច្ចការ៖ "${title}" ត្រូវបានផ្ញើជូនលោកគ្រូរួចរាល់ហើយ!`);
  };

  return (
    <div className="space-y-6" id="student-dashboard-root">
      {/* Category selector & sub-navigation bars */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          {[
            { id: 'shop', label: 'ទំព័រដើមលក់វគ្គសិក្សា (Store Platform)', icon: Layers },
            { id: 'my-learning', label: 'បញ្ជីរៀនរបស់ខ្ញុំ (My Learning Hub)', icon: Video },
            { id: 'assignments', label: 'កិច្ចការ និងសញ្ញាបត្រ (Assignments & Deadlines)', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              id={`student-tab-btn-${tab.id}`}
              className={`flex items-center gap-2 cursor-pointer font-medium px-4 py-3 text-xs md:text-sm border-b-2 transition select-none ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-extrabold bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Categories Pills under Store Platform tab */}
        {activeTab === 'shop' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {['All', 'Programming', 'Design', 'Language', 'Marketing'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                id={`cat-pill-${cat}`}
                className={`text-xs px-3 py-1.5 rounded-full border transition select-none cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 border-blue-500 text-white font-semibold'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'All' ? 'ទាំងអស់' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RENDER STORE FRONT (BILINGUAL KHMER/ENGLISH PORTAL) */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          {/* Welcome Cambodian Hero Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border border-slate-900 p-6 rounded-3xl relative overflow-hidden shadow">
            <div className="max-w-xl space-y-2 relative z-10">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/35 py-1 px-3 rounded-full font-bold uppercase tracking-wider block w-fit">
                ស្វាគមន៍មកកាន់ Khmer Online Academy
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">
                ពង្រឹងសមត្ថភាពការងារ និងជំនាញបង្កើតវេបសាយ ជាមួយវីដេអូមេរៀនគុណភាពខ្ពស់!
              </h1>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                ចុះឈ្មោះចូលរៀនឥឡូវនេះ ដើម្បីទទួលបានការពិភាក្សាជាមួយលោកគ្រូ និងការកែប្រែកិច្ចការផ្ទាល់ខ្លួន!
                ទូទាត់ប្រាក់រហ័សទាន់ចិត្ត តាមរយៈធនាគារក្នុងស្រុកលឿនបំផុត។
              </p>
            </div>
            {/* Visual ambient graphic circles */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/15 to-transparent blur-2xl pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => {
              const isEnrolled = enrolledCourses.includes(course.id);
              const progressRecord = progress.find(p => p.courseId === course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled={isEnrolled}
                  progressPercentage={progressRecord?.progressPercentage || 0}
                  onEnroll={onEnrollClick}
                  onSelect={(c) => {
                    setActiveCourseId(c.id);
                    if (c.lessons.length > 0) {
                      setActiveLessonId(c.lessons[0].id);
                    }
                    setActiveTab('my-learning');
                  }}
                  onDownload={onDownloadCourse}
                  isOfflineMode={isOfflineMode}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER ACTIVE LEARNING WORKPLAY & INTERACTIVE VIDEO HUB */}
      {activeTab === 'my-learning' && (
        <div className="space-y-6">
          {myCourses.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl space-y-3 shadow-sm">
              <Video className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
              <h3 className="text-slate-800 font-bold text-sm">អ្នកមិនទាន់មានវគ្គសិក្សាឡើយ (No Courses Yet)</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                សូមត្រលប់មកវិញរួចចុច "ជាវវគ្គសិក្សា / Buy Now" លើមុខវិជ្ជាណាមួយ ដើម្បីស្កេន KHQR បាញ់ប្រាក់សាកល្បង!
              </p>
              <button
                onClick={() => setActiveTab('shop')}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer transition uppercase shadow-sm"
              >
                មើលបញ្ជីមុខវិជ្ជា
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left/Main Column: Video Player & Context */}
              <div className="lg:col-span-8 space-y-4">
                {activeCourse ? (
                  <>
                    {/* VIDEO PLAYER COMPONENT WITH SECURE OFFLINE PLAYER SIM */}
                    <div className="bg-black aspect-video rounded-2xl overflow-hidden border border-slate-900 relative group shadow-lg">
                      {isOfflineMode && !activeCourse.isDownloaded ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                          <Clock className="w-10 h-10 text-slate-500 mb-2 animate-pulse" />
                          <h4 className="text-sm font-bold text-slate-300">ឯកសារវីដេអូត្រូវបានលាក់ (Offline Lock)</h4>
                          <p className="text-xs text-slate-500 max-w-xs mt-1">
                            សូមបើករបៀបស្វែងរក Online ឬទាញយកទុកមុននឹងធ្វើដំណើរឆាប់ៗ!
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Elegant HTML5 Video Simulator */}
                          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                            <iframe
                               className="w-full h-full"
                               src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1`}
                               title={activeLesson?.title || "Video Player"}
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               allowFullScreen
                            ></iframe>
                          </div>

                          {/* Captions Overlay simulating custom captions */}
                          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/75 px-4 py-1.5 rounded text-[11px] md:text-sm text-yellow-300 text-center font-medium max-w-[80%] pointer-events-none line-clamp-1 border border-slate-800">
                            កំពុងមើល៖ {activeLesson?.title} | Duration: {activeLesson?.duration}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Lesson Description Details */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-200 pb-3">
                        <div>
                          <span className="text-[10px] text-blue-600 font-bold font-mono">ACTIVE LESSON PLAYING</span>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">{activeLesson?.title || activeCourse.title}</h3>
                          <p className="text-xs text-slate-600 font-medium">គ្រូដឹកនាំ៖ {activeCourse.instructor}</p>
                        </div>

                        {/* Progress checklist trigger inside playing view */}
                        {activeLesson && (
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-slate-655 text-slate-600 font-semibold select-none">
                              សញ្ញាថាបានរៀនចប់៖
                            </label>
                            <input
                              type="checkbox"
                              id={`checkbox-lesson-complete-${activeLesson.id}`}
                              checked={progress.find(p => p.courseId === activeCourse.id)?.lessonsCompleted.includes(activeLesson.id) || false}
                              onChange={(e) => handleLessonToggle(activeCourse.id, activeLesson.id, e.target.checked)}
                              className="w-4 h-4 text-emerald-500 bg-white border-slate-350 rounded focus:ring-emerald-500 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        មេរៀននេះមានសារៈសំខាន់ខ្លាំងណាស់ក្នុងការផ្តល់ការយល់ដឹងពីកូដមូលដ្ឋានគ្រឹះ និងអនុវត្តផ្ទាល់។
                        កុំភ្លេចទាញយកឯកសារកិច្ចការ និងប្រគល់ជូនគ្រូ ដើម្បីសាកល្បងសមត្ថភាពបន្ទាប់ពីបញ្ចប់ការទស្សនាវីដេអូបាទ!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center text-slate-500 text-xs shadow-sm">
                    សូមជ្រើសរើសវគ្គសិក្សាមួយពីបញ្ជីខាងស្តាំ ដើម្បីចាប់ផ្តើមវីដេអូមេរៀន!
                  </div>
                )}
              </div>

              {/* Right Column: Interactive Lesson Index Playlist */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wide">វគ្គសិក្សារបស់ខ្ញុំ</span>
                    <select
                      value={activeCourseId || ''}
                      onChange={(e) => {
                        const targetId = e.target.value;
                        setActiveCourseId(targetId);
                        const targetCourse = courses.find(c => c.id === targetId);
                        if (targetCourse && targetCourse.lessons.length > 0) {
                          setActiveLessonId(targetCourse.lessons[0].id);
                        }
                      }}
                      className="w-full mt-1.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-2 px-3 text-xs outline-none cursor-pointer"
                    >
                      <option value="" disabled>--- ជ្រើសរើសវគ្គសិក្សា ---</option>
                      {myCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Playlist Container with tick checks for completed status */}
                  {activeCourse && (
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-700 font-bold block">បញ្ជីមេរៀនទាំងអស់ ({activeCourse.lessons.length} Lesson)</span>
                      <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                        {activeCourse.lessons.map((lesson) => {
                          const isCompleted = progress.find(p => p.courseId === activeCourse.id)?.lessonsCompleted.includes(lesson.id) || false;
                          const isPlaying = lesson.id === activeLessonId;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setActiveLessonId(lesson.id)}
                              id={`lesson-selector-item-${lesson.id}`}
                              className={`flex justify-between items-center p-3 rounded-xl border text-xs cursor-pointer transition select-none ${
                                isPlaying
                                  ? 'bg-blue-50/80 border-blue-200 text-blue-600 font-bold shadow-sm'
                                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <Play className={`w-3.5 h-3.5 flex-shrink-0 ${isPlaying ? 'text-blue-600 animate-pulse' : 'text-slate-400'}`} />
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-slate-500">{lesson.duration}</span>
                                {isCompleted && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER ASSIGNMENTS & PERFORMANCE REPORTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* List of assignments required */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>ចំណែកការបញ្ជូនកិច្ចការសាលា (Assignment Deadlines)</span>
              </h3>

              {assignments.map(ass => {
                const sub = submissions.find(s => s.assignmentId === ass.id);
                return (
                  <div key={ass.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">COURSE reference</span>
                        <span className="text-xs font-semibold text-blue-600">{ass.courseTitle}</span>
                        <h4 className="text-xs md:text-sm font-bold text-slate-800 mt-1">{ass.title}</h4>
                      </div>

                      {/* Status pill badges */}
                      <div>
                        {sub ? (
                          sub.score !== -1 ? (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 py-0.5 px-2.5 rounded-full font-mono text-[10px] font-bold">
                              កែពិន្ទុរួច៖ {sub.score} pt
                            </span>
                          ) : (
                            <span className="bg-amber-100 text-amber-800 border border-amber-200 py-0.5 px-2.5 rounded-full font-mono text-[10px] font-bold">
                              រង់ចាំលោកគ្រូកែ
                            </span>
                          )
                        ) : (
                          <span className="bg-red-100 text-red-850 border border-red-200 py-0.5 px-2.5 rounded-full font-mono text-[10px] font-bold">
                            មិនទាន់ប្រគល់
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-655 text-slate-750 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      {ass.description}
                    </p>

                    {/* Deadline block with alert notice */}
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>កាលកំណត់ផ្ញើចុងក្រោយ៖ {new Date(ass.deadline).toLocaleDateString()} {new Date(ass.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Submit Answer Dialog box */}
                    {!sub && (
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="block text-[11px] text-slate-500 font-semibold">សរសេរចម្លើយ ឬដាក់លីង Code Github សមរម្យលើយើង៖</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={assignmentAnswers[ass.id] || ''}
                            onChange={(e) => setAssignmentAnswers({ ...assignmentAnswers, [ass.id]: e.target.value })}
                            placeholder="ឧ. https://github.com/myusername/react-assignment-1"
                            className="flex-1 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-2 focus:border-blue-500 outline-none"
                            id={`homework-input-${ass.id}`}
                          />
                          <button
                            onClick={() => handleHomeworkSubmit(ass.id, ass.title)}
                            id={`homework-submit-btn-${ass.id}`}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
                          >
                            ផ្ញើកិច្ចការ
                          </button>
                        </div>
                      </div>
                    )}

                    {sub?.feedback && (
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs space-y-1">
                        <strong className="text-indigo-800 block">មតិកែលម្អរបស់លោកគ្រូ (Teacher's Feedback):</strong>
                        <p className="text-slate-705 text-slate-700 leading-relaxed">"{sub.feedback}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Achievement Certification badge widget */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-200 pb-2">
                  ស្ថានភាពសញ្ញាបត្រ (Academic Certifications)
                </h3>
                <div className="py-6 text-center space-y-4">
                  <div className="w-20 h-20 bg-amber-500/10 rounded-full border border-amber-500 flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-10 h-10 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-mono text-slate-500">មាលាសញ្ញាបត្រនិម្មិត (Virtual Medal Status)</h4>
                    <span className="text-xs font-semibold text-slate-800 block mt-1.5">គឹម ហេង (Student Enrollment)</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    សិស្សនឹងទទួលបានសញ្ញាបត្រគ្រោងគម្រោងផ្លូវការពីសាលា Cape Atlantic ពេលរៀនចប់ ១០០% លើទ្រឹស្តី និងកែមុខវិជ្ជាកិច្ចការជាប់ GPA ខ្ពស់ជាង ៧៥។
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-mono block">លក្ខខណ្ឌសិក្សា</span>
                <div className="mt-1 flex items-center justify-between text-slate-700">
                  <span>រៀនចប់៖ {progress.length > 0 ? progress[0].progressPercentage : 0}%</span>
                  <span className="font-bold text-emerald-600">កំពុងដំណើរការ...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
