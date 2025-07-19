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

import { Mukta } from 'next/font/google'

const mukta = Mukta({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // you can adjust as needed
  display: 'swap',
})


export default function DailyDarshanPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [visibleCount, setVisibleCount] = useState(3)
  const [open, setOpen] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)

useEffect(() => {
        async function fetchProducts() {
            const {
                data,
                error
            } = await supabase.from('products').select('*').order('name', {ascending: false}) // ⬅️ DESCENDING ORDER by name

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
    // <div className="min-h-screen bg-white">
    <div className={`min-h-screen bg-white ${mukta.className}`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-orange-600 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">🛕 Daily Darshan</h1>
          <nav className="space-x-4 text-sm">
            <a href="#gallery" className="hover:underline">Gallery</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#links" className="hover:underline">Links</a>
          </nav>
        </div>
      </header>

      {/* Logo Section */}
      <div className="bg-orange-100 rounded-lg p-6 text-center mt-4 mx-4">
        <img
          src="logo.png"
          alt="Daily Darshan Logo"
          className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-orange-500 mb-2"
        />
        <h2 className="text-2xl font-semibold text-orange-700">Daily Darshan</h2>
        <p className="text-sm text-orange-600">Experience daily blessings through divine images</p>
      </div>

      {/* Gallery Section */}
      <div id="gallery" className="p-4 max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-orange-700 mb-4">Gallery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(0, visibleCount).map((product) => (
            <Card
              key={product.id}
              className="transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <CardHeader className="p-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-t-md cursor-pointer"
                  onClick={() => handlePreview(product.image_url)}
                  onError={(e) => {
                    e.currentTarget.src = '/fallback-image.png'
                  }}
                />
              </CardHeader>
              <CardContent className="pt-4">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
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

        {/* Load More */}
        {visibleCount < products.length && (
          <div className="text-center mt-6">
            <Button
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => setVisibleCount(visibleCount + 3)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* About Section */}
      <div id="about" className="bg-orange-50 mt-12 p-6 max-w-4xl mx-auto rounded-lg shadow">
        <h3 className="text-xl font-semibold text-orange-800 mb-2">Daily Darsahn</h3>
        <img
          src="about.jpg"
          alt="Daily Darshan Logo"
          className="w-100 h-100 mx-auto object-cover border-2 border-orange-500 mb-2"
        />
        <p className="text-sm text-gray-700">
          Daily Darshan is a platform where you can explore and download daily images of
          deities from temples. Stay spiritually connected every day. Located in the heart of Udaipur city, Jagdish Mandir is a majestic Hindu temple dedicated to Lord Vishnu (in the form of Jagannath). Built in 1651 by Maharana Jagat Singh, this architectural marvel is a classic example of Māru-Gurjara style (Indo-Aryan temple architecture).

          Perched near the City Palace, the temple features intricately carved pillars, beautifully sculpted ceilings, and a soaring spire that draws attention from afar. Devotees and tourists flock here daily to witness the spiritual energy, the vibrant aarti, and the fine stone craftsmanship that reflects Rajasthan’s rich cultural heritage.
        </p>
      </div>

      {/* Social Media Links */}
      <div id="links" className="mt-12 text-center">
        <h4 className="text-lg text-orange-700 font-semibold mb-2">Follow us on</h4>
        <div className="flex justify-center gap-4 text-orange-600">
          <a href="https://instagram.com/jagdishtemple_udaipurblog" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a>
          <a href="https://facebook.com/jagdishtemple_udaipurblog" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview Image</DialogTitle>
          </DialogHeader>
          {modalImage && (
            <img src={modalImage} alt="Preview" className="w-full h-auto rounded" />
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-12 w-full bg-orange-100 py-4 text-center text-sm text-orange-700 rounded-t-md shadow-inner">
        © {new Date().getFullYear()} Daily Darshan. All rights reserved. <br />
        Created by Kanishk Raj Singh Jhala
      </footer>
    </div>
  )
}
