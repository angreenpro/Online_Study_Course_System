'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface Lesson {
  id: string;
  title: string;
  order: number;
  duration: number; // seconds
  type: string; // VIDEO, READING, QUIZ
}

export interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CurriculumAccordionProps {
  sections: Section[];
}

export default function CurriculumAccordion({ sections }: CurriculumAccordionProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    sections.length > 0 ? sections[0].id : null
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'VIDEO': return '🎥';
      case 'READING': return '📄';
      case 'QUIZ': return '❓';
      default: return '📎';
    }
  };

  if (!sections || sections.length === 0) {
    return (
      <div className="text-center p-8 bg-[var(--bg-tertiary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-[var(--text-muted)]">Chưa có nội dung khóa học.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isExpanded = expandedSection === section.id;
        const totalDuration = section.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);

        return (
          <div 
            key={section.id} 
            className="border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)]"
          >
            {/* Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-5 py-4 flex items-center justify-between bg-[var(--bg-tertiary)]/30 hover:bg-[var(--bg-tertiary)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "transform transition-transform duration-200",
                  isExpanded ? "rotate-180" : ""
                )}>
                  <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                <h3 className="font-medium text-left text-[var(--text-primary)]">
                  {section.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <span>{section.lessons.length} bài học</span>
                <span>•</span>
                <span>{formatDuration(totalDuration)}</span>
              </div>
            </button>

            {/* Content */}
            <div 
              className={cn(
                "overflow-hidden transition-all duration-300",
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="px-5 py-2">
                {section.lessons.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] py-3">Chưa có bài học nào trong phần này.</p>
                ) : (
                  <ul className="divide-y divide-[var(--border)]">
                    {section.lessons.map((lesson) => (
                      <li key={lesson.id} className="py-3 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <span className="text-xl opacity-70 group-hover:opacity-100 transition-opacity">
                            {getIconForType(lesson.type)}
                          </span>
                          <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatDuration(lesson.duration)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
