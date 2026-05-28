import React, { useState, useEffect } from 'react';
import {
  Video, BookOpen, Users, Award, Shield, MessageCircle, MessageSquare, Bell,
  ChevronDown, HelpCircle, Laptop, Wifi, WifiOff, Smartphone, LogOut, Sparkles, CheckCircle2, Volume2, X
} from 'lucide-react';
import { Course, SalesReport, StudentProgress, AssignmentSubmission, ChatMessage, Notification } from './types';
import {
  INITIAL_COURSES,
  INITIAL_SALES_REPORTS,
  INITIAL_STUDENT_PROGRESS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ASSIGNMENT_SUBMISSIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_NOTIFICATIONS
} from './localData';

// Subcomponents import
import OfflineIndicator from './components/OfflineIndicator';
import KHQRModal from './components/KHQRModal';
import LiveChat from './components/LiveChat';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

// Custom Beep Audio Synthesizer to prevent loaded file asset errors
const playSystemSound = (type: 'payment' | 'notification') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (type === 'payment') {
      // Warm double bank chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.12); // C6

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } else {
      // Soft high alert note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (error) {
    console.warn('Audio Context interaction prevented until user gesture.', error);
  }
};

export default function App() {
  // Global Persisted State
  const [courses, setCourses] = useState<Course[]>(() => {
    const local = localStorage.getItem('kh_courses');
    return local ? JSON.parse(local) : INITIAL_COURSES;
  });

  const [sales, setSales] = useState<SalesReport[]>(() => {
    const local = localStorage.getItem('kh_sales');
    return local ? JSON.parse(local) : INITIAL_SALES_REPORTS;
  });

  const [students, setStudents] = useState<StudentProgress[]>(() => {
    const local = localStorage.getItem('kh_students');
    return local ? JSON.parse(local) : INITIAL_STUDENT_PROGRESS;
  });

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    const local = localStorage.getItem('kh_enrolled_ids');
    return local ? JSON.parse(local) : ['c1', 'c2']; // default enrolled courses for our mock student Heng
  });

  const [assignments, setAssignments] = useState(() => INITIAL_ASSIGNMENTS);

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const local = localStorage.getItem('kh_submissions');
    return local ? JSON.parse(local) : INITIAL_ASSIGNMENT_SUBMISSIONS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const local = localStorage.getItem('kh_messages');
    return local ? JSON.parse(local) : INITIAL_CHAT_MESSAGES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const local = localStorage.getItem('kh_notifs');
    return local ? JSON.parse(local) : INITIAL_NOTIFICATIONS;
  });

  // State controls
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher'>('student');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showNotifBox, setShowNotifBox] = useState(false);
  const [isToastActive, setIsToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', body: '' });

  // Floating Chat Widget control
  const [isChatOpen, setIsChatOpen] = useState(false);

  // KHQR checkout state reference
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);

  // Sync to Local Storage
  useEffect(() => {
    localStorage.setItem('kh_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('kh_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('kh_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('kh_enrolled_ids', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem('kh_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('kh_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('kh_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Utility to fire a beautiful custom in-app Push Notification Toast
  const triggerPushNotification = (title: string, body: string, isSound = true) => {
    if (isSound) playSystemSound('notification');
    setToastMessage({ title, body });
    setIsToastActive(true);

    // Save notify to list
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title,
      message: body,
      type: 'info',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setIsToastActive(false);
    }, 4500);
  };

  // 1. Enrollment KHQR trigger
  const handleEnrollClick = (course: Course) => {
    if (isOfflineMode) {
      alert('មិនអាចទិញមេរៀនពេលគ្មានអុីនធឺណិតបានទេ! Please connect online.');
      return;
    }
    setSelectedCourseForPayment(course);
  };

  // 2. Successful Payment via KHQR Code Callback
  const handlePaymentSuccess = (bankUsed: string, trxId: string) => {
    if (!selectedCourseForPayment) return;
    const course = selectedCourseForPayment;

    // A. Add to buyer's enrolled list
    setEnrolledCourses(prev => [...prev, course.id]);

    // B. Build Sales Record
    const newSale: SalesReport = {
      id: `sale_${Date.now()}`,
      courseId: course.id,
      courseTitle: course.title,
      amount: course.price,
      buyerName: 'គឹម ហេង',
      buyerEmail: 'kim.heng@gmail.com',
      timestamp: new Date().toISOString(),
      bankUsed,
      transactionId: trxId
    };
    setSales(prev => [newSale, ...prev]);

    // C. Create Student Progress Record inside admin tracking table
    const newProgress: StudentProgress = {
      studentId: 'st1',
      studentName: 'គឹម ហេង',
      studentEmail: 'kim.heng@gmail.com',
      courseId: course.id,
      courseTitle: course.title,
      progressPercentage: 0,
      lessonsCompleted: [],
      lastAccessed: new Date().toISOString()
    };
    setStudents(prev => [newProgress, ...prev]);

    // D. Trigger chime & push notice
    playSystemSound('payment');
    triggerPushNotification(
      'ជោគជ័យ៖ ជាវមេរៀនបានសម្រេច!',
      `អ្នកបានទូទាត់ប្រាក់ $${course.price.toFixed(2)} with ${bankUsed} ទៅលើមុខវិជ្ជា "${course.title}"។`,
      false
    );

    setSelectedCourseForPayment(null);
  };

  // 3. Lesson completed checkbox toggle (Instant percentage update)
  const handleLessonComplete = (courseId: string, lessonId: string, completed: boolean) => {
    // Look up the active course
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Locate students list record
    setStudents(prev => {
      return prev.map(record => {
        if (record.studentId === 'st1' && record.courseId === courseId) {
          let updatedCompleted = [...record.lessonsCompleted];
          if (completed) {
            if (!updatedCompleted.includes(lessonId)) updatedCompleted.push(lessonId);
          } else {
            updatedCompleted = updatedCompleted.filter(id => id !== lessonId);
          }

          // Calculate percentage out of total lessons
          const totalLessons = course.lessons.length || 1;
          const percentage = Math.round((updatedCompleted.length / totalLessons) * 100);

          return {
            ...record,
            lessonsCompleted: updatedCompleted,
            progressPercentage: percentage,
            lastAccessed: new Date().toISOString()
          };
        }
        return record;
      });
    });

    if (completed) {
      triggerPushNotification('មេរៀនចងចាំចប់!', 'អ្នកបានបញ្ចប់ការសិក្សាមួយមេរៀនបន្ថែមទៀតហើយ! រក្សាការខិតខំតទៅទៀត!', true);
    }
  };

  // 4. Student assignment submissions
  const handleSubmitAssignment = (assignmentId: string, answer: string) => {
    const ass = assignments.find(a => a.id === assignmentId);
    if (!ass) return;

    const newSub: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId,
      assignmentTitle: ass.title,
      courseTitle: ass.courseTitle,
      studentName: 'គឹម ហេង',
      studentId: 'st1',
      submittedAt: new Date().toISOString(),
      score: -1,
      feedback: '',
      status: 'submitted'
    };

    setSubmissions(prev => [newSub, ...prev]);
    triggerPushNotification('ប្រគល់កិច្ចការរួចរាល់', `កិច្ចការ៖ "${ass.title}" ត្រូវបានបញ្ជូនទៅកាន់លោកគ្រូសម្រាប់ការកែសម្រួល។`, true);
  };

  // 5. Admin Adds a New Course
  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [newCourse, ...prev]);
    // Notify students globally
    triggerPushNotification('វគ្គសិក្សាថ្មីទើបនឹងចុះផ្សាយ!', `វគ្គសិក្សាថ្មី៖ "${newCourse.title}" ត្រូវបានចុះផ្សាយជាផ្លូវការជាមួយតម្លៃត្រឹមតែ $${newCourse.price}!`, true);
  };

  // 6. Admin grades student submissions
  const handleGradeSubmission = (submissionId: string, score: number, feedback: string) => {
    setSubmissions(prev => {
      return prev.map(s => {
        if (s.id === submissionId) {
          return { ...s, score, feedback, status: 'graded' };
        }
        return s;
      });
    });

    // Fire student notifier simulation
    const sub = submissions.find(s => s.id === submissionId);
    if (sub) {
      triggerPushNotification(
        'កិច្ចការកែរួចរាល់!',
        `អ្នកទទួលបានពិន្ទុ ${score}/100 លើកិច្ចការ៖ "${sub.assignmentTitle}" ពីគ្រូ។ " feedback : ${feedback} "`,
        true
      );
    }
  };

  // 7. Download Course for Offline Studying Cache
  const handleDownloadCourse = (courseId: string) => {
    setCourses(prev => {
      return prev.map(c => {
        if (c.id === courseId) {
          return { ...c, isDownloaded: true };
        }
        return c;
      });
    });
    triggerPushNotification('ទាញយករក្សាទុករួចរាល់!', 'វីដេអូមេរៀននៃវគ្គសិក្សានេះ អាចសិក្សាក្រៅបណ្តាញបានទោះគ្មានអុីនធឺណិត!', true);
  };

  // 8. Delete course
  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  // 9. Send Chat message
  const handleSendMessage = (text: string, senderRole: 'student' | 'teacher', senderName: string) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: senderRole === 'student' ? 'st1' : 'teacher',
      senderName,
      senderRole,
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    if (senderRole === 'teacher') {
      playSystemSound('notification');
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans" id="khmer-academy-web">
      {/* 1. System level connection banner */}
      <OfflineIndicator isOfflineMode={isOfflineMode} onToggleOffline={setIsOfflineMode} />

      {/* 2. Top-level Navbar header with Cambodian styling */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3.5 md:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          {/* Logo element */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-5.5 h-5.5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-widest font-mono select-none block leading-none">
              E-LEARNING PORTAL
            </span>
            <span className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              សាលាអនឡាញខ្មែរ <span className="text-xs text-slate-500 font-medium">| Khmer Academy</span>
            </span>
          </div>
        </div>

        {/* Action controllers */}
        <div className="flex items-center gap-3">
          {/* In-app simulated notifications box trigger */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifBox(!showNotifBox);
                // Mark all read
                if (!showNotifBox) {
                  setNotifications(notifications.map(n => ({ ...n, read: true })));
                }
              }}
              id="notifications-bell-btn"
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-200 transition cursor-pointer flex items-center justify-center"
              title="សេចក្តីជូនដំណឹង / Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification drop drawer absolute positioning */}
            {showNotifBox && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden" id="notifications-dropdown">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">សេចក្តីជូនដំណឹង និងការរំលឹកកិច្ចការ</span>
                  <button onClick={() => setShowNotifBox(false)} className="text-slate-500 hover:text-slate-800">
                     <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 bg-white">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">គ្មានដំណឹងថ្មីៗឡើយ។ Empty Inbox.</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50/80 transition text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-800">{n.title}</span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick interactive Role play toggler at top */}
          <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-xl items-center select-none">
            <button
              onClick={() => {
                setCurrentRole('student');
                triggerPushNotification('ប្តូរទៅកាន់ផែនដីសិស្ស', 'រុករកវគ្គសិក្សា ទូទាត់ QR ស្វ័យប្រវត្ត និងរៀនសូត្រ!', false);
              }}
              id="toggle-role-student-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                currentRole === 'student'
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              សិស្ស (Student)
            </button>
            <button
              onClick={() => {
                setCurrentRole('teacher');
                triggerPushNotification('ប្តូរទៅកាន់គ្រូឧទ្ទេស/ប្រព័ន្ធគ្រប់គ្រង', 'ពិនិត្យរបាយការណ៍លក់ គ្រប់គ្រងសិស្ស និង Upload មេរៀន!', false);
              }}
              id="toggle-role-teacher-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                currentRole === 'teacher'
                  ? 'bg-blue-600 text-white font-semibold shadow'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              គ្រូ / Admin Panel
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Main Interface Layout Dashboard */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Dynamic header label telling what views we are on */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] text-blue-600 font-mono font-bold tracking-wider uppercase">
              {currentRole === 'student' ? 'STUDENT LEARNING AREA' : 'TEACHER & SALES METRICS'}
            </span>
            <h2 className="text-base md:text-lg font-extrabold text-slate-900 mt-0.5">
              {currentRole === 'student'
                ? 'ផ្ទាំសិក្សាផ្ទាល់ខ្លួន៖ គឹម ហេង (Student Portal)'
                : 'ប្រព័ន្ធគ្រប់គ្រងវីដេអូមេរៀន & របាយការណ៍លក់ (Administrator Console)'}
            </h2>
          </div>

          <div className="text-[11px] text-slate-600 font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>គណនី active៖ {currentRole === 'student' ? 'គឹម ហេង (kim.heng@gmail.com)' : 'Admin (Sok Vibol)'}</span>
          </div>
        </div>

        {/* ROLE ORIENTED SWITCH BOARDS */}
        {currentRole === 'student' ? (
          <StudentDashboard
            courses={courses}
            enrolledCourses={enrolledCourses}
            progress={students}
            assignments={assignments}
            submissions={submissions}
            notifications={notifications}
            isOfflineMode={isOfflineMode}
            onEnrollClick={handleEnrollClick}
            onLessonComplete={handleLessonComplete}
            onSubmitAssignment={handleSubmitAssignment}
            onDownloadCourse={handleDownloadCourse}
          />
        ) : (
          <AdminDashboard
            courses={courses}
            sales={sales}
            students={students}
            submissions={submissions}
            messages={messages}
            onAddCourse={handleAddCourse}
            onGradeSubmission={handleGradeSubmission}
            onSelectStudentChat={(name) => {
              // Open floating chat instantly to that conversation
              setIsChatOpen(true);
            }}
            onDeleteCourse={handleDeleteCourse}
          />
        )}
      </main>

      {/* 4. Real-time dynamic local KHQR modal checkout popup simulation */}
      {selectedCourseForPayment && (
        <KHQRModal
          course={selectedCourseForPayment}
          isOpen={!!selectedCourseForPayment}
          onClose={() => setSelectedCourseForPayment(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 5. In-App custom floating banner Toast notifier */}
      {isToastActive && (
        <div className="fixed bottom-6 left-6 z-50 p-4 bg-white border border-blue-500 text-slate-900 rounded-2xl shadow-2xl max-w-sm flex items-start gap-3 animate-[slideIn_0.3s_ease]">
          <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl flex-shrink-0">
            <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h5 className="font-bold text-xs md:text-sm text-blue-600">{toastMessage.title}</h5>
            <p className="text-[11px] md:text-xs text-slate-600 mt-1 leading-relaxed">{toastMessage.body}</p>
          </div>
          <button onClick={() => setIsToastActive(false)} className="text-slate-400 hover:text-slate-700 ml-auto flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. Dynamic Floating live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            id="open-floating-chat-btn"
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer relative"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-50 rounded-full animate-ping" />
          </button>
        ) : (
          <div className="relative w-[340px] md:w-[400px]">
            {/* Close trigger button positioned directly above chat container for beauty */}
            <button
               onClick={() => setIsChatOpen(false)}
               id="close-floating-chat-btn"
               className="absolute top-3.5 right-12 z-50 text-slate-600 hover:text-slate-900 cursor-pointer bg-slate-200/85 hover:bg-slate-300 p-1 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>
            <LiveChat
              currentRole={currentRole}
              studentId="st1"
              studentName="គឹម ហេង"
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
      </div>

      {/* 7. Footer banner */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500 space-y-2 shadow-inner">
        <div>© 2026 Khmer Online Academy. All security encryption and payments verified.</div>
        <div className="flex items-center justify-center gap-1.5 opacity-80">
          <Shield className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-600">ប្រព័ន្ធគ្រប់គ្រងសិស្ស និងសុវត្ថិភាពទិន្នន័យខ្ពស់ (ISO Secure Framework)</span>
        </div>
      </footer>
    </div>
  );
}
