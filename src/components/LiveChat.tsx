import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageCircle, RefreshCw, Landmark, Sparkles, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../types';

interface LiveChatProps {
  currentRole: 'student' | 'teacher';
  studentId: string;
  studentName: string;
  messages: ChatMessage[];
  onSendMessage: (text: string, senderRole: 'student' | 'teacher', senderName: string) => void;
}

// Simulated automated friendly responses from teachers
const AUTO_RESPONSES = [
  'បាទសួស្តីប្អូន! តើប្អូនមានចម្ងល់ត្រង់ចំណុច ឬមេរៀនណាខ្លះដែរក្នុងវគ្គសិក្សានេះ?',
  'ចំពោះបញ្ហានេះ ប្អូនអាចសាកល្បងត្រួតពិនិត្យ curly brackets {} នៅក្នុង React state trigger ឡើងវិញ ឬសរសេរ console.log ដើម្បីឆែកមើល API response បាទ។',
  'មេរៀន UI/UX គឺប្អូនគួរផ្តោតលើការរៀបចំ Whitespace ដកឃ្លាឱ្យបានស្អាត និងរក្សា Uniform alignment នោះ visual layout នឹងស្អាតជាងមុនច្រើន!',
  'កិច្ចការផ្ទះដែលប្អូនបានប្រគល់មកគឺល្អណាស់ គ្រូបានពិនិត្យ និងដាក់មតិយោបល់ពិន្ទុជូនហើយណា។ បើមានចម្ងល់បន្ថែម សួរសួរគ្រូបាន!',
  'បាទ! គ្រូត្រៀមខ្លួនជួយជានិច្ចសម្រាប់ការប្រឹក្សាយោបល់។ ប្អូនអាចផ្ញើកូដ ឬរូបភាព Screenshots មកទីនេះបានបាទ។'
];

export default function LiveChat({ currentRole, studentId, studentName, messages, onSendMessage }: LiveChatProps) {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const roleName = currentRole === 'student' ? studentName : 'លោកគ្រូ សុខ វិបុល';
    onSendMessage(inputText, currentRole, roleName);
    setInputText('');

    // Trigger automated response from teachers
    if (currentRole === 'student') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse = AUTO_RESPONSES[Math.floor(Math.random() * AUTO_RESPONSES.length)];
        onSendMessage(randomResponse, 'teacher', 'លោកគ្រូ សុខ វិបុល');
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[400px] md:h-[500px] w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm" id="live-chat-panel">
      {/* Thread Title */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center border border-blue-250">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">
              {currentRole === 'student' ? 'កំពុងប្រឹក្សាយោបល់ជាមួយគ្រូ' : `ពិភាក្សាជាមួយសិស្ស៖ ${studentName}`}
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {currentRole === 'student' ? 'លោកគ្រូប្រចាំមុខវិជ្ជា (Instructor Hub)' : `${studentName} (Student)`}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-2 py-0.5 rounded font-bold">
          <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
          <span>ផ្សាយផ្ទាល់ LIVE</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {messages.map((message) => {
          const isMe = message.senderRole === currentRole;
          return (
            <div
              key={message.id}
              className={`flex flex-col max-w-[85%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div className="text-[10px] text-slate-505 text-slate-500 mb-1 font-semibold px-1 flex items-center gap-1 select-none">
                <span>{message.senderName}</span>
                <span className="text-slate-400 font-normal">
                  · {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div
                className={`p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                {message.text}
              </div>
              {isMe && (
                <div className="text-[9px] text-slate-420 text-slate-500 mt-0.5 flex items-center gap-1 select-none">
                  <CheckCheck className="w-3 h-3 text-emerald-500" />
                  <span>ផ្ញើរួច</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Teacher Typing Indicator */}
        {isTyping && (
          <div className="flex flex-col max-w-[85%] mr-auto items-start animate-pulse">
            <div className="text-[10px] text-slate-500 mb-1 font-semibold px-1 select-none">
              លោកគ្រូ សុខ វិបុល
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 shadow-xs">
              <span className="text-slate-500">កំពុងវាយសរសេរ</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={currentRole === 'student' ? 'សរសេរសំនួរសួរគ្រូ... / Type support query...' : 'ឆ្លើយតបទៅកាន់សិស្ស... / Reply to student...'}
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 text-xs md:text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition placeholder:text-slate-400"
          id="chat-text-input"
        />
        <button
          type="submit"
          id="send-chat-message-btn"
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 flex items-center justify-center transition cursor-pointer shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
