<aside className="w-64 bg-[var(--secondary)] p-4 border-r border-[var(--primary)]">
  <nav className="space-y-2">
    {sidebarItems.map((item) => (
      <Link
        key={item.label}
        href={item.path}
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors
          ${activePath === item.path 
            ? 'bg-[var(--primary)] text-white'
            : 'text-[var(--text)] hover:bg-[var(--primary)] hover:bg-opacity-20'}`
        }
      >
        <item.icon className="h-5 w-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    ))}
  </nav>
</aside> 