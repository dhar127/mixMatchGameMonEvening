import React, { useState } from 'react';

const PartsMarkingGame = () => {
  const [selectedTopic, setSelectedTopic] = useState('plantcell');
  const [selectedParts, setSelectedParts] = useState(new Set());
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);

  const topics = {
    sperm: {
      title: "Sperm Cell",
      diagram: (
        <svg viewBox="0 0 450 200" style={{width: '100%', height: '250px'}}>
          <defs>
            <radialGradient id="headGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#FFE4E1"/>
              <stop offset="100%" stopColor="#FFB6C1"/>
            </radialGradient>
            <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4682B4"/>
              <stop offset="100%" stopColor="#87CEEB"/>
            </linearGradient>
          </defs>
          
          {/* Head */}
          <ellipse cx="80" cy="100" rx="30" ry="40" fill="url(#headGrad)" 
                   stroke="#FF69B4" strokeWidth="2"
                   style={{cursor: 'pointer'}} data-part="head"/>
          
          {/* Acrosome */}
          <ellipse cx="80" cy="75" rx="20" ry="25" fill="#FF69B4" 
                   stroke="#FF1493" strokeWidth="2"
                   style={{cursor: 'pointer'}} data-part="acrosome"/>
          
          {/* Nucleus */}
          <ellipse cx="80" cy="115" rx="18" ry="22" fill="#8B008B" 
                   stroke="#4B0082" strokeWidth="1"
                   style={{cursor: 'pointer'}} data-part="nucleus"/>
          
          {/* Middle Piece */}
          <rect x="110" y="85" width="35" height="30" fill="#32CD32" 
                rx="15" stroke="#228B22" strokeWidth="2"
                style={{cursor: 'pointer'}} data-part="middle piece"/>
          
          {/* Mitochondria spirals in middle piece */}
          <ellipse cx="120" cy="95" rx="6" ry="3" fill="#FF4500" 
                   style={{cursor: 'pointer'}} data-part="mitochondria"/>
          <ellipse cx="130" cy="100" rx="6" ry="3" fill="#FF4500" 
                   style={{cursor: 'pointer'}} data-part="mitochondria"/>
          <ellipse cx="125" cy="105" rx="6" ry="3" fill="#FF4500" 
                   style={{cursor: 'pointer'}} data-part="mitochondria"/>
          
          {/* Tail */}
          <path d="M145 100 Q180 90 220 100 Q260 110 300 100 Q340 90 380 100 Q420 110 440 100" 
                stroke="url(#tailGrad)" strokeWidth="10" fill="none" 
                strokeLinecap="round"
                style={{cursor: 'pointer'}} data-part="tail"/>
          
          <text x="225" y="180" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Sperm Cell</text>
        </svg>
      ),
      parts: ['head', 'acrosome', 'nucleus', 'middle piece', 'tail']
    },

    egg: {
      title: "Egg Cell",
      diagram: (
        <svg viewBox="0 0 400 400" style={{width: '100%', height: '250px'}}>
          <defs>
            <radialGradient id="eggCellGrad" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#FFFACD"/>
              <stop offset="100%" stopColor="#F0E68C"/>
            </radialGradient>
            <radialGradient id="nucleusGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </radialGradient>
          </defs>
          
          {/* Corona Radiata - outer cells */}
          <g data-part="corona radiata" style={{cursor: 'pointer'}}>
            <circle cx="320" cy="200" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="300" cy="120" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="300" cy="280" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="80" cy="200" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="100" cy="120" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="100" cy="280" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="200" cy="50" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
            <circle cx="200" cy="350" r="12" fill="#98FB98" stroke="#32CD32" strokeWidth="2"/>
          </g>
          
          {/* Zona Pellucida */}
          <circle cx="200" cy="200" r="130" fill="none" stroke="#FF69B4" 
                  strokeWidth="8" strokeDasharray="10,5" opacity="0.7"
                  style={{cursor: 'pointer'}} data-part="zona pellucida"/>
          
          {/* Cell Membrane */}
          <circle cx="200" cy="200" r="110" fill="url(#eggCellGrad)" 
                  stroke="#DAA520" strokeWidth="4"
                  style={{cursor: 'pointer'}} data-part="cell membrane"/>
          
          {/* Cytoplasm */}
          <circle cx="200" cy="200" r="105" fill="#FFF8DC" opacity="0.6"
                  style={{cursor: 'pointer'}} data-part="cytoplasm"/>
          
          {/* Nucleus */}
          <circle cx="200" cy="180" r="35" fill="url(#nucleusGrad)" 
                  stroke="#4B0082" strokeWidth="3"
                  style={{cursor: 'pointer'}} data-part="nucleus"/>
          
          {/* Nucleolus */}
          <circle cx="200" cy="180" r="12" fill="#4B0082"
                  style={{cursor: 'pointer'}} data-part="nucleolus"/>
          
          <text x="200" y="380" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Egg Cell (Ovum)</text>
        </svg>
      ),
      parts: ['corona radiata', 'zona pellucida', 'cell membrane', 'cytoplasm', 'nucleus']
    },
    
    eye: {
      title: "Human Eye",
      diagram: (
        <svg viewBox="0 0 400 300" style={{width: '100%', height: '250px'}}>
          <defs>
            <radialGradient id="eyeGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#F8F8FF"/>
              <stop offset="100%" stopColor="#E0E0E0"/>
            </radialGradient>
            <radialGradient id="irisGrad" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#87CEEB"/>
              <stop offset="100%" stopColor="#4169E1"/>
            </radialGradient>
          </defs>
          
          {/* Sclera - white outer layer */}
          <ellipse cx="200" cy="150" rx="130" ry="85" fill="url(#eyeGrad)" 
                   stroke="#B0C4DE" strokeWidth="3" 
                   style={{cursor: 'pointer'}} data-part="sclera"/>
          
          {/* Retina - inner layer */}
          <ellipse cx="200" cy="150" rx="115" ry="70" fill="#FFB6C1" 
                   stroke="#DC143C" strokeWidth="2" opacity="0.8"
                   style={{cursor: 'pointer'}} data-part="retina"/>
          
          {/* Vitreous Humor - clear gel */}
          <ellipse cx="210" cy="150" rx="90" ry="60" fill="#F0F8FF" 
                   opacity="0.4" style={{cursor: 'pointer'}} data-part="vitreous humor"/>
          
          {/* Lens - clear biconvex */}
          <ellipse cx="160" cy="150" rx="25" ry="30" fill="#E6F3FF" 
                   stroke="#4682B4" strokeWidth="3" opacity="0.9"
                   style={{cursor: 'pointer'}} data-part="lens"/>
          
          {/* Iris - colored part */}
          <circle cx="135" cy="150" r="32" fill="url(#irisGrad)" 
                  stroke="#000080" strokeWidth="2" 
                  style={{cursor: 'pointer'}} data-part="iris"/>
          
          {/* Pupil - black opening */}
          <circle cx="135" cy="150" r="15" fill="#000000" 
                  style={{cursor: 'pointer'}} data-part="pupil"/>
          
          {/* Cornea - transparent front */}
          <ellipse cx="125" cy="150" rx="35" ry="40" fill="#F0F8FF" 
                   opacity="0.6" stroke="#4682B4" strokeWidth="2" 
                   style={{cursor: 'pointer'}} data-part="cornea"/>
          
          {/* Optic Nerve */}
          <rect x="320" y="145" width="60" height="12" fill="#8B4513" 
                stroke="#654321" strokeWidth="1" rx="6"
                style={{cursor: 'pointer'}} data-part="optic nerve"/>
          
          <text x="200" y="280" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Human Eye</text>
        </svg>
      ),
      parts: ['sclera', 'retina', 'lens', 'iris', 'cornea']
    },

    plantcell: {
      title: "Plant Cell",
      diagram: (
        <svg viewBox="0 0 400 300" style={{width: '100%', height: '250px'}}>
          <defs>
            <pattern id="cellWallPattern" patternUnits="userSpaceOnUse" width="4" height="4">
              <rect width="4" height="4" fill="#228B22"/>
              <rect width="2" height="2" fill="#32CD32"/>
            </pattern>
            <radialGradient id="nucleusGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#E6E6FA"/>
              <stop offset="100%" stopColor="#9370DB"/>
            </radialGradient>
          </defs>
          
          {/* Cell Wall - thick green outer boundary */}
          <rect x="20" y="30" width="360" height="240" fill="none" 
                stroke="url(#cellWallPattern)" strokeWidth="8" 
                style={{cursor: 'pointer'}} data-part="cell wall"/>
          
          {/* Cell Membrane - thin inner boundary */}
          <rect x="32" y="42" width="336" height="216" fill="#F0F8FF" 
                stroke="#4682B4" strokeWidth="3" opacity="0.8"
                style={{cursor: 'pointer'}} data-part="cell membrane"/>
          
          {/* Cytoplasm - cell interior */}
          <rect x="40" y="50" width="320" height="200" fill="#FFFACD" 
                opacity="0.6" rx="10"
                style={{cursor: 'pointer'}} data-part="cytoplasm"/>
          
          {/* Large Central Vacuole */}
          <ellipse cx="200" cy="150" rx="90" ry="70" fill="#E6F7FF" 
                   stroke="#4169E1" strokeWidth="3" opacity="0.9"
                   style={{cursor: 'pointer'}} data-part="vacuole"/>
          
          {/* Nucleus */}
          <circle cx="130" cy="100" r="28" fill="url(#nucleusGrad)" 
                  stroke="#4B0082" strokeWidth="3" 
                  style={{cursor: 'pointer'}} data-part="nucleus"/>
          
          {/* Nucleolus */}
          <circle cx="130" cy="100" r="10" fill="#4B0082" 
                  style={{cursor: 'pointer'}} data-part="nucleolus"/>
          
          {/* Chloroplasts - green oval structures */}
          <g data-part="chloroplast" style={{cursor: 'pointer'}}>
            <ellipse cx="80" cy="80" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
            <ellipse cx="75" cy="75" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            <ellipse cx="85" cy="85" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            
            <ellipse cx="320" cy="100" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
            <ellipse cx="315" cy="95" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            <ellipse cx="325" cy="105" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            
            <ellipse cx="90" cy="210" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
            <ellipse cx="85" cy="205" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            <ellipse cx="95" cy="215" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            
            <ellipse cx="330" cy="220" rx="15" ry="25" fill="#32CD32" stroke="#228B22" strokeWidth="2"/>
            <ellipse cx="325" cy="215" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
            <ellipse cx="335" cy="225" rx="4" ry="8" fill="#228B22" opacity="0.7"/>
          </g>
          
          <text x="200" y="285" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Plant Cell</text>
        </svg>
      ),
      parts: ['cell wall', 'cell membrane', 'vacuole', 'nucleus', 'chloroplast']
    },

    animalcell: {
      title: "Animal Cell",
      diagram: (
        <svg viewBox="0 0 400 300" style={{width: '100%', height: '250px'}}>
          <defs>
            <radialGradient id="cytoplasmGrad" cx="0.4" cy="0.3">
              <stop offset="0%" stopColor="#F0F8FF"/>
              <stop offset="100%" stopColor="#E0E6FF"/>
            </radialGradient>
            <radialGradient id="mitoGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#FF7F50"/>
              <stop offset="100%" stopColor="#FF4500"/>
            </radialGradient>
          </defs>
          
          {/* Cell Membrane - irregular shape */}
          <path d="M80 120 Q60 80 100 60 Q150 50 200 55 Q250 50 300 70 Q340 90 330 130 Q335 170 310 200 Q280 230 240 240 Q200 245 160 240 Q120 235 90 210 Q70 180 75 150 Q70 130 80 120 Z" 
                fill="url(#cytoplasmGrad)" stroke="#4169E1" strokeWidth="4" 
                style={{cursor: 'pointer'}} data-part="cell membrane"/>
          
          {/* Nucleus */}
          <circle cx="200" cy="150" r="40" fill="url(#nucleusGrad)" 
                  stroke="#4B0082" strokeWidth="3" 
                  style={{cursor: 'pointer'}} data-part="nucleus"/>
          
          {/* Nucleolus */}
          <circle cx="190" cy="140" r="12" fill="#4B0082" 
                  style={{cursor: 'pointer'}} data-part="nucleolus"/>
          
          {/* Mitochondria - bean-shaped with cristae */}
          <g data-part="mitochondria" style={{cursor: 'pointer'}}>
            <ellipse cx="130" cy="120" rx="25" ry="15" fill="url(#mitoGrad)" stroke="#DC143C" strokeWidth="2"/>
            <path d="M110 120 Q125 115 140 120 Q125 125 110 120" stroke="#8B0000" strokeWidth="1" fill="none"/>
            <path d="M115 125 Q125 120 135 125" stroke="#8B0000" strokeWidth="1" fill="none"/>
            
            <ellipse cx="280" cy="130" rx="25" ry="15" fill="url(#mitoGrad)" stroke="#DC143C" strokeWidth="2"/>
            <path d="M260 130 Q275 125 290 130 Q275 135 260 130" stroke="#8B0000" strokeWidth="1" fill="none"/>
            <path d="M265 135 Q275 130 285 135" stroke="#8B0000" strokeWidth="1" fill="none"/>
            
            <ellipse cx="150" cy="210" rx="25" ry="15" fill="url(#mitoGrad)" stroke="#DC143C" strokeWidth="2"/>
            <path d="M130 210 Q145 205 160 210 Q145 215 130 210" stroke="#8B0000" strokeWidth="1" fill="none"/>
            <path d="M135 215 Q145 210 155 215" stroke="#8B0000" strokeWidth="1" fill="none"/>
          </g>
          
          {/* Endoplasmic Reticulum - folded membranes */}
          <g data-part="endoplasmic reticulum" style={{cursor: 'pointer'}}>
            <path d="M100 100 Q120 90 140 100 Q160 110 180 100 Q200 90 220 100 Q240 110 260 100" 
                  stroke="#9370DB" strokeWidth="4" fill="none"/>
            <path d="M105 180 Q125 170 145 180 Q165 190 185 180 Q205 170 225 180" 
                  stroke="#9370DB" strokeWidth="4" fill="none"/>
            <circle cx="115" cy="95" r="3" fill="#8B4513"/>
            <circle cx="135" cy="105" r="3" fill="#8B4513"/>
            <circle cx="155" cy="95" r="3" fill="#8B4513"/>
          </g>
          
          {/* Lysosomes - digestive vesicles */}
          <g data-part="lysosomes" style={{cursor: 'pointer'}}>
            <circle cx="120" cy="160" r="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2"/>
            <circle cx="115" cy="155" r="3" fill="#DC143C"/>
            <circle cx="125" cy="165" r="3" fill="#DC143C"/>
            
            <circle cx="290" cy="180" r="12" fill="#FF69B4" stroke="#FF1493" strokeWidth="2"/>
            <circle cx="285" cy="175" r="3" fill="#DC143C"/>
            <circle cx="295" cy="185" r="3" fill="#DC143C"/>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Animal Cell</text>
        </svg>
      ),
      parts: ['cell membrane', 'nucleus', 'mitochondria', 'endoplasmic reticulum', 'lysosomes']
    },

    circuit: {
      title: "Electric Circuit",
      diagram: (
        <svg viewBox="0 0 400 300" style={{width: '100%', height: '250px'}}>
          <defs>
            <linearGradient id="wireGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#DAA520"/>
            </linearGradient>
          </defs>
          
          {/* Wire - complete circuit path */}
          <g data-part="wire" style={{cursor: 'pointer'}}>
            <path d="M100 100 L300 100 L300 200 L100 200 Z" stroke="url(#wireGrad)" 
                  strokeWidth="6" fill="none" strokeLinecap="round"/>
          </g>
          
          {/* Battery - with + and - terminals */}
          <g data-part="battery" style={{cursor: 'pointer'}}>
            <rect x="85" y="140" width="30" height="50" fill="#FF6347" 
                  stroke="#8B0000" strokeWidth="2" rx="5"/>
            <rect x="80" y="150" width="15" height="30" fill="#8B0000" rx="3"/>
            <text x="70" y="135" fontSize="14" fill="#000" fontWeight="bold">+</text>
            <text x="70" y="210" fontSize="14" fill="#000" fontWeight="bold">-</text>
            <text x="95" y="225" fontSize="10" fill="#666" textAnchor="middle">Battery</text>
          </g>
          
          {/* Switch - with movable contact */}
          <g data-part="switch" style={{cursor: 'pointer'}}>
            <circle cx="200" cy="100" r="6" fill="#000"/>
            <line x1="200" y1="100" x2="225" y2="80" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="225" cy="100" r="6" fill="#000"/>
            <text x="212" y="75" fontSize="10" fill="#666" textAnchor="middle">Switch</text>
          </g>
          
          {/* Light Bulb - with filament */}
          <g data-part="bulb" style={{cursor: 'pointer'}}>
            <circle cx="300" cy="150" r="25" fill="#FFF8DC" stroke="#000" strokeWidth="3"/>
            <path d="M285 135 L315 165 M285 165 L315 135" stroke="#FFD700" strokeWidth="3"/>
            <path d="M290 150 Q300 140 310 150 Q300 160 290 150" stroke="#FFD700" strokeWidth="2" fill="none"/>
            <text x="300" y="190" fontSize="10" fill="#666" textAnchor="middle">Bulb</text>
          </g>
          
          {/* Resistor - with zigzag pattern */}
          <g data-part="resistor" style={{cursor: 'pointer'}}>
            <rect x="170" y="195" width="60" height="12" fill="#8B4513" 
                  stroke="#000" strokeWidth="2" rx="6"/>
            <path d="M175 201 L180 195 L185 207 L190 195 L195 207 L200 195 L205 207 L210 195 L215 207 L220 195 L225 201" 
                  stroke="#000" strokeWidth="2" fill="none"/>
            <text x="200" y="225" fontSize="10" fill="#666" textAnchor="middle">Resistor</text>
          </g>
          
          <text x="200" y="280" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Electric Circuit</text>
        </svg>
      ),
      parts: ['wire', 'battery', 'switch', 'bulb', 'resistor']
    },

    solar: {
      title: "Solar System",
      diagram: (
        <svg viewBox="0 0 500 300" style={{width: '100%', height: '250px'}}>
          <defs>
            <radialGradient id="sunGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#FFFF99"/>
              <stop offset="100%" stopColor="#FFD700"/>
            </radialGradient>
            <radialGradient id="earthGrad" cx="0.3" cy="0.3">
              <stop offset="0%" stopColor="#87CEEB"/>
              <stop offset="100%" stopColor="#4169E1"/>
            </radialGradient>
          </defs>
          
          {/* Sun */}
          <g data-part="sun" style={{cursor: 'pointer'}}>
            <circle cx="100" cy="150" r="35" fill="url(#sunGrad)" stroke="#FF8C00" strokeWidth="3"/>
            <path d="M100 110 L100 90 M100 190 L100 210 M140 150 L160 150 M60 150 L40 150" 
                  stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
            <path d="M125 125 L140 110 M75 125 L60 110 M125 175 L140 190 M75 175 L60 190" 
                  stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
          </g>
          
          {/* Earth */}
          <g data-part="earth" style={{cursor: 'pointer'}}>
            <circle cx="220" cy="150" r="12" fill="url(#earthGrad)" stroke="#000080" strokeWidth="2"/>
            <path d="M215 145 Q220 140 225 145 Q220 150 215 150" fill="#228B22"/>
            <path d="M218 155 Q222 152 225 155" fill="#228B22"/>
          </g>
          
          {/* Mars */}
          <g data-part="mars" style={{cursor: 'pointer'}}>
            <circle cx="270" cy="150" r="8" fill="#CD5C5C" stroke="#8B0000" strokeWidth="2"/>
            <ellipse cx="268" cy="148" rx="2" ry="1" fill="#8B0000"/>
            <ellipse cx="272" cy="152" rx="1" ry="0.5" fill="#8B0000"/>
          </g>
          
          {/* Jupiter */}
          <g data-part="jupiter" style={{cursor: 'pointer'}}>
            <circle cx="340" cy="150" r="22" fill="#DAA520" stroke="#B8860B" strokeWidth="2"/>
            <ellipse cx="340" cy="145" rx="18" ry="3" fill="#8B7355" opacity="0.7"/>
            <ellipse cx="340" cy="155" rx="18" ry="2" fill="#8B7355" opacity="0.7"/>
            <circle cx="350" cy="140" r="4" fill="#FF6347"/>
          </g>
          
          {/* Saturn */}
          <g data-part="saturn" style={{cursor: 'pointer'}}>
            <circle cx="430" cy="150" r="18" fill="#FAD5A5" stroke="#DEB887" strokeWidth="2"/>
            <ellipse cx="430" cy="150" rx="30" ry="6" fill="none" stroke="#8B7D6B" strokeWidth="3"/>
            <ellipse cx="430" cy="150" rx="35" ry="8" fill="none" stroke="#8B7D6B" strokeWidth="2" opacity="0.6"/>
            <ellipse cx="430" cy="145" rx="15" ry="2" fill="#DEB887" opacity="0.5"/>
          </g>
          
          <text x="250" y="280" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">Solar System</text>
        </svg>
      ),
      parts: ['sun', 'earth', 'mars', 'jupiter', 'saturn']
    }
  };

  const handlePartClick = (e) => {
    const part = e.target.getAttribute('data-part') || e.target.closest('[data-part]')?.getAttribute('data-part');
    if (part && topics[selectedTopic].parts.includes(part)) {
      setSelectedParts(prev => {
        const newSet = new Set(prev);
        newSet.has(part) ? newSet.delete(part) : newSet.add(part);
        return newSet;
      });
    }
  };

  const checkAnswers = () => {
    setScore(selectedParts.size);
    setShowAnswers(true);
  };

  const resetGame = () => {
    setSelectedParts(new Set());
    setShowAnswers(false);
    setScore(0);
  };

  return (
    <div style={{
      padding: '10px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{maxWidth: '1000px', margin: '0 auto'}}>
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <h1 style={{color: '#2c3e50', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', margin: '10px 0'}}>
            Parts Marking Game
          </h1>
          <p style={{color: '#6c757d', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'}}>
            Click on any part of the diagram to identify it
          </p>
        </div>

        {/* Topic Selection */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{margin: '0 0 15px 0', color: '#2c3e50', fontSize: 'clamp(1rem, 3vw, 1.3rem)'}}>
            Choose a Topic:
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center'
          }}>
            {Object.entries(topics).map(([key, topic]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedTopic(key);
                  resetGame();
                }}
                style={{
                  padding: '12px 20px',
                  border: selectedTopic === key ? '3px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '8px',
                  backgroundColor: selectedTopic === key ? '#007bff' : 'white',
                  color: selectedTopic === key ? 'white' : '#495057',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                  fontWeight: selectedTopic === key ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  if (selectedTopic !== key) {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.borderColor = '#adb5bd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTopic !== key) {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = '#dee2e6';
                  }
                }}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* Game Area */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '20px'
        }}>
          
          {/* Main Diagram */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              textAlign: 'center',
              color: '#2c3e50',
              marginBottom: '20px',
              fontSize: 'clamp(1.2rem, 3.5vw, 1.8rem)'
            }}>
              {topics[selectedTopic].title}
            </h2>
            
            <div 
              onClick={handlePartClick}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '250px',
                border: '2px dashed #dee2e6',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            >
              {topics[selectedTopic].diagram}
            </div>
            
            {/* Instructions */}
            <div style={{
              marginTop: '15px',
              padding: '15px',
              backgroundColor: '#e7f3ff',
              borderRadius: '8px',
              border: '1px solid #b3d9ff'
            }}>
              <p style={{
                margin: '0',
                color: '#0066cc',
                fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                textAlign: 'center'
              }}>
                💡 <strong>Instructions:</strong> Click on different parts of the diagram to identify them. 
                Selected parts will be highlighted.
              </p>
            </div>
          </div>

          {/* Control Panel */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            
            {/* Selected Parts */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                color: '#2c3e50',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)'
              }}>
                Selected Parts ({selectedParts.size}/{topics[selectedTopic].parts.length})
              </h3>
              
              <div style={{minHeight: '120px'}}>
                {selectedParts.size === 0 ? (
                  <p style={{
                    color: '#6c757d',
                    fontStyle: 'italic',
                    margin: '10px 0',
                    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)'
                  }}>
                    No parts selected yet. Click on the diagram to start!
                  </p>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {Array.from(selectedParts).map((part, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: showAnswers 
                            ? (topics[selectedTopic].parts.includes(part) ? '#d4edda' : '#f8d7da')
                            : '#e3f2fd',
                          color: showAnswers 
                            ? (topics[selectedTopic].parts.includes(part) ? '#155724' : '#721c24')
                            : '#1976d2',
                          border: showAnswers 
                            ? (topics[selectedTopic].parts.includes(part) ? '1px solid #c3e6cb' : '1px solid #f5c6cb')
                            : '1px solid #bbdefb',
                          borderRadius: '20px',
                          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                          fontWeight: '500',
                          display: 'inline-block'
                        }}
                      >
                        {part}
                        {showAnswers && (
                          <span style={{marginLeft: '5px'}}>
                            {topics[selectedTopic].parts.includes(part) ? '✓' : '✗'}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results & Controls */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                color: '#2c3e50',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)'
              }}>
                Game Controls
              </h3>

              {showAnswers && (
                <div style={{
                  padding: '15px',
                  backgroundColor: score === topics[selectedTopic].parts.length ? '#d4edda' : '#fff3cd',
                  border: score === topics[selectedTopic].parts.length ? '1px solid #c3e6cb' : '1px solid #ffeaa7',
                  borderRadius: '8px',
                  marginBottom: '15px'
                }}>
                  <h4 style={{
                    margin: '0 0 10px 0',
                    color: score === topics[selectedTopic].parts.length ? '#155724' : '#856404',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)'
                  }}>
                    {score === topics[selectedTopic].parts.length ? '🎉 Perfect Score!' : '📊 Results'}
                  </h4>
                  <p style={{
                    margin: '0',
                    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                    color: score === topics[selectedTopic].parts.length ? '#155724' : '#856404'
                  }}>
                    You identified <strong>{score}</strong> out of <strong>{topics[selectedTopic].parts.length}</strong> parts correctly!
                  </p>
                </div>
              )}

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <button
                  onClick={checkAnswers}
                  disabled={selectedParts.size === 0}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: selectedParts.size === 0 ? '#e9ecef' : '#28a745',
                    color: selectedParts.size === 0 ? '#6c757d' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                    fontWeight: 'bold',
                    cursor: selectedParts.size === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedParts.size > 0) {
                      e.target.style.backgroundColor = '#218838';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedParts.size > 0) {
                      e.target.style.backgroundColor = '#28a745';
                    }
                  }}
                >
                  {showAnswers ? 'Results Shown' : 'Check Answers'}
                </button>

                <button
                  onClick={resetGame}
                  style={{
                    padding: '10px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5a6268';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6c757d';
                  }}
                >
                  Reset Game
                </button>
              </div>
            </div>
          </div>

          {/* Answer Key */}
          {showAnswers && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                color: '#2c3e50',
                fontSize: 'clamp(1rem, 3vw, 1.3rem)'
              }}>
                📚 Answer Key - All {topics[selectedTopic].title} Parts
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px'
              }}>
                {topics[selectedTopic].parts.map((part, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedParts.has(part) ? '#d4edda' : '#f8f9fa',
                      border: selectedParts.has(part) ? '2px solid #28a745' : '1px solid #dee2e6',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.8rem, 2.5vw, 1rem)'
                    }}
                  >
                    <span style={{
                      fontWeight: '500',
                      color: selectedParts.has(part) ? '#155724' : '#495057'
                    }}>
                      {index + 1}. {part}
                    </span>
                    {selectedParts.has(part) && (
                      <span style={{marginLeft: '8px', color: '#28a745'}}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartsMarkingGame;