import React, { useState, useEffect } from 'react'
import { GraduationCap, BookOpen, Briefcase, Stethoscope } from 'lucide-react'
import { dbHelpers } from '../lib/supabase'

const facultyIcons = {
  'Engineering': GraduationCap,
  'Science': BookOpen,
  'Management Studies': Briefcase,
  'Law': BookOpen,
  'Physiotherapy': Stethoscope
}

const facultyColors = {
  'Engineering': 'from-blue-500 to-blue-600',
  'Science': 'from-green-500 to-green-600',
  'Management Studies': 'from-purple-500 to-purple-600',
  'Law': 'from-red-500 to-red-600',
  'Physiotherapy': 'from-teal-500 to-teal-600'
}

function FacultyGrid({ onFacultySelect }) {
  const [faculties, setFaculties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFaculties()
  }, [])

  const loadFaculties = async () => {
    try {
      const data = await dbHelpers.getFaculties()
      setFaculties(data)
    } catch (error) {
      console.error('Error loading faculties:', error)
      // Fallback to static data if database is not set up
      setFaculties([
        { id: 1, name: 'Engineering', description: 'Computer Science, IT, Electronics' },
        { id: 2, name: 'Science', description: 'Chemistry, Microbiology, Agriculture' },
        { id: 3, name: 'Management Studies', description: 'BBA, B.Com, Digital Finance' },
        { id: 4, name: 'Law', description: 'BA LLB, BCom LLB' },
        { id: 5, name: 'Physiotherapy', description: 'Physical Therapy Programs' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Choose Your Faculty</h2>
        <p className="text-white/80 text-lg">Select a faculty to access exam papers and study materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {faculties.map((faculty, index) => {
          const Icon = facultyIcons[faculty.name] || BookOpen
          const colorClass = facultyColors[faculty.name] || 'from-gray-500 to-gray-600'
          
          return (
            <div
              key={faculty.id}
              className="group cursor-pointer"
              onClick={() => onFacultySelect(faculty)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl btn-hover`}>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{faculty.name}</h3>
                  <p className="text-white/90 leading-relaxed">{faculty.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FacultyGrid