'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CalendarIcon,
  ScaleIcon,
  ArrowPathIcon, 
  DocumentTextIcon   // Add this
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

interface ServiceApplication {
  id: number;
  applicant: string;
  serviceType: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  fee: number;
  date: string;
  description?: string;
}

export default function OfficerServicesPage() {
  const { darkMode, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ServiceApplication | null>(null);

  const cn = (darkClass: string, lightClass: string) => darkMode ? darkClass : lightClass;

  const t = (en: string, am: string) => language === 'en' ? en : am;

  // Fetch applications from backend
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // First try officer endpoint
      let response = await fetch(`${API_URL}/officer/service-applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // If officer endpoint fails (404), try admin endpoint
      if (response.status === 404) {
        response = await fetch(`${API_URL}/admin/service-applications`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      // If both fail, use fallback data
      if (response.status === 404) {
        console.log('Using fallback data');
        setApplications([
          { id: 1, applicant: 'Abebe Kebede', serviceType: 'Land Subdivision', status: 'pending', fee: 2500, date: '2024-03-15', description: 'Subdivide into 2 plots' },
          { id: 2, applicant: 'Tigist Haile', serviceType: 'Title Deed Replacement', status: 'pending', fee: 1500, date: '2024-03-14', description: 'Lost original deed' },
          { id: 3, applicant: 'Biruk Alemu', serviceType: 'Boundary Survey', status: 'pending', fee: 3000, date: '2024-03-16', description: 'Survey required' },
          { id: 4, applicant: 'Mekdes Hailu', serviceType: 'Land Use Change', status: 'in-progress', fee: 5000, date: '2024-03-12', description: 'Change from agricultural to residential' },
        ]);
        setLoading(false);
        return;
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const appsData = data.applications || data || [];
      setApplications(Array.isArray(appsData) ? appsData : []);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(t('Failed to load applications', 'አመልካቾችን ማምጣት አልተሳካም'));
      toast.error(t('Failed to load applications', 'አመልካቾችን ማምጣት አልተሳካም'));
      // Fallback data
      setApplications([
        { id: 1, applicant: 'Abebe Kebede', serviceType: 'Land Subdivision', status: 'pending', fee: 2500, date: '2024-03-15', description: 'Subdivide into 2 plots' },
        { id: 2, applicant: 'Tigist Haile', serviceType: 'Title Deed Replacement', status: 'pending', fee: 1500, date: '2024-03-14', description: 'Lost original deed' },
        { id: 3, applicant: 'Biruk Alemu', serviceType: 'Boundary Survey', status: 'pending', fee: 3000, date: '2024-03-16', description: 'Survey required' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // Try to update via officer endpoint
      let response = await fetch(`${API_URL}/officer/service-applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      // If officer endpoint fails, try admin endpoint
      if (response.status === 404) {
        response = await fetch(`${API_URL}/admin/service-applications/${id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
      }

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const successMsg = status === 'approved' 
          ? t('Application approved', 'ማመልከቻው ጸድቋል')
          : t('Application rejected', 'ማመልከቻው ውድቅ ተደርጓል');
        toast.success(successMsg);
        fetchApplications();
      } else {
        // If API update fails, update locally for demo
        setApplications(prev => prev.map(app => 
          app.id === id ? { ...app, status: status as any } : app
        ));
        toast.success(status === 'approved' ? 'Application approved (Demo)' : 'Application rejected (Demo)');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Update locally as fallback
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status: status as any } : app
      ));
      toast.success(status === 'approved' ? 'Application approved (Demo)' : 'Application rejected (Demo)');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">{t('Approved', 'የጸደቀ')}</span>;
    }
    if (status === 'rejected') {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">{t('Rejected', 'ውድቅ ተደርጓል')}</span>;
    }
    if (status === 'in-progress') {
      return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{t('In Progress', 'በሂደት ላይ')}</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">{t('Pending', 'በመጠባበቅ ላይ')}</span>;
  };

  const getServiceTypeText = (type: string) => {
    const types: Record<string, { en: string; am: string }> = {
      'Land Subdivision': { en: 'Land Subdivision', am: 'የመሬት ክፍፍል' },
      'Title Deed Replacement': { en: 'Title Deed Replacement', am: 'የባለቤትነት ማረጋገጫ መተካት' },
      'Boundary Survey': { en: 'Boundary Survey', am: 'የድንበር ቅኝት' },
      'Land Use Change': { en: 'Land Use Change', am: 'የመሬት አጠቃቀም ለውጥ' },
    };
    return types[type]?.[language] || type;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'am-ET');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    inProgress: applications.filter(a => a.status === 'in-progress').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="font-bold">{t('Error', 'ስህተት')}</p>
          <p>{error}</p>
          <button onClick={fetchApplications} className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
            <ArrowPathIcon className="w-4 h-4" />
            {t('Try Again', 'እንደገና ሞክር')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold ${cn('text-white', 'text-gray-900')}`}>
            {t('Service Applications', 'የአገልግሎት ማመልከቻዎች')}
          </h1>
          <p className={`text-sm mt-1 ${cn('text-gray-400', 'text-gray-500')}`}>
            {t('Total', 'ጠቅላላ')}: {applications.length} {t('applications', 'ማመልከቻዎች')}
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className={`p-2 rounded-lg ${cn('hover:bg-gray-700', 'hover:bg-gray-100')}`}
          title={t('Refresh', 'አድስ')}
        >
          <ArrowPathIcon className={`w-5 h-5 ${cn('text-gray-400', 'text-gray-500')}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Total', 'ጠቅላላ')}</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
        </div>
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Pending', 'በመጠባበቅ ላይ')}</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Approved', 'የጸደቀ')}</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</p>
        </div>
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Rejected', 'ውድቅ ተደርጓል')}</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
        </div>
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('In Progress', 'በሂደት ላይ')}</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('Search by name or service...', 'በስም ወይም በአገልግሎት ፈልግ...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 md:w-48 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">{t('All Status', 'ሁሉም ሁኔታ')}</option>
            <option value="pending">{t('Pending', 'በመጠባበቅ ላይ')}</option>
            <option value="approved">{t('Approved', 'የጸደቀ')}</option>
            <option value="rejected">{t('Rejected', 'ውድቅ ተደርጓል')}</option>
            <option value="in-progress">{t('In Progress', 'በሂደት ላይ')}</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={cn('bg-gray-700', 'bg-gray-50')}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Applicant', 'አመልካች')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Service Type', 'የአገልግሎት አይነት')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Fee', 'ክፍያ')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Date', 'ቀን')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Status', 'ሁኔታ')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t('Actions', 'ድርጊቶች')}
                </th>
              </tr>
            </thead>
            <tbody className={`${cn('bg-gray-800', 'bg-white')} divide-y ${cn('divide-gray-700', 'divide-gray-200')}`}>
              {filteredApplications.map((app) => (
                <tr key={app.id} className={cn('hover:bg-gray-700', 'hover:bg-gray-50') + ' transition-colors'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {app.applicant.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${cn('text-white', 'text-gray-900')}`}>
                          {app.applicant}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm ${cn('text-gray-300', 'text-gray-600')}`}>
                      {getServiceTypeText(app.serviceType)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(app.fee)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
                      {formatDate(app.date)}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setSelectedApplication(app)}
                        className="p-1 rounded-lg transition-colors"
                        title={t('View Details', 'ዝርዝሮችን ተመልከት')}
                      >
                        <EyeIcon className="w-5 h-5 text-blue-400" />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => updateStatus(app.id, 'approved')}
                            className="p-1 rounded-lg transition-colors"
                            title={t('Approve', 'አጽድቅ')}
                          >
                            <CheckCircleIcon className="w-5 h-5 text-green-400" />
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'rejected')}
                            className="p-1 rounded-lg transition-colors"
                            title={t('Reject', 'ውድቅ አድርግ')}
                          >
                            <XCircleIcon className="w-5 h-5 text-red-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center">
            <DocumentTextIcon className={`w-12 h-12 mx-auto mb-4 ${cn('text-gray-600', 'text-gray-400')}`} />
            <p className={`text-lg ${cn('text-gray-400', 'text-gray-600')}`}>
              {t('No applications found', 'ምንም ማመልከቻዎች አልተገኙም')}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl max-w-md w-full p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${cn('text-white', 'text-gray-900')}`}>
                {t('Application Details', 'የማመልከቻ ዝርዝሮች')}
              </h2>
              <button 
                onClick={() => setSelectedApplication(null)}
                className={`${cn('text-gray-400 hover:text-gray-300', 'text-gray-500 hover:text-gray-700')}`}
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Applicant', 'አመልካች')}</p>
                <p className={`font-medium ${cn('text-white', 'text-gray-900')}`}>{selectedApplication.applicant}</p>
              </div>
              <div>
                <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Service Type', 'የአገልግሎት አይነት')}</p>
                <p className={`font-medium ${cn('text-white', 'text-gray-900')}`}>{getServiceTypeText(selectedApplication.serviceType)}</p>
              </div>
              <div>
                <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Fee', 'ክፍያ')}</p>
                <p className={`font-medium text-green-600 dark:text-green-400`}>{formatCurrency(selectedApplication.fee)}</p>
              </div>
              <div>
                <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Date', 'ቀን')}</p>
                <p className={`font-medium ${cn('text-white', 'text-gray-900')}`}>{formatDate(selectedApplication.date)}</p>
              </div>
              <div>
                <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Status', 'ሁኔታ')}</p>
                <div>{getStatusBadge(selectedApplication.status)}</div>
              </div>
              {selectedApplication.description && (
                <div>
                  <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>{t('Description', 'መግለጫ')}</p>
                  <p className={`text-sm ${cn('text-gray-300', 'text-gray-700')}`}>{selectedApplication.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setSelectedApplication(null)}
                className={`px-4 py-2 rounded-lg ${cn('bg-gray-700 hover:bg-gray-600', 'bg-gray-200 hover:bg-gray-300')}`}
              >
                {t('Close', 'ዝጋ')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
