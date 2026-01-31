"use client"

import React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { statesMock } from "@/mock/statesMock"

interface MembershipModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MembershipModal({ isOpen, onClose }: MembershipModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    state: "",
    city: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedState = statesMock.find((s) => s.id === formData.state)
  const cities = selectedState?.cities || []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { city: "" }), // Reset city when state changes
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "नाम आवश्यक है"
    if (!formData.surname.trim()) newErrors.surname = "उपनाम आवश्यक है"
    if (!formData.phone.trim()) {
      newErrors.phone = "फोन नंबर आवश्यक है"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "10 अंकों का वैध फोन नंबर दर्ज करें"
    }
    if (!formData.state) newErrors.state = "राज्य आवश्यक है"
    if (!formData.city) newErrors.city = "शहर आवश्यक है"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    // Mock payment flow
    console.log("[v0] Membership form submitted:", formData)
    alert("भुगतान प्रणाली के लिए आप भेजे गए हैं। यह एक डेमो है।")
    onClose()
    setFormData({ name: "", surname: "", phone: "", state: "", city: "" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-xl font-bold text-primary">सदस्य बनें</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/10 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              नाम *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.name ? "border-red-500" : "border-border"
              }`}
              placeholder="अपना नाम दर्ज करें"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Surname */}
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-foreground mb-1">
              उपनाम *
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.surname ? "border-red-500" : "border-border"
              }`}
              placeholder="अपना उपनाम दर्ज करें"
            />
            {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              फोन नंबर *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.phone ? "border-red-500" : "border-border"
              }`}
              placeholder="10 अंकों का नंबर दर्ज करें"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-foreground mb-1">
              राज्य *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                errors.state ? "border-red-500" : "border-border"
              }`}
            >
              <option value="">राज्य चुनें</option>
              {statesMock.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.nameHi}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
              शहर *
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!formData.state}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.city ? "border-red-500" : "border-border"
              }`}
            >
              <option value="">शहर चुनें</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.nameHi}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>

          {/* Price Display */}
          <div className="bg-accent/10 border border-accent rounded-md p-3 flex justify-between items-center">
            <span className="font-medium text-foreground">सदस्यता शुल्क:</span>
            <span className="text-lg font-bold text-primary">₹1,000</span>
          </div>

          {/* Pay Now Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            अभी भुगतान करें
          </button>
        </form>
      </div>
    </div>
  )
}
