import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from "framer-motion"
import { Info, Clock, AlertCircle, Scissors, CalendarCheck, X, ArrowLeft, CheckCircle2, CreditCard, Sparkles } from 'lucide-react'
import axios from 'axios'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

const ConsultationCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [step, setStep] = useState('details') // 'details' | 'payment' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  })
  const [orderRef, setOrderRef] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const details = [
    {
      icon: <Info className='h-5 w-5' />,
      title: 'Consultation Fee',
      desc: 'GHS 400 - GHS 800 for 30-minute session with lead designer'
    },
    {
      icon: <Clock className='h-5 w-5' />,
      title: 'Booking Timeline',
      desc: 'Book 3–6 months or up to 1 year before event date'
    },
    {
      icon: <AlertCircle className='h-5 w-5' />,
      title: 'Style Preparation',
      desc: 'Bring style inspirations. Indecisive clients should book consultation first'
    },
    {
      icon: <Scissors className='h-5 w-5' />,
      title: 'Mock-ups',
      desc: 'Style inspiration mock-ups charged separately. Price set by designer after consultation'
    },
  ]

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && closeModal()
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEsc)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isModalOpen])

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      setStep('details')
      setOrderRef('')
    }, 300)
  }

  const handleDetailsSubmit = (e) => {
    e.preventDefault()
    setStep('payment')
  }

  const updateField = (field, value) => {
    setFormData(prev => ({...prev, [field]: value }))
  }

  const key = import.meta.env.VITE_PAYSTACK_LIVE_PUBLIC_KEY
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const createOrder = async (reference) => {
    try {
      const orderData = {
        customer: formData,
        items: [{
          id: 'consultation',
          name: 'Style Consultation',
          price: 800,
          quantity: 1,
          category: 'Service'
        }],
        total: 800,
        paymentRef: reference,
        status: 'paid',
        type: 'consultation',
        createdAt: new Date().toISOString()
      };

      const res = await axios.post(`${backendUrl}/api/order/consult`, {orderData});
      if (res.data.success) {
        toast.success("Consultation booked successfully!")
        return true
      } else {
        throw new Error(res.data.message || 'Order creation failed')
      }
    } catch (error) {
      console.error(error)
      toast.error("Payment succeeded but booking failed. Contact support with ref: " + reference)
      return false
    }
  };

  const payWithPaystack = (e) => {
    e.preventDefault()

    if (!formData.name ||!formData.email ||!formData.phone ||!formData.date) {
      toast.error('Please fill all required fields')
      return
    }

    if (!window.PaystackPop) {
      toast.error('Payment service not loaded. Please refresh.')
      return
    }

    if (!key) {
      toast.error('Payment key not configured')
      return
    }

    const handlePaymentSuccess = async (response) => {
      
      try {
        setOrderRef(response.reference)
        await createOrder(response.reference)
        toast.success(`Booked! Ref: ${response.reference}`);
        setStep('success');
        setIsProcessing(false)
      } catch (err) {
        toast.error('Payment succeeded but order save failed');
        console.error(err);
      }
    }

    setIsProcessing(true)

    const handler = window.PaystackPop.setup({
      key: key,
      email: formData.email,
      amount: 80000, // GHS 800 in pesewas
      currency: 'GHS',
      ref: `CONSULT_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: formData.name
          },
          {
            display_name: "Phone",
            variable_name: "phone",
            value: formData.phone
          },
          {
            display_name: "Preferred Date",
            variable_name: "date",
            value: formData.date
          }
        ]
      },
      callback: (response) => handlePaymentSuccess(response),
      onClose: () => {
        toast.info('Payment cancelled')
        setIsProcessing(false)
      },
    })
    handler.openIframe()
  }

  return (
    <>
      <motion.section
        id='consultation'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.1 }}
        className='bg-white px-4 py-20 dark:bg-zinc-950'
      >
        <div className='mx-auto max-w-4xl'>
          <motion.div
            variants={fadeUp}
            className='rounded-3xl bg-zinc-50 p-8 shadow-sm dark:bg-zinc-900 md:p-12'
          >
            <div className='mb-8 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500'>
                <Sparkles className='h-6 w-6' />
              </div>
              <div>
                <p className='text-sm uppercase tracking-[0.3em] text-rose-500'>Exclusive</p>
                <h2 className='text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl'>
                  Before You Book
                </h2>
              </div>
            </div>

            <div className='space-y-6'>
              {details.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className='group flex gap-4 rounded-2xl bg-white p-5 transition hover:shadow-md dark:bg-zinc-800/50'
                >
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition group-hover:bg-rose-500 dark:bg-white dark:text-black'>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='text-base font-semibold text-zinc-900 dark:text-white'>{item.title}</h3>
                    <p className='mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400'>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              variants={fadeUp}
              onClick={() => setIsModalOpen(true)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              className='mt-10 flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white md:w-auto md:px-10'
            >
              <CalendarCheck className='h-5 w-5' />
              Book Consultation
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
              onClick={closeModal}
              className='fixed inset-0 z-50 bg-black/70'
            />

            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                className='w-full max-w-lg p-5'
              >
                <div className='p-10 max-h- overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-zinc-900'>

                  {/* Step 1: Details */}
                  {step === 'details' && (
                    <div className='p-6 sm:p-8'>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                            Book Your Consultation
                          </h3>
                          <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                            GHS 800 • 30 minutes with lead designer
                          </p>
                        </div>
                        <button
                          onClick={closeModal}
                          className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 hover:rotate-90 transition dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                        >
                          <X className='h-5 w-5' />
                        </button>
                      </div>

                      <form onSubmit={handleDetailsSubmit} className='mt-6 space-y-4'>
                        <div>
                          <label className='mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300'>
                            Full Name
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
                            Email
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
                              Phone
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
                              Preferred Date
                            </label>
                            <input
                              type='date'
                              required
                              min={new Date().toISOString().split('T')[0]}
                              value={formData.date}
                              onChange={(e) => updateField('date', e.target.value)}
                              className='w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:[color-scheme:dark]'
                            />
                          </div>
                        </div>

                        <button
                          type='submit'
                          className='mt-2 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                        >
                          Continue to Payment
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Step 2: Payment */}
                  {step === 'payment' && (
                    <div className='p-6 sm:p-8'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-3'>
                          <button
                            onClick={() => setStep('details')}
                            disabled={isProcessing}
                            className='-ml-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                          >
                            <ArrowLeft className='h-5 w-5' />
                          </button>
                          <div>
                            <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                              Checkout
                            </h3>
                            <p className='mt-1 text-sm text-zinc-600 dark:text-zinc-400'>
                              Pay GHS 800 to confirm your slot
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={closeModal}
                          disabled={isProcessing}
                          className='-mr-2 -mt-2 rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                        >
                          <X className='h-5 w-5' />
                        </button>
                      </div>

                      <div className='mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-zinc-800/50'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-zinc-600 dark:text-zinc-400'>Consultation Fee</span>
                          <span className='font-semibold text-zinc-900 dark:text-white'>GHS 800.00</span>
                        </div>
                        <div className='mt-3 flex justify-between text-sm'>
                          <span className='text-zinc-600 dark:text-zinc-400'>For</span>
                          <span className='font-medium text-zinc-900 dark:text-white'>{formData.name}</span>
                        </div>
                        <div className='mt-3 flex justify-between text-sm'>
                          <span className='text-zinc-600 dark:text-zinc-400'>Date</span>
                          <span className='font-medium text-zinc-900 dark:text-white'>{formData.date}</span>
                        </div>
                      </div>

                      <div className='mt-6'>
                        <div className='rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200'>
                          <div className='flex gap-3'>
                            <CreditCard className='h-5 w-5 shrink-0' />
                            <p className='leading-relaxed'>Clicking “Pay Now” implies you agree to the <a className='underline font-semibold' href='#terms'>terms and conditions</a> and will initialize Paystack. You’ll be redirected to complete payment securely.</p>
                          </div>
                        </div>

                        <button
                          type='button'
                          onClick={payWithPaystack}
                          disabled={isProcessing}
                          className='mt-6 w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white'
                        >
                          {isProcessing? 'Processing...' : 'Pay GHS 800 with Paystack'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Success */}
                  {step === 'success' && (
                    <div className='p-8 text-center'>
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
                        Ref: <span className='font-semibold text-zinc-900 dark:text-white'>{orderRef}</span>
                      </p>
                      <p className='mt-4 text-sm text-zinc-600 dark:text-zinc-400'>
                        We’ve sent confirmation to <span className='font-semibold text-zinc-900 dark:text-white'>{formData.email}</span>
                      </p>

                      <div className='mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left text-sm dark:border-white/10 dark:bg-zinc-800/50'>
                        <div className='flex justify-between'>
                          <span className='text-zinc-600 dark:text-zinc-400'>Name</span>
                          <span className='font-medium text-zinc-900 dark:text-white'>{formData.name}</span>
                        </div>
                        <div className='mt-3 flex justify-between'>
                          <span className='text-zinc-600 dark:text-zinc-400'>Date</span>
                          <span className='font-medium text-zinc-900 dark:text-white'>{formData.date}</span>
                        </div>
                        <div className='mt-3 flex justify-between'>
                          <span className='text-zinc-600 dark:text-zinc-400'>Amount Paid</span>
                          <span className='font-semibold text-emerald-600 dark:text-emerald-400'>GHS 800.00</span>
                        </div>
                      </div>

                      <button
                        onClick={closeModal}
                        className='mt-8 w-full rounded-full border-2 border-zinc-900 py-4 font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black'
                      >
                        Back to Page
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default ConsultationCard