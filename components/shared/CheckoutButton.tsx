'use client';

import { EventData } from "@/types"
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs"
import StripeCheckout from "./StripeCheckout";

const CheckoutButton = (
  {event}:
  {event:EventData}
) => {
  const { user } = useUser();
  const userId = user?.publicMetadata?.userId as string;
  const eventFinished = Date.parse(event.endDate) < Date.now()

  return (
    <div>
      {
        eventFinished ? (
          <p className="text-lg text-amber-500">This event has ended.</p>
        ) : (
          <>
            <SignedOut>
              <div className="flex gap-2 items-center flex-row-reverse w-fit">
                <p className="text-lg font-semibold">
                  Login to buy ticket
                </p>
              </div>
            </SignedOut>

            <SignedIn>
              <StripeCheckout event={event} userId={userId}/>
            </SignedIn>
          </>
        )
      }
    </div>
  )
}

export default CheckoutButton