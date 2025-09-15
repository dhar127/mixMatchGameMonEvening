import React, { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import './LabExperiment.css';

const LabExperiment = () => {
  // Language state
  const [language, setLanguage] = useState("en");
  
  // State management
  const [currentView, setCurrentView] = useState("index");
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  
  // Volcano states
  const [volcanoStep, setVolcanoStep] = useState(1);
  const [volcanoObservations, setVolcanoObservations] = useState("");
  const [volcanoButtons, setVolcanoButtons] = useState({
    bakingSoda: false,
    vinegar: true,
    mix: true
  });
  
  // Hookes states
  const [hookesStep, setHookesStep] = useState(1);
  const [hookesObservations, setHookesObservations] = useState("");
  const [hookesButtons, setHookesButtons] = useState({
    setup: false,
    measureNatural: true,
    addWeight: true,
    measureExtension: true
  });
  const [hookesCurrentLoad, setHookesCurrentLoad] = useState(0);
  const [hookesCurrentExtension, setHookesCurrentExtension] = useState(0);
  const [hookesMeasurements, setHookesMeasurements] = useState([]);
  const [showMeasurementTable, setShowMeasurementTable] = useState(false);
  const [showWeightDisplay, setShowWeightDisplay] = useState(false);
  
  // Circuit states
  const [circuitCurrent, setCircuitCurrent] = useState(false);
  const [circuitResistance, setCircuitResistance] = useState(100);
  
  // Pendulum states
  const [pendulumSwinging, setPendulumSwinging] = useState(false);
  const [pendulumAngle, setPendulumAngle] = useState(0);
  const [pendulumStartTime, setPendulumStartTime] = useState(0);
  const [pendulumPeriod, setPendulumPeriod] = useState(0);
  
  // Refs for Three.js scenes
  const volcanoCanvasRef = useRef();
  const hookesCanvasRef = useRef();
  const volcanoSceneRef = useRef();
  const hookesSceneRef = useRef();
  const pendulumIntervalRef = useRef();

  // Additional state for Three.js objects
  const [volcanoBubbles, setVolcanoBubbles] = useState([]);
  const [hookesWeights, setHookesWeights] = useState([]);

  // Bilingual content
  const content = {
    en: {
      mainTitle: "Virtual Science Laboratory",
      mainSubtitle: "Interactive Experiments for Young Scientists",
      mainDescription: "Choose an experiment to start your scientific journey!",
      backToLab: "← Back to Lab",
      practice: "Practice",
      language: "தமிழ்",
      experiments: {
        volcano: {
          icon: "🌋",
          title: "Volcano Experiment",
          description: "Create an amazing chemical reaction! Mix baking soda and vinegar to make your own erupting volcano.",
          difficulty: "Easy",
          subtitle: "Baking Soda & Vinegar Chemical Reaction"
        },
        hookes: {
          icon: "🗜",
          title: "Hooke's Law",
          description: "Discover how springs work! Test different weights and learn about force and elasticity.",
          difficulty: "Medium",
          subtitle: "Spring Force and Elasticity"
        },
        ohms: {
          icon: "⚛",
          title: "Ohm's Law",
          description: "Explore electricity! Build circuits and learn about voltage, current, and resistance.",
          difficulty: "Medium",
          subtitle: "Electrical Circuit Analysis"
        },
        pendulum: {
          icon: "⏰",
          title: "Simple Pendulum",
          description: "Measure gravity! Swing a pendulum and discover how physics governs motion.",
          difficulty: "Advanced",
          subtitle: "Measuring Gravity"
        }
      },
      buttons: {
        addBakingSoda: "Add Baking Soda",
        addVinegar: "Add Vinegar",
        mixWatch: "Mix & Watch!",
        setupSpring: "Setup Spring",
        measureNatural: "Measure Natural Length",
        addWeight: "Add 50g Weight",
        measureExtension: "Measure Extension",
        turnOnCurrent: "Turn On Current",
        turnOffCurrent: "Turn Off Current",
        changeResistor: "Change Resistor",
        resetCircuit: "Reset Circuit",
        startSwinging: "Start Swinging",
        stop: "Stop",
        measurePeriod: "Measure Period",
        reset: "🔄 Reset"
      },
      observations: {
        title: "🔍 Your Observations:",
        measurements: "📊 Measurements:",
        volcanoStart: "Click the buttons above to start your experiment!",
        hookesStart: "Click the buttons above to start the experiment!",
        voltage: "Voltage",
        current: "Current",
        resistance: "Resistance",
        currentFlowing: "⚡ Current is flowing through the circuit!",
        length: "Length",
        period: "Period",
        calculatedG: "Calculated g",
        swinging: "⏱ Pendulum is swinging...",
        currentLoad: "Current Load",
        extension: "Extension"
      }
    },
    ta: {
      mainTitle: "மெய்நிகர் அறிவியல் ஆய்வகம்",
      mainSubtitle: "இளம் விஞ்ஞானிகளுக்கான ஊடாடும் சோதனைகள்",
      mainDescription: "உங்கள் அறிவியல் பயணத்தைத் தொடங்க ஒரு சோதனையைத் தேர்வு செய்யுங்கள்!",
      backToLab: "← ஆய்வகத்திற்கு திரும்பு",
      practice: "பயிற்சி",
      language: "English",
      experiments: {
        volcano: {
          icon: "🌋",
          title: "எரிமலை சோதனை",
          description: "அற்புதமான வேதியியல் வினையை உருவாக்குங்கள்! சோடா உப்பு மற்றும் வினிகரை கலந்து உங்கள் சொந்த எரிமலையை உருவாக்குங்கள்.",
          difficulty: "எளிது",
          subtitle: "சோடா உப்பு & வினிகர் வேதியியல் வினை"
        },
        hookes: {
          icon: "🗜",
          title: "ஹூக்கின் விதி",
          description: "நீரூற்றுகள் எப்படி வேலை செய்கின்றன என்பதைக் கண்டறியுங்கள்! வெவ்வேறு எடைகளை சோதித்து விசை மற்றும் நெகிழ்வுத்தன்மையைப் பற்றி அறியுங்கள்.",
          difficulty: "நடுத்தர",
          subtitle: "நீரூற்று விசை மற்றும் நெகிழ்வுத்தன்மை"
        },
        ohms: {
          icon: "⚛",
          title: "ஓம் விதி",
          description: "மின்சாரத்தை ஆராயுங்கள்! சுற்றுகளை உருவாக்கி மின்னழுத்தம், மின்னோட்டம் மற்றும் எதிர்ப்பைப் பற்றி அறியுங்கள்.",
          difficulty: "நடுத்தர",
          subtitle: "மின் சுற்று பகுப்பாய்வு"
        },
        pendulum: {
          icon: "⏰",
          title: "எளிய ஊசல்",
          description: "ஈர்ப்பு விசையை அளவிடுங்கள்! ஊசலை ஆட்டி இயற்பியல் இயக்கத்தை எப்படி நிர்வகிக்கிறது என்பதைக் கண்டறியுங்கள்.",
          difficulty: "மேம்பட்ட",
          subtitle: "ஈர்ப்பு விசையை அளவிடுதல்"
        }
      },
      buttons: {
        addBakingSoda: "சோடா உப்பு சேர்க்கவும்",
        addVinegar: "வினிகர் சேர்க்கவும்",
        mixWatch: "கலந்து பாருங்கள்!",
        setupSpring: "நீரூற்று அமைக்கவும்",
        measureNatural: "இயற்கை நீளம் அளவிடவும்",
        addWeight: "50 கிராம் எடை சேர்க்கவும்",
        measureExtension: "நீட்சியை அளவிடவும்",
        turnOnCurrent: "மின்னோட்டத்தை இயக்கவும்",
        turnOffCurrent: "மின்னோட்டத்தை அணைக்கவும்",
        changeResistor: "எதிர்ப்பை மாற்றவும்",
        resetCircuit: "சுற்றை மீட்டமைக்கவும்",
        startSwinging: "ஆட்டத் தொடங்கவும்",
        stop: "நிறுத்தவும்",
        measurePeriod: "காலத்தை அளவிடவும்",
        reset: "🔄 மீட்டமை"
      },
      observations: {
        title: "🔍 உங்கள் அவதானிப்புகள்:",
        measurements: "📊 அளவீடுகள்:",
        volcanoStart: "உங்கள் சோதனையைத் தொடங்க மேலே உள்ள பொத்தான்களைக் கிளிக் செய்யுங்கள்!",
        hookesStart: "சோதனையைத் தொடங்க மேலே உள்ள பொத்தான்களைக் கிளிக் செய்யுங்கள்!",
        voltage: "மின்னழுத்தம்",
        current: "மின்னோட்டம்",
        resistance: "எதிர்ப்பு",
        currentFlowing: "⚡ மின்னோட்டம் சுற்றில் பாய்கிறது!",
        length: "நீளம்",
        period: "காலம்",
        calculatedG: "கணக்கிடப்பட்ட g",
        swinging: "⏱ ஊசல் ஆடுகிறது...",
        currentLoad: "தற்போதைய எடை",
        extension: "நீட்சி"
      }
    }
  };

  // Get current language content
  const t = content[language];

  // Initialize Three.js scenes
  useEffect(() => {
    if (selectedExperiment === 'volcano' && volcanoCanvasRef.current) {
      initVolcanoScene();
    }
    if (selectedExperiment === 'hookes' && hookesCanvasRef.current) {
      initHookesScene();
    }
    
    return () => {
      // Cleanup
      if (volcanoSceneRef.current?.renderer) {
        volcanoSceneRef.current.renderer.dispose();
      }
      if (hookesSceneRef.current?.renderer) {
        hookesSceneRef.current.renderer.dispose();
      }
    };
  }, [selectedExperiment]);

  // Initialize observations with default text
  useEffect(() => {
    setVolcanoObservations(t.observations.volcanoStart);
    setHookesObservations(t.observations.hookesStart);
  }, [language]);

  // Pendulum animation
  useEffect(() => {
    if (pendulumSwinging) {
      let angle = 45;
      let direction = -1;
      
      pendulumIntervalRef.current = setInterval(() => {
        angle += direction * 2;
        
        if (angle <= -45) {
          direction = 1;
        } else if (angle >= 45) {
          direction = -1;
        }
        
        setPendulumAngle(angle);
      }, 50);
      
      return () => {
        if (pendulumIntervalRef.current) {
          clearInterval(pendulumIntervalRef.current);
        }
      };
    }
  }, [pendulumSwinging]);

  // Three.js initialization functions
  const initVolcanoScene = () => {
    if (!volcanoCanvasRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    const camera = new THREE.PerspectiveCamera(75, volcanoCanvasRef.current.clientWidth / volcanoCanvasRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    
    const renderer = new THREE.WebGLRenderer({ canvas: volcanoCanvasRef.current, antialias: true });
    renderer.setSize(volcanoCanvasRef.current.clientWidth, volcanoCanvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create lab table
    const tableGeometry = new THREE.BoxGeometry(6, 0.2, 4);
    const tableMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -1;
    scene.add(table);
    
    // Create bottle (volcano)
    const bottleGeometry = new THREE.CylinderGeometry(0.3, 0.5, 2, 16);
    const bottleMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x228B22, 
      transparent: true, 
      opacity: 0.7 
    });
    const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
    bottle.position.set(0, 0, 0);
    scene.add(bottle);
    
    // Create mountain
    const mountainGeometry = new THREE.ConeGeometry(2, 1.5, 8);
    const mountainMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(0, -0.5, 0);
    scene.add(mountain);

    // Create lab equipment
    const beakerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12);
    const beakerMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x4169E1, 
      transparent: true, 
      opacity: 0.6 
    });
    const beaker = new THREE.Mesh(beakerGeometry, beakerMaterial);
    beaker.position.set(-2, -0.5, 1);
    scene.add(beaker);

    const spoonGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    const spoonMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
    const spoon = new THREE.Mesh(spoonGeometry, spoonMaterial);
    spoon.position.set(1.5, -0.8, 0.5);
    scene.add(spoon);
    
    volcanoSceneRef.current = { scene, camera, renderer, bottle };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (volcanoSceneRef.current?.bottle) {
        volcanoSceneRef.current.bottle.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();
  };

  const initHookesScene = () => {
    if (!hookesCanvasRef.current) return;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    
    const camera = new THREE.PerspectiveCamera(75, hookesCanvasRef.current.clientWidth / hookesCanvasRef.current.clientHeight, 0.1, 1000);
    camera.position.set(3, 5, 8);
    
    const renderer = new THREE.WebGLRenderer({ canvas: hookesCanvasRef.current, antialias: true });
    renderer.setSize(hookesCanvasRef.current.clientWidth, hookesCanvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xe0e0e0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -3;
    scene.add(floor);
    
    hookesSceneRef.current = { scene, camera, renderer };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  };

  // Language toggle
  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ta" : "en");
  };

  // Experiment functions
  const openExperiment = (experimentId) => {
    setSelectedExperiment(experimentId);
    setCurrentView("experiment");
    
    // Reset experiment states
    if (experimentId === 'volcano') {
      setVolcanoStep(1);
      setVolcanoObservations(t.observations.volcanoStart);
      setVolcanoButtons({ bakingSoda: false, vinegar: true, mix: true });
    } else if (experimentId === 'hookes') {
      setHookesStep(1);
      setHookesObservations(t.observations.hookesStart);
      setHookesButtons({ setup: false, measureNatural: true, addWeight: true, measureExtension: true });
      setHookesCurrentLoad(0);
      setHookesCurrentExtension(0);
      setHookesMeasurements([]);
      setShowMeasurementTable(false);
      setShowWeightDisplay(false);
    } else if (experimentId === 'ohms') {
      setCircuitCurrent(false);
      setCircuitResistance(100);
    } else if (experimentId === 'pendulum') {
      setPendulumSwinging(false);
      setPendulumAngle(0);
      setPendulumPeriod(0);
    }
  };

  const goToIndex = () => {
    setCurrentView("index");
    setSelectedExperiment(null);
    setPendulumSwinging(false);
    setCircuitCurrent(false);
    if (pendulumIntervalRef.current) {
      clearInterval(pendulumIntervalRef.current);
    }
  };

  // Volcano experiment functions
  const addBakingSoda = () => {
    if (volcanoStep !== 1) return;
    
    setVolcanoButtons(prev => ({ ...prev, bakingSoda: true, vinegar: false }));
    setVolcanoStep(2);
    const message = language === "en" 
      ? "\n✅ Added white baking soda powder to the bottle." 
      : "\n✅ பாட்டிலில் வெள்ளை சோடா உப்பு தூள் சேர்க்கப்பட்டது.";
    setVolcanoObservations(prev => prev + message);
    
    if (volcanoSceneRef.current?.bottle) {
      volcanoSceneRef.current.bottle.material.color.setHex(0x90EE90);
    }

    // Add baking soda visual
    if (volcanoSceneRef.current?.scene) {
      const sodaGeometry = new THREE.SphereGeometry(0.1, 8, 6);
      const sodaMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
      const soda = new THREE.Mesh(sodaGeometry, sodaMaterial);
      soda.position.set(0, 0.5, 0);
      volcanoSceneRef.current.scene.add(soda);
      
      addVolcanoSparkles({ x: 0, y: 0.5, z: 0 });
    }
  };

  const addVinegar = () => {
    if (volcanoStep !== 2) return;
    
    setVolcanoButtons(prev => ({ ...prev, vinegar: true, mix: false }));
    setVolcanoStep(3);
    const message = language === "en" 
      ? "\n✅ Added vinegar (acid) to the baking soda (base). Ready for reaction!" 
      : "\n✅ சோடா உப்பு (அடிப்படை) உடன் வினிகர் (அமிலம்) சேர்க்கப்பட்டது. வினைக்கு தயார்!";
    setVolcanoObservations(prev => prev + message);
    
    if (volcanoSceneRef.current?.bottle) {
      volcanoSceneRef.current.bottle.material.color.setHex(0xFFD700);
    }

    // Add vinegar visual
    if (volcanoSceneRef.current?.scene) {
      const vinegarGeometry = new THREE.SphereGeometry(0.15, 8, 6);
      const vinegarMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFFFF00, 
        transparent: true, 
        opacity: 0.7 
      });
      const vinegar = new THREE.Mesh(vinegarGeometry, vinegarMaterial);
      vinegar.position.set(0, 0.3, 0);
      volcanoSceneRef.current.scene.add(vinegar);
      
      addVolcanoSparkles({ x: 0, y: 0.3, z: 0 });
    }
  };

  const mixIngredients = () => {
    if (volcanoStep !== 3) return;
    
    setVolcanoButtons(prev => ({ ...prev, mix: true }));
    setVolcanoStep(4);
    const message = language === "en" 
      ? "\n🌋 ERUPTION! Fizzing, bubbling, and foaming as CO₂ gas is produced from the chemical reaction!" 
      : "\n🌋 வெடிப்பு! வேதியியல் வினையிலிருந்து CO₂ வாயு உற்பத்தியாகும்போது நுரை, குமிழ்கள் மற்றும் அழகான வினை!";
    setVolcanoObservations(prev => prev + message);
    
    if (volcanoSceneRef.current?.bottle) {
      volcanoSceneRef.current.bottle.material.color.setHex(0xFF4500);
    }
    
    createVolcanoEruption();
  };

  const createVolcanoEruption = () => {
    if (!volcanoSceneRef.current?.scene) return;
    
    const newBubbles = [];
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const bubbleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.2, 8, 6);
        const bubbleMaterial = new THREE.MeshLambertMaterial({ 
          color: new THREE.Color().setHSL(Math.random(), 0.7, 0.7),
          transparent: true,
          opacity: 0.8
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        
        bubble.position.set(
          (Math.random() - 0.5) * 0.5,
          1 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        
        newBubbles.push(bubble);
        volcanoSceneRef.current.scene.add(bubble);
      }, i * 100);
    }
    
    setVolcanoBubbles(prev => [...prev, ...newBubbles]);

    // Add sparkles
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        addVolcanoSparkles({ x: 0, y: 1, z: 0 }, 0xFF6B6B);
      }, i * 200);
    }
  };

  const addVolcanoSparkles = (position, color = 0xFFD700) => {
    if (!volcanoSceneRef.current?.scene) return;
    
    for (let i = 0; i < 5; i++) {
      const sparkleGeometry = new THREE.SphereGeometry(0.02, 4, 3);
      const sparkleMaterial = new THREE.MeshBasicMaterial({ color: color });
      const sparkle = new THREE.Mesh(sparkleGeometry, sparkleMaterial);
      
      sparkle.position.set(
        position.x + (Math.random() - 0.5) * 0.8,
        position.y + Math.random() * 0.5,
        position.z + (Math.random() - 0.5) * 0.8
      );
      
      volcanoSceneRef.current.scene.add(sparkle);
      setTimeout(() => {
        if (volcanoSceneRef.current?.scene) {
          volcanoSceneRef.current.scene.remove(sparkle);
        }
      }, 1000);
    }
  };

  const resetVolcanoExperiment = () => {
    setVolcanoStep(1);
    setVolcanoObservations(t.observations.volcanoStart);
    setVolcanoButtons({ bakingSoda: false, vinegar: true, mix: true });
    
    if (volcanoSceneRef.current?.bottle) {
      volcanoSceneRef.current.bottle.material.color.setHex(0x228B22);
    }
    
    setVolcanoBubbles([]);
  };

  // Hookes experiment functions
  const setupSpring = () => {
    if (hookesStep !== 1) return;
    
    setHookesButtons(prev => ({ ...prev, setup: true, measureNatural: false }));
    setHookesStep(2);
    const message = language === "en" 
      ? "\n✅ Set up spring apparatus with stand, spring, and measuring ruler." 
      : "\n✅ ஸ்டாண்ட், ஸ்பிரிங் மற்றும் அளவிடும் அளவுகோலுடன் ஸ்பிரிங் கருவி அமைக்கப்பட்டது.";
    setHookesObservations(prev => prev + message);
    
    if (hookesSceneRef.current?.scene) {
      // Create stand
      const standGeometry = new THREE.BoxGeometry(2, 0.2, 2);
      const standMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
      const stand = new THREE.Mesh(standGeometry, standMaterial);
      stand.position.y = -2.8;
      hookesSceneRef.current.scene.add(stand);
      
      // Create rod
      const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 6, 12);
      const rod = new THREE.Mesh(rodGeometry, standMaterial);
      rod.position.y = 0.2;
      hookesSceneRef.current.scene.add(rod);

      // Create spring
      const springGroup = new THREE.Group();
      const coilCount = 15;
      for (let i = 0; i < coilCount; i++) {
        const coilGeometry = new THREE.TorusGeometry(0.2, 0.02, 8, 16);
        const coilMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const coil = new THREE.Mesh(coilGeometry, coilMaterial);
        coil.position.y = -i * 0.1;
        springGroup.add(coil);
      }
      springGroup.position.set(1, 3, 0);
      hookesSceneRef.current.scene.add(springGroup);

      // Create ruler
      const rulerGeometry = new THREE.BoxGeometry(0.1, 4, 0.05);
      const rulerMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFF00 });
      const ruler = new THREE.Mesh(rulerGeometry, rulerMaterial);
      ruler.position.set(1.5, 1, 0);
      hookesSceneRef.current.scene.add(ruler);
    }
  };

  const measureNaturalLength = () => {
    if (hookesStep !== 2) return;
    
    setHookesButtons(prev => ({ ...prev, measureNatural: true, addWeight: false }));
    setHookesStep(3);
    const message = language === "en" 
      ? "\n✅ Measured natural length of spring: 15cm" 
      : "\n✅ நீரூற்றின் இயற்கை நீளம் அளவிடப்பட்டது: 15செமீ";
    setHookesObservations(prev => prev + message);
    setShowWeightDisplay(true);
    setShowMeasurementTable(true);
    
    // Add pointer visual
    if (hookesSceneRef.current?.scene) {
      const pointerGeometry = new THREE.ConeGeometry(0.05, 0.2, 8);
      const pointerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
      const pointer = new THREE.Mesh(pointerGeometry, pointerMaterial);
      pointer.rotation.z = Math.PI / 2;
      pointer.position.set(1.3, 1.5, 0);
      hookesSceneRef.current.scene.add(pointer);
    }
  };

  const addWeight = () => {
    const newLoad = hookesCurrentLoad + 50;
    const force = (newLoad / 1000) * 9.81;
    const extension = (force / 20) * 100; // k = 20 N/m
    
    setHookesCurrentLoad(newLoad);
    setHookesCurrentExtension(extension);
    const message = language === "en" 
      ?` \n✅ Added ${newLoad}g weight. Spring extended by ${extension.toFixed(1)}cm`
      :` \n✅ ${newLoad}கி எடை சேர்க்கப்பட்டது. நீரூற்று ${extension.toFixed(1)}செமீ நீட்டிக்கப்பட்டது`;
    setHookesObservations(prev => prev + message);
    
    if (hookesStep === 3) {
      setHookesButtons(prev => ({ ...prev, measureExtension: false }));
      setHookesStep(4);
    }
    
    if (newLoad >= 200) {
      setHookesButtons(prev => ({ ...prev, addWeight: true }));
    }

    // Add weight visual
    if (hookesSceneRef.current?.scene) {
      const weightGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);
      const weightMaterial = new THREE.MeshLambertMaterial({ color: 0x4169E1 });
      const weight = new THREE.Mesh(weightGeometry, weightMaterial);
      weight.position.set(1, 1.5 - (extension / 10), 0);
      weight.castShadow = true;
      hookesSceneRef.current.scene.add(weight);
      
      setHookesWeights(prev => [...prev, weight]);
    }
  };

  const measureExtension = () => {
    const force = (hookesCurrentLoad / 1000) * 9.81;
    const extension = hookesCurrentExtension;
    const springConstant = force / (extension / 100);
    
    const measurement = {
      weight: hookesCurrentLoad,
      force: force.toFixed(3),
      extension: extension.toFixed(1),
      springConstant: springConstant.toFixed(1)
    };
    
    setHookesMeasurements(prev => [...prev, measurement]);
    const message = language === "en" 
      ?` \n✅ Measured extension: ${extension.toFixed(1)}cm for ${hookesCurrentLoad}g weight. Spring constant k = ${springConstant.toFixed(1)} N/m`
      :` \n✅ நீட்சி அளவிடப்பட்டது: ${hookesCurrentLoad}கி எடைக்கு ${extension.toFixed(1)}செமீ. நீரூற்று மாறிலி k = ${springConstant.toFixed(1)} N/m`;
    setHookesObservations(prev => prev + message);
    
    setHookesButtons(prev => ({ ...prev, measureExtension: true }));
    
    if (hookesCurrentLoad >= 200) {
      setHookesStep(5);
      const avgK = hookesMeasurements.reduce((sum, m) => sum + parseFloat(m.springConstant), 0) / (hookesMeasurements.length || 1);
      const finalMessage = language === "en" 
        ?` \n🎯 Average Spring Constant: ${avgK.toFixed(1)} N/m - Hooke's Law verified!`
        : `\n🎯 சராசரி நீரூற்று மாறிலி: ${avgK.toFixed(1)} N/m - ஹூக்கின் விதி சரிபார்க்கப்பட்டது!`;
      setHookesObservations(prev => prev + finalMessage);
    }
  };

  const resetHookesExperiment = () => {
    setHookesStep(1);
    setHookesObservations(t.observations.hookesStart);
    setHookesButtons({ setup: false, measureNatural: true, addWeight: true, measureExtension: true });
    setHookesCurrentLoad(0);
    setHookesCurrentExtension(0);
    setHookesMeasurements([]);
    setShowMeasurementTable(false);
    setShowWeightDisplay(false);
    setHookesWeights([]);
  };

  // Circuit functions
  const toggleCurrent = () => {
    setCircuitCurrent(prev => !prev);
  };

  const changeResistance = () => {
    const resistances = [100, 200, 50, 150];
    const currentIndex = resistances.indexOf(circuitResistance);
    setCircuitResistance(resistances[(currentIndex + 1) % resistances.length]);
  };

  const resetCircuit = () => {
    setCircuitCurrent(false);
    setCircuitResistance(100);
  };

  const getResistorColor = () => {
    const colors = {
      100: 'linear-gradient(90deg, #8B4513, #D2691E)',
      200: 'linear-gradient(90deg, #FF0000, #8B0000)',
      50: 'linear-gradient(90deg, #00FF00, #006400)',
      150: 'linear-gradient(90deg, #0000FF, #000080)'
    };
    return colors[circuitResistance];
  };

  // Pendulum functions
  const startPendulum = () => {
    setPendulumSwinging(true);
    setPendulumStartTime(Date.now());
  };

  const stopPendulum = () => {
    setPendulumSwinging(false);
    setPendulumAngle(0);
    if (pendulumIntervalRef.current) {
      clearInterval(pendulumIntervalRef.current);
    }
  };

  const measurePeriod = () => {
    if (!pendulumSwinging) return;
    
    const currentTime = Date.now();
    const elapsedTime = (currentTime - pendulumStartTime) / 1000;
    const swings = Math.floor(elapsedTime / 2);
    const period = swings > 0 ? (elapsedTime / swings).toFixed(2) : 0;
    
    setPendulumPeriod(period);
    
    const length = 0.5; // 50cm in meters
    const calculatedG = (4 * Math.PI * Math.PI * length) / (period * period);
    
    console.log(`Period: ${period}s, Calculated g : ${calculatedG.toFixed(2)} m/s²`);
  };

  const resetPendulum = () => {
    setPendulumSwinging(false);
    setPendulumAngle(0);
    setPendulumPeriod(0);
    setPendulumStartTime(0);
    if (pendulumIntervalRef.current) {
      clearInterval(pendulumIntervalRef.current);
    }
  };

  // Calculate Ohm's law values
  const voltage = 5;
  const current = circuitCurrent ? (voltage / circuitResistance).toFixed(3) : 0;

  // Render functions
  const renderIndexPage = () => (
    <div className="index-page">
      <div className="main-header">
        <button 
          className="language-toggle"
          onClick={toggleLanguage}
        >
          {t.language}
        </button>
        <h1>{t.mainTitle}</h1>
        <p>{t.mainSubtitle}</p>
        <p>{t.mainDescription}</p>
      </div>
      
      <div className="experiments-grid">
        {Object.entries(t.experiments).map(([key, experiment]) => (
          <div 
            key={key}
            className="experiment-card"
            onClick={() => openExperiment(key)}
          >
            <span className="experiment-icon">{experiment.icon}</span>
            <h3>{experiment.title}</h3>
            <p>{experiment.description}</p>
            <span className={`difficulty-badge ${experiment.difficulty.toLowerCase()}`}>
              {experiment.difficulty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVolcanoPractice = () => (
    <div className="content-section active scroll-container">
    <div className="content-wrapper">
      <div className="lab-container">
        <canvas 
          ref={volcanoCanvasRef} 
          className="lab-canvas"
        ></canvas>

        <div className="controls-panel">
          <button 
            className={`control-button ${volcanoButtons.bakingSoda ? 'disabled' : ''}`}
            onClick={addBakingSoda}
            disabled={volcanoButtons.bakingSoda}
          >
            {t.buttons.addBakingSoda}
          </button>
          <button 
            className={`control-button ${volcanoButtons.vinegar ? 'disabled' : ''}`}
            onClick={addVinegar}
            disabled={volcanoButtons.vinegar}
          >
            {t.buttons.addVinegar}
          </button>
          <button 
            className={`control-button ${volcanoButtons.mix ? 'disabled' : ''}`}
            onClick={mixIngredients}
            disabled={volcanoButtons.mix}
          >
            {t.buttons.mixWatch}
          </button>
          <button 
            className="control-button"
            onClick={resetVolcanoExperiment}
          >
            {t.buttons.reset}
          </button>
        </div>

        <div className="observation-panel">
          <h4>{t.observations.title}</h4>
          <div style={{ whiteSpace: 'pre-line', fontSize: '1.1em' }}>{volcanoObservations}</div>
        </div>
      </div>
      </div>
    </div>
  );

  const renderHookesPractice = () => (
    <div className="content-section active">
      <div className="lab-container">
        <canvas 
          ref={hookesCanvasRef} 
          className="lab-canvas"
        ></canvas>

        {showWeightDisplay && (
          <div className="weight-display">
            {t.observations.currentLoad}: {hookesCurrentLoad}g | {t.observations.extension}: {hookesCurrentExtension.toFixed(1)}cm
          </div>
        )}

        <div className="controls-panel">
          <button 
            className={`control-button ${hookesButtons.setup ? 'disabled' : ''}`}
            onClick={setupSpring}
            disabled={hookesButtons.setup}
          >
            {t.buttons.setupSpring}
          </button>
          <button 
            className={`control-button ${hookesButtons.measureNatural ? 'disabled' : ''}`}
            onClick={measureNaturalLength}
            disabled={hookesButtons.measureNatural}
          >
            {t.buttons.measureNatural}
          </button>
          <button 
            className={`control-button ${hookesButtons.addWeight ? 'disabled' : ''}`}
            onClick={addWeight}
            disabled={hookesButtons.addWeight}
          >
            {t.buttons.addWeight}
          </button>
          <button 
            className={`control-button ${hookesButtons.measureExtension ? 'disabled' : ''}`}
            onClick={measureExtension}
            disabled={hookesButtons.measureExtension}
          >
            {t.buttons.measureExtension}
          </button>
          <button 
            className="control-button"
            onClick={resetHookesExperiment}
          >
            {t.buttons.reset}
          </button>
        </div>

        {showMeasurementTable && (
          <div className="measurements-table">
            <h4>{t.observations.measurements}</h4>
            <table>
              <thead>
                <tr>
                  <th>{language === "en" ? "Weight (g)" : "எடை (கி)"}</th>
                  <th>{language === "en" ? "Force (N)" : "விசை (N)"}</th>
                  <th>{language === "en" ? "Extension (cm)" : "நீட்சி (செமீ)"}</th>
                  <th>{language === "en" ? "k = F/x (N/m)" : "k = F/x (N/m)"}</th>
                </tr>
              </thead>
              <tbody>
                {hookesMeasurements.map((measurement, index) => (
                  <tr key={index}>
                    <td>{measurement.weight}</td>
                    <td>{measurement.force}</td>
                    <td>{measurement.extension}</td>
                    <td>{measurement.springConstant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="observation-panel">
          <h4>{t.observations.title}</h4>
          <div style={{ whiteSpace: 'pre-line', fontSize: '1.1em' }}>{hookesObservations}</div>
        </div>
      </div>
    </div>
  );

  const renderOhmsPractice = () => (
    <div className="content-section active">
      <div className="lab-container">
        <div className="circuit-container">
          {/* Battery */}
          <div className="battery">
            <div style={{ color: 'white', textAlign: 'center', lineHeight: '80px', fontWeight: 'bold' }}>5V</div>
          </div>

          {/* Circuit Wires */}
          <div className="circuit-wire" style={{ width: '150px', height: '4px', left: '90px', top: '90px' }}></div>
          <div className="circuit-wire" style={{ width: '4px', height: '100px', left: '240px', top: '90px' }}></div>
          <div className="circuit-wire" style={{ width: '150px', height: '4px', left: '90px', top: '186px' }}></div>
          <div className="circuit-wire" style={{ width: '4px', height: '100px', left: '90px', top: '90px' }}></div>

          {/* Resistor */}
          <div 
            className="resistor"
            style={{ background: getResistorColor() }}
          >
            <div style={{ color: 'white', textAlign: 'center', lineHeight: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              {circuitResistance}Ω
            </div>
          </div>

          {/* Current Flow Animation */}
          {circuitCurrent && (
            <div className="current-flow"></div>
          )}
        </div>

        <div className="controls-panel">
          <button 
            className="control-button"
            onClick={toggleCurrent}
          >
            {circuitCurrent ? t.buttons.turnOffCurrent : t.buttons.turnOnCurrent}
          </button>
          <button 
            className="control-button"
            onClick={changeResistance}
          >
            {t.buttons.changeResistor}
          </button>
          <button 
            className="control-button"
            onClick={resetCircuit}
          >
            {t.buttons.resetCircuit}
          </button>
        </div>

        <div className="observation-panel">
          <h4>{t.observations.measurements}</h4>
          <div style={{ fontSize: '1.1em' }}>
            <div>{t.observations.voltage}: {voltage}V</div>
            <div>{t.observations.current}: {current}A</div>
            <div>{t.observations.resistance}: {circuitResistance}Ω</div>
            {circuitCurrent && (
              <div style={{ marginTop: '10px', color: '#4ECDC4', fontWeight: 'bold' }}>
                {t.observations.currentFlowing}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPendulumPractice = () => (
    <div className="content-section active">
      <div className="lab-container">
        <div className="pendulum-container">
          {/* Pendulum Support */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '50%', 
            width: '120px', 
            height: '4px', 
            background: '#696969', 
            transform: 'translateX(-50%)' 
          }}></div>
          
          {/* Pendulum String and Bob */}
          <div style={{ position: 'absolute', top: '24px', left: '50%', transformOrigin: 'top', transform: 'translateX(-50%)' }}>
            <div 
              className="pendulum-string"
              style={`{ 
                '--pendulum-angle': ${pendulumAngle}deg,
                transform: rotate(${pendulumAngle}deg)
              }`}
            >
              {/* Pendulum Bob */}
              <div className="pendulum-bob"></div>
            </div>
          </div>
          
          {/* Length indicator */}
          <div style={{ 
            position: 'absolute', 
            right: '20px', 
            top: '40px', 
            color: 'white', 
            fontSize: '14px',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed'
          }}>
            50cm
          </div>
        </div>

        <div className="controls-panel">
          <button 
            className={`control-button ${pendulumSwinging ? 'disabled' : ''}`}
            onClick={startPendulum}
            disabled={pendulumSwinging}
          >
            {t.buttons.startSwinging}
          </button>
          <button 
            className="control-button"
            onClick={stopPendulum}
          >
            {t.buttons.stop}
          </button>
          <button 
            className="control-button"
            onClick={measurePeriod}
          >
            {t.buttons.measurePeriod}
          </button>
          <button 
            className="control-button"
            onClick={resetPendulum}
          >
            {t.buttons.reset}
          </button>
        </div>

        <div className="observation-panel">
          <h4>{t.observations.measurements}</h4>
          <div style={{ fontSize: '1.1em' }}>
            <div>{t.observations.length}: 50cm</div>
            <div>{`t.observations.period}: {pendulumPeriod ? ${pendulumPeriod}s : '---'`}</div>
            <div>{`t.observations.calculatedG}: {pendulumPeriod ? ${((4 * Math.PI * Math.PI * 0.5) / (pendulumPeriod * pendulumPeriod)).toFixed(2)} m/s² : '---'`}</div>
            {pendulumSwinging && (
              <div style={{ marginTop: '10px', color: '#4ECDC4', fontWeight: 'bold' }}>
                {t.observations.swinging}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (currentView === "index") {
    return renderIndexPage();
  }

  if (currentView === "experiment" && selectedExperiment) {
    return (
      <div className="experiment-page active">
        <div className="experiment-header">
          <button 
           className="back-button"
            onClick={goToIndex}
          >
            {t.backToLab}
          </button>
          <button 
            className="language-toggle"
            onClick={toggleLanguage}
             
          >
            {t.language}
          </button>
          <h1>{t.experiments[selectedExperiment].title}</h1>
          <p>{t.experiments[selectedExperiment].subtitle}</p>
        </div>

        <div>
          {selectedExperiment === 'volcano' && renderVolcanoPractice()}
          {selectedExperiment === 'hookes' && renderHookesPractice()}
          {selectedExperiment === 'ohms' && renderOhmsPractice()}
          {selectedExperiment === 'pendulum' && renderPendulumPractice()}
        </div>
      </div>
    );
  }

  return null;
};

export default LabExperiment;