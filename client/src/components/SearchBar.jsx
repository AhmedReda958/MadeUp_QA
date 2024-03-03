import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import axios from "axios";
import ProfilePic from "./ProfilePic";

export default function SearchBar() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const doSearch = () => {
    axios
      .get("/users/search", { params: { username: query } })
      .then((res) => {
        setUsers(res.data);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const timer = setTimeout(() => query.length > 1 && doSearch(), 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-dark text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-3  pl-5 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              placeholder="Search for users or friend"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-6">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-4/6 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-20">
              {users.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  User not found.
                </div>
              ) : (
                users.map((user) => (
                  <Combobox.Option
                    key={user.id}
                    className={({ active }) =>
                      `relative cursor-default select-none ps-2 py-2 pr-4 ${
                        active ? "bg-dark-alt text-white" : "text-gray-900"
                      }`
                    }
                    value={user}
                  >
                    {({ selected, active }) => (
                      <Link to={`/${user.username}`}>
                        <div className="flex gap-2">
                          <div>
                            <ProfilePic
                              data={user}
                              className="w-12 h-12"
                              border={false}
                            />
                          </div>
                          <div className="w-full">
                            <div className="truncate font-bold font-display">
                              {user.fullName}
                            </div>
                            <div className="truncate text-sm text-body-alt pe-6 ">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
