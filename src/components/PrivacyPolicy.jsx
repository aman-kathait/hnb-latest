import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HnbLogo from "../assets/hnblogo.png";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src={HnbLogo} alt="HNB Connect Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">HNB Connect Privacy Policy</h1>
        </div>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="font-medium text-yellow-700">
            ⚠️ DEMO VERSION - This is a temporary privacy policy for development 
            purposes only. The official policy will be established in consultation 
            with university administration and legal team.
          </p>
        </div>
      </div>

      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. About HNB Connect</h2>
          <p>
            HNB Connect is a university community platform designed for students, 
            faculty, and alumni of Hemvati Nandan Bahuguna Garhwal University 
            (HNBGU). This demo privacy policy outlines how user data might be 
            handled in the final application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data Collection</h2>
          <p>
            In the production version, HNB Connect may collect:
          </p>
          <ul className="list-disc pl-5">
            <li>Account registration information</li>
            <li>Profile details (name, department, batch year)</li>
            <li>User-generated content (posts, comments)</li>
            <li>Usage data and analytics</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Data Usage</h2>
          <p>
            Collected data will be used exclusively for:
          </p>
          <ul className="list-disc pl-5">
            <li>Platform functionality and user experience</li>
            <li>University community engagement</li>
            <li>Security and compliance purposes</li>
            <li>Communication within the HNBGU community</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Protection</h2>
          <p>
            The final version of HNB Connect will implement appropriate security 
            measures in accordance with:
          </p>
          <ul className="list-disc pl-5">
            <li>University IT policies</li>
            <li>Indian data protection regulations</li>
            <li>Industry-standard security practices</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>
          <p>
            The production version may integrate with university-approved third-party 
            services. These integrations will be clearly documented in the final 
            privacy policy.
          </p>
        </section>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
          <h3 className="font-bold text-blue-800 mb-2">Development Notice:</h3>
          <p className="text-blue-700">
            This demo privacy policy is currently being used in the HNB Connect 
            project for testing purposes. Before production deployment, this must 
            be replaced with an official policy reviewed and approved by HNBGU 
            administration and legal counsel.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link to="/terms" className="text-sm">
            View Demo Terms
          </Link>
        </Button>
        <Button asChild>
          <Link to="/" className="text-sm">
            Back to HNB Connect
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;