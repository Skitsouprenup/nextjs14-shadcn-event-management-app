import EventForm from "@/components/shared/EventForm";
import { getCategories } from "@/lib/server_actions/category.actions";
import { getEventById } from "@/lib/server_actions/event.actions";
import { CategoryDocument } from "@/types";
import { auth } from "@clerk/nextjs";

const UpdateEvent = async (
  { params: { id }}:
  { params: { id:string }}
) => {
  const { sessionClaims } = auth();
  const claims = sessionClaims as Record<string, unknown>;
  const userId = claims?.userId as string
  const isAdmin = Boolean(claims?.isAdmin as string)

  const categoryList: Array<CategoryDocument> = await getCategories();
  const eventData = await getEventById(id);

  const categoryId = eventData?.category?._id;
  
  //MongoDB returns date as strings.
  const startDate = new Date(Date.parse(eventData?.startDate))
  const endDate = new Date(Date.parse(eventData?.endDate))

  return (
    <section className="w-full">
      <EventForm 
        payload={{
          userId, 
          type: 'Update', 
          categoryList,
          eventData: {
            ...eventData, 
            category: categoryId,
            startDate,
            endDate
          },
          eventId: eventData?._id,
          isAdmin
        }}
      />
    </section>
  )
}

export default UpdateEvent