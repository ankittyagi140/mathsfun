'use client';

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { useTheme } from "../../context/ThemeContext";
import { Mail, MessageCircle, Phone, FileText, Plus, Minus, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How do I get started with MathsFun?",
    answer: "Start by exploring our dashboard where you'll find various math games and learning modules. Click on any app to begin learning. Your progress will be automatically tracked!"
  },
  {
    question: "Can I track my progress?",
    answer: "Yes! Your progress is automatically tracked in the Achievements section. You can see your completed modules, earned badges, and learning streaks."
  },
  {
    question: "How do I change the theme?",
    answer: "You can change the theme in the Settings page. We offer several color themes including Yellow, Green, Orange, and Light Blue to suit your preference."
  },
  {
    question: "Is my progress saved?",
    answer: "Yes, all your progress is automatically saved to your account. You can pick up right where you left off when you return."
  },
  {
    question: "How can I report a problem?",
    answer: "You can report any issues through our contact form below or by emailing support@mathsfun.com. Our team typically responds within 24 hours."
  }
];

const resources = [
  {
    title: "User Guide",
    description: "Complete guide to using MathsFun",
    icon: FileText,
    link: "/docs/user-guide"
  },
  {
    title: "Email Support",
    description: "Get help via email",
    icon: Mail,
    link: "mailto:support@mathsfun.com"
  },
];

export default function HelpPage() {
  const { currentTheme } = useTheme();
  const [openFAQs, setOpenFAQs] = useState<number[]>([]);
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Help & Support', path: '/help' }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={`flex flex-col min-h-screen ${currentTheme.mainBg}`}>
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            <Sidebar />
            <div className="flex-1">
              <div className="mb-8">
                <Breadcrumb items={breadcrumbItems} />
                <h1 className={`text-2xl font-bold ${currentTheme.textColor}`}>Help & Support</h1>
              </div>

              {/* Quick Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.link}
                      className={`${currentTheme.componentBg} p-4 rounded-lg border ${currentTheme.borderColor} hover:shadow-md transition-all duration-200 flex flex-col items-center text-center`}
                    >
                      <Icon className={`h-8 w-8 mb-2 ${currentTheme.textColor}`} />
                      <h3 className={`font-semibold ${currentTheme.textColor}`}>{resource.title}</h3>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      <ExternalLink className="h-4 w-4 mt-2 text-gray-400" />
                    </a>
                  );
                })}
              </div>

              {/* FAQs */}
              <div className={`${currentTheme.componentBg} rounded-lg border ${currentTheme.borderColor} p-6`}>
                <h2 className={`text-xl font-semibold mb-4 ${currentTheme.textColor}`}>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b last:border-b-0">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className={`w-full flex items-center justify-between py-4 ${currentTheme.textColor}`}
                      >
                        <span className="font-medium text-left">{faq.question}</span>
                        {openFAQs.includes(index) ? (
                          <Minus className="h-4 w-4 flex-shrink-0" />
                        ) : (
                          <Plus className="h-4 w-4 flex-shrink-0" />
                        )}
                      </button>
                      {openFAQs.includes(index) && (
                        <div className="pb-4">
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className={`${currentTheme.componentBg} rounded-lg border ${currentTheme.borderColor} p-6 mt-8`}>
                <h2 className={`text-xl font-semibold mb-4 ${currentTheme.textColor}`}>
                  Contact Support
                </h2>
                <form className="space-y-4">
                  <div>
                    <label className={`block mb-1 ${currentTheme.textColor}`}>Name</label>
                    <input
                      type="text"
                      className={`w-full p-2 rounded-md border ${currentTheme.borderColor} bg-white`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${currentTheme.textColor}`}>Email</label>
                    <input
                      type="email"
                      className={`w-full p-2 rounded-md border ${currentTheme.borderColor} bg-white`}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${currentTheme.textColor}`}>Message</label>
                    <textarea
                      className={`w-full p-2 rounded-md border ${currentTheme.borderColor} bg-white min-h-[100px]`}
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${currentTheme.activeBg} ${currentTheme.activeText} px-4 py-2 rounded-md hover:opacity-90 transition-opacity`}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}