import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { taskService } from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  PlusCircle,
  Calendar,
  ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Dashboard Error]', err);
      setError('Failed to load dashboard tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTask = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the task "${title}"?`)) {
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => (Array.isArray(prev) ? prev.filter((t) => t._id !== id) : []));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const taskList = Array.isArray(tasks) ? tasks : [];

  const totalTasks = taskList.length;
  const pendingTasks = taskList.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = taskList.filter((t) => t.status === 'In Progress').length;
  const completedTasks = taskList.filter((t) => t.status === 'Completed').length;

  const upcomingTasks = taskList
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome, {user?.name || 'Student'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your coursework, organize assignments, and stay on top of deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tasks/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Task</span>
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition-colors shadow-xs"
          >
            <span>View All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Total Tasks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {loading ? '-' : totalTasks}
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {loading ? '-' : pendingTasks}
            </div>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              In Progress
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {loading ? '-' : inProgressTasks}
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-0.5">
              {loading ? '-' : completedTasks}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Tasks Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Upcoming Tasks</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upcoming deadlines that need your attention
            </p>
          </div>

          <Link
            to="/tasks"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({totalTasks})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-slate-500">Loading assignments...</span>
          </div>
        ) : upcomingTasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              No pending assignments right now
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You are all caught up on your course deliverables, or you haven't added tasks yet.
            </p>
            <Link
              to="/tasks/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
