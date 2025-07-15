"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { FileDown, Loader2 } from "lucide-react"
import { jsPDF } from "jspdf"

interface ApplicationPdfGeneratorProps {
  application: any
}

export function ApplicationPdfGenerator({ application }: ApplicationPdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set font size and styles
      pdf.setFontSize(20)
      pdf.setFont("helvetica", "bold")
      pdf.text("Smart EMI Application", 105, 20, { align: "center" })

      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Application #${application.id}`, 105, 30, { align: "center" })

      pdf.setFontSize(10)
      pdf.text(`Submitted on: ${application.submittedAt}`, 20, 40)
      pdf.text(`By: ${application.submittedBy}`, 20, 45)

      // Status
      pdf.setFontSize(10)
      pdf.text(`Status: ${application.status.toUpperCase()}`, 190, 40, { align: "right" })

      // Add a line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(20, 50, 190, 50)

      // Customer & Transaction Details Section
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Customer & Transaction Details", 20, 60)

      // Customer Information
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Customer Information", 20, 70)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text("Name:", 20, 80)
      pdf.text(application.customerName, 60, 80)

      pdf.text("Client ID:", 20, 85)
      pdf.text(application.clientId, 60, 85)

      pdf.text("Phone:", 20, 90)
      pdf.text(application.phoneNumber, 60, 90)

      pdf.text("Email:", 20, 95)
      pdf.text(application.email, 60, 95)

      pdf.text("Card Number:", 20, 100)
      pdf.text(application.cardNumber, 60, 100)

      // Transaction Details
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "bold")
      pdf.text("Transaction Details", 110, 70)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text("Amount:", 110, 80)
      pdf.text(`BDT ${application.transactionAmount?.toLocaleString()}`, 150, 80)

      pdf.text("EMI Tenure:", 110, 85)
      pdf.text(`${application.emiTenure} months`, 150, 85)

      pdf.text("Approval Code:", 110, 90)
      pdf.text(application.approvalCode, 150, 90)

      pdf.text("Transaction Date:", 110, 95)
      pdf.text(application.transactionDate, 150, 95)

      pdf.text("Store:", 110, 100)
      pdf.text(application.storeName, 150, 100)

      // Application Status Section
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text("Application Status", 20, 115)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text("Current Status:", 20, 125)
      pdf.text(application.status.toUpperCase(), 60, 125)

      if (application.status === "approved") {
        pdf.text("This application has been approved.", 20, 130)
      } else if (application.status === "rejected") {
        pdf.text("This application has been rejected.", 20, 130)
      } else if (application.status === "pending") {
        pdf.text("This application is pending review.", 20, 130)
      }

      // Footer
      pdf.setFontSize(8)
      pdf.text("Smart EMI Application System", 105, 280, { align: "center" })
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 105, 285, { align: "center" })

      // Save the PDF
      pdf.save(`application-${application.id}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Application details have been exported as PDF.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant="outline" onClick={generatePDF} disabled={isGenerating} className="flex items-center gap-2">
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Save as PDF
        </>
      )}
    </Button>
  )
}
