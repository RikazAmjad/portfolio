"use client";

import { useState } from 'react';
import { FaLinkedinIn, FaTwitter, FaBehance, FaInstagram } from 'react-icons/fa';
import { Code2, Server, Database, GitBranch, Cpu, Activity, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SkillItem {
  id: string;
  name: string;
  role: string;
  image: string;
  description?: string;
  skills?: string[];
  iconName?: 'code' | 'server' | 'database' | 'git' | 'cpu' | 'activity';
  social?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    behance?: string;
  };
}

export type TeamMember = SkillItem;

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 'frontend',
    name: 'Frontend Engineering',
    role: 'UI & CLIENT ARCHITECTURE',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description: 'High-performance web apps, fluid micro-interactions, responsive layouts, and clean component hierarchies.',
    skills: ['React', 'Next.js 15', 'TypeScript', 'Tailwind CSS'],
    iconName: 'code',
  },
  {
    id: 'backend',
    name: 'Backend Architecture',
    role: 'APIs & DISTRIBUTED SERVICES',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Structured RESTful & GraphQL APIs, secure authentication flows, background workers, and business logic.',
    skills: ['Node.js', 'Express', 'Python', 'API Security'],
    iconName: 'server',
  },
  {
    id: 'databases',
    name: 'Databases & Persistence',
    role: 'STORAGE & CACHING LAYERS',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    description: 'Relational schema design, ORM integration, indexing, query optimization, and fast memory caching.',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma ORM'],
    iconName: 'database',
  },
  {
    id: 'devops',
    name: 'DevOps & Tooling',
    role: 'CI/CD & CLOUD INFRASTRUCTURE',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80',
    description: 'Containerized environments, automated deployment pipelines, Git workflows, and production monitoring.',
    skills: ['Docker', 'Git / CI/CD', 'AWS / Vercel', 'Linux'],
    iconName: 'git',
  },
  {
    id: 'systems',
    name: 'System Architecture',
    role: 'SCALE & FAULT TOLERANCE',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'Event-driven systems, rate limiting, message queues, WebSockets, and horizontal scaling patterns.',
    skills: ['Microservices', 'WebSockets', 'Event-Driven', 'Caching'],
    iconName: 'cpu',
  },
  {
    id: 'testing',
    name: 'Testing & Performance',
    role: 'QUALITY & SPEED OPTIMIZATION',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    description: 'Automated unit, integration, and E2E test suites with strict Core Web Vitals and Lighthouse 100 targets.',
    skills: ['Vitest / Jest', 'Playwright', 'Core Web Vitals', 'Lighthouse 100'],
    iconName: 'activity',
  },
];

export const DEFAULT_MEMBERS = DEFAULT_SKILLS;

interface ShowcaseProps {
  items?: SkillItem[];
  members?: SkillItem[];
  className?: string;
}

