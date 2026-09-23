import { HelpCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      category: 'Orders & Delivery',
      questions: [
        {
          q: 'How long does delivery take?',
          a: 'We typically deliver within 3-5 business days within Pakistan. Delivery times may vary based on your location and product availability.',
        },
        {
          q: 'What are the delivery charges?',
          a: 'Delivery is FREE on all orders above Rs. 500. For orders below Rs. 500, a delivery fee of Rs. 100 is applied.',
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! Once your order is confirmed, you can track its status from the "My Orders" section in your account. You\'ll also receive updates via email.',
        },
        {
          q: 'What cities do you deliver to?',
          a: 'We currently deliver to all major cities across Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, and more.',
        },
      ],
    },
    {
      category: 'Payment',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept SafePay (online payments), JazzCash (bank transfer with screenshot verification), and Cash on Delivery (COD).',
        },
        {
          q: 'Is Cash on Delivery available?',
          a: 'Yes, Cash on Delivery is available for all orders. You can pay when your order arrives at your doorstep.',
        },
        {
          q: 'How does JazzCash payment work?',
          a: 'For JazzCash, you\'ll transfer the amount to our account and upload a screenshot of the payment confirmation. Once verified, your order will be processed.',
        },
        {
          q: 'Are online payments secure?',
          a: 'Absolutely! We use SafePay, a trusted Pakistani payment gateway, ensuring your transactions are completely secure and encrypted.',
        },
      ],
    },
    {
      category: 'Products & Returns',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 7-day return policy for defective or damaged products. Please contact us within 7 days of receiving your order with photos of the issue.',
        },
        {
          q: 'How do I return a product?',
          a: 'Contact our support team via phone, email, or WhatsApp with your order details and reason for return. We\'ll guide you through the process.',
        },
        {
          q: 'Are all products brand new?',
          a: 'Yes, all our products are 100% brand new and sourced directly from trusted manufacturers and suppliers.',
        },
        {
          q: 'Do you offer warranty on products?',
          a: 'Warranty varies by product. Electronic items typically come with manufacturer warranty. Check individual product pages for specific warranty information.',
        },
      ],
    },
    {
      category: 'Account & Coupons',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on the user icon in the header and select "Sign In". You can create a new account using your email address.',
        },
        {
          q: 'How do I apply a coupon code?',
          a: 'During checkout, you\'ll see a "Have a coupon code?" section. Enter your code there and click Apply to get your discount.',
        },
        {
          q: 'Why is my coupon code not working?',
          a: 'Coupons may have minimum order requirements, expiry dates, or usage limits. Check the coupon terms or contact support for help.',
        },
        {
          q: 'How do I reset my password?',
          a: 'On the sign-in page, click "Forgot Password" and enter your email. You\'ll receive a link to reset your password.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-canvas-parchment py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary-subtle mb-4">
              <HelpCircle className="h-8 w-8 text-ink" />
            </div>
            <h1 className="font-display text-3xl font-bold text-ink mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-ink-muted max-w-2xl mx-auto">
              Find answers to common questions about orders, payments, delivery, and more.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="font-display text-2xl font-bold text-ink mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {section.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${section.category}-${index}`}
                      className="bg-background border border-hairline rounded-lg px-4 shadow-card"
                    >
                      <AccordionTrigger className="text-left font-semibold text-ink hover:text-primary transition-fast">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-ink-secondary">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* Still need help */}
            <div className="text-center py-8 px-6 bg-background rounded-xl">
              <h3 className="font-display text-xl font-bold text-ink mb-2">
                Still have questions?
              </h3>
              <p className="text-ink-muted mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
