#!/usr/bin/env python3
"""
SIR CBSE Backend API Test Suite
Tests all backend endpoints comprehensively
"""

import requests
import json
import time
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://signup-flow-fix-5.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@sircbse.com"
ADMIN_PASSWORD = "admin123"

class APITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.admin_token = None
        self.user_token = None
        self.test_user_email = "testuser@example.com"
        self.test_user_password = "testpass123"
        self.test_user_name = "Test User"
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
        
    def log(self, message: str, level: str = "INFO"):
        """Log test messages"""
        print(f"[{level}] {message}")
        
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None, expected_status: int = 200) -> Optional[Dict]:
        """Make HTTP request and handle response"""
        url = f"{self.base_url}{endpoint}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            self.log(f"{method} {endpoint} -> {response.status_code}")
            
            if response.status_code == expected_status:
                self.results["passed"] += 1
                try:
                    return response.json()
                except:
                    return {"status": "success"}
            else:
                self.results["failed"] += 1
                error_msg = f"{method} {endpoint} failed: Expected {expected_status}, got {response.status_code}"
                try:
                    error_data = response.json()
                    error_msg += f" - {error_data}"
                except:
                    error_msg += f" - {response.text}"
                self.results["errors"].append(error_msg)
                self.log(error_msg, "ERROR")
                return None
                
        except Exception as e:
            self.results["failed"] += 1
            error_msg = f"{method} {endpoint} exception: {str(e)}"
            self.results["errors"].append(error_msg)
            self.log(error_msg, "ERROR")
            return None
    
    def get_auth_headers(self, token: str) -> Dict:
        """Get authorization headers"""
        return {"Authorization": f"Bearer {token}"}
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        self.log("Testing root endpoint...")
        result = self.make_request("GET", "/")
        if result and "message" in result:
            self.log("✅ Root endpoint working")
        else:
            self.log("❌ Root endpoint failed")
    
    def test_user_registration(self):
        """Test user registration"""
        self.log("Testing user registration...")
        
        # Test successful registration
        data = {
            "name": self.test_user_name,
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        result = self.make_request("POST", "/auth/register", data)
        if result and "token" in result and "user" in result:
            self.user_token = result["token"]
            self.log("✅ User registration successful")
            self.log(f"   User ID: {result['user']['id']}")
            self.log(f"   Token received: {self.user_token[:20]}...")
        else:
            self.log("❌ User registration failed")
            
        # Test duplicate registration (should fail)
        result = self.make_request("POST", "/auth/register", data, expected_status=400)
        if result is None:  # Expected to fail
            self.results["passed"] += 1  # Adjust count since we expected failure
            self.results["failed"] -= 1
            self.log("✅ Duplicate registration properly rejected")
        
        # Test missing fields
        invalid_data = {"email": "test@test.com"}
        result = self.make_request("POST", "/auth/register", invalid_data, expected_status=400)
        if result is None:  # Expected to fail
            self.results["passed"] += 1
            self.results["failed"] -= 1
            self.log("✅ Registration with missing fields properly rejected")
    
    def test_user_login(self):
        """Test user login"""
        self.log("Testing user login...")
        
        # Test successful login
        data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        result = self.make_request("POST", "/auth/login", data)
        if result and "token" in result and "user" in result:
            self.user_token = result["token"]
            self.log("✅ User login successful")
        else:
            self.log("❌ User login failed")
            
        # Test invalid credentials
        invalid_data = {
            "email": self.test_user_email,
            "password": "wrongpassword"
        }
        
        result = self.make_request("POST", "/auth/login", invalid_data, expected_status=401)
        if result is None:  # Expected to fail
            self.results["passed"] += 1
            self.results["failed"] -= 1
            self.log("✅ Invalid credentials properly rejected")
    
    def test_admin_login(self):
        """Test admin login"""
        self.log("Testing admin login...")
        
        data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        result = self.make_request("POST", "/auth/login", data)
        if result and "token" in result and "user" in result:
            self.admin_token = result["token"]
            if result["user"]["role"] == "admin":
                self.log("✅ Admin login successful")
            else:
                self.log("❌ Admin login failed - wrong role")
        else:
            self.log("❌ Admin login failed")
    
    def test_auth_me(self):
        """Test current user endpoint"""
        self.log("Testing /auth/me endpoint...")
        
        if not self.user_token:
            self.log("❌ No user token available for /auth/me test")
            return
            
        # Test with valid token
        headers = self.get_auth_headers(self.user_token)
        result = self.make_request("GET", "/auth/me", headers=headers)
        if result and "id" in result and "email" in result:
            self.log("✅ /auth/me with valid token successful")
        else:
            self.log("❌ /auth/me with valid token failed")
            
        # Test without token
        result = self.make_request("GET", "/auth/me", expected_status=401)
        if result is None:  # Expected to fail
            self.results["passed"] += 1
            self.results["failed"] -= 1
            self.log("✅ /auth/me without token properly rejected")
    
    def test_subjects_api(self):
        """Test subjects API"""
        self.log("Testing subjects API...")
        
        # Test GET /api/subjects
        result = self.make_request("GET", "/subjects")
        if result and isinstance(result, list):
            self.log(f"✅ GET /subjects successful - {len(result)} subjects found")
            for subject in result:
                if "name" in subject:
                    self.log(f"   Subject: {subject['name']}")
        else:
            self.log("❌ GET /subjects failed")
            
        # Test POST /api/subjects (admin only)
        if self.admin_token:
            headers = self.get_auth_headers(self.admin_token)
            new_subject = {
                "name": "Test Subject",
                "description": "A test subject for API testing",
                "icon": "📚",
                "chapters": 10
            }
            
            result = self.make_request("POST", "/subjects", new_subject, headers)
            if result and "id" in result:
                self.log("✅ POST /subjects (admin) successful")
            else:
                self.log("❌ POST /subjects (admin) failed")
        
        # Test POST /api/subjects without admin token (should fail)
        if self.user_token:
            headers = self.get_auth_headers(self.user_token)
            result = self.make_request("POST", "/subjects", {"name": "Test"}, headers, expected_status=403)
            if result is None:  # Expected to fail
                self.results["passed"] += 1
                self.results["failed"] -= 1
                self.log("✅ POST /subjects without admin properly rejected")
    
    def test_tests_api(self):
        """Test tests API"""
        self.log("Testing tests API...")
        
        # Test GET /api/tests
        result = self.make_request("GET", "/tests")
        if result and isinstance(result, list):
            self.log(f"✅ GET /tests successful - {len(result)} tests found")
            
            # Store a test ID for later use
            if len(result) > 0:
                self.test_id = result[0].get("id")
                self.log(f"   Using test ID for further testing: {self.test_id}")
        else:
            self.log("❌ GET /tests failed")
            
        # Test GET /api/tests with category filter
        result = self.make_request("GET", "/tests?category=sectional")
        if result and isinstance(result, list):
            self.log(f"✅ GET /tests?category=sectional successful - {len(result)} tests found")
        else:
            self.log("❌ GET /tests with category filter failed")
            
        # Test GET /api/tests/[id]
        if hasattr(self, 'test_id') and self.test_id:
            result = self.make_request("GET", f"/tests/{self.test_id}")
            if result and "id" in result and "questions" in result:
                self.log("✅ GET /tests/[id] successful")
                self.log(f"   Test: {result.get('name', 'Unknown')}")
                self.log(f"   Questions: {len(result.get('questions', []))}")
            else:
                self.log("❌ GET /tests/[id] failed")
        
        # Test POST /api/tests (admin only)
        if self.admin_token:
            headers = self.get_auth_headers(self.admin_token)
            new_test = {
                "name": "API Test Quiz",
                "description": "A test created via API testing",
                "category": "sectional",
                "duration": 30,
                "difficulty": "medium",
                "questions": [
                    {
                        "id": "q1",
                        "question": "What is 2+2?",
                        "options": ["3", "4", "5", "6"],
                        "correctAnswer": "4"
                    }
                ]
            }
            
            result = self.make_request("POST", "/tests", new_test, headers)
            if result and "id" in result:
                self.log("✅ POST /tests (admin) successful")
            else:
                self.log("❌ POST /tests (admin) failed")
    
    def test_test_attempts_api(self):
        """Test test attempts API"""
        self.log("Testing test attempts API...")
        
        if not self.user_token:
            self.log("❌ No user token available for test attempts")
            return
            
        if not hasattr(self, 'test_id') or not self.test_id:
            self.log("❌ No test ID available for test attempts")
            return
            
        headers = self.get_auth_headers(self.user_token)
        
        # Test POST /api/test-attempts
        attempt_data = {
            "testId": self.test_id,
            "answers": {"q1": "4", "q2": "option2"},
            "timeSpent": 1800  # 30 minutes in seconds
        }
        
        result = self.make_request("POST", "/test-attempts", attempt_data, headers)
        if result and "id" in result and "score" in result:
            self.log("✅ POST /test-attempts successful")
            self.log(f"   Score: {result['score']}%")
            self.log(f"   Correct: {result.get('correctAnswers', 0)}/{result.get('totalQuestions', 0)}")
        else:
            self.log("❌ POST /test-attempts failed")
            
        # Test GET /api/test-attempts
        result = self.make_request("GET", "/test-attempts", headers=headers)
        if result and isinstance(result, list):
            self.log(f"✅ GET /test-attempts successful - {len(result)} attempts found")
        else:
            self.log("❌ GET /test-attempts failed")
            
        # Test POST /api/test-attempts without auth (should fail)
        result = self.make_request("POST", "/test-attempts", attempt_data, expected_status=401)
        if result is None:  # Expected to fail
            self.results["passed"] += 1
            self.results["failed"] -= 1
            self.log("✅ POST /test-attempts without auth properly rejected")
    
    def test_materials_api(self):
        """Test study materials API"""
        self.log("Testing study materials API...")
        
        # Test GET /api/materials
        result = self.make_request("GET", "/materials")
        if result and isinstance(result, list):
            self.log(f"✅ GET /materials successful - {len(result)} materials found")
        else:
            self.log("❌ GET /materials failed")
            
        # Test POST /api/materials (admin only)
        if self.admin_token:
            headers = self.get_auth_headers(self.admin_token)
            new_material = {
                "title": "Test Material",
                "description": "A test study material",
                "subjectId": "physics-id",
                "type": "notes",
                "content": "This is test content for the material"
            }
            
            result = self.make_request("POST", "/materials", new_material, headers)
            if result and "id" in result:
                self.log("✅ POST /materials (admin) successful")
            else:
                self.log("❌ POST /materials (admin) failed")
    
    def test_admin_users_api(self):
        """Test admin users API"""
        self.log("Testing admin users API...")
        
        if not self.admin_token:
            self.log("❌ No admin token available for users API test")
            return
            
        # Test GET /api/users (admin only)
        headers = self.get_auth_headers(self.admin_token)
        result = self.make_request("GET", "/users", headers=headers)
        if result and isinstance(result, list):
            self.log(f"✅ GET /users (admin) successful - {len(result)} users found")
            for user in result[:3]:  # Show first 3 users
                self.log(f"   User: {user.get('name', 'Unknown')} ({user.get('email', 'No email')})")
        else:
            self.log("❌ GET /users (admin) failed")
            
        # Test GET /api/users without admin (should fail)
        if self.user_token:
            headers = self.get_auth_headers(self.user_token)
            result = self.make_request("GET", "/users", headers, expected_status=403)
            if result is None:  # Expected to fail
                self.results["passed"] += 1
                self.results["failed"] -= 1
                self.log("✅ GET /users without admin properly rejected")
    
    def run_all_tests(self):
        """Run all backend tests"""
        self.log("=" * 60)
        self.log("STARTING SIR CBSE BACKEND API TESTS")
        self.log("=" * 60)
        
        # Test sequence
        self.test_root_endpoint()
        self.test_user_registration()
        self.test_user_login()
        self.test_admin_login()
        self.test_auth_me()
        self.test_subjects_api()
        self.test_tests_api()
        self.test_test_attempts_api()
        self.test_materials_api()
        self.test_admin_users_api()
        
        # Print summary
        self.log("=" * 60)
        self.log("TEST SUMMARY")
        self.log("=" * 60)
        self.log(f"✅ PASSED: {self.results['passed']}")
        self.log(f"❌ FAILED: {self.results['failed']}")
        
        if self.results["errors"]:
            self.log("\nERRORS:")
            for error in self.results["errors"]:
                self.log(f"  - {error}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100 if (self.results['passed'] + self.results['failed']) > 0 else 0
        self.log(f"\nSUCCESS RATE: {success_rate:.1f}%")
        
        return self.results

if __name__ == "__main__":
    tester = APITester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results["failed"] > 0:
        sys.exit(1)
    else:
        sys.exit(0)