"use client";
import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, changePassword, getUserOrders } from '@/services/profile';
import { getUserAddresses, setDefaultAddress, deleteAddress } from '@/services/address';
import { useAuth } from '@/context/AuthContext';
import { 
  User as UserIcon, 
  Lock, 
  ShoppingBag, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Package, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatToIDR } from '@/utils/formatter';
import { Address } from '@/types/address';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { User } from '@/types/auth';
import axios from 'axios';

// Define types for our orders and order items
interface OrderItem {
  id: string;
  weight: number;
  price: number;
  productId: string;
  orderId: string;
  product: {
    name: string;
    slug: string;
    images: { imageUrl: string }[];
  };
  productImage?: string;
}

interface Transaction {
  status: string;
  paymentMethod: string;
  transactionDate: string;
  paymentProof?: string;
  amount: number;
}

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderItems: OrderItem[];
  transaction?: Transaction;
}

interface PaginatedOrders {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // UI States
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  
  // Data States
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orderStatus, setOrderStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch initial data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoadingProfile(true);
        const profileData = await getUserProfile();
        setProfileData({
          username: profileData.username || '',
          email: profileData.email || '',
          phone: profileData.phone || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    loadProfileData();
  }, []);
  
  // Load orders when tab changes or filters change
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, orderStatus, currentPage]);
  
  // Load addresses when tab changes
  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab]);
  
  // Fetch orders with filters
  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await getUserOrders({
        status: orderStatus !== 'ALL' ? orderStatus : undefined,
        page: currentPage,
        limit: 5
      }) as PaginatedOrders;
      
      setOrders(response.orders);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const addressData = await getUserAddresses();
      setAddresses(addressData);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoadingAddresses(false);
    }
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserProfile(profileData);
      
      // Update the user in auth context
      if (user && updateUser) {
        updateUser({...user, ...updatedUser});
      }
      
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update profile';
      toast.error(errorMessage);
    }
  };
  
// Handle password change
const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    toast.error('New passwords do not match');
    return;
  }
  
  try {
    await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    toast.success('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    
    // Check if the error is related to incorrect current password
    if (axios.isAxiosError(error) && error.response?.status === 400 && 
        error.response.data?.message === 'Current password is incorrect') {
      toast.error('Password awal yang anda masukan salah');
    } else {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to change password';
      toast.error(errorMessage);
    }
  }
};
  
  // Handle set default address
  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to update default address');
    }
  };
  
  // Handle delete address
  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };
  
  // Order status badge component
  const OrderStatusBadge = ({ status }: { status: string }) => {
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'PROCESSING': { color: 'bg-blue-100 text-blue-800', icon: Package },
      'SHIPPED': { color: 'bg-purple-100 text-purple-800', icon: Truck },
      'DELIVERED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'CANCELLED': { color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };
    
    const defaultStatus = { color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    const { color, icon: Icon } = 
      status in statusMap 
        ? statusMap[status as keyof typeof statusMap]
        : defaultStatus;
    
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon size={12} />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
        
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'profile' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'orders' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            <span>Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              activeTab === 'addresses' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <MapPin className="w-5 h-5 mr-2" />
            <span>Addresses</span>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {isLoadingProfile ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Profile Information */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Profile Information
                      </h2>
                      
                      {isEditingProfile ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setIsEditingProfile(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsEditingProfile(true)}
                          className="flex items-center text-cyan-600 hover:text-cyan-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                    
                    {isEditingProfile ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            value={profileData.username}
                            onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={profileData.phone || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            <Save className="h-4 w-4 mr-2 inline-block" />
                            Save Changes
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</p>
                          <p className="mt-1 text-gray-900 dark:text-white">{profileData.username}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                          <p className="mt-1 text-gray-900 dark:text-white">{profileData.email}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="mt-1 text-gray-900 dark:text-white">{profileData.phone || '-'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                          <p className="mt-1 text-gray-900 dark:text-white">
                            {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : '-'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Password Section */}
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Password
                      </h2>
                      
                      {isChangingPassword ? (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => setIsChangingPassword(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsChangingPassword(true)}
                          className="flex items-center text-cyan-600 hover:text-cyan-700"
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          <span>Change Password</span>
                        </button>
                      )}
                    </div>
                    
                    {isChangingPassword ? (
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:text-white"
                            required
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        Your password is securely stored. Click "Change Password" to update it.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Orders
                </h2>
                
                {/* Order status filter */}
                <div>
                  <select
                    value={orderStatus}
                    onChange={(e) => {
                      setOrderStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="ALL">All Orders</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              
              {isLoadingOrders ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Placed on {format(new Date(order.orderDate), 'MMMM d, yyyy')}
                          </p>
                        </div>
                        
                        <div className="flex items-start md:items-center flex-col md:flex-row gap-2 md:gap-4">
                          <OrderStatusBadge status={order.status} />
                          
                          <Link 
                            href={`/orders/${order.id}`}
                            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Order Items Summary */}
                        <div className="md:col-span-2">
                          <div className="flex flex-wrap gap-2">
                            {order.orderItems.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
                                  {item.productImage ? (
                                    <Image 
                                      src={item.productImage} 
                                      alt={item.product.name} 
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-full w-full">
                                      <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-2">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.product.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.weight}g</p>
                                </div>
                              </div>
                            ))}
                            
                            {order.orderItems.length > 3 && (
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  +{order.orderItems.length - 3} more items
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Order Total */}
                        <div className="md:text-right">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatToIDR(order.totalAmount)}</p>
                          {order.transaction && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.transaction.paymentMethod}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <div className="flex items-center px-4 py-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No orders found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    You haven't placed any orders yet.
                  </p>
                  <div className="mt-6">
                    <Link href="/products" className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                      Browse Products
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  My Addresses
                </h2>
                
                <Link
                  href="/profile/addresses/add"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                >
                  Add New Address
                </Link>
              </div>
              
              {isLoadingAddresses ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-cyan-600 animate-spin" />
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address) => (
                    <div 
                      key={address.id} 
                      className={`relative rounded-lg border p-4 ${
                        address.isPrimary 
                          ? 'border-cyan-200 bg-cyan-50 dark:border-cyan-900 dark:bg-cyan-900/30' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {address.isPrimary && (
                        <span className="absolute top-2 right-2 px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100 text-xs rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="space-y-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {address.recipientName || user?.username || ''}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{address.phone || user?.phone || ''}</p>
                        
                        <div className="mt-4 text-gray-700 dark:text-gray-300">
                          <p>{address.fullAddress}</p>
                          <p>{address.district}, {address.city}</p>
                          <p>{address.province}, {address.postalCode}</p>
                        </div>
                        
                        <div className="mt-4 flex space-x-4">
                          <Link
                            href={`/profile/addresses/edit/${address.id}`}
                            className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          
                          {!address.isPrimary && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                          
                          {!address.isPrimary && (
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No addresses found</h3>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    Add a new address to make checkout faster.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="/profile/addresses/add" 
                      className="inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                    >
                      Add Address
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}