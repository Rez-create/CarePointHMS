import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Types
interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: any;
}

// Appointments
interface Appointment {
  id: number;
  patient: number;
  doctor: number;
  date: string;
  status: string;
  notes?: string;
}

export const useAppointments = (params?: QueryParams): UseQueryResult<Appointment[]> => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => api.get('/api/appointments/', { params }).then((res) => res.data)
  });
};

export const useCreateAppointment = (): UseMutationResult<Appointment, Error, Partial<Appointment>> => {
  return useMutation({
    mutationFn: (data: Partial<Appointment>) => 
      api.post('/api/appointments/', data).then((res) => res.data)
  });
};

// Patients
interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

export const usePatients = (params?: QueryParams): UseQueryResult<Patient[]> => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: () => api.get('/api/patients/', { params }).then((res) => res.data)
  });
};

export const useCreatePatient = (): UseMutationResult<Patient, Error, Partial<Patient>> => {
  return useMutation({
    mutationFn: (data: Partial<Patient>) => 
      api.post('/api/patients/', data).then((res) => res.data)
  });
};

// Lab Results
interface LabResult {
  id: number;
  patient: number;
  test: string;
  result: string;
  date: string;
  notes?: string;
}

export const useLabResults = (params?: QueryParams): UseQueryResult<LabResult[]> => {
  return useQuery({
    queryKey: ['lab-results', params],
    queryFn: () => api.get('/api/laboratory/results/', { params }).then((res) => res.data)
  });
};

export const useCreateLabResult = (): UseMutationResult<LabResult, Error, Partial<LabResult>> => {
  return useMutation({
    mutationFn: (data: Partial<LabResult>) => 
      api.post('/api/laboratory/results/', data).then((res) => res.data)
  });
};

// Billing
interface BillingRecord {
  id: number;
  patient: number;
  amount: number;
  date: string;
  status: string;
  description: string;
}

export const useBillingRecords = (params?: QueryParams): UseQueryResult<BillingRecord[]> => {
  return useQuery({
    queryKey: ['billing', params],
    queryFn: () => api.get('/api/billing/', { params }).then((res) => res.data)
  });
};

export const useCreateBilling = (): UseMutationResult<BillingRecord, Error, Partial<BillingRecord>> => {
  return useMutation({
    mutationFn: (data: Partial<BillingRecord>) => 
      api.post('/api/billing/', data).then((res) => res.data)
  });
};

// Pharmacy
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate: string;
}

export const usePharmacyInventory = (params?: QueryParams): UseQueryResult<InventoryItem[]> => {
  return useQuery({
    queryKey: ['pharmacy-inventory', params],
    queryFn: () => api.get('/api/pharmacy/inventory/', { params }).then((res) => res.data)
  });
};

export const useUpdateInventory = (): UseMutationResult<InventoryItem, Error, Partial<InventoryItem>> => {
  return useMutation({
    mutationFn: (data: Partial<InventoryItem>) => 
      api.patch(`/api/pharmacy/inventory/${data.id}/`, data).then((res) => res.data)
  });
};