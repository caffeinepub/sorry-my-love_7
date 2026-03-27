import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Target,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Category } from "../backend";
import {
  useCompleteSession,
  useCreateSession,
  useFetchAllQuestions,
  useFetchAllSessions,
  useGetSession,
  useSubmitAnswer,
} from "../hooks/useQueries";

interface DashboardProps {
  userName: string;
  onStartSession: (id: bigint) => void;
  onResume: (id: bigint) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const SAMPLE_FEEDBACK = [
  {
    metric: "Overall Flow",
    score: 82,
    color: "bg-blue-500",
  },
  {
    metric: "Pacing",
    score: 75,
    color: "bg-indigo-500",
  },
  {
    metric: "Confidence",
    score: 88,
    color: "bg-violet-500",
  },
];

export default function Dashboard({
  userName,
  onStartSession,
  onResume,
}: DashboardProps) {
  const { data: sessions = [] } = useFetchAllSessions();
  const { data: questions = [] } = useFetchAllQuestions();
  const createSession = useCreateSession();
  const completeSession = useCompleteSession();
  const submitAnswer = useSubmitAnswer();

  const activeSession = sessions.find((s) => s.isActive);
  const [activeSessionId, setActiveSessionId] = useState<bigint | null>(
    activeSession?.id ?? null,
  );
  const { data: sessionData } = useGetSession(activeSessionId);

  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<
    typeof SAMPLE_FEEDBACK | null
  >(null);

  useEffect(() => {
    if (activeSession) {
      setActiveSessionId(activeSession.id);
      setIsTimerRunning(true);
    }
  }, [activeSession]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentQuestionIds = sessionData?.questions ?? [];
  const currentQuestionId = currentQuestionIds[currentQuestionIndex] ?? null;
  const currentQuestion =
    questions.find((q) => q.id === currentQuestionId) ?? null;

  const handleStartNew = useCallback(async () => {
    const id = await createSession.mutateAsync();
    setActiveSessionId(id);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setAnswerText("");
    setCurrentQuestionIndex(0);
    onStartSession(id);
  }, [createSession, onStartSession]);

  const handleResume = useCallback(() => {
    if (activeSession) {
      onResume(activeSession.id);
    }
  }, [activeSession, onResume]);

  const handleStop = useCallback(async () => {
    if (!activeSessionId) return;
    setIsTimerRunning(false);
    await completeSession.mutateAsync(activeSessionId);
    setActiveSessionId(null);
    setTimerSeconds(0);
    setAnswerText("");
  }, [activeSessionId, completeSession]);

  const handleSubmitAnswer = useCallback(async () => {
    if (!activeSessionId || !currentQuestionId || !answerText.trim()) return;
    const wordCount = answerText.trim().split(/\s+/).length;
    const flowScore = BigInt(Math.min(100, 50 + wordCount));
    const pacingScore = BigInt(Math.min(100, 60 + Math.floor(wordCount / 2)));
    const confidenceScore = BigInt(Math.min(100, 55 + wordCount));
    const overallScore = BigInt(
      Math.round(
        (Number(flowScore) + Number(pacingScore) + Number(confidenceScore)) / 3,
      ),
    );
    await submitAnswer.mutateAsync({
      sessionId: activeSessionId,
      answer: {
        questionId: currentQuestionId,
        response: answerText,
        flow: flowScore,
        pacing: pacingScore,
        confidence: confidenceScore,
        score: overallScore,
        feedback:
          wordCount > 50
            ? "Well-structured answer with good depth. Consider adding specific examples."
            : "Try to expand your answer with more detail and concrete examples.",
        tips: "Use the STAR method (Situation, Task, Action, Result) to structure behavioral answers effectively.",
      },
    });
    setLastFeedback([
      {
        metric: "Overall Flow",
        score: Number(flowScore),
        color: "bg-blue-500",
      },
      { metric: "Pacing", score: Number(pacingScore), color: "bg-indigo-500" },
      {
        metric: "Confidence",
        score: Number(confidenceScore),
        color: "bg-violet-500",
      },
    ]);
    setAnswerText("");
    setTimerSeconds(0);
    setCurrentQuestionIndex((prev) => prev + 1);
  }, [activeSessionId, currentQuestionId, answerText, submitAnswer]);

  // Stats
  const completedSessions = sessions.filter((s) => !s.isActive).length;
  const allAnswers = sessions.flatMap((s) => s.answers);
  const avgScore =
    allAnswers.length > 0
      ? Math.round(
          allAnswers.reduce((sum, a) => sum + Number(a.score), 0) /
            allAnswers.length,
        )
      : 0;
  const behavioralQ = questions.filter(
    (q) => q.category === Category.Behavioral,
  ).length;
  const technicalQ = questions.filter(
    (q) => q.category === Category.Technical,
  ).length;
  const situationalQ = questions.filter(
    (q) => q.category === Category.Situational,
  ).length;
  const totalQ = behavioralQ + technicalQ + situationalQ || 1;

  const feedbackData = lastFeedback ?? SAMPLE_FEEDBACK;
  const lastSession = sessions
    .filter((s) => !s.isActive)
    .sort((a, b) => Number(b.id) - Number(a.id))[0];
  const lastSessionAnswers = lastSession?.answers ?? [];
  const lastSessionScore =
    lastSessionAnswers.length > 0
      ? Math.round(
          lastSessionAnswers.reduce((sum, a) => sum + Number(a.score), 0) /
            lastSessionAnswers.length,
        )
      : 0;

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          AI Interview Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your progress and practice daily
        </p>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5">
        {/* PRIMARY COLUMN */}
        <div className="flex flex-col gap-5">
          {/* Welcome Banner */}
          <div
            className="rounded-lg p-5 text-banner-foreground"
            style={{ background: "oklch(var(--banner))" }}
          >
            <p className="text-xs font-medium opacity-75 mb-1">Welcome back</p>
            <h2 className="text-xl font-bold mb-3">{userName} 👋</h2>
            <p className="text-sm opacity-85 mb-4">
              You've completed {completedSessions} sessions. Keep up the great
              work!
            </p>
            <div className="flex gap-3">
              <Button
                data-ocid="dashboard.start_session.primary_button"
                onClick={handleStartNew}
                disabled={createSession.isPending}
                className="bg-white text-foreground hover:bg-white/90 text-sm font-semibold h-9 px-4 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Start New Session
              </Button>
              {activeSession && (
                <Button
                  data-ocid="dashboard.resume_session.secondary_button"
                  onClick={handleResume}
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/20 hover:text-white text-sm h-9 px-4"
                >
                  Resume Last Session
                </Button>
              )}
            </div>
          </div>

          {/* Two-card row */}
          <div className="grid grid-cols-2 gap-5">
            {/* Practice Session Card */}
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">
                    Practice Session
                  </CardTitle>
                  {isTimerRunning && (
                    <Badge
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(var(--recording-bg))",
                        color: "oklch(var(--recording-fg))",
                        border: "none",
                      }}
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
                        style={{ background: "oklch(var(--recording-fg))" }}
                      />
                      Recording
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeSessionId && currentQuestion ? (
                  <>
                    <div className="bg-muted rounded-md p-3">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">
                        Q{currentQuestionIndex + 1}:
                      </p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {currentQuestion.text}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-foreground">
                        {formatTime(timerSeconds)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          data-ocid="dashboard.stop.button"
                          size="sm"
                          variant="outline"
                          onClick={handleStop}
                          className="h-7 px-2.5 text-xs"
                        >
                          <Square className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                        <Button
                          data-ocid="dashboard.pause.button"
                          size="sm"
                          variant="outline"
                          onClick={() => setIsTimerRunning((v) => !v)}
                          className="h-7 px-2.5 text-xs"
                        >
                          <Pause className="w-3 h-3 mr-1" />
                          {isTimerRunning ? "Pause" : "Resume"}
                        </Button>
                        <Button
                          data-ocid="dashboard.restart.button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setTimerSeconds(0);
                            setAnswerText("");
                          }}
                          className="h-7 px-2.5 text-xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      data-ocid="dashboard.answer.textarea"
                      placeholder="Type your answer here..."
                      className="text-sm min-h-[80px] resize-none"
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                    />
                    <Button
                      data-ocid="dashboard.submit_answer.primary_button"
                      onClick={handleSubmitAnswer}
                      disabled={submitAnswer.isPending || !answerText.trim()}
                      className="w-full h-8 text-xs font-semibold bg-primary text-primary-foreground"
                    >
                      Submit Answer
                    </Button>
                  </>
                ) : (
                  <div
                    data-ocid="dashboard.session.empty_state"
                    className="py-8 text-center"
                  >
                    <Mic className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No active session
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Start a new session to begin practicing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Feedback Panel */}
            <Card className="shadow-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  AI Feedback Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2.5">
                  {feedbackData.map((item) => (
                    <div key={item.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium">
                          {item.metric}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            item.color,
                          )}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted rounded-md p-3">
                  <p className="text-xs text-foreground leading-relaxed">
                    {lastFeedback
                      ? "Good effort! Your answer showed clear structure. Try to incorporate more specific examples to strengthen your response."
                      : "Complete a practice session to receive personalized AI feedback on your answers."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1.5">
                    Answer Tips
                  </p>
                  <ul className="space-y-1">
                    <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      Use the STAR method for behavioral questions
                    </li>
                    <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      Keep answers to 2–3 minutes
                    </li>
                    <li className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      Pause before answering to organize thoughts
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT RAIL */}
        <div className="flex flex-col gap-5">
          {/* Overall Progress */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Overall Progress
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-bold text-foreground">
                  {avgScore || 68}
                </span>
                <span className="text-lg text-muted-foreground mb-1">%</span>
              </div>
              <Progress value={avgScore || 68} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">
                {completedSessions} sessions completed
              </p>
            </CardContent>
          </Card>

          {/* Performance Analytics */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-3xl font-bold text-foreground">
                  {lastSessionScore > 0
                    ? (lastSessionScore / 10).toFixed(1)
                    : "8.2"}
                </span>
                <span className="text-sm text-muted-foreground">/10</span>
              </div>
              {[
                { label: "Communication", val: 84 },
                { label: "Technical", val: 72 },
                { label: "Problem Solving", val: 91 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-xs font-semibold">{item.val}%</span>
                  </div>
                  <Progress value={item.val} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Question Categories */}
          <Card className="shadow-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Categories
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  label: "Behavioral",
                  count: behavioralQ || 12,
                  total: totalQ || 30,
                  color: "bg-blue-500",
                },
                {
                  label: "Technical",
                  count: technicalQ || 10,
                  total: totalQ || 30,
                  color: "bg-indigo-500",
                },
                {
                  label: "Situational",
                  count: situationalQ || 8,
                  total: totalQ || 30,
                  color: "bg-violet-500",
                },
              ].map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {cat.label}
                    </span>
                    <span className="text-xs font-semibold">
                      {cat.count}/{cat.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", cat.color)}
                      style={{
                        width: `${Math.round((cat.count / cat.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
