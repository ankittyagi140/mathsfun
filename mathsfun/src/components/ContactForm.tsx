'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Snack from './Snack';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [snack, setSnack] = useState<{ 
    message: string; 
    type: 'success' | 'error' 
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setSnack(null);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSnack({ message: 'Message sent successfully!', type: 'success' });
    } catch (error: any) {
      setSnack({ 
        message: 'Failed to send message. Please email us at info@maths2fun.com', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            {...register('message', { required: 'Message is required' })}
            rows={4}
            className="w-full px-4 py-2 border rounded-md"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      {snack && (
        <Snack
          message={snack.message}
          type={snack.type}
          onClose={() => setSnack(null)}
        />
      )}
    </div>
  );
} 