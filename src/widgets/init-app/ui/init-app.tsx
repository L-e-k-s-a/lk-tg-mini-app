import { detectPlatform } from "@/shared/lib/platform/get-platform"
import { platformSlice } from "@/shared/store/platform"
import { Loader } from "@/shared/ui"
import { useEffect, useState } from "react"

export const InitApp = () => {
  const [isReady, setIsReady] = useState(false)
  const { setPlatform } = platformSlice()
  
  useEffect(() => {
    const detectedPlatform = detectPlatform()
    setPlatform(detectedPlatform)
    setIsReady(true)
    console.log(detectPlatform)
  }, [setPlatform])
  console.log("fsfsfsfs")

  if (!isReady) {
    return <Loader />
  }
}
