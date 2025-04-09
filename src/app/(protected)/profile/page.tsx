'use client';

import { useState, useRef } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiFileText, 
  FiGlobe, 
  FiTwitter, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiSave, 
  FiCamera, 
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Content creator passionate about technology and digital marketing.',
    website: 'https://johndoe.com',
    twitter: '@johndoe',
    avatar: '/api/placeholder/150/150', // Placeholder avatar
  });
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    website: profile.website,
    twitter: profile.twitter,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength if new password is changed
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };
  
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // This would be replaced with actual API call
    console.log('Updating profile with:', formData);
    
    // Mock successful update
    setTimeout(() => {
      setProfile({
        ...profile,
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        website: formData.website,
        twitter: formData.twitter,
      });
      
      setIsSuccess(true);
      setIsSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 800);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setIsSaving(false);
      return;
    }
    
    if (formData.newPassword && formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setIsSaving(false);
      return;
    }
    
    // Clear previous errors
    setError('');
    
    // This would be replaced with actual API call
    console.log('Updating password');
    
    // Mock successful update
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      
      setPasswordStrength(0);
      setIsSuccess(true);
      setIsSaving(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }, 800);
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    // This would be replaced with actual file upload API call
    console.log('File selected:', e.target.files[0]);
    
    if (e.target.files && e.target.files[0]) {
      // Mock avatar update
      setIsSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profile information and password
          </p>
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                <FiUser className="mr-2 h-5 w-5" />
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`${
                  activeTab === 'password'
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                } flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200`}
              >
                <FiLock className="mr-2 h-5 w-5" />
                Change Password
              </button>
            </nav>
          </div>
          
          {/* Content Container */}
          <div className="p-6">
            {/* Success Message */}
            {isSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-center">
                <FiCheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Your changes have been saved successfully.
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-center">
                <FiAlertCircle className="h-5 w-5 mr-2 text-red-500" />
                {error}
              </div>
            )}
            
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                {/* Profile Overview */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center text-center sm:text-left">
                  <div className="relative mb-4 sm:mb-0 sm:mr-6">
                    <div 
                      className="h-24 w-24 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center overflow-hidden"
                      onClick={handleAvatarClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={profile.avatar} 
                        alt={profile.name} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full">
                        <FiCamera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
                    <p className="text-gray-600 mt-2">{profile.bio}</p>
                    <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-3">
                      {profile.website && (
                        <a 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <FiGlobe className="h-4 w-4 mr-1" />
                          Website
                        </a>
                      )}
                      {profile.twitter && (
                        <a 
                          href={`https://twitter.com/${profile.twitter.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <FiTwitter className="h-4 w-4 mr-1" />
                          {profile.twitter}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiFileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="bio"
                          id="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Brief description for your profile. URLs are hyperlinked.
                      </p>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiGlobe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter Handle
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiTwitter className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="twitter"
                          id="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="@username"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className={`inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                        isSaving 
                          ? 'bg-indigo-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      } transition-colors duration-200`}
                    >
                      <FiSave className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="max-w-md mx-auto">
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            {showCurrentPassword ? (
                              <FiEyeOff className="h-5 w-5" />
                            ) : (
                              <FiEye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            {showNewPassword ? (
                              <FiEyeOff className="h-5 w-5" />
                            ) : (
                              <FiEye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Password strength indicator */}
                      {formData.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700">Password strength:</span>
                            <span className="text-xs font-medium">
                              {passwordStrength === 0 && 'Very weak'}
                              {passwordStrength === 1 && 'Weak'}
                              {passwordStrength === 2 && 'Medium'}
                              {passwordStrength === 3 && 'Strong'}
                              {passwordStrength === 4 && 'Very strong'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                passwordStrength === 0 ? 'bg-red-500 w-1/5' : 
                                passwordStrength === 1 ? 'bg-orange-500 w-2/5' : 
                                passwordStrength === 2 ? 'bg-yellow-500 w-3/5' : 
                                passwordStrength === 3 ? 'bg-lime-500 w-4/5' : 
                                'bg-green-500 w-full'
                              }`}
                            ></div>
                          </div>
                          <ul className="mt-2 text-xs text-gray-500 space-y-1">
                            <li className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              At least 8 characters
                            </li>
                            <li className={`flex items-center ${/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              At least one uppercase letter
                            </li>
                            <li className={`flex items-center ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${/[0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              At least one number
                            </li>
                            <li className={`flex items-center ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}`}>
                              <span className={`inline-block w-2 h-2 mr-2 rounded-full ${/[^A-Za-z0-9]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                              At least one special character
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-10 border ${
                            formData.confirmPassword && formData.confirmPassword !== formData.newPassword 
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                          } rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                          >
                            {showConfirmPassword ? (
                              <FiEyeOff className="h-5 w-5" />
                            ) : (
                              <FiEye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      {formData.confirmPassword && formData.confirmPassword !== formData.newPassword && (
                        <p className="mt-1 text-xs text-red-600">
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSaving || (formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '')}
                      className={`inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                        isSaving || (formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== '')
                          ? 'bg-indigo-400 cursor-not-allowed' 
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      } transition-colors duration-200`}
                    >
                      <FiSave className="h-4 w-4 mr-2" />
                      {isSaving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}