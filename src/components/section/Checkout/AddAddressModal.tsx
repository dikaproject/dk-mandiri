'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { addAddress } from '@/services/address';
import { Address } from '@/types/address';

interface AddAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressAdded: (address: Address) => void;
}

export default function AddAddressModal({ isOpen, onClose, onAddressAdded }: AddAddressModalProps) {
    const [formData, setFormData] = useState({
        recipientName: '',
        phone: '',
        fullAddress: '',
        district: '',
        city: '',
        province: '',
        postalCode: '',
        isPrimary: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, isPrimary: e.target.checked });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            const newAddress = await addAddress({
                fullAddress: formData.fullAddress,
                district: formData.district,
                city: formData.city,
                province: formData.province,
                postalCode: formData.postalCode,
                isPrimary: formData.isPrimary,
                recipientName: formData.recipientName,  // Tambahkan field ini
                phone: formData.phone                   // Tambahkan field ini
            });

            onAddressAdded(newAddress);
            onClose();
            toast.success('Alamat berhasil ditambahkan');
        } catch (error) {
            console.error('Failed to add address:', error);
            toast.error('Gagal menambahkan alamat');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Tambah Alamat Baru
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nama Penerima
                            </label>
                            <input
                                type="text"
                                id="recipientName"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nomor Telepon
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                id="fullAddress"
                                name="fullAddress"
                                value={formData.fullAddress}
                                onChange={handleChange}
                                required
                                rows={2}
                                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kecamatan
                                </label>
                                <input
                                    type="text"
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kota/Kabupaten
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="province" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Provinsi
                                </label>
                                <input
                                    type="text"
                                    id="province"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kode Pos
                                </label>
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPrimary"
                                name="isPrimary"
                                checked={formData.isPrimary}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Jadikan sebagai alamat utama
                            </label>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2 px-4 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors focus:outline-none"
                        >
                            {isSubmitting ? <Loader2 size={20} /> : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}