import { useState, useEffect } from "react";
import { Calendar, Clock, Filter, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

// Reuse API from lib but ensure it works publicly (backend updated)
import { classSessionsAPI, activitiesAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface ClassSession {
   id: number;
   activite: {
      id: number;
      nom_act: string;
      code_act: string;
   };
   date: string;
   heure_debut: string;
   heure_fin: string;
}

interface Activity {
   id: number;
   code_act: string;
   nom_act: string;
}

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const timeSlots = [
   '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
   '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const PublicCalendarPage = () => {
   const [sessions, setSessions] = useState<ClassSession[]>([]);
   const [activities, setActivities] = useState<Activity[]>([]);
   const [selectedActivity, setSelectedActivity] = useState<string>("all");
   const [currentWeek, setCurrentWeek] = useState(0);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const loadData = async () => {
         try {
            const [sessionsData, activitiesData] = await Promise.all([
               classSessionsAPI.getAll(),
               activitiesAPI.getAll()
            ]);
            setSessions(sessionsData);
            setActivities(activitiesData);
         } catch (error) {
            console.error("Erreur de chargement", error);
         } finally {
            setIsLoading(false);
         }
      };
      loadData();
   }, []);

   const filteredSessions = sessions.filter(session => {
      return selectedActivity === "all" || session.activite.id.toString() === selectedActivity;
   });

   const getWeekDates = () => {
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));

      return daysOfWeek.map((_, index) => {
         const date = new Date(monday);
         date.setDate(monday.getDate() + index);
         return date;
      });
   };

   const weekDates = getWeekDates();

   const getSessionsForSlot = (dayIndex: number, timeSlot: string) => {
      const targetDate = weekDates[dayIndex];
      const dateStr = targetDate.toISOString().split('T')[0];

      return filteredSessions.filter(session => {
         return session.date === dateStr && session.heure_debut === timeSlot;
      });
   };

   const getActivityColor = (activityId: number) => {
      const colors = [
         'bg-blue-500/10 border-blue-500 text-blue-700',
         'bg-purple-500/10 border-purple-500 text-purple-700',
         'bg-green-500/10 border-green-500 text-green-700',
         'bg-orange-500/10 border-orange-500 text-orange-700',
         'bg-pink-500/10 border-pink-500 text-pink-700',
         'bg-cyan-500/10 border-cyan-500 text-cyan-700',
      ];
      return colors[activityId % colors.length];
   };

   return (
      <div className="min-h-screen bg-background flex flex-col">
         <Navbar />

         <main className="flex-1 container mx-auto px-4 py-24 space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div className="text-center space-y-4">
               <h1 className="text-4xl md:text-5xl font-bold gradient-text">Calendrier des Activités</h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Découvrez notre planning hebdomadaire et trouvez le créneau parfait pour votre entraînement.
               </p>
            </div>

            {/* Filters & Navigation */}
            <Card className="glass-strong border-primary/20 shadow-glow-sm overflow-hidden transform transition-all hover:scale-[1.01]">
               <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-2 bg-primary/10 rounded-lg">
                           <Filter className="h-5 w-5 text-primary" />
                        </div>
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                           <SelectTrigger className="w-full md:w-[280px] h-11">
                              <SelectValue placeholder="Filtrer par activité" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">Toutes les activités</SelectItem>
                              {activities.map((activity) => (
                                 <SelectItem key={activity.id} value={activity.id.toString()}>
                                    {activity.nom_act}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="flex items-center gap-4 bg-muted/50 p-1.5 rounded-xl">
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => setCurrentWeek(currentWeek - 1)}
                           className="hover:bg-background hover:text-primary transition-colors"
                        >
                           <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="text-center px-4 min-w-[200px]">
                           <p className="font-semibold text-lg">
                              {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                              {' - '}
                              {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                           </p>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => setCurrentWeek(currentWeek + 1)}
                           className="hover:bg-background hover:text-primary transition-colors"
                        >
                           <ChevronRight className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Calendar Grid */}
            <Card className="glass shadow-xl border-t-4 border-t-primary overflow-hidden animate-scale-in delay-200">
               <div className="overflow-x-auto">
                  {isLoading ? (
                     <div className="h-96 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                     </div>
                  ) : (
                     <table className="w-full min-w-[1000px] border-collapse">
                        <thead>
                           <tr className="border-b border-border/50">
                              <th className="p-4 text-left font-semibold text-muted-foreground w-24 bg-muted/30 sticky left-0 z-10">
                                 <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Heure
                                 </div>
                              </th>
                              {daysOfWeek.map((day, index) => {
                                 const date = weekDates[index];
                                 const isToday = date.toDateString() === new Date().toDateString();
                                 return (
                                    <th
                                       key={day}
                                       className={cn(
                                          "p-4 text-center font-semibold min-w-[160px] transition-colors",
                                          isToday ? "bg-primary/5 text-primary" : "bg-muted/30 text-muted-foreground"
                                       )}
                                    >
                                       <div className="flex flex-col items-center">
                                          <span className="text-sm uppercase tracking-wider">{day}</span>
                                          <span className={cn(
                                             "text-2xl font-bold mt-1",
                                             isToday && "text-primary"
                                          )}>
                                             {date.getDate()}
                                          </span>
                                       </div>
                                    </th>
                                 );
                              })}
                           </tr>
                        </thead>
                        <tbody>
                           {timeSlots.map((timeSlot) => (
                              <tr key={timeSlot} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                                 <td className="p-3 text-sm font-medium text-muted-foreground bg-muted/30 sticky left-0 z-10 group-hover:bg-muted/50 transition-colors">
                                    {timeSlot}
                                 </td>
                                 {daysOfWeek.map((_, dayIndex) => {
                                    const sessionsInSlot = getSessionsForSlot(dayIndex, timeSlot);

                                    return (
                                       <td
                                          key={dayIndex}
                                          className="p-1 align-top h-[100px] relative border-l border-border/30 hover:bg-muted/30 transition-colors"
                                       >
                                          <div className="space-y-2 p-1">
                                             {sessionsInSlot.map((session) => (
                                                <div
                                                   key={session.id}
                                                   className={cn(
                                                      "p-3 rounded-xl border-l-4 text-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default",
                                                      getActivityColor(session.activite.id)
                                                   )}
                                                >
                                                   <div className="font-bold">{session.activite.nom_act}</div>
                                                   <div className="flex items-center gap-2 mt-1 opacity-80 text-xs font-medium">
                                                      <Clock className="h-3 w-3" />
                                                      {session.heure_debut} - {session.heure_fin}
                                                   </div>
                                                </div>
                                             ))}
                                          </div>
                                       </td>
                                    );
                                 })}
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  )}
               </div>
            </Card>
         </main>

         <Footer />
      </div>
   );
};

export default PublicCalendarPage;
