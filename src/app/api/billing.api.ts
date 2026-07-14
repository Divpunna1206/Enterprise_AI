import { getRequest, patchRequest, postRequest } from './client';
import type {
  AccountantReportsResponse,
  InvoiceRecord,
  InvoicesListResponse,
  ParentFeeRecord,
  PaymentRecord,
  PaymentsListResponse,
  PlanRecord,
  PlansListResponse,
  ReminderResponse,
  SubscriptionRecord,
  SubscriptionsListResponse,
} from '../types/runtime-data.types';

export const billingApi = {
  listPlans(query?: Record<string, string | number | undefined>) {
    return getRequest<PlansListResponse>('/plans', { params: query });
  },
  createPlan(payload: Record<string, unknown>) {
    return postRequest<PlanRecord, Record<string, unknown>>('/plans', payload);
  },
  updatePlan(id: string, payload: Record<string, unknown>) {
    return patchRequest<PlanRecord, Record<string, unknown>>(`/plans/${id}`, payload);
  },
  togglePlan(id: string) {
    return patchRequest<PlanRecord>(`/plans/${id}/toggle`);
  },
  listSubscriptions(query?: Record<string, string | number | undefined>) {
    return getRequest<SubscriptionsListResponse>('/subscriptions', { params: query });
  },
  createSubscription(payload: Record<string, unknown>) {
    return postRequest<SubscriptionRecord, Record<string, unknown>>('/subscriptions', payload);
  },
  getSubscription(id: string) {
    return getRequest<SubscriptionRecord>(`/subscriptions/${id}`);
  },
  updateSubscription(id: string, payload: Record<string, unknown>) {
    return patchRequest<SubscriptionRecord, Record<string, unknown>>(`/subscriptions/${id}`, payload);
  },
  cancelSubscription(id: string) {
    return patchRequest<SubscriptionRecord>(`/subscriptions/${id}/cancel`);
  },
  listInvoices(query?: Record<string, string | number | undefined>) {
    return getRequest<InvoicesListResponse>('/invoices', { params: query });
  },
  createInvoice(payload: Record<string, unknown>) {
    return postRequest<InvoiceRecord, Record<string, unknown>>('/invoices', payload);
  },
  getInvoice(id: string) {
    return getRequest<InvoiceRecord>(`/invoices/${id}`);
  },
  updateInvoice(id: string, payload: Record<string, unknown>) {
    return patchRequest<InvoiceRecord, Record<string, unknown>>(`/invoices/${id}`, payload);
  },
  markInvoicePaid(id: string) {
    return patchRequest<InvoiceRecord>(`/invoices/${id}/mark-paid`);
  },
  createPaymentOrder(payload: Record<string, unknown>) {
    return postRequest('/payments/create-order', payload);
  },
  verifyPayment(payload: Record<string, unknown>) {
    return postRequest('/payments/verify', payload);
  },
  listPayments(query?: Record<string, string | number | undefined>) {
    return getRequest<PaymentsListResponse>('/payments', { params: query });
  },
  getPayment(id: string) {
    return getRequest<PaymentRecord>(`/payments/${id}`);
  },
  getAccountantDashboard() {
    return getRequest('/accountant/dashboard');
  },
  getAccountantFeeInvoices(query?: Record<string, string | number | undefined>) {
    return getRequest<InvoicesListResponse>('/accountant/fee-invoices', { params: query });
  },
  getAccountantPayments(query?: Record<string, string | number | undefined>) {
    return getRequest<PaymentsListResponse>('/accountant/payments', { params: query });
  },
  getAccountantPendingFees(query?: Record<string, string | number | undefined>) {
    return getRequest<InvoiceRecord[]>('/accountant/pending-fees', { params: query });
  },
  getAccountantReceipts(query?: Record<string, string | number | undefined>) {
    return getRequest<PaymentRecord[]>('/accountant/receipts', { params: query });
  },
  getAccountantReports(query?: Record<string, string | number | undefined>) {
    return getRequest<AccountantReportsResponse>('/accountant/reports', { params: query });
  },
  sendAccountantReminders(payload: Record<string, unknown>) {
    return postRequest<ReminderResponse, Record<string, unknown>>('/accountant/reminders/send', payload);
  },
  getParentChildrenFees() {
    return getRequest<ParentFeeRecord[]>('/parents/me/children-fees');
  },
  getParentInvoices() {
    return getRequest<InvoiceRecord[]>('/parents/me/invoices');
  },
};
