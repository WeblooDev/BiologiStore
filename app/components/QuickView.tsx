import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {motion, AnimatePresence} from 'framer-motion';
import close from '~/assets/images/closee.svg';
import bullet from '~/assets/images/bulle.svg';
import dayUseSvg from '~/assets/images/dayuse.svg';
import nightUseSvg from '~/assets/images/nightuse.svg';

type Product = {
  id: string;
  handle: string;
  title: string;
  tags?: string[];
  descriptionHtml?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants?: {
    nodes?: Array<{
      id?: string;
      title?: string;
      selectedOptions?: Array<{
        name: string;
        value: string;
      }>;
    }>;
  };
  metafield?: {
    value?: string;
  };
  skinConcern?: {
    value?: string;
  };
  dayUse?: {
    value?: string;
  };
  nightUse?: {
    value?: string;
  };
  fdaApproved?: {
    value?: string;
  };
};

type QuickViewProps = {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
};

export function QuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewProps) {
  if (!isOpen) return null;

  // Parse metafield values
  const parseSkinConcern = () => {
    try {
      const raw = product?.skinConcern?.value;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const parseDayUse = () => {
    try {
      const raw = product?.dayUse?.value;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return product?.dayUse?.value;
    }
  };

  const parseNightUse = () => {
    try {
      const raw = product?.nightUse?.value;
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return product?.nightUse?.value;
    }
  };

  const parseFdaApproved = () => {
    try {
      const raw = product?.fdaApproved?.value;
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed === true || parsed === 'true';
    } catch (e) {
      const raw = product?.fdaApproved?.value;
      return raw === 'true' || raw === true;
    }
  };

  const skinConcern = parseSkinConcern();
  const dayUse = parseDayUse();
  const nightUse = parseNightUse();
  const fdaApproved = parseFdaApproved();

  const image = product.featuredImage;
  const variantTitle = product.variants?.nodes?.[0]?.title;
  const sizeOption = product.variants?.nodes?.[0]?.selectedOptions?.find(
    (opt) => opt.name.toLowerCase() === 'size',
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <AnimatePresence>
        <motion.div
          initial={{scale: 0.9, opacity: 0, y: 20}}
          animate={{scale: 1, opacity: 1, y: 0}}
          exit={{scale: 0.95, opacity: 0, y: 10}}
          transition={{duration: 0.3, ease: [0.4, 0, 0.2, 1]}}
          className="bg-white rounded-lg relative flex flex-col md:flex-row shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Image */}
          <div className="w-full md:w-[45%] h-64 md:h-auto bg-[#F6F6F6] relative overflow-hidden">
            {image && (
              <img
                src={image.url}
                alt={image.altText || ''}
                className="w-full h-full object-cover"
              />
            )}
            {product.metafield?.value === 'true' && (
              <div className="absolute top-4 left-4 bg-white h-16 w-16 border-2 border-[#2B8C57] text-[#2B8C57] rounded-full flex items-center justify-center text-xs font-semibold">
                NEW
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-[55%] flex flex-col p-6 md:p-8 overflow-y-auto">
            <div className="flex-1">
              <h3 className="text-left font-poppins text-2xl md:text-3xl font-semibold text-[#2B8C57] mb-3">
                {product.title}
              </h3>

              {/* Tags, Skin Concerns, Day/Night Use, FDA */}
              <div className="flex flex-row gap-2 items-center justify-start mb-4">
                {product.tags &&
                  product.tags.length > 0 &&
                  product?.bundle?.value === 'true' && (
                    <>
                      {product.tags.map((tag, index) => (
                        <div key={tag} className="flex items-center gap-1">
                          <span className="text-xs px-3 py-1 bg-[#F6F6F6] text-[#4F4F4F] rounded-full">
                            {tag}
                          </span>
                          {index < product.tags!.length - 1 && (
                            <span className="text-xs text-[#4F4F4F]">+</span>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                {skinConcern.length > 0 && (
                  <div className="flex items-center gap-2 justify-center">
                    {/* <img src={bullet} alt="" className="w-[6px] h-[6px]" /> */}
                    {skinConcern.map((concern, index) => (
                      <div
                        key={String(concern)}
                        className="flex items-center gap-1"
                      >
                        <span className="text-xs px-3 py-1 bg-[#F6F6F6] text-[#4F4F4F] rounded-full">
                          {String(concern)}
                        </span>
                        {index < skinConcern.length - 1 && (
                          <span className="text-xs text-[#4F4F4F]">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {(dayUse || nightUse) && (
                  <div className="flex items-center gap-2 justify-center">
                    <img src={bullet} alt="" className="w-[6px] h-[6px]" />
                  </div>
                )}
                {dayUse && (
                  <div className="flex items-center">
                    <img src={dayUseSvg} alt="Day Use" className="h-5" />
                  </div>
                )}
                {nightUse && (
                  <div className="flex items-center">
                    <img src={nightUseSvg} alt="Night Use" className="h-5" />
                  </div>
                )}

                {fdaApproved && (
                  <>
                    <div className="flex items-center gap-2 justify-center">
                      <img src={bullet} alt="" className="w-[6px] h-[6px]" />
                    </div>
                    <span className="text-xs px-3 py-1 bg-[#F6F6F6] text-[#4F4F4F] rounded-full">
                      FDA Approved
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-2xl font-semibold text-[#2B8C57]">
                  <Money data={product.priceRange.minVariantPrice as any} />
                </p>
                {sizeOption && (
                  <span className="text-sm text-gray-500">
                    • {sizeOption.value}
                  </span>
                )}
              </div>

              {product.descriptionHtml && (
                <div
                  className="text-left text-gray-600 text-sm leading-relaxed mb-6 prose prose-sm prose-p:text-sm max-w-none"
                  dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                />
              )}
            </div>

            <div className="space-y-3 mt-auto pt-4 border-t">
              <button
                className="w-full bg-[#2B8C57] text-white uppercase font-medium text-sm px-6 py-3 rounded hover:bg-[#236b45] transition-colors duration-200 cursor-pointer"
                onClick={onAddToCart}
              >
                Add to Cart
              </button>

              <Link
                to={`/products/${product.handle}`}
                className="block text-center text-[#2B8C57] hover:text-[#236b45] text-sm font-medium transition-colors duration-200"
              >
                View Full Details →
              </Link>
            </div>
          </div>

          {/* Close button */}
          <button
            className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer z-10"
            onClick={onClose}
            aria-label="Close"
          >
            <img src={close} className="h-5 w-5" alt="Close" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
