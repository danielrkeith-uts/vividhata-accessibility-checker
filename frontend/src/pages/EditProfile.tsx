import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { GlobalHeader } from "../components/common/GlobalHeader";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "./EditProfile.css";


//Need API to update account
//TODO: STYLE THIS PAGE BETTER
export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, checkAuthStatus } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    ocupation: "",
    purpose: "",
    // Password fields - only for changing password
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pre-populate form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        ocupation: user.ocupation || "",
        purpose: user.purpose || "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation (but can't change username typically)
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.ocupation.trim()) {
      newErrors.ocupation = "Occupation is required";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
    }

    // Password validation - only if changing password
    if (isChangingPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-zA-Z])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one letter";
      } else if (!/(?=.*[0-9])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one number";
      } else if (!/(?=.*[^a-zA-Z0-9])/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain at least one special character";
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = "Passwords do not match";
      }

      if (formData.currentPassword === formData.newPassword) {
        newErrors.newPassword = "New password must be different from current password";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Prepare update data
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ocupation: formData.ocupation,
        purpose: formData.purpose,
      };

      // Add password fields if changing password
      if (isChangingPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Call your update profile API
      const response = await fetch('http://localhost:8080/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh user data
      await checkAuthStatus();
      
      setSuccessMessage("Profile updated successfully!");
      
      // Clear password fields
      if (isChangingPassword) {
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        }));
        setIsChangingPassword(false);
      }

    } catch (error) {
      setErrors({
        general: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    // Clear general error and success message
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleCancel = () => {
    // Navigate back to dashboard or manage sites
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="edit-profile-page">
      <GlobalHeader />

      <main className="edit-profile-main">
        <div className="edit-profile-container">
          <form onSubmit={handleSubmit} className="edit-profile-form">
            {errors.general && (
              <div className="error-message" role="alert">
                {errors.general}
              </div>
            )}

            {successMessage && (
              <div className="success-message" role="alert">
                {successMessage}
              </div>
            )}

            <div className="personal-info-section">
              <h2 className="section-title">Personal Information</h2>
              
              <div className="form-row">
                <Input
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                  error={errors.firstName}
                  required
                  placeholder="Enter your first name"
                />

                <Input
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                  error={errors.lastName}
                  required
                  placeholder="Enter your last name"
                />
              </div>

              <div className="form-field">
                <Input
                  label="Email"
                  type="text"
                  value={formData.email}
                  onChange={(value) => handleInputChange("Email", value)}
                  error={errors.email}
                  required
                  disabled // Usually can't change username
                  placeholder="Email cannot be changed"
                />
              </div>

              <div className="form-field">
                <Select
                  label="Occupation"
                  value={formData.ocupation}
                  onChange={(value) => handleInputChange("ocupation", value)}
                  options={[
                    { value: "Developer", label: "Developer" },
                    { value: "Designer", label: "Designer" },
                    { value: "Manager", label: "Manager" },
                    { value: "QA", label: "QA" },
                    { value: "Other", label: "Other" },
                  ]}
                  error={errors.ocupation}
                  required
                  fullWidth
                />
              </div>

              <div className="form-field">
                <Select
                  label="What are you using this tool for?"
                  value={formData.purpose}
                  onChange={(value) => handleInputChange("purpose", value)}
                  options={[
                    { value: "Personal", label: "Personal" },
                    { value: "Business", label: "Business" },
                    { value: "Education", label: "Education" },
                    { value: "Other", label: "Other" },
                  ]}
                  error={errors.purpose}
                  required
                  fullWidth
                />
              </div>
            </div>

            <div className="password-section">              
              <div className="form-field">
                <Button
                  type="button"
                  variant="outline"
                  size="medium"
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                >
                  {isChangingPassword ? "Cancel Password Change" : "Change Password"}
                </Button>
              </div>

              {isChangingPassword && (
                <>
                  <div className="form-field">
                    <Input
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={(value) => handleInputChange("currentPassword", value)}
                      error={errors.currentPassword}
                      required
                      placeholder="Enter your current password"
                      endAdornment={<button 
                        type="button" 
                        className="password-toggle"
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                        aria-pressed={showCurrentPassword}
                        onClick={() => setShowCurrentPassword((v) => !v)}>
                        {showCurrentPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                      </button>}
                    />
                  </div>

                  <div className="form-field">
                    <Input
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(value) => handleInputChange("newPassword", value)}
                      error={errors.newPassword}
                      required
                      placeholder="Enter your new password"
                      endAdornment={<button 
                        type="button" 
                        className="password-toggle"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                        aria-pressed={showNewPassword}
                        onClick={() => setShowNewPassword((v) => !v)}>
                        {showNewPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                      </button>}
                    />
                  </div>

                  <div className="password-requirements">
                    <p className="password-requirements-title">
                      Password must contain:
                    </p>
                    <ul className="password-requirements-list">
                      <li
                        className={
                          formData.newPassword.length >= 8
                            ? "requirement-met"
                            : "requirement-unmet"
                        }
                      >
                        At least 8 characters
                      </li>
                      <li
                        className={
                          /(?=.*[a-zA-Z])/.test(formData.newPassword)
                            ? "requirement-met"
                            : "requirement-unmet"
                        }
                      >
                        At least one letter
                      </li>
                      <li
                        className={
                          /(?=.*[0-9])/.test(formData.newPassword)
                            ? "requirement-met"
                            : "requirement-unmet"
                        }
                      >
                        At least one number
                      </li>
                      <li
                        className={
                          /(?=.*[^a-zA-Z0-9])/.test(formData.newPassword)
                            ? "requirement-met"
                            : "requirement-unmet"
                        }
                      >
                        At least one special character
                      </li>
                    </ul>
                  </div>

                  <div className="form-field">
                    <Input
                      label="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmNewPassword}
                      onChange={(value) => handleInputChange("confirmNewPassword", value)}
                      error={errors.confirmNewPassword}
                      required
                      placeholder="Confirm your new password"
                      endAdornment={<button 
                        type="button" 
                        className="password-toggle"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        aria-pressed={showConfirmPassword}
                        onClick={() => setShowConfirmPassword((v) => !v)}>
                        {showConfirmPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                      </button>}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                size="large"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};