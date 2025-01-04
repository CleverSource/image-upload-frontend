"use client"

import { storage } from "@/app/appwrite"
import { useAuth } from "@/lib/auth-context"
import { Models, Query } from "appwrite"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { ExternalLink, Link, RefreshCw, Trash2 } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useToast } from "@/hooks/use-toast"
import dotenv from "dotenv";
dotenv.config();

export function Dashboard() {
  const { user } = useAuth()
  const [images, setImages] = useState<Models.File[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Models.File | null>(null)
  const [selectedImageHref, setSelectedImageHref] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const fetchImages = useCallback(async () => {
    if (!user) {
      return
    }

    setIsLoading(true)
    try {
      const result = await storage.listFiles(
        "image-uploads",
        [
          Query.startsWith("name", user.$id)
        ]
      )
      setImages(result.files)
    } catch (error) {
      console.error("Error fetching images:", error)
      setImages([])
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteFile("image-uploads", id)
      setImages(images?.filter((image) => image.$id !== id))
      setIsDeleteDialogOpen(false)
      setSelectedImage(null)
      toast({
        title: "Image deleted",
        description: "The image has been successfully deleted.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      })
    }
  }

  const stripUserId = (name?: string) => {
    if (!user || !name) {
      return ""
    }

    return name.substring(name.indexOf(user.$id) + user.$id.length + 1)
  }

  const handleCopyLink = (id: string, name: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_IMAGE_HOST as string}/${id}/${stripUserId(name)}`)
    toast({
      title: "Link copied",
      description: "The image link has been copied to your clipboard."
    })
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Your Images</h1>
        <Button onClick={fetchImages} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center">Loading images...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.$id} className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl bg-background">
              <Image 
                src={storage.getFilePreview("image-uploads", image.$id, 300, 300).href}
                alt={stripUserId(image.name)}
                width={300}
                height={300}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-50 flex items-center justify-center">
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      setSelectedImageHref(storage.getFileView("image-uploads", image.$id).href)
                      setSelectedImage(image)
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Preview image</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleCopyLink(image.$id, image.name)}
                  >
                    <Link className="h-4 w-4" />
                    <span className="sr-only">Copy image link</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      setSelectedImage(image)
                      setIsDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete image</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={selectedImage !== null && !isDeleteDialogOpen} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{stripUserId(selectedImage?.name)}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-square">
            {selectedImage && (
              <Image 
                src={selectedImageHref}
                alt={selectedImage.name}
                fill
                className="object-contain"
              />
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="secondary"
              onClick={() => selectedImage && handleCopyLink(selectedImage.$id, selectedImage.name)}
            >
              <Link className="h-4 w-4 mr-2" />
              Copy link
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedImage(null)
              setIsDeleteDialogOpen(false)
            }}>Cancel</Button>
            <Button variant="destructive" onClick={() => selectedImage && handleDelete(selectedImage.$id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}