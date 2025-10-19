import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Church,
  UserPlus,
  CalendarDays,
  HandHeart,
  MessageSquare
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { membersAPI, eventsAPI, donationsAPI, volunteersAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function Dashboard() {
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [membersData, eventsData, donationsData, volunteersData] = await Promise.all([
        membersAPI.getAll().catch(() => []),
        eventsAPI.getAll().catch(() => []),
        donationsAPI.getAll().catch(() => []),
        volunteersAPI.getAll().catch(() => [])
      ]);
      
      setMembers(membersData);
      setEvents(eventsData);
      setDonations(donationsData);
      setVolunteers(volunteersData);
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  
  // Calculate this month's donations
  const now = new Date();
  const thisMonthDonations = donations.filter(d => {
    const donationDate = new Date(d.date);
    return donationDate.getMonth() === now.getMonth() && 
           donationDate.getFullYear() === now.getFullYear();
  });
  const totalDonationsThisMonth = thisMonthDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  // Calculate upcoming events (future events)
  const upcomingEvents = events.filter(e => new Date(e.date) >= now);
  const thisWeekEvents = upcomingEvents.filter(e => {
    const eventDate = new Date(e.date);
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return eventDate <= weekFromNow;
  });

  const activeVolunteers = volunteers.filter(v => v.status === 'Active').length;

  // Group donations by type
  const donationsByType: { [key: string]: number } = {};
  donations.forEach(d => {
    const type = d.type || 'Other';
    donationsByType[type] = (donationsByType[type] || 0) + (d.amount || 0);
  });

  const donationData = Object.entries(donationsByType).map(([category, amount], index) => ({
    category,
    amount,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a28fd8'][index % 5]
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1>Church Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening at RCCG Living Word Forney.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading dashboard...</div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  {activeMembers} active members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month's Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalDonationsThisMonth.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {thisMonthDonations.length} donations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingEvents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {thisWeekEvents.length} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
                <HandHeart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeVolunteers}</div>
                <p className="text-xs text-muted-foreground">
                  {volunteers.length} total volunteers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Donations by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Donations by Category</CardTitle>
                <CardDescription>
                  Total contributions breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {donationData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={donationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {donationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No donation data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Statistics</CardTitle>
                <CardDescription>
                  Overview of key metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Total Members</span>
                  </div>
                  <span className="font-medium">{totalMembers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Active Members</span>
                  </div>
                  <span className="font-medium">{activeMembers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Total Events</span>
                  </div>
                  <span className="font-medium">{events.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Total Donations</span>
                  </div>
                  <span className="font-medium">
                    ${donations.reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HandHeart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Volunteers</span>
                  </div>
                  <span className="font-medium">{volunteers.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Events & Members */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Next scheduled events
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                        <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.location}</p>
                        </div>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming events scheduled
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>
                  Newest registered members
                </CardDescription>
              </CardHeader>
              <CardContent>
                {members.length > 0 ? (
                  <div className="space-y-4">
                    {members
                      .sort((a, b) => new Date(b.joinDate || 0).getTime() - new Date(a.joinDate || 0).getTime())
                      .slice(0, 5)
                      .map((member) => (
                        <div key={member.id} className="flex items-center gap-3 border-b pb-3 last:border-0">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No members added yet
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
