import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { Edit, Trash2, Users, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';


const roles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions',
    users: 3,
    permissions: [
      'Manage Products',
      'Manage Orders',
      'Manage Customers',
      'View Reports',
      'Manage Inventory',
      'Manage Returns',
      'Configure Settings',
      'Manage Roles',
    ],
  },
  {
    id: '2',
    name: 'Store Manager',
    description: 'Manage products, orders, and customers',
    users: 5,
    permissions: [
      'Manage Products',
      'Manage Orders',
      'Manage Customers',
      'View Reports',
      'Manage Inventory',
      'Manage Returns',
    ],
  },
  {
    id: '3',
    name: 'Warehouse Staff',
    description: 'Manage inventory and process orders',
    users: 8,
    permissions: [
      'Manage Inventory',
      'View Orders',
      'Update Order Status',
    ],
  },
  {
    id: '4',
    name: 'Customer Support',
    description: 'Handle customer inquiries and returns',
    users: 12,
    permissions: [
      'View Orders',
      'Manage Returns',
      'View Customers',
    ],
  },
  {
    id: '5',
    name: 'Marketing',
    description: 'View analytics and manage promotions',
    users: 4,
    permissions: [
      'View Reports',
      'View Products',
      'View Customers',
    ],
  },
];

const allPermissions = [
  'Manage Products',
  'View Products',
  'Manage Orders',
  'View Orders',
  'Update Order Status',
  'Manage Customers',
  'View Customers',
  'Manage Inventory',
  'View Reports',
  'Manage Returns',
  'Configure Settings',
  'Manage Roles',
  'Manage Promotions',
];

export function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  const handleRoleClick = (roleId: string) => {
    setSelectedRole(roleId);
    setShowPanel(true);
  };

  return (
    <AdminLayout currentPage="admin-roles">
      <div className="flex gap-6">
        {/* Roles Table */}
        <div className={`transition-all duration-300 ${showPanel ? 'w-2/3' : 'w-full'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-neutral-900">Roles & Permissions</h2>
            <Button className="bg-black hover:bg-neutral-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm text-neutral-600">Description</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Users</th>
                  <th className="text-center py-4 px-6 text-sm text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-neutral-600" />
                        </div>
                        <span className="text-sm text-neutral-900">{role.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-700">{role.description}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-neutral-100 text-neutral-800">
                        {role.users} user{role.users !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleRoleClick(role.id)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        {role.id !== '1' && (
                          <button
                            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Panel */}
        {showPanel && selectedRoleData && (
          <div className="w-1/3 bg-white rounded-lg border border-neutral-200 p-6 sticky top-8 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg text-neutral-900">Edit Role</h3>
              <button
                onClick={() => {
                  setShowPanel(false);
                  setSelectedRole(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  defaultValue={selectedRoleData.name}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  defaultValue={selectedRoleData.description}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-3 block">Permissions</Label>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {allPermissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg"
                    >
                      <Checkbox
                        id={permission}
                        defaultChecked={selectedRoleData.permissions.includes(permission)}
                      />
                      <Label
                        htmlFor={permission}
                        className="text-sm text-neutral-700 cursor-pointer flex-1"
                      >
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-neutral-200">
                <Button className="flex-1 bg-black hover:bg-neutral-800">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPanel(false);
                    setSelectedRole(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
