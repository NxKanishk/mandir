'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { supabase } from './utils/supabse'

type Product = {
  id: number
  name: string
  description: string
  image_url: string
}

export default function DailyDarshanPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
      }
    }
    fetchProducts()
  }, [])

  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)

      toast.success('Image downloaded!')
    } catch (err) {
      console.error('Failed to download image:', err)
      toast.error('Download failed.')
    }
  }

  const handlePreview = (url: string) => {
    setModalImage(url)
    setOpen(true)
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6 flex flex-col items-center">
        <img
          src="logo.png"
          alt="Daily Darshan Logo"
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mb-2"
        />
        <h1 className="text-2xl font-bold text-gray-800">Daily Darshan</h1>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">
            No items found.
          </p>
        )}

        {products.map((product) => (
          <Card
            key={product.id}
            className="transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <CardHeader className="p-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-120 object-cover rounded-t-md cursor-pointer"
                onClick={() => handlePreview(product.image_url)}
                onError={(e) => {
                  e.currentTarget.src = '/fallback-image.png'
                }}
              />
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              {/* Optional Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handlePreview(product.image_url)}>
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      downloadImage(product.image_url, `${product.name}.jpg`)
                    }
                  >
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog for Image Preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
          </DialogHeader>
          {modalImage && (
            <img
              src={modalImage}
              alt="Preview"
              className="w-full h-auto rounded"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Footer Strip */}
      <div className="mt-12 w-full bg-gray-100 py-4 text-center text-sm text-gray-600 rounded-md shadow-inner">
        © {new Date().getFullYear()} Daily Darshan. All rights reserved. <br />
        Created By Kansihk Raj Singh Jhala
      </div>

    </div>
  )
}
