import React, { useState, useEffect } from 'react'
import { FileText, Download, Calendar, Lock } from 'lucide-react'
import { dbHelpers } from '../lib/supabase'

function ExamGrid({ subject, onPaperAccess }) {
  const [papers, setPapers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPapers()
  }, [subject.id])

  const loadPapers = async () => {
    try {
      const data = await dbHelpers.getPapersBySubject(subject.id)
      setPapers(data)
    } catch (error) {
      console.error('Error loading papers:', error)
      // Fallback to static data
      setPapers([
        { 
          id: 1, 
          title: 'Mid Term Exam', 
          year: '2023-2024', 
          type: 'midterm',
          paper_url: '/sample-paper.pdf',
          answer_url: '/sample-answer.pdf'
        },
        { 
          id: 2, 
          title: 'Final Exam', 
          year: '2023-2024', 
          type: 'final',
          paper_url: '/sample-paper.pdf',
          answer_url: '/sample-answer.pdf'
        },
        { 
          id: 3, 
          title: 'Mid Term Exam', 
          year: '2022-2023', 
          type: 'midterm',
          paper_url: '/sample-paper.pdf',
          answer_url: '/sample-answer.pdf'
        }
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

  const groupedPapers = papers.reduce((acc, paper) => {
    if (!acc[paper.year]) {
      acc[paper.year] = []
    }
    acc[paper.year].push(paper)
    return acc
  }, {})

  return (
    <div className="fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">{subject.name} Exam Papers</h2>
        <p className="text-white/80 text-lg">Access previous year question papers and answer keys</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {Object.entries(groupedPapers).map(([year, yearPapers]) => (
          <div key={year} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3" />
              Academic Year {year}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yearPapers.map((paper) => (
                <div key={paper.id} className="bg-white/10 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-white">{paper.title}</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paper.type === 'midterm' 
                        ? 'bg-blue-500/20 text-blue-200' 
                        : 'bg-green-500/20 text-green-200'
                    }`}>
                      {paper.type === 'midterm' ? 'Mid Term' : 'Final'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => onPaperAccess({ ...paper, document_type: 'paper' })}
                      className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Question Paper</span>
                      </div>
                      <Lock className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                    
                    <button
                      onClick={() => onPaperAccess({ ...paper, document_type: 'answer' })}
                      className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Answer Key</span>
                      </div>
                      <Lock className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamGrid