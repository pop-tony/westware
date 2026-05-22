// src/components/ServiceBookingModal.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, CheckCircle2, Calendar, User, Mail, Phone, Clock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceBookingModal({ service, isOpen, onClose }) {
  const [step, setStep] = useState('details'); // 'details' | 'confirm' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Prefill when service changes
  useEffect(() => {
    if (service) {
      setFormData(prev => ({
       ...prev,
        serviceName: service.title,
        servicePrice: service.price,
        serviceDuration: service.duration
      }));
    }
  }, [service]);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && closeModal();
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const closeModal = () => {
    onClose;
    setTimeout(() => {
      setStep('details');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: '',
      });
    }, 300);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep('confirm');
  };

  const key = import.meta.env.VITE_PAYSTACK_LIVE_PUBLIC_KEY

  const payWithPaystack = async (e) => {
    e.preventDefault()
    if (!window.PaystackPop) {
      toast.error('Payment service not loaded. Please refresh.')
      return
    }
    try {
      const handler = window.PaystackPop.setup({
        key: key,
        email: formData.email,
        amount: Math.round(Number(service.price) * 100),
        currency: 'GHS',
        ref: `${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        onClose: () => toast.info('Payment window closed'),
        callback: (response) => {
          toast.success(`Payment complete! Ref: ${response.reference}`)
          setStep('success')
          setPaymentSuccess(true)
          onSubmitHandler()
        },
      })
      handler.openIframe()
    } catch (error) {
      console.error(error)
      toast.error('Error processing payment')
    }
  }

  const creatOrder = async()=>{
    
    if(!paymentSuccess) return;
    
    try {
      const consult = await axios.post("http://localhost:5004/api/order/create-orderA", {formData});
      if(consult.data.success){
        toast.success("Service successfully booked!")
      }
    } catch (error) {
      toast.error("Unable to book.. try again")
      console.log(error) 
    }

    setPaymentSuccess(false);

  }

  useEffect(()=>{
    if(paymentSuccess) creatOrder();
  },[paymentSuccess, step, setStep])

  const handleConfirmBooking = async (e) => {
    try {
        e.preventDefault()
        await payWithPaystack(e)
        toast.success('Service booked! We\'ll contact you to confirm.');
    
    } catch (error) {
        toast.error('Booking not successful..try again.');
        console.log(error)
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({...prev, [field]: value }));
  };

  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
            <>
                {/* Blurred backdrop */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ duration: 0.3 }}
                    onClick={onClose}
                    className='fixed inset-0 z-50 bg-black/70'
                />

                {/* Centered modal */}
                <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                    <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    onClick={(e) => e.stopPropagation()}
                    className='w-full max-w-lg'
                    >
                        <div className='max-h- overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900'>

                            {/* Step 1: Details */}
                            {step === 'details' && (
                                <div className='p-6 sm:p-8'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500'>
                                                <Sparkles className='h-6 w-6' />
                                            </div>
                                            <div>
                                                <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                                                    Book Service
                                                </h3>
                                                <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                                                    {service.title}
                                                </p>
                                            </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 hover:rotate-90 transition dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                                            >
                                                <X className='h-5 w-5' />
                                            </button>
                                        </div>

                                        {/* Service Info Card */}
                                        <div className='mt-6 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                            <p className='text-xs text-zinc-500 dark:text-zinc-500'>Selected Service</p>
                                            <p className='font-semibold text-zinc-900 dark:text-white'>{service.title}</p>
                                            </div>
                                            <div className='text-right'>
                                            <p className='text-xs text-zinc-500 dark:text-zinc-500'>Price</p>
                                            <p className='font-bold text-rose-500'>{service.price}</p>
                                            </div>
                                        <div className='mt-3 flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400'>
                                            <Clock className='h-4 w-4' />
                                            <span>{service.duration}</span>
                                        </div>
                                        </div>

                                        <form onSubmit={handleDetailsSubmit} className='mt-6 space-y-4'>
                                        <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                            <User className='inline h-4 w-4 mr-1' /> Full Name
                                            </label>
                                            <input
                                            type='text'
                                            required
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                            placeholder='Enter your name'
                                            />
                                        </div>

                                        <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                            <Mail className='inline h-4 w-4 mr-1' /> Email
                                            </label>
                                            <input
                                            type='email'
                                            required
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                            placeholder='your@email.com'
                                            />
                                        </div>

                                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                            <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                                <Phone className='inline h-4 w-4 mr-1' /> Phone
                                            </label>
                                            <input
                                                type='tel'
                                                required
                                                value={formData.phone}
                                                onChange={(e) => updateField('phone', e.target.value)}
                                                className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                                placeholder='+233...'
                                            />
                                            </div>
                                            <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                                <Calendar className='inline h-4 w-4 mr-1' /> Preferred Date
                                            </label>
                                            <input
                                                type='date'
                                                required
                                                value={formData.date}
                                                onChange={(e) => updateField('date', e.target.value)}
                                                className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark]'
                                            />
                                            </div>
                                        </div>

                                        <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                            Preferred Time
                                            </label>
                                            <select
                                            required
                                            value={formData.time}
                                            onChange={(e) => updateField('time', e.target.value)}
                                            className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                            >
                                            <option value=''>Select time</option>
                                            <option value='9:00 AM'>9:00 AM</option>
                                            <option value='11:00 AM'>11:00 AM</option>
                                            <option value='1:00 PM'>1:00 PM</option>
                                            <option value='3:00 PM'>3:00 PM</option>
                                            <option value='5:00 PM'>5:00 PM</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                                            Notes (Optional)
                                            </label>
                                            <textarea
                                            value={formData.notes}
                                            onChange={(e) => updateField('notes', e.target.value)}
                                            rows={3}
                                            className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white'
                                            placeholder='Any specific requests or concerns...'
                                            />
                                        </div>

                                        <button
                                            type='submit'
                                            className='mt-2 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                                        >
                                            Review Booking
                                        </button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Confirm */}
                            {step === 'confirm' && (
                                <div className='p-6 sm:p-8'>
                                    <div className='flex items-start justify-between gap-3'>
                                    <div className='flex items-center gap-3'>
                                        <button
                                        type="button"
                                        onClick={() => setStep('details')}
                                        className='-ml-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                                        >
                                        <ArrowLeft className='h-5 w-5' />
                                        </button>
                                        <div>
                                        <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                                            Confirm Booking
                                        </h3>
                                        <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                                            Review your details
                                        </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                                    >
                                        <X className='h-5 w-5' />
                                    </button>
                                    </div>

                                    <div className='mt-6 space-y-4'>
                                        <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50'>
                                            <h4 className='font-semibold text-zinc-900 dark:text-white'>Service Details</h4>
                                            <div className='mt-3 space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Service</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{service.title}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Duration</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{service.duration}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Price</span>
                                                <span className='font-bold text-rose-500'>{service.price}</span>
                                            </div>
                                            </div>
                                        </div>

                                        <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50'>
                                            <h4 className='font-semibold text-zinc-900 dark:text-white'>Your Information</h4>
                                            <div className='mt-3 space-y-2 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Name</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{formData.name}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Email</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{formData.email}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Phone</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{formData.phone}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Date</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{formData.date}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-zinc-600 dark:text-zinc-400'>Time</span>
                                                <span className='font-medium text-zinc-900 dark:text-white'>{formData.time}</span>
                                            </div>
                                            </div>
                                        </div>

                                        {formData.notes && (
                                            <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50'>
                                            <h4 className='font-semibold text-zinc-900 dark:text-white'>Notes</h4>
                                            <p className='mt-2 text-sm text-zinc-600 dark:text-zinc-400'>{formData.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                    type="button"
                                    onClick={handleConfirmBooking}
                                    className='mt-6 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                                    >
                                    Confirm Booking
                                    </button>
                                </div>
                            )}

                            {/* Step 3: Success */}
                            {step === 'success' && (
                                <div className='p-8 text-center'>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                                    >
                                        <X className='h-5 w-5' />
                                    </button>
                                    <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10'
                                    >
                                    <CheckCircle2 className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                                    </motion.div>

                                    <h3 className='mt-6 text-2xl font-bold text-zinc-900 dark:text-white'>
                                    Booking Confirmed!
                                    </h3>
                                    <p className='mt-2 text-balance text-sm text-zinc-600 dark:text-zinc-400'>
                                    We’ve received your booking for <span className='font-semibold text-zinc-900 dark:text-white'>{service.title}</span>.
                                    Our team will reach out within 24 hours to confirm your appointment.
                                    </p>

                                    <div className='mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm dark:border-white/10 dark:bg-zinc-800/50'>
                                        <div className='flex justify-between'>
                                            <span className='text-zinc-600 dark:text-zinc-400'>Service</span>
                                            <span className='font-medium text-zinc-900 dark:text-white'>{service.title}</span>
                                        </div>
                                        <div className='mt-3 flex justify-between'>
                                            <span className='text-zinc-600 dark:text-zinc-400'>Date & Time</span>
                                            <span className='font-medium text-zinc-900 dark:text-white'>{formData.date} at {formData.time}</span>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}
                        </div>
                        
                    </motion.div>
                </div>
            </>
        )}
    </AnimatePresence>
  );
}