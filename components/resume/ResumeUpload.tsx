'use client'
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Brain, FileText, Upload, X, CheckCircle2, Trash2, Target } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

interface Props {
  onUpload: (file: File, targetRole: string) => Promise<void>
  onClose: () => void
}

function ResumeUpload({ onUpload, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setError(null)
    const droppedFile = e.dataTransfer.files[0]
    if (!droppedFile) return
    if (droppedFile.type !== 'application/pdf') {
      setError('Only PDF files are supported')
      return
    }
    setFile(droppedFile)
  }

  const handleFilePick = () => fileInputRef.current?.click()

  const handleSubmit = async () => {
    if (!file || !targetRole) return
    setIsProcessing(true)
    setError(null)
    try {
      await onUpload(file, targetRole)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 w-full max-w-xl rounded-xl shadow-xl border border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold tracking-tight text-white">Upload Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Close upload dialog"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Target Role */}
          <div>
            <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-gray-400" /> Target Role
            </Label>
            <Input
  placeholder="e.g. Frontend Engineer, Data Analyst"
  value={targetRole}
  onChange={(e) => setTargetRole(e.target.value)}
  className="mt-2 !border !border-gray-700 !bg-gray-800 !text-white focus:!ring-1 focus:!ring-blue-500"
/>

          </div>

          {/* File Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-900/30 shadow-md scale-[1.01]'
                : 'border-gray-700 hover:border-blue-500 hover:bg-blue-900/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setError(null)
                const f = e.target.files?.[0] || null
                if (f && f.type !== 'application/pdf') {
                  setError('Only PDF files are supported')
                  return
                }
                setFile(f)
              }}
              className="hidden"
            />

            {!file && (
              <>
                <FileText className="w-16 h-16 mx-auto mb-5 text-blue-400" />
                <p className="text-base font-medium text-gray-200 mb-3">Drag & drop your PDF resume</p>
                <p className="text-xs text-gray-400 mb-4 tracking-wide">or choose a file from your device</p>
                <Button
                  type="button"
                  onClick={handleFilePick}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg"
                >
                  <Upload className="w-4 h-4 mr-2" /> Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-4">PDF only • Max ~5MB recommended</p>
              </>
            )}

            {file && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-semibold">File ready</span>
                </div>
                <div className="text-sm bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-left shadow-sm">
                  <p className="font-medium text-white break-all flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> {file.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex gap-3">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="text-gray-500">•</span>
                    <span>PDF</span>
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFilePick}
                    className="border-gray-600 hover:border-gray-500 hover:text-gray-300"
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setFile(null)}
                    className="bg-red-700 text-red-200 hover:bg-red-600 font-medium border border-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="!border-gray-600 !hover:border-gray-500 !hover:text-gray-300"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file || !targetRole || isProcessing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg min-w-[170px] flex justify-center"
            >
              {isProcessing ? (
                <>
                  <Brain className="w-4 h-4 mr-2 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" /> Analyze with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeUpload
