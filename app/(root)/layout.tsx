import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TopBar, BottomBar, RightSideBar, LeftSideBar } from '@/components/shared'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads',
  description: 'threads clone',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
            <main className='flex flex-row'>
              <LeftSideBar />
                  <section className='main-container'>
                    <div className='w-full max-w-4xl'>
                        {children}
                    </div>
                  </section>
              <RightSideBar />
            </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  )
}
