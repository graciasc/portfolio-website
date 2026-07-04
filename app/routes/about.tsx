const skills = ["REACT", "JAVA", "JS", "CSS", "C++", "NODEJS", "SWIFT", "C", "C#"];

export function meta() {
  return [{ title: "About | Gracias Claude" }];
}

export default function About() {
  return (
    <main className="bg-white font-mono text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[420px_1fr]">
          <div className="w-full">
            <img
              className="mx-auto aspect-square w-full max-w-80 rounded-3xl object-cover object-center shadow-lg lg:mx-0 lg:h-[420px] lg:w-[420px] lg:max-w-none"
              src="/images/gracias.jpg"
              alt="Gracias Claude profile"
            />
          </div>

          <div>
            <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
              Hello World!
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-gray-700 lg:text-2xl">
              I have a desire to excel and continuously improve in my work. Learn more about my journey below.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-10 rounded-3xl bg-gray-50 p-8 shadow-sm lg:grid-cols-[1fr_420px] lg:p-12">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight lg:text-6xl">
              My Career <br /> So Far!
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
              Always up for a challenge, I have worked for start-ups while attending University. Currently, I work as a Software Engineer for a widely innovative fintech company.
            </p>
          </div>

          <div className="flex flex-wrap content-start gap-3">
            {skills.map((skill) => (
              <span
                className="rounded-full border border-red-400 bg-white px-5 py-2 text-sm font-medium text-gray-700"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
