import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import "./RegisterPage.css";
import { RegisterCredentials } from "../types";
import { Select } from "../components/common/Select";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    ocupation: "",
    purpose: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-zA-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter";
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/(?=.*[^a-zA-Z0-9])/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.ocupation.trim()) {
      newErrors.ocuptation = "Ocupation is required";
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required";
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

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        ocupation: formData.ocupation as RegisterCredentials["ocupation"],
        purpose: formData.purpose as RegisterCredentials["purpose"],
      });
      navigate("/");
    } catch (error) {
      setErrors({
        general: "Registration failed. Email might already be in use.",
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

    // Clear general error
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join the accessibility checker platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {errors.general && (
            <div className="error-message" role="alert">
              {errors.general}
            </div>
          )}

          <div className="form-row">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(value) => handleInputChange("firstName", value)}
              error={errors.firstName}
              required
              autoComplete="given-name"
              placeholder="Enter your first name"
            />

            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(value) => handleInputChange("lastName", value)}
              error={errors.lastName}
              required
              autoComplete="family-name"
              placeholder="Enter your last name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            error={errors.email}
            required
            autoComplete="email"
            placeholder="Enter your email address"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            error={errors.password}
            required
            autoComplete="new-password"
            placeholder="Create a password"
          />
          <div className="password-requirements">
            <p className="password-requirements-title">
              Password must contain:
            </p>
            <ul className="password-requirements-list">
              <li
                className={
                  formData.password.length >= 8
                    ? "requirement-met"
                    : "requirement-unmet"
                }
              >
                At least 8 characters
              </li>
              <li
                className={
                  /(?=.*[a-zA-Z])/.test(formData.password)
                    ? "requirement-met"
                    : "requirement-unmet"
                }
              >
                At least one letter
              </li>
              <li
                className={
                  /(?=.*[0-9])/.test(formData.password)
                    ? "requirement-met"
                    : "requirement-unmet"
                }
              >
                At least one number
              </li>
              <li
                className={
                  /(?=.*[^a-zA-Z0-9])/.test(formData.password)
                    ? "requirement-met"
                    : "requirement-unmet"
                }
              >
                At least one special character
              </li>
            </ul>
          </div>
{/* TODO: Implement toggle to view password */}
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange("confirmPassword", value)}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            placeholder="Confirm your password"
          />

{/* TODO: Get finalised list of occupations */}
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
{/* TODO: Get finalised list of purposes */}
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

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="register-footer">
          <p className="register-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="register-footer-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
