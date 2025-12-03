import { AppLayout } from "@/components/layout/app-layout";
import { Calendar, Clock, School, Plus, Pencil, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getKidsEvents, createKidsEvent, updateKidsEvent, deleteKidsEvent } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { KidsEvent, InsertKidsEvent } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, parseISO, isPast, isToday, isTomorrow } from "date-fns";

export default function KidsEvents() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<KidsEvent | null>(null);
  
  const [formData, setFormData] = useState<InsertKidsEvent>({
    title: "",
    childName: null,
    eventDate: "",
    eventTime: null,
    location: null,
    description: null,
    source: "manual",
  });

  const { data: events = [] } = useQuery({
    queryKey: ["kids-events"],
    queryFn: getKidsEvents,
  });

  const createMutation = useMutation({
    mutationFn: createKidsEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kids-events"] });
      toast({ title: "Event added" });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertKidsEvent> }) =>
      updateKidsEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kids-events"] });
      toast({ title: "Event updated" });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteKidsEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kids-events"] });
      toast({ title: "Event deleted" });
    },
  });

  const resetForm = () => {
    setFormData({ title: "", childName: null, eventDate: "", eventTime: null, location: null, description: null, source: "manual" });
    setEditingEvent(null);
    setIsOpen(false);
  };

  const handleEdit = (event: KidsEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      childName: event.childName,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      location: event.location,
      description: event.description,
      source: event.source,
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getEventStatus = (dateStr: string) => {
    const eventDate = parseISO(dateStr);
    if (isToday(eventDate)) return { label: "Today", color: "bg-blue-100 text-blue-700" };
    if (isTomorrow(eventDate)) return { label: "Tomorrow", color: "bg-amber-100 text-amber-700" };
    if (isPast(eventDate)) return { label: "Past", color: "bg-slate-100 text-slate-500" };
    return { label: "Upcoming", color: "bg-green-100 text-green-700" };
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Kids' School Events</h1>
            <p className="text-slate-500 mt-1">Track school events, field trips, and important dates</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full" disabled>
              <Mail className="mr-2 h-4 w-4" /> Sync from Gmail
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full" onClick={() => { setEditingEvent(null); resetForm(); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEvent ? "Edit Event" : "Add School Event"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Parent-Teacher Conference"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Child Name</Label>
                      <Input
                        value={formData.childName || ""}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value || null })}
                        placeholder="Emma"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value || null })}
                        placeholder="School Gym"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={formData.eventTime || ""}
                        onChange={(e) => setFormData({ ...formData, eventTime: e.target.value || null })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                      placeholder="Additional details..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingEvent ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {events.map((event) => {
            const status = getEventStatus(event.eventDate);
            return (
              <div
                key={event.id}
                className="glass-card p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <School className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{event.title}</h3>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", status.color)}>{status.label}</span>
                    </div>
                    {event.childName && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">For: {event.childName}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(parseISO(event.eventDate), "EEEE, MMMM d, yyyy")}
                      </span>
                      {event.eventTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.eventTime}
                        </span>
                      )}
                    </div>
                    {event.location && (
                      <p className="text-sm text-slate-500 mt-1">Location: {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{event.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(event.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="glass-card p-12 rounded-2xl text-center">
              <School className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No events yet</h3>
              <p className="text-sm text-slate-500 mt-1">Add school events manually or sync from your Gmail</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
