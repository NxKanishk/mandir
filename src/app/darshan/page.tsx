'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabse'

type Product = {
    id: number
    name: string
    description: string
    image_url: string
}

export default function DailyDarshanPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState<File | null>(null)
    const [editMode, setEditMode] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)

    // Fetch products
    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*')
        if (error) {
            console.error('Fetch error:', error)
        } else {
            setProducts(data || [])
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    // Upload image to bucket and return public URL
    const uploadImage = async (file: File) => {
        const fileName = `${Date.now()}-${file.name}`
        const { error } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)

        if (error) {
            console.error('Upload error:', error)
            return null
        }

        const { data: publicUrlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName)

        return publicUrlData?.publicUrl || null
    }

    // Delete image from bucket
    const deleteImageFromURL = async (url: string) => {
        const path = url.split('/product-images/')[1]
        if (path) {
            await supabase.storage.from('product-images').remove([path])
        }
    }

    // Create new product
    const handleCreate = async () => {
        if (!image) return alert('Upload image first')
        const imageUrl = await uploadImage(image)
        if (!imageUrl) return

        const { error } = await supabase.from('products').insert({
            name,
            description,
            image_url: imageUrl,
        })

        if (error) {
            console.error('Insert error:', error)
        }

        setName('')
        setDescription('')
        setImage(null)
        fetchProducts()
    }

    // Delete product + image
    const handleDelete = async (id: number, imageUrl: string) => {
        await deleteImageFromURL(imageUrl)
        await supabase.from('products').delete().eq('id', id)
        fetchProducts()
    }

    // Set edit mode
    const openEditModal = (product: Product) => {
        setEditMode(true)
        setEditProduct(product)
        setName(product.name)
        setDescription(product.description)
    }

    // Update product
    const handleUpdate = async () => {
        if (!editProduct) return

        let imageUrl = editProduct.image_url

        if (image) {
            await deleteImageFromURL(imageUrl)
            const newUrl = await uploadImage(image)
            if (newUrl) imageUrl = newUrl
        }

        await supabase
            .from('products')
            .update({ name, description, image_url: imageUrl })
            .eq('id', editProduct.id)

        setEditMode(false)
        setEditProduct(null)
        setName('')
        setDescription('')
        setImage(null)
        fetchProducts()
    }

    return (
        <div className="min-h-screen bg-white p-4">
            {/* Header Card with Logo */}
            <div className="bg-white shadow-lg rounded-lg p-4 mb-6 flex flex-col items-center">
                <img
                    src="logo.png" // Replace with your logo URL
                    alt="Daily Darshan Logo"
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mb-2"
                />
                <h1 className="text-2xl font-bold text-gray-800">Daily Darshan</h1>
            </div>

            {/* Form */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6 space-y-3">
                <input
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 my-custom-input"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <textarea
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 my-custom-textarea"
                    placeholder="Enter Description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="file"
                    className="w-full p-2 border border-gray-300 rounded-md my-custom-input"
                    placeholder="Enter Image"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
                <div className="flex space-x-2">
                    <button
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200" 
                        onClick={editMode ? handleUpdate : handleCreate}
                    >
                        {editMode ? 'Update Item' : 'Add Item'}
                    </button>
                    {editMode && (
                        <button
                            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
                            onClick={() => {
                                setEditMode(false)
                                setEditProduct(null)
                                setName('')
                                setDescription('')
                                setImage(null)
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-1 gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white shadow-md rounded-lg p-4 transition-transform duration-200 hover:scale-105 active:scale-95"
                    >
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover rounded-md mb-3"
                            onError={(e) => {
                                e.currentTarget.src = '/fallback-image.png'
                            }}
                        />
                        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                        <p className="text-gray-600">{product.description}</p>
                        <div className="mt-3 flex space-x-2">
                            <button
                                className="flex-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-200"
                                onClick={() => openEditModal(product)}
                            >
                                Edit
                            </button>
                            <button
                                className="flex-1 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                onClick={() => handleDelete(product.id, product.image_url)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}