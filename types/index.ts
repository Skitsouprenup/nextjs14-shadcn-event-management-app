/* Forms */

export interface EventFormData {
  title: string
  description: string
  location: string
  imageUrl: string
  startDate: Date
  endDate: Date
  category: string
  price: string
  freeEvent: boolean
  url: string
}

/* */

/* User Server Actions */

export type CreateUserData = {
  clerkId: string
  firstName: string
  lastName: string
  username: string
  email: string
  photo: string
}

export type UpdateUserData = {
  firstName: string
  lastName: string
  username: string
  photo: string
}

/* */

/* Clerk */

export interface ClerkWebhookCreateUserPayload {
  id:string;
  email_addresses:Array<{email_address: string}>
  image_url:string; 
  first_name:string;
  last_name:string;
  username:string;
}

/* */

/* Category Data */

export interface CategoryDocument{
  _id: string;
  name: string;
}

export interface CreateCategoryPayload {
  name: string
}

export interface CategoryData {
  _id: string
  name: string
}


/* */

/* Event Form Server Actions */

export type EventData = {
  _id: string
  title: string
  description: string
  price: string
  freeEvent: boolean
  imageUrl: string
  location: string
  startDate: string
  endDate: string
  url: string
  organizer: {
    _id: string
    firstName: string
    lastName: string
  }
  category: {
    _id: string
    name: string
  }
}

export interface CreateEventParams {
  userId: string
  event: EventFormData
  path: string
}

export interface UpdateEventParams {
  userId: string
  eventId: string
  event: EventFormData
  path: string
}

/* */

/*Order Server Actions */

export interface CheckoutOrderData {
  eventTitle: string
  eventId: string
  price: string
  freeEvent: boolean
  buyerId: string
}

export interface CreateOrderData {
  stripeId: string
  eventId: string
  buyerId: string
  totalAmount: string
  createdAt: Date
}

export interface GetOrdersByEventData {
  eventId: string
  searchString: string
}

export interface GetOrdersByUserData {
  userId: string
  limit?: number
  page: number
}

export interface OrderPayload {
  createdAt: Date
  stripeId: string
  totalAmount: string
  event: {
    _id: string
    title: string
  }
  buyer: {
    _id: string
    firstName: string
    lastName: string
  }
}

export type OrderItem = {
  _id: string
  totalAmount: string
  createdAt: string
  eventTitle: string
  eventId: string
  buyer: string
}

/* */