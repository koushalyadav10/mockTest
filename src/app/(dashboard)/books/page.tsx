"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
  PlayCircle,
  FileText,
  Clock,
  Award,
  Flame,
  X,
  Loader2,
  CheckSquare,
  Square,
  Sliders,
  Send,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function BooksCatalogPage() {
  const router = useRouter();

  // State
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedVolumeFilter, setSelectedVolumeFilter] = useState<{ [bookId: string]: string }>({});

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [searching, setSearching] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Test Generator & Assign Modal State
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedBookForPractice, setSelectedBookForPractice] = useState<any | null>(null);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [chapterFilterKeyword, setChapterFilterKeyword] = useState("");
  const [practiceCount, setPracticeCount] = useState<number>(20);
  const [customCountInput, setCustomCountInput] = useState<string>("");
  const [practiceMode, setPracticeMode] = useState<"PRACTICE" | "MOCK">("PRACTICE");
  const [practiceDifficulty, setPracticeDifficulty] = useState<string>("ALL");
  const [practiceSource, setPracticeSource] = useState<string>("ALL");
  const [testTitle, setTestTitle] = useState("");
  const [customDuration, setCustomDuration] = useState<number>(30);
  const [generatingTest, setGeneratingTest] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignSuccessInfo, setAssignSuccessInfo] = useState<{
    examId: string;
    title: string;
    count: number;
  } | null>(null);

  // Fetch Books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/books");
      const data = await res.json();
      if (data?.books) {
        setBooks(data.books);
        const initialVolFilters: { [id: string]: string } = {};
        data.books.forEach((b: any) => {
          initialVolFilters[b.id] = "ALL";
        });
        setSelectedVolumeFilter(initialVolFilters);
      }
    } catch (e) {
      console.error("Failed to load books catalog:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Search Debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
        const data = await res.json();
        if (data?.results) {
          setSearchResults(data.results);
          setIsSearchActive(true);
        }
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Open Hub Modal
  const openTestHub = (book: any, defaultChapterId?: string, assignMode: boolean = false) => {
    setSelectedBookForPractice(book);
    setIsAssignMode(assignMode);
    setAssignSuccessInfo(null);
    setChapterFilterKeyword("");

    if (defaultChapterId) {
      setSelectedChapterIds([defaultChapterId]);
    } else {
      setSelectedChapterIds(book.chapters ? book.chapters.map((c: any) => c.id) : []);
    }

    const isGK =
      book.subject?.toLowerCase().includes("general") ||
      book.subject?.toLowerCase().includes("gk");
    setTestTitle(
      assignMode
        ? `[Assigned] ${isGK ? "Static GK" : "English"} Mastery Assessment`
        : ""
    );
    setPracticeCount(20);
    setCustomCountInput("");
    setCustomDuration(25);
    setPracticeModalOpen(true);
  };

  // Toggle chapter selection in Hub
  const toggleChapterSelection = (chapterId: string) => {
    setSelectedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSelectAllChapters = () => {
    if (!selectedBookForPractice?.chapters) return;
    const allIds = selectedBookForPractice.chapters.map((c: any) => c.id);
    setSelectedChapterIds(allIds);
  };

  const handleDeselectAllChapters = () => {
    setSelectedChapterIds([]);
  };

  // Launch Instant Practice
  const handleStartPractice = async () => {
    if (selectedChapterIds.length === 0) {
      alert("Please select at least 1 chapter or topic to practice.");
      return;
    }
    try {
      setGeneratingTest(true);
      const count = customCountInput ? parseInt(customCountInput, 10) : practiceCount;
      const payload: any = {
        bookId: selectedBookForPractice.id,
        chapterIds: selectedChapterIds,
        questionCount: count || 20,
        mode: practiceMode,
        difficulty: practiceDifficulty,
        sourceFilter: practiceSource,
      };

      const res = await fetch("/api/books/practice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.push("/login?callbackUrl=/books");
        return;
      }

      const data = await res.json();
      if (data?.testAttemptId) {
        router.push(
          `/mock/${data.testAttemptId}/test?instantFeedback=${practiceMode === "PRACTICE"}`
        );
      } else {
        alert(data.error || "Failed to generate practice session");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setGeneratingTest(false);
    }
  };

  // Assign Test to Candidates
  const handleAssignTest = async () => {
    if (selectedChapterIds.length === 0) {
      alert("Please select at least 1 chapter or topic to assign.");
      return;
    }
    try {
      setIsAssigning(true);
      const isGK =
        selectedBookForPractice.subject?.toLowerCase().includes("general") ||
        selectedBookForPractice.subject?.toLowerCase().includes("gk");
      const count = customCountInput ? parseInt(customCountInput, 10) : practiceCount;
      const duration = customDuration || Math.max(15, Math.ceil((count || 20) * 1.2));

      const payload = {
        title: testTitle.trim() || `[Assigned] ${isGK ? "Static GK" : "English"} Assessment (${count} Qs)`,
        subject: isGK ? "GK_GS" : "ENGLISH",
        bookId: selectedBookForPractice.id,
        chapterIds: selectedChapterIds,
        questionCount: count || 20,
        difficulty: practiceDifficulty,
        durationMinutes: duration,
        marksPerCorrect: 2.0,
        negativeMarks: 0.5,
        mode: "EXAM",
      };

      const res = await fetch("/api/books/assign-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setAssignSuccessInfo({
          examId: data.examId,
          title: data.title,
          count: data.totalQuestions,
        });
      } else {
        alert(data.error || "Failed to assign test");
      }
    } catch (e: any) {
      alert("Error assigning test: " + e.message);
    } finally {
      setIsAssigning(false);
    }
  };

  // Identify English and GK books for top cards
  const englishBook = books.find((b) => b.subject.toLowerCase().includes("english"));
  const gkBook = books.find(
    (b) => b.subject.toLowerCase().includes("general") || b.subject.toLowerCase().includes("gk")
  );

  // Filter books by subject
  const filteredBooks = books.filter((b) => {
    if (selectedSubject === "ALL") return true;
    if (selectedSubject === "ENGLISH") return b.subject.toLowerCase().includes("english");
    if (selectedSubject === "GK")
      return b.subject.toLowerCase().includes("general") || b.subject.toLowerCase().includes("gk");
    return true;
  });

  // Calculate platform statistics
  const totalBooksCount = books.length;
  const totalChaptersCount = books.reduce((acc, b) => acc + (b.chapterCount || 0), 0);
  const totalQuestionsCount = books.reduce((acc, b) => acc + (b.totalQuestions || 0), 0);
  const totalTheoryCount = books.reduce((acc, b) => acc + (b.totalTheory || 0), 0);

  // Filtered chapters inside Modal
  const modalFilteredChapters = useMemo(() => {
    if (!selectedBookForPractice?.chapters) return [];
    return selectedBookForPractice.chapters.filter((c: any) => {
      const q = chapterFilterKeyword.toLowerCase().trim();
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        String(c.chapterNumber).includes(q) ||
        (c.summary && c.summary.toLowerCase().includes(q))
      );
    });
  }, [selectedBookForPractice, chapterFilterKeyword]);

  // Questions available in selected chapters
  const availableQuestionsCount = useMemo(() => {
    if (!selectedBookForPractice?.chapters) return 0;
    return selectedBookForPractice.chapters
      .filter((c: any) => selectedChapterIds.includes(c.id))
      .reduce((acc: number, c: any) => acc + (c.totalQuestions || 0), 0);
  }, [selectedBookForPractice, selectedChapterIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* 1. HERO HEADER */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Deep Book &amp; PDF Intelligence Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Master Standard Reference Textbooks Chapter-by-Chapter
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Preserving 100% authentic theory, grammatical rules, exceptions, contextual idiom stories,
            and complete MCQ banks with verified step-by-step solutions from Neetu Singh English (Vol 1 &amp; 2)
            and Brahmastra Static GK.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px] font-medium">Reference Books</span>
              <span className="text-xl font-black text-white">{totalBooksCount || 2} Volumes</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px] font-medium">Mapped Chapters</span>
              <span className="text-xl font-black text-indigo-300">{totalChaptersCount || 73} Chapters</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px] font-medium">Authentic MCQs</span>
              <span className="text-xl font-black text-emerald-400">{totalQuestionsCount.toLocaleString()} MCQs</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px] font-medium">Theory &amp; Rules</span>
              <span className="text-xl font-black text-amber-300">{totalTheoryCount || 245}+ Concepts</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT SUBJECT CARDS (English Language & General Awareness) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ENGLISH CARD */}
        {englishBook && (
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-700/50 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  English Language • 49 Chapters • 940+ Qs
                </span>
                <span className="text-xs text-indigo-300 font-bold">Vol 1 &amp; 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Neetu Singh English Language Master
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
                Complete authentic grammar rules, idioms in stories with full contextual passages, vocabulary root tables, cloze tests, and TCS PYQ sets.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-indigo-300 font-semibold pt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Grammatical Rules</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Idioms in Stories</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Vocabulary Tables</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Cloze Test &amp; RC</span>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10 border-t border-indigo-800/60 mt-4">
              <button
                type="button"
                onClick={() => openTestHub(englishBook, undefined, false)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Custom Practice</span>
              </button>
              <button
                type="button"
                onClick={() => openTestHub(englishBook, undefined, true)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Assign Test to Candidates</span>
              </button>
            </div>
          </div>
        )}

        {/* GENERAL AWARENESS CARD */}
        {gkBook && (
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl p-6 text-white border border-emerald-700/50 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  General Awareness • 24 Chapters • 871+ Qs
                </span>
                <span className="text-xs text-emerald-300 font-bold">Brahmastra Edition</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                BRAHMASTRA Static GK (Aditya Ranjan Sir)
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Topic-wise coverage of Art &amp; Culture, Rivers, National Parks, Constitutional Amendments, Census 2011, Science formulas, and Sports trophies.
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] text-emerald-300 font-semibold pt-1">
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Art &amp; Culture</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Geography &amp; Rivers</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ Polity &amp; Articles</span>
                <span className="bg-white/10 px-2 py-0.5 rounded">✓ TCS Exam Tags</span>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10 border-t border-emerald-900/60 mt-4">
              <button
                type="button"
                onClick={() => openTestHub(gkBook, undefined, false)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Custom Practice</span>
              </button>
              <button
                type="button"
                onClick={() => openTestHub(gkBook, undefined, true)}
                className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Assign Test to Candidates</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. SEARCH & SUBJECT NAVIGATION */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setSelectedSubject("ALL")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              selectedSubject === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            All Subjects ({totalBooksCount})
          </button>
          <button
            onClick={() => setSelectedSubject("ENGLISH")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedSubject === "ENGLISH"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>English Language</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-md text-[10px]">Vol 1 &amp; 2</span>
          </button>
          <button
            onClick={() => setSelectedSubject("GK")}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              selectedSubject === "GK"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <span>General Awareness (Static GK)</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-md text-[10px]">Brahmastra</span>
          </button>
        </div>

        {/* Global Deep Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search grammar rules, chapters, static GK facts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-600 animate-spin" />
          )}
          {searchQuery && !searching && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults(null);
                setIsSearchActive(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4. INSTANT SEARCH RESULTS DRAWER / OVERLAY */}
      {isSearchActive && searchResults && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-xl p-5 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Search className="w-4 h-4 text-indigo-600" />
              <span>Search Results for &quot;{searchQuery}&quot;</span>
            </div>
            <button
              onClick={() => setIsSearchActive(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chapters Match */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Chapters ({searchResults.chapters?.length || 0})
              </span>
              {searchResults.chapters?.length > 0 ? (
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {searchResults.chapters.map((ch: any) => (
                    <Link
                      key={ch.id}
                      href={`/books/${ch.bookId}/chapters/${ch.id}`}
                      className="block p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">
                        Ch {ch.chapterNumber}: {ch.title}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {ch.book?.title} &bull; {ch.totalQuestions} Questions
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching chapters</p>
              )}
            </div>

            {/* Theory & Rules Match */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Theory &amp; Rules ({searchResults.theory?.length || 0})
              </span>
              {searchResults.theory?.length > 0 ? (
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {searchResults.theory.map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/books/${t.bookId}/chapters/${t.chapterId}?tab=learn`}
                      className="block p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition-all group"
                    >
                      <div className="font-bold text-xs text-slate-800 group-hover:text-amber-800">
                        {t.title}
                      </div>
                      <p className="text-[10px] text-slate-600 line-clamp-2 mt-0.5">{t.snippet}</p>
                      <span className="text-[9px] text-slate-400 mt-0.5 block">
                        {t.chapterTitle} &bull; {t.contentType}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching theory or rules</p>
              )}
            </div>

            {/* Questions Match */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Questions ({searchResults.questions?.length || 0})
              </span>
              {searchResults.questions?.length > 0 ? (
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {searchResults.questions.map((q: any) => (
                    <Link
                      key={q.id}
                      href={`/books/${q.chapter?.bookId}/chapters/${q.chapterId}?tab=solved`}
                      className="block p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all group"
                    >
                      <div className="font-semibold text-xs text-slate-800 group-hover:text-emerald-800 line-clamp-2">
                        {q.questionText}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>Ch {q.chapter?.chapterNumber}: {q.chapter?.title}</span>
                        {q.difficulty && (
                          <span className="font-bold uppercase text-[9px] px-1 py-0.2 bg-slate-200 rounded">
                            {q.difficulty}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No matching questions</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. BOOKS AND CHAPTERS SHOWCASE */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading textbooks and chapter databases...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-500 mt-1">Please ensure books are published in the admin console.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredBooks.map((book) => {
            const hasMultipleVolumes = book.volumes && book.volumes.length > 1;
            const currentVolFilter = selectedVolumeFilter[book.id] || "ALL";

            const displayedChapters = (book.chapters || []).filter((ch: any) => {
              if (currentVolFilter === "ALL") return true;
              return ch.volumeId === currentVolFilter;
            });

            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Book Header Card */}
                <div className="p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {book.subject}
                        </span>
                        {book.author && (
                          <span className="text-xs text-slate-500 font-semibold">
                            Author: <strong className="text-slate-800">{book.author}</strong>
                          </span>
                        )}
                        {book.edition && (
                          <span className="text-xs text-slate-400">&bull; {book.edition}</span>
                        )}
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {book.title}
                      </h2>

                      {book.description && (
                        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                          {book.description}
                        </p>
                      )}

                      {/* Volume Filter Chips */}
                      {hasMultipleVolumes && (
                        <div className="pt-2 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-indigo-600" />
                            Volumes:
                          </span>
                          <button
                            onClick={() =>
                              setSelectedVolumeFilter((prev) => ({ ...prev, [book.id]: "ALL" }))
                            }
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              currentVolFilter === "ALL"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            All Volumes (Combined {book.chapterCount} Chs)
                          </button>
                          {book.volumes.map((vol: any) => (
                            <button
                              key={vol.id}
                              onClick={() =>
                                setSelectedVolumeFilter((prev) => ({ ...prev, [book.id]: vol.id }))
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                currentVolFilter === vol.id
                                  ? "bg-indigo-600 text-white shadow-xs"
                                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              Vol {vol.volumeNumber}: {vol.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Book Action Buttons */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => openTestHub(book, undefined, false)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Random Practice (Select Topics)</span>
                      </button>

                      <button
                        onClick={() => openTestHub(book, undefined, true)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>Assign Test</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chapter Cards Grid */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Chapters &amp; Learning Modules ({displayedChapters.length})
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      Click any chapter to study theory, examples &amp; MCQs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {displayedChapters.map((chapter: any) => {
                      return (
                        <div
                          key={chapter.id}
                          className="group relative p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 bg-white hover:bg-indigo-50/20 transition-all duration-200 flex flex-col justify-between shadow-2xs hover:shadow-xs"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="inline-flex items-center gap-1 font-black text-indigo-700 text-xs px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
                                Ch {chapter.chapterNumber}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                                  {chapter.totalQuestions || 0} Qs
                                </span>
                                {chapter.totalTheoryBlocks > 0 && (
                                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold border border-amber-200/60">
                                    {chapter.totalTheoryBlocks} Theory
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              href={`/books/${book.id}/chapters/${chapter.id}`}
                              className="block"
                            >
                              <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                                {chapter.title}
                              </h3>
                            </Link>

                            {chapter.summary && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {chapter.summary}
                              </p>
                            )}
                          </div>

                          {/* Action Footer */}
                          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <Link
                              href={`/books/${book.id}/chapters/${chapter.id}`}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <span>Study Hub</span>
                              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>

                            <button
                              onClick={() => openTestHub(book, chapter.id, false)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-[11px] font-bold transition-all flex items-center gap-1"
                            >
                              <Zap className="w-3 h-3 text-amber-500 group-hover:text-white" />
                              <span>Test</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. ADVANCED TEST GENERATOR & ASSIGNMENT HUB MODAL */}
      {practiceModalOpen && selectedBookForPractice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {isAssignMode ? "Faculty Assignment Console" : "CBT Practice Generator"}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {selectedBookForPractice.title}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {isAssignMode ? "Configure & Assign Test to Students" : "Custom CBT Test Builder"}
                </h3>
              </div>
              <button
                onClick={() => setPracticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto pr-1 py-4 space-y-5 flex-1 scrollbar-thin">
              {/* Success Notification if Assigned */}
              {assignSuccessInfo && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Test Assigned Successfully!</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    <strong>{assignSuccessInfo.title}</strong> has been published with {assignSuccessInfo.count} questions. It is now visible to candidates under Assigned CBT Tests.
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => router.push("/exams?tab=ASSIGNED")}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-1"
                    >
                      <span>View in Assigned Tests</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Title Input (If assigning) */}
              {isAssignMode && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Assigned Test Title
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="e.g. Weekly English Vocab & Grammar Drill"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium"
                  />
                </div>
              )}

              {/* Chapter Multi-Select Section */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      Select Topics / Chapters ({selectedChapterIds.length} of{" "}
                      {selectedBookForPractice.chapters?.length || 0} Selected)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Total pool: <strong>{availableQuestionsCount}</strong> questions available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllChapters}
                      className="text-[11px] font-bold text-indigo-600 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleDeselectAllChapters}
                      className="text-[11px] font-bold text-slate-500 hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                {/* Filter input inside modal */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter chapters by title..."
                    value={chapterFilterKeyword}
                    onChange={(e) => setChapterFilterKeyword(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                {/* Scrollable list of chapters */}
                <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
                  {modalFilteredChapters.map((ch: any) => {
                    const isChecked = selectedChapterIds.includes(ch.id);
                    return (
                      <div
                        key={ch.id}
                        onClick={() => toggleChapterSelection(ch.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs transition-all ${
                          isChecked
                            ? "bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold"
                            : "bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className="truncate">
                            Ch {ch.chapterNumber}: {ch.title}
                          </span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono shrink-0 ml-2">
                          {ch.totalQuestions || 0} Qs
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question Count Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  How many questions do you want in this test?
                </label>
                <div className="grid grid-cols-5 gap-2 text-xs font-bold">
                  {[10, 20, 25, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setPracticeCount(num);
                        setCustomCountInput("");
                      }}
                      className={`py-2 rounded-xl transition-all ${
                        practiceCount === num && !customCountInput
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="Or enter custom question count (e.g. 15)"
                    value={customCountInput}
                    min={1}
                    max={availableQuestionsCount || 100}
                    onChange={(e) => setCustomCountInput(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Mode & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Difficulty Filter</label>
                  <select
                    value={practiceDifficulty}
                    onChange={(e) => setPracticeDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="ALL">All Levels (Balanced Mix)</option>
                    <option value="EASY">Easy (Direct Rules &amp; Basic Facts)</option>
                    <option value="MEDIUM">Medium (Moderate Conceptual)</option>
                    <option value="HARD">Hard (Advanced Tricky Exceptions)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(Number(e.target.value))}
                    min={5}
                    max={180}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Session Mode Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Execution Mode</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPracticeMode("PRACTICE")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      practiceMode === "PRACTICE"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Study &amp; Learn</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Instant feedback with KaTeX step-by-step solutions
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPracticeMode("MOCK")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      practiceMode === "MOCK"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Timed CBT Mock</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Real exam simulator with countdown timer
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Dual Actions */}
            <div className="pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPracticeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAssigning || selectedChapterIds.length === 0}
                  onClick={handleAssignTest}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing Assignment...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-amber-400" />
                      <span>Assign Test to Candidates</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={generatingTest || selectedChapterIds.length === 0}
                  onClick={handleStartPractice}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {generatingTest ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Starting CBT...</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      <span>Start CBT Practice Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
