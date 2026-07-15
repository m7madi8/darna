import { redirect } from "next/navigation";

/** Legacy /book URLs → /reservation */
export default function LegacyBookRedirect() {
  redirect("/reservation");
}
