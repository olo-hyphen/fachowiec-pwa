import { useState, useEffect } from "react";
import { getJobs } from "@/lib/storage";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import { pl } from "date-fns/locale";

interface Job {
  id: string;
  title: string;
  scheduled_date: string | null;
  status: string;
  priority: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchJobs();
  }, [currentDate]);

  const fetchJobs = async () => {
    try {
      const allJobs = await getJobs();
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const filteredJobs = allJobs.filter((job: any) => {
        if (!job.scheduled_date) return false;
        const jobDate = new Date(job.scheduled_date);
        return jobDate >= start && jobDate <= end;
      });

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => 
      job.scheduled_date && isSameDay(new Date(job.scheduled_date), date)
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: any = {
      low: "bg-blue-500/20 text-blue-600",
      medium: "bg-yellow-500/20 text-yellow-600",
      high: "bg-orange-500/20 text-orange-600",
      urgent: "bg-red-500/20 text-red-600"
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "border-l-yellow-500",
      "in-progress": "border-l-blue-500",
      completed: "border-l-green-500",
      cancelled: "border-l-red-500"
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-24">
      <div className="container mx-auto p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Kalendarz
              </h1>
              <p className="text-muted-foreground mt-1">Plan prac i terminów</p>
            </div>
          </div>
        </div>

        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">
                {format(currentDate, "LLLL yyyy", { locale: pl })}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Dziś
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"].map((day) => (
                <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: (startOfMonth(currentDate).getDay() + 6) % 7 }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {days.map((day) => {
                const dayJobs = getJobsForDate(day);
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 rounded-lg border-2 transition-all hover-scale
                      ${isToday ? "border-primary bg-primary/10" : "border-border"}
                      ${isSelected ? "ring-2 ring-primary" : ""}
                      ${dayJobs.length > 0 ? "bg-secondary/50" : ""}
                    `}
                  >
                    <div className="flex flex-col h-full">
                      <span className={`text-sm ${isToday ? "font-bold text-primary" : ""}`}>
                        {format(day, "d")}
                      </span>
                      <div className="flex-1 flex flex-col gap-1 mt-1">
                        {dayJobs.slice(0, 2).map((job) => (
                          <div
                            key={job.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${getPriorityColor(job.priority)}`}
                            title={job.title}
                          >
                            {job.title}
                          </div>
                        ))}
                        {dayJobs.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{dayJobs.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedDate && (
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>
                Zlecenia na {format(selectedDate, "dd MMMM yyyy", { locale: pl })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getJobsForDate(selectedDate).map((job) => (
                  <div
                    key={job.id}
                    className={`p-4 rounded-lg border-l-4 bg-secondary/20 ${getStatusColor(job.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{job.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{job.status}</Badge>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {getJobsForDate(selectedDate).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Brak zleceń na ten dzień
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
