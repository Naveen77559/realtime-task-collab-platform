
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Activity } from '../types';
import { History, ChevronLeft, ChevronRight, MessageSquare, ArrowRightLeft, PlusCircle, Trash2, Edit } from 'lucide-react';

interface ActivitySidebarProps {
  refreshTrigger: number;
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ refreshTrigger }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  useEffect(() => {
    const fetchActivities = async () => {
      const data = await api.getActivities(page, LIMIT);
      setActivities(data.activities);
      setTotal(data.total);
    };
    fetchActivities();
  }, [page, refreshTrigger]);

  const getIcon = (type: Activity['type']) => {
    switch(type) {
      case 'TASK_CREATE': return <PlusCircle className="w-4 h-4 text-emerald-500" />;
      case 'TASK_MOVE': return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
      case 'TASK_DELETE': return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'TASK_UPDATE': return <Edit className="w-4 h-4 text-amber-500" />;
      case 'BOARD_CREATE': return <History className="w-4 h-4 text-purple-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full shrink-0">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-400" />
          <span>Activity Log</span>
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase">Live</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {activities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No recent activity.</p>
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div key={activity.id} className="relative pl-7 group">
              <div className="absolute left-0 top-1 p-1 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                {getIcon(activity.type)}
              </div>
              {idx < activities.length - 1 && (
                <div className="absolute left-3.5 top-8 bottom-[-24px] w-[1px] bg-gray-100"></div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {activity.userName} <span className="font-normal text-gray-500">{activity.details.toLowerCase()}</span>
                </span>
                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <span className="text-xs text-gray-500">Showing {activities.length} of {total}</span>
        <div className="flex space-x-2">
          <button 
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="p-1.5 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            disabled={(page + 1) * LIMIT >= total}
            onClick={() => setPage(p => p + 1)}
            className="p-1.5 hover:bg-white rounded-lg border border-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ActivitySidebar;
