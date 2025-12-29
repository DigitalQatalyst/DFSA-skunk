import React, { useState } from "react";
import { X } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onSignInSuccess,
  onSwitchToSignUp,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual authentication when ready
      // For demo mode, simulate successful login
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Demo sign in:", formData.email);

      if (onSignInSuccess) {
        onSignInSuccess();
      }

      // Redirect to dashboard
      window.location.href = '/dashboard/overview';
    } catch (err) {
      setError("Authentication failed. Please verify your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleClose = () => {
    onClose();
    setError(null);
    setFormData({ email: "", password: "" });
  };

  const handleSwitchToSignUp = () => {
    handleClose();
    if (onSwitchToSignUp) {
      onSwitchToSignUp();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-xl">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-600 text-sm">
              Access your DFSA regulatory platform account
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 ml-4 flex-shrink-0"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Do not have an account?{" "}
              <button
                onClick={handleSwitchToSignUp}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                type="button"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