export function SkillShowcase({ items, members, className }: ShowcaseProps) {
  const activeItems = items || members || DEFAULT_SKILLS;
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const col1 = activeItems.filter((_, i) => i % 3 === 0);
  const col2 = activeItems.filter((_, i) => i % 3 === 1);
  const col3 = activeItems.filter((_, i) => i % 3 === 2);

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-start gap-8 lg:gap-12 select-none w-full max-w-6xl mx-auto py-4 font-sans',
        className
      )}
    >
      {/* ── Left: staggered visual card grid ── */}
      <div className="flex gap-2.5 sm:gap-3.5 flex-shrink-0 mx-auto lg:mx-0 overflow-x-auto pb-2 lg:pb-0">
        {/* Column 1 */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5">
          {col1.map((item) => (
            <SkillCard
              key={item.id}
              item={item}
              className="w-[115px] h-[125px] sm:w-[135px] sm:h-[145px] md:w-[160px] md:h-[170px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 2 - Staggered offset */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 mt-[44px] sm:mt-[52px] md:mt-[64px]">
          {col2.map((item) => (
            <SkillCard
              key={item.id}
              item={item}
              className="w-[124px] h-[134px] sm:w-[148px] sm:h-[158px] md:w-[174px] md:h-[184px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>

        {/* Column 3 - Staggered offset */}
        <div className="flex flex-col gap-2.5 sm:gap-3.5 mt-[20px] sm:mt-[24px] md:mt-[30px]">
          {col3.map((item) => (
            <SkillCard
              key={item.id}
              item={item}
              className="w-[118px] h-[128px] sm:w-[140px] sm:h-[150px] md:w-[166px] md:h-[176px]"
              hoveredId={hoveredId}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* ── Right: interactive skill rows ── */}
      <div className="flex flex-col gap-2 sm:gap-2.5 pt-0 lg:pt-2 flex-1 w-full">
        {activeItems.map((item) => (
          <SkillRow
            key={item.id}
            item={item}
            hoveredId={hoveredId}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

export default SkillShowcase;
export const TeamShowcase = SkillShowcase;

/* ─────────────────────────────────────────
   Skill Visual Card
───────────────────────────────────────── */

function SkillCard({
  item,
  className,
  hoveredId,
  onHover,
}: {
  item: SkillItem;
  className: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === item.id;
  const isDimmed = hoveredId !== null && !isActive;
  const Icon = getIcon(item.iconName);

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0 transition-all duration-300 ease-out',
        className,
        isDimmed ? 'opacity-40 grayscale brightness-75 scale-[0.98]' : 'opacity-100',
        isActive
          ? 'scale-[1.03] ring-2 ring-[#FFD000] shadow-xl shadow-[#FFD000]/20'
          : 'ring-1 ring-black/10 hover:ring-black/20'
      )}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Background imagery */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        style={{
          filter: isActive ? 'grayscale(0) brightness(1.05)' : 'grayscale(1) brightness(0.72)',
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#370232]/90 via-[#370232]/30 to-transparent pointer-events-none" />

      {/* Floating domain icon badge */}
      <div
        className={cn(
          'absolute top-2.5 left-2.5 flex items-center justify-center h-6 w-6 rounded-lg backdrop-blur-md transition-all duration-300',
          isActive ? 'bg-[#FFD000] text-[#370232] shadow-sm' : 'bg-black/50 text-white/80'
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Bottom domain card label */}
      <div className="absolute bottom-2 left-2.5 right-2.5 pointer-events-none">
        <span
          className={cn(
            'font-mono text-[9px] sm:text-[10px] font-bold tracking-wider uppercase block truncate transition-colors duration-300',
            isActive ? 'text-white' : 'text-white/80'
          )}
        >
          {item.name.replace(' Engineering', '').replace(' Architecture', '').replace(' & Persistence', '')}
        </span>
        <span className="font-mono text-[7px] text-[#FFD000] block tracking-widest uppercase">
          {item.role.split(' ')[0]}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Interactive Skill Row
───────────────────────────────────────── */

function SkillRow({
  item,
  hoveredId,
  onHover,
}: {
  item: SkillItem;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}) {
  const isActive = hoveredId === item.id;
  const isDimmed = hoveredId !== null && !isActive;
  const Icon = getIcon(item.iconName);
  const hasSocial =
    item.social?.twitter ?? item.social?.linkedin ?? item.social?.instagram ?? item.social?.behance;

  return (
    <div
      className={cn(
        'group cursor-pointer rounded-xl p-3 sm:p-3.5 -mx-2 transition-all duration-300',
        isActive ? 'bg-white shadow-sm border border-black/8' : 'hover:bg-black/[0.02]',
        isDimmed ? 'opacity-40' : 'opacity-100'
      )}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Active indicator capsule */}
          <span
            className={cn(
              'mt-1.5 h-3 rounded-[5px] flex-shrink-0 transition-all duration-300',
              isActive
                ? 'bg-[#FFD000] w-6 shadow-sm shadow-[#FFD000]/50'
                : 'bg-black/20 w-4 group-hover:bg-black/30'
            )}
          />

          <div className="flex-1 min-w-0">
            {/* Title + category tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'text-base sm:text-lg font-bold leading-none tracking-tight transition-colors duration-300',
                  isActive ? 'text-[#370232]' : 'text-[#370232]/85 group-hover:text-[#370232]'
                )}
              >
                {item.name}
              </span>
              <span className="font-mono text-[9px] font-semibold tracking-wider text-[#744470] uppercase">
                {item.role}
              </span>
            </div>

            {/* Description */}
            {item.description && (
              <p className="mt-1 text-xs text-[#744470] leading-relaxed line-clamp-1 sm:line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Tech badges */}
            {item.skills && item.skills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[10px] font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#370232] text-white shadow-xs'
                        : 'bg-black/5 text-[#744470]'
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Domain Icon or Social icons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {hasSocial && (
            <div
              className={cn(
                'flex items-center gap-1 transition-all duration-200',
                isActive
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-2 pointer-events-none'
              )}
            >
              {item.social?.twitter && (
                <a
                  href={item.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-[#744470] hover:text-[#370232] hover:bg-black/5 transition-all"
                  title="X / Twitter"
                >
                  <FaTwitter size={11} />
                </a>
              )}
              {item.social?.linkedin && (
                <a
                  href={item.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-[#744470] hover:text-[#370232] hover:bg-black/5 transition-all"
                  title="LinkedIn"
                >
                  <FaLinkedinIn size={11} />
                </a>
              )}
              {item.social?.instagram && (
                <a
                  href={item.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-[#744470] hover:text-[#370232] hover:bg-black/5 transition-all"
                  title="Instagram"
                >
                  <FaInstagram size={11} />
                </a>
              )}
              {item.social?.behance && (
                <a
                  href={item.social.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded text-[#744470] hover:text-[#370232] hover:bg-black/5 transition-all"
                  title="Behance"
                >
                  <FaBehance size={11} />
                </a>
              )}
            </div>
          )}

          <div
            className={cn(
              'p-2 rounded-lg transition-all duration-300',
              isActive
                ? 'bg-[#FFD000]/20 text-[#370232] scale-110'
                : 'text-[#744470]/40 group-hover:text-[#744470]'
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Helper: resolve Lucide Icon
───────────────────────────────────────── */

function getIcon(name?: SkillItem['iconName']): LucideIcon {
  switch (name) {
    case 'code':
      return Code2;
    case 'server':
      return Server;
    case 'database':
      return Database;
    case 'git':
      return GitBranch;
    case 'cpu':
      return Cpu;
    case 'activity':
      return Activity;
    default:
      return Code2;
  }
}
