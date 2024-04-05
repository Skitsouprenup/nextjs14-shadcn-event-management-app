"use server";

import { CreateEventParams, UpdateEventParams } from "@/types"
import { handleError } from "../utils"
import connectDB from "../database"
import Category from "../database/models/categories.model"
import User from "../database/models/users.model"
import Events from "../database/models/events.model"
import { revalidatePath } from "next/cache"
import { getCategoryByName } from "./category.actions";

const populateEvent = (query: any) => {
  return query
    .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

export const getEvents = async (
  {query, limit, page, category}:
  {
    query: string, 
    limit: number, 
    page: number, 
    category: string
  }
) => {
  await connectDB();

  const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {};
  const categoryCondition = category ? await getCategoryByName(category) : null;
  const filter = {
    $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
  };

  const skipAmount = (Number(page) - 1) * limit;
  const events = Events.find(filter)
    .sort({ createdAt: 'desc'})
    .skip(skipAmount)
    .limit(limit);

  const populatedEvents = await populateEvent(events);
  const eventsCount = await Events.countDocuments(events);

  return {
    data: JSON.parse(JSON.stringify(populatedEvents)),
    totalPages: eventsCount
  }
}

export const createEventEntry = async (
  {event, userId, path}: CreateEventParams
) => {
  try {
    await connectDB();

    const organizer = await User.findById(userId);

    if(!organizer) {
      throw new Error("Organizer not found!");
    }

    const newEntry = await Events.create({
      ...event,
      category: event.category,
      organizer: userId
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newEntry));
  }
  catch(error) {
    handleError(error);
  }
}

export const getEventById = async (eventId: string) => {
  try {
    await connectDB();

    const event = await populateEvent(Events.findById(eventId));

    if(!event) {
      throw new Error("Event doesn't exist!");
    }

    return JSON.parse(JSON.stringify(event));
  }
  catch(error) {
    handleError(error);
  }
}

export async function getRelatedEventsByCategory(
  {categoryId, eventId, limit = 3, page = 1}: 
  {
    categoryId: string,
    eventId: string,
    limit: number, //Number of events in a page
    page: number
  }
) {
  try {
    await connectDB()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

    const eventsQuery = Events.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const events = await populateEvent(eventsQuery)
    const eventsCount = await Events.countDocuments(conditions)

    return { 
      data: JSON.parse(JSON.stringify(events)),
      //Use Math.ceil to include excess pages to
      //new page. If the result of this division has
      //fractional part, it means that there are
      //excess pages. 
      totalPages: Math.ceil(eventsCount / limit) 
    }
  } catch (error) {
    handleError(error)
  }
}

export async function updateEventEntry(
  { userId, eventId, event, path }: UpdateEventParams) {
  try {
    await connectDB()

    const eventToUpdate = await Events.findById(eventId)
    if (!eventToUpdate || eventToUpdate.organizer.toString() !== userId) {
      throw new Error('Unauthorized or event not found')
    }

    const updatedEvent = await Events.findByIdAndUpdate(
      eventId,
      { ...event },
      { new: true }
    )
    revalidatePath(path)

    return JSON.parse(JSON.stringify(updatedEvent))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteEvent(
  { eventId, path }:
  {
    eventId:string, 
    path:string
  }
) {
  try {
    await connectDB();

    const deletedEvent = await Events.findByIdAndDelete(eventId)
    if (deletedEvent) revalidatePath(path)
  } catch (error) {
    handleError(error)
  }
}

export async function getEventsByUser(
  { 
    userId, 
    limit = 6, //Number of events in a page 
    page 
  }: 
  { userId: string, limit?: number, page: number }
) {
  try {
    await connectDB();

    const filterQuery = { organizer: userId };
    const skipAmount = (Number(page) - 1) * limit;

    const eventsQuery = Events.find(filterQuery)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Events.countDocuments(filterQuery);

    return { 
      data: JSON.parse(JSON.stringify(events)), 
      totalPages: Math.ceil(eventsCount / limit)
    }
  } catch (error) {
    handleError(error);
  }
}