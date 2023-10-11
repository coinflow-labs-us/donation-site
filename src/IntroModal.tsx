import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

export function IntroModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 ring-white/5 ring-[0.5px]" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg lg:text-xl font-bold leading-6 text-gray-900"
                  >
                    NJTG RELIEF FUND 🇮🇱
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 font-medium mb-5">
                      This initiative is to raise funds for critical tactical
                      gear for our soldiers on the front lines to be delivered
                      by US multisyllabic cargo plane tomorrow.
                    </p>
                    <p className="text-sm text-gray-500 font-medium mb-5">
                      We have specific gear requests, a ready supply line, a
                      chartered flight and all clearance ready!
                    </p>
                    <p className="text-sm lg:text-base text-blue-600 font-bold mb-5">
                      We NEED your support and funding!!!
                    </p>
                    <p className="text-sm text-gray-500 font-medium mb-5">
                      We are so grateful for the outpouring of love and support
                      we feel. We are raising 1.4 million US, so that we can
                      ship these to arrive before Shabbat!
                    </p>
                  </div>

                  <div
                    className={
                      "bg-blue-600 rounded-2xl p-4 px-6 hover:bg-blue-500 transition cursor-pointer w-min"
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className={
                        "text-sm font-semibold text-white whitespace-nowrap"
                      }
                    >
                      Donate now!
                    </span>
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
