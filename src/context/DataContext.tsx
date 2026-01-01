import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { addDays, addMonths, compareAsc, isAfter, isBefore, startOfDay } from 'date-fns';
import {
  AppState,
  Appointment,
  Member,
  Responsibility,
  ResponsibilityAssignment,
  ResponsibilityFrequency,
  Service
} from '../types';

const STORAGE_KEY = 'service-tracker-state';
const UNLOCK_KEY = 'service-tracker-unlocked';
const DEFAULT_PIN = '7865';

type ServiceInput = Omit<Service, 'id' | 'createdAt'>;
type AppointmentInput = Omit<Appointment, 'id' | 'createdAt'>;
type MemberInput = Omit<Member, 'id' | 'createdAt'>;
type ResponsibilityInput = Omit<Responsibility, 'id' | 'createdAt' | 'assignments'>;

export type ResponsibilityOccurrence = {
  responsibilityId: string;
  title: string;
  date: string;
  assignedMemberId?: string;
};

type DataContextShape = {
  state: AppState;
  services: Service[];
  appointments: Appointment[];
  members: Member[];
  responsibilities: Responsibility[];
  isUnlocked: boolean;
  unlock: (pin: string) => boolean;
  lock: () => void;
  addService: (data: ServiceInput) => void;
  updateService: (id: string, data: ServiceInput) => void;
  removeService: (id: string) => void;
  addAppointment: (data: AppointmentInput) => void;
  updateAppointment: (id: string, data: AppointmentInput) => void;
  removeAppointment: (id: string) => void;
  addMember: (data: MemberInput) => void;
  updateMember: (id: string, data: MemberInput) => void;
  removeMember: (id: string) => void;
  addResponsibility: (data: ResponsibilityInput) => void;
  updateResponsibility: (id: string, data: ResponsibilityInput) => void;
  removeResponsibility: (id: string) => void;
  setAssignment: (responsibilityId: string, date: string, memberId?: string) => void;
  upcomingAppointments: Appointment[];
  recentServices: Service[];
  upcomingResponsibilities: ResponsibilityOccurrence[];
};

const DataContext = createContext<DataContextShape | null>(null);

