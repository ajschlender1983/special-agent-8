'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Application {
  id: string;
  name: string;
  email: string;
  session_type: string;
  preferred_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FeedbackMessage {
  type: 'success' | 'error';
  message: string;
}

export function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      fetchApplications(savedToken);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setFeedback({ type: 'error', message: 'Token cannot be empty' });
      return;
    }

    localStorage.setItem('admin_token', tokenInput);
    setToken(tokenInput);
    setIsLoggedIn(true);
    setTokenInput('');
    await fetchApplications(tokenInput);
  }

  async function fetchApplications(adminToken: string) {
    setLoading(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data.applications || []);
      setFeedback({ type: 'success', message: 'Applications loaded successfully' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to fetch applications'
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: 'approved' | 'rejected') {
    setUpdating(id);
    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      setApplications(
        applications.map(app =>
          app.id === id ? { ...app, status: newStatus } : app
        )
      );
      setFeedback({ type: 'success', message: `Application ${newStatus} successfully` });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update status',
      });
    } finally {
      setUpdating(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem('admin_token');
    setIsLoggedIn(false);
    setToken('');
    setApplications([]);
    setFeedback(null);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Access</h1>
          <p className="text-slate-600 mb-6">Enter your admin token to review applications</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
                Admin Token
              </label>
              <input
                id="token"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter your admin token"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Login
            </button>
          </form>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                  feedback.type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Application Review</h1>
            <p className="text-sm text-slate-600 mt-1">Manage pending applications</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg font-medium ${
                feedback.type === 'error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-slate-600 mt-4">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Session Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Preferred Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <motion.tr
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-200 hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{app.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 capitalize">{app.session_type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{app.preferred_date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app.id, 'approved')}
                            disabled={updating === app.id}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded transition disabled:opacity-50"
                          >
                            {updating === app.id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            disabled={updating === app.id}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition disabled:opacity-50"
                          >
                            {updating === app.id ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
