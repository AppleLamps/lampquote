import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { postJson } from "@/lib/api";
import { Loader2, Sparkles, Quote, Save, Copy } from "lucide-react";
import { useQuotesActions } from "@/hooks/useQuotes";
import { FileUpload, UploadedFile } from "@/components/FileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POE_TEXT_MODEL_OPTIONS } from "../../lib/poe-text-models";

/** Strip surrounding quote marks from AI-generated text. */
function sanitizeQuote(text: string) {
  if (!text) return "";
  const trimmed = text.trim();
  const pairs: [string, string][] = [
    ['"', '"'],
    ['\u201c', '\u201d'],
    ['\u00ab', '\u00bb'],
    ['\u2039', '\u203a'],
    ["'", "'"],
  ];
  for (const [open, close] of pairs) {
    if (trimmed.startsWith(open) && trimmed.endsWith(close)) {
      return trimmed.slice(open.length, trimmed.length - close.length).trim();
    }
  }
  return trimmed;
}

/** Memoized quote output card — only re-renders when the quote text changes */
const QuoteOutput = memo(function QuoteOutput({
  quote,
  onCopy,
  onSave,
}: {
  quote: string;
  onCopy: () => void;
  onSave: () => void;
}) {
  const cleaned = sanitizeQuote(quote);
  return (
    <Card variant="premium" className="relative overflow-hidden group animate-slide-in-from-bottom">
      <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-all duration-700"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-primary rounded-full shadow-glow"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-primary/5 rounded-full blur-2xl animate-float animation-delay-2000"></div>
      <CardContent className="p-16 relative z-10">
        <div className="text-center space-y-10">
          <div className="relative inline-block animate-glow-pulse">
            <Quote className="h-16 w-16 text-transparent bg-gradient-primary bg-clip-text mx-auto" />
            <div className="absolute inset-0 h-16 w-16 bg-gradient-primary opacity-20 blur-xl mx-auto"></div>
          </div>

          <blockquote className="text-3xl md:text-4xl font-playfair font-medium leading-relaxed text-foreground italic max-w-4xl mx-auto tracking-wide">
            "{cleaned}"
          </blockquote>

          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent w-64"></div>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-muted-foreground/80 font-inter font-light tracking-wide">
              Generated reflection from your content (via Poe API)
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="luxury"
                size="lg"
                onClick={onCopy}
                className="font-inter transition-all duration-300 hover:scale-105 hover:shadow-floating"
              >
                <Copy className="h-5 w-5" />
                Copy Quote
              </Button>
              <Button
                variant="luxury"
                size="lg"
                onClick={onSave}
                className="font-inter transition-all duration-300 hover:scale-105 hover:shadow-floating"
              >
                <Save className="h-5 w-5" />
                Save Quote
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function QuoteGenerator() {
  const [inputText, setInputText] = useState("");
  const [generatedQuote, setGeneratedQuote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const [additionalDirections, setAdditionalDirections] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash");
  const { toast } = useToast();
  const { saveQuote } = useQuotesActions();
  const abortRef = useRef<AbortController | null>(null);

  // Abort in-flight requests on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const generateQuote = async () => {
    if (!inputText.trim() && attachedFiles.length === 0) {
      toast({
        title: "Input Required",
        description: "Please enter some text or attach files to generate a quote from.",
        variant: "destructive",
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    try {
      const data = await postJson<{ quote?: string; error?: string }>(
        "/api/generate-quote",
        {
          text: inputText.trim(),
          files: attachedFiles,
          directions: additionalDirections.trim() || undefined,
          model: selectedModel,
        },
        controller.signal
      );

      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.quote) {
        throw new Error("No quote in response");
      }

      setGeneratedQuote(sanitizeQuote(data.quote));
      toast({
        title: "Quote Generated",
        description: "Your profound reflection has been created!",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error generating quote:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setInputText("");
    setGeneratedQuote("");
    setAttachedFiles([]);
    setAdditionalDirections("");
    setSelectedModel("gemini-3-flash");
  };

  const handleSaveQuote = useCallback(async () => {
    if (!generatedQuote) return;
    await saveQuote(generatedQuote);
  }, [generatedQuote, saveQuote]);

  const handleCopyQuote = useCallback(async () => {
    if (!generatedQuote) return;

    try {
      await navigator.clipboard.writeText(`"${sanitizeQuote(generatedQuote)}"`);
      toast({
        title: "Quote Copied",
        description: "The quote has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error copying quote:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy quote. Please try again.",
        variant: "destructive",
      });
    }
  }, [generatedQuote, toast]);

  const modelOptions = useMemo(
    () =>
      POE_TEXT_MODEL_OPTIONS.map((m) => (
        <SelectItem key={m.value} value={m.value}>
          <span className="font-medium">{m.label}</span>
          <span className="text-muted-foreground ml-2 text-sm">— {m.description}</span>
        </SelectItem>
      )),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <Card variant="floating" className="mb-12 overflow-hidden relative group animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardContent className="p-10 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="input-text" className="text-lg font-semibold text-foreground font-inter tracking-wide">
                  Share your text
                </label>
                <Textarea
                  id="input-text"
                  variant="glass"
                  placeholder="Share your thoughts, paste an article, or simply attach images to reflect upon..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed font-inter"
                  disabled={isLoading}
                />
              </div>

              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <FileUpload onFilesChange={setAttachedFiles} files={attachedFiles} disabled={isLoading} />
              </div>

              <div className="space-y-4">
                <label htmlFor="additional-directions" className="text-lg font-semibold text-foreground font-inter tracking-wide">
                  Additional directions
                  <span className="text-sm font-normal text-muted-foreground ml-2">(optional)</span>
                </label>
                <Textarea
                  id="additional-directions"
                  variant="glass"
                  placeholder="Provide specific instructions for the AI (e.g., 'Make it humorous', 'Focus on hope', 'Use a philosophical tone')..."
                  value={additionalDirections}
                  onChange={(e) => setAdditionalDirections(e.target.value)}
                  className="min-h-[100px] text-base leading-relaxed font-inter"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-4">
                <label className="text-lg font-semibold text-foreground font-inter tracking-wide">Poe model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isLoading}>
                  <SelectTrigger className="bg-card/50 border-border/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={generateQuote}
                  disabled={isLoading || (!inputText.trim() && attachedFiles.length === 0)}
                  className="min-w-[160px] h-12 text-base font-inter"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Reflecting on your words...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate Quote
                    </>
                  )}
                </Button>

                {(inputText || generatedQuote || attachedFiles.length > 0 || additionalDirections) && (
                  <Button variant="luxury" size="lg" onClick={clearAll} disabled={isLoading} className="h-12 font-inter">
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedQuote && (
          <QuoteOutput quote={generatedQuote} onCopy={handleCopyQuote} onSave={handleSaveQuote} />
        )}
      </div>

      <footer className="border-t border-glass-border bg-gradient-card/60 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-gradient-accent/10"></div>
        <div className="container mx-auto px-4 py-12 text-center relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-32"></div>
            </div>
            <p className="text-base text-muted-foreground/80 font-inter font-light tracking-wide">
              Powered by Poe • Quotes stay in this browser unless you export them
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}