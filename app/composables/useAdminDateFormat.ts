const ADMIN_TIMESTAMP_TIME_ZONE = 'Asia/Makassar'

function toDateOnlyUtc(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
}

function toDateValue(value: string) {
  return new Date(value)
}

export function useAdminDateFormat() {
  const idDateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const idDateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ADMIN_TIMESTAMP_TIME_ZONE,
  })

  const enDateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const occupancyLabelFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })

  function formatAdminDate(value: string) {
    if (!value) return '—'
    return idDateFormatter.format(toDateOnlyUtc(value.slice(0, 10)))
  }

  function formatAdminDateTime(value: string) {
    if (!value) return '—'
    return idDateTimeFormatter.format(toDateValue(value))
  }

  function formatAdminDateRange(start: string, end: string) {
    return `${formatAdminDate(start)} → ${formatAdminDate(end)}`
  }

  function formatAdminDateEn(value: string) {
    if (!value) return '—'
    return enDateFormatter.format(toDateOnlyUtc(value.slice(0, 10)))
  }

  function formatOccupancyLabel(value: string) {
    if (!value) return '-'
    return occupancyLabelFormatter.format(toDateOnlyUtc(value))
  }

  return {
    formatAdminDate,
    formatAdminDateTime,
    formatAdminDateRange,
    formatAdminDateEn,
    formatOccupancyLabel,
  }
}