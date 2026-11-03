const photoLinks = [
  'https://commons.wikimedia.org/wiki/File:Hungary-02046_-_Budapest_University_of_Technology_and_Economics_(31670993764).jpg',
  'https://commons.wikimedia.org/wiki/File:Hungary-02131_-_Budapest_University_of_Technology_and_Economics_(31703151133).jpg',
]

export default function Footer() {
  return (
    <footer className="mx-auto mt-20 w-full max-w-6xl px-4 pb-10 text-sm text-ink-soft">
      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
        <p>
          <span className="font-display font-bold text-ink">
            <span className="text-bme-red">my</span>BME
          </span>{' '}
          · a student project by GDG on Campus BME. Not an official BME site – always confirm details on{' '}
          <a href="https://www.bme.hu/" target="_blank" rel="noreferrer" className="underline hover:text-bme-red">
            bme.hu
          </a>
          .
        </p>
        <p className="text-xs sm:text-right">
          Photos: Dennis G. Jarvis (
          {photoLinks.map((href, i) => (
            <span key={href}>
              {i > 0 && ', '}
              <a href={href} target="_blank" rel="noreferrer" className="underline hover:text-bme-red">
                {i + 1}
              </a>
            </span>
          ))}
          ),{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/2.0/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-bme-red"
          >
            CC BY-SA 2.0
          </a>
          , resized
        </p>
      </div>
    </footer>
  )
}
