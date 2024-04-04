import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import underConstractionImg from "@/assets/imgs/underConstraction.svg";
import sounds from "@/utils/assets/sounds";

export default function AlertDialog() {
  const alerts = useSelector((state) => state.app.alerts);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (alerts.length > 0) {
      setAlert(alerts[alerts.length - 1]);
      setIsOpen(true);
      playSound(alerts[alerts.length - 1].type);
      // setTimeout(() => {
      //   setIsOpen(false);
      // }, 1000);
    }
  }, [alerts]);

  const playSound = (type) => {
    switch (type) {
      case "success":
        sounds.success.play();
        break;
      case "error":
        sounds.error.play();
        break;
      case "warn":
        sounds.warn.play();
        break;
      default:
        break;
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const ModalIcon = () => {
    switch (alert.type) {
      case "success":
        return (
          <i className="fa fa-check-circle fa-2x text-green-500 me-3 mb-3"></i>
        );
      case "error":
        return (
          <i className="fa fa-circle-exclamation fa-2x text-red-500 me-3 mb-3"></i>
        );
      case "warn":
        return (
          <i className="fa fa-triangle-exclamation fa-2x text-orange-500 me-3 mb-3"></i>
        );
      case "comingsoon":
        return (
          <img
            src={underConstractionImg}
            alt="coming soon"
            className="w-60 mb-4"
          />
        );

      default:
        break;
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center flex-col"
                  >
                    <ModalIcon />
                    {alert.title || ""}
                  </Dialog.Title>
                  <div className="mt-2">{alert.message || ""}</div>
                  {/*                   
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
