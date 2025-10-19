import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageSquare, Send, Mail, Bell, Plus, Users, Calendar, Edit, Check, Trash2 } from 'lucide-react';
import { communicationsAPI, membersAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Checkbox } from './ui/checkbox';

/**
 * Communications Component
 * 
 * This component manages church announcements and sends them via email to selected members.
 * 
 * Email Sending:
 * - When an announcement is created, it's saved to the database and emails are sent to all selected recipients
 * - The email sending is handled by the backend API endpoint: /communications/send-email
 * - For production use, integrate with an email service provider like:
 *   - Resend (https://resend.com) - Recommended for modern applications
 *   - SendGrid
 *   - Mailgun
 *   - Amazon SES
 * 
 * To enable real email sending:
 * 1. Sign up for an email service provider
 * 2. Get your API key
 * 3. Update the backend endpoint in /supabase/functions/make-server-c28f50fa/index.tsx
 * 4. Replace the console.log with actual API calls to your email service
 */
export function Communications() {
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [announcementList, setAnnouncementList] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [comms, membersData] = await Promise.all([
        communicationsAPI.getAll(),
        membersAPI.getAll()
      ]);
      setAnnouncementList(comms);
      setMembers(membersData);
    } catch (error: any) {
      console.error('Error loading communications:', error);
      toast.error(error.message || 'Failed to load communications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.content && newAnnouncement.type) {
      try {
        // First, save the announcement to the database
        const announcement = await communicationsAPI.add({
          ...newAnnouncement,
          recipients: selectedRecipients,
          recipientCount: selectedRecipients.length
        });
        
        // Then, send emails to all selected recipients
        try {
          await communicationsAPI.sendEmail({
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            type: newAnnouncement.type,
            recipients: selectedRecipients
          });
          toast.success(`Announcement sent to ${selectedRecipients.length} recipient(s) via email!`);
        } catch (emailError: any) {
          console.error('Error sending emails:', emailError);
          toast.warning('Announcement saved but some emails failed to send.');
        }
        
        setAnnouncementList([announcement, ...announcementList]);
        setNewAnnouncement({ title: '', content: '', type: '' });
        setSelectedRecipients([]);
        setIsAddAnnouncementOpen(false);
      } catch (error: any) {
        console.error('Error adding announcement:', error);
        toast.error(error.message || 'Failed to send announcement');
      }
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleEditAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setNewAnnouncement({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type
    });
    setSelectedRecipients(announcement.recipients || []);
    setIsEditAnnouncementOpen(true);
  };

  const handleUpdateAnnouncement = async () => {
    if (selectedAnnouncement && newAnnouncement.title && newAnnouncement.content && newAnnouncement.type) {
      try {
        const updated = await communicationsAPI.update(selectedAnnouncement.id, {
          ...newAnnouncement,
          recipients: selectedRecipients,
          recipientCount: selectedRecipients.length
        });
        const updatedAnnouncements = announcementList.map(announcement =>
          announcement.id === selectedAnnouncement.id ? updated : announcement
        );
        setAnnouncementList(updatedAnnouncements);
        setNewAnnouncement({ title: '', content: '', type: '' });
        setSelectedRecipients([]);
        setSelectedAnnouncement(null);
        setIsEditAnnouncementOpen(false);
        toast.success('Announcement updated successfully!');
      } catch (error: any) {
        console.error('Error updating announcement:', error);
        toast.error(error.message || 'Failed to update announcement');
      }
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (announcementToDelete) {
      try {
        await communicationsAPI.delete(announcementToDelete.id);
        setAnnouncementList(announcementList.filter(announcement => announcement.id !== announcementToDelete.id));
        setDeleteConfirmOpen(false);
        setAnnouncementToDelete(null);
        toast.success('Announcement deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting announcement:', error);
        toast.error(error.message || 'Failed to delete announcement');
      }
    }
  };

  const confirmDelete = (announcement: any) => {
    setAnnouncementToDelete(announcement);
    setDeleteConfirmOpen(true);
  };

  const toggleRecipient = (email: string) => {
    if (selectedRecipients.includes(email)) {
      setSelectedRecipients(selectedRecipients.filter(e => e !== email));
    } else {
      setSelectedRecipients([...selectedRecipients, email]);
    }
  };

  const selectAllRecipients = () => {
    if (selectedRecipients.length === members.length) {
      setSelectedRecipients([]);
    } else {
      setSelectedRecipients(members.map(m => m.email));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'important': return 'bg-red-100 text-red-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'prayer': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Communications</h1>
          <p className="text-muted-foreground">
            Manage announcements, newsletters, and member communications
          </p>
        </div>
        <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Create and send an announcement to selected members
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input 
                  id="title" 
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="Announcement title" 
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Important">Important</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Prayer">Prayer</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Message
                </Label>
                <Textarea 
                  id="content" 
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                  placeholder="Type your announcement here..." 
                  className="col-span-3 min-h-[100px]" 
                />
              </div>
              
              {/* Recipients Section */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Recipients
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedRecipients.length} of {members.length} members selected
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={selectAllRecipients}
                    >
                      {selectedRecipients.length === members.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  
                  {members.length > 0 ? (
                    <div className="border rounded-md max-h-[200px] overflow-y-auto p-3 space-y-2">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`recipient-${member.id}`}
                            checked={selectedRecipients.includes(member.email)}
                            onCheckedChange={() => toggleRecipient(member.email)}
                          />
                          <label
                            htmlFor={`recipient-${member.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                          >
                            {member.name} ({member.email})
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                      No members available. Add members first to send announcements.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsAddAnnouncementOpen(false);
                setNewAnnouncement({ title: '', content: '', type: '' });
                setSelectedRecipients([]);
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddAnnouncement} disabled={selectedRecipients.length === 0}>
                <Send className="h-4 w-4 mr-2" />
                Send Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Announcements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcementList.length}</div>
            <p className="text-xs text-muted-foreground">Sent communications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground">Total recipients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcementList.filter(a => {
                const date = new Date(a.date);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Announcements sent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {announcementList.reduce((sum, a) => sum + (a.recipientCount || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total recipients reached</p>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>
            View and manage all announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : announcementList.length > 0 ? (
            <div className="space-y-4">
              {announcementList.map((announcement) => (
                <div key={announcement.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <Badge className={getTypeColor(announcement.type)}>
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {announcement.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => confirmDelete(announcement)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(announcement.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {announcement.recipientCount || 0} recipients
                    </div>
                    {announcement.status && (
                      <Badge variant="outline" className="text-xs">
                        {announcement.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No announcements yet. Create your first announcement to communicate with members!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input 
                id="edit-title" 
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                placeholder="Announcement title" 
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={newAnnouncement.type} onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Important">Important</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Prayer">Prayer</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="edit-content" className="text-right pt-2">
                Message
              </Label>
              <Textarea 
                id="edit-content" 
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                placeholder="Type your announcement here..." 
                className="col-span-3 min-h-[100px]" 
              />
            </div>
            
            {/* Recipients Section */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Recipients
              </Label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedRecipients.length} of {members.length} members selected
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={selectAllRecipients}
                  >
                    {selectedRecipients.length === members.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                
                {members.length > 0 ? (
                  <div className="border rounded-md max-h-[200px] overflow-y-auto p-3 space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-recipient-${member.id}`}
                          checked={selectedRecipients.includes(member.email)}
                          onCheckedChange={() => toggleRecipient(member.email)}
                        />
                        <label
                          htmlFor={`edit-recipient-${member.id}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                        >
                          {member.name} ({member.email})
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-4 text-center border rounded-md">
                    No members available
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditAnnouncementOpen(false);
              setNewAnnouncement({ title: '', content: '', type: '' });
              setSelectedRecipients([]);
              setSelectedAnnouncement(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAnnouncement} disabled={selectedRecipients.length === 0}>
              Update Announcement
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
              This will permanently delete the announcement "{announcementToDelete?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnnouncement} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
