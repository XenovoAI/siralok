'use client'

import { useState, useEffect } from 'react'
import { Book, Beaker, Microscope, Calculator, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Default subjects as fallback
const DEFAULT_SUBJECTS = [
	{
		name: 'Physics',
		description: 'Comprehensive physics notes and problem-solving techniques',
		icon: 'atom',
		chapters: 25,
	},
	{
		name: 'Chemistry',
		description: 'Organic, Inorganic, and Physical chemistry concepts',
		icon: 'flask',
		chapters: 28,
	},
	{
		name: 'Biology',
		description: 'Botany and Zoology for NEET preparation',
		icon: 'microscope',
		chapters: 38,
	},
	{
		name: 'Mathematics',
		description: 'Advanced mathematics for JEE preparation',
		icon: 'calculator',
		chapters: 22,
	},
]

export default function MaterialsPage() {
	const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		// Check if we have cached subjects
		const cachedSubjects = localStorage.getItem('subjects')
		if (cachedSubjects) {
			try {
				const parsed = JSON.parse(cachedSubjects)
				if (Array.isArray(parsed) && parsed.length > 0) {
					setSubjects(parsed)
				}
			} catch (e) {
				console.error('Error parsing cached subjects:', e)
			}
		}

		// Fetch fresh data in background
		fetchSubjects()
	}, [])

	const fetchSubjects = async () => {
		try {
			const response = await fetch('/api/subjects', {
				headers: { 'Cache-Control': 'max-age=300' },
			})
			if (response.ok) {
				const data = await response.json()
				if (Array.isArray(data) && data.length > 0) {
					setSubjects(data)
					localStorage.setItem('subjects', JSON.stringify(data))
				}
			}
		} catch (error) {
			console.error('Error fetching subjects:', error)
		}
	}

	const getSubjectIcon = (name) => {
		switch (name.toLowerCase()) {
			case 'physics':
				return <Book className="w-8 h-8" />
			case 'chemistry':
				return <Beaker className="w-8 h-8" />
			case 'biology':
				return <Microscope className="w-8 h-8" />
			case 'mathematics':
				return <Calculator className="w-8 h-8" />
			default:
				return <Book className="w-8 h-8" />
		}
	}

	return (
		<div className="min-h-screen bg-white">
			<Navbar />

			{/* Header */}
			<section className="py-16 bg-gradient-to-b from-sky-50 to-white">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<h1 className="text-5xl font-bold text-gray-900 mb-4">
							Study <span className="text-sky-600">Materials</span>
						</h1>
						<p className="text-xl text-gray-600">
							Access comprehensive study materials for JEE and NEET preparation
						</p>
					</div>
				</div>
			</section>

			{/* Subjects Grid */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					{loading ? (
						<div className="text-center py-12">
							<p className="text-gray-600">Loading subjects...</p>
						</div>
					) : (
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{subjects.map((subject, index) => (
								<Card key={index} className="hover:shadow-lg transition">
									<CardHeader>
										<div className="w-16 h-16 bg-sky-100 rounded-lg flex items-center justify-center text-sky-600 mb-4">
											{getSubjectIcon(subject.name)}
										</div>
										<CardTitle>{subject.name}</CardTitle>
										<CardDescription>{subject.description}</CardDescription>
									</CardHeader>
									<CardContent>
										<p className="text-sm text-gray-600">
											{subject.chapters} Chapters
										</p>
									</CardContent>
									<CardFooter className="flex flex-col gap-2">
										<Button className="w-full bg-sky-600 hover:bg-sky-700">
											<FileText className="w-4 h-4 mr-2" />
											View Notes
										</Button>
										<Button variant="outline" className="w-full">
											<Download className="w-4 h-4 mr-2" />
											Download PDFs
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</div>
			</section>

			<Footer />
		</div>
	)
}