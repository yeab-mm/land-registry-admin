'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/useTranslation';
import {
  DocumentArrowDownIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Report {
  id: number;
  name: string;
  type: string;
  date: string;
  size: string;
}

export default function AdminReportsPage() {
  const { darkMode } = useLanguage();
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState('users');

  const cn = (darkClass: string, lightClass: string): string => {
    return darkMode ? darkClass : lightClass;
  };

  // የሪፖርት አይነቶች
  const reportTypes = [
    { id: 'users', name: 'ተጠቃሚዎች', icon: ChartBarIcon },
    { id: 'verifications', name: 'ማረጋገጫዎች', icon: ChartBarIcon },
    { id: 'payments', name: 'ክፍያዎች', icon: ChartBarIcon },
    { id: 'listings', name: 'ማስታወቂያዎች', icon: ChartBarIcon },
  ];

  // ናሙና ሪፖርቶች
  const allReports: Report[] = [
    { id: 1, name: 'የተጠቃሚዎች ሪፖርት', type: 'users', date: '2024-03-01', size: '2.4 MB' },
    { id: 2, name: 'የማረጋገጫ ሪፖርት', type: 'verifications', date: '2024-03-01', size: '1.8 MB' },
    { id: 3, name: 'የክፍያ ሪፖርት', type: 'payments', date: '2024-03-05', size: '3.2 MB' },
    { id: 4, name: 'የማስታወቂያ ሪፖርት', type: 'listings', date: '2024-03-01', size: '1.5 MB' },
    { id: 5, name: 'የመጋቢት ተጠቃሚዎች ሪፖርት', type: 'users', date: '2024-03-15', size: '3.1 MB' },
    { id: 6, name: 'ሳምንታዊ ማረጋገጫዎች', type: 'verifications', date: '2024-03-10', size: '0.9 MB' },
    { id: 7, name: 'የመጀመሪያ ሩብ ዓመት ክፍያዎች', type: 'payments', date: '2024-03-20', size: '4.5 MB' },
    { id: 8, name: 'አዳዲስ ማስታወቂያዎች', type: 'listings', date: '2024-03-18', size: '2.2 MB' },
  ];

  // በተመረጠው አይነት መሰረት ማጣራት
  const filteredReports = allReports.filter(report => report.type === selectedReport);

  // ለተመረጠው አይነት ስታቲስቲክስ
  const totalCount = filteredReports.length;
  const totalSize = filteredReports.reduce((acc, report) => {
    const sizeNum = parseFloat(report.size);
    return acc + (isNaN(sizeNum) ? 0 : sizeNum);
  }, 0).toFixed(1);

  return (
    <div className="space-y-6">
      {/* ራስጌ */}
      <div className="flex justify-between items-center">
        <h1 className={`text-2xl font-bold ${cn('text-white', 'text-gray-900')}`}>
          ሪፖርቶች
        </h1>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          አዲስ ሪፖርት
        </button>
      </div>

      {/* የሪፖርት አይነት ምርጫ */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
        <h2 className={`text-sm font-medium mb-3 ${cn('text-gray-400', 'text-gray-500')}`}>
          የሪፖርት አይነት ይምረጡ
        </h2>
        <div className="flex flex-wrap gap-2">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedReport === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`
                  flex items-center px-4 py-2 rounded-lg text-sm transition-colors
                  ${isSelected 
                    ? 'bg-green-600 text-white' 
                    : cn('bg-gray-700 text-gray-300 hover:bg-gray-600', 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {type.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* የተመረጠው ማጣሪያ */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
        <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
          የሚታየው: <span className="font-semibold text-green-600">
            {reportTypes.find(t => t.id === selectedReport)?.name}
          </span>
        </p>
      </div>

      {/* የሪፖርቶች ዝርዝር */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm overflow-hidden`}>
        <div className={`px-6 py-4 border-b ${cn('border-gray-700', 'border-gray-200')}`}>
          <h2 className={`font-semibold ${cn('text-white', 'text-gray-900')}`}>
            የተፈጠሩ ሪፖርቶች ({totalCount})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={cn('bg-gray-700', 'bg-gray-50')}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  የሪፖርቱ ስም
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  ቀን
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  መጠን
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  ድርጊቶች
                </th>
              </tr>
            </thead>
            <tbody className={`${cn('bg-gray-800', 'bg-white')} divide-y ${cn('divide-gray-700', 'divide-gray-200')}`}>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className={cn('hover:bg-gray-700', 'hover:bg-gray-50')}>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-medium ${cn('text-white', 'text-gray-900')}`}>
                        {report.name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {report.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <EyeIcon className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded">
                          <ArrowDownTrayIcon className="w-4 h-4 text-green-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
                      ምንም ሪፖርት አልተገኘም
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ፈጣን ስታቲስቲክስ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
            ጠቅላላ ሪፖርቶች ({reportTypes.find(t => t.id === selectedReport)?.name})
          </p>
          <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
        </div>
        <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-4`}>
          <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
            ጠቅላላ መጠን
          </p>
          <p className="text-2xl font-bold text-purple-600">{totalSize} ሜባ</p>
        </div>
      </div>
    </div>
  );
}