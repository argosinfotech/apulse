import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useEffect } from "react";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
  minHeight = "80px",
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Return empty string if editor is empty (just has empty paragraph)
      const isEmpty = html === "<p></p>" || html === "";
      onChange?.(isEmpty ? "" : html);
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Update editable state when disabled changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 border-b border-border px-1 py-1 bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0",
            editor.isActive("bold") && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0",
            editor.isActive("italic") && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0",
            editor.isActive("bulletList") && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 w-7 p-0",
            editor.isActive("orderedList") && "bg-accent text-accent-foreground"
          )}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={cn(
          "prose prose-sm max-w-none px-3 py-2 text-sm",
          "[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[60px]",
          "[&_.ProseMirror_p]:my-1 [&_.ProseMirror_ul]:my-1 [&_.ProseMirror_ol]:my-1",
          "[&_.ProseMirror_ul]:pl-4 [&_.ProseMirror_ol]:pl-4",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:text-muted-foreground",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:float-left",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:h-0",
          "[&_.ProseMirror.is-editor-empty:first-child::before]:pointer-events-none"
        )}
        style={{ minHeight }}
      />
    </div>
  );
}
