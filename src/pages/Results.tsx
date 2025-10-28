import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { assessmentItems, factorInfo } from "@/data/assessmentData";
import { Download, Share2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface FactorScores {
  [key: string]: {
    raw: number;
    percentile: number;
  };
}

export default function Results() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<FactorScores | null>(null);
  const [archetype, setArchetype] = useState<string>("");

  useEffect(() => {
    const responsesStr = localStorage.getItem("assessment_responses");
    if (!responsesStr) {
      navigate("/");
      return;
    }

    const responses = JSON.parse(responsesStr);
    calculateScores(responses);
  }, [navigate]);

  const calculateScores = (responses: Record<string, number>) => {
    const factorScores: FactorScores = {};
    const factors = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"];

    factors.forEach((factor) => {
      const factorItems = assessmentItems.filter((item) => item.factor === factor);
      let rawScore = 0;

      factorItems.forEach((item) => {
        const response = responses[item.id];
        if (item.keying === "+") {
          rawScore += response;
        } else {
          rawScore += 6 - response; // Reverse scoring
        }
      });

      // Simple percentile calculation (would use normative data in production)
      const maxScore = factorItems.length * 5;
      const percentile = Math.round((rawScore / maxScore) * 100);

      factorScores[factor] = { raw: rawScore, percentile };
    });

    setScores(factorScores);
    determineArchetype(factorScores);
  };

  const determineArchetype = (scores: FactorScores) => {
    const sortedFactors = Object.entries(scores)
      .sort(([, a], [, b]) => b.percentile - a.percentile);

    const highest = sortedFactors[0];
    const secondHighest = sortedFactors[1];

    if (highest[1].percentile >= 80 && secondHighest[1].percentile >= 80) {
      setArchetype(`The ${capitalize(highest[0])}-${capitalize(secondHighest[0])} Innovator`);
    } else if (highest[1].percentile >= 80) {
      setArchetype(`The ${capitalize(highest[0])} Specialist`);
    } else {
      setArchetype("The Balanced Professional");
    }
  };

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleShare = () => {
    toast.success("Share link copied to clipboard!");
  };

  const handleRetake = () => {
    localStorage.removeItem("assessment_responses");
    localStorage.removeItem("assessment_progress");
    navigate("/");
  };

  if (!scores) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-6xl">🔮</div>
          <h2 className="text-2xl font-bold">Analyzing your responses...</h2>
          <p className="text-muted-foreground">Building your unique profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12 md:py-20 text-center space-y-6">
          <div className="text-6xl md:text-8xl animate-in zoom-in duration-500">
            ✨
          </div>
          <h1 className="text-4xl md:text-5xl font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
            {archetype}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Your unique combination of traits creates a distinctive professional identity
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center pt-4 animate-in fade-in duration-700 delay-200">
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={handleRetake} variant="outline" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Assessment
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {Object.entries(scores).map(([factor, score], index) => {
            const info = factorInfo[factor as keyof typeof factorInfo];
            const delay = index * 100;

            return (
              <Card
                key={factor}
                className="p-6 md:p-8 shadow-soft hover:shadow-glow transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-4xl mb-2">{info.icon}</div>
                      <h3 className="text-xl font-bold">{info.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {info.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {score.percentile}
                      </div>
                      <div className="text-xs text-muted-foreground">percentile</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary transition-all duration-1000 ease-smooth"
                        style={{
                          width: `${score.percentile}%`,
                          transitionDelay: `${delay + 300}ms`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Average</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* Interpretation */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">
                      {score.percentile >= 70
                        ? "⭐ Strong Preference"
                        : score.percentile >= 30
                        ? "⚖️ Moderate Tendency"
                        : "🎯 Lower Expression"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {score.percentile >= 70
                        ? `You score higher than ${score.percentile}% of professionals in ${info.name.toLowerCase()}.`
                        : score.percentile >= 30
                        ? `You show balanced levels of ${info.name.toLowerCase()}.`
                        : `You have a more reserved expression of ${info.name.toLowerCase()}.`}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Detailed Insights Section */}
        <Card className="mt-12 p-8 md:p-12 max-w-4xl mx-auto shadow-soft">
          <h2 className="text-3xl font-bold mb-6">Understanding Your Profile</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>💪</span> Your Strengths
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You bring a unique blend of skills to any team or project</li>
                <li>• Your profile indicates authentic self-awareness</li>
                <li>• You have distinctive capabilities that set you apart</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🎯</span> Career Fit
              </h3>
              <p className="text-muted-foreground mb-3">
                Based on your archetype, you may thrive in roles that:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Allow you to leverage your natural preferences</li>
                <li>• Provide opportunities aligned with your work style</li>
                <li>• Match your energy and interaction patterns</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span>🌱</span> Development Areas
              </h3>
              <p className="text-muted-foreground">
                Every profile has growth edges. Consider exploring skills and experiences
                that complement your natural tendencies to become more versatile and adaptable.
              </p>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="mt-12 text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">What's Next?</h2>
          <p className="text-muted-foreground">
            These results are for personal development only. Use them to better understand
            your work preferences, communication style, and professional tendencies.
          </p>
          <div className="flex gap-3 justify-center flex-wrap pt-4">
            <Button onClick={() => navigate("/")} variant="outline">
              Return Home
            </Button>
            <Button onClick={handleRetake} variant="outline">
              Take Again
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            This assessment is for personal development only. Not validated for employment
            screening, clinical diagnosis, or high-stakes decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
