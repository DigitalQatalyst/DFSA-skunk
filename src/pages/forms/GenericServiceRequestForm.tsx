import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ArrowLeft, CheckCircle, Send, Upload, FileText, Building, Mail, Phone, User } from "lucide-react";

const GenericServiceRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get service details from navigation state
  const serviceDetails = location.state?.service || {
    title: "General Service Request",
    id: "general",
    provider: { name: "DFSA" }
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    licenseNumber: "",
    serviceType: serviceDetails.title,
    message: "",
    agreeToTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Submitted Successfully!</h2>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for requesting <strong>{serviceDetails.title}</strong>. Your application reference number is <span className="font-mono font-bold text-primary">REQ-{Math.floor(Math.random() * 100000)}</span>.
              <br />
              We have sent a confirmation email to <strong>{formData.email}</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return Home
              </button>
              <button 
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-md"
              >
                Track Request
              </button>
            </div>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Service Details
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary-dark px-8 py-6 text-white">
                  <h1 className="text-2xl font-bold mb-2">Service Request Form</h1>
                  <p className="text-white/80">Please fill in the details below to proceed with your request.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
                      <User size={20} className="mr-2 text-dfsa-gold" />
                      Applicant Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="name@company.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="+971 50 000 0000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
                      <Building size={20} className="mr-2 text-dfsa-gold" />
                      Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                        <input
                          type="text"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="Registered company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trade License Number</label>
                        <input
                          type="text"
                          name="licenseNumber"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="e.g. CN-1234567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center border-b pb-2">
                      <FileText size={20} className="mr-2 text-dfsa-gold" />
                      Request Details
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Requested</label>
                        <input
                          type="text"
                          name="serviceType"
                          readOnly
                          value={formData.serviceType}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information / Message</label>
                        <textarea
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                          placeholder="Please provide any additional details relevant to your request..."
                        ></textarea>
                      </div>
                      
                      {/* File Upload Placeholder */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">Upload Supporting Documents</p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms and Submit */}
                  <div className="pt-4 border-t border-gray-100">
                    <label className="flex items-start mb-6 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        required
                        checked={formData.agreeToTerms}
                        onChange={handleCheckboxChange}
                        className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I confirm that the information provided is accurate and I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                      </span>
                    </label>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 mr-4 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.agreeToTerms}
                        className={`px-8 py-3 bg-dfsa-gold text-white font-bold rounded-lg shadow-md flex items-center ${
                          isSubmitting || !formData.agreeToTerms 
                            ? "opacity-50 cursor-not-allowed" 
                            : "hover:bg-yellow-600 hover:shadow-lg transform hover:-translate-y-0.5"
                        } transition-all`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Request <Send size={18} className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Request Summary</h3>
                
                <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mr-4 p-2">
                     <img 
                        src={serviceDetails.provider?.logoUrl || "/mzn_logo.png"} 
                        alt="Provider" 
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/mzn_logo.png";
                        }}
                     />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{serviceDetails.title}</h4>
                    <p className="text-xs text-gray-500">{serviceDetails.provider?.name}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Service Type</span>
                    <span className="font-medium text-gray-900 text-right">{serviceDetails.serviceType || "General"}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Processing Time</span>
                    <span className="font-medium text-gray-900">{serviceDetails.processingTime || "N/A"}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-gray-100">
                    <span className="text-gray-500">Fees</span>
                    <span className="font-medium text-gray-900">{serviceDetails.price || serviceDetails.Cost || "Free"}</span>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h5 className="font-bold text-blue-800 text-sm mb-2">Need Help?</h5>
                  <p className="text-xs text-blue-600 mb-3">
                    If you're unsure about the requirements, you can contact our support team.
                  </p>
                  <a href="#" className="text-xs font-bold text-blue-700 hover:underline flex items-center">
                    <Phone size={12} className="mr-1" /> Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default GenericServiceRequestForm;
