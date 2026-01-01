export type Service = {
  id: string;
  date: string;
  sundaySchoolSongleader: string;
  sundaySchoolSongs: string[];
  churchSongleader: string;
  churchSongs: string[];
  messageTitle: string;
  preacher: string;
  notes?: string;
  recordingLink?: string;
  createdAt: number;
};

export type Appointment = {
  id: string;
  title: string;
  date: string;
  location?: string;
  leader?: string;
  notes?: string;
  createdAt: number;
};

export type Member = {
  id: string;
  name: string;
  birthday?: string;
  createdAt: number;
};

export type ResponsibilityFrequency = 'weekly' | 'monthly' | 'custom';

export type ResponsibilityAssignment = {
  id: string;
  date: string;
  memberId?: string;
};

export type Responsibility = {
  id: string;
  title: string;
  frequency: ResponsibilityFrequency;
  daysOfWeek?: number[]; // 0=Sun ... 6=Sat for weekly or monthly
  weekOfMonth?: number | 'last'; // for monthly scheduling
  customDates?: string[];
  assignments: ResponsibilityAssignment[];
  createdAt: number;
};

export type AppState = {
  pin: string;
  services: Service[];
  appointments: Appointment[];
  members: Member[];
  responsibilities: Responsibility[];
};
