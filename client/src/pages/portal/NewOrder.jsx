import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const serviceTypes = [
  { value: 'large-format', label: 'Large Format Prints' },
  { value: 'graphic-design', label: 'Graphic Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'idea-creation', label: 'Idea Creation' },
  { value: 'roll-up-banners', label: 'Roll-Up Banners' },
  { value: 'other', label: 'Other' },
];

// Step 3: Stripe Payment form
function PaymentStep({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    const { error } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    if (error) {
      toast.error(error.message || 'Payment failed.');
      setPaying(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement />
      <button type="submit" disabled={!stripe || paying} className="btn-primary w-full justify-center">
        {paying ? 'Processing…' : 'Pay Deposit & Confirm Order'}
      </button>
    </form>
  );
}

export default function NewOrder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceType: '',
    description: '',
    specs: { width: '', height: '', quantity: '', material: '' },
    depositAmount: '',
    totalAmount: '',
  });
  const [files, setFiles] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [, setOrderId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSpec = e => setForm(prev => ({ ...prev, specs: { ...prev.specs, [e.target.name]: e.target.value } }));

  const handleNext = () => {
    if (step === 1 && !form.serviceType) { toast.error('Please select a service type.'); return; }
    if (step === 2 && !form.description) { toast.error('Please describe your project.'); return; }
    setStep(s => s + 1);
  };

  const handleSubmitOrder = async () => {
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('serviceType', form.serviceType);
      data.append('description', form.description);
      data.append('specs', JSON.stringify(form.specs));
      if (form.depositAmount) data.append('depositAmount', form.depositAmount);
      if (form.totalAmount) data.append('totalAmount', form.totalAmount);
      files.forEach(f => data.append('files', f));

      const res = await api.post('/orders', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setOrderId(res.data.order._id);
      if (res.data.clientSecret) {
        setClientSecret(res.data.clientSecret);
        setStep(3);
      } else {
        toast.success('Order placed successfully!');
        navigate('/portal');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment confirmed! Your order is now active.');
    navigate('/portal');
  };

  const steps = ['Service Type', 'Project Details', 'Review & Pay'];

  return (
    <>
      <Helmet><title>New Job Order – Rokit Media</title></Helmet>
      <div className="pt-24 pb-6 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-rokit-dark mb-2">New Job Order</h1>
        <p className="text-rokit-body mb-8">Fill in the details below to submit your print or design job.</p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-black rounded-full ${step === i + 1 ? 'bg-rokit-orange text-white' : step > i + 1 ? 'bg-rokit-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? 'text-rokit-orange' : 'text-gray-400'}`}>{label}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Service Type */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-rokit-dark mb-2">Service Type *</label>
              <select name="serviceType" value={form.serviceType} onChange={handleChange} className="form-input">
                <option value="">Select a service…</option>
                {serviceTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <button onClick={handleNext} className="btn-primary">Continue →</button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-rokit-dark mb-1">Project Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="form-input resize-none" placeholder="Describe what you need in detail…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Width (cm)</label>
                <input name="width" value={form.specs.width} onChange={handleSpec} className="form-input" placeholder="e.g. 300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Height (cm)</label>
                <input name="height" value={form.specs.height} onChange={handleSpec} className="form-input" placeholder="e.g. 200" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Quantity</label>
                <input name="quantity" value={form.specs.quantity} onChange={handleSpec} className="form-input" placeholder="e.g. 10" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Material</label>
                <input name="material" value={form.specs.material} onChange={handleSpec} className="form-input" placeholder="e.g. Vinyl, Canvas" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-rokit-dark mb-1">Reference Files</label>
              <input type="file" multiple accept="image/*,application/pdf" onChange={e => setFiles(Array.from(e.target.files))} className="text-sm text-rokit-body" />
              <p className="text-xs text-gray-400 mt-1">Upload logos, reference images, or PDF briefs (max 10MB each).</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Deposit Amount (₦)</label>
                <input name="depositAmount" value={form.depositAmount} onChange={handleChange} className="form-input" placeholder="Leave blank if unknown" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Estimated Total (₦)</label>
                <input name="totalAmount" value={form.totalAmount} onChange={handleChange} className="form-input" placeholder="Leave blank if unknown" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
              <button onClick={handleNext} className="btn-primary">Review Order →</button>
            </div>
          </div>
        )}

        {/* Step 3a: Review */}
        {step === 3 && !clientSecret && (
          <div className="space-y-6">
            <div className="bg-rokit-tan p-5 space-y-3">
              <h3 className="font-black text-rokit-dark text-lg">Order Summary</h3>
              <div className="text-sm space-y-2 text-rokit-body">
                <p><span className="font-semibold text-rokit-dark">Service:</span> {serviceTypes.find(s => s.value === form.serviceType)?.label}</p>
                <p><span className="font-semibold text-rokit-dark">Description:</span> {form.description}</p>
                {form.specs.width && <p><span className="font-semibold text-rokit-dark">Dimensions:</span> {form.specs.width}cm × {form.specs.height}cm</p>}
                {form.specs.quantity && <p><span className="font-semibold text-rokit-dark">Quantity:</span> {form.specs.quantity}</p>}
                {form.specs.material && <p><span className="font-semibold text-rokit-dark">Material:</span> {form.specs.material}</p>}
                {form.depositAmount && <p><span className="font-semibold text-rokit-dark">Deposit:</span> ₦{Number(form.depositAmount).toLocaleString()}</p>}
                {form.totalAmount && <p><span className="font-semibold text-rokit-dark">Estimated Total:</span> ₦{Number(form.totalAmount).toLocaleString()}</p>}
                {files.length > 0 && <p><span className="font-semibold text-rokit-dark">Files:</span> {files.map(f => f.name).join(', ')}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
              <button onClick={handleSubmitOrder} disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting…' : form.depositAmount ? 'Submit & Pay Deposit' : 'Submit Order'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3b: Payment */}
        {step === 3 && clientSecret && (
          <div>
            <h3 className="font-black text-rokit-dark text-lg mb-4">Pay Deposit</h3>
            <p className="text-rokit-body text-sm mb-6">Complete the payment below to confirm your order.</p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentStep clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        )}
      </div>
    </>
  );
}
