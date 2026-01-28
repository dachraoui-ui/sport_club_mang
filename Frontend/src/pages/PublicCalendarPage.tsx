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
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
         <Navbar />

         {/* Dynamic Background Elements */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float-slow" />
            <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-float-fast" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[120px] animate-pulse-glow" />
         </div>

         <main className="flex-1 container mx-auto px-4 py-24 space-y-12 relative z-10">
            {/* Header Section with Text Shine */}
            <div className="text-center space-y-6 animate-fade-in-up">
               <div className="inline-block relative">
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-text-shine bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary pb-2">
                     Calendrier des Activités
                  </h1>
                  <div className="absolute -top-6 -right-6 text-yellow-400 animate-bounce-gentle">
                     <CalendarDays className="w-12 h-12 drop-shadow-lg" />
                  </div>
               </div>
               <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto font-light leading-relaxed">
                  Découvrez notre planning hebdomadaire dynamique. Trouvez votre rythme, rejoignez le mouvement.
               </p>
            </div>

            {/* Filters & Navigation - Glass Effect */}
            <Card className="glass-strong border-primary/10 shadow-elevated overflow-hidden backdrop-blur-3xl animate-slide-up-fade delay-200">
               <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                     <div className="flex items-center gap-4 w-full md:w-auto p-1 bg-muted/30 rounded-2xl border border-white/10">
                        <div className="p-3 bg-white/10 rounded-xl shadow-inner">
                           <Filter className="h-6 w-6 text-primary" />
                        </div>
                        <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                           <SelectTrigger className="w-full md:w-[320px] h-12 border-0 bg-transparent focus:ring-0 text-lg font-medium">
                              <SelectValue placeholder="Filtrer par activité" />
                           </SelectTrigger>
                           <SelectContent className="glass-strong border-primary/20">
                              <SelectItem value="all" className="focus:bg-primary/20">Toutes les activités</SelectItem>
                              {activities.map((activity) => (
                                 <SelectItem key={activity.id} value={activity.id.toString()} className="focus:bg-primary/20">
                                    {activity.nom_act}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div className="flex items-center gap-6 bg-muted/40 p-2 pl-6 pr-2 rounded-2xl border border-white/10 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="text-center min-w-[200px]">
                           <p className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                              {weekDates[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                              {' - '}
                              {weekDates[5].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                           </p>
                        </div>
                        <div className="flex gap-2">
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentWeek(currentWeek - 1)}
                              className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white hover:scale-110 transition-all border-primary/20"
                           >
                              <ChevronLeft className="h-5 w-5" />
                           </Button>
                           <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentWeek(currentWeek + 1)}
                              className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white hover:scale-110 transition-all border-primary/20"
                           >
                              <ChevronRight className="h-5 w-5" />
                           </Button>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Calendar Grid - Animated Border Wrapper */}
            <div className="gradient-border-animated p-[1px] rounded-3xl shadow-2xl animate-scale-in delay-300">
               <Card className="bg-card/95 backdrop-blur-xl border-0 rounded-[calc(var(--radius)+1px)] overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                     {isLoading ? (
                        <div className="h-96 flex flex-col items-center justify-center gap-4">
                           <div className="relative w-20 h-20">
                              <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
                              <div className="absolute inset-2 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin"></div>
                           </div>
                           <p className="text-muted-foreground animate-pulse">Chargement du planning...</p>
                        </div>
                     ) : (
                        <table className="w-full min-w-[1200px] border-collapse">
                           <thead>
                              <tr className="border-b border-border/50 bg-muted/20">
                                 <th className="p-6 text-left font-bold text-muted-foreground w-32 sticky left-0 z-20 bg-background/95 backdrop-blur">
                                    <div className="flex items-center gap-3">
                                       <div className="p-2 bg-primary/10 rounded-lg">
                                          <Clock className="h-5 w-5 text-primary" />
                                       </div>
                                       <span className="text-lg">Heure</span>
                                    </div>
                                 </th>
                                 {daysOfWeek.map((day, index) => {
                                    const date = weekDates[index];
                                    const isToday = date.toDateString() === new Date().toDateString();
                                    return (
                                       <th
                                          key={day}
                                          className={cn(
                                             "p-6 text-center transition-all duration-300 relative overflow-hidden group",
                                             isToday ? "bg-primary/5" : "hover:bg-muted/30"
                                          )}
                                       >
                                          <div className={cn(
                                             "absolute top-0 left-0 w-full h-1 transition-all duration-500",
                                             isToday ? "bg-primary" : "bg-transparent group-hover:bg-primary/50"
                                          )} />
                                          <div className="flex flex-col items-center relative z-10">
                                             <span className={cn(
                                                "text-sm font-bold uppercase tracking-widest mb-2 transition-colors",
                                                isToday ? "text-primary" : "text-muted-foreground"
                                             )}>{day}</span>
                                             <span className={cn(
                                                "text-3xl font-black transition-all duration-300 transform group-hover:scale-110",
                                                isToday ? "text-primary scale-110" : "text-foreground"
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
                              {timeSlots.map((timeSlot, slotIndex) => (
                                 <tr key={timeSlot}
                                    className="border-b border-border/40 hover:bg-muted/10 transition-colors group"
                                    style={{ animationDelay: `${slotIndex * 50}ms` }}
                                 >
                                    <td className="p-4 font-semibold text-muted-foreground sticky left-0 z-10 bg-background/95 backdrop-blur group-hover:text-primary transition-colors border-r border-border/40">
                                       {timeSlot}
                                    </td>
                                    {daysOfWeek.map((_, dayIndex) => {
                                       const sessionsInSlot = getSessionsForSlot(dayIndex, timeSlot);

                                       return (
                                          <td
                                             key={dayIndex}
                                             className="p-2 align-top h-[120px] relative border-l border-border/30 transition-all duration-300 hover:bg-muted/20"
                                          >
                                             <div className="space-y-3 h-full flex flex-col justify-center">
                                                {sessionsInSlot.map((session) => (
                                                   <div
                                                      key={session.id}
                                                      className={cn(
                                                         "p-3 rounded-xl border-l-[6px] shadow-sm cursor-default relative overflow-hidden group/card transform transition-all duration-300 hover:scale-105 hover:shadow-glow-sm hover:z-20",
                                                         getActivityColor(session.activite.id),
                                                         "before:absolute before:inset-0 before:bg-white/40 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 before:z-0"
                                                      )}
                                                   >
                                                      <div className="relative z-10">
                                                         <div className="font-extrabold text-sm tracking-tight mb-1 truncate">{session.activite.nom_act}</div>
                                                         <div className="flex items-center gap-1.5 opacity-90 text-[10px] font-bold uppercase tracking-wider">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                            {session.heure_debut} - {session.heure_fin}
                                                         </div>
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
            </div>
         </main>

         <Footer />
      </div>
   );
};

export default PublicCalendarPage;
