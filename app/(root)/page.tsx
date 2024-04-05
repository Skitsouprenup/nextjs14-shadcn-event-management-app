import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import EventCollection from "@/components/shared/EventCollection";
import { getEvents } from "@/lib/server_actions/event.actions";
import Search from "@/components/shared/Search";
import CategoryFilter from "@/components/shared/CategoryFilter";

export default async function Home(
  {searchParams}:
  {searchParams:Record<string, string>}
) {
  const page = Number(searchParams?.page) || 1;
  const searchText = searchParams?.search || '';
  const category = searchParams?.category || '';

  const events = await getEvents({
    query: searchText,
    category,
    page,
    limit: 5
  })

  return (
    <div 
      className="md:px-8 px-2 flex flex-col gap-4" 
      style={{backgroundColor: 'none'}}
    >
      <div
        className="flex gap-[10px] p-2 sm:flex-row flex-col"
      >
        <section className="flex-1 flex items-center">
          <div className="flex flex-col justify-around gap-[10px]">
            <h1
              className="
              md:text-3xl text-2xl libre-baskerville-bold
              "
            >
              Easily manage events
              and enjoy many features
              that our platform offers!
            </h1>

            <h3>
              Try our service and learn helpful
              tips from 6,999+ mentors that are
              ready to support you 24/7!
            </h3>

            <Button size="lg" asChild className="md:w-fit">
              <Link href="#events">
                Explore Now
              </Link>
            </Button>
          </div>
        </section>
        <section 
          className="flex-1 flex items-stretch overflow-hidden shadow-2xl" 
          style={{borderRadius: '100%'}}
        >
          <Image
            alt="Hero Image"
            src="/assets/hero-image.jpg"
            width={1000}
            height={800}
          />
        </section>
      </div>

      <section id="events">
        <h2 className="md:text-3xl text-2xl libre-baskerville-bold">
          Over 1,000+ events<br />have been concluded.
        </h2>
      </section>

      <section
        className="flex flex-col gap-2"
      >
        <Search placeholder="Search events..."/>
        <CategoryFilter />
      </section>

      <EventCollection 
        data={events?.data} 
        type="ALL"
        limit={5}
        page={page}
        totalPages={events?.totalPages}
        noEventText="No Events Found"
        noEventSubText="Come back again later."
      />
    </div>
  );
}
