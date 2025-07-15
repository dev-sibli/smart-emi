"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Calculator } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EMICalculatorContent() {
  const [amount, setAmount] = useState<number | null>(10000)
  const [interestRate, setInterestRate] = useState<number | null>(12)
  const [loanTerm, setLoanTerm] = useState<number | null>(24)
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0)
  const [totalPayment, setTotalPayment] = useState<number>(0)
  const [totalInterest, setTotalInterest] = useState<number>(0)
  const [principalPercentage, setPrincipalPercentage] = useState<number>(0)
  const [interestPercentage, setInterestPercentage] = useState<number>(0)
  const [hasEmptyFields, setHasEmptyFields] = useState<boolean>(false)

  // Check for empty fields
  useEffect(() => {
    setHasEmptyFields(amount === null || interestRate === null || loanTerm === null)
  }, [amount, interestRate, loanTerm])

  // Calculate EMI
  const calculateEMI = () => {
    if (amount === null || interestRate === null || loanTerm === null) {
      setHasEmptyFields(true)
      return
    }

    setHasEmptyFields(false)

    let emi: number
    let totalAmount: number
    let interestAmount: number

    if (interestRate === 0) {
      // Special case for 0% interest: EMI is simply principal / loan term
      emi = amount / loanTerm
      totalAmount = amount
      interestAmount = 0
    } else {
      // Monthly interest rate
      const monthlyInterestRate = interestRate / 100 / 12

      // Calculate EMI using formula: P * r * (1+r)^n / ((1+r)^n - 1)
      emi =
        (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
        (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)

      totalAmount = emi * loanTerm
      interestAmount = totalAmount - amount
    }

    // Set calculated values
    setMonthlyPayment(emi)
    setTotalPayment(totalAmount)
    setTotalInterest(interestAmount)

    // Calculate percentages for the progress bars
    // Ensure totalAmount is not zero to prevent division by zero
    setPrincipalPercentage(totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0)
    setInterestPercentage(totalAmount > 0 ? Math.round((interestAmount / totalAmount) * 100) : 0)
  }

  // Calculate on initial load and when inputs change
  useEffect(() => {
    if (amount !== null && interestRate !== null && loanTerm !== null) {
      calculateEMI()
    }
  }, [amount, interestRate, loanTerm])

  // Format currency
  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-BD", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8" />
        <h1 className="text-3xl font-bold">EMI Calculator</h1>
      </div>

      <p className="text-muted-foreground mb-8">
        Calculate your monthly EMI for credit card purchases or balance transfers.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Purchase Amount */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Purchase Amount</label>
                  <span className="text-sm text-muted-foreground">
                    BDT {amount !== null ? formatCurrency(amount) : "0.00"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">৳</span>
                  <Input
                    type="number"
                    value={amount !== null ? amount : ""}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1"
                    placeholder="Enter purchase amount"
                    min={10000}
                    max={1000000}
                  />
                </div>
                <Slider
                  value={amount !== null ? [amount] : [0]}
                  min={10000}
                  max={1000000}
                  step={1000}
                  onValueChange={(value) => setAmount(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>BDT 10,000</span>
                  <span>BDT 1,000,000</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Interest Rate (% per annum)</label>
                  <span className="text-sm text-muted-foreground">{interestRate !== null ? interestRate : 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">%</span>
                  <Input
                    type="number"
                    value={interestRate !== null ? interestRate : ""}
                    onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1"
                    placeholder="Enter interest rate"
                    min={0}
                    max={36}
                    step={0.5}
                  />
                </div>
                <Slider
                  value={interestRate !== null ? [interestRate] : [0]}
                  min={0}
                  max={36}
                  step={0.5}
                  onValueChange={(value) => setInterestRate(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>36%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Loan Term (months)</label>
                  <span className="text-sm text-muted-foreground">{loanTerm !== null ? loanTerm : 0} months</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={loanTerm !== null ? loanTerm : ""}
                    onChange={(e) => setLoanTerm(e.target.value ? Number(e.target.value) : null)}
                    className="flex-1"
                    placeholder="Enter loan term"
                    min={3}
                    max={36}
                  />
                </div>
                <Slider
                  value={loanTerm !== null ? [loanTerm] : [0]}
                  min={3}
                  max={36}
                  step={1}
                  onValueChange={(value) => setLoanTerm(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>3 months</span>
                  <span>36 months</span>
                </div>
              </div>

              <Button onClick={calculateEMI} className="w-full">
                Calculate EMI
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {hasEmptyFields && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>* All fields need to be filled to calculate EMI accurately.</AlertDescription>
              </Alert>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment (EMI)</p>
              <p className="text-4xl font-bold mt-1">BDT {hasEmptyFields ? "0.00" : formatCurrency(monthlyPayment)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payment</p>
                <p className="text-xl font-semibold mt-1">
                  BDT {hasEmptyFields ? "0.00" : formatCurrency(totalPayment)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-xl font-semibold mt-1">
                  BDT {hasEmptyFields ? "0.00" : formatCurrency(totalInterest)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Payment Breakdown</h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Principal</span>
                  <span>{hasEmptyFields ? "0" : principalPercentage}%</span>
                </div>
                <Progress
                  value={hasEmptyFields ? 0 : principalPercentage}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Interest</span>
                  <span>{hasEmptyFields ? "0" : interestPercentage}%</span>
                </div>
                <Progress
                  value={hasEmptyFields ? 0 : interestPercentage}
                  className="h-2 bg-gray-200"
                  indicatorClassName="bg-green-500"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Principal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">Interest</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This is only an estimate. Actual EMI may vary based on processing date, additional fees, and other
              factors.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
