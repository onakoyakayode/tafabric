import { Resend } from "resend";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: ReactElement;
}) {
  const { data, error } = await resend.emails.send({
    from: "TA Fabrics <onboarding@resend.dev>",
    to,
    subject,
    react,
  });
  if (error) {
    console.error("[Resend error]", error);
    throw new Error(error.message);
  }
  return data;
}
