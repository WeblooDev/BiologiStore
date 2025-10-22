// components/CustomerServiceForm.tsx

import {useState} from 'react';

export function CustomerServiceForm() {
  const [questionType, setQuestionType] = useState('general');

  return (
    <div className="w-full lg:w-[50%] mx-auto p-6 pt-[220px] flex flex-col gap-4">
      <h2 className="!text-2xl font-bold mb-4">Customer Service</h2>
      <p>
        For any questions or assistance, please use the form below to contact
        our customer service team:
      </p>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-sm mb-1  " htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="First Name*"
            className="w-full border-b !rounded-none !px-0"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 " htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border-b p-2 !rounded-none !px-0"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 " htmlFor="phone">
            Phone* (optional)
          </label>
          <div className="flex items-center  border-b ">
            <input
              id="phone"
              type="tel"
              placeholder="Phone*"
              className="w-full !px-0"
            />
            <span className="pr-2">🇺🇸</span>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1  " htmlFor="order">
            Order Number (optional)
          </label>
          <input
            id="order"
            type="text"
            className="w-full  border-b  p-2 !rounded-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm ">Question Type</p>
          <div className="space-y-2">
            {[
              {label: 'General Questions and Comments', value: 'general'},
              {label: 'Ordering', value: 'ordering'},
              {label: 'Product Questions', value: 'product'},
              {label: 'Website Feedback', value: 'feedback'},
            ].map(({label, value}) => (
              <label
                key={value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${
                    questionType === value
                      ? 'bg-[#2B8C57] border-[#2B8C57]'
                      : ''
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <input
                  type="radio"
                  name="questionType"
                  value={value}
                  checked={questionType === value}
                  onChange={() => setQuestionType(value)}
                  className="hidden"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Enter your text..."
            maxLength={5000}
            className="w-full border p-2 !rounded-none h-28"
          />
          <p className="text-xs !text-[#7E8081] !mb-6">5000 characters left</p>
        </div>

        <button className="bg-[#2B8C57] w-full text-white p-2 uppercase">
          Send Message
        </button>

        <p className="text-xs mt-2">
          This site is protected by reCAPTCHA Enterprise and the Google{' '}
          <a href="#" className="underline text-[#2B8C57]">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-[#2B8C57]">
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </div>
    </div>
  );
}
