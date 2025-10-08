// Create indexes for better query performance
const { MongoClient } = require('mongodb')

async function createIndexes() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(process.env.DB_NAME || 'sircbse_db')
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true })
    await db.collection('users').createIndex({ id: 1 }, { unique: true })
    await db.collection('subjects').createIndex({ id: 1 }, { unique: true })
    await db.collection('tests').createIndex({ id: 1 }, { unique: true })
    await db.collection('tests').createIndex({ category: 1 })
    await db.collection('test_attempts').createIndex({ userId: 1 })
    await db.collection('test_attempts').createIndex({ testId: 1 })
    await db.collection('study_materials').createIndex({ subjectId: 1 })
    
    console.log('✅ All indexes created successfully!')
    
  } catch (error) {
    console.error('Error creating indexes:', error)
  } finally {
    await client.close()
  }
}

createIndexes()
