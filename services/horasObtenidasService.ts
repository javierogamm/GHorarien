import { ID, Models } from "appwrite";
import type { EventCategory } from "../constants/eventCategories";
import { appwriteConfig, databases, ensureAppwriteConfig } from "./appwriteClient";

export type HorasObtenidasRecord = Models.Document & {
  user: string;
  numeroHoras: number;
  causa: string;
  fechaObtencion: string;
};

const HOURS_PER_EVENT = 3;
const isHoursGeneratingEvent = (eventType: EventCategory) => eventType !== "Comida";

type CreateHorasObtenidasInput = {
  attendees: string[];
  eventType: EventCategory;
  causa: string;
  fechaObtencion: string;
};

const ensureHorasObtenidasConfig = () => {
  ensureAppwriteConfig();
  if (!appwriteConfig.horasObtenidasCollectionId) {
    throw new Error("Falta NEXT_PUBLIC_APPWRITE_HORASOBTENIDAS_COLLECTION_ID");
  }
};

export const createHorasObtenidasForAttendees = async ({
  attendees,
  eventType,
  causa,
  fechaObtencion
}: CreateHorasObtenidasInput): Promise<HorasObtenidasRecord[]> => {
  if (!isHoursGeneratingEvent(eventType)) {
    return [];
  }
  ensureHorasObtenidasConfig();
  const payloads = attendees.map((attendee) =>
    databases.createDocument<HorasObtenidasRecord>(
      appwriteConfig.databaseId,
      appwriteConfig.horasObtenidasCollectionId,
      ID.unique(),
      {
        user: attendee,
        numeroHoras: HOURS_PER_EVENT,
        causa,
        fechaObtencion
      }
    )
  );

  return Promise.all(payloads);
};
