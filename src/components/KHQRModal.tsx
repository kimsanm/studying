import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, QrCode, Landmark, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Course } from '../types';

interface KHQRModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (bankUsed: string, transactionId: string) => void;
}

const BANKS = [
  { id: 'aba', name: 'ABA Bank', color: 'bg-teal-50 border-teal-200 text-teal-800' },
  { id: 'acleda', name: 'ACLEDA Mobile', color: 'bg-amber-50 border-amber-200 text-amber-850 text-amber-800' },
  { id: 'wing', name: 'Wing Bank', color: 'bg-lime-50 border-lime-200 text-lime-800' },
  { id: 'chipmong', name: 'Chip Mong Bank', color: 'bg-red-50 border-red-200 text-red-800' },
];

export default function KHQRModal({ course, isOpen, onClose, onPaymentSuccess }: KHQRModalProps) {
  const [selectedBank, setSelectedBank] = useState('aba');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'scanning' | 'verifying' | 'success'>('idle');
  const [trxId, setTrxId] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentStatus('idle');
      const randomId = 'KHQR-' + Math.floor(Math.random() * 900000 + 100000) + '-' + selectedBank.toUpperCase();
      setTrxId(randomId);
    }
  }, [isOpen, selectedBank]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setPaymentStatus('verifying');
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        onPaymentSuccess(BANKS.find(b => b.id === selectedBank)?.name || 'ABA Bank', trxId);
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl"
        id="khqr-modal-container"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 bg-red-600 rounded text-white font-bold text-xs tracking-wider">KHQR</div>
            <h3 className="text-sm font-bold text-slate-900">ទូទាត់ប្រាក់ដោយសុវត្ថិភាពខ្ពស់ via Local Banks</h3>
          </div>
          <button
            onClick={onClose}
            id="close-khqr-btn"
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-505 text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center">
          {paymentStatus === 'idle' && (
            <>
              {/* Info summary */}
              <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5 text-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-550 text-slate-500 font-bold block">វគ្គសិក្សាដែលត្រូវជាវ</span>
                <h4 className="text-sm font-semibold text-slate-800 mt-1 line-clamp-1">{course.title}</h4>
                <div className="mt-2 text-2xl font-mono font-extrabold text-blue-600 flex items-center justify-center gap-1.5">
                  <span>${course.price.toFixed(2)}</span>
                  <span className="text-xs text-slate-500 font-medium">
                    (~ {(course.price * 4100).toLocaleString()} រៀល)
                  </span>
                </div>
              </div>

              {/* KHQR Styled Container */}
              <div className="relative p-4 bg-white rounded-2xl shadow-sm border-4 border-slate-100 text-center flex flex-col items-center w-64 h-64 justify-center">
                {/* Red/Blue KHQR Top Banner */}
                <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-red-600 via-white to-blue-800 rounded-t-xl" />

                {/* QR Symbol Box */}
                <div className="relative border border-slate-200 p-2 rounded-lg bg-slate-50">
                  <QrCode className="w-40 h-40 text-slate-900" />
                  {/* Central QR Cambodian Flag / Bakong stylized micro-dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shadow">
                    <span className="text-[7px] text-white font-extrabold tracking-tighter leading-none">KH</span>
                  </div>

                  {/* Laser Scan line animation */}
                  <div className="absolute inset-x-1 top-2 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-[bounce_2s_infinite]" />
                </div>

                <div className="mt-3 text-slate-500 font-mono text-[9px] tracking-widest uppercase font-bold">
                  SCAN TO PAY KHQR
                </div>
              </div>

              {/* Secure payment protection label */}
              <div className="flex items-center gap-1.5 text-slate-600 mt-4 text-xs font-semibold">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                <span>គាំទ្រដោយធនាគារជាតិ ផ្ទេរប្រាក់សុវត្ថិភាពស្វ័យប្រវត្ត</span>
              </div>

              {/* Bank selector */}
              <div className="w-full mt-5">
                <label className="block text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-wide">
                  ជ្រើសរើសធនាគារលើយើងសម្រាប់ស្កេន (Simulated Bank App):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BANKS.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      id={`bank-select-${bank.id}`}
                      className={`flex items-center gap-1.5 border p-2.5 rounded-xl text-left text-xs transition cursor-pointer select-none ${
                        selectedBank === bank.id
                          ? `${bank.color} shadow-sm ring-2 ring-emerald-500/55`
                          : 'bg-slate-50 border-slate-200 text-slate-655 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="font-semibold truncate">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment trigger button */}
              <button
                onClick={handleSimulatePayment}
                id="khqr-submit-simulation-btn"
                className="w-full mt-6 bg-gradient-to-r from-emerald-550 to-teal-600 bg-emerald-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold py-3.5 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.01]"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>យល់ព្រមបង់ប្រាក់សាកល្បង (Simulate Success Scan)</span>
              </button>
            </>
          )}

          {paymentStatus === 'verifying' && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-emerald-550 text-emerald-500 animate-spin mb-4" />
              <h4 className="text-base font-bold text-slate-900">កំពុងផ្ទៀងផ្ទាត់ការផ្ទេរប្រាក់...</h4>
              <p className="text-xs text-slate-505 text-slate-500 max-w-xs mt-2">
                ធនាគារកំពុងត្រួតពិនិត្យគណនីនិម្មិត ABA/KHQR។ ព័ត៌មានផ្ទេរប្រាក់ {trxId} មានសុវត្ថិភាពបំផុត។
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="py-10 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-300 mb-4 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h4 className="text-lg font-bold text-emerald-600">ទូទាត់ប្រាក់ជោគជ័យ!</h4>
              <p className="text-xs text-slate-600 max-w-xs mt-2 leading-relaxed">
                ប្រព័ន្ធបានបញ្ចូលវគ្គសិក្សាទៅកាន់គណនីរបស់អ្នក។ សូមរីករាយជាមួយការសិក្សាមេរៀន!
              </p>
              <div className="bg-slate-50 border border-slate-200 p-3 px-5 rounded-xl mt-4 text-left font-mono text-[10px] text-slate-600 min-w-[200px]">
                <div className="font-semibold text-slate-800">Bank: {BANKS.find(b => b.id === selectedBank)?.name}</div>
                <div className="text-slate-500 mt-0.5">ID: {trxId}</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
