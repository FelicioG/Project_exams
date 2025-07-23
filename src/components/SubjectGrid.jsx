import React, { useState, useEffect } from 'react'
import { Book, Clock, Users } from 'lucide-react'
import { dbHelpers } from '../lib/supabase'

function SubjectGrid({ faculty, onSubjectSelect }) {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubjects()
  }, [faculty.id])

  const loadSubjects = async () => {
    try {
      const data = await dbHelpers.getSubjectsByFaculty(faculty.id)
      setSubjects(data)
    } catch (error) {
      console.error('Error loading subjects:', error)
      // Fallback to static data
      setSubjects([
        { id: 1, name: 'Data Structures', code: 'CS101', semester: 3, credits: 4 },
        { id: 2, name: 'Algorithms', code: 'CS102', semester: 4, credits: 4 },
        { id: 3, name: 'Database Systems', code: 'CS201', semester: 5, credits: 3 },
        { id: 4, name: 'Computer Networks', code: 'CS202', semester: 6, credits: 3 }
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
        <h2 className="text-4xl font-bold text-white mb-4">{faculty.name} Subjects</h2>
        <p className="text-white/80 text-lg">Select a subject to view available exam papers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {subjects.map((subject, index) => (
          <div
            key={subject.id}
            className="group cursor-pointer"
            onClick={() => onSubjectSelect(subject)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 btn-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-white/20 rounded-lg p-3">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                  {subject.code}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">{subject.name}</h3>
              
              <div className="flex items-center justify-between text-white/70 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Sem {subject.semester}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{subject.credits} Credits</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubjectGrid