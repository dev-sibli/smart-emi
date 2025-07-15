"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { initialApplications } from "@/lib/mock-data"
import { generateRandomId, validateEmail, validatePhoneNumber, calculateEMI, formatCurrency } from "@/lib/utils"
import { TENURE_OPTIONS, MIN_AMOUNT, MAX_AMOUNT, PROCESSING_FEE } from "@/lib/constants"
import type { Application } from "@/lib/types"

export function SmartEmiForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [applications, setApplications] = useLocalStorage("applications", initialApplications)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    cardNumber: "",
    clientId: "",
    amount: "",
    tenure: "",
    approvalCode: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Bangladeshi phone number"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    }

    if (!formData.clientId.trim()) {
      newErrors.clientId = "Client ID is required"
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required"
    } else {
      const amount = Number.parseFloat(formData.amount)
      if (isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
        newErrors.amount = `Amount must be between ${formatCurrency(MIN_AMOUNT)} and ${formatCurrency(MAX_AMOUNT)}`
      }
    }

    if (!formData.tenure) {
      newErrors.tenure = "Tenure is required"
    }

    if (!formData.approvalCode.trim()) {
      newErrors.approvalCode = "Approval code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newApplication: Application = {
        id: generateRandomId("APP"),
        customerName: formData.customerName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        cardNumber: formData.cardNumber,
        clientId: formData.clientId,
        amount: Number.parseFloat(formData.amount),
        tenure: Number.parseInt(formData.tenure),
        date: new Date().toISOString().split("T")[0],
        status: "pending",
        store: "Tech World", // In a real app, this would come from the current user's store
        merchant: "Current Merchant", // In a real app, this would come from auth context
        approvalCode: formData.approvalCode,
        notes: formData.notes,
        timeline: [
          {
            id: generateRandomId("TL"),
            timestamp: new Date().toISOString(),
            action: "Application Submitted",
            user: formData.customerName,
            details: "EMI application submitted for review",
          },
        ],
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setApplications([newApplication, ...applications])

      toast({
        title: "Application Submitted",
        description: `EMI application ${newApplication.id} has been submitted successfully with approval code ${formData.approvalCode}.`,
      })

      // Reset form
      setFormData({
        customerName: "",
        phoneNumber: "",
        email: "",
        cardNumber: "",
        clientId: "",
        amount: "",
        tenure: "",
        approvalCode: "",
        notes: "",
      })

      // Redirect to applications list
      router.push("/merchant/applications")
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const calculateMonthlyEMI = () => {
    const amount = Number.parseFloat(formData.amount)
    const tenure = Number.parseInt(formData.tenure)
    if (!isNaN(amount) && !isNaN(tenure) && amount > 0 && tenure > 0) {
      return calculateEMI(amount, tenure)
    }
    return 0
  }

  const monthlyEMI = calculateMonthlyEMI()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New EMI Application</CardTitle>
          <CardDescription>Fill out the form below to submit a new EMI application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                />
                {errors.customerName && <p className="text-sm text-red-600">{errors.customerName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  placeholder="01XXXXXXXXX"
                />
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                />
                {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID *</Label>
                <Input
                  id="clientId"
                  value={formData.clientId}
                  onChange={(e) => handleInputChange("clientId", e.target.value)}
                  placeholder="Enter client ID"
                />
                {errors.clientId && <p className="text-sm text-red-600">{errors.clientId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BDT) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                />
                {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenure">Tenure *</Label>
                <Select value={formData.tenure} onValueChange={(value) => handleInputChange("tenure", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenure" />
                  </SelectTrigger>
                  <SelectContent>
                    {TENURE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tenure && <p className="text-sm text-red-600">{errors.tenure}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalCode">Approval Code *</Label>
                <Input
                  id="approvalCode"
                  value={formData.approvalCode}
                  onChange={(e) => handleInputChange("approvalCode", e.target.value)}
                  placeholder="Enter approval code"
                />
                {errors.approvalCode && <p className="text-sm text-red-600">{errors.approvalCode}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes or comments"
                rows={3}
              />
            </div>

            {monthlyEMI > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Monthly EMI</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyEMI)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Processing Fee</p>
                      <p className="text-lg font-semibold">{formatCurrency(PROCESSING_FEE)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(monthlyEMI * Number.parseInt(formData.tenure || "0") + PROCESSING_FEE)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
