"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { BookingFlowState } from "../types/booking";

export interface BookingService {
  id: string;
  name: string;
  description: string;
  defaultPrice: number;
  durationMinutes: number;
}

interface BookingContextValue {
  token: string;
  services: BookingService[];
  flow: BookingFlowState;
  setSelectedService: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  goToStep: (step: BookingFlowState["step"]) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking() {
  return useContext(BookingContext);
}

const INITIAL: BookingFlowState = { step: "service", selectedServiceId: null, selectedDate: null, selectedTime: null };

interface Props { token: string; services: BookingService[]; children: ReactNode }

export function BookingProvider({ token, services, children }: Props) {
  const [flow, setFlow] = useState<BookingFlowState>(INITIAL);

  const setSelectedService = (id: string) => setFlow(prev => ({ ...prev, selectedServiceId: id, step: "schedule" }));
  const setSelectedDate = (date: string) => setFlow(prev => ({ ...prev, selectedDate: date }));
  const setSelectedTime = (time: string) => setFlow(prev => ({ ...prev, selectedTime: time, step: "form" }));
  const goToStep = (step: BookingFlowState["step"]) => setFlow(prev => ({ ...prev, step }));
  const reset = () => setFlow(INITIAL);

  return (
    <BookingContext.Provider value={{ token, services, flow, setSelectedService, setSelectedDate, setSelectedTime, goToStep, reset }}>
      {children}
    </BookingContext.Provider>
  );
}
