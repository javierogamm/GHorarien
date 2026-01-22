import { EVENT_CATEGORY_META } from "../constants/eventCategories";
import type { CalendarEvent } from "../services/eventsService";

type EventItemProps = {
  event: CalendarEvent;
};

export const EventItem = ({ event }: EventItemProps) => {
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border px-3 py-2 text-xs shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${EVENT_CATEGORY_META[event.eventType].cardClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide">
          {EVENT_CATEGORY_META[event.eventType].label}
        </span>
        <span className="text-[10px] font-medium text-slate-500">
          {event.horaInicio.slice(11, 16)} - {event.horaFin.slice(11, 16)}
        </span>
      </div>
      {event.nombre ? (
        <p className="text-[11px] font-semibold leading-snug text-slate-700">
          {event.nombre}
        </p>
      ) : null}
      {event.notas ? (
        <p className="text-[11px] leading-snug text-slate-600">
          {event.notas}
        </p>
      ) : null}
    </div>
  );
};
