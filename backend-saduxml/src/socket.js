/**
 * Socket.IO Handler
 * Manages real-time communication for bracket updates
 */

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join event room
    socket.on('join-event', (eventId) => {
      const room = `event-${eventId}`;
      socket.join(room);
      console.log(`🏆 Socket ${socket.id} joined event room: ${room}`);
      socket.emit('joined-event', { eventId, room });
    });

    // Leave event room
    socket.on('leave-event', (eventId) => {
      const room = `event-${eventId}`;
      socket.leave(room);
      console.log(`👋 Socket ${socket.id} left event room: ${room}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emit bracket update to all clients in event room
 */
export const emitBracketUpdate = (io, eventId, data) => {
  const room = `event-${eventId}`;
  io.to(room).emit('bracket:update', {
    eventId,
    timestamp: new Date().toISOString(),
    data
  });
  console.log(`📡 Emitted bracket:update to room ${room}`);
};

/**
 * Emit match update to all clients in event room
 */
export const emitMatchUpdate = (io, eventId, matchId, updates) => {
  const room = `event-${eventId}`;
  io.to(room).emit('match:update', {
    eventId,
    matchId,
    timestamp: new Date().toISOString(),
    updates
  });
  console.log(`📡 Emitted match:update to room ${room} for match ${matchId}`);
};

/**
 * Emit stage update to all clients in event room
 */
export const emitStageUpdate = (io, eventId, stageId, updates) => {
  const room = `event-${eventId}`;
  io.to(room).emit('stage:update', {
    eventId,
    stageId,
    timestamp: new Date().toISOString(),
    updates
  });
  console.log(`📡 Emitted stage:update to room ${room} for stage ${stageId}`);
};
