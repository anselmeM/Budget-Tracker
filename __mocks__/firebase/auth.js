// __mocks__/firebase/auth.js

// Mock implementation for signInWithEmailAndPassword
const signInWithEmailAndPassword = jest.fn(() => {
  return Promise.resolve({
    user: {
      uid: 'mock-user-id-123',
      email: 'test@example.com',
    },
  });
});

// Mock implementation for onAuthStateChanged
// This mock allows us to manually trigger auth state changes in our tests.
let onAuthStateChangedCallback;
const onAuthStateChanged = jest.fn((auth, callback) => {
  onAuthStateChangedCallback = callback; // Store the callback to be called later
  // Return an unsubscribe function, just like the real one.
  return () => {};
});

// A helper function for our tests to simulate a user logging in or out
const mockSendAuthStateChanged = (user) => {
  if (onAuthStateChangedCallback) {
    onAuthStateChangedCallback(user);
  }
};

// Mock getAuth
const getAuth = jest.fn(() => {
  // Return a mock auth object. It can be empty or contain mock properties.
  return {};
});

// Export all the mocked functions
export {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  mockSendAuthStateChanged // Export our helper too
};
