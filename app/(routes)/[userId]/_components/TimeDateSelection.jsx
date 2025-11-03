"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots = [],
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking = [],
}) {
  const isSlotBooked = (time) =>
    prevBooking.some((item) => item.selectedTime === time);

  return (
    <div className="md:col-span-2 flex flex-col md:flex-row gap-6 px-4">
      {/* Calendar Section */}
      <div className="flex flex-col">
        <h2 className="font-bold text-lg">Select Date</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border mt-4"
          disabled={(d) => d < new Date().setHours(0, 0, 0, 0)}
        />
      </div>

      {/* Time Slots Section */}
      <div
        className="flex flex-col w-full overflow-y-auto gap-3 p-4 border rounded-md"
        style={{ maxHeight: "400px" }}
      >
        <h2 className="font-bold text-lg mb-2">Select Time</h2>
        {timeSlots.length > 0 ? (
          timeSlots.map((time, index) => {
            const booked = isSlotBooked(time);
            const selected = time === selectedTime;

            return (
              <Button
                key={index}
                disabled={!enableTimeSlot || booked}
                onClick={() => setSelectedTime(time)}
                variant={selected ? "default" : "outline"}
                className={`border-primary text-primary transition-all duration-150
                  ${selected ? "bg-primary text-white" : "hover:bg-primary/10"}
                  ${booked ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {time}
              </Button>
            );
          })
        ) : (
          <p className="text-gray-500 text-sm">No time slots available</p>
        )}
      </div>
    </div>
  );
}

export default TimeDateSelection;
