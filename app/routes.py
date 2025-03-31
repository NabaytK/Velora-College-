from flask import request, jsonify
from utils.validators import validate_user_data, validate_insights_request
import firebase_admin
from firebase_admin import auth
import json
import traceback

def register_routes(app, encryption_service, firebase_service, openai_service):
    """
    Register all API routes for the application
    """

    @app.route('/api/users/register', methods=['POST'])
    def register_user():
        """
        Register a new user with encrypted sensitive data
        """
        try:
            # Get request data
            data = request.json
            
            # Validate the data
            validation_errors = validate_user_data(data)
            if validation_errors:
                return jsonify({"error": "Validation Error", "details": validation_errors}), 400
            
            # Create Firebase auth user
            user = auth.create_user(
                email=data['email'],
                password=data['password'],
                display_name=f"{data['firstName']} {data['lastName']}"
            )
            
            # Encrypt sensitive data
            encrypted_ssn = encryption_service.encrypt(data.get('ssn', ''))
            
            # Create user document in Firestore
            user_data = {
                "uid": user.uid,
                "firstName": data['firstName'],
                "lastName": data['lastName'],
                "email": data['email'],
                "phone": data.get('phone', ''),
                "ssn_encrypted": encrypted_ssn,
                "budget": data.get('budget', 0),
                "savings_goal": data.get('savingsGoal', 0),
                "debt": data.get('debt', 0),
                "created_at": firebase_admin.firestore.SERVER_TIMESTAMP
            }
            
            # Save to Firestore
            firebase_service.create_user(user.uid, user_data)
            
            return jsonify({
                "message": "User registered successfully",
                "uid": user.uid
            }), 201
            
        except auth.EmailAlreadyExistsError:
            return jsonify({"error": "Email already exists"}), 400
        except Exception as e:
            print(f"Error in register_user: {e}")
            traceback.print_exc()
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/users/profile', methods=['GET'])
    def get_user_profile():
        """
        Get user profile (requires authentication)
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get user data from Firestore
            user_data = firebase_service.get_user(uid)
            if not user_data:
                return jsonify({"error": "User not found"}), 404
                
            # Remove sensitive data from response
            if 'ssn_encrypted' in user_data:
                del user_data['ssn_encrypted']
                
            return jsonify(user_data), 200
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in get_user_profile: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/users/profile', methods=['PATCH'])
    def update_user_profile():
        """
        Update user profile (requires authentication)
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get update data
            data = request.json
            
            # Don't allow email updates (Firebase Auth handles this separately)
            if 'email' in data:
                del data['email']
                
            # If SSN is included, encrypt it
            if 'ssn' in data:
                data['ssn_encrypted'] = encryption_service.encrypt(data['ssn'])
                del data['ssn']
                
            # Update in Firestore
            firebase_service.update_user(uid, data)
            
            return jsonify({"message": "Profile updated successfully"}), 200
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in update_user_profile: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/insights', methods=['POST'])
    def get_ai_insights():
        """
        Get AI-powered financial insights from OpenAI
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get request data
            data = request.json
            
            # Validate the request
            validation_errors = validate_insights_request(data)
            if validation_errors:
                return jsonify({"error": "Validation Error", "details": validation_errors}), 400
            
            # Call OpenAI service to get insights
            budget = data.get('budget', 0)
            spent = data.get('spent', 0)
            goal = data.get('goal', 0)
            debt = data.get('debt', 0)
            topic = data.get('topic', 'budgeting')
            
            ai_response = openai_service.get_financial_insights(
                budget=budget,
                spent=spent,
                goal=goal,
                debt=debt,
                topic=topic
            )
            
            # Save the AI response to Firestore
            ai_tip_data = {
                "response": ai_response,
                "request_data": data,
                "created_at": firebase_admin.firestore.SERVER_TIMESTAMP
            }
            
            firebase_service.save_ai_tip(uid, ai_tip_data)
            
            return jsonify({
                "insights": ai_response,
                "timestamp": firebase_admin.firestore.SERVER_TIMESTAMP
            }), 200
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in get_ai_insights: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/insights/history', methods=['GET'])
    def get_insights_history():
        """
        Get history of AI insights for the user
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get limit from query params
            limit = request.args.get('limit', default=10, type=int)
            
            # Get insights history from Firestore
            history = firebase_service.get_ai_tips_history(uid, limit)
            
            return jsonify({"history": history}), 200
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in get_insights_history: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/expenses', methods=['POST'])
    def add_expense():
        """
        Add a new expense
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get expense data
            data = request.json
            
            # Validate expense data (should be expanded)
            if 'amount' not in data or 'category' not in data:
                return jsonify({"error": "Amount and category are required"}), 400
                
            # Add timestamp
            data['created_at'] = firebase_admin.firestore.SERVER_TIMESTAMP
            
            # Save to Firestore
            expense_id = firebase_service.add_expense(uid, data)
            
            return jsonify({
                "message": "Expense added successfully",
                "expense_id": expense_id
            }), 201
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in add_expense: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500

    @app.route('/api/expenses', methods=['GET'])
    def get_expenses():
        """
        Get user expenses with filtering options
        """
        try:
            # Verify the Firebase ID token
            id_token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not id_token:
                return jsonify({"error": "No authorization token provided"}), 401
                
            # Verify token and get user ID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            
            # Get query parameters
            limit = request.args.get('limit', default=20, type=int)
            category = request.args.get('category', default=None, type=str)
            start_date = request.args.get('start_date', default=None, type=str)
            end_date = request.args.get('end_date', default=None, type=str)
            
            # Get expenses from Firestore
            expenses = firebase_service.get_expenses(
                uid, 
                limit=limit,
                category=category,
                start_date=start_date,
                end_date=end_date
            )
            
            return jsonify({"expenses": expenses}), 200
            
        except auth.InvalidIdTokenError:
            return jsonify({"error": "Invalid or expired token"}), 401
        except Exception as e:
            print(f"Error in get_expenses: {e}")
            return jsonify({"error": "Server error", "message": str(e)}), 500
