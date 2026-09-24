import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  BookOpen,
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs group-hover:bg-blue-700 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight block leading-tight">
                Student Task Manager
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                Coursework & Assignment Tracker
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/tasks" end className={navLinkClass}>
                <CheckSquare className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                <span>Tasks</span>
              </NavLink>
              <NavLink to="/tasks/create" className={navLinkClass}>
                <PlusCircle className="w-4 h-4 text-slate-500 group-hover:text-blue-600" />
                <span>Add Task</span>
              </NavLink>
            </div>
          ) : null}

          {/* Right Side: User Profile / Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs border border-slate-200">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="text-left text-xs">
                    <span className="font-semibold text-slate-900 block leading-tight">
                      {user?.name || 'Student'}
                    </span>
                    <span className="text-slate-500 block text-[11px]">
                      {user?.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors ml-2 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-2 border border-slate-200">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{user?.name}</div>
                  <div className="text-xs text-slate-500">{user?.email}</div>
                </div>
              </div>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-600" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/tasks"
                end
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Tasks</span>
              </NavLink>

              <NavLink
                to="/tasks/create"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Add Task</span>
              </NavLink>

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 text-sm shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
