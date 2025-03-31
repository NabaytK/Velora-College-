import firebase_admin
from firebase_admin import firestore
from datetime import datetime

class FirebaseService:
    """
    Service for interacting with Firebase (Firestore database)
    """
    
    def __init__(self, db=None):
        """
        Initialize the Firebase service
        
        Args:
            db (firestore.Client, optional): Firestore database client
        """
        self.db = db if db else firestore.client()
    
    def create_user(self, user_id, user_data):
        """
        Create a new user document in Firestore
        
        Args:
            user_id (str): Firebase user ID
            user_data (dict): User data to store
            
        Returns:
            bool: Success status
        """
        try:
            # Create user document
            self.db.collection('users').document(user_id).set(user_data)
            return True
        except Exception as e:
            print(f"Error creating user: {e}")
            return False
    
    def get_user(self, user_id):
        """
        Get user data from Firestore
        
        Args:
            user_id (str): Firebase user ID
            
        Returns:
            dict: User data
        """
        try:
            # Get user document
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            else:
                return None
        except Exception as e:
            print(f"Error getting user: {e}")
            return None
    
    def update_user(self, user_id, update_data):
        """
        Update user data in Firestore
        
        Args:
            user_id (str): Firebase user ID
            update_data (dict): Data to update
            
        Returns:
            bool: Success status
        """
        try:
            # Update user document
            self.db.collection('users').document(user_id).update(update_data)
            return True
        except Exception as e:
            print(f"Error updating user: {e}")
            return False
    
    def save_ai_tip(self, user_id, tip_data):
        """
        Save an AI tip to the user's history
        
        Args:
            user_id (str): Firebase user ID
            tip_data (dict): AI tip data to save
            
        Returns:
            str: Document ID of the saved tip
        """
        try:
            # Add tip to user's ai_tips subcollection
            doc_ref = self.db.collection('users').document(user_id).collection('ai_tips').document()
            doc_ref.set(tip_data)
            return doc_ref.id
        except Exception as e:
            print(f"Error saving AI tip: {e}")
            return None
    
    def get_ai_tips_history(self, user_id, limit=10):
        """
        Get the user's AI tips history
        
        Args:
            user_id (str): Firebase user ID
            limit (int, optional): Maximum number of tips to retrieve
            
        Returns:
            list: List of AI tips
        """
        try:
            # Get tips from user's ai_tips subcollection, ordered by timestamp
            tips_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('ai_tips')
                .order_by('created_at', direction=firestore.Query.DESCENDING)
                .limit(limit)
            )
            
            tips = []
            for doc in tips_ref.stream():
                tip_data = doc.to_dict()
                tip_data['id'] = doc.id
                tips.append(tip_data)
                
            return tips
        except Exception as e:
            print(f"Error getting AI tips history: {e}")
            return []
    
    def add_expense(self, user_id, expense_data):
        """
        Add an expense to the user's expenses
        
        Args:
            user_id (str): Firebase user ID
            expense_data (dict): Expense data to save
            
        Returns:
            str: Document ID of the saved expense
        """
        try:
            # Add expense to user's expenses subcollection
            doc_ref = self.db.collection('users').document(user_id).collection('expenses').document()
            doc_ref.set(expense_data)
            return doc_ref.id
        except Exception as e:
            print(f"Error adding expense: {e}")
            return None
    
    def get_expenses(self, user_id, limit=20, category=None, start_date=None, end_date=None):
        """
        Get the user's expenses with filtering options
        
        Args:
            user_id (str): Firebase user ID
            limit (int, optional): Maximum number of expenses to retrieve
            category (str, optional): Filter by category
            start_date (str, optional): Filter by minimum date (ISO format)
            end_date (str, optional): Filter by maximum date (ISO format)
            
        Returns:
            list: List of expenses
        """
        try:
            # Start with base query
            expenses_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('expenses')
                .order_by('created_at', direction=firestore.Query.DESCENDING)
            )
            
            # Add category filter if provided
            if category:
                expenses_ref = expenses_ref.where('category', '==', category)
            
            # Add date filters if provided
            if start_date:
                start_datetime = datetime.fromisoformat(start_date)
                expenses_ref = expenses_ref.where('created_at', '>=', start_datetime)
                
            if end_date:
                end_datetime = datetime.fromisoformat(end_date)
                expenses_ref = expenses_ref.where('created_at', '<=', end_datetime)
            
            # Add limit
            expenses_ref = expenses_ref.limit(limit)
            
            # Retrieve expenses
            expenses = []
            for doc in expenses_ref.stream():
                expense_data = doc.to_dict()
                expense_data['id'] = doc.id
                expenses.append(expense_data)
                
            return expenses
        except Exception as e:
            print(f"Error getting expenses: {e}")
            return []
    
    def get_expense_summary(self, user_id, period='month'):
        """
        Get a summary of the user's expenses for a given period
        
        Args:
            user_id (str): Firebase user ID
            period (str, optional): Period to summarize ('day', 'week', 'month', 'year')
            
        Returns:
            dict: Summary of expenses by category
        """
        try:
            # Set start date based on period
            today = datetime.now()
            
            if period == 'day':
                start_date = datetime(today.year, today.month, today.day, 0, 0, 0)
            elif period == 'week':
                # Start of the week (Monday)
                days_since_monday = today.weekday()
                start_date = datetime(today.year, today.month, today.day, 0, 0, 0) - timedelta(days=days_since_monday)
            elif period == 'month':
                start_date = datetime(today.year, today.month, 1, 0, 0, 0)
            elif period == 'year':
                start_date = datetime(today.year, 1, 1, 0, 0, 0)
            else:
                start_date = datetime(today.year, today.month, 1, 0, 0, 0)  # Default to month
            
            # Query expenses since start date
            expenses_ref = (
                self.db.collection('users')
                .document(user_id)
                .collection('expenses')
                .where('created_at', '>=', start_date)
                .stream()
            )
            
            # Group expenses by category
            summary = {}
            for doc in expenses_ref:
                expense = doc.to_dict()
                category = expense.get('category', 'Other')
                amount = expense.get('amount', 0)
                
                if category not in summary:
                    summary[category] = 0
                
                summary[category] += amount
            
            return summary
        except Exception as e:
            print(f"Error getting expense summary: {e}")
            return {}
