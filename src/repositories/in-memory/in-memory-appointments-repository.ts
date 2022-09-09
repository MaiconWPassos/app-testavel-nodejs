import { areIntervalsOverlapping } from "date-fns";
import { Appointment } from "../../entities/appointment";
import { AppointmentRepository } from "../appointments-repository";

export class InMemoryAppointmentsRepository implements AppointmentRepository {
  public items: Appointment[] = [];

  async create(appointment: Appointment): Promise<void> {
    this.items.push(appointment);
  }

  async findOverlappingAppointments(
    startsAt: Date,
    endsAt: Date
  ): Promise<Appointment | null> {
    const ovorlappingAppointment = this.items.find((appointment) =>
      areIntervalsOverlapping(
        {
          start: startsAt,
          end: endsAt,
        },
        {
          start: appointment.startsAt,
          end: appointment.endsAt,
        },
        {
          inclusive: true,
        }
      )
    );

    if (!ovorlappingAppointment) {
      return null;
    }

    return ovorlappingAppointment;
  }
}
