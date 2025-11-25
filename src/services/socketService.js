// frontend/src/services/socketService.js
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io( import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000', {
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinNote(noteId) {
    if (this.socket) {
      this.socket.emit('join_note', noteId);
    }
  }

  leaveNote(noteId) {
    if (this.socket) {
      this.socket.emit('leave_note', noteId);
    }
  }

  sendNoteUpdate(noteId, updateData) {
    if (this.socket) {
      this.socket.emit('note_update', {
        noteId,
        ...updateData
      });
    }
  }

  onNoteUpdate(callback) {
    if (this.socket) {
      this.socket.off('note_updated');
      this.socket.on('note_updated', callback);
    }
  }

  onActiveUsers(callback) {
    if (this.socket) {
      this.socket.off('active_users');
      this.socket.on('active_users', callback);
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.off('user_joined');
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.off('user_left');
      this.socket.on('user_left', callback);
    }
  }
}

export const socketService = new SocketService();