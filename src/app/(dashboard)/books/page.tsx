"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookMarked,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  ArrowRight,
  Filter,
  PlayCircle,
  FileText,
  HelpCircle,
  GraduationCap,
  ChevronRight,
  Clock,
  Award,
  Bookmark,
  ExternalLink,
  Flame,
  X,
  Loader2,
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

  // Quick Practice Modal State
  const [generatingTest, setGeneratingTest] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedBookForPractice, setSelectedBookForPractice] = useState<any | null>(null);
  const [practiceCount, setPracticeCount] = useState<number>(20);
  const [practiceMode, setPracticeMode] = useState<"PRACTICE" | "MOCK">("PRACTICE");
  const [practiceDifficulty, setPracticeDifficulty] = useState<string>("ALL");
  const [practiceSource, setPracticeSource] = useState<string>("ALL");

  // Fetch Books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/books");
      const data = await res.json();
      if (data?.books) {
        setBooks(data.books);
        // Initialize default volume filters to ALL
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

  // Launch Quick Test
  const handleStartPractice = async (bookId: string, chapterId?: string) => {
    try {
      setGeneratingTest(true);
      const payload: any = {
        bookId,
        questionCount: practiceCount,
        mode: practiceMode,
        difficulty: practiceDifficulty,
        sourceFilter: practiceSource,
      };

      if (chapterId) {
        payload.chapterIds = [chapterId];
      }

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
        router.push(`/mock/${data.testAttemptId}/test?instantFeedback=${practiceMode === "PRACTICE"}`);
      } else {
        alert(data.error || "Failed to generate practice session");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setGeneratingTest(false);
      setPracticeModalOpen(false);
    }
  };

  // Filter books by subject
  const filteredBooks = books.filter((b) => {
    if (selectedSubject === "ALL") return true;
    if (selectedSubject === "ENGLISH") return b.subject.toLowerCase().includes("english");
    if (selectedSubject === "GK") return b.subject.toLowerCase().includes("general") || b.subject.toLowerCase().includes("gk");
    return true;
  });

  // Calculate platform statistics
  const totalBooksCount = books.length;
  const totalChaptersCount = books.reduce((acc, b) => acc + (b.chapterCount || 0), 0);
  const totalQuestionsCount = books.reduce((acc, b) => acc + (b.totalQuestions || 0), 0);
  const totalTheoryCount = books.reduce((acc, b) => acc + (b.totalTheory || 0), 0);

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
            Preserving 100% authentic theory, grammatical rules, exceptions, illustrative examples,
            and complete MCQ banks with verified step-by-step solutions from Neetu Singh English (Vol 1 &amp; 2)
            and Brahmastra Static GK.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[11px] font-medium">Reference Books</span>
              <span className="text-xl font-black text-white">{totalBooksCount || 3} Volumes</span>
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

      {/* 2. SEARCH & SUBJECT NAVIGATION */}
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

      {/* 3. INSTANT SEARCH RESULTS DRAWER / OVERLAY */}
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

      {/* 4. BOOKS AND CHAPTERS SHOWCASE */}
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

            // Filter chapters by volume
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

                      {/* Volume Filter Chips (for English Vol 1 / Vol 2) */}
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
                        onClick={() => {
                          setSelectedBookForPractice(book);
                          setPracticeModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        <span>Random Practice (20 Qs)</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBookForPractice(book);
                          setPracticeSource("PYQ");
                          setPracticeModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        <Flame className="w-4 h-4 text-amber-400" />
                        <span>PYQ Marathon</span>
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
                              onClick={() => handleStartPractice(book.id, chapter.id)}
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

      {/* 5. PRACTICE GENERATION CONFIG MODAL */}
      {practiceModalOpen && selectedBookForPractice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">
                  Practice Test Generator
                </span>
                <h3 className="text-base font-black text-slate-900 mt-0.5">
                  {selectedBookForPractice.title}
                </h3>
              </div>
              <button
                onClick={() => setPracticeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Question Count */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Number of Questions</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPracticeCount(num)}
                      className={`py-2 rounded-lg font-bold transition-all ${
                        practiceCount === num
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Session Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPracticeMode("PRACTICE")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      practiceMode === "PRACTICE"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Study &amp; Learn</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      Instant feedback with KaTeX step-by-step explanations on click
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPracticeMode("MOCK")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      practiceMode === "MOCK"
                        ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Timed CBT Mock</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-normal">
                      Authentic SSC exam simulator with timer and final score card
                    </p>
                  </button>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Question Difficulty</label>
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

              {/* Source Filter */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Question Source</label>
                <select
                  value={practiceSource}
                  onChange={(e) => setPracticeSource(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="ALL">All Questions in Book</option>
                  <option value="PYQ">Previous Years SSC Exam Questions (PYQ)</option>
                  <option value="STANDARD">Standard Textbook Exercise</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPracticeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={generatingTest}
                onClick={() => handleStartPractice(selectedBookForPractice.id)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {generatingTest ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Launching CBT Engine...</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Practice Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
