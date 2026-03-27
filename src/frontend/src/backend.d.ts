import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Answer {
    flow: bigint;
    tips: string;
    feedback: string;
    score: bigint;
    response: string;
    questionId: bigint;
    confidence: bigint;
    pacing: bigint;
}
export interface Session {
    id: bigint;
    startTime?: Time;
    endTime?: Time;
    answers: Array<Answer>;
    isActive: boolean;
    questions: Array<bigint>;
}
export interface Question {
    id: bigint;
    text: string;
    category: Category;
}
export type Time = bigint;
export enum Category {
    Technical = "Technical",
    Situational = "Situational",
    Behavioral = "Behavioral"
}
export interface backendInterface {
    completeSession(id: bigint): Promise<void>;
    countQuestionsByCategory(category: Category): Promise<bigint>;
    createSession(): Promise<bigint>;
    fetchAllQuestions(): Promise<Array<Question>>;
    fetchAllSessions(): Promise<Array<Session>>;
    fetchQuestion(id: bigint): Promise<Question | null>;
    findUpcomingQuestionId(category: Category): Promise<bigint>;
    getQuestionsByCategory(category: Category): Promise<Array<bigint>>;
    getSession(id: bigint): Promise<Session | null>;
    setUserName(name: string): Promise<void>;
    startSession(id: bigint): Promise<void>;
    submitAnswer(sessionId: bigint, answer: Answer): Promise<void>;
    upsertQuestion(question: Question): Promise<void>;
}
