export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <section className="py-20 bg-slate-50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose dark:prose-invert">
          <p>
            At FutureBridge Technologies, accessible from futurebridgetechnologies.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by FutureBridge Technologies and how we use it.
          </p>
          
          <h2>Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <p>
            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
          </p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul>
            <li>Provide, operate, and maintain our website and placement services</li>
            <li>Improve, personalize, and expand our services</li>
            <li>Understand and analyze how you use our website</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service, updates, and marketing</li>
            <li>Send you emails</li>
            <li>Find and prevent fraud</li>
          </ul>

          <h2>Log Files</h2>
          <p>
            FutureBridge Technologies follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>
        </div>
      </section>
    </div>
  );
}
