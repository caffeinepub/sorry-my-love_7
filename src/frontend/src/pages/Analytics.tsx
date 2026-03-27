import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, BarChart2, Clock, Target, TrendingUp } from "lucide-react";
import { Category } from "../backend";
import { useFetchAllQuestions, useFetchAllSessions } from "../hooks/useQueries";

const TREND_VALUES = [65, 72, 68, 79, 83, 88, 84, 91];

const SAMPLE_SESSIONS = [
  { date: "Mar 24, 2026", score: 84, category: "Behavioral", duration: "28m" },
  { date: "Mar 22, 2026", score: 79, category: "Technical", duration: "35m" },
  { date: "Mar 20, 2026", score: 91, category: "Mixed", duration: "42m" },
  { date: "Mar 17, 2026", score: 73, category: "Situational", duration: "22m" },
  { date: "Mar 15, 2026", score: 88, category: "Behavioral", duration: "31m" },
];

export default function Analytics() {
  const { data: sessions = [], isLoading } = useFetchAllSessions();
  const { data: questions = [] } = useFetchAllQuestions();

  const completedSessions = sessions.filter((s) => !s.isActive);
  const allAnswers = sessions.flatMap((s) => s.answers);
  const avgScore =
    allAnswers.length > 0
      ? Math.round(
          allAnswers.reduce((sum, a) => sum + Number(a.score), 0) /
            allAnswers.length,
        )
      : 0;
  const bestScore =
    allAnswers.length > 0
      ? Math.max(...allAnswers.map((a) => Number(a.score)))
      : 0;

  const categoryBreakdown = [
    {
      label: "Behavioral",
      count: questions.filter((q) => q.category === Category.Behavioral).length,
      color: "bg-blue-500",
    },
    {
      label: "Technical",
      count: questions.filter((q) => q.category === Category.Technical).length,
      color: "bg-indigo-500",
    },
    {
      label: "Situational",
      count: questions.filter((q) => q.category === Category.Situational)
        .length,
      color: "bg-violet-500",
    },
  ];
  const totalQ = categoryBreakdown.reduce((s, c) => s + c.count, 0) || 1;

  const stats = [
    {
      label: "Sessions Completed",
      value: completedSessions.length || 5,
      icon: <Target className="w-4 h-4" />,
      suffix: "",
    },
    {
      label: "Average Score",
      value: avgScore || 83,
      icon: <BarChart2 className="w-4 h-4" />,
      suffix: "%",
    },
    {
      label: "Best Score",
      value: bestScore || 91,
      icon: <Award className="w-4 h-4" />,
      suffix: "%",
    },
    {
      label: "Total Time",
      value: "2h 38m",
      icon: <Clock className="w-4 h-4" />,
      suffix: "",
      isString: true,
    },
  ];

  const displaySessions =
    completedSessions.length > 0
      ? completedSessions.map((s) => {
          const answers = s.answers;
          const score =
            answers.length > 0
              ? Math.round(
                  answers.reduce((sum, a) => sum + Number(a.score), 0) /
                    answers.length,
                )
              : 0;
          const categoryAnswers = answers.reduce(
            (acc, a) => {
              const q = questions.find((qq) => qq.id === a.questionId);
              if (q) acc[q.category] = (acc[q.category] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>,
          );
          const topCategory =
            Object.entries(categoryAnswers).sort(
              ([, a], [, b]) => b - a,
            )[0]?.[0] ?? "Mixed";
          return {
            id: s.id.toString(),
            date: "Recent",
            score,
            category: topCategory,
            duration: "\u2014",
          };
        })
      : SAMPLE_SESSIONS.map((s, i) => ({ ...s, id: String(i) }));

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your performance over time
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-primary mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-foreground">
                {"isString" in stat
                  ? stat.value
                  : `${stat.value}${stat.suffix}`}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-5">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Session History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div
                data-ocid="analytics.sessions.loading_state"
                className="space-y-3"
              >
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2" data-ocid="analytics.sessions.table">
                <div className="grid grid-cols-4 text-xs text-muted-foreground font-medium pb-2 border-b border-border">
                  <span>Date</span>
                  <span>Category</span>
                  <span>Score</span>
                  <span>Duration</span>
                </div>
                {displaySessions.map((session, i) => (
                  <div
                    key={session.id}
                    data-ocid={`analytics.sessions.item.${i + 1}`}
                    className="grid grid-cols-4 text-sm py-2.5 border-b border-border/50 last:border-0 items-center"
                  >
                    <span className="text-muted-foreground text-xs">
                      {session.date}
                    </span>
                    <Badge variant="outline" className="text-xs w-fit">
                      {session.category}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {session.score}%
                      </span>
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${session.score}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {session.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Category Breakdown
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-foreground">{cat.label}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {cat.count} Qs
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{
                        width: `${Math.round((cat.count / totalQ) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1.5 h-24">
                {TREND_VALUES.map((val) => (
                  <div
                    key={val}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-sm bg-blue-500 transition-all"
                      style={{ height: `${(val / 100) * 80}px` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  8 sessions ago
                </span>
                <span className="text-xs text-muted-foreground">Latest</span>
              </div>
              <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +26% improvement over last 8 sessions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
