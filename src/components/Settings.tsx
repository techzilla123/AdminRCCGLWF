import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Settings as SettingsIcon, Church, Users, Mail, Database, Loader2, UserPlus, Edit, Trash2, Shield, Lock } from 'lucide-react';
import { settingsAPI, usersAPI, authAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface ChurchSettings {
  churchName: string;
  pastorName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  memberNotifications: boolean;
  donationNotifications: boolean;
  eventNotifications: boolean;
  autoBackup: boolean;
  memberPortal: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isSuperAdmin: boolean;
}

export function Settings() {
  const [settings, setSettings] = useState<ChurchSettings>({
    churchName: 'RCCG Living Word Forney',
    pastorName: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    timezone: 'cst',
    dateFormat: 'mdy',
    emailNotifications: true,
    memberNotifications: true,
    donationNotifications: true,
    eventNotifications: true,
    autoBackup: true,
    memberPortal: true
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // New user form
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'member'
  });

  // Edit user form
  const [editUser, setEditUser] = useState({
    name: '',
    role: '',
    password: ''
  });

  // Password change form
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Try to load current user info
      let user: CurrentUser | null = null;
      try {
        user = await usersAPI.getCurrentUser();
        setCurrentUser(user);
      } catch (error: any) {
        console.error('Error loading user info:', error);
        // Fallback: assume regular user if endpoint not available
        user = {
          id: '',
          email: '',
          name: '',
          role: 'member',
          isSuperAdmin: false
        };
        setCurrentUser(user);
      }

      // Try to load settings
      try {
        const settingsData = await settingsAPI.get();
        setSettings(settingsData);
      } catch (error: any) {
        console.error('Error loading settings:', error);
        // Use default settings if endpoint not available
        toast.error('Using default settings. Settings endpoint may not be available.');
      }

      // Load users if super admin
      if (user?.isSuperAdmin) {
        try {
          const usersData = await usersAPI.getAll();
          setUsers(usersData);
        } catch (error: any) {
          console.error('Error loading users:', error);
          toast.error('User management not available');
        }
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(error.message || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChurchInfo = async () => {
    try {
      setIsSaving(true);
      const churchData = {
        churchName: settings.churchName,
        pastorName: settings.pastorName,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        website: settings.website
      };

      await settingsAPI.update(churchData);
      toast.success('Church information saved successfully');
    } catch (error: any) {
      console.error('Error saving church info:', error);
      toast.error(error.message || 'Failed to save church information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSaving(true);
      const notificationData = {
        emailNotifications: settings.emailNotifications,
        memberNotifications: settings.memberNotifications,
        donationNotifications: settings.donationNotifications,
        eventNotifications: settings.eventNotifications
      };

      await settingsAPI.update(notificationData);
      toast.success('Notification settings saved successfully');
    } catch (error: any) {
      console.error('Error saving notifications:', error);
      toast.error(error.message || 'Failed to save notification settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      setIsSaving(true);
      const systemData = {
        timezone: settings.timezone,
        dateFormat: settings.dateFormat,
        autoBackup: settings.autoBackup,
        memberPortal: settings.memberPortal
      };

      await settingsAPI.update(systemData);
      toast.success('System settings saved successfully');
    } catch (error: any) {
      console.error('Error saving system settings:', error);
      toast.error(error.message || 'Failed to save system settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.email || !newUser.password) {
        toast.error('Email and password are required');
        return;
      }

      setIsSaving(true);
      await usersAPI.add(newUser);
      toast.success('User created successfully');
      
      // Reload users
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
      
      // Reset form and close dialog
      setNewUser({ email: '', password: '', name: '', role: 'member' });
      setShowAddUserDialog(false);
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);
      const updates: any = {
        name: editUser.name,
        role: editUser.role
      };

      if (editUser.password) {
        updates.password = editUser.password;
      }

      await usersAPI.update(selectedUser.id, updates);
      toast.success('User updated successfully');
      
      // Reload users
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
      
      // Close dialog
      setShowEditUserDialog(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.message || 'Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSaving(true);
      await usersAPI.delete(selectedUser.id);
      toast.success('User deleted successfully');
      
      // Reload users
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
      
      // Close dialog
      setShowDeleteDialog(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setIsSaving(false);
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      role: user.role,
      password: ''
    });
    setShowEditUserDialog(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleChangePassword = async () => {
    try {
      // Validate inputs
      if (!passwordChange.currentPassword || !passwordChange.newPassword || !passwordChange.confirmPassword) {
        toast.error('All fields are required');
        return;
      }

      if (passwordChange.newPassword !== passwordChange.confirmPassword) {
        toast.error('New passwords do not match');
        return;
      }

      if (passwordChange.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      setIsSaving(true);
      await authAPI.changePassword(passwordChange.currentPassword, passwordChange.newPassword);
      
      toast.success('Password updated successfully!');
      
      // Reset form
      setPasswordChange({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Manage church information and system preferences
        </p>
      </div>

      {/* My Account - Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            My Account
          </CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password"
                type="password"
                value={passwordChange.currentPassword}
                onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password"
                type="password"
                value={passwordChange.newPassword}
                onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password"
                type="password"
                value={passwordChange.confirmPassword}
                onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          
          <Button onClick={handleChangePassword} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Church Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Church className="h-5 w-5" />
            Church Information
          </CardTitle>
          <CardDescription>
            Basic information about your church
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="church-name">Church Name</Label>
              <Input 
                id="church-name" 
                value={settings.churchName}
                onChange={(e) => setSettings({ ...settings, churchName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastor-name">Pastor Name</Label>
              <Input 
                id="pastor-name" 
                value={settings.pastorName}
                onChange={(e) => setSettings({ ...settings, pastorName: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
              id="address" 
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={settings.website}
              onChange={(e) => setSettings({ ...settings, website: e.target.value })}
            />
          </div>
          
          <Button onClick={handleSaveChurchInfo} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Church Information
          </Button>
        </CardContent>
      </Card>

      {/* User Management - Only visible to super admin */}
      {currentUser?.isSuperAdmin && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage system users and permissions (Super Admin Only)
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddUserDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.name || user.email}</p>
                      {user.email === 'admin@rccglivingwordforney.com' && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                      <span>Role: {user.role}</span>
                      <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                      {user.last_sign_in_at && (
                        <span>Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  {user.email !== 'admin@rccglivingwordforney.com' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure email and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for system events
              </p>
            </div>
            <Switch 
              id="email-notifications" 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="member-notifications">New Member Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new members join
              </p>
            </div>
            <Switch 
              id="member-notifications" 
              checked={settings.memberNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, memberNotifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="donation-notifications">Donation Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new donations
              </p>
            </div>
            <Switch 
              id="donation-notifications" 
              checked={settings.donationNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, donationNotifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="event-notifications">Event Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about upcoming events
              </p>
            </div>
            <Switch 
              id="event-notifications" 
              checked={settings.eventNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, eventNotifications: checked })}
            />
          </div>
          
          <Button onClick={handleSaveNotifications} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            General system configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select 
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                  <SelectItem value="cst">Central Standard Time</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select 
                value={settings.dateFormat}
                onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-backup">Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">
                Automatically backup data daily
              </p>
            </div>
            <Switch 
              id="auto-backup" 
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="member-portal">Member Portal</Label>
              <p className="text-sm text-muted-foreground">
                Allow members to access their information online
              </p>
            </div>
            <Switch 
              id="member-portal" 
              checked={settings.memberPortal}
              onCheckedChange={(checked) => setSettings({ ...settings, memberPortal: checked })}
            />
          </div>
          
          <Button onClick={handleSaveSystemSettings} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save System Settings
          </Button>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with access to the admin system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-name">Name (Optional)</Label>
              <Input
                id="new-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-role">Role</Label>
              <Select 
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={selectedUser?.email || ''}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={editUser.role}
                onValueChange={(value) => setEditUser({ ...editUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="staff">Staff Member</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (Optional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUser?.email}? This action cannot be undone and the user will lose access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isSaving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
