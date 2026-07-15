import { redirect } from "next/navigation";

/** Legacy multi-branch URLs → single public reservation page */
export default function LegacyBranchReservationRedirect() {
  redirect("/reservation");
}
