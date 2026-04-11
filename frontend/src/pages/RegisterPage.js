// frontend/src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
    gender: '',
    accountType: '',
    experience: '',
    sports: [],
    terms: false,
    securityQuestion: '',
    securityAnswer: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'terms') {
      setFormData(prev => ({ ...prev, terms: checked }));
    } else if (type === 'checkbox' && name === 'sports') {
      const sportsArray = [...formData.sports];
      if (checked) {
        sportsArray.push(value);
      } else {
        const index = sportsArray.indexOf(value);
        if (index > -1) sportsArray.splice(index, 1);
      }
      setFormData(prev => ({ ...prev, sports: sportsArray }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 13) {
        newErrors.dob = "You must be at least 13 years old to register";
      }
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.accountType) newErrors.accountType = "Account Type is required";
    if (!formData.experience) newErrors.experience = "Experience Level is required";
    if (formData.sports.length === 0) newErrors.sports = "Please select at least one sport";
    if (!formData.terms) newErrors.terms = "You must agree to the Terms and Privacy Policy";

    if (!formData.securityQuestion) newErrors.securityQuestion = "Please select a security question";
    if (!formData.securityAnswer) newErrors.securityAnswer = "Please provide a security answer";
    if (formData.securityAnswer && formData.securityAnswer.length < 2) newErrors.securityAnswer = "Answer must be at least 2 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const apiData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        dob: formData.dob,
        gender: formData.gender,
        accountType: formData.accountType,
        experience: formData.experience,
        sports: formData.sports,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer
      };
      
      console.log('Sending registration data:', apiData);
      
      const { data } = await API.post('/auth/register', apiData);
      localStorage.setItem('token', data.token);
      setSubmitted(true);
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const styles = {
    container: {
      width: '90%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    hero: {
      color: 'white',
      textAlign: 'center',
      padding: '6rem 2rem',
      marginBottom: '3rem',
      borderRadius: '0 0 15px 15px',
      background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/assets/CCSwJia.jpg') center/cover no-repeat",
      transition: 'background 0.3s ease'
    },
    heroH1: {
      fontSize: '3rem',
      marginBottom: '1.5rem',
      color: 'white'
    },
    heroP: {
      fontSize: '1.2rem',
      maxWidth: '700px',
      margin: '0 auto 2rem',
      opacity: 0.9
    },
    highlightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
      marginBottom: '7rem'
    },
    card: {
      background: 'var(--card-bg)',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    cardImg: {
      width: '100%',
      height: '200px',
      objectFit: 'cover'
    },
    cardContent: {
      padding: '1.5rem'
    },
    section: {
      padding: '4rem 0'
    },
    h2: {
      fontSize: '2rem',
      color: 'var(--primary-color)',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: '1rem'
    },
    h3: {
      fontSize: '1.5rem',
      color: 'var(--secondary-color)',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: '1rem'
    },
    formRow: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    },
    formGroup: {
      marginBottom: '1.5rem',
      flex: 1
    },
    label: {
      fontWeight: 'bold',
      display: 'block',
      marginBottom: '0.5rem',
      color: 'var(--text)'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid var(--muted-border)',
      borderRadius: '4px',
      fontSize: '1rem',
      background: 'var(--card-bg)',
      color: 'var(--text)',
      transition: 'all 0.3s ease'
    },
    error: {
      color: '#dc3545',
      fontSize: '0.875rem',
      marginTop: '0.25rem',
      display: 'block'
    },
    errorBorder: {
      borderColor: '#dc3545'
    },
    radioGroup: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      marginTop: '0.5rem'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      marginTop: '0.5rem',
      color: 'var(--text)'
    },
    checkboxGroup: {
      display: 'inline-block',
      marginTop: '0.5rem'
    },
    checkboxOption: {
      display: 'inline',
      cursor: 'pointer',
      marginRight: '90px',
      color: 'var(--text)'
    },
    formContainer: {
      background: 'var(--card-bg)',
      border: '1px solid var(--muted-border)',
      borderRadius: '8px',
      padding: '1.5rem',
      margin: '1.5rem 0',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease'
    },
    formContainerH3: {
      marginTop: 0,
      marginBottom: '1rem',
      color: 'var(--text)',
      fontSize: '1.2rem',
      borderBottom: '2px solid var(--primary-color)',
      paddingBottom: '0.5rem'
    },
    termsContent: {
      background: 'var(--card-bg)',
      border: '1px solid var(--muted-border)',
      borderRadius: '4px',
      padding: '1rem',
      margin: '1rem 0',
      maxHeight: '200px',
      overflowY: 'auto'
    },
    termsContentP: {
      margin: '0.75rem 0',
      lineHeight: 1.5,
      color: 'var(--text)'
    },
    termsContentStrong: {
      color: 'var(--text)',
      display: 'inline-block',
      minWidth: '140px'
    },
    checkboxOptionTerms: {
      display: 'inline-flex',
      color: 'white',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '16px',
      marginLeft: '20%',
      borderRadius: '12px',
      border: '1px solid var(--secondary-color)',
      backgroundColor: 'var(--primary-color)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    btn: {
      display: 'inline-block',
      padding: '0.8rem 2rem',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    small: {
      fontSize: '0.875rem',
      display: 'block',
      marginTop: '0.25rem',
      color: 'var(--text)'
    },
    errorMsg: {
      color: '#dc3545',
      background: '#f8d7da',
      padding: '10px',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    successMsg: {
      color: 'green',
      marginTop: '1rem'
    }
  };

  return (
    <main style={styles.container}>
      {/* Page Title */}
      <section style={styles.hero} className="fade-in">
        <h1 style={styles.heroH1}>Join Our Sports Community</h1>
        <p style={styles.heroP}>Sign up for updates, newsletters, and exclusive sports content</p>
      </section>

      {/* Registration Info */}
      <section>
        <div style={styles.highlightsGrid}>
          <div style={styles.card}>
            <img src="/assets/WarmUp.jpg" alt="Athletes training together" loading="lazy" style={styles.cardImg} />
            <div style={styles.cardContent}>
              <h3 style={styles.h3}>What You'll Receive</h3>
              <ul style={{ paddingLeft: "1.5rem", color: 'var(--text)' }}>
                <li>Weekly sports tips and training advice</li>
                <li>Monthly newsletter with featured athletes</li>
                <li>Exclusive access to virtual coaching sessions</li>
                <li>Sports event calendars and local opportunities</li>
                <li>Discounts on sports equipment (partner offers)</li>
              </ul>
            </div>
          </div>
          
          <div style={styles.card}>
            <img src="/assets/Balls.jpg" alt="Community sports event" loading="lazy" style={styles.cardImg} />
            <div style={styles.cardContent}>
              <h3 style={styles.h3}>Community Benefits</h3>
              <p style={{ color: 'var(--text)' }}>By joining our community, you'll connect with other sports enthusiasts, share experiences, and participate in exclusive online events. Our community includes athletes, coaches, and fans from around the world.</p>
              <p style={{ color: 'var(--text)', marginTop: '1rem' }}><strong>Note:</strong> We respect your privacy. Your information will never be shared with third parties without your consent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Registration Form</h2>
        <p style={{ color: 'var(--text)' }}>Complete the form below to join our sports community:</p>

        {serverError && <p style={styles.errorMsg}>{serverError}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="fullName" style={styles.label}>Full Name *</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                style={{...styles.input, ...(errors.fullName ? styles.errorBorder : {})}}
                value={formData.fullName}
                onChange={handleChange}
              />
              <span style={styles.error}>{errors.fullName}</span>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="username" style={styles.label}>Preferred Username *</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                style={{...styles.input, ...(errors.username ? styles.errorBorder : {})}}
                value={formData.username}
                onChange={handleChange}
              />
              <small style={styles.small}>This will be your display name in our community</small>
              <span style={styles.error}>{errors.username}</span>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                style={{...styles.input, ...(errors.email ? styles.errorBorder : {})}}
                placeholder="sportsfan@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <span style={styles.error}>{errors.email}</span>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="dob" style={styles.label}>Date of Birth *</label>
              <input 
                type="date" 
                id="dob" 
                name="dob" 
                style={{...styles.input, ...(errors.dob ? styles.errorBorder : {})}}
                value={formData.dob}
                onChange={handleChange}
              />
              <span style={styles.error}>{errors.dob}</span>
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password *</label>
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                name="password" 
                style={{...styles.input, ...(errors.password ? styles.errorBorder : {})}}
                value={formData.password}
                onChange={handleChange}
              />
              <span style={styles.error}>{errors.password}</span>
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password *</label>
              <input 
                type={showPassword ? "text" : "password"}
                id="confirmPassword" 
                name="confirmPassword" 
                style={{...styles.input, ...(errors.confirmPassword ? styles.errorBorder : {})}}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span style={styles.error}>{errors.confirmPassword}</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input 
                type="checkbox" 
                checked={showPassword} 
                onChange={() => setShowPassword(!showPassword)}
                style={{ marginRight: '8px' }}
              />
              Show password
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Gender *</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioOption}>
                <input type="radio" name="gender" value="male" onChange={handleChange} checked={formData.gender === 'male'} />
                Male
              </label>
              <label style={styles.radioOption}>
                <input type="radio" name="gender" value="female" onChange={handleChange} checked={formData.gender === 'female'} />
                Female
              </label>
              <label style={styles.radioOption}>
                <input type="radio" name="gender" value="other" onChange={handleChange} checked={formData.gender === 'other'} />
                Other
              </label>
              <label style={styles.radioOption}>
                <input type="radio" name="gender" value="prefer-not-to-say" onChange={handleChange} checked={formData.gender === 'prefer-not-to-say'} />
                Prefer not to say
              </label>
            </div>
            <span style={styles.error}>{errors.gender}</span>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="accountType" style={styles.label}>Account Type *</label>
            <select 
              id="accountType" 
              name="accountType" 
              style={{...styles.input, ...(errors.accountType ? styles.errorBorder : {})}}
              value={formData.accountType}
              onChange={handleChange}
            >
              <option value="">Select Account Type</option>
              <option value="fan">Fan Member</option>
              <option value="athlete">Athlete</option>
              <option value="coach">Coach</option>
              <option value="premium">Premium Member</option>
            </select>
            <span style={styles.error}>{errors.accountType}</span>
          </div>

          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Your Sports Experience Level *</label>
              <div style={styles.radioGroup}>
                <label style={styles.radioOption}>
                  <input type="radio" name="experience" value="beginner" onChange={handleChange} checked={formData.experience === 'beginner'} />
                  Beginner (Just starting out)
                </label>
                <label style={styles.radioOption}>
                  <input type="radio" name="experience" value="intermediate" onChange={handleChange} checked={formData.experience === 'intermediate'} />
                  Intermediate (Regular participation)
                </label>
                <label style={styles.radioOption}>
                  <input type="radio" name="experience" value="advanced" onChange={handleChange} checked={formData.experience === 'advanced'} />
                  Advanced/Expert (Competitive/trained)
                </label>
                <label style={styles.radioOption}>
                  <input type="radio" name="experience" value="fan" onChange={handleChange} checked={formData.experience === 'fan'} />
                  Fan/Enthusiast (Mostly watching/following)
                </label>
              </div>
              <span style={styles.error}>{errors.experience}</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sports of Interest (Select all that apply) *</label>
            <div style={styles.checkboxGroup}>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="basketball" onChange={handleChange} checked={formData.sports.includes('basketball')} />
                Basketball
              </label>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="volleyball" onChange={handleChange} checked={formData.sports.includes('volleyball')} />
                Volleyball
              </label>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="tennis" onChange={handleChange} checked={formData.sports.includes('tennis')} />
                Tennis
              </label>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="swimming" onChange={handleChange} checked={formData.sports.includes('swimming')} />
                Swimming
              </label>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="running" onChange={handleChange} checked={formData.sports.includes('running')} />
                Running/Track
              </label>
              <label style={styles.checkboxOption}>
                <input type="checkbox" name="sports" value="martial-arts" onChange={handleChange} checked={formData.sports.includes('martial-arts')} />
                Martial Arts
              </label>
            </div>
            <span style={styles.error}>{errors.sports}</span>
          </div>
          
          {/* Security Question Section */}
          <div style={styles.formContainer}>
            <h3 style={styles.formContainerH3}>Password Recovery Setup</h3>
            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text)' }}>
              Please set up a security question to recover your password if you forget it.
            </p>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Security Question *</label>
              <select 
                name="securityQuestion" 
                style={styles.input}
                value={formData.securityQuestion || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select a security question</option>
                <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What is the name of your elementary school?">What is the name of your elementary school?</option>
                <option value="What is your favorite sports team?">What is your favorite sports team?</option>
                <option value="What city were you born in?">What city were you born in?</option>
              </select>
              <span style={styles.error}>{errors.securityQuestion}</span>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Security Answer *</label>
              <input 
                type="text"
                name="securityAnswer"
                placeholder="Your answer (remember this!)"
                style={styles.input}
                value={formData.securityAnswer || ''}
                onChange={handleChange}
                required
              />
              <small style={styles.small}>This answer is case-sensitive. Please remember it!</small>
              <span style={styles.error}>{errors.securityAnswer}</span>
            </div>
          </div>
          
          <div style={styles.formContainer}>
            <div style={styles.formGroup}>
              <h3 style={styles.formContainerH3}>Terms of Service</h3>
              <div style={styles.termsContent}>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Account Responsibility:</strong> You're responsible for your account and content. No fake accounts, spam, or harassment.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Content Rights:</strong> You own your content, but you grant us license to host and share it. We can remove content violating our policies.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Prohibited:</strong> Hate speech, illegal content, impersonation, bullying, automated data collection.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Termination:</strong> We can suspend accounts violating terms immediately.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Dispute Resolution:</strong> Arbitration required before lawsuits. Class action waivers apply.</p>
              </div>

              <h3 style={styles.formContainerH3}>Privacy Policy</h3>
              <div style={styles.termsContent}>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Data Collected:</strong> Profile info, posts, messages, contacts, location, device data, usage patterns.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Usage:</strong> Personalize feed, serve ads, recommend connections, improve service, ensure safety.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Sharing:</strong> With service providers, advertisers (as aggregated data), law enforcement when required.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Your Controls:</strong> Privacy settings, ad preferences, download your data, delete account.</p>
                <p style={styles.termsContentP}><strong style={styles.termsContentStrong}>Retention:</strong> Data kept while account active, deleted upon request with 30-day recovery window.</p>
              </div>

              <label style={styles.checkboxOptionTerms}>
                <input type="checkbox" name="terms" onChange={handleChange} checked={formData.terms} />
                I agree to the Terms of Service and Privacy Policy. I also want to receive the weekly sports newsletter and willing to join the online community forum.
              </label>
              <span style={styles.error}>{errors.terms}</span>
            </div>
          </div>

          <button type="submit" style={styles.btn}>Complete Registration</button>
          {submitted && <p style={styles.successMsg}>Registration successful! Redirecting to home...</p>}
        </form>

        <p style={{ marginTop: "2rem", fontStyle: "italic", color: "var(--text)" }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
};

export default RegisterPage;