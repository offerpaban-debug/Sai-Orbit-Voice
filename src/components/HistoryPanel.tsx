import React, { useState } from 'react';
import { HistoryItem } from '../App';
import {
  History,
  Search,
  Star,
  Trash2,
  Download,
  Play,
  RotateCcw,
  Copy,
  Check,
  Filter
} from 'lucide-react';
import { VOICE_CATALOG } from '../utils/voiceCatalog';
import { EMOTION_PROFILES, EmotionType } from '../utils/ssmlBuilder';

interface HistoryPanelProps {
  history: HistoryItem[];
  onReplayItem: (item: HistoryItem) => void;
  onLoadTextToEditor: (text: string, voiceId: string, emotion: EmotionType) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onReplayItem,
  onLoadTextToEditor,
  onToggleFavorite,
  onDeleteItem,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter history
  const filteredHistory = history.filter((item) => {
    if (filterFavoriteOnly && !item.isFavorite) return false;
    if (filterEmotion !== 'all' && item.emotion !== filterEmotion) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.text.toLowerCase().includes(q) ||
        item.voiceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export History as CSV
  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['আইডি,তারিখ,ভয়েস,আবেগ,গতি,পিচ,সময়কাল(সেকেন্ড),টেক্সট'];
    const rows = history.map((item) => {
      const dateStr = new Date(item.timestamp).toLocaleString('bn-BD');
      const cleanText = `"${item.text.replace(/"/g, '""')}"`;
      return `${item.id},"${dateStr}","${item.voiceName}","${item.emotion}",${item.speed},${item.pitch},${item.durationSec || 0},${cleanText}`;
    });
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saiorbit_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#12122A] border border-white/10 rounded-2xl p-6 shadow-xl space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-[#6C5CE7]" />
            <span>জেনারেশন ইতিহাস (History)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            গত ১০০টি ভয়েস জেনারেশনের সম্পূর্ণ তালিকা। যেকোনো পুরোনো অডিও তাৎক্ষণিক শুনুন বা ডাউনলোড করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV এক্সপোর্ট</span>
              </button>

              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
              >
                সব মুছুন
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ইতিহাসে খুঁজুন..."
            className="w-full bg-[#0A0A1A] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        {/* Favorite filter toggle */}
        <button
          type="button"
          onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
          className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
            filterFavoriteOnly
              ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
              : 'bg-[#0A0A1A] border-white/15 text-slate-400 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-current' : ''}`} />
          <span>পছন্দের তালিকা</span>
        </button>

        {/* Emotion filter */}
        <select
          value={filterEmotion}
          onChange={(e) => setFilterEmotion(e.target.value)}
          className="bg-[#0A0A1A] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#6C5CE7]"
        >
          <option value="all">সব আবেগ (All Emotions)</option>
          {Object.values(EMOTION_PROFILES).map((e) => (
            <option key={e.id} value={e.id}>
              {e.icon} {e.labelBn}
            </option>
          ))}
        </select>
      </div>

      {/* Items List */}
      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          কোনো ইতিহাস পাওয়া যায়নি। স্টুডিওতে গিয়ে ভয়েস তৈরি করুন।
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const emo = EMOTION_PROFILES[item.emotion] || EMOTION_PROFILES.neutral;
            return (
              <div
                key={item.id}
                className="bg-[#0A0A1A]/80 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:border-[#6C5CE7]/40"
              >
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-white">{item.voiceName}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      {emo.icon} {emo.labelBn}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.durationSec ? (
                      <>
                        <span className="text-slate-500">·</span>
                        <span className="text-[#00B894] font-mono">{item.durationSec}s</span>
                      </>
                    ) : null}
                  </div>

                  <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {/* Star Favorite */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.isFavorite
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="পছন্দ চিহ্নিত করুন"
                  >
                    <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  {/* Copy Text */}
                  <button
                    type="button"
                    onClick={() => handleCopyText(item.id, item.text)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="টেক্সট কপি করুন"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-[#00B894]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  {/* Load back to Studio */}
                  <button
                    type="button"
                    onClick={() => onLoadTextToEditor(item.text, item.voiceId, item.emotion)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="স্টুডিওতে লোড করুন"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  {/* Replay */}
                  <button
                    type="button"
                    onClick={() => onReplayItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-[#6C5CE7] hover:bg-[#5b4cdb] text-white text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>প্লে করুন</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
