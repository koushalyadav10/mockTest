/**
 * Bookmark Vault / Mistake Diary Helper
 * Allows students to star and save questions for future revision.
 */

export interface BookmarkedQuestion {
  questionId: string;
  subject: string;
  topic: string;
  questionText: string;
  bookmarkedAt: string;
}

const STORAGE_KEY = "studybae_bookmark_vault";

export function getBookmarks(): Record<string, BookmarkedQuestion> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function isQuestionBookmarked(questionId: string): boolean {
  if (!questionId) return false;
  const bookmarks = getBookmarks();
  return Boolean(bookmarks[questionId]);
}

export function toggleQuestionBookmark(item: {
  questionId: string;
  subject: string;
  topic: string;
  questionText: string;
}): boolean {
  if (typeof window === "undefined" || !item.questionId) return false;
  try {
    const bookmarks = getBookmarks();
    if (bookmarks[item.questionId]) {
      delete bookmarks[item.questionId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      window.dispatchEvent(new Event("studybae_bookmarks_updated"));
      return false;
    } else {
      bookmarks[item.questionId] = {
        questionId: item.questionId,
        subject: item.subject,
        topic: item.topic,
        questionText: item.questionText,
        bookmarkedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      window.dispatchEvent(new Event("studybae_bookmarks_updated"));
      return true;
    }
  } catch (e) {
    return false;
  }
}
