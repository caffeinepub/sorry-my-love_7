import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Answer, Category, Question, Session } from "../backend";
import { useActor } from "./useActor";

export function useFetchAllQuestions() {
  const { actor, isFetching } = useActor();
  return useQuery<Question[]>({
    queryKey: ["questions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchAllQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFetchAllSessions() {
  const { actor, isFetching } = useActor();
  return useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.fetchAllSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSession(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Session | null>({
    queryKey: ["session", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getSession(id);
    },
    enabled: !!actor && !isFetching && id !== null,
    refetchInterval: 2000,
  });
}

export function useGetQuestionsByCategory(category: Category) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["questions-by-category", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuestionsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const id = await actor.createSession();
      await actor.startSession(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useCompleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.completeSession(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useSubmitAnswer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { sessionId: bigint; answer: Answer }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitAnswer(params.sessionId, params.answer);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session", variables.sessionId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
}

export function useSetUserName() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.setUserName(name);
    },
  });
}

export function useFetchQuestion(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Question | null>({
    queryKey: ["question", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.fetchQuestion(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}
