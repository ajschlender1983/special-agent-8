'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'motion/react';

// Validation schema
const applicationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  experience: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Please select an experience level' }),
  }),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  accentColor?: string;
  onSuccess?: () => void;
}

export default function ApplicationForm({ accentColor = '#f59e0b', onSuccess }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setSubmitSuccess(true);
        reset();
        if (onSuccess) onSuccess();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 p-4 rounded-xl text-white text-sm font-medium flex items-center gap-3"
          style={{ backgroundColor: `${accentColor}30`, borderLeft: `3px solid ${accentColor}` }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Your application has been submitted successfully!
        </motion.div>
      )}

      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-6 p-4 rounded-xl text-red-300 text-sm font-medium flex items-center gap-3 bg-red-900/20 border-l-3 border-red-500"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {submitError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Full Name</label>
          <input
            type="text"
            {...register('fullName')}
            placeholder="Enter your full name"
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Phone</label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="Enter your phone number"
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Company</label>
          <input
            type="text"
            {...register('company')}
            placeholder="Enter your company name"
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.company && (
            <p className="text-red-400 text-xs mt-1">{errors.company.message}</p>
          )}
        </div>

        {/* Position */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Position</label>
          <input
            type="text"
            {...register('position')}
            placeholder="Enter your position"
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.position && (
            <p className="text-red-400 text-xs mt-1">{errors.position.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">Experience Level</label>
          <div className="flex gap-3">
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <label key={level} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value={level}
                  {...register('experience')}
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-sm text-neutral-300 capitalize">{level}</span>
              </label>
            ))}
          </div>
          {errors.experience && (
            <p className="text-red-400 text-xs mt-1">{errors.experience.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">Message</label>
          <textarea
            {...register('message')}
            placeholder="Tell us about yourself and why you're interested..."
            rows={5}
            className="w-full glass rounded-xl px-4 py-3 bg-transparent text-white placeholder-neutral-600 outline-none focus:ring-1 transition-all text-sm resize-none"
            style={{ focusRingColor: accentColor } as React.CSSProperties}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl font-medium text-sm text-neutral-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: accentColor }}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
