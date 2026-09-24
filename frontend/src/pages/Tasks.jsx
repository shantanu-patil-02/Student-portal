import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskService } from '../services/api.js';
import TaskCard from '../components/TaskCard.jsx';
import {
  PlusCircle,
  Filter,
  CheckSquare,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getTasks({
        status: statusFilter,
        priority: priorityFilter,
      });
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[Fetch Tasks Error]', err);
      setError('Failed to fetch tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, priorityFilter]);

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

  const handleResetFilters = () => {
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>Tasks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage, filter, and track all your academic coursework
          </p>
        </div>

        <Link
          to="/tasks/create"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Task</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filters</span>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {(statusFilter !== 'All' || priorityFilter !== 'All') && (
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTasks}
            className="text-xs font-semibold underline hover:no-underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500">Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            {statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try changing or resetting your active filters to see more tasks.'
              : 'You have not added any tasks or assignments yet.'}
          </p>

          {statusFilter !== 'All' || priorityFilter !== 'All' ? (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filter Criteria</span>
            </button>
          ) : (
            <Link
              to="/tasks/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Task</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
