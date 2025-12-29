import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AlertCircle, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { safeFetch } from '../../utils/safeFetch';
interface Report {
  id: string;
  report_type: 'post' | 'comment';
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter_username: string;
  reporter_avatar: string | null;
  community_name: string;
  targetId: string;
  reportCount?: number;
  reportIds?: string[];
}
interface ReportsTableProps {
  communityIds: string[];
  refreshKey?: number;
  onSelectReport: (reportId: string) => void;
  filterPostId?: string;
}
export function ReportsTable({
  communityIds,
  refreshKey,
  onSelectReport,
  filterPostId
}: ReportsTableProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  useEffect(() => {
    fetchReports();
  }, [communityIds, refreshKey, currentPage, filterPostId]);
  const fetchReports = async () => {
    if (communityIds.length === 0) {
      setReports([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('reports_with_details').select('*', {
        count: 'exact'
      });

      // Apply filters
      if (communityIds.length > 0) {
        query = query.in('community_id', communityIds);
      }
      if (filterPostId) {
        query = query.eq('post_id', filterPostId);
      }

      // Get total count first
      const countResult = await query;
      const total = countResult.count || 0;
      setTotalCount(total);

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.order('created_at', {
        ascending: false
      }).range(from, to);
      const [data, fetchError] = await safeFetch(query);
      if (fetchError) {
        setError('Failed to load reports. Please try again.');
        setReports([]);
        setLoading(false);
        return;
      }
      if (data) {
        // Group reports by target_id
        const groupedMap = new Map<string, any[]>();
        data.forEach((item: any) => {
          const targetId = item.target_type === 'comment' ? item.comment_id : item.post_id;
          if (!targetId) return;
          if (!groupedMap.has(targetId)) {
            groupedMap.set(targetId, []);
          }
          groupedMap.get(targetId)!.push(item);
        });

        // Convert to Report array with grouped data
        const formattedReports: Report[] = Array.from(groupedMap.values()).map(group => {
          const first = group[0];
          const reportIds = group.map(r => r.id);
          return {
            id: first.id,
            report_type: first.target_type === 'comment' ? 'comment' : 'post',
            status: first.status,
            created_at: first.created_at,
            reporter_username: first.reporter_username || 'Unknown',
            reporter_avatar: first.reporter_avatar || null,
            community_name: first.community_name || 'Unknown',
            targetId: first.target_type === 'comment' ? first.comment_id : first.post_id,
            reportCount: group.length,
            reportIds
          };
        });
        setReports(formattedReports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('An unexpected error occurred.');
      setReports([]);
    }
    setLoading(false);
  };
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
            Pending
          </Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
            Actioned
          </Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
            Dismissed
          </Badge>;
    }
  };
  const totalPages = Math.ceil(totalCount / pageSize);
  const getTypeIcon = (type: Report['report_type']) => {
    return type === 'post' ? <FileText className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;
  };
  const handleRowClick = (report: Report) => {
    onSelectReport(report.id);
  };
  if (loading) {
    return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6 space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>;
  }
  if (error) {
    return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
        <div className="border border-yellow-200 bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={fetchReports}>
            Retry
          </Button>
        </div>
      </div>;
  }
  if (reports.length === 0) {
    return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden p-6">
        <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No reports found</p>
        </div>
      </div>;
  }
  return <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Reports</h2>
        <p className="text-sm text-gray-600 mt-1">{reports.length} reports</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Community</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => <TableRow key={report.id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleRowClick(report)}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(report.report_type)}
                    <span className="capitalize text-sm">{report.report_type}</span>
                    {report.reportCount && report.reportCount > 1 && <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                        {report.reportCount} reports
                      </Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={report.reporter_avatar || undefined} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {report.reporter_username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {report.reporter_username}
                      {report.reportCount && report.reportCount > 1 && <span className="text-gray-500 text-xs ml-1">
                          +{report.reportCount - 1} more
                        </span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{report.community_name}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(report.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Button variant="secondary" size="sm" className="text-xs px-3 py-1" onClick={e => {
                e.stopPropagation();
                handleRowClick(report);
              }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({totalCount} total reports)
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>}
    </div>;
}