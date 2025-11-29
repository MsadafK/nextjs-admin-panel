'use client';

import React, { useState } from 'react';
import { Key, Shield, Globe, Clock, Lock, Check, AlertCircle, Copy, Download, FileText, Terminal, Code, Settings, CheckCircle, XCircle, ChevronRight, ChevronLeft, Eye, EyeOff } from 'lucide-react';

export default function GenerateKey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    keyName: '',
    description: '',
    environment: 'development',
    scope: 'read-only',
    expiryDays: '90',
    ipRestriction: false,
    allowedIPs: '',
    rateLimit: '1000',
    rateLimitPeriod: 'hour',
    webhookUrl: '',
    notifyExpiry: true,
    customPermissions: {
      users: { read: false, write: false, delete: false },
      products: { read: false, write: false, delete: false },
      orders: { read: false, write: false, delete: false },
      analytics: { read: false, write: false, delete: false },
    }
  });

  const [generatedKey, setGeneratedKey] = useState(null);
  const [showKey, setShowKey] = useState(true);

  const steps = [
    { number: 1, title: 'Basic Info', icon: FileText },
    { number: 2, title: 'Permissions', icon: Shield },
    { number: 3, title: 'Security', icon: Lock },
    { number: 4, title: 'Review & Generate', icon: Key },
  ];

  const scopeOptions = [
    { value: 'read-only', label: 'Read Only', description: 'View data without modifications', icon: Eye, color: 'blue' },
    { value: 'read-write', label: 'Read & Write', description: 'View and modify data', icon: Settings, color: 'green' },
    { value: 'full-access', label: 'Full Access', description: 'Complete control including delete', icon: Shield, color: 'purple' },
    { value: 'custom', label: 'Custom', description: 'Define specific permissions', icon: Code, color: 'orange' },
  ];

  const environments = [
    { value: 'production', label: 'Production', color: 'red', description: 'Live environment' },
    { value: 'development', label: 'Development', color: 'blue', description: 'Testing and development' },
    { value: 'staging', label: 'Staging', color: 'yellow', description: 'Pre-production testing' },
    { value: 'testing', label: 'Testing', color: 'green', description: 'Automated testing' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (resource, action) => {
    setFormData(prev => ({
      ...prev,
      customPermissions: {
        ...prev.customPermissions,
        [resource]: {
          ...prev.customPermissions[resource],
          [action]: !prev.customPermissions[resource][action]
        }
      }
    }));
  };

  const handleGenerate = () => {
    const prefix = formData.environment === 'production' ? 'sk_prod_' : 
                   formData.environment === 'development' ? 'sk_dev_' :
                   formData.environment === 'staging' ? 'sk_stag_' : 'sk_test_';
    
    const randomKey = prefix + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    setGeneratedKey({
      key: randomKey,
      name: formData.keyName,
      environment: formData.environment,
      scope: formData.scope,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + parseInt(formData.expiryDays) * 24 * 60 * 60 * 1000).toISOString(),
    });
    
    setCurrentStep(5);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('API key copied to clipboard!');
  };

  const downloadKey = () => {
    const content = `API Key Configuration
======================

Key Name: ${generatedKey.name}
API Key: ${generatedKey.key}
Environment: ${generatedKey.environment}
Scope: ${generatedKey.scope}
Created: ${new Date(generatedKey.created).toLocaleString()}
Expires: ${new Date(generatedKey.expires).toLocaleString()}

IMPORTANT: Store this key securely. You won't be able to see it again.
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-key-${generatedKey.name}.txt`;
    a.click();
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate API Key</h1>
          <p className="text-gray-600">Create a new API key with custom permissions and security settings</p>
        </div>

        {currentStep <= 4 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted ? 'bg-green-500' :
                        isActive ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {isCompleted ? (
                          <Check size={24} className="text-white" />
                        ) : (
                          <StepIcon size={24} className={isActive ? 'text-white' : 'text-gray-500'} />
                        )}
                      </div>
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-4 rounded ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow border border-gray-200">
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.keyName}
                    onChange={(e) => handleInputChange('keyName', e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Choose a descriptive name for this API key</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the purpose of this key..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Environment <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {environments.map((env) => (
                      <button
                        key={env.value}
                        onClick={() => handleInputChange('environment', env.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.environment === env.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${env.color}-500`}></div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{env.label}</h3>
                            <p className="text-xs text-gray-600">{env.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Period <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.expiryDays}
                    onChange={(e) => handleInputChange('expiryDays', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="30">30 Days</option>
                    <option value="90">90 Days (Recommended)</option>
                    <option value="180">180 Days</option>
                    <option value="365">1 Year</option>
                    <option value="never">Never Expires</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Permissions & Scope</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Access Scope <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {scopeOptions.map((scope) => {
                      const ScopeIcon = scope.icon;
                      return (
                        <button
                          key={scope.value}
                          onClick={() => handleInputChange('scope', scope.value)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            formData.scope === scope.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 bg-${scope.color}-100 rounded-lg`}>
                              <ScopeIcon size={20} className={`text-${scope.color}-600`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{scope.label}</h3>
                              <p className="text-xs text-gray-600">{scope.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.scope === 'custom' && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Custom Permissions</h3>
                    <div className="space-y-4">
                      {Object.keys(formData.customPermissions).map((resource) => (
                        <div key={resource} className="p-3 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-3 capitalize">{resource}</h4>
                          <div className="flex gap-4">
                            {Object.keys(formData.customPermissions[resource]).map((action) => (
                              <label key={action} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.customPermissions[resource][action]}
                                  onChange={() => handlePermissionChange(resource, action)}
                                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{action}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Limit
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={formData.rateLimit}
                      onChange={(e) => handleInputChange('rateLimit', e.target.value)}
                      placeholder="1000"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={formData.rateLimitPeriod}
                      onChange={(e) => handleInputChange('rateLimitPeriod', e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="minute">per Minute</option>
                      <option value="hour">per Hour</option>
                      <option value="day">per Day</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Maximum number of requests allowed</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">IP Restriction</h3>
                      <p className="text-sm text-blue-800 mb-3">Restrict API access to specific IP addresses</p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.ipRestriction}
                          onChange={(e) => handleInputChange('ipRestriction', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-blue-900">Enable IP Restriction</span>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.ipRestriction && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed IP Addresses
                    </label>
                    <textarea
                      value={formData.allowedIPs}
                      onChange={(e) => handleInputChange('allowedIPs', e.target.value)}
                      placeholder="192.168.1.0/24&#10;10.0.0.50&#10;203.45.67.89"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">One IP address or CIDR range per line</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.webhookUrl}
                    onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                    placeholder="https://your-domain.com/webhook"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Receive notifications about key usage</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.notifyExpiry}
                      onChange={(e) => handleInputChange('notifyExpiry', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">Notify me before key expires</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 ml-6">You'll receive an email 7 days before expiration</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Generate</h2>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Configuration Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Key Name</label>
                      <p className="font-medium text-gray-900">{formData.keyName || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Environment</label>
                      <p className="font-medium text-gray-900 capitalize">{formData.environment}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Scope</label>
                      <p className="font-medium text-gray-900 capitalize">{formData.scope.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Expires In</label>
                      <p className="font-medium text-gray-900">
                        {formData.expiryDays === 'never' ? 'Never' : `${formData.expiryDays} days`}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">Rate Limit</label>
                      <p className="font-medium text-gray-900">{formData.rateLimit} / {formData.rateLimitPeriod}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">IP Restriction</label>
                      <p className="font-medium text-gray-900">{formData.ipRestriction ? 'Enabled' : 'Disabled'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-900 mb-1">Important</h3>
                      <p className="text-sm text-yellow-800">
                        Once generated, you won't be able to see this API key again. Make sure to copy and store it securely.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!formData.keyName}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  <Key size={24} />
                  Generate API Key
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && generatedKey && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key Generated Successfully!</h2>
                <p className="text-gray-600">Copy and save your key now. You won't be able to see it again.</p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-900 rounded-lg border-2 border-green-500">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-green-400">Your API Key</label>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <code className="block text-green-400 font-mono text-lg break-all">
                    {showKey ? generatedKey.key : '••••••••••••••••••••••••••••'}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => copyToClipboard(generatedKey.key)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy size={20} />
                    Copy Key
                  </button>
                  <button
                    onClick={downloadKey}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download size={20} />
                    Download Config
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Key Name:</span>
                      <span className="font-medium text-gray-900">{generatedKey.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <span className="font-medium text-gray-900 capitalize">{generatedKey.environment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">{new Date(generatedKey.created).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-gray-900">{new Date(generatedKey.expires).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900 mb-1">Security Warning</h3>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Store this key in a secure location</li>
                        <li>• Never commit it to version control</li>
                        <li>• Don't share it via email or messaging</li>
                        <li>• Rotate regularly for security</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Terminal size={20} />
                    View Documentation
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <CheckCircle size={20} />
                    I've Saved the Key
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep <= 4 && (
            <div className="p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              <div className="text-sm text-gray-600">
                Step {currentStep} of 4
              </div>
              <button
                onClick={nextStep}
                disabled={currentStep === 4 || (currentStep === 1 && !formData.keyName)}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? 'Generate' : 'Next'}
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}