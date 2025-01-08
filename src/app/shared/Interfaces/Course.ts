import { EventLocation } from "./EventLocation";

export interface Course {
  id: string;
  name: string;
  dates: Date[];
  instructor: string;
  eventLocationId: number;
  eventLocation: EventLocation;
}

interface Date {
  begin: string;
  end: string;
}
