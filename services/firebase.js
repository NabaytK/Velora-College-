import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Authentication Functions
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export const updateUserProfile = async (displayName, photoURL = null) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user is currently logged in');
    
    await updateProfile(user, {
      displayName,
      photoURL
    });
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore Functions
export const createUserData = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error creating user data:', error);
    throw error;
  }
};

export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...userData,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

export const addExpense = async (userId, expenseData) => {
  try {
    const expenseRef = await addDoc(collection(db, 'users', userId, 'expenses'), {
      ...expenseData,
      createdAt: serverTimestamp()
    });
    return expenseRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const getExpenses = async (userId, options = {}) => {
  try {
    const { category, startDate, endDate, limit: queryLimit = 20 } = options;
    
    // Start with base query
    let q = collection(db, 'users', userId, 'expenses');
    
    // Build the query based on options
    const constraints = [];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (startDate) {
      constraints.push(where('createdAt', '>=', startDate));
    }
    
    if (endDate) {
      constraints.push(where('createdAt', '<=', endDate));
    }
    
    // Always order by creation date in descending order
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Add limit
    constraints.push(limit(queryLimit));
    
    // Build the final query
    q = query(q, ...constraints);
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Convert to array of expenses
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return expenses;
  } catch (error) {
    console.error('Error getting expenses:', error);
    throw error;
  }
};

export const saveAITip = async (userId, tipData) => {
  try {
    const tipRef = await addDoc(collection(db, 'users', userId, 'ai_tips'), {
      ...tipData,
      createdAt: serverTimestamp()
    });
    return tipRef.id;
  } catch (error) {
    console.error('Error saving AI tip:', error);
    throw error;
  }
};

export const getAITipsHistory = async (userId, queryLimit = 10) => {
  try {
    // Create query for AI tips, ordered by creation date
    const q = query(
      collection(db, 'users', userId, 'ai_tips'),
      orderBy('createdAt', 'desc'),
      limit(queryLimit)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Convert to array of tips
    const tips = [];
    querySnapshot.forEach((doc) => {
      tips.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return tips;
  } catch (error) {
    console.error('Error getting AI tips history:', error);
    throw error;
  }
};

export { auth, db };
