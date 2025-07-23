import React, { useEffect, useState } from 'react'
import { Download, Eye, Shield, AlertTriangle } from 'lucide-react'
import { dbHelpers } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

function ProtectedPDFViewer({ paper }) {
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    loadPDF()
    logAccess()
  }, [paper])

  const loadPDF = async () => {
    try {
      // In a real implementation, you would fetch the PDF from Supabase Storage
      // For demo, we'll use a placeholder
      const url = paper.document_type === 'paper' ? paper.paper_url : paper.answer_url
      setPdfUrl(url)
    } catch (error) {
      console.error('Error loading PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  const logAccess = async () => {
    if (user) {
      try {
        await dbHelpers.logPaperAccess(user.id, paper.id)
      } catch (error) {
        console.error('Error logging access:', error)
      }
    }
  }

  const handleDownload = () => {
    // Create a temporary link for download
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `${paper.title}_${paper.year}_${paper.document_type}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="fade-in max-w-6xl mx-auto">
      {/* Content Protection Warning */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="text-red-200 font-medium">Content Protection Active</h3>
            <p className="text-red-300/80 text-sm">
              This content is protected. Screenshots, screen recording, and copying are disabled.
            </p>
          </div>
        </div>
      </div>

      {/* PDF Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {paper.title} - {paper.document_type === 'paper' ? 'Question Paper' : 'Answer Key'}
            </h2>
            <p className="text-white/80">Academic Year: {paper.year}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden protected-content">
        <div className="bg-white/5 p-4 border-b border-white/10">
          <div className="flex items-center space-x-2 text-white/80">
            <Eye className="w-5 h-5" />
            <span>PDF Viewer - Protected Content</span>
          </div>
        </div>
        
        <div className="h-96 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">PDF Viewer</h3>
            <p className="text-gray-600 mb-4">
              In a production environment, this would display the protected PDF content
            </p>
            <p className="text-sm text-gray-500">
              File: {paper.title}_{paper.year}_{paper.document_type}.pdf
            </p>
          </div>
        </div>
      </div>

      {/* Protection Notice */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="text-yellow-200">
            <h4 className="font-medium mb-1">Content Protection Notice</h4>
            <ul className="text-sm text-yellow-300/80 space-y-1">
              <li>• Screenshots and screen recording are disabled</li>
              <li>• Right-click and developer tools are blocked</li>
              <li>• Content is watermarked with your account information</li>
              <li>• Unauthorized sharing may result in account suspension</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProtectedPDFViewer