'use server'

import { ObjectId } from "mongodb";

import Stripe from 'stripe';
import { CheckoutOrderData, CreateOrderData, GetOrdersByEventData, GetOrdersByUserData } from "@/types";
import { redirect } from "next/navigation";
import connectDB from '@/lib/database';
import Orders from '@/lib/database/models/orders.model';
import { handleError } from '@/lib/utils';
import Events from '@/lib/database/models/events.model';
import Users from '@/lib/database/models/users.model';
import Category from '../database/models/categories.model';

export const checkoutOrder = async (order: CheckoutOrderData) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  //Don't forget to convert price to cents. 1 USD = 100 cents
  const price = order.freeEvent ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!)
  } catch (error) {
    throw error;
  }
}

//Create order record in the database
export const createOrder = async (order: CreateOrderData) => {
  try {
    await connectDB();
    
    const newOrder = await Orders.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
}

export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventData) {
  try {
    await connectDB();

    if (!eventId) throw new Error('Event ID is required')
    const eventObjectId = eventId.toString();

    const orders = await Orders.aggregate([
      {
        //Perform left outer join
        //between orders(left doc) and
        //users(right doc)
        $lookup: {
          //collection name that will be
          //joined with orders collection
          from: 'users',
          //field in orders document that will
          //be compared with the 'foreignField'
          localField: 'buyer',
          //field in users document that will
          //be compared with the 'localField'
          foreignField: '_id',
          //New field that will contain
          //an array where the matched
          //document in the right collection(users)
          //is stored
          as: 'buyer',
        },
      },
      {
        //deconstruct the 'buyer' array field
        //in the previous output and distribute
        //each element in the array to every
        //document where it belongs.
        $unwind: '$buyer',
      },
      {
        //Perform left outer join
        //between previous output(left doc) and
        //events(right doc)
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        //deconstruct the 'event' array field
        //in the previous output and distribute
        //each element in the array to every
        //document where it belongs.
        $unwind: '$event',
      },
      {
        //Choose/add document fields that we wanna send to the
        //next pipeline. _id, totalAmount and createdAt fields
        //are chosen whereas the latter are added.
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: '$event.title',
          eventId: '$event._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [{ eventId: new ObjectId(eventObjectId) }, { buyer: { $regex: RegExp(searchString, 'i') } }],
        },
      }
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserData) {
  try {
    await connectDB();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: userId };

    //db.distinct() grabs unique fields in documents. If a
    //field has duplicates, the first one will be returned
    //and others are ignored. In mongodb, distinct returns
    //an array of distinct fields. In our case, in 
    //mongoose, distinct returns a query or collection of
    //document with distinct 'event._id'. In other words,
    //the query can return documents with unique 'event._id' field.
    const orders = await Orders.distinct('event._id')
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'event',
        model: Events,
        populate: [
          {
            path: 'organizer',
            model: Users,
            select: '_id firstName lastName',
          },
          {
            path: 'category',
            model: Category,
            select: '_id name',
          },
        ],
      });

    const ordersCount = await Orders.distinct('event._id').countDocuments(conditions);

    return { 
      data: JSON.parse(JSON.stringify(orders)), 
      totalPages: Math.ceil(ordersCount / limit) 
    }
  } catch (error) {
    handleError(error);
  }
}