export default function TermsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Agreement Between User and maths4fun</h2>
          <p className="text-gray-600 mb-4">
            "maths4fun" is comprised of various Web pages operated by maths4fun and located at maths4fun.com. 
            maths4fun is offered to you conditioned on your acceptance of our Terms of Service without modification 
            of the terms, conditions and notices contained herein and applies to use of the free and paid versions 
            of maths4fun. Your use of maths4fun constitutes your agreement to all such terms, conditions and notices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Website Content</h2>
          <p className="text-gray-600 mb-4">
            Multimedia content such as games, activities, videos and printables are strictly intended for online use only. 
            You may not download, copy, reproduce, change, transmit, record, distribute or create derivative works of our 
            content without written permission from maths4fun. The content on maths4fun may only be shown on domains owned 
            by maths4fun. You may not display our proprietary and/or licensed content on any website or online platform, 
            either directly or through the use of iFrames.
          </p>
          {/* Add other content sections following the same pattern */}
        </section>

        {/* Add remaining sections using the same structure */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-600">
            All inquiries concerning maths4fun and its policies may be sent to: 
            <a href="mailto:help@maths4fun.com" className="text-yellow-600 hover:text-yellow-700">
              help@maths4fun.com
            </a>
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 