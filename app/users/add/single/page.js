'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Upload, X, Check, AlertCircle, Eye, EyeOff, Shield, Building, Globe, Lock } from 'lucide-react';



export default function AddSingleUser() {
  const colors = {
    primary: 'bg-foreground',
    primaryBg: 'bg-muted',
    primaryText: 'text-foreground',
  };
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    department: '',
    position: '',
    employeeId: '',
    joiningDate: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          city: '',
          country: '',
          zipCode: '',
          department: '',
          position: '',
          employeeId: '',
          joiningDate: '',
          role: 'user',
          password: '',
          confirmPassword: '',
          profileImage: null
        });
        setImagePreview(null);
        setSubmitSuccess(false);
      }, 2000);
    }, 1500);
  };

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className={`bg-card rounded-xl shadow-sm border border-border p-6`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-2 ${colors.primaryBg} rounded-lg`}>
          <Icon size={20} className={colors.primaryText} />
        </div>
        <h3 className={`text-lg font-semibold text-foreground`}>{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, error, ...props }) => (
    <div className="space-y-1.5">
      <label className={`block text-sm font-medium text-foreground`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon size={18} className={'text-muted-foreground'} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-lg border ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : `border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-blue-500`
          } focus:ring-2 focus:ring-opacity-50 outline-none transition-all`}
          {...props}
        />
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-red-500 text-xs mt-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required = false, error }) => (
    <div className="space-y-1.5">
      <label className={`block text-sm font-medium text-foreground`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full px-4 py-2.5 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : `border-border bg-card text-foreground focus:border-blue-500`
        } focus:ring-2 focus:ring-opacity-50 outline-none transition-all`}
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && (
        <div className="flex items-center space-x-1 text-red-500 text-xs mt-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  const PasswordField = ({ label, name, placeholder, showPassword, onToggle, required = false, error }) => (
    <div className="space-y-1.5">
      <label className={`block text-sm font-medium text-foreground`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Lock size={18} className={'text-muted-foreground'} />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : `border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-blue-500`
          } focus:ring-2 focus:ring-opacity-50 outline-none transition-all`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground transition-colors"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-red-500 text-xs mt-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-lg sm:text-xl font-semibold tracking-tight text-foreground mb-2`}>
          Add New User
        </h1>
        <p className={`text-muted-foreground`}>
          Create a new user account by filling out the form below
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-muted dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3">
          <div className="p-2 bg-muted0 rounded-full">
            <Check size={20} className="text-background" />
          </div>
          <div>
            <h4 className="font-semibold text-green-800 dark:text-green-300">Success!</h4>
            <p className="text-sm text-green-700 dark:text-green-400">User has been created successfully</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Upload */}
        <FormSection title="Profile Picture" icon={User}>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-border dark:border-border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1.5 bg-muted0 text-background rounded-full hover:bg-red-600 transition-colors shadow-card"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border`}>
                  <User size={48} className={'text-muted-foreground'} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className={`block text-sm font-medium text-foreground mb-2`}>
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-upload"
              />
              <label
                htmlFor="profile-upload"
                className={`inline-flex items-center px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted cursor-pointer transition-colors`}
              >
                <Upload size={18} className="mr-2" />
                Choose Image
              </label>
              <p className={`mt-2 text-xs text-muted-foreground`}>
                Recommended: Square image, at least 400x400px. Max size: 5MB
              </p>
              {errors.profileImage && (
                <div className="flex items-center space-x-1 text-red-500 text-xs mt-2">
                  <AlertCircle size={12} />
                  <span>{errors.profileImage}</span>
                </div>
              )}
            </div>
          </div>
        </FormSection>

        {/* Personal Information */}
        <FormSection title="Personal Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              placeholder="Enter first name"
              icon={User}
              required
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              name="lastName"
              placeholder="Enter last name"
              icon={User}
              required
              error={errors.lastName}
            />
            <InputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="example@company.com"
              icon={Mail}
              required
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={Phone}
              required
              error={errors.phone}
            />
            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              icon={Calendar}
            />
            <SelectField
              label="Gender"
              name="gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer_not_to_say', label: 'Prefer not to say' }
              ]}
            />
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection title="Address Information" icon={MapPin}>
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="Street Address"
              name="address"
              placeholder="123 Main Street"
              icon={MapPin}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="City"
                name="city"
                placeholder="New York"
                icon={Building}
              />
              <InputField
                label="Country"
                name="country"
                placeholder="United States"
                icon={Globe}
              />
              <InputField
                label="Zip Code"
                name="zipCode"
                placeholder="10001"
              />
            </div>
          </div>
        </FormSection>

        {/* Professional Information */}
        <FormSection title="Professional Information" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Department"
              name="department"
              required
              error={errors.department}
              options={[
                { value: 'engineering', label: 'Engineering' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'sales', label: 'Sales' },
                { value: 'hr', label: 'Human Resources' },
                { value: 'finance', label: 'Finance' },
                { value: 'operations', label: 'Operations' }
              ]}
            />
            <InputField
              label="Position"
              name="position"
              placeholder="Software Engineer"
              icon={Briefcase}
              required
              error={errors.position}
            />
            <InputField
              label="Employee ID"
              name="employeeId"
              placeholder="EMP-001"
              icon={User}
            />
            <InputField
              label="Joining Date"
              name="joiningDate"
              type="date"
              icon={Calendar}
            />
          </div>
        </FormSection>

        {/* Account Settings */}
        <FormSection title="Account Settings" icon={Shield}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="User Role"
              name="role"
              required
              error={errors.role}
              options={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'viewer', label: 'Viewer' }
              ]}
            />
            <div></div>
            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter password"
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              required
              error={errors.password}
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter password"
              showPassword={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              required
              error={errors.confirmPassword}
            />
          </div>
          <div className={`p-4 rounded-lg bg-muted border border-blue-200`}>
            <p className={`text-sm text-blue-800`}>
              <strong>Password Requirements:</strong> Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
            </p>
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border dark:border-border">
          <button
            type="button"
            className={`px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-lg ${colors.primary} text-background font-medium hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating User...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Create User</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}