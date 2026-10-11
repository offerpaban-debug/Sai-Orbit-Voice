import React, { useState } from 'react';
import { VOICE_CATALOG } from '../utils/voiceCatalog';
import { EmotionType, EMOTION_PROFILES } from '../utils/ssmlBuilder';
import { Layers, Plus, Trash2, Play, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { audioBufferToWavBlob, downloadBlob } from '../utils/audioEngine';

interface BatchItem {
  id: string;
  text: string;
  voiceId: string;
  emotion: EmotionType;
  status: 'idle' | 'generating' | 'done' | 'error';
  audioBlob?: Blob;
  audioUrl?: string;
  duration?: number;
}

interface BatchModeProps {
  onSynthesizeItem: (text: string, voiceId: string, emotion: EmotionType) => Promise<Blob>;
}

export const BatchMode: React.FC<BatchModeProps> = ({ onSynthesizeItem }) => {
  const [items, setItems] = useState<BatchItem[]>([
    {
      id: '1',
      text: 'সাইঅরবিট ভয়েস ব্যাচ মোডে স্বাগতম।',
      voiceId: 'bn-IN-Wavenet-A',
      emotion: 'neutral',
      status: 'idle',
    },
    {
      id: '2',
      text: 'এখানে আপনি একসাথে একাধিক অনুচ্ছেদের অডিও তৈরি করতে পারবেন।',
      voiceId: 'bn-IN-Wavenet-B',
      emotion: 'happy',
      status: 'idle',
    },
    {
      id: '3',
      text: 'প্রতিটি অডিও ফাইল আলাদাভাবে ডাউনলোড ও প্রিভিউ করা সম্ভব।',
      voiceId: 'gemini-kore',
      emotion: 'calm',
      status: 'idle',
    },
  ]);

  const [multiLineInput, setMultiLineInput] = useState('');
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  // Add items from multi-line text input
  const handleImportLines = () => {
    if (!multiLineInput.trim()) return;
    const lines = multiLineInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const newItems: BatchItem[] = lines.map((text, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      text,
      voiceId: 'bn-IN-Wavenet-A',
      emotion: 'neutral',
      status: 'idle',
    }));

    setItems([...items, ...newItems]);
    setMultiLineInput('');
  };

  const handleAddItem = () => {
    const newItem: BatchItem = {
      id: `batch-${Date.now()}`,
      text: '',
      voiceId: 'bn-IN-Wavenet-A',
      emotion: 'neutral',
      status: 'idle',
    };
    setItems([...items, newItem]);
  };

  const handleUpdateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  // Generate single item
  const handleGenerateSingle = async (item: BatchItem) => {
    if (!item.text.trim()) return;
    handleUpdateItem(item.id, { status: 'generating' });
    try {
      const blob = await onSynthesizeItem(item.text, item.voiceId, item.emotion);
      const url = URL.createObjectURL(blob);
      handleUpdateItem(item.id, { status: 'done', audioBlob: blob, audioUrl: url });
    } catch {
      handleUpdateItem(item.id, { status: 'error' });
    }
  };

  // Process all items in parallel batches
  const handleGenerateAll = async () => {
    setIsProcessingAll(true);
    for (const item of items) {
      if (item.status !== 'done' && item.text.trim()) {
        await handleGenerateSingle(item);
      }
    }
    setIsProcessingAll(false);
  };

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6C5CE7]" />
            <span>ব্যাচ অডিও জেনারেটর (Batch Mode)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            একসাথে একাধিক স্ক্রিপ্ট বা বইয়ের অধ্যায় রূপান্তর করুন। প্যারালাল প্রসেসিংয়ে সর্বোচ্চ গতি।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>আইটেম যোগ করুন</span>
          </button>

          <button
            type="button"
            disabled={isProcessingAll || items.length === 0}
            onClick={handleGenerateAll}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#6C5CE7] to-[#00B894] text-white text-xs font-medium hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-[#6C5CE7]/30 disabled:opacity-40"
          >
            {isProcessingAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>প্রসেস হচ্ছে...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>সব তৈরি করুন ({items.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Paste Area */}
      <div className="bg-[#0A0A1A] border border-white/10 rounded-xl p-3.5 space-y-2">
        <label className="block text-xs font-semibold text-slate-300">
          স্ক্রিপ্ট ইম্পোর্ট (প্রতিটি নতুন লাইন = একটি নতুন অডিও ফাইল):
        </label>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={multiLineInput}
            onChange={(e) => setMultiLineInput(e.target.value)}
            placeholder="লাইন ১...&#10;লাইন ২...&#10;লাইন ৩..."
            className="w-full bg-[#12122A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#6C5CE7]"
          />
          <button
            type="button"
            onClick={handleImportLines}
            className="px-4 rounded-lg bg-[#6C5CE7] text-white text-xs font-medium hover:bg-[#5b4cdb] transition-colors whitespace-nowrap self-stretch"
          >
            যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Batch Items List */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="bg-[#0A0A1A]/80 border border-white/10 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors hover:border-white/20"
          >
            <div className="flex items-start gap-2.5 flex-1">
              <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-center shrink-0 mt-1">
                {idx + 1}
              </span>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                  placeholder="টেক্সট লিখুন..."
                  className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white focus:outline-none focus:border-[#6C5CE7]"
                />
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <select
                    value={item.voiceId}
                    onChange={(e) => handleUpdateItem(item.id, { voiceId: e.target.value })}
                    className="bg-[#12122A] border border-white/15 rounded px-2 py-1 text-slate-300 text-xs"
                  >
                    {VOICE_CATALOG.slice(0, 8).map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nameBn}
                      </option>
                    ))}
                  </select>

                  <select
                    value={item.emotion}
                    onChange={(e) => handleUpdateItem(item.id, { emotion: e.target.value as EmotionType })}
                    className="bg-[#12122A] border border-white/15 rounded px-2 py-1 text-slate-300 text-xs"
                  >
                    {Object.values(EMOTION_PROFILES).map((emo) => (
                      <option key={emo.id} value={emo.id}>
                        {emo.icon} {emo.labelBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Actions per item */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {item.status === 'generating' && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  তৈরি হচ্ছে...
                </span>
              )}

              {item.status === 'done' && (
                <>
                  <span className="text-xs text-[#00B894] flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    প্রস্তুত
                  </span>
                  {item.audioUrl && (
                    <audio controls src={item.audioUrl} className="h-8 w-40" />
                  )}
                  {item.audioBlob && (
                    <button
                      type="button"
                      onClick={() => downloadBlob(item.audioBlob!, `batch_audio_${idx + 1}.wav`)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                      title="ডাউনলোড"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}

              {item.status === 'idle' && (
                <button
                  type="button"
                  onClick={() => handleGenerateSingle(item)}
                  className="px-3 py-1 rounded-lg bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-medium transition-colors"
                >
                  তৈরি করুন
                </button>
              )}

              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