function loadState(): AppState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { pin: DEFAULT_PIN, services: [], appointments: [], members: [], responsibilities: [] };
  }
  try {
    const parsed = JSON.parse(raw) as AppState;
    return {
      pin: parsed.pin || DEFAULT_PIN,
      services: parsed.services || [],
      appointments: parsed.appointments || [],
      members: parsed.members || [],
      responsibilities: parsed.responsibilities || []
    };
  } catch (err) {
    console.warn('Failed to parse stored state', err);
    return { pin: DEFAULT_PIN, services: [], appointments: [], members: [], responsibilities: [] };
  }
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [isUnlocked, setUnlocked] = useState<boolean>(() => localStorage.getItem(UNLOCK_KEY) === 'true');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(UNLOCK_KEY, isUnlocked ? 'true' : 'false');
  }, [isUnlocked]);

  const services = useMemo(() => [...state.services].sort((a, b) => b.createdAt - a.createdAt), [state.services]);

  const appointments = useMemo(
    () => [...state.appointments].sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))),
    [state.appointments]
  );

  const members = useMemo(() => [...state.members].sort((a, b) => a.name.localeCompare(b.name)), [state.members]);

  const responsibilities = useMemo(
    () => [...state.responsibilities].sort((a, b) => b.createdAt - a.createdAt),
    [state.responsibilities]
  );

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    const nextWindow = addMonths(now, 3);
    return appointments.filter((a) => isAfter(new Date(a.date), now) && isBefore(new Date(a.date), nextWindow));
  }, [appointments]);

  const recentServices = useMemo(() => services.slice(0, 5), [services]);

  const upcomingResponsibilities = useMemo(() => {
    const horizonDays = 150;
    const today = startOfDay(new Date());
    const occurrences: ResponsibilityOccurrence[] = [];

    const pushOccurrence = (responsibility: Responsibility, date: string) => {
      const match = responsibility.assignments.find((a) => a.date === date);
      occurrences.push({
        responsibilityId: responsibility.id,
        title: responsibility.title,
        date,
        assignedMemberId: match?.memberId
      });
    };

    const addWeekly = (resp: Responsibility) => {
      if (!resp.daysOfWeek || resp.daysOfWeek.length === 0) return;
      for (let i = 0; i <= horizonDays; i += 1) {
        const d = addDays(today, i);
        if (resp.daysOfWeek.includes(d.getDay())) {
          pushOccurrence(resp, d.toISOString());
        }
      }
    };

    const nthWeekdayOfMonth = (year: number, month: number, weekday: number, nth: number | 'last') => {
      const first = new Date(year, month, 1);
      const firstWeekdayOffset = (weekday - first.getDay() + 7) % 7;
      const firstWeekdayDate = 1 + firstWeekdayOffset;
      if (nth === 'last') {
        const nextMonthFirst = new Date(year, month + 1, 1);
        const lastDayPrevMonth = addDays(nextMonthFirst, -1);
        let date = lastDayPrevMonth.getDate();
        while (date > 0) {
          const candidate = new Date(year, month, date);
          if (candidate.getDay() === weekday) return candidate;
          date -= 1;
        }
        return null;
      }
      const date = firstWeekdayDate + (nth - 1) * 7;
      const candidate = new Date(year, month, date);
      return candidate.getMonth() === month ? candidate : null;
    };

    const addMonthly = (resp: Responsibility) => {
      if (!resp.daysOfWeek || resp.daysOfWeek.length === 0) return;
      const weekday = resp.daysOfWeek[0];
      const nth = resp.weekOfMonth ?? 1;
      const startMonth = today.getMonth();
      const startYear = today.getFullYear();
      for (let m = 0; m < 6; m += 1) {
        const monthDate = new Date(startYear, startMonth + m, 1);
        const slot = nthWeekdayOfMonth(monthDate.getFullYear(), monthDate.getMonth(), weekday, nth);
        if (slot && isAfter(slot, addDays(today, -1))) {
          pushOccurrence(resp, slot.toISOString());
        }
      }
    };

    const addCustom = (resp: Responsibility) => {
      if (!resp.customDates) return;
      resp.customDates.forEach((date) => {
        const d = new Date(date);
        if (isAfter(d, addDays(today, -1)) && isBefore(d, addDays(today, horizonDays))) {
          pushOccurrence(resp, d.toISOString());
        }
      });
    };

    responsibilities.forEach((resp) => {
      if (resp.frequency === 'weekly') addWeekly(resp);
      if (resp.frequency === 'monthly') addMonthly(resp);
      if (resp.frequency === 'custom') addCustom(resp);
    });

    return occurrences.sort((a, b) => compareAsc(new Date(a.date), new Date(b.date))).slice(0, 50);
  }, [responsibilities]);

  const unlock = (pin: string) => {
    if (pin === state.pin) {
      setUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => setUnlocked(false);

  const addService = (data: ServiceInput) => {
    const cleanSongs = (list: string[]) => list.filter((s) => s.trim().length > 0);
    const entry: Service = {
      ...data,
      sundaySchoolSongs: cleanSongs(data.sundaySchoolSongs),
      churchSongs: cleanSongs(data.churchSongs),
      id: uuid(),
      createdAt: Date.now()
    };
    setState((prev) => ({ ...prev, services: [entry, ...prev.services] }));
  };

  const updateService = (id: string, data: ServiceInput) => {
    const cleanSongs = (list: string[]) => list.filter((s) => s.trim().length > 0);
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.id === id
          ? {
              ...s,
              ...data,
              sundaySchoolSongs: cleanSongs(data.sundaySchoolSongs),
              churchSongs: cleanSongs(data.churchSongs)
            }
          : s
      )
    }));
  };

  const removeService = (id: string) => {
    setState((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));
  };

  const addAppointment = (data: AppointmentInput) => {
    const entry: Appointment = { ...data, id: uuid(), createdAt: Date.now() };
    setState((prev) => ({ ...prev, appointments: [...prev.appointments, entry] }));
  };

  const updateAppointment = (id: string, data: AppointmentInput) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, ...data } : a))
    }));
  };

  const removeAppointment = (id: string) => {
    setState((prev) => ({ ...prev, appointments: prev.appointments.filter((a) => a.id !== id) }));
  };

  const addMember = (data: MemberInput) => {
    const entry: Member = { ...data, id: uuid(), createdAt: Date.now() };
    setState((prev) => ({ ...prev, members: [...prev.members, entry] }));
  };

  const updateMember = (id: string, data: MemberInput) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, ...data } : m))
    }));
  };

  const removeMember = (id: string) => {
    setState((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== id),
      responsibilities: prev.responsibilities.map((r) => ({
        ...r,
        assignments: r.assignments.map((a) => (a.memberId === id ? { ...a, memberId: undefined } : a))
      }))
    }));
  };

  const addResponsibility = (data: ResponsibilityInput) => {
    const entry: Responsibility = {
      ...data,
      assignments: [],
      id: uuid(),
      createdAt: Date.now()
    };
    setState((prev) => ({ ...prev, responsibilities: [...prev.responsibilities, entry] }));
  };

  const updateResponsibility = (id: string, data: ResponsibilityInput) => {
    setState((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r) =>
        r.id === id
          ? {
              ...r,
              ...data
            }
          : r
      )
    }));
  };

  const removeResponsibility = (id: string) => {
    setState((prev) => ({ ...prev, responsibilities: prev.responsibilities.filter((r) => r.id !== id) }));
  };

  const setAssignment = (responsibilityId: string, date: string, memberId?: string) => {
    setState((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r) => {
        if (r.id !== responsibilityId) return r;
        const without = r.assignments.filter((a) => a.date !== date);
        const nextAssignments: ResponsibilityAssignment[] = memberId
          ? [...without, { id: uuid(), date, memberId }]
          : without;
        return { ...r, assignments: nextAssignments };
      })
    }));
  };

  const value: DataContextShape = {
    state,
    services,
    appointments,
    members,
    responsibilities,
    isUnlocked,
    unlock,
    lock,
    addService,
    updateService,
    removeService,
    addAppointment,
    updateAppointment,
    removeAppointment,
    addMember,
    updateMember,
    removeMember,
    addResponsibility,
    updateResponsibility,
    removeResponsibility,
    setAssignment,
    upcomingAppointments,
    recentServices,
    upcomingResponsibilities
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
