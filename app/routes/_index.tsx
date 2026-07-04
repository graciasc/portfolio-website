import { Section } from "../components/Section";
import { ProjectSection } from "../screens/mobile/ProjectSection";

const projects = [
  {
    title: "Coming Soon!",
    text: "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1",
  },
  {
    title: "Coming Soon!",
    text: "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FnAH-eq7zgKk%2Fmaxresdefault.jpg&f=1&nofb=1",
  },
];

export function meta() {
  return [
    { title: "Gracias Claude" },
    { name: "description", content: "Gracias Claude portfolio" },
  ];
}

export default function Main() {
  return (
    <main>
      <Section />
      <div className="border-b-2 border-gray-700 pt-6 lg:p-12" />

      {projects.map((project, index) => (
        <div className="lg:flex justify-center m-5 lg:m-24 bg-main relative hidden animate-fade-in" id={`section${index}`} key={`${project.title}-${index}`}>
          <div className="w-1/2 p-6">
            <h1 className="text-h-hue text-4xl font-bold leading-9 pt-4">{project.title}</h1>
            <p className="text-p-hue text-lg pt-6">{project.text}</p>
            <button type="button" />
          </div>
          <div className="w-1/2 relative p-24">
            <img className="absolute inset-0 w-full h-full object-cover object-center" src={project.img} alt={project.title} />
          </div>
        </div>
      ))}

      <ProjectSection projects={projects} />
    </main>
  );
}
