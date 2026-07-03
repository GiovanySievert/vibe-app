import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { PlaceReviewEligibility, PlaceReviewService } from '../services/place-review.service'

type Args = {
  placeId: string
  enabled?: boolean
}

export type UsePlaceReviewEligibilityResult = {
  eligibility: PlaceReviewEligibility | null
  isLoading: boolean
  isFetching: boolean
  refetch: () => void
  secondsUntilAllowed: number
}

const computeSecondsUntil = (nextAllowedAtMs: number): number => {
  return Math.max(0, Math.ceil((nextAllowedAtMs - Date.now()) / 1000))
}

export const usePlaceReviewEligibility = ({
  placeId,
  enabled = true
}: Args): UsePlaceReviewEligibilityResult => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['placeReviewEligibility', placeId],
    queryFn: () => PlaceReviewService.eligibility(placeId).then((r) => r.data),
    enabled,
    staleTime: 0,
    gcTime: 0,
    retry: false
  })

  const nextAllowedAtMs =
    data?.cooldown.active && data.cooldown.nextAllowedAt
      ? new Date(data.cooldown.nextAllowedAt).getTime()
      : null

  const [secondsUntilAllowed, setSecondsUntilAllowed] = useState(() =>
    nextAllowedAtMs ? computeSecondsUntil(nextAllowedAtMs) : 0
  )
  const refetchedOnExpireRef = useRef(false)

  useEffect(() => {
    if (nextAllowedAtMs === null) {
      setSecondsUntilAllowed(0)
      refetchedOnExpireRef.current = false
      return
    }

    refetchedOnExpireRef.current = false

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const tick = () => {
      const remaining = computeSecondsUntil(nextAllowedAtMs)
      setSecondsUntilAllowed(remaining)

      if (remaining <= 0) {
        if (!refetchedOnExpireRef.current) {
          refetchedOnExpireRef.current = true
          refetch()
        }
        return
      }

      const msUntilNextSecond = ((nextAllowedAtMs - Date.now()) % 1000) || 1000
      timeoutId = setTimeout(tick, msUntilNextSecond)
    }

    tick()

    return () => {
      if (timeoutId !== null) clearTimeout(timeoutId)
    }
  }, [nextAllowedAtMs, refetch])

  return {
    eligibility: data ?? null,
    isLoading,
    isFetching,
    refetch,
    secondsUntilAllowed
  }
}
