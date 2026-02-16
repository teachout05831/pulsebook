export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 pb-2 border-b">{title}</h2>
      {children}
    </section>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
}

export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div className="my-4">
      {title && <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>}
      <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export function ParamTable({ params }: { params: { name: string; type: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 pr-4">Parameter</th>
            <th className="text-left py-2 pr-4">Type</th>
            <th className="text-left py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b">
              <td className="py-2 pr-4 font-mono">{p.name}</td>
              <td className="py-2 pr-4 text-gray-500">{p.type}</td>
              <td className="py-2 text-gray-600">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function EndpointRow({ method, path, desc }: { method: string; path: string; desc: string }) {
  const color = method === "GET" ? "bg-green-100 text-green-800"
    : method === "POST" ? "bg-blue-100 text-blue-800"
    : method === "PATCH" ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800"

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className={`${color} px-2 py-0.5 rounded text-xs font-bold w-16 text-center`}>{method}</span>
      <code className="text-sm font-mono">{path}</code>
      <span className="text-gray-500 text-sm ml-auto">{desc}</span>
    </div>
  )
}

export function ResourceSection({
  name, base, description, statuses, endpoints, createFields,
}: {
  name: string; base: string; description: string; statuses: string;
  endpoints: { method: string; path: string; desc: string }[];
  createFields: string;
}) {
  return (
    <div className="mt-8 border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-1">{name}</h3>
      <p className="text-gray-600 text-sm mb-1">{description}</p>
      <p className="text-gray-400 text-xs mb-4">Base: <code>{base}</code> &middot; Statuses: {statuses}</p>
      <div className="space-y-2 mb-4">
        {endpoints.map((e) => (
          <EndpointRow key={`${e.method}-${e.path}`} {...e} />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        <strong>Create fields:</strong> {createFields}
      </p>
    </div>
  )
}
