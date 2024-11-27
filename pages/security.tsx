import Layout from "../components/Layout";

const SecurityPage = () => {
  return (
    <Layout title="Security" bannerTitle="Security">
      <div className="mt-40 mx-48 lg:mx-80 mb-40">
        <h2 className="text-4xl font-bold mb-4">Security Information</h2>
        <p className="text mb-16">
          At the heart of our operations is a commitment to providing secure and
          reliable services. We leverage enterprise-grade hardware from trusted
          and reputable hosting providers for our validator infrastructure. Our
          setup is designed with redundancy in mind, featuring fallback servers
          and snapshot backups to guarantee uninterrupted uptime.
        </p>

        <h3 className="text-3xl font-bold mb-4">Our Security Measures</h3>
        <div>
          We prioritize security at every level to safeguard our infrastructure
          from potential threats. To ensure the integrity and reliability of our
          validator, we employ industry-best practices and continually refine
          our methods.
        </div>
        <div>Here’s how we secure our systems:</div>
        <div className="mt-4 font-bold">Regular Updates and Patching</div>
        <div>
          We keep the operating system and all applications on our servers up to
          date with the latest security patches to defend against
          vulnerabilities.
        </div>
        <div className="mt-4 font-bold">Firewall Protection</div>
        <div>
          Our servers are configured with strict firewall rules, allowing only
          the necessary ports and protocols while blocking all unauthorized
          access attempts.
        </div>
        <div className="mt-4 font-bold">Continuous Monitoring and Alerts</div>
        <div>
          We use advanced monitoring tools to keep a constant eye on the
          system’s performance and security. Real-time alerts enable us to
          respond promptly to any suspicious activity. By combining robust
          infrastructure with comprehensive security protocols, we ensure our
          validator operates securely and reliably, offering peace of mind to
          our stakeholders.
        </div>

        <h3 className="text-3xl font-bold mb-4 mt-16">Contact Us</h3>
        <div>
          We value your feedback and input on security-related matters. If you
          have any concerns, questions, or inquiries about the security of our
          validator, please don’t hesitate to reach out to us: 
				</div>
				<div className="mx-8 my-4">
				Email: security@ivyoracle.xyz
				</div>
        <div>
				  We’re committed to addressing your concerns promptly and
          ensuring the highest level of security for our systems.
        </div>
      </div>
    </Layout>
  );
};

export default SecurityPage;
