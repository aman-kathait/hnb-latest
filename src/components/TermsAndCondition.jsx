import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="font-medium text-yellow-700">
            ⚠️ DEMO VERSION - This is a placeholder document that will be 
            replaced with official university terms and conditions.
          </p>
        </div>
      </div>

      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            This demo terms and conditions document is provided for development 
            purposes only. The final version will be established in accordance 
            with HNBGU Garhwal University's 
            policies and legal requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Account Responsibilities</h2>
          <p>
            Users are responsible for maintaining the confidentiality of their 
            account credentials. The university will implement appropriate 
            security measures in the final version of this platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
          <p>
            All content posted must comply with university standards. The final 
            terms will specify prohibited content and consequences for violations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Privacy Policy</h2>
          <p>
            User data will be handled according to the university's data 
            protection policies. A comprehensive privacy policy will be 
            developed before launch.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
          <p>
            The university reserves the right to modify these terms as needed. 
            Users will be notified of changes through official channels.
          </p>
        </section>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
          <h3 className="font-bold text-blue-800 mb-2">Note to Developers:</h3>
          <p className="text-blue-700">
            This page should be replaced with the official university terms and 
            conditions before production deployment. Coordinate with the 
            university's legal and administrative departments to ensure 
            compliance with all regulations.
          </p>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link to="/" className="text-sm">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TermsAndConditions;