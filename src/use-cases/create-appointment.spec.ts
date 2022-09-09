import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { InMemoryAppointmentsRepository } from "../repositories/in-memory/in-memory-appointments-repository";
import { getFutureDate } from "../test/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";

describe("Create Appointment", () => {
  it("should be able to create an Appointment", async () => {
    const appointmentRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentRepository);

    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-11");

    const appointment = await sut.execute({
      customer: "john Due",
      startsAt,
      endsAt,
    });

    expect(appointment).toBeInstanceOf(Appointment);
  });

  it("should not be able to create an Appointment with overlapping dates", async () => {
    const appointmentRepository = new InMemoryAppointmentsRepository();
    const sut = new CreateAppointment(appointmentRepository);

    const startsAt = getFutureDate("2022-08-10");
    const endsAt = getFutureDate("2022-08-15");

    endsAt.setDate(endsAt.getDate() - 1);

    await sut.execute({
      customer: "john Due",
      startsAt,
      endsAt,
    });

    expect(
      sut.execute({
        customer: "john Due",
        startsAt: getFutureDate("2022-08-14"),
        endsAt: getFutureDate("2022-08-18"),
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
