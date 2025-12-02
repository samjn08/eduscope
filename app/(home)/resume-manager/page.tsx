'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import ResumeList from '@/components/resume/ResumeList'
import ResumeUpload from '@/components/resume/ResumeUpload'
import { Resume } from '@prisma/client'
import { getUserResumes, AnalyzeAndStoreResume } from '@/app/server/db'
import { getPresignedUploadUrl } from '@/app/server/r2'

function Page() {
  const [showUpload, setShowUpload] = useState(false)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  // Load resumes from DB
  const loadResumes = async () => {
    setLoading(true)
    try {
      const res = await getUserResumes()
      setResumes(res)
    } catch (error) {
      console.error('Failed to load resumes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle file upload
  const handleUpload = async (file: File, targetRole: string) => {
    try {
      const fileName = encodeURIComponent(file.name).split('.').join(`_${Date.now()}.`)
      const fileType = encodeURIComponent(file.type)

      const response = await getPresignedUploadUrl(fileName, fileType, 'resumes')
      if (!response.success || !response.url) throw new Error(response.error || 'Failed to get upload URL')

      const { url } = response

      // Upload file to R2 via PUT
      const resp = await fetch(url, {
        method: 'PUT',
        body: file
      })

      if (!resp.ok) throw new Error('Upload failed')

      // Generate shareable link
      const filePath = url.split('/').slice(3).join('/').split('?')[0]
      const share_link = `https://prepapp.vinucode.in/${filePath}`

      // Analyze and store resume
      const analysis = await AnalyzeAndStoreResume(share_link, targetRole, file.name)
      console.log('Resume analyzed:', analysis)

      loadResumes()
      setShowUpload(false)
    } catch (error) {
      console.error('Error uploading resume:', error)
    }
  }

  useEffect(() => {
    loadResumes()
  }, [])

  return (
    <main className="flex flex-col text-zinc-900 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-100">
            Resume Manager
          </h1>
          <p className="text-sm text-gray-400">ATS scoring, version history & easy sharing</p>
        </div>

        <div className="flex gap-3">
          <Button
  onClick={() => setShowUpload(true)}
  className="bg-gray-800 border border-gray-700 hover:border-gray-600 text-white font-medium rounded-md shadow-sm hover:shadow transition-colors flex items-center"
>
  <Upload className="w-4 h-4 mr-2 text-white" />
  Upload Resume
</Button>

        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <ResumeUpload
          onUpload={handleUpload}
          onClose={() => setShowUpload(false)}
        />
      )}

      {loading ? (
  <div className="flex flex-col gap-6 mt-6 w-full">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-gray-700 rounded-xl p-6 shadow-sm w-full flex flex-col md:flex-row justify-between gap-6"
      >
        <div className="flex-1 flex flex-col gap-4">
          {/* Header skeleton */}
          <div className="flex items-start gap-4 w-full">
            <div className="h-12 w-12 bg-gray-600 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2 w-full">
              <div className="h-4 bg-gray-600 rounded w-1/3"></div>
              <div className="h-3 bg-gray-600 rounded w-1/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/5"></div>
            </div>
          </div>

          {/* ATS score skeleton */}
          <div className="h-12 bg-gray-600 rounded-lg w-full md:w-1/3"></div>

          {/* Strengths / Weaknesses / Suggestions skeleton */}
          <div className="space-y-2 w-full">
            <div className="h-10 bg-gray-600 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-600 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-600 rounded-lg w-full"></div>
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex flex-row md:flex-col gap-3 w-full md:w-40 mt-4 md:mt-0">
          <div className="h-10 bg-gray-600 rounded-md w-full"></div>
          <div className="h-10 bg-gray-600 rounded-md w-full"></div>
        </div>
      </div>
    ))}
  </div>
) : (
  <ResumeList resumes={resumes} />
)}


    </main>
  )
}

export default Page
