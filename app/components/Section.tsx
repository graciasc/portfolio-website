export function Section() {
  function autoScroll() {
    window.scrollTo({ top: 605, behavior: "smooth" });
  }

  return (
    <main>
      <div className="flex justify-center pt-24 font-mono">
        <div className="m-6 lg:m-12 text-center lg:w-1/2">
          <p className="text-p-hue">
            Hi I am <span className="text-red-600"> Gracias Claude </span>
          </p>
          <h1 className="text-h-hue lg:text-3xl text-4xl font-extrabold">
            I'll Help You Build Your Dream
          </h1>
          <p className="text-p-hue">
            I've been building Web Apps since 2016 and would <span className="text-gray-400">&quot;</span>
            <span className="text-red-600">Love</span>
            <span className="text-gray-400">&quot;</span> to help you build your next big idea!
          </p>
          <p className="mt-4 border-b-2 font-bold cursor-pointer hover:border-red-400 focus:outline-none inline-block lg:mt-4 hover:shadow-sm">
            Connect with me <i className="fa fa-long-arrow-right text-gray-400 hover:text-red-400" />
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-12 lg:mt-2 cursor-pointer" onClick={autoScroll}>
        <i className="fa fa-angle-double-down animate-bounce fa-2x text-gray-600 hover:text-red-400" />
      </div>
    </main>
  );
}
