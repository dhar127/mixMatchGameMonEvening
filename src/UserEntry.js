import React, { useState } from 'react';
import { useUser } from './UserContext';
import './UserEntry.css';

const UserEntry = () => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useUser();

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!school.trim()) {
      newErrors.school = 'School name is required';
    } else if (school.trim().length < 2) {
      newErrors.school = 'School name must be at least 2 characters';
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
    
    try {
      // Simulate a brief loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      login(name, school);
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
    if (errors.school) {
      setErrors(prev => ({ ...prev, school: '' }));
    }
  };

  return (
    <div className="user-entry-container">
      <div className="user-entry-backdrop">
        <div className="user-entry-card">
          <div className="user-entry-header">
            <h1 className="entry-title">Welcome to Mix and Match Contest for Budding Innovators!</h1>
            <p className="entry-subtitle">Enter your details to start playing educational games</p>
          </div>

          <form onSubmit={handleSubmit} className="user-entry-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="label-icon">👤</span>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter your full name"
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="school" className="form-label">
                <span className="label-icon">🏫</span>
                School Name
              </label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={handleSchoolChange}
                className={`form-input ${errors.school ? 'error' : ''}`}
                placeholder="Enter your school name"
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.school && <span className="error-message">{errors.school}</span>}
            </div>

            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}

            <button
              type="submit"
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Getting Ready...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Start Learning!
                </>
              )}
            </button>
          </form>

          <div className="entry-footer">
            <p className="footer-text">
              🎯 Track your progress • 🏆 Compete with friends • 📚 Learn while playing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEntry;