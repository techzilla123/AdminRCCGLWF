import { useState, useEffect } from 'react';
import { eventsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ImageUpload } from './ImageUpload';
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Sunday Worship Service',
    date: '2025-01-28',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    type: 'Service',
    attendees: 234,
    description: 'Weekly worship service with communion',
    recurring: true
  },
  {
    id: 2,
    title: 'Youth Group Meeting',
    date: '2025-01-29',
    time: '6:00 PM',
    location: 'Youth Hall',
    type: 'Ministry',
    attendees: 45,
    description: 'Weekly youth group meeting with games and bible study',
    recurring: true
  },
  {
    id: 3,
    title: 'Community Outreach',
    date: '2025-02-01',
    time: '9:00 AM',
    location: 'Downtown Park',
    type: 'Outreach',
    attendees: 28,
    description: 'Food distribution and community service',
    recurring: false
  },
  {
    id: 4,
    title: 'Bible Study',
    date: '2025-02-02',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    type: 'Study',
    attendees: 67,
    description: 'Weekly Bible study - Book of Romans',
    recurring: true
  },
  {
    id: 5,
    title: 'Church Picnic',
    date: '2025-02-15',
    time: '12:00 PM',
    location: 'City Park',
    type: 'Social',
    attendees: 150,
    description: 'Annual church picnic with games and fellowship',
    recurring: false
  },
];

