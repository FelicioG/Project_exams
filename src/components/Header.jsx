import React from 'react'
import { ArrowLeft, User, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

function Header({ user, onAuthClick, onBack, currentView, selectedFaculty, selectedSubject }) {
  const { signOut } = useAuth()

  const getBreadcrumb = () => {
    if (currentView === 'faculties') return 'Faculties'
    if (currentView === 'subjects') return `${selectedFaculty?.name} - Subjects`
    if (currentView === 'exams') return `${selectedFaculty?.name} - ${selectedSubject?.name} - Exams`
    if (currentView === 'viewer') return 'PDF Viewer'
    return 'Exam Portal'
  }

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">TechLions Exam Portal</h1>
              <p className="text-white/80 text-sm">{getBreadcrumb()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-medium">{user.email}</p>
                  <p className="text-white/70 text-xs">
                    {user.subscription_active ? 'Premium Member' : 'Free Account'}
                  </p>
                </div>
                <button
                  onClick={signOut}
                  className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <User className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header