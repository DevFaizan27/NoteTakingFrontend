// frontend/src/hooks/useNoteSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveUsers, setContent, setTitle } from '../redux/slices/noteEditorSlice.js';
import { socketService } from '../services/socketService.js';

export const useNoteSocket = (noteId) => {
  const dispatch = useDispatch();
  const { content, title } = useSelector(state => state.noteEditor);
  const autoSaveRef = useRef();

  useEffect(() => {
    if (!noteId) return;

    // Connect to socket
    const socket = socketService.connect();
    socketService.joinNote(noteId);

    // Set up event listeners
    socketService.onNoteUpdate((data) => {
      if (data.content !== content) {
        dispatch(setContent(data.content));
      }
      if (data.title !== title) {
        dispatch(setTitle(data.title));
      }
    });

    socketService.onActiveUsers((data) => {
      dispatch(setActiveUsers(data.activeUsers));
    });

    socketService.onUserJoined((data) => {
      dispatch(setActiveUsers(data.activeUsers));
    });

    socketService.onUserLeft((data) => {
      dispatch(setActiveUsers(data.activeUsers));
    });

    // Cleanup on unmount
    return () => {
      socketService.leaveNote(noteId);
    };
  }, [noteId, dispatch, content, title]);

  const sendUpdate = (updateData) => {
    if (noteId) {
      socketService.sendNoteUpdate(noteId, updateData);
    }
  };

  return { sendUpdate };
};