import { Link, useNavigate } from "react-router-dom";
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <main className="grid min-h-full place-items-center bg-[#006838] py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-[#2B78C0]">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#fff] sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/dashboard"
            className="rounded-md bg-[#2B78C0] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
};
export default PageNotFound;
