import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <section className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Murphy Podcast Generator</h1>
        <p className="text-gray-600 mb-6">
          Easily create and generate podcasts with just a few clicks. Start your podcasting journey now!
        </p>
        <Link href="/generate-podcast">
          <Button className="w-full">Generate Podcast</Button>
        </Link>
      </section>
    </main>
  )
}

export default HomePage