import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import FacultyGrid from './components/FacultyGrid'
import SubjectGrid from './components/SubjectGrid'
import ExamGrid from './components/ExamGrid'
import AuthModal from './components/AuthModal'
import SubscriptionModal from './components/SubscriptionModal'
import ProtectedPDFViewer from './components/ProtectedPDFViewer'
import { useAuth } from './hooks/useAuth'
import { useContentProtection } from './hooks/useContentProtection'

function App() {
  const [currentView, setCurrentView] = useState('faculties')
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  const { user, loading: authLoading } = useAuth()
  useContentProtection()

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty)
    setCurrentView('subjects')
  }

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject)
    setCurrentView('exams')
  }

  const handlePaperAccess = (paper) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Check if user has active subscription
    if (!user.subscription_active) {
      setShowSubscriptionModal(true)
      return
    }

    setSelectedPaper(paper)
    setCurrentView('viewer')
  }

  const handleBack = () => {
    if (currentView === 'subjects') {
      setCurrentView('faculties')
      setSelectedFaculty(null)
    } else if (currentView === 'exams') {
      setCurrentView('subjects')
      setSelectedSubject(null)
    } else if (currentView === 'viewer') {
      setCurrentView('exams')
      setSelectedPaper(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)}
        onBack={currentView !== 'faculties' ? handleBack : null}
        currentView={currentView}
        selectedFaculty={selectedFaculty}
        selectedSubject={selectedSubject}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'faculties' && (
          <FacultyGrid onFacultySelect={handleFacultySelect} />
        )}
        
        {currentView === 'subjects' && selectedFaculty && (
          <SubjectGrid 
            faculty={selectedFaculty} 
            onSubjectSelect={handleSubjectSelect} 
          />
        )}
        
        {currentView === 'exams' && selectedSubject && (
          <ExamGrid 
            subject={selectedSubject} 
            onPaperAccess={handlePaperAccess}
          />
        )}
        
        {currentView === 'viewer' && selectedPaper && (
          <ProtectedPDFViewer paper={selectedPaper} />
        )}
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showSubscriptionModal && (
        <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
      )}
    </div>
  )
}

export default App