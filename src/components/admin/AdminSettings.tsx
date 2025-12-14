import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function AdminSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'AMOR',
    storeEmail: 'admin@amor.com',
    currency: 'USD',
    timezone: 'America/New_York',
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    lowStockThreshold: '5',
    apiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  });

  const handleSave = () => {
    // Save settings - would connect to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout currentPage="admin-settings">
      <div className="space-y-8">
        {/* Store Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-neutral-900">Store Settings</h2>
              <p className="text-sm text-neutral-500">Configure your store's basic information</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="TRY">TRY - Turkish Lira</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) => setSettings({ ...settings, timezone: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Istanbul">Istanbul (TRT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-neutral-900">Notifications</h2>
              <p className="text-sm text-neutral-500">Manage email and alert preferences</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-neutral-300 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">Email Notifications</p>
                <p className="text-xs text-neutral-500">Receive email updates about store activity</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.orderNotifications}
                onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-neutral-300 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">Order Notifications</p>
                <p className="text-xs text-neutral-500">Get notified when new orders are placed</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.lowStockAlerts}
                onChange={(e) => setSettings({ ...settings, lowStockAlerts: e.target.checked })}
                className="w-4 h-4 text-amber-500 rounded border-neutral-300 focus:ring-amber-500"
              />
              <div>
                <p className="text-sm font-medium text-neutral-900">Low Stock Alerts</p>
                <p className="text-xs text-neutral-500">Alert when product stock falls below threshold</p>
              </div>
            </label>

            <div className="pt-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => setSettings({ ...settings, lowStockThreshold: e.target.value })}
                className="mt-1 w-32"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-neutral-900">API Configuration</h2>
              <p className="text-sm text-neutral-500">Manage API keys and integrations</p>
            </div>
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative mt-1">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4 text-neutral-400" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Keep your API key secret. Never share it publicly.</p>
          </div>
        </div>

        {/* Database Info */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-neutral-900">System Status</h2>
              <p className="text-sm text-neutral-500">Database and system information</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Database</p>
              <p className="text-lg font-medium text-neutral-900 mt-1">PostgreSQL</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 mt-2">
                Connected
              </span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 uppercase tracking-wider">API Version</p>
              <p className="text-lg font-medium text-neutral-900 mt-1">v1.0.0</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800 mt-2">
                Latest
              </span>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Environment</p>
              <p className="text-lg font-medium text-neutral-900 mt-1">Development</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800 mt-2">
                Docker
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-black hover:bg-neutral-800 gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

