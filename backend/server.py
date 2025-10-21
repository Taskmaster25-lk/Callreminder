from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import bcrypt
import jwt
from bson import ObjectId
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    referral_code: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    id_token: str
    email: EmailStr
    name: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    plan_type: str
    plan_expiry: Optional[datetime]
    reminder_count: int

class ReminderCreate(BaseModel):
    name_to_call: str
    phone_number: str
    description: Optional[str] = ""
    date_time: datetime

class ReminderUpdate(BaseModel):
    name_to_call: Optional[str]
    phone_number: Optional[str]
    description: Optional[str]
    date_time: Optional[datetime]
    status: Optional[str]

class ReminderResponse(BaseModel):
    id: str
    user_id: str
    name_to_call: str
    phone_number: str
    description: str
    date_time: datetime
    status: str
    created_at: datetime

class PaymentVerify(BaseModel):
    order_id: str
    payment_id: str
    signature: str
    plan_type: str  # "monthly" or "quarterly"

class PaymentOrder(BaseModel):
    amount: int
    plan_type: str

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def generate_referral_code() -> str:
    \"\"\"Generate a unique 8-character referral code\"\"\"
    import random
    import string
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

async def check_and_reward_referrer(referrer_id: str):
    \"\"\"Check if referrer has 5 referrals and reward them with premium\"\"\"
    referral_count = await db.users.count_documents({'referred_by': referrer_id})
    
    if referral_count >= 5:
        # Check if already rewarded
        referrer = await db.users.find_one({'_id': ObjectId(referrer_id)})
        if referrer and referrer.get('referral_reward_given') != True:
            # Give 15 days of premium
            expiry_date = datetime.utcnow() + timedelta(days=15)
            await db.users.update_one(
                {'_id': ObjectId(referrer_id)},
                {'$set': {
                    'plan_type': 'premium',
                    'plan_expiry': expiry_date,
                    'referral_reward_given': True
                }}
            )
            return True
    return False

async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = authorization.replace('Bearer ', '')
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        
        user = await db.users.find_one({'_id': ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/register")
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({'email': user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_doc = {
        'name': user_data.name,
        'email': user_data.email,
        'password_hash': hash_password(user_data.password),
        'plan_type': 'free',
        'plan_expiry': None,
        'reminder_count': 0,
        'created_at': datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    token = create_token(user_id)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'name': user_data.name,
            'email': user_data.email,
            'plan_type': 'free',
            'reminder_count': 0
        }
    }

@api_router.post("/auth/login")
async def login(user_data: UserLogin):
    user = await db.users.find_one({'email': user_data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user['_id'])
    token = create_token(user_id)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'name': user['name'],
            'email': user['email'],
            'plan_type': user.get('plan_type', 'free'),
            'plan_expiry': user.get('plan_expiry'),
            'reminder_count': user.get('reminder_count', 0)
        }
    }

@api_router.post("/auth/google")
async def google_auth(auth_data: GoogleAuthRequest):
    # Check if user exists
    user = await db.users.find_one({'email': auth_data.email})
    
    if user:
        user_id = str(user['_id'])
    else:
        # Create new user
        user_doc = {
            'name': auth_data.name,
            'email': auth_data.email,
            'password_hash': '',  # No password for Google auth
            'plan_type': 'free',
            'plan_expiry': None,
            'reminder_count': 0,
            'auth_provider': 'google',
            'created_at': datetime.utcnow()
        }
        result = await db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        user = user_doc
    
    token = create_token(user_id)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'name': user['name'],
            'email': user['email'],
            'plan_type': user.get('plan_type', 'free'),
            'plan_expiry': user.get('plan_expiry'),
            'reminder_count': user.get('reminder_count', 0)
        }
    }

# ==================== REMINDER ENDPOINTS ====================

@api_router.post("/reminders/create")
async def create_reminder(reminder_data: ReminderCreate, current_user = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    
    # Check subscription limits
    plan_type = current_user.get('plan_type', 'free')
    reminder_count = current_user.get('reminder_count', 0)
    
    if plan_type == 'free' and reminder_count >= 5:
        raise HTTPException(status_code=403, detail="Free plan limit reached. Upgrade to premium for unlimited reminders.")
    
    # Check if premium plan expired
    if plan_type == 'premium':
        plan_expiry = current_user.get('plan_expiry')
        if plan_expiry and plan_expiry < datetime.utcnow():
            # Downgrade to free
            await db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'plan_type': 'free'}}
            )
            raise HTTPException(status_code=403, detail="Premium plan expired. Please renew to create more reminders.")
    
    # Create reminder
    reminder_doc = {
        'user_id': user_id,
        'name_to_call': reminder_data.name_to_call,
        'phone_number': reminder_data.phone_number,
        'description': reminder_data.description or '',
        'date_time': reminder_data.date_time,
        'status': 'active',
        'created_at': datetime.utcnow()
    }
    
    result = await db.reminders.insert_one(reminder_doc)
    
    # Increment reminder count
    await db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$inc': {'reminder_count': 1}}
    )
    
    return {
        'id': str(result.inserted_id),
        'user_id': user_id,
        'name_to_call': reminder_doc['name_to_call'],
        'phone_number': reminder_doc['phone_number'],
        'description': reminder_doc['description'],
        'date_time': reminder_doc['date_time'].isoformat(),
        'status': reminder_doc['status'],
        'created_at': reminder_doc['created_at'].isoformat()
    }

