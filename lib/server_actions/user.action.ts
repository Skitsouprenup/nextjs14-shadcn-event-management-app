'use server';

import { revalidatePath } from 'next/cache';

import { CreateUserData, UpdateUserData } from "@/types";
import { handleError } from "@/lib/utils";
import connectDB from "@/lib/database";

import User from '@/lib/database/models/users.model';
import Events from '@/lib/database/models/events.model';
import Orders from '@/lib/database/models/orders.model';

export const createUser = async (user: CreateUserData) => {
  try {
    await connectDB();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  }
  catch(error) {
    handleError(error);
  }
}

export async function getUserById(userId: string) {
  try {
    await connectDB();

    const user = await User.findById(userId)

    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserData) {
  try {
    await connectDB();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectDB();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Events.updateMany(
        { organizer: userToDelete._id },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Orders.updateMany({ buyer: userToDelete._id }, { $unset: { buyer: 1 } }),
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}