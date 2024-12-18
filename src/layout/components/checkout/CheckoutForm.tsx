import React, {useState} from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';

interface CheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  price: number;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onError, price }) => {
  const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsProcessing(true);
      if (!stripe || !elements) {
        setIsProcessing(false);
        return;
    }
  
      // Trigger form validation and wallet collection
      const {error: submitError} = await elements.submit();
      
      if (submitError) {
        // Show error to your customer
        setErrorMessage(submitError.message ?? null);
        return;
      }
  
  
      if (!stripe) {
        setErrorMessage('Stripe has not loaded yet.');
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          
            return_url: window.location.href,
        },
        redirect: "if_required",
    });
    if (error) {
        onError(error.message ?? 'Payment failed');
        setIsProcessing(false);
        return;
      }

      
      setTimeout(() => {
        onSuccess();
        setIsProcessing(false);
        window.location.reload();
      }, 3000);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <PaymentElement  />
        <Button className='mt-4' type="submit" disabled={!stripe || !elements}>
        {isProcessing ? "Processing..." : `Pay ${price}$`} 
        </Button>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    );
  };

export default CheckoutForm;