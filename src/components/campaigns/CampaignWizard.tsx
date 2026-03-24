"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export function CampaignWizard({ action }: { action: (data: FormData) => Promise<void> }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: "", location: "", keywords: "" })

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Campaign - Step {step} of 2</CardTitle>
      </CardHeader>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append("name", formData.name)
        data.append("location", formData.location)
        data.append("keywords", formData.keywords)
        await action(data)
        setStep(1)
        setFormData({ name: "", location: "", keywords: "" })
      }}>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Local Dentists" required />
              </div>
              <div className="space-y-2">
                <Label>City / Location</Label>
                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Austin, TX" required />
              </div>
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} placeholder="e.g. Dentist, Orthodontist" required />
              </div>
            </>
          )}
          {step === 2 && (
            <div className="space-y-2 text-sm bg-muted p-4 rounded-md">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Location:</strong> {formData.location}</p>
              <p><strong>Keywords:</strong> {formData.keywords}</p>
              <p className="text-muted-foreground mt-2">Click Create to save and begin scraping later.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === 1 ? (
            <Button type="button" onClick={() => {
              if (formData.name && formData.location && formData.keywords) setStep(2)
            }}>Next Step</Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button type="submit">Create Campaign</Button>
            </>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}
