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
        <div
          className={`lg:px-6 py-2 my-2 px-4 border-b-2 ${border} flex items-center justify-between`}
        >
          <div>
            <h1
              className="text-black hover:text-red-500"
              onClick={() => close()}
            >
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
              <i
                className={`fa ${open ? "fa-times float-right" : "fa-bars"} fa-lg cursor-pointer`}
              />
            </button>
          </div>

          <nav className="hidden cursor-pointer items-center gap-4 lg:flex">
            <Link
              className={`a-no-style border-b-2 border-transparent leading-none hover:border-red-400 ${active === "about" ? "border-red-400" : ""}`}
              onClick={() => close("about")}
              to="/about"
            >
              About
            </Link>
            <a
              target="_blank"
              rel="noreferrer"
              className="a-no-style border-b-2 border-transparent leading-none hover:border-red-400"
              href="/images/graciasc.pdf"
              download
            >
              Resume
            </a>
            <div className="ml-1 flex items-center gap-2">
              <a
                target="_blank"
                rel="noreferrer"
                className="a-no-style flex h-9 w-9 items-center justify-center"
                href="https://github.com/graciasc"
                aria-label="GitHub"
              >
                <i
                  className="fa fa-github fa-2x text-black hover:text-gray-700"
                  aria-hidden="true"
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                className="a-no-style flex h-9 w-9 items-center justify-center"
                href="https://www.linkedin.com/in/gracias-claude/"
                aria-label="LinkedIn"
              >
                <i
                  className="fa fa-linkedin-square fa-2x text-blue-600 hover:text-blue-800"
                  aria-hidden="true"
                />
              </a>
            </div>
          </nav>
        </div>
      </div>

      {open && (
        <div className="px-3 font-mono grid">
          <nav className="cursor-pointer block">
            <ul>
              <li
                className={`table border-transparent border-b-2 hover:border-red-400 ${active === "about" ? "border-red-400" : ""}`}
              >
                <Link
                  onClick={() => close("about")}
                  className="a-no-style"
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li
                className={`table border-transparent border-b-2 hover:border-red-400 ${active === "resume" ? "border-red-400" : ""}`}
              >
                <a
                  onClick={() => close("resume")}
                  target="_blank"
                  rel="noreferrer"
                  className="a-no-style"
                  href="/images/graciasc.pdf"
                  download
                >
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
