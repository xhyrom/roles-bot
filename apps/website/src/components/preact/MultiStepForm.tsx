import { useState, useEffect } from "preact/hooks";

const steps = [
  { id: 1, name: "Select Channel" },
  { id: 2, name: "Add Buttons/Dropdowns" },
  { id: 3, name: "Set Message Content" },
  { id: 4, name: "Send" },
];

const MultiStepForm = ({ guildId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch(`/api/guild/${guildId}/channels`)
      .then((response) => response.json())
      .then((data) => setChannels(data));
  }, [guildId]);

  const nextStep = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-lg bg-gray-800 p-6 text-white shadow-lg">
      <div className="relative pt-1">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-right">
            <span className="inline-block text-xs font-semibold text-green-400">
              Step {currentStep} of {steps.length}
            </span>
          </div>
        </div>
        <div className="mb-4 flex h-2 overflow-hidden rounded bg-gray-700 text-xs">
          <div
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
            className="flex flex-col justify-center whitespace-nowrap bg-green-500 text-center text-white shadow-none"
          ></div>
        </div>
      </div>

      {currentStep === 1 && (
        <div>
          <label className="mb-2 block">Select Channel:</label>
          <select className="mb-4 w-full rounded border border-gray-600 bg-gray-700 p-2">
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
          <button
            onClick={nextStep}
            className="mt-4 w-full rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <label className="mb-2 block">Add Buttons/Dropdowns:</label>
          {/* Add buttons or dropdowns here */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="mt-4 w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="mt-4 w-full rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <label className="mb-2 block">Set Message Content:</label>
          {/* Set message content, embed, etc. here */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="mt-4 w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="mt-4 w-full rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div>
          <label className="mb-2 block">Review and Send:</label>
          {/* Send message here */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="mt-4 w-full rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back
            </button>
            <button className="mt-4 w-full rounded bg-white px-4 py-2 text-gray-800 hover:bg-gray-200">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
