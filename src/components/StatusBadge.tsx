import type { PaymentStatus, WashStatus } from '../models/types'

type BadgeStatus = WashStatus | PaymentStatus

type StatusBadgeProps = {
  status: BadgeStatus
}

const statusStyle: Record<BadgeStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  WASHED: 'bg-sky-100 text-sky-800',
  DELIVERED: 'bg-green-100 text-green-800',
  UNPAID: 'bg-red-100 text-red-800',
  PAID: 'bg-emerald-100 text-emerald-800',
}

const statusLabels: Record<BadgeStatus, string> = {
  PENDING: 'En attente',
  WASHED: 'Lavé',
  DELIVERED: 'Livré',
  UNPAID: 'Impayé',
  PAID: 'Payé',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusStyle[status]}`}>
      {statusLabels[status]}
    </span>
  )
}
