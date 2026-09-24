import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/api.js';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Edit3,
  Trash2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (err) {
        console.error('[TaskDetails Error]', err);
        setError(
          err.response?.data?.message ||
            'Failed to load task details. The task might not exist or you do not have permission to view it.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!task) return;
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await taskService.deleteTask(task._id);
        navigate('/tasks');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task || task.status === newStatus) return;
    try {
      setUpdatingStatus(true);
      const updated = await taskService.updateTask(task._id, { status: newStatus });
      setTask(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-500">Loading task details...</span>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Task Not Found</h2>
        <p className="text-xs text-slate-500 mb-5">{error || 'This task does not exist.'}</p>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Tasks</span>
        </Link>
      </div>
    );
  }

  const getPriorityStyle = (priority) => {
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

  const isOverdue =
    task.status !== 'Completed' &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/tasks/${task._id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>{task.subject}</span>
            </span>

            <span
              className={`px-2.5 py-0.5 rounded border text-xs font-semibold ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {task.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <div
              className={`flex items-center gap-1.5 font-medium ${
                isOverdue ? 'text-red-600 font-bold' : 'text-slate-500'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Due: {formatDate(task.dueDate)}</span>
              {isOverdue && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold uppercase">
                  Overdue
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Status Workflow Action Bar */}
        <div className="bg-slate-50/70 px-6 sm:px-8 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Status:</span>
            <span className="px-2.5 py-0.5 rounded bg-white border border-slate-300 font-bold text-slate-800">
              {task.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {['Pending', 'In Progress', 'Completed'].map((s) => (
              <button
                key={s}
                disabled={updatingStatus || task.status === s}
                onClick={() => handleStatusChange(s)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  task.status === s
                    ? 'bg-blue-600 text-white shadow-xs cursor-default'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description Body */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Description
          </h3>
          {task.description ? (
            <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
              {task.description}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No description provided for this task.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
