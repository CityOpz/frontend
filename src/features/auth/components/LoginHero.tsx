import ThemeToggle from "@/shared/theme/components/ThemeToggle"

export function LoginHero() {
  return (
    <section
      className="
        hidden lg:flex lg:w-1/2
        relative
        items-center
        justify-center
        border-r
        border-border
        bg-background
        overflow-hidden
      "
      style={{
        backgroundImage: `
          linear-gradient(rgba(137, 180, 250, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(137, 180, 250, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <div
        className="
          absolute inset-0
          pointer-events-none
          bg-linear-to-tr from-background via-transparent to-background
          opacity-60
        "
      />

      <div className="relative z-10 p-12">
        <div className="flex flex-col gap-8 max-w-md">
          <div className="space-y-4">
            <div className="h-1 w-12 bg-primary" />
            <h2 className="text-5xl font-extrabold text-foreground leading-tight tracking-tighter">
              Architecting
              <br />
              <span className="text-primary">Urban Intelligence.</span>
            </h2>
          </div>

          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Access the unified command interface for municipal operations and
            citizen services.
          </p>

          <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase text-muted-foreground">
            <span>Precision</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Transparency</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Security</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 opacity-20">
        <div className="grid grid-cols-4 gap-2">
          <div className="w-8 h-8 bg-primary" />
          <div className="w-8 h-8 border border-primary" />
          <div className="w-8 h-8 bg-transparent" />
          <div className="w-8 h-8 border border-primary opacity-50" />
          <div className="w-8 h-8 bg-transparent" />
          <div className="w-8 h-8 bg-primary opacity-30" />
          <div className="w-8 h-8 border border-primary" />
          <div className="w-8 h-8 bg-transparent" />
        </div>
      </div>

      <div className="absolute bottom-8 left-8 z-20">
        <ThemeToggle />
      </div>
    </section>
  )
}
