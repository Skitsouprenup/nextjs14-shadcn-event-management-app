
import { useDropzone } from "@uploadthing/react";
import { useCallback } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button } from "../ui/button";
import { convertFileToUrl } from "@/lib/utils";
 
const FileUploader = (
  { onChangeHandler, imageUrl, setFiles }:
  { 
    onChangeHandler: (value:string) => void,
    imageUrl: string,
    setFiles: React.Dispatch<React.SetStateAction<File[]>>
  }
) => {
  //Determins if a file has been dropped in the drop box.
  //This event will be executed once a file has been
  //uploaded successfully.
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onChangeHandler(convertFileToUrl(acceptedFiles[0]))
  }, []);
 
  //useDropzone is a hook that determines if onDrop should
  //execute if the image format that's dropped is accepted.
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined,
  });
 
  return (
    <div
    className="
      bg-stone-200 flex cursor-pointer flex-col 
      overflow-hidden rounded-xl" 
      {...getRootProps()}
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-full object-contain"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center py-5">
          <img src="/assets/icons/upload.svg" width={75} height={75} alt="file-upload" />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-md">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileUploader