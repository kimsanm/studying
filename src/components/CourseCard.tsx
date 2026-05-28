import React, { useState } from 'react';
import { BookOpen, Star, Sparkles, FolderHeart, Download, CheckCircle, Wifi, Play, Lock } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  key?: string;
  course: Course;
  isEnrolled: boolean;
  progressPercentage?: number;
  onEnroll: (course: Course) => void;
  onSelect: (course: Course) => void;
  onDownload: (courseId: string) => void;
  isOfflineMode: boolean;
}

export default function CourseCard({
  course,
  isEnrolled,
  progressPercentage = 0,
  onEnroll,
  onSelect,
  onDownload,
  isOfflineMode
}: CourseCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (course.isDownloaded) return;
    setDownloading(true);
    setTimeout(() => {
      onDownload(course.id);
      setDownloading(false);
    }, 1500);
  };

  const cardDisabled = isOfflineMode && !course.isDownloaded;

  return (
    <div
      onClick={() => {
        if (!cardDisabled) onSelect(course);
      }}
      id={`course-card-${course.id}`}
      className={`group bg-white border overflow-hidden rounded-2xl shadow-sm cursor-pointer transition-all duration-300 transform ${
        cardDisabled
          ? 'opacity-40 border-slate-100 pointer-events-none'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-1'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Categories tag */}
        <div className="absolute top-3 left-3 bg-blue-600/95 backdrop-blur-sm border border-blue-500 text-[10px] uppercase font-bold text-white py-1 px-2.5 rounded-full tracking-wider shadow">
          {course.category}
        </div>

        {/* Download offline Indicator */}
        {isEnrolled && (
          <div className="absolute top-3 right-3 flex items-center gap-1">
            {course.isDownloaded ? (
              <span className="bg-emerald-600 text-white text-[9px] font-extrabold flex items-center gap-1 py-1 px-2.5 rounded-full shadow">
                <CheckCircle className="w-3 h-3" />
                ក្រៅបណ្តាញ (OFFLINE READY)
              </span>
            ) : (
              <button
                onClick={handleDownload}
                id={`btn-download-course-${course.id}`}
                disabled={downloading}
                className="bg-white/95 hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-705 p-1.5 rounded-full transition shadow flex items-center justify-center cursor-pointer"
                title="ទាញទុកក្រៅបណ្តាញ / Cache offline"
              >
                {downloading ? (
                  <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        )}

        {/* Locked Overlay if offline and cached file missing */}
        {isOfflineMode && !course.isDownloaded && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <Lock className="w-8 h-8 text-white mb-2 animate-bounce" />
            <span className="text-[11px] font-bold text-white text-center">
              មិនទាន់ទាញយក (Offline Locked)
            </span>
          </div>
        )}

        {/* Play Icon Hover Overlay */}
        {!cardDisabled && (
          <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transition duration-200 transform scale-90 group-hover:scale-100">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Course Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              {course.duration}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              <span>{course.rating || 4.8}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 mb-3.5 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div>
          {/* Progress / Enroll Bar */}
          {isEnrolled ? (
            <div className="mt-2 bg-slate-55 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-slate-500 font-medium font-sans">វឌ្ឍនភាពសិក្សា (Progress)</span>
                <span className="font-bold text-emerald-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-mono block">តម្លៃវគ្គសិក្សា / PRICE</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">
                  ${course.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll(course);
                }}
                id={`btn-buy-course-card-${course.id}`}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-xl text-xs transition uppercase tracking-wider cursor-pointer shadow"
              >
                ជាវបុឹម / Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
