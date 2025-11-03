import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid } from "date-fns";
import { CalendarCheck, Clock, LoaderIcon, MapPin, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TimeDateSelection from "./TimeDateSelection";
import UserFormInfo from "./UserFormInfo";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function MeetingTimeDateSelection({ eventInfo, businessInfo }) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [enableTimeSlot, setEnabledTimeSlot] = useState(false);
  const [selectedTime, setSelectedTime] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNote, setUserNote] = useState("");
  const [prevBooking, setPrevBooking] = useState([]);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const db = getFirestore(app);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      eventInfo?.duration &&
      businessInfo?.startTime &&
      businessInfo?.endTime
    ) {
      createTimeSlot(eventInfo.duration);
    }
  }, [eventInfo?.duration, businessInfo?.startTime, businessInfo?.endTime]);

  const timeToMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const createTimeSlot = (interval) => {
    const startTime = timeToMinutes(businessInfo.startTime);
    const endTime = timeToMinutes(businessInfo.endTime);
    const totalSlots = Math.floor((endTime - startTime) / interval);
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      let hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours; // Fix 0 to 12 for 12-hour format
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )} ${period}`;
    });
    setTimeSlots(slots);
  };

  /**
   * On Date Change Handle Method
   * @param {*} date
   */
  const handleDateChange = (selectedDate) => {
    if (!isValid(selectedDate)) return;
    setDate(selectedDate);
    const day = format(selectedDate, "EEEE");
    if (businessInfo?.daysAvailable?.[day]) {
      getPrevEventBooking(selectedDate);
      setEnabledTimeSlot(true);
    } else {
      setEnabledTimeSlot(false);
      setSelectedTime(null); // Clear time when date disabled
      setPrevBooking([]);
    }
  };

  /**
   * Handle Schedule Event on Click Schedule Button
   * @returns
   */
  const handleScheduleEvent = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(userEmail)) {
      toast("Enter valid email address");
      return;
    }
    if (!userName.trim()) {
      toast("Please enter your name");
      return;
    }
    setLoading(true);
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "ScheduledMeetings", docId), {
        businessName: businessInfo.businessName,
        businessEmail: businessInfo.email,
        selectedTime,
        selectedDate: date.toISOString().slice(0, 10),
        formatedDate: format(date, "PPP"),
        duration: eventInfo.duration,
        locationUrl: eventInfo.locationUrl,
        eventId: eventInfo.id,
        id: docId,
        userName,
        userEmail,
        userNote,
      });
      toast.success("Meeting Scheduled successfully!");

      // Send confirmation email then redirect
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName,
          userEmail,
          businessName: businessInfo?.businessName,
          date: format(date, "PPP"),
          duration: eventInfo?.duration,
          meetingTime: selectedTime,
          meetingUrl: eventInfo.locationUrl,
        }),
      });

      router.replace("/confirmation");
    } catch (error) {
      console.error("Failed to schedule meeting or send email", error);
      router.replace("/confirmation"); // still redirect on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Used to Send an email to User
   * @param {*} user
   */
  // const sendEmail = (user) => {
  //   const emailHtml = render(
  //     <Email
  //       businessName={businessInfo?.businessName}
  //       date={format(date, "PPP").toString()}
  //       duration={eventInfo?.duration}
  //       meetingTime={selectedTime}
  //       meetingUrl={eventInfo.locationUrl}
  //       userFirstName={user}
  //     />
  //   );

  //   plunk.emails
  //     .send({
  //       to: userEmail,
  //       subject: "Meeting Schedul Details",
  //       body: emailHtml,
  //     })
  //     .then((resp) => {
  //       console.log(resp);
  //       setLoading(false);
  //       router.replace("/confirmation");
  //     });
  // };

  /**
   * Used to Fetch Previous Booking for given event
   * @param {*} date_
   */
  const getPrevEventBooking = async (selectedDate) => {
    try {
      const dateString = selectedDate.toISOString().slice(0, 10);
      const q = query(
        collection(db, "ScheduledMeetings"),
        where("selectedDate", "==", dateString),
        where("eventId", "==", eventInfo.id)
      );
      const querySnapshot = await getDocs(q);
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push(doc.data());
      });
      setPrevBooking(bookings);
    } catch (error) {
      console.error("Failed to fetch previous bookings", error);
      setPrevBooking([]);
    }
  };
  return (
    <div
      className="p-5 py-10 shadow-lg m-5 border-t-8 mx-10 md:mx-26 lg:mx-56 my-10"
      style={{ borderTopColor: eventInfo?.themeColor }}
    >
      <Image src="/logo.svg" alt="logo" width={150} height={150} />
      <div className="grid grid-cols-1 md:grid-cols-3 mt-5">
        {/* Meeting Info */}
        <div className="p-4 border-r">
          <h2>{businessInfo?.businessName}</h2>
          <h2 className="font-bold text-3xl">
            {eventInfo?.eventName || "Meeting Name"}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock /> {eventInfo?.duration} Min{" "}
            </h2>
            <h2 className="flex gap-2">
              <MapPin /> {eventInfo?.locationType} Meeting{" "}
            </h2>
            <h2 className="flex gap-2">
              <CalendarCheck />{" "}
              {isValid(date) ? format(date, "PPP") : "Invalid Date"}
            </h2>
            {selectedTime && (
              <h2 className="flex gap-2">
                <Timer /> {selectedTime}{" "}
              </h2>
            )}
            <Link href={eventInfo?.locationUrl || "#"} className="text-primary">
              {eventInfo?.locationUrl}
            </Link>
          </div>
        </div>

        {/* Time & Date Selection */}
        {step === 1 ? (
          <TimeDateSelection
            date={date}
            handleDateChange={handleDateChange}
            timeSlots={timeSlots}
            setSelectedTime={setSelectedTime}
            enableTimeSlot={enableTimeSlot}
            selectedTime={selectedTime}
            prevBooking={prevBooking}
          />
        ) : (
          <UserFormInfo
            setUserName={setUserName}
            setUserEmail={setUserEmail}
            setUserNote={setUserNote}
          />
        )}
      </div>

      <div className="flex gap-3 justify-end">
        {step === 2 && (
          <Button variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        {step === 1 ? (
          <Button
            className="mt-10 float-right"
            disabled={!selectedTime || !enableTimeSlot}
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        ) : (
          <Button
            disabled={!userEmail.trim() || !userName.trim() || loading}
            onClick={handleScheduleEvent}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Schedule"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
