// Seed data script for SIR CBSE
const { MongoClient } = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(process.env.DB_NAME || 'sircbse_db')
    
    // Clear existing data
    await db.collection('subjects').deleteMany({})
    await db.collection('tests').deleteMany({})
    await db.collection('users').deleteMany({})
    
    console.log('Cleared existing data')
    
    // Create subjects
    const subjects = [
      {
        id: uuidv4(),
        name: 'Physics',
        description: 'Comprehensive physics notes and problem-solving techniques',
        icon: 'atom',
        chapters: 25,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chemistry',
        description: 'Organic, Inorganic, and Physical chemistry concepts',
        icon: 'flask',
        chapters: 28,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Biology',
        description: 'Botany and Zoology for NEET preparation',
        icon: 'microscope',
        chapters: 38,
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Mathematics',
        description: 'Advanced mathematics for JEE preparation',
        icon: 'calculator',
        chapters: 22,
        createdAt: new Date()
      }
    ]
    
    await db.collection('subjects').insertMany(subjects)
    console.log('Created subjects')
    
    // Create sample tests
    const tests = [
      {
        id: uuidv4(),
        name: 'Physics - Mechanics Sectional Test',
        description: 'Test your understanding of mechanics concepts including kinematics, dynamics, and work-energy theorem',
        category: 'sectional',
        duration: 60,
        difficulty: 'medium',
        questions: [
          {
            id: uuidv4(),
            text: 'A car starts from rest and accelerates uniformly at 2 m/s² for 10 seconds. What is the final velocity?',
            options: ['10 m/s', '20 m/s', '30 m/s', '40 m/s'],
            correctAnswer: '20 m/s'
          },
          {
            id: uuidv4(),
            text: 'The SI unit of force is:',
            options: ['Joule', 'Newton', 'Watt', 'Pascal'],
            correctAnswer: 'Newton'
          },
          {
            id: uuidv4(),
            text: 'If a body is moving with constant velocity, its acceleration is:',
            options: ['Zero', 'Positive', 'Negative', 'Infinite'],
            correctAnswer: 'Zero'
          },
          {
            id: uuidv4(),
            text: 'The work done by a force is maximum when the angle between force and displacement is:',
            options: ['0°', '45°', '90°', '180°'],
            correctAnswer: '0°'
          },
          {
            id: uuidv4(),
            text: 'Which law states that for every action, there is an equal and opposite reaction?',
            options: ['First law of motion', 'Second law of motion', 'Third law of motion', 'Law of gravitation'],
            correctAnswer: 'Third law of motion'
          }
        ],
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Chemistry - Organic Chemistry Basics',
        description: 'Fundamental concepts of organic chemistry including nomenclature and reactions',
        category: 'sectional',
        duration: 45,
        difficulty: 'easy',
        questions: [
          {
            id: uuidv4(),
            text: 'The general formula for alkanes is:',
            options: ['CnH2n', 'CnH2n+2', 'CnH2n-2', 'CnHn'],
            correctAnswer: 'CnH2n+2'
          },
          {
            id: uuidv4(),
            text: 'Which of the following is an aromatic compound?',
            options: ['Benzene', 'Cyclohexane', 'Ethane', 'Propane'],
            correctAnswer: 'Benzene'
          },
          {
            id: uuidv4(),
            text: 'The functional group in alcohols is:',
            options: ['-COOH', '-OH', '-CHO', '-NH2'],
            correctAnswer: '-OH'
          },
          {
            id: uuidv4(),
            text: 'Isomers have:',
            options: ['Same molecular formula', 'Same structural formula', 'Same properties', 'Different molecular formula'],
            correctAnswer: 'Same molecular formula'
          }
        ],
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'JEE Main Mock Test 2025',
        description: 'Complete JEE Main pattern test covering Physics, Chemistry, and Mathematics',
        category: 'full-length',
        duration: 180,
        difficulty: 'hard',
        questions: [
          {
            id: uuidv4(),
            text: 'A projectile is thrown at an angle of 45° with the horizontal. The range will be maximum when the angle is:',
            options: ['30°', '45°', '60°', '90°'],
            correctAnswer: '45°'
          },
          {
            id: uuidv4(),
            text: 'The dimensional formula for energy is:',
            options: ['[ML²T⁻²]', '[MLT⁻²]', '[ML²T⁻¹]', '[MLT⁻¹]'],
            correctAnswer: '[ML²T⁻²]'
          },
          {
            id: uuidv4(),
            text: 'The number of atoms in one mole of substance is:',
            options: ['6.022 × 10²³', '6.022 × 10²²', '3.011 × 10²³', '1.202 × 10²⁴'],
            correctAnswer: '6.022 × 10²³'
          }
        ],
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'NEET 2024 Previous Year Paper',
        description: 'Complete NEET 2024 question paper with all questions from Physics, Chemistry, and Biology',
        category: 'previous-year',
        duration: 180,
        difficulty: 'hard',
        questions: [
          {
            id: uuidv4(),
            text: 'Which of the following is not a greenhouse gas?',
            options: ['CO2', 'CH4', 'N2', 'O3'],
            correctAnswer: 'N2'
          },
          {
            id: uuidv4(),
            text: 'DNA replication occurs in which phase of the cell cycle?',
            options: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
            correctAnswer: 'S phase'
          },
          {
            id: uuidv4(),
            text: 'The site of photosynthesis in plant cells is:',
            options: ['Mitochondria', 'Chloroplast', 'Nucleus', 'Ribosome'],
            correctAnswer: 'Chloroplast'
          }
        ],
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        name: 'Biology - Cell Biology Test',
        description: 'Comprehensive test on cell structure, function, and cellular processes',
        category: 'sectional',
        duration: 50,
        difficulty: 'medium',
        questions: [
          {
            id: uuidv4(),
            text: 'Which organelle is known as the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'],
            correctAnswer: 'Mitochondria'
          },
          {
            id: uuidv4(),
            text: 'The cell wall in plants is made up of:',
            options: ['Cellulose', 'Chitin', 'Peptidoglycan', 'Protein'],
            correctAnswer: 'Cellulose'
          },
          {
            id: uuidv4(),
            text: 'Ribosomes are the site of:',
            options: ['Protein synthesis', 'Lipid synthesis', 'DNA replication', 'Photosynthesis'],
            correctAnswer: 'Protein synthesis'
          }
        ],
        createdAt: new Date()
      }
    ]
    
    await db.collection('tests').insertMany(tests)
    console.log('Created sample tests')
    
    // Create an admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const adminUser = {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@sircbse.com',
      password: hashedPassword,
      role: 'admin',
      subscriptionStatus: 'active',
      createdAt: new Date()
    }
    
    await db.collection('users').insertOne(adminUser)
    console.log('Created admin user (admin@sircbse.com / admin123)')
    
    console.log('\\n✅ Database seeded successfully!')
    console.log('\\nSample credentials:')
    console.log('Admin: admin@sircbse.com / admin123')
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await client.close()
  }
}

// Run the seed function
seedDatabase()
