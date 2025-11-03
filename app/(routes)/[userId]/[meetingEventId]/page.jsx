"use client";
import React, { useEffect, useState } from "react";
import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/config/FirebaseConfig";

function SharedMeetingEvent({ params }) {
  const db = getFirestore(app);
  const [businessInfo, setBusinesInfo] = useState();
  const [eventInfo, setEventInfo] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    params && getMeetingBusinessAndEventDetails();
  }, [params]);

  const getMeetingBusinessAndEventDetails = async () => {
    setLoading(true);

    const businessDocRef = doc(db, "Business", params.userId);
    const businessDocSnap = await getDoc(businessDocRef);
    if (businessDocSnap.exists()) {
      setBusinesInfo(businessDocSnap.data());
    } else {
      console.log("No such business!");
    }

    const eventDocRef = doc(db, "MeetingEvent", params?.meetingEventId);
    const result = await getDoc(eventDocRef);
    setEventInfo(result.data());

    setLoading(false);
  };

  return (
    <div>
      <MeetingTimeDateSelection
        eventInfo={eventInfo}
        businessInfo={businessInfo}
      />
    </div>
  );
}

export default SharedMeetingEvent;
