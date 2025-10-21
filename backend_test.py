#!/usr/bin/env python3
"""
CallMeBack Backend API Test Suite
Tests all backend endpoints as specified in the review request
"""

import requests
import json
from datetime import datetime, timedelta
import uuid
import sys
import os

# Backend URL from frontend .env
BACKEND_URL = "https://reminders-app.preview.emergentagent.com/api"

class CallMeBackAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.auth_token = None
        self.user_data = {
            "name": "Test User",
            "email": "test@example.com", 
            "password": "test123"
        }
        self.reminder_id = None
        self.order_id = None
        
    def log_test(self, test_name, success, details=""):
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        if not success:
            print(f"   This is a CRITICAL issue that needs attention")
        print()

    def test_health_check(self):
        """Test 1: Health Check - GET /api/health"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Check", True, f"Status: {data['status']}")
                    return True
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Health Check", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False

    def test_user_registration(self):
        """Test 2: User Registration - POST /api/auth/register"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/register",
                json=self.user_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    self.log_test("User Registration", True, f"User ID: {data['user']['id']}")
                    return True
                else:
                    self.log_test("User Registration", False, f"Missing token or user in response: {data}")
                    return False
            elif response.status_code == 400:
                # User might already exist, try to continue with login
                self.log_test("User Registration", True, "User already exists (expected)")
                return True
            else:
                self.log_test("User Registration", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
            return False

    def test_user_login(self):
        """Test 3: User Login - POST /api/auth/login"""
        try:
            login_data = {
                "email": self.user_data["email"],
                "password": self.user_data["password"]
            }
            
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    self.log_test("User Login", True, f"Token received, User: {data['user']['name']}")
                    return True
                else:
                    self.log_test("User Login", False, f"Missing token or user in response: {data}")
                    return False
            else:
                self.log_test("User Login", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")
            return False

    def test_create_reminder(self):
        """Test 4: Create Reminder - POST /api/reminders/create"""
        if not self.auth_token:
            self.log_test("Create Reminder", False, "No auth token available")
            return False
            
        try:
            # Set reminder for 1 hour from now
            reminder_time = datetime.utcnow() + timedelta(hours=1)
            
            reminder_data = {
                "name_to_call": "John Doe",
                "phone_number": "+1234567890",
                "description": "Discuss project",
                "date_time": reminder_time.isoformat()
            }
            
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.post(
                f"{self.base_url}/reminders/create",
                json=reminder_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.reminder_id = data["id"]
                    self.log_test("Create Reminder", True, f"Reminder ID: {data['id']}")
                    return True
                else:
                    self.log_test("Create Reminder", False, f"Missing ID in response: {data}")
                    return False
            else:
                self.log_test("Create Reminder", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Reminder", False, f"Exception: {str(e)}")
            return False

    def test_list_reminders(self):
        """Test 5: List Reminders - GET /api/reminders/list"""
        if not self.auth_token:
            self.log_test("List Reminders", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.get(
                f"{self.base_url}/reminders/list",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("List Reminders", True, f"Found {len(data)} reminders")
                    return True
                else:
                    self.log_test("List Reminders", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("List Reminders", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("List Reminders", False, f"Exception: {str(e)}")
            return False

    def test_get_plan_status(self):
        """Test 6: Get Plan Status - GET /api/user/plan-status"""
        if not self.auth_token:
            self.log_test("Get Plan Status", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.get(
                f"{self.base_url}/user/plan-status",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "plan_type" in data:
                    self.log_test("Get Plan Status", True, f"Plan: {data['plan_type']}, Reminders: {data.get('reminder_count', 0)}")
                    return True
                else:
                    self.log_test("Get Plan Status", False, f"Missing plan_type in response: {data}")
                    return False
            else:
                self.log_test("Get Plan Status", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Plan Status", False, f"Exception: {str(e)}")
            return False

    def test_get_user_profile(self):
        """Test 7: Get User Profile - GET /api/user/profile"""
        if not self.auth_token:
            self.log_test("Get User Profile", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.get(
                f"{self.base_url}/user/profile",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "name" in data and "email" in data:
                    self.log_test("Get User Profile", True, f"User: {data['name']} ({data['email']})")
                    return True
                else:
                    self.log_test("Get User Profile", False, f"Missing required fields in response: {data}")
                    return False
            else:
                self.log_test("Get User Profile", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get User Profile", False, f"Exception: {str(e)}")
            return False

    def test_check_reminders(self):
        """Test 8: Check Reminders - GET /api/reminders/check"""
        if not self.auth_token:
            self.log_test("Check Reminders", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.get(
                f"{self.base_url}/reminders/check",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_test("Check Reminders", True, f"Found {len(data)} upcoming reminders")
                    return True
                else:
                    self.log_test("Check Reminders", False, f"Expected list, got: {type(data)}")
                    return False
            else:
                self.log_test("Check Reminders", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Check Reminders", False, f"Exception: {str(e)}")
            return False

    def test_create_payment_order(self):
        """Test 9: Create Payment Order - POST /api/payments/create-order"""
        if not self.auth_token:
            self.log_test("Create Payment Order", False, "No auth token available")
            return False
            
        try:
            order_data = {
                "amount": 7900,  # ₹79 in paise
                "plan_type": "monthly"
            }
            
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.post(
                f"{self.base_url}/payments/create-order",
                json=order_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "order_id" in data:
                    self.order_id = data["order_id"]
                    self.log_test("Create Payment Order", True, f"Order ID: {data['order_id']}, Amount: ₹{data['amount']/100}")
                    return True
                else:
                    self.log_test("Create Payment Order", False, f"Missing order_id in response: {data}")
                    return False
            else:
                self.log_test("Create Payment Order", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Create Payment Order", False, f"Exception: {str(e)}")
            return False

    def test_verify_payment(self):
        """Test 10: Verify Payment - POST /api/payments/verify-payment"""
        if not self.auth_token:
            self.log_test("Verify Payment", False, "No auth token available")
            return False
            
        if not self.order_id:
            self.log_test("Verify Payment", False, "No order_id available from previous test")
            return False
            
        try:
            # Mock payment verification data
            payment_data = {
                "order_id": self.order_id,
                "payment_id": f"pay_{uuid.uuid4().hex[:12]}",
                "signature": f"sig_{uuid.uuid4().hex[:16]}",
                "plan_type": "monthly"
            }
            
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.post(
                f"{self.base_url}/payments/verify-payment",
                json=payment_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "plan_type" in data:
                    self.log_test("Verify Payment", True, f"Payment verified, Plan: {data['plan_type']}")
                    return True
                else:
                    self.log_test("Verify Payment", False, f"Missing required fields in response: {data}")
                    return False
            else:
                self.log_test("Verify Payment", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Verify Payment", False, f"Exception: {str(e)}")
            return False

    def test_verify_premium_status(self):
        """Test 11: Verify Premium Status - GET /api/user/plan-status (should show premium now)"""
        if not self.auth_token:
            self.log_test("Verify Premium Status", False, "No auth token available")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.get(
                f"{self.base_url}/user/plan-status",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "plan_type" in data:
                    if data["plan_type"] == "premium":
                        self.log_test("Verify Premium Status", True, f"Plan upgraded to: {data['plan_type']}")
                        return True
                    else:
                        self.log_test("Verify Premium Status", False, f"Expected premium plan, got: {data['plan_type']}")
                        return False
                else:
                    self.log_test("Verify Premium Status", False, f"Missing plan_type in response: {data}")
                    return False
            else:
                self.log_test("Verify Premium Status", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Verify Premium Status", False, f"Exception: {str(e)}")
            return False

    def test_delete_reminder(self):
        """Test 12: Delete Reminder - DELETE /api/reminders/{id}"""
        if not self.auth_token:
            self.log_test("Delete Reminder", False, "No auth token available")
            return False
            
        if not self.reminder_id:
            self.log_test("Delete Reminder", False, "No reminder_id available from previous test")
            return False
            
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            
            response = requests.delete(
                f"{self.base_url}/reminders/{self.reminder_id}",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_test("Delete Reminder", True, f"Message: {data['message']}")
                    return True
                else:
                    self.log_test("Delete Reminder", False, f"Missing message in response: {data}")
                    return False
            else:
                self.log_test("Delete Reminder", False, f"Status code: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Delete Reminder", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend API tests in sequence"""
        print("=" * 60)
        print("CallMeBack Backend API Test Suite")
        print("=" * 60)
        print(f"Testing backend at: {self.base_url}")
        print()
        
        tests = [
            self.test_health_check,
            self.test_user_registration,
            self.test_user_login,
            self.test_create_reminder,
            self.test_list_reminders,
            self.test_get_plan_status,
            self.test_get_user_profile,
            self.test_check_reminders,
            self.test_create_payment_order,
            self.test_verify_payment,
            self.test_verify_premium_status,
            self.test_delete_reminder
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__} - Unexpected error: {str(e)}")
                failed += 1
        
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Total: {passed + failed}")
        
        if failed > 0:
            print(f"\n⚠️  {failed} critical issues found that need attention!")
            return False
        else:
            print(f"\n🎉 All tests passed! Backend API is working correctly.")
            return True

if __name__ == "__main__":
    tester = CallMeBackAPITester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)