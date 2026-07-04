export function meta() {
  return [{ title: "Resume | Gracias Claude" }];
}

export default function Resume() {
  return (
    <main className="p-4 font-mono">
      <h1 className="text-3xl font-bold mb-4">Resume</h1>
      <a className="text-red-500 hover:underline" href="/images/graciasc.pdf" target="_blank" rel="noreferrer">
        Open resume PDF
      </a>
      <iframe className="mt-4 w-full h-screen border" src="/images/graciasc.pdf" title="Resume" />
    </main>
  );
}
