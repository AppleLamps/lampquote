import { useState, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "lampscribe-quotes-v1";
const QUOTES_CHANGED = "lampscribe-quotes-changed";

function notifyQuotesChanged() {
  window.dispatchEvent(new Event(QUOTES_CHANGED));
}

export interface Quote {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/* ── In-memory cache to avoid redundant JSON.parse calls within the same tab ── */
let quotesCache: Quote[] | null = null;

function loadQuotes(): Quote[] {
  if (quotesCache !== null) return quotesCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      quotesCache = [];
      return quotesCache;
    }
    const parsed = JSON.parse(raw) as Quote[];
    quotesCache = Array.isArray(parsed) ? parsed : [];
    return quotesCache;
  } catch {
    quotesCache = [];
    return quotesCache;
  }
}

function saveQuotes(quotes: Quote[]): boolean {
  quotesCache = quotes;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    return true;
  } catch (e) {
    // localStorage quota exceeded
    console.error("Failed to save quotes to localStorage:", e);
    return false;
  }
}

/** Invalidate the in-memory cache (used on cross-tab storage events). */
function invalidateCache() {
  quotesCache = null;
}

/* ── Context-based shared state (split to avoid unnecessary rerenders) ── */

interface QuotesDataValue {
  quotes: Quote[];
  loading: boolean;
}

interface QuotesActionsValue {
  saveQuote: (content: string) => Promise<void>;
  deleteQuote: (quoteId: string) => Promise<void>;
  refetch: () => void;
}

type QuotesContextValue = QuotesDataValue & QuotesActionsValue;

const QuotesDataContext = createContext<QuotesDataValue | null>(null);
const QuotesActionsContext = createContext<QuotesActionsValue | null>(null);

export function QuotesProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const syncFromStorage = useCallback(() => {
    invalidateCache(); // force re-read from localStorage
    setQuotes(loadQuotes());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Initial load (uses cache if available, otherwise reads localStorage)
    setQuotes(loadQuotes());
    setLoading(false);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) syncFromStorage();
    };
    const onCustom = () => {
      // Same-tab change: cache is already updated, just re-read it
      setQuotes(loadQuotes());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(QUOTES_CHANGED, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(QUOTES_CHANGED, onCustom);
    };
  }, [syncFromStorage]);

  const saveQuote = useCallback(
    async (content: string) => {
      const now = new Date().toISOString();
      const row: Quote = {
        id: crypto.randomUUID(),
        content,
        created_at: now,
        updated_at: now,
      };
      const next = [row, ...loadQuotes()];
      const ok = saveQuotes(next);
      setQuotes(next);
      notifyQuotesChanged();

      if (ok) {
        toast({
          title: "Quote saved",
          description: "Your quote has been saved in this browser.",
        });
      } else {
        toast({
          title: "Storage full",
          description: "Could not save — browser storage is full. Try deleting old quotes.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const deleteQuote = useCallback(
    async (quoteId: string) => {
      const next = loadQuotes().filter((q) => q.id !== quoteId);
      saveQuotes(next);
      setQuotes(next);
      notifyQuotesChanged();
      toast({
        title: "Quote deleted",
        description: "The quote has been removed from your collection.",
      });
    },
    [toast]
  );

  const data = useMemo<QuotesDataValue>(
    () => ({ quotes, loading }),
    [quotes, loading]
  );

  const actions = useMemo<QuotesActionsValue>(
    () => ({ saveQuote, deleteQuote, refetch: syncFromStorage }),
    [saveQuote, deleteQuote, syncFromStorage]
  );

  return (
    <QuotesDataContext.Provider value={data}>
      <QuotesActionsContext.Provider value={actions}>
        {children}
      </QuotesActionsContext.Provider>
    </QuotesDataContext.Provider>
  );
}

export function useQuotes(): QuotesContextValue {
  const data = useContext(QuotesDataContext);
  const actions = useContext(QuotesActionsContext);
  if (!data || !actions) {
    throw new Error("useQuotes must be used within a <QuotesProvider>");
  }
  return useMemo(() => ({ ...data, ...actions }), [data, actions]);
}

/** Actions only — stable reference, does NOT rerender when quotes change. */
export function useQuotesActions(): QuotesActionsValue {
  const ctx = useContext(QuotesActionsContext);
  if (!ctx) {
    throw new Error("useQuotesActions must be used within a <QuotesProvider>");
  }
  return ctx;
}