import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { FiBold, FiItalic, FiList, FiCheckSquare, FiCode, FiLink, FiHighlight } from 'react-icons/fi';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = 'Start writing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      TextStyle,
      Color,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="notion-editor border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] rounded-lg bg-white dark:bg-[#1a2634] overflow-hidden">
      <div className="border-b border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] p-2 bg-[var(--oceanic-surface)] dark:bg-[#1e293b] flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-button ${editor.isActive('bold') ? 'is-active' : ''}`}
          title="Bold"
        >
          <FiBold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-button ${editor.isActive('italic') ? 'is-active' : ''}`}
          title="Italic"
        >
          <FiItalic size={18} />
        </button>
        <div className="w-px h-6 bg-[var(--oceanic-border)] dark:bg-[var(--oceanic-border-dark)]" />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          title="Bullet List"
        >
          <FiList size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`editor-button ${editor.isActive('taskList') ? 'is-active' : ''}`}
          title="Task List"
        >
          <FiCheckSquare size={18} />
        </button>
        <div className="w-px h-6 bg-[var(--oceanic-border)] dark:bg-[var(--oceanic-border-dark)]" />
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`editor-button ${editor.isActive('code') ? 'is-active' : ''}`}
          title="Code"
        >
          <FiCode size={18} />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter the URL:');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`editor-button ${editor.isActive('link') ? 'is-active' : ''}`}
          title="Link"
        >
          <FiLink size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`editor-button ${editor.isActive('highlight') ? 'is-active' : ''}`}
          title="Highlight"
        >
          <FiHighlight size={18} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
