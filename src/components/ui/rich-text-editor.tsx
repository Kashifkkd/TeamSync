"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading2,
  Strikethrough
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Write something...",
  className
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4",
          className
        )
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  if (!editor) {
    return null
  }

  const MenuBar = () => {
    return (
      <div className="flex items-center space-x-1 p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bold") && "bg-accent"
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("italic") && "bg-accent"
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("strike") && "bg-accent"
          )}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("heading", { level: 2 }) && "bg-accent"
          )}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("bulletList") && "bg-accent"
          )}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("orderedList") && "bg-accent"
          )}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("blockquote") && "bg-accent"
          )}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "h-8 w-8 p-0",
            editor.isActive("codeBlock") && "bg-accent"
          )}
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <MenuBar />
      <EditorContent editor={editor} />
    </div>
  )
}

