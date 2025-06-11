import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type CropType = "cassava" | "cocoa";
type MonthType =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

interface SoilFeature {
  name: string;
  label: string;
  unit: string;
  min: number;
  max: number;
}

const idealMonths: Record<CropType, MonthType[]> = {
  cassava: ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  cocoa: ["May", "Jun", "Jul"],
};

const soilFeatures: SoilFeature[] = [
  { name: "pH", label: "Soil pH", unit: "-", min: 4.5, max: 8.5 },
  { name: "OC", label: "Organic Carbon", unit: "%", min: 0, max: 30 },
  { name: "N", label: "Nitrogen", unit: "mg/kg", min: 50, max: 300 },
  { name: "P", label: "Phosphorus", unit: "mg/kg", min: 5, max: 50 },
  { name: "K", label: "Potassium", unit: "mg/kg", min: 50, max: 300 },
  { name: "Ca", label: "Calcium", unit: "mg/kg", min: 0, max: 100 },
  { name: "Mg", label: "Magnesium", unit: "mg/kg", min: 0, max: 500 },
  { name: "Na", label: "Sodium", unit: "mg/kg", min: 0, max: 200 },
  { name: "Zn", label: "Zinc", unit: "mg/kg", min: 0.5, max: 10 },
  { name: "Cu", label: "Copper", unit: "mg/kg", min: 0, max: 10 },
  { name: "Mn", label: "Manganese", unit: "mg/kg", min: 0, max: 200 },
  { name: "Fe", label: "Iron", unit: "mg/kg", min: 0, max: 100 },
];

const tempRange = { min: 10, max: 40, unit: "°C" };

export default function CropYieldForm() {
  const [crop, setCrop] = useState<CropType>("cassava");
  const [month, setMonth] = useState<MonthType>("Mar");
  const [maxTemp, setMaxTemp] = useState<string>("");
  const [minTemp, setMinTemp] = useState<string>("");
  const [rainfall, setRainfall] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // soilInputs: Record with keys as soil param names and values as strings (input values)
  const [soilInputs, setSoilInputs] = useState<Record<string, string>>(() =>
    soilFeatures.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );

  const [warning, setWarning] = useState<string>("");
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idealMonths[crop].includes(month)) {
      setWarning(
        `Warning: ${month} is outside the ideal growing months for ${crop}.`
      );
    } else {
      setWarning("");
    }
  }, [month, crop]);

  // Event handler types for inputs:
  function handleSoilChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSoilInputs((prev) => ({ ...prev, [name]: value }));
  }

  function validateSoil(): string | null {
    for (const f of soilFeatures) {
      const val = parseFloat(soilInputs[f.name]);
      if (isNaN(val) || val < f.min || val > f.max) {
        return `Please enter a valid ${f.name} between ${f.min}${f.unit} and ${f.max}${f.unit}`;
      }
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    if (!maxTemp || !minTemp || !rainfall) {
      setError("Please fill all required fields.");
      return;
    }

    const soilError = validateSoil();
    if (soilError) {
      setError(soilError);
      return;
    }

    const payload = {
      CROP: crop,
      MONTH: month,
      MAX_TEMP: parseFloat(maxTemp),
      MIN_TEMP: parseFloat(minTemp),
      RAINFALL: parseFloat(rainfall),
      ...Object.fromEntries(
        soilFeatures.map((f) => [f.name, parseFloat(soilInputs[f.name])])
      ),
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to fetch prediction");
      const data = await res.json();
      setPrediction(data.predicted_yield);
      setDialogOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
    setLoading(false);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader className="mb-5 text-center text-xl">
          <CardTitle>Crop Yield Prediction Input Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2" htmlFor="crop">Crop Type</Label>
            <Select
              value={crop}
              onValueChange={(value) => setCrop(value as CropType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cassava">Cassava</SelectItem>
                <SelectItem value="cocoa">Cocoa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="month">Month</Label>
            <Select
              value={month}
              onValueChange={(value) => setMonth(value as MonthType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {warning && <p className="text-orange-600 mt-1">{warning}</p>}
          </div>

          <div>
            <Label className="mb-2" htmlFor="maxTemp">
              Max Temperature ({tempRange.unit}) [Range: {tempRange.min} -{" "}
              {tempRange.max}]
            </Label>
            <Input
              type="number"
              id="maxTemp"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              min={tempRange.min}
              max={tempRange.max}
              step={0.1}
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="minTemp">
              Min Temperature ({tempRange.unit}) [Range: {tempRange.min} -{" "}
              {tempRange.max}]
            </Label>
            <Input
              type="number"
              id="minTemp"
              value={minTemp}
              onChange={(e) => setMinTemp(e.target.value)}
              min={tempRange.min}
              max={tempRange.max}
              step={0.1}
              required
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="rainfall">Rainfall (mm)</Label>
            <Input
              type="number"
              id="rainfall"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              min={0}
              step={0.1}
              required
            />
          </div>

          <fieldset className="border border-gray-300 p-4 rounded">
            <legend className="text-lg font-semibold mb-2">
              Soil Parameters
            </legend>
            <div className="flex flex-row flex-wrap justify-between">
              {soilFeatures.map(({ name, label, unit, min, max }) => (
                <div key={name} className="mb-3">
                  <Label htmlFor={name} className="mb-3">
                    {label} ({unit}) [Range: {min} - {max}]
                  </Label>
                  <Input
                    type="number"
                    id={name}
                    name={name}
                    value={soilInputs[name]}
                    onChange={handleSoilChange}
                    step={0.01}
                    required
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <Button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer px-8 py-4 text-lg bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {loading ? "Predicting..." : "Get Prediction"}
          </Button>

          {error && <p className="text-red-600 mt-2">{error}</p>}
        </CardContent>
      </form>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle>Prediction Result</DialogTitle>
            <DialogDescription>
              Based on the provided inputs, the predicted crop yield for{" "}
              <span className="font-semibold capitalize text-lg">{crop}</span>{" "}
              is:
            </DialogDescription>
          </DialogHeader>
          {prediction !== null && (
            <p className="text-xl font-bold mt-4 text-green-700">
              {prediction.toFixed(4)} tons per hectare
            </p>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