export function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventList, setEventList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: '',
    description: '',
    banner: '',
    attendees: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const events = await eventsAPI.getAll();
      setEventList(events);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast.error(error.message || 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location && newEvent.type) {
      try {
        const event = await eventsAPI.add({
          ...newEvent,
          attendees: 0,
          recurring: false
        });
        setEventList([...eventList, event]);
        setNewEvent({ title: '', date: '', time: '', location: '', type: '', description: '', banner: '', attendees: '' });
        setIsAddEventOpen(false);
        toast.success('Event added successfully!');
        // Reload events to update metrics
        await loadEvents();
      } catch (error: any) {
        console.error('Error adding event:', error);
        toast.error(error.message || 'Failed to add event');
      }
    }
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description,
      banner: event.banner || '',
      attendees: event.attendees?.toString() || '0'
    });
    setIsEditEventOpen(true);
  };

  const handleUpdateEvent = async () => {
    if (selectedEvent && newEvent.title && newEvent.date && newEvent.time && newEvent.location && newEvent.type) {
      try {
        const updateData = {
          ...newEvent,
          attendees: newEvent.attendees ? parseInt(newEvent.attendees) : 0
        };
        const updated = await eventsAPI.update(selectedEvent.id, updateData);
        const updatedEvents = eventList.map(event =>
          event.id === selectedEvent.id ? updated : event
        );
        setEventList(updatedEvents);
        setNewEvent({ title: '', date: '', time: '', location: '', type: '', description: '', banner: '', attendees: '' });
        setSelectedEvent(null);
        setIsEditEventOpen(false);
        toast.success('Event updated successfully!');
        // Reload events to update metrics
        await loadEvents();
      } catch (error: any) {
        console.error('Error updating event:', error);
        toast.error(error.message || 'Failed to update event');
      }
    }
  };

  const handleDeleteEvent = async () => {
    if (eventToDelete) {
      try {
        await eventsAPI.delete(eventToDelete.id);
        setEventList(eventList.filter(event => event.id !== eventToDelete.id));
        setDeleteConfirmOpen(false);
        setEventToDelete(null);
        toast.success('Event deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting event:', error);
        toast.error(error.message || 'Failed to delete event');
      }
    }
  };

  const confirmDelete = (event: any) => {
    setEventToDelete(event);
    setDeleteConfirmOpen(true);
  };

  const filteredEvents = eventList.filter(event => {
    if (selectedType === 'all') return true;
    return event.type.toLowerCase() === selectedType;
  });

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'service': return 'bg-blue-100 text-blue-800';
      case 'ministry': return 'bg-green-100 text-green-800';
      case 'outreach': return 'bg-purple-100 text-purple-800';
      case 'study': return 'bg-yellow-100 text-yellow-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate event statistics
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const eventsThisWeek = eventList.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfWeek && eventDate < endOfWeek;
  });

  const eventsThisMonth = eventList.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= startOfMonth && eventDate <= endOfMonth;
  });

  const avgAttendance = eventList.length > 0 
    ? Math.round(eventList.reduce((sum, event) => sum + (event.attendees || 0), 0) / eventList.length)
    : 0;

  const recurringEvents = eventList.filter(event => event.recurring).length;

  // Filter events based on selected date or show upcoming
  const displayedEvents = selectedDate 
    ? eventList.filter(event => {
        const eventDate = new Date(event.date);
        const selectedDateOnly = new Date(selectedDate);
        selectedDateOnly.setHours(0, 0, 0, 0);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate.getTime() === selectedDateOnly.getTime();
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : eventList
        .filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Events & Services</h1>
          <p className="text-muted-foreground">
            Manage church events, services, and activities
          </p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new church event or service.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <ImageUpload
                  value={newEvent.banner}
                  onChange={(url) => setNewEvent({ ...newEvent, banner: url })}
                  label="Event Banner Image"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">
                  Event Title <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="title" 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">
                    Date <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">
                    Time <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="time" 
                    type="time" 
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="location" 
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">
                  Event Type <span className="text-destructive">*</span>
                </Label>
                <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>
                <Textarea 
                  id="description" 
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description..." 
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsThisWeek.length}</div>
            <p className="text-xs text-muted-foreground">events scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventsThisMonth.length}</div>
            <p className="text-xs text-muted-foreground">total events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendance}</div>
            <p className="text-xs text-muted-foreground">people per event</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recurringEvents}</div>
            <p className="text-xs text-muted-foreground">weekly/monthly</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date to view events</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                : 'Upcoming Events'
              }
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? displayedEvents.length === 0 
                  ? 'No events scheduled for this date'
                  : `${displayedEvents.length} event(s) scheduled`
                : 'Next events on the calendar'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayedEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate 
                  ? 'No events scheduled for this date. Click on another date or clear the selection to see upcoming events.'
                  : 'No upcoming events scheduled. Add an event to get started!'
                }
                {selectedDate && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setSelectedDate(undefined)}
                  >
                    Clear Date Selection
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedEvents.map((event) => (
                <div key={event.id} className="bg-muted/50 rounded-lg overflow-hidden">
                  {event.banner && (
                    <div className="w-full h-32 bg-muted relative overflow-hidden">
                      <img 
                        src={event.banner} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div className="text-center">
                        <div className="text-lg font-semibold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={getTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.attendees}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {selectedDate && displayedEvents.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setSelectedDate(undefined)}
                >
                  Clear Date Selection
                </Button>
              )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            Manage all church events and activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <div key={event.id} className="border rounded-lg overflow-hidden">
                {event.banner && (
                  <div className="w-full h-48 bg-muted relative overflow-hidden">
                    <img 
                      src={event.banner} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      {event.recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendees} attendees
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEditEvent(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => confirmDelete(event)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <ImageUpload
                value={newEvent.banner}
                onChange={(url) => setNewEvent({ ...newEvent, banner: url })}
                label="Event Banner Image"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Event Title <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="edit-title" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Enter event title" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="edit-date" 
                  type="date" 
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time">
                  Time <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="edit-time" 
                  type="time" 
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="edit-location" 
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Enter event location" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-type">
                Event Type <span className="text-destructive">*</span>
              </Label>
              <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="ministry">Ministry</SelectItem>
                  <SelectItem value="outreach">Outreach</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">
                Description
              </Label>
              <Textarea 
                id="edit-description" 
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Enter event description..." 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-attendees">
                Number of Attendees
              </Label>
              <Input 
                id="edit-attendees" 
                type="number"
                min="0"
                value={newEvent.attendees}
                onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })}
                placeholder="Enter number of attendees" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditEventOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEvent}>
              Update Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event "{eventToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEvent} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}