export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Maths2Fun",
    "url": "https://maths2fun.com",

    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://maths2fun.com/search?q={search_term}",
      "query-input": "required name=search_term"

    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 