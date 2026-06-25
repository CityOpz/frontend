import { Camera, Send, MapPin } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-12 px-8 relative">
      <div className="absolute inset-0 bg-muted/50 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Reporting is Simple
          </h2>
          <p className="text-lg text-muted-foreground">
            Three steps to connect with your local government.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          {/* Step 1 */}
          <div className="flex-1 text-center group">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-chart-1 transition-all group-hover:scale-110 group-hover:shadow-[0_0_30px_color-mix(in_oklch,var(--chart-1)_20%,transparent)]">
                <Camera className="w-10 h-10 text-chart-1" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-1 text-background font-bold flex items-center justify-center">
                  1
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border/30 -z-10 ml-4"></div>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              1. Capture
            </h3>
            <p className="text-muted-foreground text-sm px-4">
              Take a photo of the issue and briefly describe what is happening.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex-1 text-center group">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-chart-2 transition-all group-hover:scale-110 group-hover:shadow-[0_0_30px_color-mix(in_oklch,var(--chart-2)_20%,transparent)]">
                <Send className="w-10 h-10 text-chart-2" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-2 text-background font-bold flex items-center justify-center">
                  2
                </div>
              </div>
              <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-border/30 -z-10 ml-4"></div>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              2. Submit
            </h3>
            <p className="text-muted-foreground text-sm px-4">
              Automatically confirm your location via GPS and send the report.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex-1 text-center group">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-chart-3 transition-all group-hover:scale-110 group-hover:shadow-[0_0_30px_color-mix(in_oklch,var(--chart-3)_20%,transparent)]">
                <MapPin className="w-10 h-10 text-chart-3" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-3 text-background font-bold flex items-center justify-center">
                  3
                </div>
              </div>
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">
              3. Track
            </h3>
            <p className="text-muted-foreground text-sm px-4">
              Receive real-time notifications about the progress of the repair.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}