// frontend/src/components/NotesList.jsx
import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Calendar, Trash2, Edit, MoreVertical } from 'lucide-react';
import { useDeleteNoteMutation, useGetAllNotesQuery, useSearchNotesQuery } from '../redux/slices/notesApi';

const NotesList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [deleteNote] = useDeleteNoteMutation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const limit = 10;

  // Use search query if search term is provided, otherwise get all notes
  const { data: notesData, isLoading, error } = searchQuery 
    ? useSearchNotesQuery({ query: searchQuery, page: currentPage, limit })
    : useGetAllNotesQuery({ page: currentPage, limit, sortBy, sortOrder });

  const notes = notesData?.data || [];
  const pagination = notesData?.pagination;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

 

  const handleDeleteNote = async (noteId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId).unwrap();
        setActiveDropdown(null);
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (!content) return 'No content';
    return content.length > maxLength 
      ? content.substring(0, maxLength) + '...' 
      : content;
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Failed to load notes</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">All Notes</h2>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>New Note</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

       
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="mb-2">No notes found</p>
            {searchQuery ? (
              <p>Try adjusting your search terms</p>
            ) : (
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first note
              </Link>
            )}
          </div>
        ) : (
          <div className="p-2">
            {notes.map((note) => (
              <div
                key={note._id}
                className={`group relative p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  location.pathname === `/note/${note._id}`
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <Link
                  to={`/note/${note._id}`}
                  className="block"
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900 pr-8 truncate">
                      {note.title || 'Untitled Note'}
                    </h3>
                    
                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === note._id ? null : note._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all"
                      >
                        <MoreVertical size={14} />
                      </button>
                      
                      {activeDropdown === note._id && (
                        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={(e) => handleDeleteNote(note._id, e)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {truncateContent(note.content)}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{formatDate(note.updatedAt)}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} notes
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                disabled={currentPage === pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesList;