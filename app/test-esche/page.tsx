'use client';

import { useState } from 'react';

export default function TestEschePage() {
  const [waterType, setWaterType] = useState('mare');
  const [weather, setWeather] = useState('calmo');
  const [season, setSeason] = useState('primavera');
  const [result, setResult] = useState('');

  const getBait = () => {
    let bait = "";

    if (waterType === "mare") {
      if (weather === "mosso" && season === "inverno") bait = "Minnow affondante per spigola";
      else if (weather === "calmo" && season === "estate") bait = "Walking the Dog per serra e palamita";
      else bait = "Jig metallico versatile per mare mosso o calmo";
    } 
    else if (waterType === "fiume") {
      if (season === "primavera") bait = "Minnow piccolo per trota";
      else bait = "Cucchiaino rotante per cavedano e persico";
    } 
    else if (waterType === "lago") {
      if (weather === "calmo") bait = "Soft swimbait per luccio e persico";
      else bait = "Spinnerbait per acque torbide";
    }

    setResult(bait);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Test Componente Esche
        </h1>
        
        <div className="bg-[#134D85] text-[#BBD874] p-6 rounded-2xl shadow-lg max-w-xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">🎯 Che esca usare oggi</h3>
          
          <label className="block mb-2 font-semibold">Tipo di acqua</label>
          <select 
            value={waterType}
            onChange={(e) => setWaterType(e.target.value)}
            className="w-full p-2 rounded bg-[#0F3C66] text-white mb-4"
          >
            <option value="mare">Mare</option>
            <option value="fiume">Fiume</option>
            <option value="lago">Lago</option>
          </select>

          <label className="block mb-2 font-semibold">Condizioni meteo</label>
          <select 
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="w-full p-2 rounded bg-[#0F3C66] text-white mb-4"
          >
            <option value="calmo">Calmo / Soleggiato</option>
            <option value="mosso">Mosso / Vento</option>
            <option value="torbido">Acqua torbida</option>
          </select>

          <label className="block mb-2 font-semibold">Periodo</label>
          <select 
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full p-2 rounded bg-[#0F3C66] text-white mb-4"
          >
            <option value="primavera">Primavera</option>
            <option value="estate">Estate</option>
            <option value="autunno">Autunno</option>
            <option value="inverno">Inverno</option>
          </select>

          <button 
            onClick={getBait}
            className="bg-[#BBD874] text-[#134D85] font-bold py-2 px-4 rounded hover:bg-[#A6C764] transition-colors"
          >
            Scopri l'esca
          </button>

          {result && (
            <div className="mt-4 p-4 rounded bg-[#0F3C66]">
              <strong>Consiglio di oggi:</strong> {result}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-[#134D85] hover:text-[#0F3C66] font-medium"
          >
            ← Torna alla homepage
          </a>
        </div>
      </div>
    </div>
  );
}