@api_router.get("/reminders/list")
async def get_reminders(current_user = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    
    reminders = await db.reminders.find({
        'user_id': user_id,
        'status': {'$in': ['active', 'triggered']}
    }).sort('date_time', 1).to_list(100)
    
    return [{
        'id': str(r['_id']),
        'user_id': r['user_id'],
        'name_to_call': r['name_to_call'],
        'phone_number': r['phone_number'],
        'description': r.get('description', ''),
        'date_time': r['date_time'].isoformat(),
        'status': r['status'],
        'created_at': r['created_at'].isoformat()
    } for r in reminders]

@api_router.delete("/reminders/{reminder_id}")
async def delete_reminder(reminder_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    
    reminder = await db.reminders.find_one({'_id': ObjectId(reminder_id), 'user_id': user_id})
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    
    await db.reminders.update_one(
        {'_id': ObjectId(reminder_id)},
        {'$set': {'status': 'deleted'}}
    )
    
    # Decrement reminder count
    await db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$inc': {'reminder_count': -1}}
    )
    
    return {'message': 'Reminder deleted successfully'}

@api_router.get("/reminders/check")
async def check_reminders(current_user = Depends(get_current_user)):
    """Check for reminders that should trigger now"""
    user_id = str(current_user['_id'])
    current_time = datetime.utcnow()
    
    # Find reminders within next minute
    reminders = await db.reminders.find({
        'user_id': user_id,
        'status': 'active',
        'date_time': {
            '$gte': current_time,
            '$lte': current_time + timedelta(minutes=1)
        }
    }).to_list(10)
    
    return [{
        'id': str(r['_id']),
        'name_to_call': r['name_to_call'],
        'phone_number': r['phone_number'],
        'description': r.get('description', ''),
        'date_time': r['date_time'].isoformat()
    } for r in reminders]

@api_router.post("/reminders/{reminder_id}/complete")
async def complete_reminder(reminder_id: str, current_user = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    
    await db.reminders.update_one(
        {'_id': ObjectId(reminder_id), 'user_id': user_id},
        {'$set': {'status': 'completed'}}
    )
    
    return {'message': 'Reminder completed'}

# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payments/create-order")
async def create_payment_order(order_data: PaymentOrder, current_user = Depends(get_current_user)):
    # For now, return mock Razorpay order (user will add real keys later)
    order_id = f"order_{uuid.uuid4().hex[:12]}"
    
    return {
        'order_id': order_id,
        'amount': order_data.amount,
        'currency': 'INR',
        'key': 'rzp_test_PLACEHOLDER'  # User will replace with real key
    }

@api_router.post("/payments/verify-payment")
async def verify_payment(payment_data: PaymentVerify, current_user = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    
    # For now, mock verification (user will add real verification later)
    # In production, verify signature with Razorpay
    
    # Calculate plan expiry
    if payment_data.plan_type == 'monthly':
        expiry = datetime.utcnow() + timedelta(days=30)
    else:  # quarterly
        expiry = datetime.utcnow() + timedelta(days=90)
    
    # Update user plan
    await db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': {
            'plan_type': 'premium',
            'plan_expiry': expiry
        }}
    )
    
    # Store payment record
    await db.payments.insert_one({
        'user_id': user_id,
        'order_id': payment_data.order_id,
        'payment_id': payment_data.payment_id,
        'signature': payment_data.signature,
        'plan_type': payment_data.plan_type,
        'expiry_date': expiry,
        'created_at': datetime.utcnow()
    })
    
    return {
        'message': 'Payment verified successfully',
        'plan_type': 'premium',
        'plan_expiry': expiry.isoformat()
    }

# ==================== USER ENDPOINTS ====================

@api_router.get("/user/plan-status")
async def get_plan_status(current_user = Depends(get_current_user)):
    return {
        'plan_type': current_user.get('plan_type', 'free'),
        'plan_expiry': current_user.get('plan_expiry'),
        'reminder_count': current_user.get('reminder_count', 0)
    }

@api_router.get("/user/profile")
async def get_profile(current_user = Depends(get_current_user)):
    return {
        'id': str(current_user['_id']),
        'name': current_user['name'],
        'email': current_user['email'],
        'plan_type': current_user.get('plan_type', 'free'),
        'plan_expiry': current_user.get('plan_expiry'),
        'reminder_count': current_user.get('reminder_count', 0)
    }

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "CallMeBack API is running"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
