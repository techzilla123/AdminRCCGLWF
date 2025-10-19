import { useState, useEffect } from 'react';
import { volunteersAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from './ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { HandHeart, Users, Calendar, Clock, Plus, Mail, Phone, Edit, Trash2 } from 'lucide-react';

const volunteers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@email.com',
    phone: '(555) 123-4567',
    ministry: 'Youth Ministry',
    role: 'Leader',
    hours: 12,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    phone: '(555) 234-5678',
    ministry: 'Music Ministry',
    role: 'Coordinator',
    hours: 8,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a5b78c?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@email.com',
    phone: '(555) 345-6789',
    ministry: 'Children\'s Ministry',
    role: 'Helper',
    hours: 6,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@email.com',
    phone: '(555) 456-7890',
    ministry: 'Outreach',
    role: 'Coordinator',
    hours: 15,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
  },
];

const schedules = [
  { id: 1, volunteer: 'John Smith', ministry: 'Youth Ministry', date: '2025-01-28', time: '6:00 PM - 8:00 PM' },
  { id: 2, volunteer: 'Sarah Johnson', ministry: 'Music Ministry', date: '2025-01-28', time: '9:00 AM - 11:00 AM' },
  { id: 3, volunteer: 'Michael Brown', ministry: 'Children\'s Ministry', date: '2025-01-28', time: '10:00 AM - 12:00 PM' },
  { id: 4, volunteer: 'Emily Davis', ministry: 'Outreach', date: '2025-02-01', time: '9:00 AM - 1:00 PM' },
];

