#!/usr/bin/env python3
"""
Test free user reminder limit (5 reminders max)
"""

import requests
import json
from datetime import datetime, timedelta
import uuid

BACKEND_URL = "https://reminders-app.preview.emergentagent.com/api"

def test_free_user_limit():
    # Create a new user for this test
    user_data = {
        "name": "Free User Test",
        "email": f"freeuser{uuid.uuid4().hex[:8]}@example.com",
        "password": "test123"
    }
    
    # Register user
    response = requests.post(f"{BACKEND_URL}/auth/register", json=user_data)
    if response.status_code != 200:
        print(f"❌ Registration failed: {response.text}")
        return False
    
    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print(f"✅ Created free user: {user_data['email']}")
    
    # Create 5 reminders (should all succeed)
    reminder_ids = []
    for i in range(5):
        reminder_data = {
            "name_to_call": f"Contact {i+1}",
            "phone_number": f"+123456789{i}",
            "description": f"Test reminder {i+1}",
            "date_time": (datetime.utcnow() + timedelta(hours=i+1)).isoformat()
        }
        
        response = requests.post(f"{BACKEND_URL}/reminders/create", json=reminder_data, headers=headers)
        if response.status_code == 200:
            reminder_ids.append(response.json()["id"])
            print(f"✅ Created reminder {i+1}/5")
        else:
            print(f"❌ Failed to create reminder {i+1}: {response.text}")
            return False
    
    # Try to create 6th reminder (should fail)
    reminder_data = {
        "name_to_call": "Contact 6",
        "phone_number": "+1234567896",
        "description": "This should fail",
        "date_time": (datetime.utcnow() + timedelta(hours=6)).isoformat()
    }
    
    response = requests.post(f"{BACKEND_URL}/reminders/create", json=reminder_data, headers=headers)
    if response.status_code == 403:
        print("✅ 6th reminder correctly rejected (free plan limit)")
        return True
    else:
        print(f"❌ 6th reminder should have been rejected but got: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    print("Testing free user reminder limit...")
    success = test_free_user_limit()
    if success:
        print("🎉 Free user limit test passed!")
    else:
        print("❌ Free user limit test failed!")