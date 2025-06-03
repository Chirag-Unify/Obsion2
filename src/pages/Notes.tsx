import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import NoteModal from '../components/NoteModal';
import api from '../utils/api';
import '../styles/notion.css';
import { FiPlus, FiEdit2, FiTag, FiBookmark, FiSearch, FiFileText, FiGrid, FiList, FiCommand, FiFilter, FiStar, FiArchive, FiShare2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';

interface Note {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string | null;
    };
  }>;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('');

  // Hotkeys setup
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault();
    setIsCommandPaletteOpen(true);
  });

  useHotkeys('cmd+/, ctrl+/', (e) => {
    e.preventDefault();
    searchInputRef.current?.focus();
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(undefined);
    setIsModalOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      !note.isArchived &&
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterTags.length === 0 || note.tags.some(({ tag }) => filterTags.includes(tag.name)))
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const pinnedNotes = sortedNotes.filter((note) => note.isPinned);
  const unpinnedNotes = sortedNotes.filter((note) => !note.isPinned);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Add command handlers
  const handleCommand = (command: string) => {
    switch (command) {
      case 'Create new note':
        handleCreateNote();
        break;
      case 'Search notes':
        searchInputRef.current?.focus();
        break;
      case 'Toggle view mode':
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
        break;
      case 'Sort by date':
        setSortBy('date');
        break;
      case 'Sort by title':
        setSortBy('title');
        break;
      default:
        break;
    }
    setIsCommandPaletteOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="notion-page min-h-screen p-0 relative bg-gradient-to-br from-ocean-100 via-blue-100 to-lime-100 dark:from-[#1a2634] dark:via-[#0ea5e9]/20 dark:to-[#10b981]/10">
        {/* Enhanced background with animated gradient */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0" style={{ 
            background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%230ea5e910\'/%3E%3C/svg%3E") repeat',
            opacity: 0.5
          }} />
          <div className="absolute -inset-[500px] animate-slow-spin">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--oceanic-blue)]/20 to-[var(--oceanic-green)]/20 blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto py-12 px-4 sm:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.span 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--oceanic-blue)] to-[var(--oceanic-green)] text-white shadow-lg"
              >
                <FiFileText size={32} />
              </motion.span>
            </div>
            <h1 className="notion-title text-4xl md:text-5xl lg:text-6xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--oceanic-blue)] to-[var(--oceanic-green)] font-bold tracking-tight">
              Your Digital Garden
            </h1>
            <p className="text-lg md:text-xl text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Capture your thoughts, organize your life, and cultivate your ideas in one beautiful space.
            </p>
          </motion.div>

          {/* Advanced Search and Filters Bar */}
          <div className="mb-8 backdrop-blur-xl bg-white/40 dark:bg-[#1a2634]/40 rounded-2xl p-4 shadow-lg border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes... (⌘/Ctrl + /)"
                  className="notion-input pl-10 w-full shadow-inner bg-white/60 dark:bg-[#1a2634]/60"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--oceanic-blue)]">
                  <FiSearch size={18} />
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                >
                  {viewMode === 'grid' ? <FiGrid size={18} /> : <FiList size={18} />}
                </motion.button>
                
                <div className="notion-dropdown">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="notion-dropdown-button shadow"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="title">Sort by Title</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow hidden md:flex"
                  title="Command Palette (⌘/Ctrl + K)"
                >
                  <FiCommand size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[var(--oceanic-blue)]/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-[var(--oceanic-blue)] animate-spin" />
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {pinnedNotes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="notion-h2 mb-6 flex items-center gap-2 text-[var(--oceanic-green)]">
                    <FiStar size={24} /> Pinned Notes
                  </h2>
                  <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                    <AnimatePresence>
                      {pinnedNotes.map((note) => (
                        <motion.div
                          key={note.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleEditNote(note)}
                          className={`notion-card group rounded-2xl shadow-xl bg-white/70 dark:bg-[#1a2634]/80 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] cursor-pointer relative backdrop-blur-xl hover:shadow-2xl overflow-hidden ${
                            viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6'
                          }`}
                        >
                          <div className={viewMode === 'list' ? 'flex-1' : ''}>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="notion-h3 truncate flex items-center gap-2 group-hover:text-[var(--oceanic-blue)]">
                                <span className="text-[var(--oceanic-blue)]">
                                  <div className="transform transition-all duration-200 group-hover:rotate-6">
                                    <FiFileText size={20} />
                                  </div>
                                </span>
                                {note.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-400 animate-bounce">
                                  <FiStar size={18} />
                                </span>
                              </div>
                            </div>
                            
                            <div className="relative">
                              <p className="notion-text text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                                {note.content}
                              </p>
                              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/70 dark:from-[#1a2634]/80 to-transparent" />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex gap-2 flex-wrap">
                                {note.tags.map(({ tag }) => (
                                  <motion.span
                                    key={tag.id}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    whileHover={{ scale: 1.1 }}
                                    className="notion-tag flex items-center gap-1"
                                    style={{
                                      backgroundColor: tag.color || undefined,
                                      color: tag.color ? 'white' : undefined,
                                    }}
                                  >
                                    <FiTag size={13} /> {tag.name}
                                  </motion.span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(note.updatedAt)}
                              </span>
                            </div>
                          </div>

                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                            >
                              <FiShare2 size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                            >
                              <FiArchive size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                            >
                              <FiEdit2 size={16} />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {pinnedNotes.length > 0 && (
                  <h2 className="notion-h2 mb-6 flex items-center gap-2 text-[var(--oceanic-blue)]">
                    <FiFileText size={24} /> All Notes
                  </h2>
                )}
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-8`}>
                  <AnimatePresence>
                    {unpinnedNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleEditNote(note)}
                        className={`notion-card group rounded-2xl shadow-xl bg-white/70 dark:bg-[#1a2634]/80 border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)] cursor-pointer relative backdrop-blur-xl hover:shadow-2xl overflow-hidden ${
                          viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6'
                        }`}
                      >
                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="notion-h3 truncate flex items-center gap-2 group-hover:text-[var(--oceanic-blue)]">
                              <span className="text-[var(--oceanic-blue)]">
                                <div className="transform transition-all duration-200 group-hover:rotate-6">
                                  <FiFileText size={20} />
                                </div>
                              </span>
                              {note.title}
                            </h3>
                          </div>
                          
                          <div className="relative">
                            <p className="notion-text text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
                              {note.content}
                            </p>
                            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/70 dark:from-[#1a2634]/80 to-transparent" />
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex gap-2 flex-wrap">
                              {note.tags.map(({ tag }) => (
                                <motion.span
                                  key={tag.id}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  whileHover={{ scale: 1.1 }}
                                  className="notion-tag flex items-center gap-1"
                                  style={{
                                    backgroundColor: tag.color || undefined,
                                    color: tag.color ? 'white' : undefined,
                                  }}
                                >
                                  <FiTag size={13} /> {tag.name}
                                </motion.span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(note.updatedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                          >
                            <FiShare2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                          >
                            <FiArchive size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="notion-icon-button bg-[var(--oceanic-blue)]/10 hover:bg-[var(--oceanic-blue)]/20 text-[var(--oceanic-blue)] shadow"
                          >
                            <FiEdit2 size={16} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          )}
        </div>

        {/* Enhanced Floating Action Button */}
        <motion.button
          onClick={handleCreateNote}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-[var(--oceanic-blue)] to-[var(--oceanic-green)] text-white shadow-2xl rounded-full p-5 focus:outline-none focus:ring-4 focus:ring-[var(--oceanic-blue)]/30"
          aria-label="Add Note"
        >
          <div className="transform transition-all duration-200 group-hover:rotate-180">
            <FiPlus size={28} />
          </div>
        </motion.button>

        {/* Command Palette */}
        <AnimatePresence>
          {isCommandPaletteOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
            >
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                onClick={() => setIsCommandPaletteOpen(false)} 
              />
              <div className="relative w-full max-w-2xl mx-4 overflow-hidden rounded-2xl bg-white/90 dark:bg-[#1a2634]/90 shadow-2xl border border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                <input
                  type="text"
                  value={commandPaletteQuery}
                  onChange={(e) => setCommandPaletteQuery(e.target.value.toLowerCase())}
                  placeholder="Type a command or search..."
                  className="w-full px-4 py-4 bg-transparent border-none focus:outline-none text-lg font-medium"
                  autoFocus
                />
                <div className="border-t border-[var(--oceanic-border)] dark:border-[var(--oceanic-border-dark)]">
                  <div className="py-2 px-2">
                    <div className="px-2 py-1 text-sm font-medium text-[var(--oceanic-text)]/60 dark:text-[var(--oceanic-text-dark)]/60">
                      Quick Actions
                    </div>
                    {['Create new note', 'Search notes', 'Toggle view mode', 'Sort by date', 'Sort by title']
                      .filter(action => action.toLowerCase().includes(commandPaletteQuery))
                      .map((action) => (
                        <button
                          key={action}
                          onClick={() => handleCommand(action)}
                          className="w-full px-2 py-2 text-left rounded-lg hover:bg-[var(--oceanic-blue)]/10 focus:outline-none focus:bg-[var(--oceanic-blue)]/10 font-medium transition-colors duration-150"
                        >
                          {action}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <NoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={fetchNotes}
          note={selectedNote}
        />
      </div>
    </DashboardLayout>
  );
} 