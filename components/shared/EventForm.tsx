'use client';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/utils/validators";
import { eventDefaultValues } from "@/utils/constants";
import Dropdown from "./Dropdown";
import { Textarea } from "../ui/textarea";
import FileUploader from "./FileUploader";
import { useState } from "react";
import Image from "next/image";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/utils/uploadthing";
import { handleError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createEventEntry, updateEventEntry } from "@/lib/server_actions/event.actions";
import { CategoryDocument, EventFormData } from "@/types";

const EventForm = (
  { payload }:
  { payload: {
      userId: string, 
      type: 'Create' | 'Update',
      categoryList: Array<CategoryDocument>,
      eventId?: string,
      eventData?: EventFormData,
      isAdmin: boolean
    } 
  }
) => {
  const[files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing('imageUploader');
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: 
      payload.type === 'Create' ? 
      eventDefaultValues : payload.eventData,
  })
 
  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if(files.length > 0) {
      const uploadedImages = await startUpload(files)

      if(!uploadedImages) return;

      uploadedImageUrl = uploadedImages[0].url
    }

    if(payload.type === 'Create') {

      try {
        //console.log(values)
        const newEvent = await createEventEntry({
          event: {...values, imageUrl: uploadedImageUrl },
          userId: payload.userId,
          path: '/profile'
        })

        if(newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      }
      catch(error) {
        handleError(error);
      }
    }

    if(payload.type === 'Update') {
      if(!payload.eventId) {
        console.error("Can't update. Invalid event ID")
        router.back();
        return;
      }

      try {
        const updatedEvent = await updateEventEntry({
          event: {...values, imageUrl: uploadedImageUrl },
          userId: payload.userId,
          eventId: payload.eventId,
          path: `/events/${payload.eventId}`
        });

        if(updatedEvent) {
          form.reset();
          router.push(`/events/${updatedEvent._id}`)
        }
      }
      catch(error) {
        handleError(error);
      }
    }

  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="flex flex-col gap-3 p-4"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  {/*
                    field variable holds all 
                    props that's necessary to input
                    like events, bindings, value, etc.
                   */
                  }
                  <div className="form-input-container">
                    <Input className="form-input" placeholder="Title" {...field} />
                  </div>
                </FormControl>
                {/*Invalid field messages goes here */}
                <FormMessage /> 
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <Dropdown 
            form={form} 
            categoryList={payload.categoryList} 
            isAdmin={payload.isAdmin}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Description</FormLabel>
                <FormControl className="h-full">
                  <div className="form-input-container" style={{alignItems:'stretch'}}>
                    <Textarea className="form-input" placeholder="Title" {...field} />
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader 
                    onChangeHandler={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="form-input-container">
                    <Image 
                      alt="icon"
                      src="/assets/icons/location.svg"
                      width={25}
                      height={25}
                      style={{width: '25px', height: '25px'}}
                    />
                    
                    <Input 
                      className="form-input" 
                      placeholder="Event Location" {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <div className="form-input-container">
                    {/*
                      Add p-2 here because p-2 on top div
                      doesn't work for some reason 
                    */}
                    <div className="flex gap-1 p-2">
                      <Image 
                        alt="icon"
                        src="/assets/icons/calendar.svg"
                        width={25}
                        height={25}
                        style={{width: '25px', height: '25px'}}
                      />
                      <p>Date/Time:</p>
                      <DatePicker
                        selected={field.value} 
                        onChange={(date) => field.onChange(date!)} 
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        wrapperClassName="date-picker"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <div className="form-input-container">
                    {/*
                      Add p-2 here because p-2 on top div
                      doesn't work for some reason 
                    */}
                    <div className="flex gap-1 p-2">
                      <Image 
                        alt="icon"
                        src="/assets/icons/calendar.svg"
                        width={25}
                        height={25}
                        style={{width: '25px', height: '25px'}}
                      />
                      <p>Date/Time:</p>
                      <DatePicker
                        selected={field.value} 
                        onChange={(date) => field.onChange(date!)} 
                        showTimeSelect
                        timeInputLabel="Time:"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        wrapperClassName="date-picker"
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="form-input-container">
                    <Image 
                      alt="icon"
                      src="/assets/icons/dollar.svg"
                      width={25}
                      height={25}
                      style={{width: '25px', height: '25px'}}
                    />
                    
                    <Input 
                      className="form-input" 
                      placeholder="Price" {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />

          <div className="relative md:top-[14px] flex items-center">
            <FormField
              control={form.control}
              name="freeEvent"
              render={({ field }) => (
                <FormItem className="relative md:w-[110px] flex gap-2 items-center justify-center">
                  <FormLabel>Free Event</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center bottom-[3px]">
                      <Checkbox
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        id="isFree"
                        className="w-[25px] h-[25px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage /> 
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <div className="form-input-container">
                    <Image 
                      alt="icon"
                      src="/assets/icons/link.svg"
                      width={25}
                      height={25}
                      style={{width: '25px', height: '25px'}}
                    />
                    
                    <Input 
                      className="form-input" 
                      placeholder="" {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage /> 
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {
            form.formState.isSubmitting ? 
            'Submitting' :
            `${payload.type} Event`
          }
        </Button>
      </form>
    </Form>
  )
}

export default EventForm