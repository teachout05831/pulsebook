import { AppointmentsList } from "@/features/customer-portal/components/AppointmentsList";

export default function CustomerAppointmentsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Appointments</h1>
        <p className="text-sm text-muted-foreground">
          Upcoming jobs and consultations
        </p>
      </div>
      <AppointmentsList />
    </div>
  );
}
