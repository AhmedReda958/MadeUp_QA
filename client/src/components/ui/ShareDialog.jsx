import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";
import { LinkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { copyToClipboard, share } from "@/utils/helpers";

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
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-5 text-gray-900"
                  >
                    Share via
                  </Dialog.Title>
                  <div
                    className="flex mt-4 justify-between"
                    onClick={() =>
                      copyToClipboard(share?.text + "\n" + share?.url)
                    }
                  >
                    <div className="text-center text-xs">
                      <div className="w-11 h-11 p-2 border rounded-full">
                        <LinkIcon className="w-6 h-6" />
                      </div>
                      <span>Copy</span>
                    </div>

                    <div className="text-center text-xs">
                      <div>
                        <TwitterShareButton
                          url={share?.url}
                          title={share?.text}
                        >
                          <XIcon size={40} round />
                        </TwitterShareButton>
                      </div>
                      <span>Twitter</span>
                    </div>
                    <div className="text-center text-xs">
                      <div>
                        <FacebookShareButton
                          url={share?.url}
                          title={share?.text}
                        >
                          <FacebookIcon size={40} round />
                        </FacebookShareButton>
                      </div>
                      <span>Facebook</span>
                    </div>
                    <div className="text-center text-xs">
                      <div>
                        <TelegramShareButton
                          url={share?.url}
                          title={share?.text}
                        >
                          <TelegramIcon size={40} round />
                        </TelegramShareButton>
                      </div>
                      <span>Telegram</span>
                    </div>
                    <div className="text-center text-xs">
                      <div>
                        <WhatsappShareButton
                          url={share?.url}
                          title={share?.text}
                        >
                          <WhatsappIcon size={40} round />
                        </WhatsappShareButton>
                      </div>
                      <span>Whatsapp</span>
                    </div>
                  </div>
                  <div className="flex mt-4 justify-start gap-4">
                    <div className="text-center text-xs">
                      <div>
                        <LinkedinShareButton
                          url={share?.url}
                          title={share?.text}
                        >
                          <LinkedinIcon size={40} round />
                        </LinkedinShareButton>
                      </div>
                      <span>LinkedIn</span>
                    </div>
                    <div
                      className="text-center text-xs"
                      onClick={() => share(share?.url, "MadeUp", share?.text)}
                    >
                      <div className="w-11 h-11 p-2 border rounded-full bg-maincolor">
                        <EllipsisHorizontalIcon className="w-6 h-6" />
                      </div>
                      <span>More</span>
                    </div>
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
