import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { postJson } from "@/lib/api";
import { Loader2, Sparkles, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POE_TEXT_MODEL_OPTIONS } from "../../lib/poe-text-models";

/** Memoized prompt output card */
const PromptOutput = memo(function PromptOutput({
  prompt,
  onCopy,
}: {
  prompt: string;
  onCopy: () => void;
}) {
  return (
    <Card variant="premium" className="relative overflow-hidden group animate-slide-in-from-bottom">
      <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-all duration-700"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-primary rounded-full shadow-glow"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-primary/5 rounded-full blur-2xl animate-float animation-delay-2000"></div>
      <CardContent className="p-16 relative z-10">
        <div className="text-center space-y-10">
          <div className="relative inline-block animate-glow-pulse">
            <Sparkles className="h-16 w-16 text-transparent bg-gradient-primary bg-clip-text mx-auto" />
            <div className="absolute inset-0 h-16 w-16 bg-gradient-primary opacity-20 blur-xl mx-auto"></div>
          </div>

          <div className="text-left max-w-4xl mx-auto">
            <pre className="text-lg md:text-xl font-mono leading-relaxed text-foreground whitespace-pre-wrap font-inter">
              {prompt}
            </pre>
          </div>

          <div className="flex items-center justify-center">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent w-64"></div>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-muted-foreground/80 font-inter font-light tracking-wide">
              Grok Imagine pack — prompt, mode, and aspect ratio
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="luxury"
                size="lg"
                onClick={onCopy}
                className="font-inter transition-all duration-300 hover:scale-105 hover:shadow-floating"
              >
                <Copy className="h-5 w-5" />
                Copy output
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export function GrokImaginePromptGenerator() {
  const [inputText, setInputText] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [additionalDirections, setAdditionalDirections] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-3-flash");
  const { toast } = useToast();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const generatePrompt = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Enter an idea or editing request for Grok Imagine.",
        variant: "destructive",
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    try {
      const data = await postJson<{ prompt?: string; error?: string }>(
        "/api/generate-flux-prompt",
        {
          text: inputText.trim(),
          directions: additionalDirections.trim() || undefined,
          model: selectedModel,
        },
        controller.signal
      );

      if (data.error) {
        throw new Error(data.error);
      }
      if (!data.prompt) {
        throw new Error("No prompt in response");
      }

      setGeneratedPrompt(data.prompt);
      toast({
        title: "Pack generated",
        description: "Your Grok Imagine prompt pack is ready.",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Error generating prompt:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    abortRef.current?.abort();
    setInputText("");
    setGeneratedPrompt("");
    setAdditionalDirections("");
    setSelectedModel("gemini-3-flash");
  };

  const handleCopyPrompt = useCallback(async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast({
        title: "Copied",
        description: "Output copied to clipboard.",
      });
    } catch (error) {
      console.error("Error copying prompt:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy. Try again.",
        variant: "destructive",
      });
    }
  }, [generatedPrompt, toast]);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="relative animate-float">
              <Sparkles className="h-12 w-12 text-transparent bg-gradient-primary bg-clip-text" />
              <div className="absolute inset-0 h-12 w-12 bg-gradient-primary opacity-30 blur-xl animate-glow-pulse"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight leading-none">
              Grok Imagine Prompt
            </h1>
          </div>
          <div className="space-y-6">
            <p className="text-2xl md:text-3xl text-foreground/90 max-w-4xl mx-auto leading-relaxed font-inter font-light tracking-wide">
              Production-ready prompts for xAI Grok Imagine — mode, ratio, and copy-paste block
            </p>
            <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed font-inter font-light">
              Describe your idea or edit; get layered subject, lighting, camera, and finishing detail (via Poe)
            </p>
          </div>
        </div>

        <Card variant="floating" className="mb-12 overflow-hidden relative group animate-fade-in-up">
          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          <CardContent className="p-10 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <label htmlFor="input-text" className="text-lg font-semibold text-foreground font-inter tracking-wide">
                  Idea or editing request
                </label>
                <Textarea
                  id="input-text"
                  variant="glass"
                  placeholder="Scene, subject, style goal, or what to change on a reference image…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed font-inter"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-4">
                <label htmlFor="additional-directions" className="text-lg font-semibold text-foreground font-inter tracking-wide">
                  Extra directions
                  <span className="text-sm font-normal text-muted-foreground ml-2">(optional)</span>
                </label>
                <Textarea
                  id="additional-directions"
                  variant="glass"
                  placeholder="Aspect ratio preference, must-include details, negatives, reference strategy…"
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
                    {POE_TEXT_MODEL_OPTIONS.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        <span className="font-medium">{m.label}</span>
                        <span className="text-muted-foreground ml-2 text-sm">— {m.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={generatePrompt}
                  disabled={isLoading || !inputText.trim()}
                  className="min-w-[160px] h-12 text-base font-inter"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Generate pack
                    </>
                  )}
                </Button>

                {(inputText || generatedPrompt || additionalDirections) && (
                  <Button variant="luxury" size="lg" onClick={clearAll} disabled={isLoading} className="h-12 font-inter">
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedPrompt && <PromptOutput prompt={generatedPrompt} onCopy={handleCopyPrompt} />}
      </div>

      <footer className="border-t border-glass-border bg-gradient-card/60 backdrop-blur-xl relative">
        <div className="absolute inset-0 bg-gradient-accent/10"></div>
        <div className="container mx-auto px-4 py-12 text-center relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-32"></div>
            </div>
            <p className="text-base text-muted-foreground/80 font-inter font-light tracking-wide">
              Powered by Poe • Outputs tuned for Grok Imagine (Speed / Quality, aspect ratio, references)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
