import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// MongoDB connection with connection pooling
let client
let db
let connectPromise

async function connectToMongo() {
  if (db) {
    return db
  }
  
  if (!connectPromise) {
    connectPromise = (async () => {
      try {
        client = new MongoClient(process.env.MONGO_URL, {
          maxPoolSize: 10,
          minPoolSize: 2,
          maxIdleTimeMS: 30000,
          connectTimeoutMS: 5000,
          serverSelectionTimeoutMS: 5000
        })
        await client.connect()
        db = client.db(process.env.DB_NAME)
        return db
      } catch (error) {
        connectPromise = null
        throw error
      }
    })()
  }
  
  return connectPromise
}

// Simple in-memory cache
const cache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCache(key) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Cache-Control', 'public, max-age=300')
  return response
}

// Verify JWT token
function verifyToken(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Root endpoint
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "SIR CBSE API" }))
    }

    // ============ AUTH ROUTES ============
    
    // Register - POST /api/auth/register
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { name, email, password, role = 'student' } = body

      if (!name || !email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Name, email and password are required" },
          { status: 400 }
        ))
      }

      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ email })
      if (existingUser) {
        return handleCORS(NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        ))
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        subscriptionStatus: 'active'
      }

      await db.collection('users').insertOne(user)

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }))
    }

    // Login - POST /api/auth/login
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        ))
      }

      // Find user
      const user = await db.collection('users').findOne({ email })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        ))
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return handleCORS(NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        ))
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }))
    }

    // Get current user - GET /api/auth/me
    if (route === '/auth/me' && method === 'GET') {
      const userData = verifyToken(request)
      if (!userData) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }

      const user = await db.collection('users').findOne({ id: userData.userId })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        ))
      }

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json(userWithoutPassword))
    }

    // ============ SUBJECTS ROUTES ============
    
    // Get all subjects - GET /api/subjects
    if (route === '/subjects' && method === 'GET') {
      // Check cache first
      const cachedSubjects = getCache('subjects')
      if (cachedSubjects) {
        return handleCORS(NextResponse.json(cachedSubjects))
      }
      
      const subjects = await db.collection('subjects').find({}).toArray()
      const cleanedSubjects = subjects.map(({ _id, ...rest }) => rest)
      
      // Cache the result
      setCache('subjects', cleanedSubjects)
      
      return handleCORS(NextResponse.json(cleanedSubjects))
    }

    // Create subject - POST /api/subjects (Admin only)
    if (route === '/subjects' && method === 'POST') {
      const userData = verifyToken(request)
      if (!userData || userData.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        ))
      }

      const body = await request.json()
      const { name, description, icon, chapters } = body

      const subject = {
        id: uuidv4(),
        name,
        description,
        icon,
        chapters: chapters || 0,
        createdAt: new Date()
      }

      await db.collection('subjects').insertOne(subject)
      const { _id, ...cleanedSubject } = subject
      return handleCORS(NextResponse.json(cleanedSubject))
    }

    // ============ STUDY MATERIALS ROUTES ============
    
    // Get all study materials - GET /api/materials
    if (route === '/materials' && method === 'GET') {
      const url = new URL(request.url)
      const subjectId = url.searchParams.get('subjectId')
      
      const query = subjectId ? { subjectId } : {}
      const materials = await db.collection('study_materials').find(query).toArray()
      const cleanedMaterials = materials.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedMaterials))
    }

    // Create study material - POST /api/materials (Admin only)
    if (route === '/materials' && method === 'POST') {
      const userData = verifyToken(request)
      if (!userData || userData.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        ))
      }

      const body = await request.json()
      const { title, description, subjectId, type, content, fileUrl } = body

      const material = {
        id: uuidv4(),
        title,
        description,
        subjectId,
        type, // 'pdf', 'video', 'notes'
        content,
        fileUrl,
        createdAt: new Date()
      }

      await db.collection('study_materials').insertOne(material)
      const { _id, ...cleanedMaterial } = material
      return handleCORS(NextResponse.json(cleanedMaterial))
    }

    // ============ TESTS ROUTES ============
    
    // Get all tests - GET /api/tests
    if (route === '/tests' && method === 'GET') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      
      const cacheKey = category ? `tests_${category}` : 'tests_all'
      
      // Check cache first
      const cachedTests = getCache(cacheKey)
      if (cachedTests) {
        return handleCORS(NextResponse.json(cachedTests))
      }
      
      const query = category ? { category } : {}
      const tests = await db.collection('tests').find(query).toArray()
      const cleanedTests = tests.map(({ _id, ...rest }) => rest)
      
      // Cache the result
      setCache(cacheKey, cleanedTests)
      
      return handleCORS(NextResponse.json(cleanedTests))
    }

    // Get test by ID - GET /api/tests/[id]
    if (route.startsWith('/tests/') && method === 'GET') {
      const testId = path[1]
      const test = await db.collection('tests').findOne({ id: testId })
      
      if (!test) {
        return handleCORS(NextResponse.json(
          { error: "Test not found" },
          { status: 404 }
        ))
      }

      const { _id, ...cleanedTest } = test
      return handleCORS(NextResponse.json(cleanedTest))
    }

    // Create test - POST /api/tests (Admin only)
    if (route === '/tests' && method === 'POST') {
      const userData = verifyToken(request)
      if (!userData || userData.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        ))
      }

      const body = await request.json()
      const { name, description, category, duration, questions, difficulty } = body

      const test = {
        id: uuidv4(),
        name,
        description,
        category, // 'sectional', 'full-length', 'previous-year'
        duration, // in minutes
        questions,
        difficulty, // 'easy', 'medium', 'hard'
        createdAt: new Date()
      }

      await db.collection('tests').insertOne(test)
      const { _id, ...cleanedTest } = test
      return handleCORS(NextResponse.json(cleanedTest))
    }

    // ============ TEST ATTEMPTS ROUTES ============
    
    // Submit test - POST /api/test-attempts
    if (route === '/test-attempts' && method === 'POST') {
      const userData = verifyToken(request)
      if (!userData) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { testId, answers, timeSpent } = body

      // Get test to calculate score
      const test = await db.collection('tests').findOne({ id: testId })
      if (!test) {
        return handleCORS(NextResponse.json(
          { error: "Test not found" },
          { status: 404 }
        ))
      }

      // Calculate score
      let correctAnswers = 0
      const totalQuestions = test.questions?.length || 0
      
      if (test.questions && answers) {
        test.questions.forEach((question, index) => {
          if (answers[question.id] === question.correctAnswer) {
            correctAnswers++
          }
        })
      }

      const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0

      const attempt = {
        id: uuidv4(),
        userId: userData.userId,
        testId,
        answers,
        score: Math.round(score * 100) / 100,
        correctAnswers,
        totalQuestions,
        timeSpent,
        submittedAt: new Date()
      }

      await db.collection('test_attempts').insertOne(attempt)
      const { _id, ...cleanedAttempt } = attempt
      return handleCORS(NextResponse.json(cleanedAttempt))
    }

    // Get user's test attempts - GET /api/test-attempts
    if (route === '/test-attempts' && method === 'GET') {
      const userData = verifyToken(request)
      if (!userData) {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        ))
      }

      const attempts = await db.collection('test_attempts')
        .find({ userId: userData.userId })
        .sort({ submittedAt: -1 })
        .toArray()
      
      const cleanedAttempts = attempts.map(({ _id, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedAttempts))
    }

    // ============ ADMIN ROUTES ============
    
    // Get all users - GET /api/users (Admin only)
    if (route === '/users' && method === 'GET') {
      const userData = verifyToken(request)
      if (!userData || userData.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        ))
      }

      const users = await db.collection('users').find({}).toArray()
      const cleanedUsers = users.map(({ _id, password, ...rest }) => rest)
      return handleCORS(NextResponse.json(cleanedUsers))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute