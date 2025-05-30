import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, History, BrainCircuit } from "lucide-react";
import { TimelineEvent } from "@/types";
import AIHistoryTimeline from "@/components/ai-history/AiHistoryTimeline";
import StyleSelector from "@/components/ai-history/StyleSelector";
import { generateAITimeline } from "@/services/ai-service";
import { HistoricEventController } from "@/controllers/HistoricEventController";

const AIHistoryMode = () => {
  const navigate = useNavigate();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [generatedEvents, setGeneratedEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [eventsCount, setEventsCount] = useState<number>(8);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [allEvents, setAllEvents] = useState<TimelineEvent[]>([]);
  const [allMusicStyles, setAllMusicStyles] = useState<string[]>([]);

  // Fetch all events and music styles from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventController = new HistoricEventController();
        const response = await eventController.getAllEvents();

        if (response.error) {
          console.error("Error fetching events:", response.error);
          return;
        }

        if (response.data) {
          setAllEvents(response.data);

          // Extract unique music styles
          const styles = new Set<string>();
          response.data.forEach(event => {
            event.style.forEach(style => styles.add(style));
          });
          setAllMusicStyles(Array.from(styles));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Generate timeline events based on selected styles
  const generateAITimelineEvents = async () => {
    setIsLoading(true);

    try {
      const response = await generateAITimeline({
        musicStyles: selectedStyles,
        count: eventsCount,
        allEvents: allEvents,
      });

      setGeneratedEvents(response.selectedEvents);
    } catch (error) {
      console.error("Error generating AI timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset styles and regenerate timeline
  const handleReset = () => {
    setSelectedStyles([]);
    setEventsCount(8);
    setGeneratedEvents([]);
  };

  // Generate timeline on first load
  useEffect(() => {
    if (allEvents.length > 0) {
      generateAITimelineEvents();
    }
  }, [allEvents]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Full Timeline
        </Button>
        <h1 className="text-2xl font-bold text-center flex items-center gap-2">
          <BrainCircuit className="text-cuba-blue" />
          AI History Mode
        </h1>
        <div className="w-24" /> {/* Empty space for balance */}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold">Generate Your Curated History Timeline</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">AI Processing:</span>
            <Button
              variant="outline"
              size="sm"
              className={`px-3 py-1 h-8 ${aiEnabled ? "bg-cuba-blue text-white" : "bg-gray-100"}`}
              onClick={() => setAiEnabled(!aiEnabled)}
            >
              {aiEnabled ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Music Styles:</label>
            <StyleSelector
              allStyles={allMusicStyles}
              selectedStyles={selectedStyles}
              onChange={setSelectedStyles}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Events: {eventsCount}
            </label>
            <Slider
              value={[eventsCount]}
              min={4}
              max={12}
              step={1}
              onValueChange={value => setEventsCount(value[0])}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={generateAITimelineEvents}
              className="flex-1 bg-cuba-blue hover:bg-cuba-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>Generate Timeline</>
              )}
            </Button>

            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-subtle text-center">
            <div className="w-16 h-16 border-4 border-cuba-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">AI is curating historical events...</p>
            <p className="text-sm text-gray-500 mt-2">
              Finding the most significant moments in Cuban music history
            </p>
          </div>
        </div>
      ) : generatedEvents.length > 0 ? (
        <AIHistoryTimeline events={generatedEvents} />
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p>Select your preferences and generate a timeline</p>
        </div>
      )}
    </div>
  );
};

export default AIHistoryMode;
