import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";



actor {
  type Category = {
    #Behavioral;
    #Technical;
    #Situational;
  };

  type Question = {
    id : Nat;
    category : Category;
    text : Text;
  };

  type Answer = {
    questionId : Nat;
    response : Text;
    score : Int;
    feedback : Text;
    tips : Text;
    flow : Int;
    pacing : Int;
    confidence : Int;
  };

  type Session = {
    id : Nat;
    startTime : ?Time.Time;
    endTime : ?Time.Time;
    questions : [Nat];
    answers : [Answer];
    isActive : Bool;
  };

  let questions = Map.empty<Nat, Question>();
  let sessions = Map.empty<Nat, Session>();
  var currentSessionId = 0;
  var userName = "";

  func getNextId() : Nat {
    let id = currentSessionId;
    currentSessionId += 1;
    id;
  };

  func randomQuestionId() : Nat {
    Int.abs(Time.now() / 1000) % questions.size();
  };

  func getIdFromQuestion(question : Question) : Nat {
    question.id;
  };

  public shared ({ caller }) func upsertQuestion(question : Question) : async () {
    questions.add(question.id, question);
  };

  public query ({ caller }) func fetchQuestion(id : Nat) : async ?Question {
    questions.get(id);
  };

  public query ({ caller }) func fetchAllQuestions() : async [Question] {
    questions.values().toArray();
  };

  public shared ({ caller }) func createSession() : async Nat {
    let id = getNextId();
    let session : Session = {
      id;
      startTime = null;
      endTime = null;
      questions = [];
      answers = [];
      isActive = true;
    };
    sessions.add(id, session);
    id;
  };

  public shared ({ caller }) func startSession(id : Nat) : async () {
    switch (sessions.get(id)) {
      case (null) { Runtime.trap("Session not found!") };
      case (?session) {
        sessions.add(
          id,
          {
            session with
            startTime = ?Time.now();
            isActive = true;
          },
        );
      };
    };
  };

  public shared ({ caller }) func submitAnswer(sessionId : Nat, answer : Answer) : async () {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found!") };
      case (?session) {
        sessions.add(
          sessionId,
          {
            session with
            answers = session.answers.concat([answer]);
          },
        );
      };
    };
  };

  public shared ({ caller }) func completeSession(id : Nat) : async () {
    switch (sessions.get(id)) {
      case (null) { Runtime.trap("Session not found!") };
      case (?session) {
        sessions.add(
          id,
          {
            session with
            endTime = ?Time.now();
            isActive = false;
          },
        );
      };
    };
  };

  public query ({ caller }) func getSession(id : Nat) : async ?Session {
    sessions.get(id);
  };

  public query ({ caller }) func findUpcomingQuestionId(category : Category) : async Nat {
    let randomId = randomQuestionId();
    switch (questions.get(randomId)) {
      case (null) { Runtime.trap("No questions available") };
      case (?question) { question.id };
    };
  };

  public shared ({ caller }) func setUserName(name : Text) : async () {
    userName := name;
  };

  public query ({ caller }) func countQuestionsByCategory(category : Category) : async Nat {
    let filteredQuestions = questions.filter(
      func(_id, question) {
        question.category == category;
      }
    );
    filteredQuestions.size();
  };

  public query ({ caller }) func getQuestionsByCategory(category : Category) : async [Nat] {
    questions.values().map(func(q) { q.id }).toArray();
  };

  public query ({ caller }) func fetchAllSessions() : async [Session] {
    sessions.values().toArray();
  };
};
