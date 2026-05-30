declare module "react-tweet" {
  import type { ReactNode } from "react"

  export type Tweet = any
  export type EnrichedTweet = any

  export type TweetProps = {
    id?: string
    className?: string
    components?: Record<string, any>
    fallback?: ReactNode
    onError?: (error: unknown) => void
  }

  export function enrichTweet(tweet: Tweet): EnrichedTweet
}

declare module "react-tweet/api" {
  import type { Tweet } from "react-tweet"

  export function getTweet(id: string): Promise<Tweet>
  export type Tweet = any
}
