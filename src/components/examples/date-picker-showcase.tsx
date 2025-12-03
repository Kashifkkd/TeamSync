"use client"

import { useState } from "react"
import { DatePicker } from "@/components/ui/date-picker"

export function DatePickerShowcase() {
  const [basicDate, setBasicDate] = useState<Date>()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [smallDate, setSmallDate] = useState<Date>()
  const [largeDate, setLargeDate] = useState<Date>()
  const [timeDate, setTimeDate] = useState<Date>()

  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">DatePicker Component Showcase</h2>
        <p className="text-muted-foreground mb-6">
          Various configurations of the enhanced DatePicker component
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Usage */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Basic Usage</h3>
          <DatePicker
            value={basicDate}
            onChange={setBasicDate}
            placeholder="Select a date"
          />
        </div>

        {/* With Label and Validation */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">With Label & Required</h3>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            placeholder="Select start date"
            required
          />
        </div>

        {/* Date Range with Constraints */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Date Range with Constraints</h3>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            placeholder="Select end date"
            minDate={startDate}
            clearable
          />
        </div>

        {/* Small Size */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Small Size</h3>
          <DatePicker
            value={smallDate}
            onChange={setSmallDate}
            placeholder="Pick date"
            size="sm"
            variant="ghost"
          />
        </div>

        {/* Large Size */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Large Size</h3>
          <DatePicker
            label="Large Date Picker"
            value={largeDate}
            onChange={setLargeDate}
            placeholder="Select a date"
            size="lg"
            variant="outline"
          />
        </div>

        {/* With Time */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">With Time (24h format)</h3>
          <DatePicker
            label="Date & Time"
            value={timeDate}
            onChange={setTimeDate}
            placeholder="Select date and time"
            showTime
            timeFormat="24h"
            format="PPP HH:mm"
          />
        </div>

        {/* Error State */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Error State</h3>
          <DatePicker
            label="Date with Error"
            value={undefined}
            onChange={() => {}}
            placeholder="This has an error"
            error={true}
          />
        </div>

        {/* Disabled State */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Disabled State</h3>
          <DatePicker
            label="Disabled Date"
            value={undefined}
            onChange={() => {}}
            placeholder="This is disabled"
            disabled
          />
        </div>
      </div>

      {/* Current Values Display */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Basic Date:</strong> {basicDate ? basicDate.toLocaleDateString() : "None"}
          </div>
          <div>
            <strong>Start Date:</strong> {startDate ? startDate.toLocaleDateString() : "None"}
          </div>
          <div>
            <strong>End Date:</strong> {endDate ? endDate.toLocaleDateString() : "None"}
          </div>
          <div>
            <strong>Small Date:</strong> {smallDate ? smallDate.toLocaleDateString() : "None"}
          </div>
          <div>
            <strong>Large Date:</strong> {largeDate ? largeDate.toLocaleDateString() : "None"}
          </div>
          <div>
            <strong>Time Date:</strong> {timeDate ? timeDate.toLocaleString() : "None"}
          </div>
        </div>
      </div>
    </div>
  )
}
