import { EventData } from "@/types"
import { Button } from "../ui/button"

import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from "react";
import { checkoutOrder } from "@/lib/server_actions/order.actions";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const StripeCheckout = (
  {event, userId}:
  {event:EventData, userId:string}
) => {

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      freeEvent: event.freeEvent,
      buyerId: userId
    }

    await checkoutOrder(order);
  }

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order cancelled.');
    }
  }, []);

  return (
    <form action={onCheckout}>
      <Button type="submit" role="link" size="lg">
        {event.freeEvent ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
    </form>
  )
}

export default StripeCheckout