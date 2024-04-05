import { Schema, model, models } from "mongoose";

interface EventDataForSchema {
  _id: string,
  title: string;
  description?: string;
  location?: string;
  imageUrl: string;
  price?: string;
  freeEvent: boolean;
  url?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  // objectId of Categories document
  category: { _id: string, name: string };
  // objectId of Users document
  organizer: { _id: string, firstName: string, lastName: string };
}

export const EventSchema = new Schema<EventDataForSchema>({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  imageUrl: { type: String, required: true },
  price: { type: String },
  freeEvent: { type: Boolean, default: false},
  url: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  //objectId of Categories document
  category: { type: Schema.Types.ObjectId, ref: "Categories" },
  //objectId of Users document
  organizer: { type: Schema.Types.ObjectId, ref: "Users" }
});

const Events = models?.Events || model('Events', EventSchema);
export default Events;