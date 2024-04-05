import EventForm from "@/components/shared/EventForm";
import { getCategories } from "@/lib/server_actions/category.actions";
import { CategoryDocument } from "@/types";
import { auth } from "@clerk/nextjs"

const CreateEvent = async () => {
  const { sessionClaims } = auth();
  const claims = sessionClaims as Record<string, unknown>;
  const userId = claims?.userId as string
  const isAdmin = Boolean(claims?.isAdmin as string)

  const categoryList: Array<CategoryDocument> = await getCategories();

  return (
    <section className="w-full">
      <EventForm 
        payload={{userId, type: 'Create', categoryList, isAdmin}}
      />
    </section>
  )
}

export default CreateEvent