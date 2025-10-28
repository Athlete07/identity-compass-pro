import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { assessmentItems, factorInfo } from "@/data/assessmentData";
import { Download, Share2, RotateCcw, Brain, Target, Users, TrendingUp, Lightbulb, CheckCircle, Star, Award, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";

interface FactorScores {
  [key: string]: {
    raw: number;
    percentile: number;
    interpretation: string;
    strengths: string[];
    developmentAreas: string[];
    performanceLevel: string;
  };
}

interface ArchetypeProfile {
  name: string;
  description: string;
  primaryStrengths: string[];
  workStyle: string;
  idealRoles: string[];
  careerAdvice: string;
  developmentFocus: string;
  keyCharacteristics: string[];
  learningPreferences: string[];
}

export default function Results() {
  const navigate = useNavigate();
  const [scores, setScores] = useState<FactorScores | null>(null);
  const [archetype, setArchetype] = useState<ArchetypeProfile | null>(null);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [performanceInsights, setPerformanceInsights] = useState<string[]>([]);

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

      // Accurate percentile calculation
      const maxScore = factorItems.length * 5;
      const minScore = factorItems.length * 1;
      const percentile = Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100);
      
      // Ensure percentile is between 0 and 100
      const clampedPercentile = Math.max(0, Math.min(100, percentile));

      factorScores[factor] = { 
        raw: rawScore, 
        percentile: clampedPercentile,
        interpretation: getInterpretation(clampedPercentile),
        strengths: getStrengths(factor, clampedPercentile),
        developmentAreas: getDevelopmentAreas(factor, clampedPercentile),
        performanceLevel: getPerformanceLevel(clampedPercentile)
      };
    });

    setScores(factorScores);
    const archetypeProfile = determineArchetype(factorScores);
    setArchetype(archetypeProfile);
    
    // Calculate overall score
    const totalPercentile = Object.values(factorScores).reduce((sum, score) => sum + score.percentile, 0);
    const avgScore = Math.round(totalPercentile / factors.length);
    setOverallScore(avgScore);
    
    // Generate performance insights
    setPerformanceInsights(generatePerformanceInsights(factorScores, avgScore));
  };

  const getInterpretation = (percentile: number): string => {
    if (percentile >= 85) return "Exceptional";
    if (percentile >= 70) return "High";
    if (percentile >= 50) return "Moderate";
    if (percentile >= 30) return "Developing";
    return "Emerging";
  };

  const getPerformanceLevel = (percentile: number): string => {
    if (percentile >= 85) return "Expert Level";
    if (percentile >= 70) return "Advanced";
    if (percentile >= 50) return "Proficient";
    if (percentile >= 30) return "Developing";
    return "Foundation";
  };

  const getStrengths = (factor: string, percentile: number): string[] => {
    if (percentile < 50) return [];
    
    const strengthMap: Record<string, string[]> = {
      openness: [
        "Creative problem-solving",
        "Adaptability to change",
        "Innovative thinking",
        "Openness to new ideas",
        "Abstract reasoning"
      ],
      conscientiousness: [
        "Reliability and dependability",
        "Strong organizational skills",
        "Goal-oriented approach",
        "Attention to detail",
        "Self-discipline"
      ],
      extraversion: [
        "Natural leadership ability",
        "Strong communication skills",
        "Team collaboration",
        "Networking and relationship building",
        "Energy and enthusiasm"
      ],
      agreeableness: [
        "Team player mentality",
        "Conflict resolution skills",
        "Empathetic communication",
        "Collaborative approach",
        "Trust and cooperation"
      ],
      stability: [
        "Stress resilience",
        "Emotional composure",
        "Consistent performance",
        "Calm under pressure",
        "Mental stability"
      ]
    };
    
    return strengthMap[factor] || [];
  };

  const getDevelopmentAreas = (factor: string, percentile: number): string[] => {
    if (percentile >= 50) return [];
    
    const developmentMap: Record<string, string[]> = {
      openness: [
        "Embrace new challenges",
        "Try different approaches",
        "Seek diverse perspectives",
        "Experiment with creative solutions",
        "Develop curiosity"
      ],
      conscientiousness: [
        "Improve time management",
        "Develop planning skills",
        "Enhance attention to detail",
        "Build consistent routines",
        "Strengthen follow-through"
      ],
      extraversion: [
        "Practice public speaking",
        "Engage more in team discussions",
        "Build networking skills",
        "Develop leadership presence",
        "Increase social confidence"
      ],
      agreeableness: [
        "Learn to say no when needed",
        "Develop assertiveness",
        "Balance collaboration with independence",
        "Practice constructive feedback",
        "Build healthy boundaries"
      ],
      stability: [
        "Develop stress management techniques",
        "Build emotional resilience",
        "Practice mindfulness",
        "Improve work-life balance",
        "Strengthen coping strategies"
      ]
    };
    
    return developmentMap[factor] || [];
  };

  const generatePerformanceInsights = (scores: FactorScores, overallScore: number): string[] => {
    const insights: string[] = [];
    const sortedFactors = Object.entries(scores).sort(([, a], [, b]) => b.percentile - a.percentile);
    
    // Top strength insight
    const [topFactor, topScore] = sortedFactors[0];
    insights.push(`Your strongest area is ${factorInfo[topFactor as keyof typeof factorInfo].name.toLowerCase()} (${topScore.percentile}%), indicating ${topScore.interpretation.toLowerCase()} capabilities.`);
    
    // Performance consistency
    const scoreRange = Math.max(...Object.values(scores).map(s => s.percentile)) - Math.min(...Object.values(scores).map(s => s.percentile));
    if (scoreRange < 20) {
      insights.push("You demonstrate remarkable consistency across all personality dimensions, showing a well-balanced professional profile.");
    } else if (scoreRange > 40) {
      insights.push("Your profile shows distinct strengths and development areas, creating a unique professional signature.");
    }
    
    // Overall performance level
    if (overallScore >= 80) {
      insights.push("Your overall professional profile indicates exceptional potential for leadership and high-impact roles.");
    } else if (overallScore >= 60) {
      insights.push("You have a strong professional foundation with clear areas of excellence and growth opportunities.");
    } else {
      insights.push("Your profile shows significant potential for development, with many opportunities to build expertise and confidence.");
    }
    
    return insights;
  };

  const determineArchetype = (scores: FactorScores): ArchetypeProfile => {
    const sortedFactors = Object.entries(scores)
      .sort(([, a], [, b]) => b.percentile - a.percentile);

    const [highestFactor, highestScore] = sortedFactors[0];
    const [secondFactor, secondScore] = sortedFactors[1];
    const [lowestFactor, lowestScore] = sortedFactors[sortedFactors.length - 1];

    // Determine archetype based on score patterns
    if (highestScore.percentile >= 80 && secondScore.percentile >= 70) {
      return getDualStrengthArchetype(highestFactor, secondFactor, scores);
    } else if (highestScore.percentile >= 80) {
      return getSingleStrengthArchetype(highestFactor, scores);
    } else if (lowestScore.percentile <= 30) {
      return getBalancedArchetype(scores);
    } else {
      return getModerateArchetype(scores);
    }
  };

  const getDualStrengthArchetype = (factor1: string, factor2: string, scores: FactorScores): ArchetypeProfile => {
    const archetypes: Record<string, ArchetypeProfile> = {
      "openness-conscientiousness": {
        name: "The Strategic Innovator",
        description: "You combine creative thinking with systematic execution, making you an ideal leader for complex projects that require both innovation and reliability.",
        primaryStrengths: ["Creative problem-solving", "Systematic planning", "Innovation management", "Project leadership", "Strategic thinking"],
        workStyle: "You thrive in roles that allow you to design new solutions while maintaining high standards of execution.",
        idealRoles: ["Product Manager", "Innovation Director", "Strategic Consultant", "R&D Manager", "Creative Director"],
        careerAdvice: "Focus on roles that bridge creative and operational functions. Your ability to both ideate and execute makes you valuable in leadership positions.",
        developmentFocus: "Continue developing your ability to communicate complex ideas and manage diverse teams.",
        keyCharacteristics: ["Visionary", "Detail-oriented", "Results-driven", "Creative", "Organized"],
        learningPreferences: ["Hands-on projects", "Cross-functional teams", "Innovation challenges", "Strategic planning"]
      },
      "extraversion-conscientiousness": {
        name: "The Dynamic Organizer",
        description: "You excel at leading teams while maintaining high standards and organization, making you a natural fit for management and leadership roles.",
        primaryStrengths: ["Team leadership", "Project management", "Communication", "Goal achievement", "People development"],
        workStyle: "You work best in collaborative environments where you can lead teams toward clear, well-defined objectives.",
        idealRoles: ["Operations Manager", "Team Lead", "Program Director", "Executive", "Department Head"],
        careerAdvice: "Pursue leadership roles that allow you to both manage people and drive results. Your combination of social skills and organization is highly valued.",
        developmentFocus: "Develop advanced leadership skills and strategic thinking capabilities.",
        keyCharacteristics: ["Charismatic", "Organized", "Goal-oriented", "People-focused", "Results-driven"],
        learningPreferences: ["Leadership programs", "Team management", "Strategic planning", "Public speaking"]
      },
      "openness-extraversion": {
        name: "The Creative Connector",
        description: "You bring fresh ideas and energy to teams, excelling in roles that require both innovation and collaboration.",
        primaryStrengths: ["Creative thinking", "Team collaboration", "Idea generation", "Communication", "Innovation"],
        workStyle: "You thrive in dynamic, creative environments where you can share ideas and work with diverse teams.",
        idealRoles: ["Creative Director", "Marketing Manager", "Innovation Lead", "Consultant", "Brand Manager"],
        careerAdvice: "Focus on roles that value creativity and collaboration. Your ability to generate and share innovative ideas is your key strength.",
        developmentFocus: "Develop skills in project management and strategic thinking to complement your creative abilities.",
        keyCharacteristics: ["Innovative", "Collaborative", "Energetic", "Creative", "Communicative"],
        learningPreferences: ["Creative workshops", "Team projects", "Design thinking", "Innovation labs"]
      }
    };

    const key = `${factor1}-${factor2}`;
    const reverseKey = `${factor2}-${factor1}`;
    
    return archetypes[key] || archetypes[reverseKey] || getSingleStrengthArchetype(factor1, scores);
  };

  const getSingleStrengthArchetype = (factor: string, scores: FactorScores): ArchetypeProfile => {
    const archetypes: Record<string, ArchetypeProfile> = {
      openness: {
        name: "The Creative Visionary",
        description: "You excel at thinking outside the box and bringing innovative solutions to complex problems.",
        primaryStrengths: ["Creative problem-solving", "Innovation", "Adaptability", "Abstract thinking", "Curiosity"],
        workStyle: "You work best in flexible environments that encourage experimentation and creative thinking.",
        idealRoles: ["Designer", "Researcher", "Innovation Specialist", "Creative Consultant", "Artist"],
        careerAdvice: "Seek roles that value creativity and innovation. Your ability to see possibilities others miss is your greatest asset.",
        developmentFocus: "Develop practical implementation skills to complement your creative vision.",
        keyCharacteristics: ["Imaginative", "Curious", "Flexible", "Original", "Open-minded"],
        learningPreferences: ["Creative courses", "Experimental projects", "Design thinking", "Innovation workshops"]
      },
      conscientiousness: {
        name: "The Reliable Achiever",
        description: "You are highly organized, dependable, and excel at delivering consistent, high-quality results.",
        primaryStrengths: ["Reliability", "Organization", "Attention to detail", "Goal achievement", "Self-discipline"],
        workStyle: "You work best in structured environments where you can plan and execute tasks systematically.",
        idealRoles: ["Project Manager", "Operations Specialist", "Quality Assurance", "Administrative Lead", "Compliance Officer"],
        careerAdvice: "Focus on roles that value reliability and precision. Your consistent performance makes you invaluable to any organization.",
        developmentFocus: "Develop leadership skills to manage others while maintaining your high standards.",
        keyCharacteristics: ["Dependable", "Organized", "Thorough", "Persistent", "Methodical"],
        learningPreferences: ["Project management", "Process improvement", "Quality systems", "Leadership training"]
      },
      extraversion: {
        name: "The Dynamic Leader",
        description: "You excel at energizing teams, communicating effectively, and driving collaborative success.",
        primaryStrengths: ["Leadership", "Communication", "Team building", "Networking", "Motivation"],
        workStyle: "You thrive in people-oriented roles where you can inspire and motivate others.",
        idealRoles: ["Sales Manager", "Team Lead", "Public Relations", "Executive", "Event Coordinator"],
        careerAdvice: "Pursue leadership roles that leverage your natural ability to connect with and motivate people.",
        developmentFocus: "Develop strategic thinking and analytical skills to complement your people skills.",
        keyCharacteristics: ["Charismatic", "Energetic", "Persuasive", "Social", "Inspiring"],
        learningPreferences: ["Leadership programs", "Public speaking", "Team building", "Networking events"]
      },
      agreeableness: {
        name: "The Collaborative Partner",
        description: "You excel at building relationships, resolving conflicts, and creating harmonious team environments.",
        primaryStrengths: ["Team collaboration", "Conflict resolution", "Empathy", "Relationship building", "Trust"],
        workStyle: "You work best in collaborative environments where teamwork and mutual support are valued.",
        idealRoles: ["HR Specialist", "Team Coordinator", "Customer Success", "Mediator", "Community Manager"],
        careerAdvice: "Focus on roles that require strong interpersonal skills and team collaboration.",
        developmentFocus: "Develop assertiveness and decision-making skills to balance collaboration with leadership.",
        keyCharacteristics: ["Empathetic", "Cooperative", "Trustworthy", "Supportive", "Diplomatic"],
        learningPreferences: ["Communication skills", "Conflict resolution", "Team dynamics", "Emotional intelligence"]
      },
      stability: {
        name: "The Steady Performer",
        description: "You maintain composure under pressure and provide consistent, reliable performance in challenging situations.",
        primaryStrengths: ["Stress resilience", "Consistent performance", "Emotional stability", "Calm under pressure", "Reliability"],
        workStyle: "You work best in roles that require steady, reliable performance, especially under pressure.",
        idealRoles: ["Crisis Manager", "Operations Specialist", "Quality Control", "Support Specialist", "Risk Manager"],
        careerAdvice: "Seek roles that value stability and reliability, especially in high-pressure environments.",
        developmentFocus: "Develop leadership and communication skills to share your calm approach with others.",
        keyCharacteristics: ["Calm", "Resilient", "Stable", "Dependable", "Composed"],
        learningPreferences: ["Stress management", "Leadership skills", "Communication", "Mindfulness"]
      }
    };

    return archetypes[factor] || getBalancedArchetype(scores);
  };

  const getBalancedArchetype = (scores: FactorScores): ArchetypeProfile => {
    return {
      name: "The Balanced Professional",
      description: "You demonstrate a well-rounded approach to work, with moderate strengths across multiple areas and the flexibility to adapt to different situations.",
      primaryStrengths: ["Adaptability", "Versatility", "Balanced perspective", "Team player", "Reliability"],
      workStyle: "You work well in diverse environments and can adapt your approach based on the situation and team needs.",
      idealRoles: ["General Manager", "Consultant", "Project Coordinator", "Team Member", "Operations Manager"],
      careerAdvice: "Your balanced profile makes you valuable in many different roles. Focus on developing deeper expertise in areas that interest you most.",
      developmentFocus: "Identify 1-2 areas where you'd like to develop stronger expertise to complement your balanced foundation.",
      keyCharacteristics: ["Adaptable", "Versatile", "Balanced", "Reliable", "Flexible"],
      learningPreferences: ["Cross-functional training", "General management", "Diverse projects", "Skill development"]
    };
  };

  const getModerateArchetype = (scores: FactorScores): ArchetypeProfile => {
    return {
      name: "The Developing Professional",
      description: "You show potential across multiple areas with room for growth. This is common for early-career professionals or those in transition.",
      primaryStrengths: ["Growth potential", "Learning ability", "Adaptability", "Openness to development", "Resilience"],
      workStyle: "You work best in supportive environments that provide learning opportunities and mentorship.",
      idealRoles: ["Junior Specialist", "Trainee", "Support Role", "Entry-level Position", "Apprentice"],
      careerAdvice: "Focus on building expertise in 1-2 key areas. Seek mentorship and learning opportunities to accelerate your development.",
      developmentFocus: "Identify your top 2-3 areas for development and create a structured plan to build expertise in those areas.",
      keyCharacteristics: ["Eager to learn", "Adaptable", "Resilient", "Open-minded", "Motivated"],
      learningPreferences: ["Mentorship programs", "Skill-building courses", "Hands-on training", "Professional development"]
    };
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

  if (!scores || !archetype) {
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
    <div className="min-h-screen bg-gradient-hero overflow-responsive">
      {/* Hero Section */}
      <section className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-3 py-8 md:py-12 lg:py-20 text-center space-y-4 md:space-y-6">
          <div className="text-5xl md:text-6xl lg:text-8xl animate-in zoom-in duration-500">
            ✨
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold animate-in fade-in slide-in-from-bottom-4 duration-700 px-2">
            {archetype.name}
          </h1>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 px-4 leading-relaxed">
            {archetype.description}
          </p>
          
          {/* Overall Score */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
              <Award className="w-4 h-4" />
              Overall Score: {overallScore}%
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 justify-center pt-4 animate-in fade-in duration-700 delay-200 px-4">
            <Button onClick={handleShare} variant="outline" className="gap-2 w-full sm:w-auto text-sm">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={handleRetake} variant="outline" className="gap-2 w-full sm:w-auto text-sm">
              <RotateCcw className="h-4 w-4" />
              Retake Assessment
            </Button>
            <Button className="gap-2 w-full sm:w-auto text-sm">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <main className="container mx-auto px-3 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
          {Object.entries(scores).map(([factor, score], index) => {
            const info = factorInfo[factor as keyof typeof factorInfo];
            const delay = index * 100;

            return (
              <Card
                key={factor}
                className="p-4 md:p-6 lg:p-8 shadow-soft hover:shadow-glow transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${delay}ms` }}
              >
                <div className="space-y-3 md:space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-3xl md:text-4xl mb-2">{info.icon}</div>
                      <h3 className="text-lg md:text-xl font-bold">{info.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed">
                        {info.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl md:text-3xl font-bold text-primary">
                        {score.percentile}
                      </div>
                      <div className="text-xs text-muted-foreground">percentile</div>
                      <div className="text-xs font-medium text-primary mt-1">
                        {score.interpretation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {score.performanceLevel}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="h-2 md:h-3 bg-muted rounded-full overflow-hidden">
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

                  {/* Strengths */}
                  {score.strengths.length > 0 && (
                    <div className="pt-3 md:pt-4 border-t">
                      <h4 className="text-xs md:text-sm font-semibold mb-2 text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Your Strengths
                      </h4>
                      <ul className="space-y-1">
                        {score.strengths.map((strength, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Development Areas */}
                  {score.developmentAreas.length > 0 && (
                    <div className="pt-3 md:pt-4 border-t">
                      <h4 className="text-xs md:text-sm font-semibold mb-2 text-orange-600 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Development Areas
                      </h4>
                      <ul className="space-y-1">
                        {score.developmentAreas.map((area, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Performance Insights */}
        <Card className="mt-8 md:mt-12 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto shadow-soft">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Performance Insights
          </h2>
          
          <div className="space-y-4">
            {performanceInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <Star className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Archetype Profile Section */}
        <Card className="mt-8 md:mt-12 p-4 md:p-8 lg:p-12 max-w-4xl mx-auto shadow-soft">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{archetype.name}</h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {archetype.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Primary Strengths */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2 text-green-600">
                <Brain className="w-5 h-5" />
                Your Primary Strengths
              </h3>
              <ul className="space-y-2">
                {archetype.primaryStrengths.map((strength, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Work Style */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2 text-blue-600">
                <Users className="w-5 h-5" />
                Your Work Style
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {archetype.workStyle}
              </p>
            </div>

            {/* Ideal Roles */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2 text-purple-600">
                <Target className="w-5 h-5" />
                Ideal Career Roles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {archetype.idealRoles.map((role, i) => (
                  <div key={i} className="bg-primary/5 text-primary px-3 py-2 rounded-lg text-sm font-medium text-center">
                    {role}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Characteristics */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2 text-orange-600">
                <Award className="w-5 h-5" />
                Key Characteristics
              </h3>
              <div className="flex flex-wrap gap-2">
                {archetype.keyCharacteristics.map((characteristic, i) => (
                  <span key={i} className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                    {characteristic}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Career Advice */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              Career Advice
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {archetype.careerAdvice}
            </p>
          </div>

          {/* Development Focus */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-orange-700">
              <TrendingUp className="w-5 h-5" />
              Development Focus
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {archetype.developmentFocus}
            </p>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-orange-700">Learning Preferences:</h4>
              <div className="flex flex-wrap gap-2">
                {archetype.learningPreferences.map((preference, i) => (
                  <span key={i} className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <div className="mt-8 md:mt-12 text-center space-y-4 max-w-2xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold">What's Next?</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            These results are for personal development only. Use them to better understand
            your work preferences, communication style, and professional tendencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap pt-4">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full sm:w-auto">
              Return Home
            </Button>
            <Button onClick={handleRetake} variant="outline" className="w-full sm:w-auto">
              Take Again
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 md:mt-20 py-6 md:py-8">
        <div className="container mx-auto px-3 text-center text-xs md:text-sm text-muted-foreground">
          <p className="leading-relaxed">
            This assessment is for personal development only. Not validated for employment
            screening, clinical diagnosis, or high-stakes decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
