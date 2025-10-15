import { BellIcon } from "@heroicons/react/24/outline";
import Logo from "@/components/Logo";

type HeaderProps = {
  name: string;
  email: string;
};

export const Header: React.FC<HeaderProps> = ({ name, email }) => {
  const acronym = name
    .split(" ")
    .map((palabra) => palabra[0])
    .join("");
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Logo slogan={true} />
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-100">
            <BellIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-medium text-gray-600">
              {acronym}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
