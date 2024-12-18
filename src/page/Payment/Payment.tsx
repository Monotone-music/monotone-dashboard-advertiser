import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "@/layout/components/checkout/CheckoutForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  // DialogClose,
} from "@/components/ui/dialog";
import { createPaymentIntent } from "@/service/paymentService";
import styles from "./styles.module.scss";


const stripePromise = loadStripe(
  "pk_test_51PR8baLcSoLMTRiQjjqFJopXNY76FOx5YuYfyrQ9WwK4iA32jyWvNXzNdesfHkfyJv4QKXEhceUjL7qltHnaaLxk00qdPpyN4O"
);

// const options = {
//   mode: "payment" as const,
//   amount: 1099,
//   currency: "usd",
  
//   // Fully customizable with appearance API.
//   appearance: {
//     /*...*/
//   },
// };



const Payment: React.FC = () => {
  const [views, setViews] = useState<number>(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);

  const options: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance: {
      /* your appearance options */
      theme: 'stripe',
      labels: 'floating',
    },
    loader: 'auto',
  } : undefined;

  const handleViewsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value); // Ensure minimum of 100 views
    setViews(value);
  };

  const handleCheckout = async () => { 
    if (views < 100) {
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Invalid Number of Views",
        description: "The minimum number of views is 100.",
        className: styles["toast-error"],
      });
      return;
    }
    const token = localStorage.getItem('token');
    const paymentBody = {
      amount: totalPrice * 100,
      currency: "usd",
      metadata: {
        token: token,
        type: "quota",
      },
    };
    try {
      const intent = await createPaymentIntent(paymentBody);
      console.log(intent.client_secret);
      setClientSecret(intent.client_secret);
      console.log(clientSecret);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Payment Failed",
        description: "Failed to initialize payment",
        className: styles["toast-error"],
      });
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      variant: "default",
      duration: 3000,
      title: "Payment Successful",
      description: "Your payment has been processed successfully.",
      className: styles["toast-success"],
    });
    setIsModalOpen(false);
    window.location.reload();
  };

  const handlePaymentError = (error: string) => {
    toast({
      variant: "destructive",
      duration: 3000,
      title: "Payment Failed",
      description: error,
      className: styles["toast-error"],
    });
    setIsModalOpen(false);
  };

  const totalPrice = views * 0.05;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {/* <h2 className="text-xl font-semibold mb-4">Purchase Views</h2> */}
        <form className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
          Number of Views
          </label>
          <input
            type="number"
            value={views}
            onChange={handleViewsChange}
            className="p-2 mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </form>
        <p className="mb-4">Total Price: ${totalPrice.toFixed(2)}</p>
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            if (views < 100) {
              toast({
                variant: "destructive",
                duration: 3000,
                title: "Invalid Number of Views",
                description: "The minimum number of views is 100.",
              });
              return;
            }
            setIsModalOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={handleCheckout} className="mt-4">
              Process to Checkout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>
              Enter your card details to complete the payment.
            </DialogDescription>
            {clientSecret && options && (
              <Elements stripe={stripePromise} options={options}>
                <CheckoutForm
                  price={totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}
            {/* <DialogClose asChild onClick={() => setIsModalOpen(false)}>
              <Button className="mt-4">Close</Button>
            </DialogClose> */}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};export default Payment;
