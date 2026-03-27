import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Play, Search } from "lucide-react";
import { useState } from "react";
import { Category, type Question } from "../backend";
import { useFetchAllQuestions } from "../hooks/useQueries";

const DIFFICULTY_MAP: Record<string, { label: string; class: string }> = {
  easy: { label: "Easy", class: "bg-green-100 text-green-700" },
  medium: { label: "Medium", class: "bg-yellow-100 text-yellow-700" },
  hard: { label: "Hard", class: "bg-red-100 text-red-700" },
};

function getDifficulty(q: Question): string {
  // Heuristic based on question length
  const len = q.text.length;
  if (len < 80) return "easy";
  if (len < 150) return "medium";
  return "hard";
}

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1n,
    text: "Tell me about yourself and your professional background.",
    category: Category.Behavioral,
  },
  {
    id: 2n,
    text: "Describe a time when you had to overcome a significant challenge at work.",
    category: Category.Behavioral,
  },
  {
    id: 3n,
    text: "Where do you see yourself in 5 years?",
    category: Category.Behavioral,
  },
  {
    id: 4n,
    text: "Explain the difference between REST and GraphQL APIs.",
    category: Category.Technical,
  },
  {
    id: 5n,
    text: "How would you design a scalable URL shortening service like bit.ly?",
    category: Category.Technical,
  },
  {
    id: 6n,
    text: "Describe your experience with CI/CD pipelines and DevOps practices.",
    category: Category.Technical,
  },
  {
    id: 7n,
    text: "How would you handle a situation where your manager asks you to implement a solution you disagree with?",
    category: Category.Situational,
  },
  {
    id: 8n,
    text: "Describe a scenario where you had to balance multiple high-priority tasks under tight deadlines.",
    category: Category.Situational,
  },
  {
    id: 9n,
    text: "What would you do if you discovered a critical bug 2 hours before a product launch?",
    category: Category.Situational,
  },
];

interface LibraryProps {
  onPracticeQuestion: (id: bigint) => void;
}

export default function Library({ onPracticeQuestion }: LibraryProps) {
  const { data: questions = [], isLoading } = useFetchAllQuestions();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const displayQuestions = questions.length > 0 ? questions : SAMPLE_QUESTIONS;

  const filtered = displayQuestions.filter((q) => {
    const matchCategory =
      activeTab === "all" ||
      q.category.toLowerCase() === activeTab.toLowerCase();
    const matchSearch =
      !searchQuery || q.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const tabs = [
    { value: "all", label: "All Questions" },
    { value: "behavioral", label: "Behavioral" },
    { value: "technical", label: "Technical" },
    { value: "situational", label: "Situational" },
  ];

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Question Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and practice from {displayQuestions.length} interview questions
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="library.search_input"
            placeholder="Search questions..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-5">
        <TabsList className="bg-muted">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              data-ocid={`library.${tab.value}.tab`}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div data-ocid="library.questions.loading_state" className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="library.questions.empty_state"
          className="text-center py-16"
        >
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No questions found</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="library.questions.list">
          {filtered.map((question, i) => {
            const diff = getDifficulty(question);
            const diffMeta = DIFFICULTY_MAP[diff];
            return (
              <Card
                key={question.id.toString()}
                data-ocid={`library.questions.item.${i + 1}`}
                className="shadow-card hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffMeta.class}`}
                        >
                          {diffMeta.label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {question.text}
                      </p>
                    </div>
                    <Button
                      data-ocid={`library.practice.button.${i + 1}`}
                      size="sm"
                      variant="outline"
                      onClick={() => onPracticeQuestion(question.id)}
                      className="flex-shrink-0 text-xs"
                    >
                      <Play className="w-3 h-3 mr-1.5" />
                      Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
