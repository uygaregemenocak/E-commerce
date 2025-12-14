import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useAuth } from '../App';

const API_BASE_URL = '/api';

const demoUsers = [
  { role: 'Admin', username: 'admin@amor.com', password: 'password123' },
  { role: 'Store Manager', username: 'manager@amor.com', password: 'password123' },
  { role: 'Customer', username: 'customer@amor.com', password: 'password123' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Update auth context
      login(data.data.user.email, password, data.data.user.role);

      // Redirect based on role
      if (['admin', 'store_manager', 'warehouse', 'support'].includes(data.data.user.role)) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (username: string, password: string) => {
    setEmail(username);
    setPassword(password);
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      login(data.data.user.email, password, data.data.user.role);

      if (['admin', 'store_manager', 'warehouse', 'support'].includes(data.data.user.role)) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Login Card */}
        <div className="bg-neutral-900 rounded-lg p-12 mb-12 max-w-md mx-auto border border-neutral-800">
          <div className="text-center mb-8">
            <img 
              src="/IMG_8862.png" 
              alt="Logo" 
              className="h-24 w-auto object-contain mx-auto mb-4"
            />
            <p className="text-neutral-400">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="border-neutral-600" />
                <Label htmlFor="remember" className="text-sm text-neutral-400">Remember me</Label>
              </div>
              <button type="button" className="text-sm text-amber-500 hover:text-amber-400">
                Forgot password?
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white text-black hover:bg-neutral-200"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-neutral-400">Don't have an account? </span>
            <button 
              onClick={() => navigate('/register')}
              className="text-sm text-amber-500 hover:text-amber-400"
            >
              Register
            </button>
          </div>
        </div>

        {/* Demo Accounts Table */}
        <div className="bg-neutral-900 rounded-lg p-8 border border-neutral-800">
          <h2 className="text-xl text-white mb-2">Demo Accounts</h2>
          <p className="text-sm text-neutral-400 mb-6">These accounts are stored in the PostgreSQL database</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm text-neutral-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm text-neutral-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm text-neutral-400">Password</th>
                  <th className="text-right py-3 px-4 text-sm text-neutral-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {demoUsers.map((user, index) => (
                  <tr key={index} className="border-b border-neutral-800">
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-neutral-800 text-neutral-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-neutral-300">{user.username}</td>
                    <td className="py-4 px-4 text-sm text-neutral-300">{user.password}</td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDemoLogin(user.username, user.password)}
                        disabled={loading}
                        className="border-neutral-600 text-white hover:bg-neutral-800"
                      >
                        {loading ? '...' : 'Login'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
