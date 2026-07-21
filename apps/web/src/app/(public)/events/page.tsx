import { redirect } from "next/navigation";

/** Legacy events URL → catering */
export default function EventsRedirectPage() {
  redirect("/catering");
}
