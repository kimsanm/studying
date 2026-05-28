export interface Lesson {
  id: string;
  title: string;
  videoUrl: string; // Video file or mock placeholder video player
  duration: string;
  isCompleted?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number; // in USD
  thumbnail: string; // crisp image URL
  duration: string;
  instructor: string;
  lessons: Lesson[];
  category: string;
  isDownloaded?: boolean; // For offline simulation
  rating?: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  deadline: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  courseTitle: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  score: number; // -1 if not graded
  feedback: string;
  status: 'submitted' | 'graded';
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number; // 0 to 100
  lessonsCompleted: string[]; // lessonIds
  lastAccessed: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher';
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

export interface SalesReport {
  id: string;
  courseId: string;
  courseTitle: string;
  amount: number; // USD
  buyerName: string;
  buyerEmail: string;
  timestamp: string;
  bankUsed: string; // e.g. ABA Bank, Acleda, Chip Mong
  transactionId: string;
}
