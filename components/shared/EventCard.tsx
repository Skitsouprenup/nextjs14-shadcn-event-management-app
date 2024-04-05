import { clampLetters, formatDateTime } from "@/lib/utils"
import { EventData } from "@/types"
import Image from "next/image"
import Link from "next/link"
import DeleteEventConfirmDialog from "../dialogs/DeleteEventConfirmDialog"

const EventCard = (
  {event, withOrderLink, loggedInUserId}:
  {
    event:EventData, 
    withOrderLink:boolean, 
    loggedInUserId:string
  }
) => {
  const isEventCreator = loggedInUserId === event?.organizer?._id.toString()
  return (
    <div className="
      flex flex-col gap-3 rounded-lg md:shadow-md shadow-sm
      border border-1 border-zinc-300 p-2 h-full"
    >
      <div className="relative flex-1 overflow-hidden">
        <Link href={`/events/${event?._id}/${event?.organizer?._id.toString()}`}>
          <Image
            className="hover:scale-105 transition-all duration-300"
            alt="image"
            src={event?.imageUrl}
            width={1280}
            height={720}
            style={{
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
            }}
          />
        </Link>
        {
          isEventCreator && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Link href={`/events/update/${event?._id}`}>
                <div className="
                  p-2 rounded-xl bg-stone-200 border border-gray-300
                  hover:scale-105 transition-all duration-300"
                >
                  <Image
                    alt="edit"
                    src="/assets/icons/edit.svg"
                    width={20}
                    height={20}
                  />
                </div>
              </Link>

              <DeleteEventConfirmDialog 
                eventId={event?._id}
                eventTitle={event?.title} 
              />
            </div>
          )
        }
        
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
            <div>
              <h3 className="bg-yellow-400 p-2 rounded-xl shadow-md">
                {event?.freeEvent ? 'FREE' : '$' + event?.price}
              </h3>
            </div>

            <div className="flex-1 overflow-hidden">
              <h3 
                className="w-fit
                bg-emerald-300 p-2 rounded-xl shadow-md"
              >
                {clampLetters(event?.category?.name, 10)}
              </h3>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div>
              <p className="text-stone-500">
                {formatDateTime(event?.startDate).dateOnly}
              </p>
            </div>

            <div>
              <h2 className="text-2xl">
                {event?.title}
              </h2>
            </div>

            <div className="pb-3">
              <h3 className="text-lg font-light text-stone-700">
              {
                event?.organizer?.firstName + ' ' +
                event?.organizer?.lastName
              }
              </h3>
            </div>
            
            {
              /*Show list of orders that bought this specific event */
              withOrderLink && (
                <Link className="w-fit" href={`orders?eventId=${event?._id}`}>
                  <div className="flex gap-1">
                    <p>Order Details</p>
                    <Image 
                      alt="arrow"
                      src="/assets/icons/arrowright.svg"
                      width={25}
                      height={25}
                    />
                  </div>
                </Link>
              )
            }
          </div>
      </div>
    </div>
  )
}

export default EventCard