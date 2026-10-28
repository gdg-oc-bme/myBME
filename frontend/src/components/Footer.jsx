export default function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-ink-soft">
        <p>myBME · a student project by GDG on Campus BME</p>
        <p>
          Always confirm details on the official{' '}
          <a href="https://www.bme.hu/" target="_blank" rel="noreferrer" className="underline hover:text-bme-red">
            bme.hu
          </a>{' '}
          sites.
        </p>
      </div>
    </footer>
  )
}
