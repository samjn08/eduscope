'use client'
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { Application, ApplicationStatus } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

interface Props {
  application: Application | null
  onSave: (data: Application) => void
  onClose: () => void
  userId: string
}

export default function ApplicationForm({ application, onSave, onClose, userId }: Props) {
  const [formData, setFormData] = useState<Application>(
    application || {
      id: uuidv4(),
      userId,
      companyName: '',
      role: '',
      applicationDate: null,
      status: 'applied',
      applicationType: 'internship',
      recruiterName: '',
      recruiterEmail: '',
      jobDescription: '',
      salaryRange: '',
      interviewDate: null,
      followUpDate: null,
      notes: '',
      priority: 'medium',
      applicationUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  )

  const overlayRef = useRef<HTMLDivElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'applied', label: 'Applied' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'interview_scheduled', label: 'Interview Scheduled' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'offer_received', label: 'Offer Received' },
    { value: 'accepted', label: 'Accepted' },
  ]

  const formatDate = (d: Date | null) => (d ? new Date(d).toISOString().split('T')[0] : '')
  const formatDateTimeLocal = (d: Date | null) => {
    if (!d) return ''
    const date = new Date(d)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => { firstFieldRef.current?.focus() }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const getItems = () => Array.from(dialog.querySelectorAll<HTMLElement>(selector)).filter(el => !el.hasAttribute('disabled'))
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = getItems()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    window.addEventListener('keydown', handleTab)
    return () => window.removeEventListener('keydown', handleTab)
  }, [])

  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => { if (e.target === overlayRef.current) onClose() }
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ ...formData, updatedAt: new Date() }) }
  const requiredValid = formData.companyName.trim() && formData.role.trim()

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleBackdropMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-form-title"
    >
      <div className="absolute inset-0 bg-gray-100/60 dark:bg-black/80 backdrop-blur-sm" />
      <div ref={dialogRef} className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 animate-in fade-in-0 zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-start z-10">
          <div>
            <h2 id="application-form-title" className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {application ? 'Edit Application' : 'New Application'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Press Esc or click outside to close</p>
          </div>
          <Button aria-label="Close dialog" variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-4 h-4 text-gray-900 dark:text-gray-100" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6">

          {/* Basics */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Basics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name *</Label>
                <Input
                  ref={firstFieldRef}
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                  placeholder="e.g. OpenAI"
                  className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  placeholder="e.g. Software Engineer Intern"
                  className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100"
                />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Classification</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {['status', 'applicationType', 'priority'].map((field) => {
                let value, options, onChange;
                if (field === 'status') { value = formData.status; options = statusOptions; onChange = (v: any) => setFormData({ ...formData, status: v }) }
                if (field === 'applicationType') { value = formData.applicationType; options = ['internship', 'full_time', 'part_time', 'contract']; onChange = (v: any) => setFormData({ ...formData, applicationType: v }) }
                if (field === 'priority') { value = formData.priority; options = ['low', 'medium', 'high']; onChange = (v: any) => setFormData({ ...formData, priority: v }) }
                return (
                  <div className="space-y-2" key={field}>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100">
                        <SelectValue placeholder={`Select ${field}`} />
                      </SelectTrigger>
                      <SelectContent className="!bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100">
          {field === 'status'
            ? (options as { value: ApplicationStatus; label: string }[]).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))
            : (options as string[]).map((o) => (
                <SelectItem key={o} value={o}>
                  {o.charAt(0).toUpperCase() + o.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
        </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Timeline */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Timeline</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Application Date</Label>
                <Input type="date" value={formatDate(formData.applicationDate)} onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value ? new Date(e.target.value) : null })} className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Follow-up Date</Label>
                <Input type="date" value={formatDate(formData.followUpDate)} onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value ? new Date(e.target.value) : null })} className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
              </div>
            </div>
            {formData.status === 'interview_scheduled' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Interview Date & Time</Label>
                <Input type="datetime-local" value={formatDateTimeLocal(formData.interviewDate)} onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value ? new Date(e.target.value) : null })} className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
              </div>
            )}
          </section>

          {/* Contacts & Links */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Contacts & Links</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recruiter Name</Label>
                <Input value={formData.recruiterName || ''} onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })} placeholder="Jane Doe" className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recruiter Email</Label>
                <Input type="email" value={formData.recruiterEmail || ''} onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })} placeholder="jane@company.com" className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Application URL</Label>
              <Input type="url" value={formData.applicationUrl || ''} onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} placeholder="https://careers.company.com/jobs/123" className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-300 uppercase">Notes</h3>
            <Textarea rows={4} value={formData.notes || ''} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Interview prep topics, follow-up reminders, compensation details..." className="!border-gray-300 dark:!border-gray-700 !focus:border-blue-500 !focus:ring-blue-500 !bg-gray-50 dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100" />
          </section>

          {/* Footer */}
          <div className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 z-10">
            <Button type="button" onClick={onClose} className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-md shadow-sm hover:shadow transition-colors">Cancel</Button>
            <Button type="submit" disabled={!requiredValid} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md shadow-sm hover:shadow flex items-center justify-center">
              <Save className="w-4 h-4 mr-2" />
              Save Application
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
