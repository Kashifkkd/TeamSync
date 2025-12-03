"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerFieldProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
}

export function DateTimePickerField({ 
  value, 
  onChange, 
  placeholder = "MM/DD/YY hh:mm aa",
  className,
  disabled,
  minDate
}: DateTimePickerFieldProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // If no time is set, default to 9:00 AM
      if (!value || (value.getHours() === 0 && value.getMinutes() === 0)) {
        selectedDate.setHours(9, 0, 0, 0);
      } else {
        // Preserve existing time
        selectedDate.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      }
      onChange?.(selectedDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    timeValue: string
  ) => {
    const currentDate = value || new Date();
    const newDate = new Date(currentDate);
    
    if (type === "hour") {
      const hour = parseInt(timeValue);
      const isPM = newDate.getHours() >= 12;
      newDate.setHours(isPM ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours() % 12;
      newDate.setHours(timeValue === "PM" ? currentHours + 12 : currentHours);
    }
    
    onChange?.(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "min-w-fit justify-start text-left font-normal min-w-0",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <span className="truncate min-w-0">
            {value ? (
              format(value, "MM/dd/yy hh:mm aa")
            ) : (
              placeholder
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999]">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            disabled={(date) => minDate ? date < minDate : false}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      value && value.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      value && value.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      value &&
                      ((ampm === "AM" && value.getHours() < 12) ||
                        (ampm === "PM" && value.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
