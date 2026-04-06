import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "lampscribe-quotes-v1";
const QUOTES_CHANGED = "lampscribe-quotes-changed";

function notifyQuotesChanged() {
  window.dispatchEvent(new Event(QUOTES_CHANGED));
}

export interface Quote {
  id: string;
  content: string;
  source_text?: string;
  created_at: string;
  updated_at: string;
}

function loadQuotes(): Quote[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Quote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveQuotes(quotes: Quote[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const syncFromStorage = useCallback(() => {
    setQuotes(loadQuotes());
    setLoading(false);
  }, []);

  useEffect(() => {
    syncFromStorage();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) syncFromStorage();
    };
    const onCustom = () => syncFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener(QUOTES_CHANGED, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(QUOTES_CHANGED, onCustom);
    };
  }, [syncFromStorage]);

  const saveQuote = async (content: string, sourceText?: string) => {
    const now = new Date().toISOString();
    const row: Quote = {
      id: crypto.randomUUID(),
      content,
      source_text: sourceText,
      created_at: now,
      updated_at: now,
    };
    const next = [row, ...loadQuotes()];
    saveQuotes(next);
    setQuotes(next);
    notifyQuotesChanged();
    toast({
      title: "Quote saved",
      description: "Your quote has been saved in this browser.",
    });
  };

  const deleteQuote = async (quoteId: string) => {
    const next = loadQuotes().filter((q) => q.id !== quoteId);
    saveQuotes(next);
    setQuotes(next);
    notifyQuotesChanged();
    toast({
      title: "Quote deleted",
      description: "The quote has been removed from your collection.",
    });
  };

  return {
    quotes,
    loading,
    saveQuote,
    deleteQuote,
    refetch: syncFromStorage,
  };
}
