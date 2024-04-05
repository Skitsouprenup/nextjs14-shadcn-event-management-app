import EventCollection from "@/components/shared/EventCollection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/server_actions/event.actions";
import { getOrdersByUser } from "@/lib/server_actions/order.actions";
import { OrderPayload } from "@/types";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

const ProfilePage = async (
  {searchParams}: 
  {searchParams: Record<string, string>}
) => {
  const { sessionClaims } = auth();
  const claims = sessionClaims as Record<string, unknown>;
  const userId = claims?.userId as string

  const ticketsPage = Number(searchParams?.tickets) || 1;
  const eventsPage = Number(searchParams?.events) || 1;

  const orders = await getOrdersByUser({ userId, page: ticketsPage})

  const orderedEvents = orders?.data.map((order: OrderPayload) => order.event) || [];
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage })

  return (
    <section className="w-full flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="
          flex md:justify-between items-center justify-center bg-stone-200 p-2
          rounded-md"
        >
          <h1 className="text-2xl font-semibold">My Tickets</h1>
          <div className="md:block hidden">
            <Button asChild className="md:w-fit">
              <Link href="/#events">
                Browse More Events
              </Link>
            </Button>
          </div>
        </div>

        <EventCollection 
          data={orderedEvents}
          noEventText="No tickets have been purchased yet"
          noEventSubText="Go buy some tickets now."
          type="PAID"
          limit={5}
          page={ticketsPage}
          urlParamName="orders"
          totalPages={orders?.totalPages}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="
          flex md:justify-between items-center justify-center bg-stone-200 p-2
          rounded-md"
        >
          <h1 className="text-2xl font-semibold">My Organized Events</h1>
        </div>

        <EventCollection 
          data={organizedEvents?.data}
          noEventText="No events have been created yet"
          noEventSubText="Go create some now"
          type="ORGANIZER"
          limit={5}
          page={eventsPage}
          urlParamName="events"
          totalPages={organizedEvents?.totalPages}
        />
      </div>
    </section>
  )
}

export default ProfilePage