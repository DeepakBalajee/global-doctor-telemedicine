'use client'

import React, { useEffect, useState } from 'react'

export interface RazorpayScriptLoaderProps {
  onLoad?: () => void
  onError?: (err: Error) => void
}

export const RazorpayScriptLoader: React.FC<RazorpayScriptLoaderProps> = ({ onLoad, onError }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if script already exists
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      setIsLoaded(true)
      if (onLoad) onLoad()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      setIsLoaded(true)
      if (onLoad) onLoad()
    }
    script.onerror = () => {
      const err = new Error('Failed to load Razorpay Checkout SDK.')
      if (onError) onError(err)
    }

    document.body.appendChild(script)
  }, [onLoad, onError])

  return isLoaded ? (
    <span className="hidden" aria-hidden="true" data-sdk-loaded="true" />
  ) : null
}
