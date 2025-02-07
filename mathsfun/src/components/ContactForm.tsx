'use client';
import { useForm } from 'react-hook-form';
import { useFormspree } from '@formspree/react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  message: string;
  _honey?: string; // Honeypot field
};

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [state, submit] = useFormspree('xknqponz');
  
  const onSubmit = async (data: FormData) => {
    // Skip submission if honeypot field is filled
    if (data._honey) return;
    await submit(data);
    if (state.succeeded) reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-amber-800 mb-8">📬 Contact Support</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot Field */}
        <input type="text" {...register('_honey')} className="hidden" />

        <div>
          <label className="block text-amber-700 mb-2 font-medium">Your Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className={`w-full p-3 rounded-lg border-2 ${
              errors.name ? 'border-red-400' : 'border-amber-200'
            } focus:border-amber-400 focus:ring-2 focus:ring-amber-100`}
          />
          {errors.name && (
            <p className="text-red-500 mt-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-amber-700 mb-2 font-medium">Email Address</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={`w-full p-3 rounded-lg border-2 ${
              errors.email ? 'border-red-400' : 'border-amber-200'
            } focus:border-amber-400 focus:ring-2 focus:ring-amber-100`}
          />
          {errors.email && (
            <p className="text-red-500 mt-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-amber-700 mb-2 font-medium">Message</label>
          <textarea
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 20, message: 'Message must be at least 20 characters' }
            })}
            rows={5}
            className={`w-full p-3 rounded-lg border-2 ${
              errors.message ? 'border-red-400' : 'border-amber-200'
            } focus:border-amber-400 focus:ring-2 focus:ring-amber-100`}
          />
          {errors.message && (
            <p className="text-red-500 mt-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="w-full bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {state.submitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>

        {state.succeeded && (
          <div className="p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <span>Message sent successfully! We'll respond within 24 hours.</span>
          </div>
        )}

        {state.errors && (
          <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span>Oops! There was an error. Please try again later.</span>
          </div>
        )}
      </form>
    </div>
  );
} 