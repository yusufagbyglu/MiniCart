"use client"

import { useState } from "react"
import { ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RatingStars } from "./rating-stars"
import { formatDistanceToNow } from "date-fns"
import type { Review } from "@/types/review"

interface ReviewListProps {
  productId: number
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    user: { id: 1, name: "John D." },
    rating: 5,
    title: "Best headphones I've ever owned",
    comment:
      "The sound quality is incredible and the noise cancellation is top-notch. Very comfortable for long listening sessions. Worth every penny!",
    is_approved: true,
    approved_by: null,
    created_at: "2024-12-15T10:30:00Z",
    updated_at: "2024-12-15T10:30:00Z",
  },
  {
    id: 2,
    product_id: 1,
    user_id: 2,
    user: { id: 2, name: "Sarah M." },
    rating: 4,
    title: "Great quality, minor issues",
    comment:
      "Sound quality is excellent and they're very comfortable. Only giving 4 stars because the Bluetooth connection can be a bit finicky sometimes.",
    is_approved: true,
    approved_by: null,
    created_at: "2024-12-10T15:45:00Z",
    updated_at: "2024-12-10T15:45:00Z",
  },
  {
    id: 3,
    product_id: 1,
    user_id: 3,
    user: { id: 3, name: "Mike R." },
    rating: 5,
    title: "Perfect for work from home",
    comment:
      "These headphones have been a game-changer for my work from home setup. Crystal clear audio for calls and the noise cancellation blocks out all distractions.",
    is_approved: true,
    approved_by: null,
    created_at: "2024-12-05T09:00:00Z",
    updated_at: "2024-12-05T09:00:00Z",
  },
]

export function ReviewList({ productId }: ReviewListProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")

  const reviews = mockReviews.filter((r) => r.product_id === productId || productId === 1)

  const filteredReviews = reviews
    .filter((review) => filterRating === "all" || review.rating === Number.parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === "highest") {
        return b.rating - a.rating
      }
      if (sortBy === "lowest") {
        return a.rating - b.rating
      }
      return 0
    })

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100 || 0,
  }))

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-lg bg-muted/50">
        <div className="text-center sm:text-left">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <RatingStars rating={averageRating} className="justify-center sm:justify-start mt-1" />
          <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2">
              <span className="text-sm w-8">{rating}★</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No reviews found</p>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{review.user?.name}</span>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </p>
                  {review.title && <h4 className="font-medium mt-2">{review.title}</h4>}
                  {review.comment && <p className="text-muted-foreground mt-1">{review.comment}</p>}
                  <div className="flex items-center gap-4 mt-3">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Helpful
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground">
                      <Flag className="h-3 w-3" />
                      Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
