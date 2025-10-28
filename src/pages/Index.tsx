import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, Clock, Lock, Users, Sparkles, TrendingUp } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [hasProgress, setHasProgress] = useState(false);

  useEffect(() => {
    const progress = localStorage.getItem("assessment_progress");
    setHasProgress(!!progress);
  }, []);

  const handleStart = () => {
    navigate("/assessment");
  };

  const handleResume = () => {
    navigate("/assessment");
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Science-Backed Framework",
      description: "Based on the Big Five personality model with decades of research",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "12 Minutes",
      description: "Quick yet comprehensive assessment of your work personality",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "100% Private",
      description: "Your responses are confidential and never shared",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Personalized Insights",
      description: "Discover your unique professional archetype and strengths",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero overflow-responsive">
      {/* Hero Section */}
      <section className="container mx-auto px-3 py-8 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center animate-in zoom-in duration-500">
            <div className="text-5xl sm:text-6xl md:text-8xl">🧭</div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 px-2">
            Discover Your
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Professional Identity
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 px-4">
            A science-backed assessment to understand how you thrive at work, collaborate with others, and build your career
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center pt-4 animate-in fade-in duration-700 delay-200 px-4">
            {hasProgress ? (
              <>
                <Button onClick={handleResume} size="lg" className="w-full sm:w-auto gap-2 shadow-glow text-base">
                  Resume Assessment
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button onClick={handleStart} variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  Start Over
                </Button>
              </>
            ) : (
              <Button onClick={handleStart} size="lg" className="w-full sm:w-auto gap-2 shadow-glow text-base">
                Start Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 pt-6 md:pt-8 text-sm animate-in fade-in duration-700 delay-300">
            <div className="text-center px-2">
              <div className="font-bold text-xl md:text-2xl text-primary">60</div>
              <div className="text-muted-foreground text-xs md:text-sm">Questions</div>
            </div>
            <div className="text-center px-2">
              <div className="font-bold text-xl md:text-2xl text-primary">12</div>
              <div className="text-muted-foreground text-xs md:text-sm">Minutes</div>
            </div>
            <div className="text-center px-2">
              <div className="font-bold text-xl md:text-2xl text-primary">5</div>
              <div className="text-muted-foreground text-xs md:text-sm">Dimensions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-3 py-8 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-4 md:p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-primary mb-3 md:mb-4 text-2xl md:text-3xl">{feature.icon}</div>
              <h3 className="font-semibold mb-2 text-base md:text-lg">{feature.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-3 py-8 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 px-2">
            How It Works
          </h2>

          <div className="space-y-6 md:space-y-8">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Answer 60 Questions",
                description: "Rate statements about your work behavior on a 1-5 scale based on how you actually are, not how you wish to be.",
              },
              {
                step: "2",
                icon: "🔮",
                title: "Get Your Profile",
                description: "Receive detailed insights across five key dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability.",
              },
              {
                step: "3",
                icon: "🎯",
                title: "Discover Your Archetype",
                description: "Learn your professional identity archetype based on your unique combination of traits and preferences.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="p-4 md:p-6 lg:p-8 shadow-soft animate-in fade-in slide-in-from-left duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-start">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg md:text-xl">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-2xl md:text-3xl mb-2">{item.icon}</div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="container mx-auto px-3 py-8 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12 px-2">
            What You'll Discover
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                icon: <Users className="h-5 w-5 md:h-6 md:w-6" />,
                title: "Your Work Style",
                items: [
                  "How you prefer to interact with colleagues",
                  "Your approach to tasks and projects",
                  "What energizes vs. drains you",
                ],
              },
              {
                icon: <TrendingUp className="h-5 w-5 md:h-6 md:w-6" />,
                title: "Career Insights",
                items: [
                  "Roles that match your preferences",
                  "Team dynamics that suit you",
                  "Growth opportunities aligned with your traits",
                ],
              },
              {
                icon: <Sparkles className="h-5 w-5 md:h-6 md:w-6" />,
                title: "Your Strengths",
                items: [
                  "Natural talents and capabilities",
                  "Signature ways you add value",
                  "How you solve problems",
                ],
              },
              {
                icon: <Brain className="h-5 w-5 md:h-6 md:w-6" />,
                title: "Development Areas",
                items: [
                  "Blind spots to be aware of",
                  "Skills to complement your style",
                  "Ways to become more versatile",
                ],
              },
            ].map((section, index) => (
              <Card
                key={index}
                className="p-4 md:p-6 shadow-soft animate-in fade-in zoom-in duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-primary mb-3 md:mb-4">{section.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                      <span className="text-primary mt-1 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-3 py-8 md:py-20">
        <Card className="max-w-3xl mx-auto p-6 md:p-8 lg:p-12 text-center shadow-soft bg-gradient-card">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Begin?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who've gained clarity about their work style and career path
          </p>
          <Button onClick={handleStart} size="lg" className="gap-2 shadow-glow text-base w-full sm:w-auto">
            Start Your Assessment
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Legal Disclaimer */}
      <section className="container mx-auto px-3 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-4 md:p-6 bg-muted/50 border-muted">
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              <strong>Important Notice:</strong> This assessment is designed for personal development and self-discovery only. 
              It is not validated for employment screening, clinical diagnosis, or high-stakes decision-making. 
              Results reflect self-reported preferences at a single point in time and should be interpreted as one 
              data point among many in understanding your professional identity. Consult qualified professionals 
              for career counseling or psychological evaluation.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-8 md:mt-12 py-6 md:py-8">
        <div className="container mx-auto px-3 text-center space-y-3 md:space-y-4">
          <p className="text-xs md:text-sm text-muted-foreground">
            Professional Identity Compass • Science-Backed Career Assessment
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-primary transition-colors">About the Research</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
