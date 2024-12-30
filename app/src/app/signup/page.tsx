'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [selectedTier, setSelectedTier] = useState('starter_tier');
    const { push } = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload = {
      ...formData,
      tier: selectedTier,
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Signup successful:', data)

      alert('Signup successful!')
      localStorage.setItem("userEmail", payload?.email);

      if (data.subscription) {
        alert(data.message)
      } else {
        alert(data.message)
        // Redirect to the subscription page
        push('/subscription')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      alert('Signup failed. Please try again.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label>Select Your Tier</Label>
              <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="grid grid-cols-2 gap-4">
                {['starter_tier', 'enthusiast_tier', 'collector_tier', 'elite_tier'].map((tier) => (
                  <Label
                    key={tier}
                    htmlFor={tier}
                    className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary ${
                      selectedTier === tier ? 'border-[blue]' : ''
                    }`}
                  >
                    <RadioGroupItem value={tier} id={tier} className="sr-only" />
                    <span className="text-sm font-semibold capitalize">{tier}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full bg-slate-500 text-white">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
