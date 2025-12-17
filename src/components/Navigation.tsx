'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Leaderboard' },
    { href: '/goals', label: 'Goals' },
    { href: '/spiffs', label: 'Spiffs' },
    { href: '/manager', label: 'Manager' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-[#0a0a0a] border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#cc0000] flex items-center justify-center font-black text-white text-xl">H</div>
            <div>
              <div className="font-bold text-lg leading-tight">Union Park Honda</div>
              <div className="text-xs text-[#888]">Sales Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`}>{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
