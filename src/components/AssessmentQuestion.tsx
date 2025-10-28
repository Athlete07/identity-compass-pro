import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AssessmentQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  onAnswer: (value: number) => void;
  selectedValue?: number;
}

const likertOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export function AssessmentQuestion({
  questionNumber,
  totalQuestions,
  question,
  onAnswer,
  selectedValue,
}: AssessmentQuestionProps) {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-primary transition-all duration-500 ease-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 md:p-12 shadow-soft border-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 leading-relaxed">
          {question}
        </h2>

        {/* Likert Scale Options */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 md:gap-4">
          {likertOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onAnswer(option.value)}
              className={cn(
                "group relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300",
                "hover:scale-105 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedValue === option.value
                  ? "border-primary bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border-border bg-card hover:border-primary/50"
              )}
              aria-label={`${option.label} - ${option.value} out of 5`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={cn(
                  "text-3xl md:text-4xl font-bold transition-colors",
                  selectedValue === option.value ? "text-primary-foreground" : "text-primary"
                )}>
                  {option.value}
                </div>
                <div className={cn(
                  "text-xs md:text-sm font-medium text-center transition-colors",
                  selectedValue === option.value ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {option.label}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Keyboard Hint */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Press 1-5 on your keyboard or tap an option
        </p>
      </Card>
    </div>
  );
}
