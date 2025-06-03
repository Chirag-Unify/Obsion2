import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import FormInput from './FormInput';
import Button from './Button';
import StyledDropdown from './StyledDropdown';
import { FiFileText, FiTag, FiSave } from 'react-icons/fi';
import api from '../utils/api';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  note?: {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    tags: Array<{
      tag: {
        id: string;
        name: string;
        color: string | null;
      };
    }>;
  };
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedTags(note.tags.map(t => t.tag.id));
    } else {
      setTitle('');
      setContent('');
      setSelectedTags([]);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (note) {
        await api.put(`/notes/${note.id}`, {
          title,
          content,
          isPinned: false,
        });
      } else {
        await api.post('/notes', {
          title,
          content,
          isPinned: false,
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? 'Edit Note' : 'Create New Note'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          icon={<FiFileText size={18} />}
          required
        />

        <FormInput
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content..."
          multiline
          required
        />

        <div className="space-y-1">
          <StyledDropdown
            label="Tags"
            icon={<FiTag size={18} />}
            value={selectedTags}
            onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
            multiple
            className="min-h-[80px]"
          >
            <option value="">Select tags...</option>
            {/* Add your tag options here */}
          </StyledDropdown>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            icon={<FiSave size={18} />}
            loading={loading}
          >
            {note ? 'Update Note' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NoteModal; 