import DeleteEventConfirmDialog from "@/components/dialogs/DeleteEventConfirmDialog";
import CalendarIcon from "@/components/icons/CalendarIcon";
import LocationIcon from "@/components/icons/LocationIcon";
import CheckoutButton from "@/components/shared/CheckoutButton";
import EventCollection from "@/components/shared/EventCollection";
import { Button } from "@/components/ui/button";
import { getEventById, getRelatedEventsByCategory } from "@/lib/server_actions/event.actions";
import { clampLetters, formatDateTime } from "@/lib/utils";
import { EventData } from "@/types";
import Image from "next/image";
import Link from "next/link";

const EventPage = async (
  { params: { id, owner }, searchParams}:
  { 
    params: { id: string, owner:string },
    searchParams: Record<string, string>
  }
) => {
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const event:EventData = await getEventById(id);

  const isOwner = event.organizer?._id === owner;

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page,
    limit: 6
  })

  return (
    <div className="flex flex-col gap-4">
    <div className="flex md:flex-row flex-col gap-3 w-full p-2">
      <div className="flex justify-center w-full">
        <Image
          alt="Event Image"
          src={event?.imageUrl}
          width={1280}
          height={575}
        />
      </div>

      <div className="flex flex-col gap-3 p-2">
        <div>
          <h1 className="text-4xl font-semibold">
            {event?.title}
          </h1>
        </div>

        <div className="flex gap-2">
          <div>
            <h3 className="text-lg bg-yellow-400 p-2 rounded-xl shadow-md">
              {event?.price ? `$${event?.price}` : 'FREE'}
            </h3>
          </div>
          <div className="flex-1">
            <h3 className=" w-fit text-lg bg-emerald-300 p-2 rounded-xl shadow-md">
              {clampLetters(event?.category?.name, 10)}
            </h3>
          </div>
        </div>

        <div>
          <h4 className="text-xl">
            Hosted by&nbsp;
            {
              isOwner ? (
                <span>You</span>
              ) : (
                <span>{event.organizer?.firstName + ' ' + event.organizer?.lastName}</span>
              )
            }
          </h4>
        </div>

        {
          !isOwner ? <CheckoutButton event={event}/> :
          (
            <div className="flex gap-1">
              <Button asChild className="md:w-fit">
                <Link href={`/events/update/${event?._id}`}>
                  Edit
                </Link>
              </Button>

              <DeleteEventConfirmDialog 
                eventId={event?._id}
                eventTitle={event?.title}
                userProfileRedirect={true}
              />
            </div>
          )
        }

        <div className="flex gap-2 items-center">
          <div>
            <CalendarIcon color="tomato" />
          </div>

          <div className="flex gap-1 text-lg">
            <div className="flex flex-col gap-1 items-end">
              <p>Start:</p>
              <p>End:</p>
            </div>

            <div className="flex flex-col gap-1">
              <p>
                {formatDateTime(event?.startDate).dateOnly}&nbsp;-&nbsp;
                {formatDateTime(event?.startDate).timeOnly}
              </p>

              <p>
                {formatDateTime(event?.endDate).dateOnly}&nbsp;-&nbsp;
                {formatDateTime(event?.endDate).timeOnly}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 text-xl items-center">
          <LocationIcon color="tomato"/>
          <p>{event?.location}</p>
        </div>

        <div>
          <Button 
            variant="secondary" 
            asChild 
            className="bg-sky-200 hover:bg-sky-100 hover:shadow-md"
          >
            <Link href={`${event?.url}`}>
              Event Website
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">About the event</h3>
          <p>
            {event?.description}
          </p>
        </div>
      </div>

    </div>

    <div className="flex flex-col gap-3 items-center p-2">
      <h1 className="text-3xl">Related Events</h1>

      <EventCollection 
        data={relatedEvents?.data} 
        type="RELATED"
        limit={6}
        page={page}
        totalPages={relatedEvents?.totalPages}
        noEventText="No Events Found"
        noEventSubText="Come back again later."
      />
    </div>
    </div>
  )
}

export default EventPage