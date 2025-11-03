import Email from "@/emails";
import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userName,
      userEmail,
      businessName,
      date,
      duration,
      meetingTime,
      meetingUrl,
    } = body;

    const plunk = new Plunk(process.env.PLUNK_API_KEY);

    const emailHtml = await render(
      <Email
        businessName={businessName}
        date={date}
        duration={duration}
        meetingTime={meetingTime}
        meetingUrl={meetingUrl}
        userFirstName={userName}
      />
    );

    const resp = await plunk.emails.send({
      to: userEmail,
      subject: "Meeting Scheduled Details",
      body: emailHtml,
    });

    console.log("Plunk response:", resp);
    return NextResponse.json(
      { message: "Email sent successfully", resp },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
