import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type FormKeys = 'Crop' | 'Year' | 'PRODUCTION' | 'AREA' | 'MinTemp' | 'MaxTemp' | 'Rainfall';

export default function CropYieldForm() {
  const [form, setForm] = useState<Record<FormKeys, string>>({
    Crop: 'Cassava',
    Year: '',
    PRODUCTION: '',
    AREA: '',
    MinTemp: '',
    MaxTemp: '',
    Rainfall: '',
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const key = e.target.name as FormKeys;
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setForm({ ...form, Crop: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        crop: form.Crop,
        year: parseInt(form.Year, 10),
        production: parseFloat(form.PRODUCTION),
        area: parseFloat(form.AREA),
        mintemp: parseFloat(form.MinTemp),
        maxtemp: parseFloat(form.MaxTemp),
        rainfall: parseFloat(form.Rainfall),
      };

      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setPrediction(data.predicted_yield);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verbose message builder
  const buildVerboseMessage = (yieldVal: number) => {
    return `Based on the provided details for ${form.Crop}, your estimated crop yield is approximately ${yieldVal.toFixed(2)} tons per hectare. This prediction factors in your production volume, area cultivated, temperature range, and rainfall — helping you plan your harvest with confidence and optimize your agricultural efforts.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Crop Yield Prediction
                </CardTitle>
                <p className="text-lg text-gray-600">
                  Enter crop details to predict yield
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Crop Dropdown */}
                  <div>
                    <Label htmlFor="Crop">Crop</Label>
                    <Select value={form.Crop} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cassava">Cassava</SelectItem>
                        <SelectItem value="Cocoa">Cocoa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Input */}
                  <div>
                    <Label htmlFor="Year">Year</Label>
                    <Input
                      type="number"
                      name="Year"
                      id="Year"
                      value={form.Year}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* PRODUCTION Input */}
                  <div>
                    <Label htmlFor="PRODUCTION">Production (tons)</Label>
                    <Input
                      type="number"
                      name="PRODUCTION"
                      id="PRODUCTION"
                      value={form.PRODUCTION}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* AREA Input */}
                  <div>
                    <Label htmlFor="AREA">Area (hectares)</Label>
                    <Input
                      type="number"
                      name="AREA"
                      id="AREA"
                      value={form.AREA}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* MinTemp Input */}
                  <div>
                    <Label htmlFor="MinTemp">Minimum Temperature (°C)</Label>
                    <Input
                      type="number"
                      name="MinTemp"
                      id="MinTemp"
                      value={form.MinTemp}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* MaxTemp Input */}
                  <div>
                    <Label htmlFor="MaxTemp">Maximum Temperature (°C)</Label>
                    <Input
                      type="number"
                      name="MaxTemp"
                      id="MaxTemp"
                      value={form.MaxTemp}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Rainfall Input - Full Width */}
                <div>
                  <Label htmlFor="Rainfall">Rainfall (mm)</Label>
                  <Input
                    type="number"
                    name="Rainfall"
                    id="Rainfall"
                    value={form.Rainfall}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Predict Yield'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog for prediction result */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-800">🌾 Crop Yield Prediction Result</DialogTitle>
            <DialogClose />
          </DialogHeader>

          {prediction !== null ? (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-700 text-lg leading-relaxed">
                {buildVerboseMessage(prediction)}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No prediction available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}