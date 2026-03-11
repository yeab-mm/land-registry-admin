'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import { useTranslation } from '@/lib/useTranslation';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface FormData {
  title: string;
  description: string;
  location: string;
  price: string;
  area: string;
  type: 'residential' | 'commercial' | 'agricultural';
  status: 'active' | 'pending';
  sellerName: string;
  sellerPhone: string;
  features: string[];
  images: string[];
}

export default function AddNewListingPage() {
  const router = useRouter();
  const { darkMode } = useLanguage();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [featureInput, setFeatureInput] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    location: '',
    price: '',
    area: '',
    type: 'residential',
    status: 'active',
    sellerName: '',
    sellerPhone: '',
    features: [],
    images: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cn = (darkClass: string, lightClass: string): string => {
    return darkMode ? darkClass : lightClass;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title) newErrors.title = t('titleRequired');
    if (!formData.description) newErrors.description = t('descriptionRequired');
    if (!formData.location) newErrors.location = t('locationRequired');
    if (!formData.price) newErrors.price = t('priceRequired');
    if (!formData.area) newErrors.area = t('areaRequired');
    if (!formData.sellerName) newErrors.sellerName = t('sellerNameRequired');
    if (!formData.sellerPhone) newErrors.sellerPhone = t('sellerPhoneRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/marketplace');
      }, 2000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - in real app, you'd upload to server
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/marketplace"
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className={`text-2xl font-bold ${cn('text-white', 'text-gray-900')}`}>
          {t('addNewListing')}
        </h1>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          <span>{t('listingCreatedSuccess')}</span>
        </div>
      )}

      {/* Form */}
      <div className={`${cn('bg-gray-800', 'bg-white')} rounded-xl shadow-sm p-6`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className={`text-lg font-medium mb-4 ${cn('text-white', 'text-gray-900')}`}>
              {t('basicInformation')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('listingTitle')} *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${errors.title ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                  placeholder={t('enterListingTitle')}
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('description')} *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${errors.description ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                  placeholder={t('enterDescription')}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('location')} *
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                      ${errors.location ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                      ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                    `}
                    placeholder={t('enterLocation')}
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>

              {/* Price */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('price')} (ETB) *
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                      ${errors.price ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                      ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                    `}
                    placeholder={t('enterPrice')}
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
              </div>

              {/* Area */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('area')} (sqm) *
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${errors.area ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                  placeholder={t('enterArea')}
                />
                {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
              </div>

              {/* Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('propertyType')} *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                >
                  <option value="residential">{t('residential')}</option>
                  <option value="commercial">{t('commercial')}</option>
                  <option value="agricultural">{t('agricultural')}</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('listingStatus')} *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                >
                  <option value="active">{t('active')}</option>
                  <option value="pending">{t('pending')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="pt-6 border-t ${cn('border-gray-700', 'border-gray-200')}">
            <h2 className={`text-lg font-medium mb-4 ${cn('text-white', 'text-gray-900')}`}>
              {t('sellerInformation')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seller Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('sellerName')} *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="sellerName"
                    value={formData.sellerName}
                    onChange={handleChange}
                    className={`
                      w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                      ${errors.sellerName ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                      ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                    `}
                    placeholder={t('enterSellerName')}
                  />
                </div>
                {errors.sellerName && <p className="mt-1 text-sm text-red-500">{errors.sellerName}</p>}
              </div>

              {/* Seller Phone */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${cn('text-gray-300', 'text-gray-700')}`}>
                  {t('sellerPhone')} *
                </label>
                <input
                  type="tel"
                  name="sellerPhone"
                  value={formData.sellerPhone}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${errors.sellerPhone ? 'border-red-500' : cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                  placeholder={t('enterSellerPhone')}
                />
                {errors.sellerPhone && <p className="mt-1 text-sm text-red-500">{errors.sellerPhone}</p>}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="pt-6 border-t ${cn('border-gray-700', 'border-gray-200')}">
            <h2 className={`text-lg font-medium mb-4 ${cn('text-white', 'text-gray-900')}`}>
              {t('features')}
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className={`
                    flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${cn('border-gray-600', 'border-gray-300')}
                    ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}
                  `}
                  placeholder={t('enterFeature')}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {t('add')}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className={`
                      inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                      ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                    `}
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="hover:text-red-500"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="pt-6 border-t ${cn('border-gray-700', 'border-gray-200')}">
            <h2 className={`text-lg font-medium mb-4 ${cn('text-white', 'text-gray-900')}`}>
              {t('propertyImages')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  className={`
                    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                    ${darkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className={`text-sm ${cn('text-gray-400', 'text-gray-500')}`}>
                      {t('clickToUpload')}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t ${cn('border-gray-700', 'border-gray-200')}">
            <Link
              href="/admin/marketplace"
              className={`
                px-4 py-2 rounded-lg transition-colors
                ${darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {t('cancel')}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('creating')}
                </>
              ) : (
                t('createListing')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}