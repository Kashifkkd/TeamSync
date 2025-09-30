"use client"

import React, { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  MessageCircle, 
  Send, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Reply,
  AtSign,
  Heart,
  ThumbsUp
} from "lucide-react"
import { getInitials, formatRelativeTime } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  type: "comment" | "system" | "mention"
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name?: string
    email?: string
    image?: string
  }
  reactions?: Array<{
    id: string
    type: "like" | "heart" | "thumbs_up"
    user: {
      id: string
      name?: string
    }
  }>
  replies?: Comment[]
}

interface CommentSectionProps {
  comments: Comment[]
  currentUser: {
    id: string
    name?: string
    email?: string
    image?: string
  }
  onAddComment: (content: string, parentId?: string) => Promise<void>
  onEditComment: (commentId: string, content: string) => Promise<void>
  onDeleteComment: (commentId: string) => Promise<void>
  onReactToComment: (commentId: string, reaction: string) => Promise<void>
  placeholder?: string
}

export function CommentSection({
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onReactToComment,
  placeholder = "Add a comment..."
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAddComment(newComment)
      setNewComment("")
    } catch (error) {
      console.error("Failed to add comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onEditComment(commentId, editContent)
      setEditingComment(null)
      setEditContent("")
    } catch (error) {
      console.error("Failed to edit comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await onAddComment(replyContent, parentId)
      setReplyingTo(null)
      setReplyContent("")
    } catch (error) {
      console.error("Failed to reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const startReply = (commentId: string) => {
    setReplyingTo(commentId)
    setReplyContent("")
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyContent("")
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-2">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment */}
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={currentUser.image || ""} />
          <AvatarFallback className="text-xs">
            {getInitials(currentUser.name || currentUser.email || "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder={placeholder}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSubmitComment()
              }
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Press ⌘+Enter to submit
            </p>
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="mr-2 h-3 w-3" />
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to start the conversation</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onEdit={startEdit}
              onDelete={onDeleteComment}
              onReact={onReactToComment}
              onReply={startReply}
              isEditing={editingComment === comment.id}
              editContent={editContent}
              setEditContent={setEditContent}
              onSaveEdit={() => handleEditComment(comment.id)}
              onCancelEdit={cancelEdit}
              isReplying={replyingTo === comment.id}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSaveReply={() => handleReply(comment.id)}
              onCancelReply={cancelReply}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  currentUser: { id: string; name?: string; email?: string; image?: string }
  onEdit: (comment: Comment) => void
  onDelete: (commentId: string) => Promise<void>
  onReact: (commentId: string, reaction: string) => Promise<void>
  onReply: (commentId: string) => void
  isEditing: boolean
  editContent: string
  setEditContent: (content: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  isReplying: boolean
  replyContent: string
  setReplyContent: (content: string) => void
  onSaveReply: () => void
  onCancelReply: () => void
  isSubmitting: boolean
}

function CommentItem({
  comment,
  currentUser,
  onEdit,
  onDelete,
  onReact,
  onReply,
  isEditing,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  isReplying,
  replyContent,
  setReplyContent,
  onSaveReply,
  onCancelReply,
  isSubmitting,
}: CommentItemProps) {
  const isAuthor = comment.author.id === currentUser.id
  const isSystemComment = comment.type === "system"

  if (isSystemComment) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <span>{comment.content}</span>
        <span>•</span>
        <span>{formatRelativeTime(comment.createdAt)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Card className={comment.type === "mention" ? "border-blue-200 bg-blue-50" : ""}>
        <CardContent className="p-4">
          <div className="flex space-x-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.author.image || ""} />
              <AvatarFallback className="text-xs">
                {getInitials(comment.author.name || comment.author.email || "")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900">
                    {comment.author.name || comment.author.email}
                  </span>
                  {comment.type === "mention" && (
                    <Badge variant="secondary" className="text-xs">
                      <AtSign className="mr-1 h-2 w-2" />
                      Mentioned you
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && " (edited)"}
                  </span>
                </div>
                
                {isAuthor && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(comment)}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Comment Content */}
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      onClick={onSaveEdit}
                      disabled={!editContent.trim() || isSubmitting}
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                  {comment.content}
                </div>
              )}

              {/* Comment Actions */}
              {!isEditing && (
                <div className="flex items-center space-x-4 text-xs">
                  <button
                    onClick={() => onReact(comment.id, "like")}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>Like</span>
                    {comment.reactions?.filter(r => r.type === "like").length || ""}
                  </button>
                  
                  <button
                    onClick={() => onReply(comment.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="h-3 w-3" />
                    <span>Reply</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-11 flex space-x-3">
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarImage src={currentUser.image || ""} />
            <AvatarFallback className="text-xs">
              {getInitials(currentUser.name || currentUser.email || "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[60px]"
            />
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                onClick={onSaveReply}
                disabled={!replyContent.trim() || isSubmitting}
              >
                Reply
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onCancelReply}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
              onReply={onReply}
              isEditing={false}
              editContent=""
              setEditContent={() => {}}
              onSaveEdit={() => {}}
              onCancelEdit={() => {}}
              isReplying={false}
              replyContent=""
              setReplyContent={() => {}}
              onSaveReply={() => {}}
              onCancelReply={() => {}}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  )
}
