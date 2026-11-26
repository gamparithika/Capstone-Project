import { useCallback, useEffect, useState } from 'react';
import AboutSection from './components/AboutSection';
import AnalyticsSection from './components/AnalyticsSection';
import AssessmentSection from './components/AssessmentSection';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MethodologySection from './components/MethodologySection';
import ModelComparisonSection from './components/ModelComparisonSection';
import Navbar, { NavSectionId } from './components/Navbar';
import ProjectInfoSection from './components/ProjectInfoSection';
import { getSavedApiUrl, getSavedMetricsState } from './services/predictionApi';
import { ModelMetricsState } from './types/cardio';

const OBSERVED_NAV_SECTIONS: NavSectionId[] = [
  'home',
  'about',
  'prediction',
  'analytics',
  'methodology',
];

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [apiUrl, setApiUrl] = useState<string>(() => getSavedApiUrl());
  const [metricsState, setMetricsState] = useState<ModelMetricsState>(() =>
    getSavedMetricsState()
  );

  const handleNavigate = useCallback(
    (sectionId: NavSectionId | 'project-info' | 'model-comparison') => {
      if (OBSERVED_NAV_SECTIONS.includes(sectionId as NavSectionId)) {
        setActiveSection(sectionId as NavSectionId);
      }
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as NavSectionId;
            if (OBSERVED_NAV_SECTIONS.includes(id)) {
              setActiveSection(id);
            }
          }
        }
      },
      {
        rootMargin: '-25% 0px -60% 0px',
        threshold: 0.05,
      }
    );

    for (const id of OBSERVED_NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />
      <main>
        <HeroSection onNavigate={handleNavigate} />
        <AboutSection />
        <AssessmentSection apiUrl={apiUrl} onApiUrlChange={setApiUrl} />
        <AnalyticsSection />
        <MethodologySection />
        <ModelComparisonSection
          apiUrl={apiUrl}
          metricsState={metricsState}
          onMetricsChange={setMetricsState}
        />
        <ProjectInfoSection />
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
