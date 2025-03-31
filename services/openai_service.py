import os
import openai
import json

class OpenAIService:
    """
    Service for interacting with OpenAI API to generate financial insights
    """
    
    def __init__(self, api_key=None):
        """
        Initialize the OpenAI service with API key
        
        Args:
            api_key (str): OpenAI API key
        """
        self.api_key = api_key or os.environ.get('OPENAI_API_KEY')
        openai.api_key = self.api_key
        
    def get_financial_insights(self, budget, spent, goal, debt, topic):
        """
        Get financial insights from OpenAI based on user's financial data
        
        Args:
            budget (float): User's monthly budget
            spent (float): Amount spent so far
            goal (float): Savings goal
            debt (float): Total debt
            topic (str): Financial topic of interest
            
        Returns:
            dict: Parsed AI response with budget tip, savings tip, explanation, etc.
        """
        try:
            # Create the prompt for OpenAI
            prompt = self._create_financial_prompt(budget, spent, goal, debt, topic)
            
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are Velora, a smart and friendly AI financial coach for college students."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7,
                n=1,
                stop=None
            )
            
            # Extract the response text
            ai_text = response.choices[0].message.content.strip()
            
            # Try to parse the response into structured format
            parsed_response = self._parse_ai_response(ai_text)
            
            return parsed_response
            
        except Exception as e:
            print(f"Error in get_financial_insights: {e}")
            # In case of error, return a default response
            return {
                "error": str(e),
                "budget_tip": "We're having trouble generating personalized advice right now. Try again later.",
                "savings_tip": "Consider setting aside a small amount each week for emergencies.",
                "explanation": f"We couldn't provide a specific explanation for '{topic}' at this time.",
                "scholarship_suggestion": None,
                "earn_extra_suggestion": None,
                "raw_response": None
            }
    
    def _create_financial_prompt(self, budget, spent, goal, debt, topic):
        """
        Create a prompt for OpenAI based on the user's financial data
        
        Args:
            budget (float): User's monthly budget
            spent (float): Amount spent so far
            goal (float): Savings goal
            debt (float): Total debt
            topic (str): Financial topic of interest
            
        Returns:
            str: Formatted prompt for OpenAI
        """
        return f"""
You are Velora, a smart and friendly AI financial coach for college students.

The student has:
- Monthly Budget: ${budget}
- Spent this month: ${spent}
- Savings Goal: ${goal}
- Debt Level: ${debt} (loans or credit card)
- Interest Topic: {topic}

Give them:
1. A simple budgeting tip for this week.
2. A small way to save (realistic).
3. A short explanation of {topic} (1–2 sentences).
4. One scholarship they should look into based on need.
5. One way to earn a little extra money this week (e.g., online tutoring, surveys, reselling books).

Format your response in this structure to make it easier to parse:
BUDGET_TIP: [Your budget tip here]
SAVINGS_TIP: [Your savings tip here]
EXPLANATION: [Your explanation here]
SCHOLARSHIP: [Your scholarship suggestion here]
EARN_EXTRA: [Your extra earning suggestion here]

Be casual, supportive, and practical. Avoid pressure. Use clear, student-friendly language.
"""
    
    def _parse_ai_response(self, ai_text):
        """
        Parse the AI response text into structured format
        
        Args:
            ai_text (str): The raw AI response text
            
        Returns:
            dict: Structured response with key sections
        """
        try:
            # Initialize with default values
            parsed = {
                "budget_tip": None,
                "savings_tip": None,
                "explanation": None,
                "scholarship_suggestion": None,
                "earn_extra_suggestion": None,
                "raw_response": ai_text
            }
            
            # Extract sections using the formatted markers
            if "BUDGET_TIP:" in ai_text:
                budget_split = ai_text.split("BUDGET_TIP:")[1].split("\n")[0].strip()
                parsed["budget_tip"] = budget_split
                
            if "SAVINGS_TIP:" in ai_text:
                savings_split = ai_text.split("SAVINGS_TIP:")[1].split("\n")[0].strip()
                parsed["savings_tip"] = savings_split
                
            if "EXPLANATION:" in ai_text:
                explanation_split = ai_text.split("EXPLANATION:")[1].split("\n")[0].strip()
                parsed["explanation"] = explanation_split
                
            if "SCHOLARSHIP:" in ai_text:
                scholarship_split = ai_text.split("SCHOLARSHIP:")[1].split("\n")[0].strip()
                parsed["scholarship_suggestion"] = scholarship_split
                
            if "EARN_EXTRA:" in ai_text:
                earn_split = ai_text.split("EARN_EXTRA:")[1].split("\n")[0].strip()
                parsed["earn_extra_suggestion"] = earn_split
            
            # If parsing fails, initialize with default values and include raw text
            if all(value is None for key, value in parsed.items() if key != "raw_response"):
                lines = ai_text.strip().split("\n")
                
                # Simple heuristic to handle unformatted response
                if len(lines) >= 5:
                    parsed["budget_tip"] = lines[0]
                    parsed["savings_tip"] = lines[1]
                    parsed["explanation"] = lines[2]
                    parsed["scholarship_suggestion"] = lines[3]
                    parsed["earn_extra_suggestion"] = lines[4]
                
            return parsed
            
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return {
                "error": str(e),
                "budget_tip": "Try to stay within your budget by tracking expenses.",
                "savings_tip": "Save small amounts consistently.",
                "explanation": "We couldn't parse the explanation.",
                "scholarship_suggestion": "Check with your university's financial aid office.",
                "earn_extra_suggestion": "Consider online tutoring or campus jobs.",
                "raw_response": ai_text
            }
