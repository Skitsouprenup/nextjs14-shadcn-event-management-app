import { EventData } from "@/types"
import EventCard from "./EventCard";
import { auth } from "@clerk/nextjs";
import Pagination from "./Pagination";

const EventCollection = async (
  {
    data, 
    type, 
    limit, 
    page, 
    totalPages=5, 
    urlParamName,
    noEventText,
    noEventSubText
  }:
  {
    data: Array<EventData>,
    //ALL = All Events
    //RELATED = Related Events
    //PAID = User's ticket that has been bought
    //ORGANIZER = Event Creator
    type: 'ALL' | 'RELATED' | 'PAID' | 'ORGANIZER',
    limit: number,
    page: number,
    totalPages?: number,
    //This is used for pagination
    urlParamName?: string,
    noEventText: string,
    noEventSubText: string
  }
) => {
  const { sessionClaims } = auth();
  const claims = sessionClaims as Record<string, unknown>;
  const userId = claims?.userId as string;

  return (
    <section>
      {
        data.length > 0 
        ? (
          <div className="flex flex-col items-center gap-5">
            <ul
              className="
              grid w-full grid-cols-1 gap-3 sm:grid-cols-2
              md:grid-cols-3 xl:gap-5 py-3"
            >
              {
                data.map((item) => {
                  const withOrderLink = 
                    type === 'ORGANIZER';

                  return (
                    <li key={item?._id}>
                      <EventCard 
                        event={item} 
                        withOrderLink={withOrderLink} 
                        loggedInUserId={userId}
                      />
                    </li>
                  )
                })
              }
            </ul>

          </div>
        ) : <div className="flex flex-col items-center justify-center h-[200px]">
              <h2 className="text-xl">{noEventText}</h2>
              <h3 className="text-stone-600">{noEventSubText}</h3>
            </div>
      }

      {
        (limit <= totalPages || page > 1) && (
          <div className="w-full">
            <Pagination 
              urlParamName={urlParamName} 
              page={page} 
              totalPages={totalPages}
              limit={limit} 
            />
          </div>
        )
      }
    </section>
  )
}

export default EventCollection