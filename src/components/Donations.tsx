import { useState, useEffect } from 'react';
import { donationsAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { DollarSign, TrendingUp, Calendar, Plus, Download, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Removed dummy data - now using real data from API

export function Donations() {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donationList, setDonationList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<any>(null);
  const [newDonation, setNewDonation] = useState({
    donor: '',
    amount: '',
    type: '',
    method: '',
    notes: ''
  });

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const donations = await donationsAPI.getAll();
      setDonationList(donations);
    } catch (error: any) {
      console.error('Error loading donations:', error);
      toast.error(error.message || 'Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordDonation = async () => {
    if (newDonation.donor && newDonation.amount && newDonation.type && newDonation.method) {
      try {
        const donation = await donationsAPI.add({
          donor: newDonation.donor,
          amount: parseFloat(newDonation.amount),
          type: newDonation.type,
          method: newDonation.method,
          notes: newDonation.notes
        });
        setDonationList([donation, ...donationList]);
        setNewDonation({ donor: '', amount: '', type: '', method: '', notes: '' });
        setIsRecordDialogOpen(false);
        toast.success('Donation recorded successfully!');
      } catch (error: any) {
        console.error('Error recording donation:', error);
        toast.error(error.message || 'Failed to record donation');
      }
    }
  };

  const handleViewDonation = (donation: any) => {
    setSelectedDonation(donation);
    setIsViewDialogOpen(true);
  };

  const handleDeleteDonation = async () => {
    if (donationToDelete) {
      try {
        await donationsAPI.delete(donationToDelete.id);
        setDonationList(donationList.filter(donation => donation.id !== donationToDelete.id));
        setDeleteConfirmOpen(false);
        setDonationToDelete(null);
        toast.success('Donation deleted successfully!');
      } catch (error: any) {
        console.error('Error deleting donation:', error);
        toast.error(error.message || 'Failed to delete donation');
      }
    }
  };

  const confirmDelete = (donation: any) => {
    setDonationToDelete(donation);
    setDeleteConfirmOpen(true);
  };

  const handleExportReport = () => {
    // Mock export functionality
    const csvContent = "data:text/csv;charset=utf-8,Donor,Amount,Type,Date,Method\n" +
      donationList.map(d => `${d.donor},${d.amount},${d.type},${d.date},${d.method}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "donations_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate statistics from real data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // This month's donations
  const thisMonthDonations = donationList.filter(d => {
    const donationDate = new Date(d.date);
    return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
  });

  const monthlyTotal = thisMonthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Group by type for this month
  const donationsByType: { [key: string]: number } = {};
  thisMonthDonations.forEach(d => {
    const type = d.type || 'Other';
    donationsByType[type] = (donationsByType[type] || 0) + (d.amount || 0);
  });

  const tithesTotal = donationsByType['Tithe'] || 0;
  const offeringsTotal = donationsByType['Offering'] || 0;
  const buildingTotal = donationsByType['Building Fund'] || 0;
  
  const tithesPercent = monthlyTotal > 0 ? Math.round((tithesTotal / monthlyTotal) * 100) : 0;
  const offeringsPercent = monthlyTotal > 0 ? Math.round((offeringsTotal / monthlyTotal) * 100) : 0;
  const buildingPercent = monthlyTotal > 0 ? Math.round((buildingTotal / monthlyTotal) * 100) : 0;

  // Calculate last month for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const lastMonthDonations = donationList.filter(d => {
    const donationDate = new Date(d.date);
    return donationDate.getMonth() === lastMonth && donationDate.getFullYear() === lastMonthYear;
  });

  const lastMonthTotal = lastMonthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const monthOverMonthChange = lastMonthTotal > 0 
    ? ((monthlyTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : '0';

  // Generate chart data from actual donations (last 6 months)
  const generateMonthlyData = () => {
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      const monthDonations = donationList.filter(d => {
        const donationDate = new Date(d.date);
        return donationDate.getMonth() === monthIndex && donationDate.getFullYear() === year;
      });

      const monthData = {
        month: monthNames[monthIndex],
        tithes: 0,
        offerings: 0,
        building: 0,
        special: 0
      };

      monthDonations.forEach(d => {
        const amount = d.amount || 0;
        switch (d.type) {
          case 'Tithe':
            monthData.tithes += amount;
            break;
          case 'Offering':
            monthData.offerings += amount;
            break;
          case 'Building Fund':
            monthData.building += amount;
            break;
          case 'Special Gift':
            monthData.special += amount;
            break;
          default:
            monthData.special += amount;
        }
      });

      months.push(monthData);
    }
    
    return months;
  };

  const monthlyData = generateMonthlyData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Donations & Finance</h1>
          <p className="text-muted-foreground">
            Track donations, offerings, and financial contributions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Record New Donation</DialogTitle>
                <DialogDescription>
                  Enter the donation information below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="donor" className="text-right">
                    Donor Name
                  </Label>
                  <Input
                    id="donor"
                    value={newDonation.donor}
                    onChange={(e) => setNewDonation({ ...newDonation, donor: e.target.value })}
                    className="col-span-3"
                    placeholder="Enter donor name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                    className="col-span-3"
                    placeholder="0.00"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={newDonation.type} onValueChange={(value) => setNewDonation({ ...newDonation, type: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select donation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tithe">Tithe</SelectItem>
                      <SelectItem value="Offering">Offering</SelectItem>
                      <SelectItem value="Building Fund">Building Fund</SelectItem>
                      <SelectItem value="Special Gift">Special Gift</SelectItem>
                      <SelectItem value="Mission Fund">Mission Fund</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="method" className="text-right">
                    Method
                  </Label>
                  <Select value={newDonation.method} onValueChange={(value) => setNewDonation({ ...newDonation, method: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Mobile Pay">Mobile Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newDonation.notes}
                    onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                    className="col-span-3"
                    placeholder="Additional notes..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRecordDonation}>Record Donation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {parseFloat(monthOverMonthChange) >= 0 ? '+' : ''}{monthOverMonthChange}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tithes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${tithesTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{tithesPercent}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offerings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${offeringsTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{offeringsPercent}% of total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Building Fund</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${buildingTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{buildingPercent}% of total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Donations</CardTitle>
            <CardDescription>Donation trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Bar dataKey="tithes" fill="#8884d8" />
                <Bar dataKey="offerings" fill="#82ca9d" />
                <Bar dataKey="building" fill="#ffc658" />
                <Bar dataKey="special" fill="#ff7c7c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="tithes" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="offerings" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Latest donation records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donationList.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">{donation.donor}</TableCell>
                  <TableCell>${donation.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(donation.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>{donation.method}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDonation(donation)}>
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => confirmDelete(donation)}>
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

      {/* View Donation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              View complete donation information
            </DialogDescription>
          </DialogHeader>
          {selectedDonation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Donor:</Label>
                <div className="col-span-3">{selectedDonation.donor}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Amount:</Label>
                <div className="col-span-3">${selectedDonation.amount.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Type:</Label>
                <div className="col-span-3">
                  <Badge variant="outline">{selectedDonation.type}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Date:</Label>
                <div className="col-span-3">{new Date(selectedDonation.date).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">Method:</Label>
                <div className="col-span-3">{selectedDonation.method}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the donation from {donationToDelete?.donor} for ${donationToDelete?.amount}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDonation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}