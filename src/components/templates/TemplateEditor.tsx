"use client"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Sample data for the live preview
const SAMPLE_LEAD = {
  business_name: "Joe's Barber Shop",
  first_name: "Joe",
  city: "Austin",
  phone: "+1 555-0123",
}

function resolvePreview(template: string): string {
  return template
    .replace(/\{business_name\}/gi, SAMPLE_LEAD.business_name)
    .replace(/\{first_name\}/gi, SAMPLE_LEAD.first_name)
    .replace(/\{city\}/gi, SAMPLE_LEAD.city)
    .replace(/\{phone\}/gi, SAMPLE_LEAD.phone)
    .replace(/\{\{BusinessName\}\}/gi, SAMPLE_LEAD.business_name)
    .replace(/\{\{Location\}\}/gi, SAMPLE_LEAD.city)
    .replace(/\{name\}/gi, SAMPLE_LEAD.first_name)
}

const VARIABLE_PILLS = [
  { var: "{business_name}", label: "Business Name" },
  { var: "{first_name}", label: "First Name" },
  { var: "{city}", label: "City" },
  { var: "{phone}", label: "Phone" },
]

export function TemplateEditor({ action, existing }: { action: any; existing?: any }) {
  const [subject, setSubject] = useState(existing?.subject || "")
  const [bodyPlain, setBodyPlain] = useState(existing?.bodyPlain || "")
  const [showPreview, setShowPreview] = useState(false)

  const insertVar = useCallback((variable: string) => {
    setBodyPlain((prev: string) => prev + variable)
  }, [])

  const previewSubject = resolvePreview(subject)
  const previewBody = resolvePreview(bodyPlain)

  return (
    <form action={action} className="space-y-5">
      {/* Subject */}
      <div className="space-y-2">
        <Label>Subject Line</Label>
        <Input
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Website for {business_name}?"
          required
        />
      </div>

      {/* Variable pills */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium">Insert variable:</p>
        <div className="flex flex-wrap gap-1.5">
          {VARIABLE_PILLS.map((p) => (
            <button
              key={p.var}
              type="button"
              onClick={() => insertVar(p.var)}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono hover:bg-muted transition-colors"
            >
              {p.var}
            </button>
          ))}
        </div>
      </div>

      {/* Edit / Preview tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Email Body</Label>
          <div className="flex rounded-md overflow-hidden border text-xs">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`px-3 py-1 transition-colors ${!showPreview ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`px-3 py-1 transition-colors ${showPreview ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              Preview
            </button>
          </div>
        </div>

        {showPreview ? (
          <div className="min-h-[280px] rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap font-mono">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-sans">
              Subject: {previewSubject || <em>empty</em>}
            </p>
            <hr className="mb-3 border-border" />
            {previewBody || <span className="text-muted-foreground italic">No body yet…</span>}
          </div>
        ) : (
          <Textarea
            name="bodyPlain"
            value={bodyPlain}
            onChange={(e) => setBodyPlain(e.target.value)}
            className="min-h-[280px] font-mono text-sm whitespace-pre-wrap"
            placeholder={"Hi {first_name},\n\nI noticed {business_name} in {city} doesn't have a website yet...\n\nBest,"}
            required
          />
        )}
      </div>

      <input type="hidden" name="id" value={existing?.id || ""} />
      {/* Keep body value in hidden field when in preview mode so form still submits */}
      {showPreview && <input type="hidden" name="bodyPlain" value={bodyPlain} />}
      <Button type="submit" className="w-full">Save Template</Button>
    </form>
  )
}
