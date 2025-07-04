import { useEffect, useRef, useState } from "react";
import slider from '~/assets/images/slider.svg';

interface ExpectationBlock {
  title: string;
  description: string;
}

interface ProductExpectationProps {
  json: string;
  beforeAfter?: string[]; // [before, after]
  expectImage?: {
    title: string;
    featuredImage?: {
      url: string;
      altText?: string;
    };
  }[];
}

export function ProductExpectation({ json, beforeAfter, expectImage }: ProductExpectationProps) {

  let expectations: ExpectationBlock[] = [];

  try {
    expectations = JSON.parse(json);
  } catch (e) {
    console.error("Invalid expectations JSON", e);
    return null;
  }

  if (!expectations.length) return null;

  return (
    <section className="mt-12 bg-[#F2F2F2] w-full !py-16">
      <div className="container !p-5 m-auto flex flex-col justify-between lg:flex-row gap-12 ">
        {beforeAfter && beforeAfter.length === 2 && (
          <BeforeAfterSlider before={beforeAfter[0]} after={beforeAfter[1]} />
        )}

        <div className="flex flex-col gap-5 justify-between">
                  <h2 className="text-2xl font-semibold mb-6">What to Expect</h2>

          {expectations.map((item, index) => (
            <div key={index} className="flex flex-col gap-1 ">
              <h3 className="font-semibold text-black">{item.title}</h3>
              <p >{item.description}</p>
            </div>
          ))}
          <div>
  {expectImage?.length > 0 && (
  
    <div className="flex flex-col gap-2">
          <p className="!text-base font-semibold !m-0">PRODUCT REGIMEN</p>
          <div className="flex gap-6">
      {expectImage.map((product, index) => (
        <div key={index} className="flex flex-col">
          
          {product.featuredImage?.url && (
            <div className="bg-white">
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              className="w-[100px] h-[130px] object-cover"
            />
            </div>
            
          )}
                      <h4 className="font-gayathri mt-2 !text-base text-[#2B8C57]">{product.title}</h4>

          
        </div>
      ))}
      </div>
    </div>
  )}
</div>

        </div>
        
       
      </div>
    </section>
  );
}

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const sliderRef = useRef<HTMLInputElement>(null);
  const imgAfterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const imgAfter = imgAfterRef.current;
    const line = lineRef.current;

    if (!slider || !imgAfter || !line) return;

    const handleInput = () => {
      const value = slider.value;
      line.style.left = `${value}%`;
      imgAfter.style.clipPath = `inset(0px 0px 0px ${value}%)`;
    };

    const handleDoubleClick = () => {
      slider.value = "50";
      line.style.left = "50%";
      imgAfter.style.clipPath = "inset(0px 0px 0px 50%)";
    };

    slider.addEventListener("input", handleInput);
    slider.addEventListener("dblclick", handleDoubleClick);

    return () => {
      slider.removeEventListener("input", handleInput);
      slider.removeEventListener("dblclick", handleDoubleClick);
    };
  }, []);

  return (
    <div
      id="container"
      aria-label="Before and after image slider"
      className="relative flex w-[clamp(20rem,75vw,40rem)] max-h-[95vh] aspect-[3/3]"
    >

        <p className="font-gayathri absolute bottom-[-2rem] left-[20%] text-sm">Baseline</p>
        <p className="font-gayathri absolute bottom-[-2rem] right-[20%] text-sm">Week 4</p>

      <div className="img-wrapper absolute w-full h-full overflow-hidden">
        <img src={before} alt="Before" className="w-full h-full object-cover" />
      </div>
      <div
        ref={imgAfterRef}
        className="img-wrapper absolute w-full h-full overflow-hidden"
        style={{ clipPath: "inset(0px 0px 0px 50%)" }}
      >
        <img src={after} alt="After" className="w-full h-full object-cover" />
      </div>
      <div
        ref={lineRef}
        id="line"
        className="absolute h-full w-[0.2rem] bg-[#FAFAFA]"
        style={{ left: "50%", transform: "translateX(-50%)" }}
      ></div>
      <input
        ref={sliderRef}
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="absolute left-[-1.125rem] w-[calc(100%+2.25rem)] h-full bg-transparent appearance-none"
        style={{ writingMode: "bt-lr" }}
      />
      <style jsx>{`
        input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 2.25rem;
          width: 2.25rem;
          border: 0.25rem solid #fff;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
    background-image: url(${slider});
          background-size: cover;
          cursor: grab;
        }

        input:active::-webkit-slider-thumb {
          cursor: grabbing;
        }

        input::-moz-range-thumb {
          height: 2.25rem;
          width: 2.25rem;
          border: 0.25rem solid #fff;
          border-radius: 50%;
          background-color: #fff;
          box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
          background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23000'%3E%3Cpath d='M286.15-293.85 100-479.62l185.77-185.76 42.15 41.76-113 113.62h530.16l-113-113.62 42.15-41.76L860-479.62 674.23-293.85l-42.54-41.77 113.39-114H214.54l113.38 114-41.77 41.77Z'/%3E%3C/svg%3E");
          background-size: cover;
          cursor: grab;
        }

        input:active::-moz-range-thumb {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
