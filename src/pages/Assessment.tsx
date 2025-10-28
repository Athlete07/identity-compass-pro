import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentQuestion } from "@/components/AssessmentQuestion";
import { assessmentItems } from "@/data/assessmentData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";

export default function Assessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem("assessment_progress");
    if (saved) {
      const data = JSON.parse(saved);
      setResponses(data.responses);
      setCurrentQuestion(data.currentQuestion);
    }
  }, []);

  useEffect(() => {
    // Save progress
    localStorage.setItem(
      "assessment_progress",
      JSON.stringify({ responses, currentQuestion })
    );
  }, [responses, currentQuestion]);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") {
        handleAnswer(parseInt(e.key));
      } else if (e.key === "ArrowLeft" && currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      } else if (e.key === "ArrowRight" && responses[assessmentItems[currentQuestion].id]) {
        handleNext();
      } else if (e.key === "Escape") {
        setIsPaused(!isPaused);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestion, responses, isPaused]);

  const handleAnswer = (value: number) => {
    const newResponses = {
      ...responses,
      [assessmentItems[currentQuestion].id]: value,
    };
    setResponses(newResponses);

    // Auto-advance after a brief delay
    setTimeout(() => {
      if (currentQuestion < assessmentItems.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete(newResponses);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < assessmentItems.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (Object.keys(responses).length === assessmentItems.length) {
      handleComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleComplete = (finalResponses: Record<string, number>) => {
    localStorage.setItem("assessment_responses", JSON.stringify(finalResponses));
    localStorage.removeItem("assessment_progress");
    navigate("/results");
  };

  const currentItem = assessmentItems[currentQuestion];
  const selectedValue = responses[currentItem.id];

  if (isPaused) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-6xl">⏸️</div>
          <h2 className="text-3xl font-bold">Assessment Paused</h2>
          <p className="text-muted-foreground">
            Take a moment to breathe. Your progress is automatically saved.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setIsPaused(false)}
              size="lg"
              className="w-full"
            >
              Continue Assessment
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Save & Exit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Professional Identity Compass
          </h1>
          <Button
            onClick={() => setIsPaused(true)}
            variant="outline"
            size="sm"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-16">
        <AssessmentQuestion
          questionNumber={currentQuestion + 1}
          totalQuestions={assessmentItems.length}
          question={currentItem.text}
          onAnswer={handleAnswer}
          selectedValue={selectedValue}
        />

        {/* Navigation */}
        <div className="max-w-3xl mx-auto mt-8 flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentQuestion === assessmentItems.length - 1 &&
          Object.keys(responses).length === assessmentItems.length ? (
            <Button
              onClick={() => handleComplete(responses)}
              size="lg"
              className="gap-2"
            >
              View Results
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="outline"
              disabled={!selectedValue}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
