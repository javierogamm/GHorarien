import { ID, Models, Query } from "appwrite";
import { appwriteConfig, databases, ensureAppwriteConfig } from "./appwriteClient";

export type HorasDeclaradasRecord = Models.Document & {
  horasDeclaradas?: number | string | null;
  user: string;
  motivo?: string;
  fechaHorasDeclaradas?: string;
};

type CreateHorasDeclaradasInput = {
  user: string;
  horasDeclaradas: number;
  motivo: string;
  fechaHorasDeclaradas: string;
};

const ensureHorasDeclaradasConfig = () => {
  ensureAppwriteConfig();
  if (!appwriteConfig.horasDeclaradasCollectionId) {
    throw new Error("Falta NEXT_PUBLIC_APPWRITE_HORASDECLARADAS_COLLECTION_ID");
  }
};

const MINUTES_PER_HOUR = 60;
const LEGACY_HOURS_THRESHOLD = 24;

const parseHorasDeclaradasValue = (value: number | string | null | undefined) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const toHorasDeclaradasHours = (value: number | string | null | undefined) => {
  const parsed = parseHorasDeclaradasValue(value);
  if (!Number.isFinite(parsed)) return 0;
  if (Number.isInteger(parsed) && parsed > LEGACY_HOURS_THRESHOLD) {
    return parsed / MINUTES_PER_HOUR;
  }
  return parsed;
};

const toHorasDeclaradasMinutes = (hours: number) => {
  if (!Number.isFinite(hours)) return 0;
  return Math.round(hours * MINUTES_PER_HOUR);
};

export const fetchHorasDeclaradasForUser = async (
  username: string
): Promise<HorasDeclaradasRecord[]> => {
  ensureHorasDeclaradasConfig();
  const limit = 100;
  let offset = 0;
  let allDocuments: HorasDeclaradasRecord[] = [];
  let fetched = 0;

  do {
    const response = await databases.listDocuments<HorasDeclaradasRecord>(
      appwriteConfig.databaseId,
      appwriteConfig.horasDeclaradasCollectionId,
      [
        Query.equal("user", username),
        Query.limit(limit),
        Query.offset(offset)
      ]
    );
    fetched = response.documents.length;
    allDocuments = allDocuments.concat(response.documents);
    offset += fetched;
  } while (fetched === limit);

  return allDocuments;
};

export const sumHorasDeclaradasForUser = async (username: string): Promise<number> => {
  const documents = await fetchHorasDeclaradasForUser(username);
  return documents.reduce(
    (total, document) => total + toHorasDeclaradasHours(document.horasDeclaradas),
    0
  );
};

export const createHorasDeclaradas = async ({
  user,
  horasDeclaradas,
  motivo,
  fechaHorasDeclaradas
}: CreateHorasDeclaradasInput): Promise<HorasDeclaradasRecord> => {
  ensureHorasDeclaradasConfig();
  const horasDeclaradasMinutes = toHorasDeclaradasMinutes(horasDeclaradas);
  return databases.createDocument<HorasDeclaradasRecord>(
    appwriteConfig.databaseId,
    appwriteConfig.horasDeclaradasCollectionId,
    ID.unique(),
    {
      user,
      horasDeclaradas: horasDeclaradasMinutes,
      motivo,
      fechaHorasDeclaradas
    }
  );
};
