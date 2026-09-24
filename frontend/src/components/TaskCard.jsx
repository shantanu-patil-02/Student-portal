import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Edit3, Trash2, BookOpen } from 'lucide-react';

export default function TaskCard({ task, onDelete }) {
  // Badges strictly following specified styles:
  // Low -> normal/success style (#16a34a)
  // Medium -> warning style (#f59e0b)
  // High -> danger style (#dc2626)
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue =
    task.status !== 'Completed' &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden">
      <div className="p-5">
        {/* Top Header: Subject tag & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate max-w-[150px]">{task.subject}</span>
          </span>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 mb-2">
          <Link
            to={`/tasks/${task._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {task.title}
          </Link>
        </h3>

        {/* Description snippet */}
        {task.description && (
          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Priority & Due Date Meta */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Priority:</span>
            <span
              className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${getPriorityBadge(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue ? 'text-red-600 font-semibold' : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDueDate(task.dueDate)}</span>
            {isOverdue && (
              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50/70 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <Link
          to={`/tasks/${task._id}`}
          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/tasks/${task._id}/edit`}
            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-colors"
            title="Edit Task"
          >
            <Edit3 className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete(task._id, task.title)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
