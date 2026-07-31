'use client'

import { useReportWebVitals } from 'next/web-vitals'
import posthog from 'posthog-js'

export default function WebVitals() {
  useReportWebVitals((metric) => {
    posthog.capture('web_vital', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigation_type: metric.navigationType,
    })
  })

  return null
}