export function Volunteers() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<any>(null);
  const [volunteerList, setVolunteerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [volunteerToDelete, setVolunteerToDelete] = useState<any>(null);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    ministry: '',
    role: '',
    avatar: ''
  });

  useEffect(() => {
    loadVolunteers();
  }, []);

  const loadVolunteers = async () => {
    try {
      setIsLoading(true);
      const volunteers = await volunteersAPI.getAll();
      setVolunteerList(volunteers);
    } catch (error: any) {
      console.error('Error loading volunteers:', error);
      toast.error(error.message || 'Failed to load volunteers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVolunteer = async () => {
    if (newVolunteer.name && newVolunteer.email && newVolunteer.ministry && newVolunteer.role) {
      try {
        const volunteer = await volunteersAPI.add({
          ...newVolunteer,
          hours: 0,
          status: 'Active',
          avatar: newVolunteer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        });
        setVolunteerList([...volunteerList, volunteer]);
        setNewVolunteer({ name: '', email: '', phone: '', ministry: '', role: '', avatar: '' });
        setIsAddDialogOpen(false);
        toast.success('Volunteer added successfully!');
      } catch (error: any) {
        console.error('Error adding volunteer:', error);
        toast.error(error.message || 'Failed to add volunteer');
      }
    }
  };

  const handleEditVolunteer = (volunteer: any) => {
    setSelectedVolunteer(volunteer);
    setNewVolunteer({
      name: volunteer.name,
      email: volunteer.email,
      phone: volunteer.phone,
      ministry: volunteer.ministry,
      role: volunteer.role,
      avatar: volunteer.avatar || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateVolunteer = async () => {
    if (selectedVolunteer && newVolunteer.name && newVolunteer.email && newVolunteer.ministry && newVolunteer.role) {
      try {
        const updated = await volunteersAPI.update(selectedVolunteer.id, newVolunteer);
        const updatedVolunteers = volunteerList.map(volunteer =>
          volunteer.id === selectedVolunteer.id ? updated : volunteer
        );
        setVolunteerList(updatedVolunteers);
        setNewVolunteer({ name: '', email: '', phone: '', ministry: '', role: '', avatar: '' });
        setSelectedVolunteer(null);
        setIsEditDialogOpen(false);
        toast.success('Volunteer updated successfully!');
      } catch (error: any) {
        console.error('Error updating volunteer:', error);
        toast.error(error.message || 'Failed to update volunteer');
      }
    }
  };

  const handleDeleteVolunteer = async () => {
    if (volunteerToDelete) {
      try {
        await volunteersAPI.delete(volunteerToDelete.id);
        setVolunteerList(volunteerList.filter(volunteer => volunteer.id !== volunteerToDelete.id));
        setDeleteConfirmOpen(false);
        setVolunteerToDelete(null);
        toast.success('Volunteer deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting volunteer:', error);
        toast.error(error.message || 'Failed to delete volunteer');
      }
    }
  };

  const confirmDelete = (volunteer: any) => {
    setVolunteerToDelete(volunteer);
    setDeleteConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Volunteers</h1>
          <p className="text-muted-foreground">
            Manage volunteer schedules and assignments
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Volunteer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Volunteer</DialogTitle>
              <DialogDescription>
                Add a new volunteer to your church ministry team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <ImageUpload
                  value={newVolunteer.avatar}
                  onChange={(url) => setNewVolunteer({ ...newVolunteer, avatar: url })}
                  label="Volunteer Photo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={newVolunteer.name}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ministry">
                    Ministry <span className="text-destructive">*</span>
                  </Label>
                  <Select value={newVolunteer.ministry} onValueChange={(value) => setNewVolunteer({ ...newVolunteer, ministry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ministry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                      <SelectItem value="Music Ministry">Music Ministry</SelectItem>
                      <SelectItem value="Children's Ministry">Children's Ministry</SelectItem>
                      <SelectItem value="Outreach">Outreach</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="Media/Tech">Media/Tech</SelectItem>
                      <SelectItem value="Prayer Ministry">Prayer Ministry</SelectItem>
                      <SelectItem value="Pastoral Care">Pastoral Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select value={newVolunteer.role} onValueChange={(value) => setNewVolunteer({ ...newVolunteer, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leader">Leader</SelectItem>
                      <SelectItem value="Coordinator">Coordinator</SelectItem>
                      <SelectItem value="Helper">Helper</SelectItem>
                      <SelectItem value="Specialist">Specialist</SelectItem>
                      <SelectItem value="Mentor">Mentor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVolunteer}>Add Volunteer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Volunteer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerList.length}</div>
            <p className="text-xs text-muted-foreground">
              +{volunteerList.filter(v => {
                const createdDate = new Date(v.createdAt);
                const now = new Date();
                return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
              }).length} this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerList.filter(v => v.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">
              {volunteerList.length > 0 ? Math.round((volunteerList.filter(v => v.status === 'Active').length / volunteerList.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteerList.reduce((sum, v) => sum + (v.hours || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ministries</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(volunteerList.map(v => v.ministry)).size}</div>
            <p className="text-xs text-muted-foreground">active programs</p>
          </CardContent>
        </Card>
      </div>

      {/* Volunteer List */}
      <Card>
        <CardHeader>
          <CardTitle>Volunteer Directory</CardTitle>
          <CardDescription>Manage volunteer information and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Volunteer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Ministry</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Hours This Week</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteerList.map((volunteer) => (
                <TableRow key={volunteer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={volunteer.avatar} />
                        <AvatarFallback>
                          {volunteer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{volunteer.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {volunteer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {volunteer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{volunteer.ministry}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{volunteer.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {volunteer.hours}h
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">
                      {volunteer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEditVolunteer(volunteer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete(volunteer)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      
     
       

      {/* Edit Volunteer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Volunteer</DialogTitle>
            <DialogDescription>
              Update the volunteer's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <ImageUpload
                value={newVolunteer.avatar}
                onChange={(url) => setNewVolunteer({ ...newVolunteer, avatar: url })}
                label="Volunteer Photo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={newVolunteer.name}
                onChange={(e) => setNewVolunteer({ ...newVolunteer, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newVolunteer.email}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">
                  Phone Number
                </Label>
                <Input
                  id="edit-phone"
                  value={newVolunteer.phone}
                  onChange={(e) => setNewVolunteer({ ...newVolunteer, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ministry">
                  Ministry <span className="text-destructive">*</span>
                </Label>
                <Select value={newVolunteer.ministry} onValueChange={(value) => setNewVolunteer({ ...newVolunteer, ministry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                    <SelectItem value="Music Ministry">Music Ministry</SelectItem>
                    <SelectItem value="Children's Ministry">Children's Ministry</SelectItem>
                    <SelectItem value="Outreach">Outreach</SelectItem>
                    <SelectItem value="Hospitality">Hospitality</SelectItem>
                    <SelectItem value="Media/Tech">Media/Tech</SelectItem>
                    <SelectItem value="Prayer Ministry">Prayer Ministry</SelectItem>
                    <SelectItem value="Pastoral Care">Pastoral Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select value={newVolunteer.role} onValueChange={(value) => setNewVolunteer({ ...newVolunteer, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Leader">Leader</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Specialist">Specialist</SelectItem>
                    <SelectItem value="Mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateVolunteer}>Update Volunteer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {volunteerToDelete?.name} from the volunteers list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVolunteer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}