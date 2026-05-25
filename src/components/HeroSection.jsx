export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="text-cosmic-yellow">✦</span>
            Gentle cosmic space for students
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Send a kind message, light up a star.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            A space where students can share thoughts, encouragement, and inspiring stories.
            In this vast universe, no one has to feel alone.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#send-message"
              className="inline-flex items-center justify-center rounded-full bg-cosmic-yellow px-6 py-3 text-sm font-semibold text-[#191720] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Send a Message
            </a>
            <a
              href="#galaxy"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cosmic-blue/50 hover:bg-white/10"
            >
              Explore the Galaxy
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:justify-end">
          <div className="hero-orbit relative h-[340px] w-[340px] sm:h-[420px] sm:w-[420px]">
            <div className="glow-orb glow-orb-one" />
            <div className="glow-orb glow-orb-two" />
            <div className="absolute left-10 top-12 star-pulse text-cosmic-yellow">✦</div>
            <div className="absolute right-8 top-20 star-pulse delay-1 text-cosmic-blue">✦</div>
            <div className="absolute bottom-20 left-12 star-pulse delay-2 text-cosmic-pink">✦</div>
            <div className="absolute bottom-14 right-14 star-pulse delay-3 text-cosmic-purple">✦</div>
            <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 shadow-[inset_0_0_40px_rgba(255,255,255,0.03)] backdrop-blur-sm" />
            <div className="absolute inset-7 rounded-full border border-white/10 bg-[#0f1430]/70 shadow-[0_0_60px_rgba(76,201,240,0.08)]" />
            <div className="absolute inset-16 rounded-full border border-dashed border-white/10 bg-gradient-to-br from-white/8 to-transparent" />
            <div className="absolute inset-24 flex flex-col items-center justify-center rounded-full border border-white/10 bg-[#0B1024]/90 px-8 text-center shadow-[0_0_50px_rgba(155,93,229,0.18)]">
              <div className="mb-4 text-3xl text-cosmic-yellow">✦</div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/45">Galaxy of kindness</p>
              <p className="mt-3 text-lg font-medium text-white">One message can become light.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
