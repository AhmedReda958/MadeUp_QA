import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { TwitterShareButton, XIcon } from "react-share";

function ShareDialog() {
  const [opened, setOpened] = useState(false);
  const share = useSelector((state) => state.app.share);

  function closeModal() {
    setOpened(false);
  }

  function openModal() {
    setOpened(true);
  }

  useEffect(() => {
    if (share) {
      openModal();
      console.log(share);
    }
  }, [share]);
  return (
    <>
      <Transition appear show={opened} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share
                  </Dialog.Title>
                  <div className="flex mt-4">
                    <TwitterShareButton url={share?.url} title={share?.text}>
                      <XIcon size={32} round />
                    </TwitterShareButton>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ShareDialog;
