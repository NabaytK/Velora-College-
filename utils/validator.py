import re

def validate_user_data(data):
    """
    Validate user registration data
    
    Args:
        data (dict): User data to validate
        
    Returns:
        dict: Validation errors (empty if no errors)
    """
    errors = {}
    
    # Required fields
    required_fields = ['firstName', 'lastName', 'email', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f"{field} is required"
    
    # Email validation
    if 'email' in data and data['email']:
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            errors['email'] = "Invalid email format"
    
    # Password validation (at least 8 characters)
    if 'password' in data and data['password']:
        if len(data['password']) < 8:
            errors['password'] = "Password must be at least 8 characters long"
    
    # Phone validation (optional field)
    if 'phone' in data and data['phone']:
        # Remove non-digits
        phone_digits = re.sub(r'\D', '', data['phone'])
        if len(phone_digits) != 10:
            errors['phone'] = "Phone number must be 10 digits"
    
    # SSN validation (optional field)
    if 'ssn' in data and data['ssn']:
        # Remove non-digits
        ssn_digits = re.sub(r'\D', '', data['ssn'])
        if len(ssn_digits) != 9:
            errors['ssn'] = "SSN must be 9 digits"
    
    # Budget validation (optional field)
    if 'budget' in data and data['budget']:
        try:
            budget = float(data['budget'])
            if budget < 0:
                errors['budget'] = "Budget cannot be negative"
        except ValueError:
            errors['budget'] = "Budget must be a number"
    
    # Savings goal validation (optional field)
    if 'savingsGoal' in data and data['savingsGoal']:
        try:
            savings_goal = float(data['savingsGoal'])
            if savings_goal < 0:
                errors['savingsGoal'] = "Savings goal cannot be negative"
        except ValueError:
            errors['savingsGoal'] = "Savings goal must be a number"
    
    return errors

def validate_insights_request(data):
    """
    Validate AI insights request data
    
    Args:
        data (dict): Request data to validate
        
    Returns:
        dict: Validation errors (empty if no errors)
    """
    errors = {}
    
    # Budget validation
    if 'budget' in data:
        try:
            budget = float(data['budget'])
            if budget < 0:
                errors['budget'] = "Budget cannot be negative"
        except (ValueError, TypeError):
            errors['budget'] = "Budget must be a number"
    
    # Spent validation
    if 'spent' in data:
        try:
            spent = float(data['spent'])
            if spent < 0:
                errors['spent'] = "Spent amount cannot be negative"
        except (ValueError, TypeError):
            errors['spent'] = "Spent amount must be a number"
    
    # Goal validation
    if 'goal' in data:
        try:
            goal = float(data['goal'])
            if goal < 0:
                errors['goal'] = "Goal amount cannot be negative"
        except (ValueError, TypeError):
            errors['goal'] = "Goal amount must be a number"
    
    # Debt validation
    if 'debt' in data:
        try:
            debt = float(data['debt'])
            if debt < 0:
                errors['debt'] = "Debt amount cannot be negative"
        except (ValueError, TypeError):
            errors['debt'] = "Debt amount must be a number"
    
    # Topic validation (simple length check)
    if 'topic' in data and data['topic']:
        if len(data['topic']) > 100:
            errors['topic'] = "Topic is too long (max 100 characters)"
    
    return errors

def validate_expense_data(data):
    """
    Validate expense data
    
    Args:
        data (dict): Expense data to validate
        
    Returns:
        dict: Validation errors (empty if no errors)
    """
    errors = {}
    
    # Required fields
    required_fields = ['amount', 'category']
    for field in required_fields:
        if field not in data or not data[field]:
            errors[field] = f"{field} is required"
    
    # Amount validation
    if 'amount' in data:
        try:
            amount = float(data['amount'])
            if amount <= 0:
                errors['amount'] = "Amount must be positive"
        except (ValueError, TypeError):
            errors['amount'] = "Amount must be a number"
    
    # Date validation (if provided)
    if 'date' in data and data['date']:
        try:
            # Try to parse the date
            from datetime import datetime
            datetime.fromisoformat(data['date'])
        except ValueError:
            errors['date'] = "Invalid date format. Use ISO format (YYYY-MM-DD)"
    
    return errors
