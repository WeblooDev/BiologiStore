import {useState} from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  json: string;
}

export function ProductFAQ({json}: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  let faqs: FAQItem[] = [];

  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      faqs = parsed as FAQItem[];
    }
  } catch (e) {
    console.error('❌ Invalid FAQ JSON', e);
    return null;
  }

  if (!faqs.length) {
    return null;
  }

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-6 py-16">
      <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
        Frequently Asked Questions
      </h2>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left py-4 hover:text-[#2B8C57] transition-colors cursor-pointer"
            >
              <span className="text-base md:text-lg font-normal pr-8">
                {faq.question}
              </span>
              <span className="text-2xl flex-shrink-0 transition-transform duration-300">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="pb-4 text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
