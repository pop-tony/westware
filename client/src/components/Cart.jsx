// src/components/Cart.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import axios from 'axios';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    clearCart
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [orderRef, setOrderRef] = useState('');

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setCheckoutStep('checkout');
  };

  const handleQuantityChange = (cartItemId, change) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
      const newQty = item.quantity + change;
      if (newQty < 1) {
        removeFromCart(cartItemId);
      } else {
        updateQuantity(cartItemId, newQty);
      }
    }
  };

  const key = import.meta.env.VITE_PAYSTACK_LIVE_PUBLIC_KEY;

  const payWithPaystack = (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast.error('Please fill all required fields');
      return;
    }
  
    if (typeof window.PaystackPop === 'undefined') {
      toast.error('Payment service not loaded. Please refresh.');
      return;
    }
  
    const handlePaymentSuccess = async (response) => {
      try {
        toast.success(`Payment complete! Ref: ${response.reference}`);
        setOrderRef(response.reference);
        await createOrder(response.reference);
        setCheckoutStep('success');
      } catch (err) {
        toast.error('Payment succeeded but order save failed');
        console.error(err);
      }
    };
  
    const handlePaymentClose = () => {
      toast.info('Payment window closed');
    };
  
    const handler = window.PaystackPop.setup({
      key: key,
      email: customerInfo.email,
      amount: Math.round(cartTotal * 100),
      currency: 'GHS',
      ref: `AURA_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: customerInfo.name
          },
          {
            display_name: "Items",
            variable_name: "items",
            value: cartItems.map(i => `${i.name} x${i.quantity}`).join(', ')
          }
        ]
      },
      callback: ()=>handlePaymentSuccess,
      onClose: handlePaymentClose,
    });
    
    handler.openIframe();
  };
  
  const createOrder = async (reference) => {
    try {
      const orderData = {
        customer: customerInfo,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        total: cartTotal,
        paymentRef: reference,
        status: 'paid',
        createdAt: new Date().toISOString()
      };
      
      const order = await axios.post("https://westware-backend.vercel.app/api/order/create-order", orderData);
      if (order.data.success) {
        toast.success("Order placed successfully!");
        clearCart();
      }
    } catch (error) {
      toast.error("Order saved locally. Contact support with ref: " + reference);
      console.log(error);
      clearCart();
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    }, 300);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-[90] h-full w-full bg-white shadow-2xl dark:bg-zinc-900 sm:w-"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  {checkoutStep !== 'cart' && checkoutStep !== 'success' && (
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  <ShoppingBag className="h-6 w-6 text-zinc-900 dark:text-white" />
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                    {checkoutStep === 'cart' && `Cart (${cartCount})`}
                    {checkoutStep === 'checkout' && 'Checkout'}
                    {checkoutStep === 'success' && 'Order Confirmed'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {checkoutStep === 'cart' && (
                <>
                  <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <ShoppingBag className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
                        <p className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                          Your cart is empty
                        </p>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          Add some items to get started
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <motion.div
                            key={item.cartItemId}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-20 w-20 rounded-xl object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-zinc-900 dark:text-white">
                                {item.name}
                              </h3>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                                {item.category}
                              </p>
                              <p className="mt-1 font-bold text-rose-500">GHS{item.price}</p>

                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.cartItemId, -1)}
                                  className="rounded-lg bg-zinc-200 p-1.5 text-zinc-900 hover:bg-zinc-300 active:scale-95 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-10 text-center font-semibold text-zinc-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleQuantityChange(item.cartItemId, 1)}
                                  className="rounded-lg bg-zinc-200 p-1.5 text-zinc-900 hover:bg-zinc-300 active:scale-95 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.cartItemId)}
                                  className="ml-auto rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
                      <div className="mb-4 flex items-center justify-between text-zinc-900 dark:text-white">
                        <span className="text-lg font-semibold">Subtotal</span>
                        <span className="text-2xl font-bold">GHS{cartTotal.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </>
              )}

              {checkoutStep === 'checkout' && (
                <>
                  <div className="flex-1 overflow-y-auto p-6">
                    <form onSubmit={payWithPaystack} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value })}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value })}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value })}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                          placeholder="+233..."
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          Delivery Address
                        </label>
                        <textarea
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value })}
                          rows={3}
                          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-zinc-800 dark:text-white"
                          placeholder="Enter delivery address"
                        />
                      </div>

                      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-zinc-800/50">
                        <h4 className="mb-3 font-semibold text-zinc-900 dark:text-white">Order Summary</h4>
                        {cartItems.map(item => (
                          <div key={item.cartItemId} className="mb-2 flex justify-between text-sm">
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="font-medium text-zinc-900 dark:text-white">
                              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="mt-3 border-t border-zinc-300 pt-3 dark:border-zinc-700">
                          <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
                        <div className="flex gap-3">
                          <CreditCard className="h-5 w-5 shrink-0" />
                          <p className="leading-relaxed">
                            Clicking “Pay Now” will initialize Paystack. You’ll be redirected to complete payment securely.
                          </p>
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="border-t border-zinc-200 p-6 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={payWithPaystack}
                      className="w-full rounded-full bg-zinc-900 py-4 font-semibold text-white transition hover:bg-rose-500 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-rose-500 dark:hover:text-white"
                    >
                      Pay GHS {(cartTotal).toFixed(2)} with Paystack
                    </button>
                  </div>
                </>
              )}

              {checkoutStep === 'success' && (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </motion.div>

                    <h3 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-white">
                      Order Confirmed!
                    </h3>
                    <p className="mt-2 text-balance text-sm text-zinc-600 dark:text-zinc-400">
                      Order ref: <span className="font-semibold text-zinc-900 dark:text-white">{orderRef}</span>
                    </p>
                    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                      We’ve sent confirmation to <span className="font-semibold text-zinc-900 dark:text-white">{customerInfo.email}</span>
                    </p>

                    <button
                      type="button"
                      onClick={closeCart}
                      className="mt-8 w-full rounded-full border-2 border-zinc-900 py-4 font-semibold text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}