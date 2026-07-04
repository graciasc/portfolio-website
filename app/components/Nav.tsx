import { useState } from "react";
import { Link } from "react-router";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<"about" | "resume" | "">("");

  const border = open ? "border-red-600" : "border-gray-600";

  function close(menu: "about" | "resume" | "" = "") {
    setOpen(false);
    setActive(menu);
  }

  return (
    <main>
      <div className="flex-1 font-mono">
        <div className={`lg:px-6 py-2 my-2 px-4 border-b-2 ${border} flex justify-between`}>
          <div>
            <h1 className="text-black hover:text-red-500" onClick={() => close()}>
              <Link className="a-no-style" to="/">
                Gracias
              </Link>
            </h1>
          </div>

          <div className="inline lg:hidden mt-1 ml-2">
            <button
              type="button"
              className="bg-transparent border-0 p-0 m-0"
              aria-label="Toggle menu"
              onClick={() => setOpen((value) => !value)}
            >
              <i className={`fa ${open ? "fa-times float-right" : "fa-bars"} fa-lg cursor-pointer`} />
            </button>
          </div>

          <div className="lg:block lg:float-right hidden cursor-pointer">
            <p className={`px-2 inline border-transparent border-b-2 hover:border-red-400 ${active === "about" ? "border-red-400" : ""}`}>
              <Link className="a-no-style" onClick={() => close("about")} to="/about">
                About
              </Link>
            </p>
            <p className="px-2 inline border-transparent border-b-2 hover:border-red-400">
              <a target="_blank" rel="noreferrer" className="a-no-style" href="/images/graciasc.pdf" download>
                Resume
              </a>
            </p>
            <p className="px-1 border-transparent inline border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none">
              <a target="_blank" rel="noreferrer" className="a-no-style" href="https://github.com/graciasc" aria-label="GitHub">
                <i className="fa fa-github fa-2x text-black hover:text-gray-700 bg-white" />
              </a>
            </p>
            <p className="px-1 border-transparent inline border-b-2 bottom-1 relative hover:border-teal-600 focus:outline-none outline-none">
              <a target="_blank" rel="noreferrer" className="a-no-style" href="https://www.linkedin.com/in/gracias-claude/" aria-label="LinkedIn">
                <i className="fa fa-linkedin-square fa-2x text-blue-600 hover:text-blue-800 bg-white" />
              </a>
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div className="px-3 font-mono grid">
          <nav className="cursor-pointer block">
            <ul>
              <li className={`table border-transparent border-b-2 hover:border-red-400 ${active === "about" ? "border-red-400" : ""}`}>
                <Link onClick={() => close("about")} className="a-no-style" to="/about">
                  About
                </Link>
              </li>
              <li className={`table border-transparent border-b-2 hover:border-red-400 ${active === "resume" ? "border-red-400" : ""}`}>
                <a onClick={() => close("resume")} target="_blank" rel="noreferrer" className="a-no-style" href="/images/graciasc.pdf" download>
                  Resume
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </main>
  );
}
