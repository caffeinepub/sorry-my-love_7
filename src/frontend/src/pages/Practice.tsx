import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mic,
  Play,
  Square,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend";
import {
  useCompleteSession,
  useCreateSession,
  useFetchAllQuestions,
  useGetSession,
  useSubmitAnswer,
} from "../hooks/useQueries";

interface PracticeProps {
  activeSessionId: bigint | null;
  onSessionComplete: () => void;
  onStartNew: (id: bigint) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const categoryOptions = [
  { value: Category.Behavioral, label: "Behavioral" },
  { value: Category.Technical, label: "Technical" },
  { value: Category.Situational, label: "Situational" },
  { value: "mixed", label: "Mixed" },
];

export default function Practice({
  activeSessionId,
  onSessionComplete,
  onStartNew,
}: PracticeProps) {
  const { data: questions = [] } = useFetchAllQuestions();
  const createSession = useCreateSession();
  const completeSession = useCompleteSession();
  const submitAnswer = useSubmitAnswer();

  const [selectedCategory, setSelectedCategory] = useState<string>("mixed");
  const [sessionId, setSessionId] = useState<bigint | null>(activeSessionId);
  const [isActive, setIsActive] = useState(!!activeSessionId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(!!activeSessionId);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: sessionData } = useGetSession(sessionId);

  const filteredQuestions =
    selectedCategory === "mixed"
      ? questions
      : questions.filter((q) => q.category === (selectedCategory as Category));

  const currentQuestion = filteredQuestions[currentIndex] ?? null;
  const totalQuestions = filteredQuestions.length;
  const wordCount = answerText.trim()
    ? answerText.trim().split(/\s+/).length
    : 0;

  useEffect(() => {
    if (activeSessionId) {
      setSessionId(activeSessionId);
      setIsActive(true);
      setIsTimerRunning(true);
    }
  }, [activeSessionId]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleStart = useCallback(async () => {
    const id = await createSession.mutateAsync();
    setSessionId(id);
    setIsActive(true);
    setIsTimerRunning(true);
    setCurrentIndex(0);
    setTimerSeconds(0);
    setAnswerText("");
    setSubmittedCount(0);
    setIsCompleted(false);
    onStartNew(id);
  }, [createSession, onStartNew]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!sessionId || !currentQuestion || !answerText.trim()) return;
    const wc = wordCount;
    const flowScore = BigInt(Math.min(100, 40 + wc));
    const pacingScore = BigInt(Math.min(100, 50 + Math.floor(wc / 2)));
    const confidenceScore = BigInt(Math.min(100, 45 + wc));
    const overallScore = BigInt(
      Math.round(
        (Number(flowScore) + Number(pacingScore) + Number(confidenceScore)) / 3,
      ),
    );
    await submitAnswer.mutateAsync({
      sessionId,
      answer: {
        questionId: currentQuestion.id,
        response: answerText,
        flow: flowScore,
        pacing: pacingScore,
        confidence: confidenceScore,
        score: overallScore,
        feedback:
          wc > 60
            ? "Excellent depth! Your answer covered key points effectively."
            : wc > 30
              ? "Good answer. Add 1\u20132 more specific examples to improve."
              : "Try to elaborate more. A strong answer needs at least 60 words.",
        tips: "Structure with: Context \u2192 Actions \u2192 Results for maximum impact.",
      },
    });
    setSubmittedCount((p) => p + 1);
    setAnswerText("");
    setTimerSeconds(0);
    toast.success("Answer submitted! Moving to next question.");
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      toast.success("Session complete! Great work.");
    }
  }, [
    sessionId,
    currentQuestion,
    answerText,
    wordCount,
    submitAnswer,
    currentIndex,
    totalQuestions,
  ]);

  const handleComplete = useCallback(async () => {
    if (!sessionId) return;
    setIsTimerRunning(false);
    await completeSession.mutateAsync(sessionId);
    setIsCompleted(true);
    setIsActive(false);
    toast.success("Session completed successfully!");
    setTimeout(onSessionComplete, 2000);
  }, [sessionId, completeSession, onSessionComplete]);

  if (isCompleted) {
    return (
      <div
        data-ocid="practice.success_state"
        className="max-w-lg mx-auto mt-16 text-center"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Session Complete!
        </h2>
        <p className="text-muted-foreground">
          You answered {submittedCount} questions.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="max-w-xl mx-auto mt-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Practice Interview
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Configure and start a new interview session
        </p>
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Session Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">
                Question Category
              </p>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger
                  data-ocid="practice.category.select"
                  className="w-full"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">
                Available Questions
              </p>
              <p className="text-2xl font-bold text-primary">
                {filteredQuestions.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedCategory === "mixed"
                  ? "All categories"
                  : selectedCategory}{" "}
                questions
              </p>
            </div>
            <Button
              data-ocid="practice.start.primary_button"
              onClick={handleStart}
              disabled={
                createSession.isPending || filteredQuestions.length === 0
              }
              className="w-full bg-primary text-primary-foreground font-semibold"
            >
              {createSession.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Start Interview Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Interview in Progress
          </h1>
          <p className="text-sm text-muted-foreground">
            Stay focused. Take your time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className="text-sm font-mono font-bold px-3 py-1"
            style={{
              background: "oklch(var(--recording-bg))",
              color: "oklch(var(--recording-fg))",
              border: "none",
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse"
              style={{ background: "oklch(var(--recording-fg))" }}
            />
            {formatTime(timerSeconds)}
          </Badge>
          <Button
            data-ocid="practice.complete.button"
            variant="outline"
            size="sm"
            onClick={handleComplete}
            disabled={completeSession.isPending}
          >
            <Square className="w-3.5 h-3.5 mr-1.5" />
            End Session
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>
            Question {currentIndex + 1} of {totalQuestions || "\u2014"}
          </span>
          <span>{submittedCount} answered</span>
        </div>
        <Progress
          value={totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0}
          className="h-2"
        />
      </div>

      {currentQuestion ? (
        <div className="space-y-5">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {currentQuestion.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Q{currentIndex + 1}
                  </span>
                </div>
                <Mic className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base font-medium text-foreground leading-relaxed">
                {currentQuestion.text}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Your Answer</CardTitle>
                <span className="text-xs text-muted-foreground">
                  {wordCount} words
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                data-ocid="practice.answer.textarea"
                placeholder="Type your answer here. Aim for 100\u2013200 words for a strong response..."
                className="min-h-[160px] text-sm resize-none"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    data-ocid="practice.prev.button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentIndex((p) => Math.max(0, p - 1));
                      setAnswerText("");
                      setTimerSeconds(0);
                    }}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    data-ocid="practice.skip.button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentIndex((p) =>
                        Math.min(totalQuestions - 1, p + 1),
                      );
                      setAnswerText("");
                      setTimerSeconds(0);
                    }}
                    disabled={currentIndex >= totalQuestions - 1}
                  >
                    Skip
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  data-ocid="practice.submit.primary_button"
                  onClick={handleSubmitAnswer}
                  disabled={submitAnswer.isPending || !answerText.trim()}
                  className="bg-primary text-primary-foreground font-semibold"
                >
                  {submitAnswer.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {sessionData && sessionData.answers.length > 0 && (
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Latest Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const last =
                    sessionData.answers[sessionData.answers.length - 1];
                  return (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Flow", val: Number(last.flow) },
                          { label: "Pacing", val: Number(last.pacing) },
                          { label: "Confidence", val: Number(last.confidence) },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="bg-muted rounded-md p-2.5 text-center"
                          >
                            <p className="text-xs text-muted-foreground mb-0.5">
                              {m.label}
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {m.val}%
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-foreground bg-accent/50 rounded-md p-3 leading-relaxed">
                        {last.feedback}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Tip:</span> {last.tips}
                      </p>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div
          data-ocid="practice.questions.empty_state"
          className="text-center py-16"
        >
          <p className="text-muted-foreground">
            No questions available for this category.
          </p>
          <Button variant="outline" className="mt-4" onClick={handleComplete}>
            End Session
          </Button>
        </div>
      )}
    </div>
  );
}
