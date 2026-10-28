export default function Section({ title, action, children }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-serif text-xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
