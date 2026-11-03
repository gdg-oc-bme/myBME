export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70 text-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="font-serif text-lg font-bold text-white">myBME</p>
          <p className="mt-1">A student project by the GDG on Campus BME tech team.</p>
          <p className="mt-1">
            Information is for guidance. Always confirm details on the official{' '}
            <a href="https://www.bme.hu/" target="_blank" rel="noreferrer" className="underline hover:text-white">
              bme.hu
            </a>{' '}
            sites.
          </p>
        </div>
        <p className="text-xs text-white/50 sm:text-right sm:self-end max-w-xs">
          Photos: Dennis G. Jarvis (
          <a
            href="https://commons.wikimedia.org/wiki/File:Hungary-02046_-_Budapest_University_of_Technology_and_Economics_(31670993764).jpg"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            1
          </a>
          ,{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Hungary-02131_-_Budapest_University_of_Technology_and_Economics_(31703151133).jpg"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            2
          </a>
          ),{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/2.0/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-white"
          >
            CC BY-SA 2.0
          </a>
          , via Wikimedia Commons (resized).
        </p>
      </div>
    </footer>
  )
}
