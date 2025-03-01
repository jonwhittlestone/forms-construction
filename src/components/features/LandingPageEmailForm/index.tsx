import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
  },
  field: {
    marginBottom: theme.spacing(3),
    '& .MuiInputLabel-root': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.23)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.87)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
    },
    '& .MuiFormHelperText-root': {
      color: theme.palette.error.main,
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

export const LandingPageEmailForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: '', message: '' });
    setIsSubmitting(true);

    // Validate
    let hasErrors = false;
    if (!validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasErrors = true;
    }
    if (!formData.message.trim()) {
      setErrors(prev => ({ ...prev, message: 'Message is required' }));
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          to: 'Jon <jwhittlestone@hotmail.com>',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Clear form on success
      setFormData({
        email: '',
        phone: '',
        message: '',
      });

      setShowSuccess(true);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitError('Failed to send message. Please try again later.');
      // Hide error message after 5 seconds
      setTimeout(() => setSubmitError(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={classes.form}>
      <Typography variant="h6" component="h2" style={{ color: '#fff', marginBottom: '1rem' }}>
        Contact Us
      </Typography>

      <TextField
        className={classes.field}
        label="Your Email Address"
        variant="outlined"
        fullWidth
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        required
      />

      <TextField
        className={classes.field}
        label="Your Phone Number"
        variant="outlined"
        fullWidth
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />

      <TextField
        className={classes.field}
        label="Message"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={!!errors.message}
        helperText={errors.message}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        className={classes.submitButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>

      {showSuccess && (
        <Box
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#4caf50',
            padding: 2,
            borderRadius: 1,
            marginTop: 2,
            textAlign: 'center',
            border: '1px solid #4caf50',
          }}
        >
          <Typography>Message sent successfully!</Typography>
        </Box>
      )}

      {submitError && (
        <Box
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#f44336',
            padding: 2,
            borderRadius: 1,
            marginTop: 2,
            textAlign: 'center',
            border: '1px solid #f44336',
          }}
        >
          <Typography>{submitError}</Typography>
        </Box>
      )}
    </Box>
  );
};
