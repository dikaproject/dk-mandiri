'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Key, 
  UserCog, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { getAllUsers, deleteUser, resetPassword } from '@/services/user';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('');
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Delete user
  const handleDeleteClick = (id: string) => {
    setDeleteConfirm(id);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      setIsProcessing(true);
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsProcessing(false);
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Reset password
  const handleResetClick = (id: string) => {
    setResetConfirm(id);
  };

  const handleConfirmReset = async (id: string) => {
    try {
      setIsProcessing(true);
      const result = await resetPassword(id);
      
      if (result.notificationSent) {
        toast.success('Password reset successfully and sent via WhatsApp');
      } else {
        // Password tidak berhasil dikirim atau user tidak punya nomor telepon
        toast.success('Password reset successfully');
        
        // Tampilkan password baru
        toast(
          (t) => (
            <div>
              <p className="font-bold mb-2">New password:</p>
              <p className="bg-gray-100 p-2 rounded font-mono select-all">{result.newPassword}</p>
              <button 
                className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(result.newPassword);
                  toast.success('Password copied to clipboard');
                }}
              >
                Copy
              </button>
              {!result.hasPhone && (
                <p className="text-yellow-600 text-sm mt-2">
                  User does not have a registered phone number.
                </p>
              )}
              {result.hasPhone && !result.notificationSent && (
                <p className="text-red-600 text-sm mt-2">
                  Failed to send password via WhatsApp. Please provide password manually.
                </p>
              )}
            </div>
          ),
          { duration: 10000 }
        );
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('Failed to reset password');
    } finally {
      setIsProcessing(false);
      setResetConfirm(null);
    }
  };

  const handleCancelReset = () => {
    setResetConfirm(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'STAFF':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0 flex items-center">
            <UserCog className="mr-2" size={24} />
            User Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/admin/user/create')}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus size={16} className="mr-1" />
            Add User
          </motion.button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="w-full md:w-48">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                  <option value="USER">User</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={36} className="animate-spin text-blue-600" />
              </div>
            ) : filteredUsers.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name / Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Reset Password */}
                          {resetConfirm === user.id ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Reset password?</span>
                              <button
                                onClick={() => handleConfirmReset(user.id)}
                                disabled={isProcessing}
                                className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                              >
                                {isProcessing ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  "Yes"
                                )}
                              </button>
                              <button
                                onClick={handleCancelReset}
                                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleResetClick(user.id)}
                              className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 flex items-center"
                              title="Reset Password"
                            >
                              <Key size={16} />
                            </button>
                          )}
                          
                          {/* Edit User */}
                          <button
                            onClick={() => router.push(`/admin/user/edit/${user.id}`)}
                            className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          
                          {/* Delete User */}
                          {deleteConfirm === user.id ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">Delete?</span>
                              <button
                                onClick={() => handleConfirmDelete(user.id)}
                                disabled={isProcessing}
                                className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                              >
                                {isProcessing ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  "Yes"
                                )}
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-400"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {searchTerm || filterRole ? 'Try adjusting your filters' : 'Start by adding a user'}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredUsers.length > itemsPerPage && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      page === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md text-gray-500 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}