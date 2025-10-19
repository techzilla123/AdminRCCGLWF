import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Plus, Edit, Mail, Phone, Calendar, Users, Filter, Trash2 } from 'lucide-react';
import { membersAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { ImageUpload } from './ImageUpload';

export function Members() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [memberList, setMemberList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    ministry: '',
    role: '',
    notes: '',
    avatar: '',
    status: 'Active'
  });

  // Load members on mount
  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const members = await membersAPI.getAll();
      setMemberList(members);
    } catch (error: any) {
      console.error('Error loading members:', error);
      toast.error(error.message || 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (newMember.name && newMember.email && newMember.ministry && newMember.role) {
      try {
        const member = await membersAPI.add({
          ...newMember,
          avatar: newMember.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        });
        setMemberList([...memberList, member]);
        setNewMember({ name: '', email: '', phone: '', ministry: '', role: '', notes: '', avatar: '', status: 'Active' });
        setIsAddMemberOpen(false);
        toast.success('Member added successfully!');
      } catch (error: any) {
        console.error('Error adding member:', error);
        toast.error(error.message || 'Failed to add member');
      }
    }
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone,
      ministry: member.ministry,
      role: member.role,
      notes: member.notes || '',
      avatar: member.avatar || '',
      status: member.status || 'Active'
    });
    setIsEditMemberOpen(true);
  };

  const handleUpdateMember = async () => {
    if (selectedMember && newMember.name && newMember.email && newMember.ministry && newMember.role) {
      try {
        const updated = await membersAPI.update(selectedMember.id, newMember);
        const updatedMembers = memberList.map(member =>
          member.id === selectedMember.id ? updated : member
        );
        setMemberList(updatedMembers);
        setNewMember({ name: '', email: '', phone: '', ministry: '', role: '', notes: '', avatar: '', status: 'Active' });
        setSelectedMember(null);
        setIsEditMemberOpen(false);
        toast.success('Member updated successfully!');
      } catch (error: any) {
        console.error('Error updating member:', error);
        toast.error(error.message || 'Failed to update member');
      }
    }
  };

  const handleDeleteMember = async () => {
    if (memberToDelete) {
      try {
        await membersAPI.delete(memberToDelete.id);
        setMemberList(memberList.filter(member => member.id !== memberToDelete.id));
        setDeleteConfirmOpen(false);
        setMemberToDelete(null);
        toast.success('Member deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting member:', error);
        toast.error(error.message || 'Failed to delete member');
      }
    }
  };

  const confirmDelete = (member: any) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const filteredMembers = memberList.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || member.status?.toLowerCase() === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const totalMembers = memberList.length;
  const activeMembers = memberList.filter(m => m.status === 'Active').length;
  const volunteers = memberList.filter(m => m.role === 'Volunteer' || m.role === 'Leader').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Members</h1>
          <p className="text-muted-foreground">
            Manage church members and their information
          </p>
        </div>
        <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Enter the member's information below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <ImageUpload
                  value={newMember.avatar}
                  onChange={(url) => setNewMember({ ...newMember, avatar: url })}
                  label="Member Photo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="name" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    placeholder="email@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    value={newMember.phone}
                    onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                    placeholder="(555) 123-4567" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ministry">
                    Ministry <span className="text-destructive">*</span>
                  </Label>
                  <Select value={newMember.ministry} onValueChange={(value) => setNewMember({ ...newMember, ministry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ministry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                      <SelectItem value="Music Ministry">Music Ministry</SelectItem>
                      <SelectItem value="Children's Ministry">Children's Ministry</SelectItem>
                      <SelectItem value="Outreach">Outreach</SelectItem>
                      <SelectItem value="Prayer Ministry">Prayer Ministry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Member</SelectItem>
                      <SelectItem value="Volunteer">Volunteer</SelectItem>
                      <SelectItem value="Leader">Leader</SelectItem>
                      <SelectItem value="Coordinator">Coordinator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Additional Notes
                </Label>
                <Textarea 
                  id="notes" 
                  value={newMember.notes}
                  onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                  placeholder="Enter any additional information..." 
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">Registered members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              {totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memberList.filter(m => {
                const joinDate = new Date(m.joinDate);
                const now = new Date();
                return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">In current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volunteers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers}</div>
            <p className="text-xs text-muted-foreground">
              {activeMembers > 0 ? Math.round((volunteers / activeMembers) * 100) : 0}% of active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Member Directory</CardTitle>
          <CardDescription>
            Search and filter church members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No members found. Add your first member to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Ministry</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name?.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{member.ministry}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(member)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={isEditMemberOpen} onOpenChange={setIsEditMemberOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <ImageUpload
                value={newMember.avatar}
                onChange={(url) => setNewMember({ ...newMember, avatar: url })}
                label="Member Photo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input 
                id="edit-name" 
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
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
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="email@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">
                  Phone Number
                </Label>
                <Input 
                  id="edit-phone" 
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  placeholder="(555) 123-4567" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-ministry">
                  Ministry <span className="text-destructive">*</span>
                </Label>
                <Select value={newMember.ministry} onValueChange={(value) => setNewMember({ ...newMember, ministry: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Youth Ministry">Youth Ministry</SelectItem>
                    <SelectItem value="Music Ministry">Music Ministry</SelectItem>
                    <SelectItem value="Children's Ministry">Children's Ministry</SelectItem>
                    <SelectItem value="Outreach">Outreach</SelectItem>
                    <SelectItem value="Prayer Ministry">Prayer Ministry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Volunteer">Volunteer</SelectItem>
                    <SelectItem value="Leader">Leader</SelectItem>
                    <SelectItem value="Coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-notes">
                Additional Notes
              </Label>
              <Textarea 
                id="edit-notes" 
                value={newMember.notes}
                onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                placeholder="Enter any additional information..." 
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
              <div className="space-y-0.5">
                <Label htmlFor="edit-status">
                  Member Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  {newMember.status === 'Active' ? 'Member is currently active' : 'Member is currently inactive'}
                </p>
              </div>
              <Switch
                id="edit-status"
                checked={newMember.status === 'Active'}
                onCheckedChange={(checked) => setNewMember({ ...newMember, status: checked ? 'Active' : 'Inactive' })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditMemberOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember}>
              Update Member
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
              This will permanently delete {memberToDelete?.name} from the members list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
