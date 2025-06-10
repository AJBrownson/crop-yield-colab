import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            🌾 Powered by Random Forest Algorithm
          </div>

          {/* Main Heading */}
          <div className="max-w-4xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900">
              Predict Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {" "}Crop Yields
              </span>
              <br />
              Before You Plant
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your farming decisions with AI-powered yield predictions. 
              Maximize profits, minimize risks, and make data-driven choices for every growing season.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
           <Link to="/run-model">
              <Button 
                size="lg" 
                className="cursor-pointer px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Predicting
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
