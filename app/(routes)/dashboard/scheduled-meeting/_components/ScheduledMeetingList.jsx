import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarCheck, Clock, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ScheduledMeetingList({ meetingList }) {
  if (!meetingList || meetingList.length === 0)
    return <p className="text-gray-500">No meetings found.</p>;

  return (
    <Accordion type="single" collapsible>
      {meetingList.map((meeting, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{meeting?.formatedDate}</AccordionTrigger>
          <AccordionContent>
            <div className="mt-5 flex flex-col gap-4">
              <h2 className="flex gap-2 items-center">
                <Clock /> {meeting?.duration} Min
              </h2>
              <h2 className="flex gap-2 items-center">
                <CalendarCheck /> {meeting.formatedDate}
              </h2>
              <h2 className="flex gap-2 items-center">
                <Timer /> {meeting.selectedTime}
              </h2>

              <Link
                href={meeting?.locationUrl ? meeting.locationUrl : "#"}
                className="text-primary truncate"
              >
                {meeting?.locationUrl}
              </Link>

              {meeting?.locationUrl && (
                <Link href={meeting.locationUrl}>
                  <Button className="mt-3">Join Now</Button>
                </Link>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default ScheduledMeetingList;
