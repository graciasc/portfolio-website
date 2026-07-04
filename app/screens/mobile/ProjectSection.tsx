type Project = {
  title: string;
  text: string;
  img: string;
};

export function ProjectSection({ projects }: { projects: Project[] }) {
  return (
    <main>
      {projects.map((project) => (
        <div className="bg-main relative lg:hidden" key={`${project.title}-${project.img}`}>
          <div className="pl-6">
            <h1 className="text-h-hue text-2xl font-bold leading-9 pt-4">{project.title}</h1>
            <p className="text-p-hue pt-2">{project.text}</p>
            <button type="button" />
          </div>
          <div className="relative h-48 m-5">
            <img className="absolute inset-0 w-full h-full object-cover object-center" src={project.img} alt={project.title} />
          </div>
        </div>
      ))}
    </main>
  );
}
