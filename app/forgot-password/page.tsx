'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  EnvelopeIcon, 
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en') // Default to English

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en')
  }

  // Translations
  const translations = {
    en: {
      backToHome: 'Back to Home',
      title: 'Reset Password',
      subtitle: 'Enter your email and we\'ll send you a password reset link',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your email',
      sendLink: 'Send Reset Link',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      success: 'Email Sent!',
      successMessage: 'Password reset link has been sent to',
      checkEmail: 'Please check your email',
      tryAnother: 'Try another email',
      errorMessage: 'Please enter a valid email address',
      footer: 'By continuing, you agree to our Terms of Service and Privacy Policy',
      language: 'አማ'
    },
    am: {
      backToHome: 'ወደ መነሻ ተመለስ',
      title: 'የይለፍ ቃል መልሶ ማስጀመር',
      subtitle: 'ኢሜይልዎን ያስገቡ እና የይለፍ ቃል መልሶ ለማስጀመሪያ ሊንክ እንልክልዎታለን',
      emailLabel: 'ኢሜይል አድራሻ',
      emailPlaceholder: 'ኢሜይልዎን ያስገቡ',
      sendLink: 'የማስጀመሪያ ሊንክ ላክ',
      sending: 'በመላክ ላይ...',
      backToLogin: 'ወደ መግቢያ ተመለስ',
      success: 'ኢሜይል ተልኳል!',
      successMessage: 'የይለፍ ቃል መልሶ ማስጀመሪያ ሊንክ ወደ',
      checkEmail: 'እባክዎ ኢሜይልዎን ያረጋግጡ',
      tryAnother: 'በሌላ ኢሜይል ሞክር',
      errorMessage: 'እባክዎ ትክክለኛ ኢሜይል ያስገቡ',
      footer: 'በመቀጠል የአገልግሎት ውል እና የግላዊነት ፖሊሲ ተቀብላለሁ',
      language: 'EN'
    }
  }

  // Get current language translations
  const t = translations[language as keyof typeof translations]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate email
    if (!email || !email.includes('@')) {
      toast.error(t.errorMessage)
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsSubmitted(true)
      toast.success(t.success)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Green Card */}
      <div className="max-w-md w-full bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 relative">
        {/* Language Toggle - Shows አማ when English is active, EN when Amharic is active */}
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 text-green-200 hover:text-white transition-colors text-sm font-medium bg-green-500 bg-opacity-20 px-3 py-1 rounded-full"
        >
          {t.language}
        </button>

        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-4 left-4 text-green-200 hover:text-white transition-colors"
          title={t.backToHome}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>

        {/* Header */}
        <div className="text-center mb-8 mt-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheckIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
          <p className="text-green-100">{t.subtitle}</p>
        </div>

        {!isSubmitted ? (
          /* Forgot Password Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-green-100 mb-1">
                {t.emailLabel}
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir={language === 'am' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t.sending}
                </div>
              ) : (
                t.sendLink
              )}
            </button>

            <div className="text-center mt-4">
              <Link 
                href="/login" 
                className="text-green-200 hover:text-white font-medium text-sm"
              >
                ← {t.backToLogin}
              </Link>
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">{t.success}</h2>
            <p className="text-green-100 mb-1">{t.checkEmail}</p>
            <p className="text-green-100 mb-4">
              {t.successMessage}{' '}
              <span className="font-bold text-white block mt-1">{email}</span>
            </p>

            <div className="space-y-3 mt-6">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-green-500 bg-opacity-20 border border-green-400 text-white py-3 rounded-lg font-semibold hover:bg-green-500 hover:bg-opacity-30 transition-all duration-200"
              >
                {t.tryAnother}
              </button>
              
              <Link
                href="/login"
                className="block w-full bg-white text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {t.backToLogin}
              </Link>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-xs text-center text-green-300">
          {t.footer}
        </p>
      </div>
    </div>
  )
}