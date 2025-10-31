import React, { useEffect, useState } from 'react'
import CourseList from '../component/domin/CourseList'
import { fetchCourses } from '../services/api'
import FeaturesGrid from '../component/landing/FeaturesGrid'
import FAQAccordion from '../component/landing/FAQAccordion'
import StickyCTA from '../component/landing/StickyCTA'
import ExitIntentModal from '../component/landing/ExitIntentModal'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [exitOpen, setExitOpen] = useState(false)

  const features = [
  { id: 'f1', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>), title: 'Project-first courses', text: 'Build real projects you can show in interviews.' },
  { id: 'f2', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="2" strokeLinecap="round"/></svg>), title: 'Balanced stack', text: 'Frontend + backend + DB — learn a complete flow.' },
  { id: 'f3', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3h18v18H3z" strokeWidth="2" strokeLinecap="round"/></svg>), title: 'Deploy-ready', text: 'CI/CD and hosting best practices (Render, GCP, AWS).' },
  { id: 'f4', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v8" strokeWidth="2"/></svg>), title: 'Progress & analytics', text: 'Track learner progress and completion rates.' },
  { id: 'f5', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16" strokeWidth="2"/></svg>), title: 'Certifications', text: 'Issue certificates when learners complete projects.' },
  { id: 'f6', icon: (<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 18l4-8 4 8H4z" strokeWidth="2"/></svg>), title: 'Integrations', text: 'Zoom, Stripe, Google Classroom, and more.' }
]

  const faqs = [
  { q: 'How do I become a trainer?', a: 'Apply using the Apply as Trainer form. Admin reviews and approves applications.' },
  { q: 'What stack is taught?', a: 'Java Spring Boot on backend and React on frontend with MySQL.' },
  { q: 'Do you provide certificates?', a: 'Yes — when you complete project-based courses you get a certificate.' },
  { q: 'How are projects evaluated?', a: 'Projects include automated tests and manual review by trainers.' }
]


  useEffect(() => {
    let mounted = true
    fetchCourses().then(res => {
      if (mounted) setCourses(res.data || [])
    }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])


  return (
    <>
    <div>
      <section id="courses" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured courses</h2>
          <div className="text-sm text-gray-500">{loading ? 'Loading...' : `${courses.length} courses`}</div>
        </div>

        <div>
          <CourseList courses={courses} />
          <FeaturesGrid features={features} />
          <FAQAccordion faqs={faqs} />
          <StickyCTA />
          <ExitIntentModal open={exitOpen} onClose={() => setExitOpen(false)} onSubmit={(email) => { localStorage.setItem('tm_waitlist_email', email); setExitOpen(false); alert('Thanks — check your email (demo)') }} />
        </div>
      </section>
    </div>
    </>
  )
}