import React, { useState, useEffect } from 'react';
import './ScienceQuiz.css';
import { useUser } from './UserContext';

// Move useUser hook inside the component - this was the main issue
const questionSets = {
  level1: [
   {
      id: 'l1q1',
      english: {
        question: 'Match digestive organs with functions',
        leftItems: ['Stomach', 'Liver', 'Small Intestine', 'Large Intestine'],
        rightItems: ['Produces bile', 'Absorbs nutrients', 'Absorbs water', 'Digests food']
      },
      tamil: {
        question: 'செரிமான உறுப்புகளை செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['வயிறு', 'கல்லீரல்', 'சிறுகுடல்', 'பெருங்குடல்'],
        rightItems: ['பித்தம் உற்பத்தி', 'ஊட்டச்சத்து உறிஞ்சுதல்', 'நீரை உறிஞ்சுதல்', 'உணவு செரிமானம்']
      },
      correctMatches: { 'Stomach': 'Digests food', 'Liver': 'Produces bile', 'Small Intestine': 'Absorbs nutrients', 'Large Intestine': 'Absorbs water' },
      subject: 'Biology'
    },
    {
      id: 'l1q2',
      english: {
        question: 'Match states of matter with properties',
        leftItems: ['Solid', 'Liquid', 'Gas', 'Plasma'],
        rightItems: ['Ionized particles', 'Fixed shape', 'No fixed shape', 'Container shape']
      },
      tamil: {
        question: 'பொருளின் நிலைகளை பண்புகளுடன் பொருத்துக',
        leftItems: ['திடம்', 'திரவம்', 'வாயு', 'பிளாஸ்மா'],
        rightItems: ['அயனியாக்கப்பட்ட துகள்கள்', 'நிலையான வடிவம்', 'நிலையான வடிவம் இல்லை', 'பாத்திர வடிவம்']
      },
      correctMatches: { 'Solid': 'Fixed shape', 'Liquid': 'Container shape', 'Gas': 'No fixed shape', 'Plasma': 'Ionized particles' },
      subject: 'Physics'
    },
    {
      id: 'l1q3',
      english: {
        question: 'Match acids with formulas',
        leftItems: ['HCl', 'H₂SO₄', 'HNO₃', 'CH₃COOH'],
        rightItems: ['Nitric', 'Hydrochloric', 'Acetic Acid', 'Sulphuric']
      },
      tamil: {
        question: 'அமிலங்களை சூத்திரங்களுடன் பொருத்துக',
        leftItems: ['HCl', 'H₂SO₄', 'HNO₃', 'CH₃COOH'],
        rightItems: ['நைட்ரிக்', 'ஹைட்ரோக்ளோரிக்', 'அசிட்டிக்', 'கந்தக']
      },
      correctMatches: { 'HCl': 'Hydrochloric', 'H₂SO₄': 'Sulphuric', 'HNO₃': 'Nitric', 'CH₃COOH': 'Acetic Acid' },
      subject: 'Chemistry'
    },
    {
      id: 'l1q4',
      english: {
        question: 'Match forces with examples',
        leftItems: ['Gravity', 'Friction', 'Magnetic', 'Electric'],
        rightItems: ['Iron attraction', 'Charged objects', 'Falling apple', 'Sliding box']
      },
      tamil: {
        question: 'விசைகளை எடுத்துக்காட்டுகளுடன் பொருத்துக',
        leftItems: ['ஈர்ப்பு', 'உராய்வு', 'காந்த', 'மின்'],
        rightItems: ['இரும்பு ஈர்ப்பு', 'மின்னூட்டம்', 'விழும் ஆப்பிள்', 'சறுக்கும் பெட்டி']
      },
      correctMatches: { 'Gravity': 'Falling apple', 'Friction': 'Sliding box', 'Magnetic': 'Iron attraction', 'Electric': 'Charged objects' },
      subject: 'Physics'
    },
    {
      id: 'l1q5',
      english: {
        question: 'Match plant parts with functions',
        leftItems: ['Roots', 'Stem', 'Leaves', 'Flowers'],
        rightItems: ['Reproduction', 'Absorption', 'Photosynthesis', 'Support']
      },
      tamil: {
        question: 'தாவர பாகங்களை செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['வேர்கள்', 'தண்டு', 'இலைகள்', 'பூக்கள்'],
        rightItems: ['இனப்பெருக்கம்', 'உறிஞ்சுதல்', 'ஒளிச்சேர்க்கை', 'ஆதரவு']
      },
      correctMatches: { 'Roots': 'Absorption', 'Stem': 'Support', 'Leaves': 'Photosynthesis', 'Flowers': 'Reproduction' },
      subject: 'Biology'
    },
    {
      id: 'l1q6',
      english: {
        question: 'Match lab tools with uses',
        leftItems: ['Beaker', 'Test Tube', 'Flask', 'Thermometer'],
        rightItems: ['Small reactions', 'Temperature', 'Heating', 'Mixing']
      },
      tamil: {
        question: 'ஆய்வக கருவிகளை பயன்பாடுகளுடன் பொருத்துக',
        leftItems: ['கிளாஸ்', 'குழாய்', 'பிளாஸ்க்', 'வெப்பமானி'],
        rightItems: ['சிறிய வினைகள்', 'வெப்பநிலை', 'சூடாக்குதல்', 'கலத்தல்']
      },
      correctMatches: { 'Beaker': 'Mixing', 'Test Tube': 'Small reactions', 'Flask': 'Heating', 'Thermometer': 'Temperature' },
      subject: 'Chemistry'
    },
    {
      id: 'l1q7',
      english: {
        question: 'Match animals with breathing',
        leftItems: ['Fish', 'Bird', 'Frog', 'Insect'],
        rightItems: ['Spiracles', 'Gills', 'Skin+Lungs', 'Lungs']
      },
      tamil: {
        question: 'விலங்குகளை சுவாசத்துடன் பொருத்துக',
        leftItems: ['மீன்', 'பறவை', 'தேரை', 'பூச்சி'],
        rightItems: ['சுவாசத் துளைகள்', 'செவுள்கள்', 'தோல்+நுரையீரல்', 'நுரையீரல்']
      },
      correctMatches: { 'Fish': 'Gills', 'Bird': 'Lungs', 'Frog': 'Skin+Lungs', 'Insect': 'Spiracles' },
      subject: 'Biology'
    },
    {
      id: 'l1q8',
      english: {
        question: 'Match energy with examples',
        leftItems: ['Heat', 'Light', 'Sound', 'Electric'],
        rightItems: ['Bell', 'Battery', 'Fire', 'Sun']
      },
      tamil: {
        question: 'ஆற்றலை எடுத்துக்காட்டுகளுடன் பொருத்துக',
        leftItems: ['வெப்பம்', 'ஒளி', 'ஒலி', 'மின்சாரம்'],
        rightItems: ['மணி', 'மின்கலம்', 'நெருப்பு', 'சூரியன்']
      },
      correctMatches: { 'Heat': 'Fire', 'Light': 'Sun', 'Sound': 'Bell', 'Electric': 'Battery' },
      subject: 'Physics'
    },
    {
      id: 'l1q9',
      english: {
        question: 'Match water cycle with process',
        leftItems: ['Evaporation', 'Condensation', 'Precipitation', 'Collection'],
        rightItems: ['Rain/Snow', 'Water bodies', 'Water→Vapor', 'Vapor→Water']
      },
      tamil: {
        question: 'நீர் சுழற்சியை செயல்முறையுடன் பொருத்துக',
        leftItems: ['ஆவியாதல்', 'ஒடுக்கம்', 'மழைப்பொழிவு', 'சேகரிப்பு'],
        rightItems: ['மழை/பனி', 'நீர்நிலைகள்', 'நீர்→ஆவி', 'ஆவி→நீர்']
      },
      correctMatches: { 'Evaporation': 'Water→Vapor', 'Condensation': 'Vapor→Water', 'Precipitation': 'Rain/Snow', 'Collection': 'Water bodies' },
      subject: 'Environmental'
    },
    {
      id: 'l1q10',
      english: {
        question: 'Match metals with properties',
        leftItems: ['Iron', 'Copper', 'Aluminum', 'Gold'],
        rightItems: ['Light', 'No rust', 'Rusts', 'Conductor']
      },
      tamil: {
        question: 'உலோகங்களை பண்புகளுடன் பொருத்துக',
        leftItems: ['இரும்பு', 'தாமிரம்', 'அலுமினியம்', 'தங்கம்'],
        rightItems: ['இலகுவானது', 'துருப்பிடிக்காது', 'துருப்பிடிக்கும்', 'கடத்தி']
      },
      correctMatches: { 'Iron': 'Rusts', 'Copper': 'Conductor', 'Aluminum': 'Light', 'Gold': 'No rust' },
      subject: 'Chemistry'
    },
    {
      id: 'l1q11',
      english: {
        question: 'Match sense organs with functions',
        leftItems: ['Eyes', 'Ears', 'Nose', 'Tongue'],
        rightItems: ['Taste', 'Sight', 'Smell', 'Hearing']
      },
      tamil: {
        question: 'உணர்வு உறுப்புகளை செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['கண்', 'காது', 'மூக்கு', 'நாக்கு'],
        rightItems: ['சுவை', 'பார்வை', 'மணம்', 'கேட்குதல்']
      },
      correctMatches: { 'Eyes': 'Sight', 'Ears': 'Hearing', 'Nose': 'Smell', 'Tongue': 'Taste' },
      subject: 'Biology'
    },
    {
    id: 'l1q12',
    english: {
      question: 'Match planets with features',
      leftItems: ['Mercury', 'Venus', 'Earth', 'Mars'],
      rightItems: ['Red planet', 'Smallest', 'Life exists', 'Hottest']
    },
    tamil: {
      question: 'கிரகங்களை பண்புகளுடன் பொருத்துக',
      leftItems: ['புதன்', 'வெள்ளி', 'பூமி', 'செவ்வாய்'],
      rightItems: ['சிவப்பு கிரகம்', 'சிறியது', 'உயிர்கள் உள்ளன', 'அதிக சூடு']
    },
    correctMatches: { 'Mercury': 'Smallest', 'Venus': 'Hottest', 'Earth': 'Life exists', 'Mars': 'Red planet' },
    subject: 'Physics'
  },
  {
    id: 'l1q13',
    english: {
      question: 'Match body parts with functions',
      leftItems: ['Heart', 'Lungs', 'Brain', 'Stomach'],
      rightItems: ['Digestion', 'Pumps blood', 'Control', 'Breathing']
    },
    tamil: {
      question: 'உடல் பாகங்களை செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['இதயம்', 'நுரையீரல்', 'மூளை', 'வயிறு'],
      rightItems: ['செரிமானம்', 'இரத்தம் பம்ப் செய்கிறது', 'கட்டுப்பாடு', 'சுவாசம்']
    },
    correctMatches: { 'Heart': 'Pumps blood', 'Lungs': 'Breathing', 'Brain': 'Control', 'Stomach': 'Digestion' },
    subject: 'Biology'
  },
  {
    id: 'l1q14',
    english: {
      question: 'Match sources of light',
      leftItems: ['Sun', 'Candle', 'Torch', 'Bulb'],
      rightItems: ['Battery', 'Natural', 'Electricity', 'Fire']
    },
    tamil: {
      question: 'ஒளியின் மூலங்களை பொருத்துக',
      leftItems: ['சூரியன்', 'மெழுகுவர்த்தி', 'டார்ச்', 'பல்பு'],
      rightItems: ['மின்கலம்', 'இயற்கை', 'மின்சாரம்', 'தீ']
    },
    correctMatches: { 'Sun': 'Natural', 'Candle': 'Fire', 'Torch': 'Battery', 'Bulb': 'Electricity' },
    subject: 'Physics'
  },
  {
    id: 'l1q15',
    english: {
      question: 'Match animals with food habits',
      leftItems: ['Cow', 'Lion', 'Crow', 'Bear'],
      rightItems: ['Omnivore', 'Herbivore', 'Omnivore', 'Carnivore']
    },
    tamil: {
      question: 'விலங்குகளை உணவுப் பழக்கங்களுடன் பொருத்துக',
      leftItems: ['மாடு', 'சிங்கம்', 'காகம்', 'கரடி'],
      rightItems: ['சைவம்+மாமிசம்', 'சைவம்', 'சைவம்+மாமிசம்', 'மாமிசம்']
    },
    correctMatches: { 'Cow': 'Herbivore', 'Lion': 'Carnivore', 'Crow': 'Omnivore', 'Bear': 'Omnivore' },
    subject: 'Biology'
  },
  {
    id: 'l1q16',
    english: {
      question: 'Match natural resources',
      leftItems: ['Coal', 'Petrol', 'Sunlight', 'Water'],
      rightItems: ['Essential', 'Fossil fuel', 'Renewable', 'Fuel']
    },
    tamil: {
      question: 'இயற்கை வளங்களை பொருத்துக',
      leftItems: ['நிலக்கரி', 'பெட்ரோல்', 'சூரிய ஒளி', 'தண்ணீர்'],
      rightItems: ['முக்கியமானது', 'எரிபொருள்', 'மறுபடியும் பயன்படும்', 'எரிபொருள்']
    },
    correctMatches: { 'Coal': 'Fossil fuel', 'Petrol': 'Fuel', 'Sunlight': 'Renewable', 'Water': 'Essential' },
    subject: 'Environmental'
  },
  {
    id: 'l1q17',
    english: {
      question: 'Match solids with uses',
      leftItems: ['Iron', 'Wood', 'Glass', 'Plastic'],
      rightItems: ['Windows', 'Building', 'Bottles', 'Furniture']
    },
    tamil: {
      question: 'திடங்களை பயன்பாடுகளுடன் பொருத்துக',
      leftItems: ['இரும்பு', 'மரம்', 'கண்ணாடி', 'பிளாஸ்டிக்'],
      rightItems: ['ஜன்னல்கள்', 'கட்டிடம்', 'பாட்டில்கள்', 'அமர்வு']
    },
    correctMatches: { 'Iron': 'Building', 'Wood': 'Furniture', 'Glass': 'Windows', 'Plastic': 'Bottles' },
    subject: 'Chemistry'
  },
  {
    id: 'l1q18',
    english: {
      question: 'Match parts of a plant',
      leftItems: ['Roots', 'Stem', 'Leaf', 'Flower'],
      rightItems: ['Support', 'Reproduction', 'Absorbs water', 'Photosynthesis']
    },
    tamil: {
      question: 'தாவர பாகங்களை பொருத்துக',
      leftItems: ['வேர்கள்', 'தண்டு', 'இலை', 'பூ'],
      rightItems: ['ஆதரவு', 'இனப்பெருக்கம்', 'நீர் உறிஞ்சும்', 'ஒளிச்சேர்க்கை']
    },
    correctMatches: { 'Roots': 'Absorbs water', 'Stem': 'Support', 'Leaf': 'Photosynthesis', 'Flower': 'Reproduction' },
    subject: 'Biology'
  },
  {
    id: 'l1q19',
    english: {
      question: 'Match weather tools',
      leftItems: ['Thermometer', 'Rain gauge', 'Wind vane', 'Barometer'],
      rightItems: ['Wind direction', 'Temperature', 'Air pressure', 'Rainfall']
    },
    tamil: {
      question: 'வானிலை கருவிகளை பொருத்துக',
      leftItems: ['வெப்பமானி', 'மழை அளவையர்', 'காற்று காட்டி', 'காற்றழுத்தமானி'],
      rightItems: ['காற்று திசை', 'வெப்பநிலை', 'காற்றழுத்தம்', 'மழை அளவு']
    },
    correctMatches: { 'Thermometer': 'Temperature', 'Rain gauge': 'Rainfall', 'Wind vane': 'Wind direction', 'Barometer': 'Air pressure' },
    subject: 'Environmental'
  },
  {
    id: 'l1q20',
    english: {
      question: 'Match energy forms',
      leftItems: ['Sound', 'Light', 'Heat', 'Electric'],
      rightItems: ['Battery', 'Bell', 'Fire', 'Sun']
    },
    tamil: {
      question: 'ஆற்றலின் வடிவங்களை பொருத்துக',
      leftItems: ['ஒலி', 'ஒளி', 'வெப்பம்', 'மின்சாரம்'],
      rightItems: ['மின்கலம்', 'மணி', 'நெருப்பு', 'சூரியன்']
    },
    correctMatches: { 'Sound': 'Bell', 'Light': 'Sun', 'Heat': 'Fire', 'Electric': 'Battery' },
    subject: 'Physics'
  },
  {
    id: 'l1q21',
    english: {
      question: 'Match materials with properties',
      leftItems: ['Rubber', 'Iron', 'Glass', 'Cotton'],
      rightItems: ['Transparent', 'Elastic', 'Soft', 'Strong']
    },
    tamil: {
      question: 'பொருட்களை பண்புகளுடன் பொருத்துக',
      leftItems: ['ரப்பர்', 'இரும்பு', 'கண்ணாடி', 'பருத்தி'],
      rightItems: ['வெளிப்படையானது', 'நெகிழ்ச்சி', 'மென்மை', 'வலிமை']
    },
    correctMatches: { 'Rubber': 'Elastic', 'Iron': 'Strong', 'Glass': 'Transparent', 'Cotton': 'Soft' },
    subject: 'Chemistry'
  },
  {
    id: 'l1q22',
    english: {
      question: 'Match inventions with inventors',
      leftItems: ['Telephone', 'Bulb', 'Radio', 'Airplane'],
      rightItems: ['Wright Brothers', 'Alexander Graham Bell', 'Marconi', 'Thomas Edison']
    },
    tamil: {
      question: 'கண்டுபிடிப்புகளை கண்டுபிடிப்பாளர்களுடன் பொருத்துக',
      leftItems: ['தொலைபேசி', 'பல்பு', 'வானொலி', 'விமானம்'],
      rightItems: ['ரைட் சகோதரர்கள்', 'அலெக்ஸாண்டர் கிராஹம் பெல்', 'மார்கோனி', 'தாமஸ் எடிசன்']
    },
    correctMatches: { 'Telephone': 'Alexander Graham Bell', 'Bulb': 'Thomas Edison', 'Radio': 'Marconi', 'Airplane': 'Wright Brothers' },
    subject: 'Physics'
  },
  {
    id: 'l1q23',
    english: {
      question: 'Match diseases with affected organs',
      leftItems: ['Asthma', 'Cataract', 'Tooth decay', 'Ulcer'],
      rightItems: ['Stomach', 'Lungs', 'Teeth', 'Eye']
    },
    tamil: {
      question: 'நோய்களை பாதிக்கும் உறுப்புகளுடன் பொருத்துக',
      leftItems: ['ஆஸ்துமா', 'முத்திரை நோய்', 'பல் அழுகை', 'வயிறு புண்'],
      rightItems: ['வயிறு', 'நுரையீரல்', 'பல்', 'கண்']
    },
    correctMatches: { 'Asthma': 'Lungs', 'Cataract': 'Eye', 'Tooth decay': 'Teeth', 'Ulcer': 'Stomach' },
    subject: 'Biology'
  },
  {
    id: 'l1q24',
    english: {
      question: 'Match types of soil with crops',
      leftItems: ['Alluvial', 'Black', 'Red', 'Sandy'],
      rightItems: ['Groundnut', 'Rice', 'Millets', 'Cotton']
    },
    tamil: {
      question: 'மண் வகைகளை பயிர்களுடன் பொருத்துக',
      leftItems: ['அவிழ்ச்சி மண்', 'கருப்பு மண்', 'சிவப்பு மண்', 'மணற்பாங்கு'],
      rightItems: ['வேர்க்கடலை', 'அரிசி', 'கம்பு', 'பருத்தி']
    },
    correctMatches: { 'Alluvial': 'Rice', 'Black': 'Cotton', 'Red': 'Millets', 'Sandy': 'Groundnut' },
    subject: 'Environmental'
  },
  {
    id: 'l1q25',
    english: {
      question: 'Match gases with uses',
      leftItems: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'],
      rightItems: ['Balloons', 'Breathing', 'Fertilizer', 'Fire extinguisher']
    },
    tamil: {
      question: 'வாயுக்களை பயன்பாடுகளுடன் பொருத்துக',
      leftItems: ['ஆக்சிஜன்', 'கார்பன் டை ஆக்சைடு', 'நைட்ரஜன்', 'ஹீலியம்'],
      rightItems: ['பலூன்கள்', 'சுவாசம்', 'உரம்', 'தீ அணைப்பான்']
    },
    correctMatches: { 'Oxygen': 'Breathing', 'Carbon dioxide': 'Fire extinguisher', 'Nitrogen': 'Fertilizer', 'Helium': 'Balloons' },
    subject: 'Chemistry'
  },
  {
    id: 'l1q26',
    english: {
      question: 'Match body fluids',
      leftItems: ['Blood', 'Saliva', 'Sweat', 'Tears'],
      rightItems: ['Cooling', 'Protection', 'Transport', 'Digestion']
    },
    tamil: {
      question: 'உடல் திரவங்களை செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['இரத்தம்', 'உமிழ்நீர்', 'வியர்வை', 'கண்ணீர்'],
      rightItems: ['குளிர்ச்சி', 'பாதுகாப்பு', 'கொண்டு செல்கிறது', 'செரிமானம்']
    },
    correctMatches: { 'Blood': 'Transport', 'Saliva': 'Digestion', 'Sweat': 'Cooling', 'Tears': 'Protection' },
    subject: 'Biology'
  },
  {
    id: 'l1q27',
    english: {
      question: 'Match water states',
      leftItems: ['Ice', 'Steam', 'Rain', 'Snow'],
      rightItems: ['Gas', 'Liquid', 'Solid', 'Solid']
    },
    tamil: {
      question: 'தண்ணீரின் நிலைகளை பொருத்துக',
      leftItems: ['பனி', 'நீராவி', 'மழை', 'பனிச்சரிவு'],
      rightItems: ['வாயு', 'திரவம்', 'திடம்', 'திடம்']
    },
    correctMatches: { 'Ice': 'Solid', 'Steam': 'Gas', 'Rain': 'Liquid', 'Snow': 'Solid' },
    subject: 'Chemistry'
  },
  {
    id: 'l1q28',
    english: {
      question: 'Match means of transport',
      leftItems: ['Train', 'Ship', 'Aeroplane', 'Car'],
      rightItems: ['Air', 'Rail', 'Road', 'Water']
    },
    tamil: {
      question: 'போக்குவரத்து முறைகளை பொருத்துக',
      leftItems: ['ரயில்', 'கப்பல்', 'விமானம்', 'கார்'],
      rightItems: ['வானம்', 'ரயில்', 'சாலை', 'நீர்']
    },
    correctMatches: { 'Train': 'Rail', 'Ship': 'Water', 'Aeroplane': 'Air', 'Car': 'Road' },
    subject: 'Environmental'
  },
  {
    id: 'l1q29',
    english: {
      question: 'Match shapes with sides',
      leftItems: ['Triangle', 'Square', 'Pentagon', 'Hexagon'],
      rightItems: ['6 sides', '3 sides', '4 sides', '5 sides']
    },
    tamil: {
      question: 'வடிவங்களை பக்கங்களுடன் பொருத்துக',
      leftItems: ['முக்கோணம்', 'சதுரம்', 'ஐந்துபக்க', 'ஆறுபக்க'],
      rightItems: ['6 பக்கம்', '3 பக்கம்', '4 பக்கம்', '5 பக்கம்']
    },
    correctMatches: { 'Triangle': '3 sides', 'Square': '4 sides', 'Pentagon': '5 sides', 'Hexagon': '6 sides' },
    subject: 'Physics'
  },
  {
    id: 'l1q30',
    english: {
      question: 'Match forces',
      leftItems: ['Magnetic', 'Friction', 'Gravity', 'Muscular'],
      rightItems: ['Push/pull by body', 'Attracts iron', 'Pulls down', 'Opposes motion']
    },
    tamil: {
      question: 'வலிகளை செயல்களுடன் பொருத்துக',
      leftItems: ['காந்தம்', 'இரப்பு', 'ஈர்ப்பு', 'தசை'],
      rightItems: ['உடலால் தள்ளுதல்/இழுத்தல்', 'இரும்பை ஈர்க்கிறது', 'கீழே இழுக்கிறது', 'இயக்கத்தை எதிர்க்கிறது']
    },
    correctMatches: { 'Magnetic': 'Attracts iron', 'Friction': 'Opposes motion', 'Gravity': 'Pulls down', 'Muscular': 'Push/pull by body' },
    subject: 'Physics'
  },
  {
    id: 'l1q31',
    english: {
      question: 'Match seasons with features',
      leftItems: ['Summer', 'Winter', 'Rainy', 'Spring'],
      rightItems: ['Flowers bloom', 'Hot', 'Wet', 'Cold']
    },
    tamil: {
      question: 'காலங்களை பண்புகளுடன் பொருத்துக',
      leftItems: ['கோடை', 'பனி', 'மழைக்காலம்', 'வசந்தம்'],
      rightItems: ['மலர்கள் மலர்கின்றன', 'சூடு', 'ஈரமானது', 'குளிர்']
    },
    correctMatches: { 'Summer': 'Hot', 'Winter': 'Cold', 'Rainy': 'Wet', 'Spring': 'Flowers bloom' },
    subject: 'Environmental'
  },
  {
    id: 'l1q32',
    english: {
      question: 'Match fuels',
      leftItems: ['Coal', 'Petrol', 'LPG', 'Wood'],
      rightItems: ['Campfire', 'Train engine', 'Cooking gas', 'Car']
    },
    tamil: {
      question: 'எரிபொருட்களை பயன்பாடுகளுடன் பொருத்துக',
      leftItems: ['நிலக்கரி', 'பெட்ரோல்', 'எல்பிஜி', 'மரம்'],
      rightItems: ['நெருப்பு', 'ரயில் இஞ்சின்', 'சமையல் வாயு', 'கார்']
    },
    correctMatches: { 'Coal': 'Train engine', 'Petrol': 'Car', 'LPG': 'Cooking gas', 'Wood': 'Campfire' },
    subject: 'Chemistry'
  }
  ],
  
  level2: [
  {
      id: 'l2q1',
      english: {
        question: 'Match cell parts with functions',
        leftItems: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Ribosome'],
        rightItems: ['Protein', 'Control', 'Photosynthesis', 'Energy']
      },
      tamil: {
        question: 'செல் பாகங்களை செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['கரு', 'மைட்டோகாண்ட்ரியா', 'குளோரோபிளாஸ்ட்', 'ரைபோசோம்'],
        rightItems: ['புரதம்', 'கட்டுப்பாடு', 'ஒளிச்சேர்க்கை', 'ஆற்றல்']
      },
      correctMatches: { 'Nucleus': 'Control', 'Mitochondria': 'Energy', 'Chloroplast': 'Photosynthesis', 'Ribosome': 'Protein' },
      subject: 'Biology'
    },
    {
      id: 'l2q2',
      english: {
        question: 'Match types of blood cells with functions',
        leftItems: ['Red blood cell', 'White blood cell', 'Platelet', 'Plasma'],
        rightItems: ['Clotting', 'Oxygen transport', 'Nutrient transport', 'Immunity']
      },
      tamil: {
        question: 'இரத்த அணுக்களை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['சிவப்பணு', 'வெள்ளையணு', 'இரத்த தட்டுகள்', 'பிளாஸ்மா'],
        rightItems: ['இரத்தக் கட்டி', 'ஆக்ஸிஜன் கடத்தல்', 'சத்துக் கடத்தல்', 'நோய் எதிர்ப்பு']
      },
      correctMatches: { 'Red blood cell': 'Oxygen transport', 'White blood cell': 'Immunity', 'Platelet': 'Clotting', 'Plasma': 'Nutrient transport' },
      subject: 'Biology'
    },
    {
      id: 'l2q3',
      english: {
        question: 'Match plant tissues with roles',
        leftItems: ['Xylem', 'Phloem', 'Epidermis', 'Cambium'],
        rightItems: ['Growth', 'Water transport', 'Protection', 'Food transport']
      },
      tamil: {
        question: 'தாவர திசுக்களை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['ஜைலம்', 'ப்ளோயம்', 'எபிடெர்மிஸ்', 'காம்பியம்'],
        rightItems: ['வளர்ச்சி', 'நீர்க்கடத்தல்', 'பாதுகாப்பு', 'உணவுக் கடத்தல்']
      },
      correctMatches: { 'Xylem': 'Water transport', 'Phloem': 'Food transport', 'Epidermis': 'Protection', 'Cambium': 'Growth' },
      subject: 'Biology'
    },
    {
      id: 'l2q4',
      english: {
        question: 'Match human organs with systems',
        leftItems: ['Heart', 'Lungs', 'Stomach', 'Brain'],
        rightItems: ['Nervous', 'Circulatory', 'Digestive', 'Respiratory']
      },
      tamil: {
        question: 'மனித உடல் உறுப்புகளை அதன் அமைப்புகளுடன் பொருத்துக',
        leftItems: ['இதயம்', 'நுரையீரல்', 'வயிறு', 'மூளை'],
        rightItems: ['நரம்பு', 'இரத்த ஓட்டம்', 'செரிமானம்', 'சுவாசம்']
      },
      correctMatches: { 'Heart': 'Circulatory', 'Lungs': 'Respiratory', 'Stomach': 'Digestive', 'Brain': 'Nervous' },
      subject: 'Biology'
    },
    {
      id: 'l2q5',
      english: {
        question: 'Match reproductive parts with functions',
        leftItems: ['Ovary', 'Testis', 'Uterus', 'Sperm'],
        rightItems: ['Fertilization', 'Egg production', 'Fetus growth', 'Sperm production']
      },
      tamil: {
        question: 'பெருக்க உறுப்புகளை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['கருப்பை', 'விரை', 'கருப்பை பைகள்', 'விந்து'],
        rightItems: ['உரச்சேர்க்கை', 'முட்டை உற்பத்தி', 'கரு வளர்ச்சி', 'விந்து உற்பத்தி']
      },
      correctMatches: { 'Ovary': 'Egg production', 'Testis': 'Sperm production', 'Uterus': 'Fetus growth', 'Sperm': 'Fertilization' },
      subject: 'Biology'
    },
    {
      id: 'l2q6',
      english: {
        question: 'Match enzymes with substrates',
        leftItems: ['Amylase', 'Lipase', 'Protease', 'Lactase'],
        rightItems: ['Lactose', 'Starch', 'Protein', 'Fat']
      },
      tamil: {
        question: 'என்சைம்களை அதன் பொருளுடன் பொருத்துக',
        leftItems: ['அமிலேஸ்', 'லைபேஸ்', 'புரோடீஸ்', 'லக்டேஸ்'],
        rightItems: ['லக்டோஸ்', 'மாவு', 'புரதம்', 'கொழுப்பு']
      },
      correctMatches: { 'Amylase': 'Starch', 'Lipase': 'Fat', 'Protease': 'Protein', 'Lactase': 'Lactose' },
      subject: 'Biology'
    },
    {
      id: 'l2q7',
      english: {
        question: 'Match bones with body parts',
        leftItems: ['Femur', 'Humerus', 'Skull', 'Ribs'],
        rightItems: ['Chest', 'Thigh', 'Head', 'Arm']
      },
      tamil: {
        question: 'எலும்புகளை அதன் உடல் பகுதிகளுடன் பொருத்துக',
        leftItems: ['தோளெலும்பு', 'மேல்கை எலும்பு', 'தலைக்கூடு', 'விலா எலும்பு'],
        rightItems: ['மார்பு', 'தோள்', 'தலை', 'கை']
      },
      correctMatches: { 'Femur': 'Thigh', 'Humerus': 'Arm', 'Skull': 'Head', 'Ribs': 'Chest' },
      subject: 'Biology'
    },
    {
      id: 'l2q8',
      english: {
        question: 'Match hormones with functions',
        leftItems: ['Insulin', 'Adrenaline', 'Thyroxine', 'Growth hormone'],
        rightItems: ['Growth', 'Blood sugar control', 'Metabolism', 'Fight or flight']
      },
      tamil: {
        question: 'ஹார்மோன்களை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['இன்சுலின்', 'அட்ரினலின்', 'தைராக்ஸின்', 'வளர்ச்சி ஹார்மோன்'],
        rightItems: ['வளர்ச்சி', 'சர்க்கரை கட்டுப்பாடு', 'மாற்றச்செயல்', 'அவசரத் தாக்கம்']
      },
      correctMatches: { 'Insulin': 'Blood sugar control', 'Adrenaline': 'Fight or flight', 'Thyroxine': 'Metabolism', 'Growth hormone': 'Growth' },
      subject: 'Biology'
    },
    {
      id: 'l2q9',
      english: {
        question: 'Match digestive enzymes with sites',
        leftItems: ['Salivary glands', 'Stomach', 'Pancreas', 'Small intestine'],
        rightItems: ['Maltase', 'Amylase', 'Trypsin', 'Pepsin']
      },
      tamil: {
        question: 'செரிமான என்சைம்களை அதன் இடங்களுடன் பொருத்துக',
        leftItems: ['உமிழ்நீர்க் சுரப்பி', 'வயிறு', 'அகப்படை', 'சிறுகுடல்'],
        rightItems: ['மால்டேஸ்', 'அமிலேஸ்', 'ட்ரிப்சின்', 'பெப்சின்']
      },
      correctMatches: { 'Salivary glands': 'Amylase', 'Stomach': 'Pepsin', 'Pancreas': 'Trypsin', 'Small intestine': 'Maltase' },
      subject: 'Biology'
    },
    {
      id: 'l2q10',
      english: {
        question: 'Match sense organs with functions',
        leftItems: ['Eye', 'Ear', 'Nose', 'Skin'],
        rightItems: ['Touch', 'Sight', 'Smell', 'Hearing']
      },
      tamil: {
        question: 'உணர்வுக் கோள்களை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['கண்', 'காது', 'மூக்கு', 'தோல்'],
        rightItems: ['தொட்டு உணர்வு', 'பார்வை', 'மணம்', 'கேள்வி']
      },
      correctMatches: { 'Eye': 'Sight', 'Ear': 'Hearing', 'Nose': 'Smell', 'Skin': 'Touch' },
      subject: 'Biology'
    },
    {
      id: 'l2q11',
      english: {
        question: 'Match types of muscles with location',
        leftItems: ['Skeletal muscle', 'Smooth muscle', 'Cardiac muscle', 'Diaphragm'],
        rightItems: ['Breathing', 'Bones', 'Heart', 'Organs']
      },
      tamil: {
        question: 'தசைகளை அதன் இடத்துடன் பொருத்துக',
        leftItems: ['எலும்புத் தசை', 'மென்மையான தசை', 'இதய தசை', 'மூச்சுத்திறன் தசை'],
        rightItems: ['சுவாசம்', 'எலும்புகள்', 'இதயம்', 'உறுப்புகள்']
      },
      correctMatches: { 'Skeletal muscle': 'Bones', 'Smooth muscle': 'Organs', 'Cardiac muscle': 'Heart', 'Diaphragm': 'Breathing' },
      subject: 'Biology'
    },
    {
      id: 'l2q12',
      english: {
        question: 'Match microorganisms with disease',
        leftItems: ['Virus', 'Bacteria', 'Fungus', 'Protozoa'],
        rightItems: ['Malaria', 'Flu', 'Ringworm', 'Tuberculosis']
      },
      tamil: {
        question: 'நுண்ணுயிரிகளை அதன் நோய்களுடன் பொருத்துக',
        leftItems: ['வைரஸ்', 'பாக்டீரியா', 'பூஞ்சை', 'புரோட்டோசோவா'],
        rightItems: ['மலேரியா', 'காய்ச்சல்', 'ரிங்க்வார்ம்', 'காசநோய்']
      },
      correctMatches: { 'Virus': 'Flu', 'Bacteria': 'Tuberculosis', 'Fungus': 'Ringworm', 'Protozoa': 'Malaria' },
      subject: 'Biology'
    },
    {
      id: 'l2q13',
      english: {
        question: 'Match parts of brain with functions',
        leftItems: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'],
        rightItems: ['Temperature control', 'Thinking', 'Involuntary control', 'Balance']
      },
      tamil: {
        question: 'மூளையின் பகுதிகளை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['செரிப்ரம்', 'செரிபெல்லம்', 'மெடுல்லா', 'ஹைப்போத்தாலாமஸ்'],
        rightItems: ['வெப்பநிலை கட்டுப்பாடு', 'சிந்தனை', 'தன்னியக்க கட்டுப்பாடு', 'இடைநிலை']
      },
      correctMatches: { 'Cerebrum': 'Thinking', 'Cerebellum': 'Balance', 'Medulla': 'Involuntary control', 'Hypothalamus': 'Temperature control' },
      subject: 'Biology'
    },
    {
      id: 'l2q14',
      english: {
        question: 'Match DNA bases with pairs',
        leftItems: ['Adenine', 'Thymine', 'Cytosine', 'Guanine'],
        rightItems: ['Cytosine', 'Thymine', 'Guanine', 'Adenine']
      },
      tamil: {
        question: 'DNA அடிப்படைகளை அதன் இணைப்புகளுடன் பொருத்துக',
        leftItems: ['அடினின்', 'தைமைன்', 'சைட்டோசின்', 'குவானின்'],
        rightItems: ['சைட்டோசின்', 'தைமைன்', 'குவானின்', 'அடினின்']
      },
      correctMatches: { 'Adenine': 'Thymine', 'Thymine': 'Adenine', 'Cytosine': 'Guanine', 'Guanine': 'Cytosine' },
      subject: 'Biology'
    },
    {
      id: 'l2q15',
      english: {
        question: 'Match plant parts with uses',
        leftItems: ['Root', 'Leaf', 'Stem', 'Flower'],
        rightItems: ['Reproduction', 'Anchorage', 'Support', 'Photosynthesis']
      },
      tamil: {
        question: 'தாவர பாகங்களை அதன் பயன்பாடுகளுடன் பொருத்துக',
        leftItems: ['வேர்', 'இலை', 'தண்டு', 'மலர்'],
        rightItems: ['பெருக்கம்', 'பிடித்தல்', 'ஆதரவு', 'ஒளிச்சேர்க்கை']
      },
      correctMatches: { 'Root': 'Anchorage', 'Leaf': 'Photosynthesis', 'Stem': 'Support', 'Flower': 'Reproduction' },
      subject: 'Biology'
    },
    {
      id: 'l2q16',
      english: {
        question: 'Match diseases with organs affected',
        leftItems: ['Hepatitis', 'Asthma', 'Arthritis', 'Cataract'],
        rightItems: ['Eye', 'Liver', 'Joints', 'Lungs']
      },
      tamil: {
        question: 'நோய்களை அதன் பாதிக்கப்பட்ட உறுப்புகளுடன் பொருத்துக',
        leftItems: ['கல்லீரல் அழற்சி', 'ஆஸ்துமா', 'கீல்வாதம்', 'கட்டாராக்ட்'],
        rightItems: ['கண்', 'கல்லீரல்', 'கீல்', 'நுரையீரல்']
      },
      correctMatches: { 'Hepatitis': 'Liver', 'Asthma': 'Lungs', 'Arthritis': 'Joints', 'Cataract': 'Eye' },
      subject: 'Biology'
    },
    {
      id: 'l2q17',
      english: {
        question: 'Match excretory organs with functions',
        leftItems: ['Kidney', 'Lungs', 'Skin', 'Liver'],
        rightItems: ['Bile', 'Urine', 'Sweat', 'Carbon dioxide']
      },
      tamil: {
        question: 'விலக்க உறுப்புகளை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['சிறுநீரகம்', 'நுரையீரல்', 'தோல்', 'கல்லீரல்'],
        rightItems: ['பித்தம்', 'சிறுநீர்', 'வியர்வை', 'கார்பன் டைஆக்சைடு']
      },
      correctMatches: { 'Kidney': 'Urine', 'Lungs': 'Carbon dioxide', 'Skin': 'Sweat', 'Liver': 'Bile' },
      subject: 'Biology'
    },
    {
      id: 'l2q18',
      english: {
        question: 'Match ecological terms with meaning',
        leftItems: ['Herbivore', 'Carnivore', 'Omnivore', 'Decomposer'],
        rightItems: ['Decay matter', 'Plant eater', 'Both eater', 'Meat eater']
      },
      tamil: {
        question: 'சூழல் தொடர்பான சொற்களை அதன் பொருளுடன் பொருத்துக',
        leftItems: ['முல்லுண்ணி', 'மாமிசுண்ணி', 'இருவித உணவுண்ணி', 'சிதைவூட்டி'],
        rightItems: ['சிதைவு செய்பவர்', 'தாவர உணவுண்ணி', 'இரண்டையும் உணவுண்ணி', 'மாமிச உணவுண்ணி']
      },
      correctMatches: { 'Herbivore': 'Plant eater', 'Carnivore': 'Meat eater', 'Omnivore': 'Both eater', 'Decomposer': 'Decay matter' },
      subject: 'Biology'
    },
    {
      id: 'l2q19',
      english: {
        question: 'Match modes of reproduction',
        leftItems: ['Binary fission', 'Budding', 'Spore formation', 'Vegetative propagation'],
        rightItems: ['Plants', 'Amoeba', 'Fungi', 'Yeast']
      },
      tamil: {
        question: 'பெருக்க முறைகளை அதன் உயிரிகளுடன் பொருத்துக',
        leftItems: ['இரட்டை பிளவு', 'மொட்டுதல்', 'முளை உருவாக்கம்', 'தாவர பெருக்கம்'],
        rightItems: ['தாவரங்கள்', 'ஆமீபா', 'பூஞ்சை', 'ஈஸ்ட்']
      },
      correctMatches: { 'Binary fission': 'Amoeba', 'Budding': 'Yeast', 'Spore formation': 'Fungi', 'Vegetative propagation': 'Plants' },
      subject: 'Biology'
    },
    {
      id: 'l2q20',
      english: {
        question: 'Match vitamins with deficiency disease',
        leftItems: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'],
        rightItems: ['Bleeding', 'Night blindness', 'Rickets', 'Scurvy']
      },
      tamil: {
        question: 'விட்டமின்களை அதன் குறைபாடுகளுடன் பொருத்துக',
        leftItems: ['விட்டமின் A', 'விட்டமின் C', 'விட்டமின் D', 'விட்டமின் K'],
        rightItems: ['இரத்தக் கசிவு', 'இரவு குருட்டுத்தனம்', 'ரிக்கெட்ஸ்', 'ஸ்கர்வி']
      },
      correctMatches: { 'Vitamin A': 'Night blindness', 'Vitamin C': 'Scurvy', 'Vitamin D': 'Rickets', 'Vitamin K': 'Bleeding' },
      subject: 'Biology'
    },
    {
      id: 'l2q21',
      english: {
        question: 'Match respiratory parts with functions',
        leftItems: ['Nose', 'Trachea', 'Alveoli', 'Diaphragm'],
        rightItems: ['Breathing movement', 'Air intake', 'Gas exchange', 'Air passage']
      },
      tamil: {
        question: 'சுவாச உறுப்புகளை அதன் செயல்பாடுகளுடன் பொருத்துக',
        leftItems: ['மூக்கு', 'காற்றுக்குழாய்', 'ஆல்வியோலை', 'மூச்சுத்திறன் தசை'],
        rightItems: ['மூச்சு இயக்கம்', 'காற்று நுழைவு', 'வாயு பரிமாற்றம்', 'காற்று வழி']
      },
      correctMatches: { 'Nose': 'Air intake', 'Trachea': 'Air passage', 'Alveoli': 'Gas exchange', 'Diaphragm': 'Breathing movement' },
      subject: 'Biology'
    }
],
  
 level3: [
  {
    id: 'l3q1',
    english: {
      question: 'Match biomolecules with roles',
      leftItems: ['Proteins', 'Carbs', 'Lipids', 'DNA'],
      rightItems: ['Genes', 'Structure', 'Storage', 'Energy']
    },
    tamil: {
      question: 'உயிர் மூலக்கூறுகளை பங்குகளுடன் பொருத்துக',
      leftItems: ['புரதங்கள்', 'கார்போ', 'கொழுப்புகள்', 'டிஎன்ஏ'],
      rightItems: ['மரபணுக்கள்', 'அமைப்பு', 'சேமிப்பு', 'ஆற்றல்']
    },
    correctMatches: { 'Proteins': 'Structure', 'Carbs': 'Energy', 'Lipids': 'Storage', 'DNA': 'Genes' },
    subject: 'Biology'
  },
  {
    id: 'l3q2',
    english: {
      question: 'Match cell cycle phases with events',
      leftItems: ['G1 phase', 'S phase', 'G2 phase', 'M phase'],
      rightItems: ['DNA replication', 'Mitosis', 'Growth', 'Preparation']
    },
    tamil: {
      question: 'செல் சுழற்சி நிலைகளை அதன் நிகழ்வுகளுடன் பொருத்துக',
      leftItems: ['G1 கட்டம்', 'S கட்டம்', 'G2 கட்டம்', 'M கட்டம்'],
      rightItems: ['டிஎன்ஏ நகலெடுத்தல்', 'மைட்டோசிஸ்', 'வளர்ச்சி', 'தயாரிப்பு']
    },
    correctMatches: { 'G1 phase': 'Growth', 'S phase': 'DNA replication', 'G2 phase': 'Preparation', 'M phase': 'Mitosis' },
    subject: 'Biology'
  },
  {
    id: 'l3q3',
    english: {
      question: 'Match organelles with extra functions',
      leftItems: ['Golgi body', 'Lysosome', 'Endoplasmic reticulum', 'Centrosome'],
      rightItems: ['Cell division', 'Packaging', 'Transport', 'Digestion']
    },
    tamil: {
      question: 'ஆங்கங்களை கூடுதல் செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['கோல்கி உடல்', 'லைசோசோம்', 'எண்டோபிளாஸ்மிக் ரெட்டிகுலம்', 'சென்ட்ரோசோம்'],
      rightItems: ['செல் பிரிவு', 'பேக்கேஜிங்', 'கடத்தல்', 'செரிமானம்']
    },
    correctMatches: { 'Golgi body': 'Packaging', 'Lysosome': 'Digestion', 'Endoplasmic reticulum': 'Transport', 'Centrosome': 'Cell division' },
    subject: 'Biology'
  },
  {
    id: 'l3q4',
    english: {
      question: 'Match genetic terms with meaning',
      leftItems: ['Allele', 'Genotype', 'Phenotype', 'Mutation'],
      rightItems: ['Observable trait', 'Change in DNA', 'Variant', 'Gene makeup']
    },
    tamil: {
      question: 'மரபியல் சொற்களை அதன் பொருளுடன் பொருத்துக',
      leftItems: ['அலீல்', 'ஜினோடைப்', 'பினோடைப்', 'ம்யூட்டேஷன்'],
      rightItems: ['காணக்கூடிய பண்பு', 'டிஎன்ஏ மாற்றம்', 'வகை', 'மரபணு அமைப்பு']
    },
    correctMatches: { 'Allele': 'Variant', 'Genotype': 'Gene makeup', 'Phenotype': 'Observable trait', 'Mutation': 'Change in DNA' },
    subject: 'Biology'
  },
  {
    id: 'l3q5',
    english: {
      question: 'Match photosynthesis stages with products',
      leftItems: ['Light reaction', 'Dark reaction', 'Chlorophyll', 'ATP'],
      rightItems: ['Energy currency', 'Oxygen', 'Pigment', 'Glucose']
    },
    tamil: {
      question: 'ஒளிச்சேர்க்கை கட்டங்களை அதன் விளைவுகளுடன் பொருத்துக',
      leftItems: ['ஒளி செயல்', 'இருள் செயல்', 'குளோரோபில்', 'ATP'],
      rightItems: ['ஆற்றல் நாணயம்', 'ஆக்ஸிஜன்', 'நிறமிப்பான்', 'குளுக்கோஸ்']
    },
    correctMatches: { 'Light reaction': 'Oxygen', 'Dark reaction': 'Glucose', 'Chlorophyll': 'Pigment', 'ATP': 'Energy currency' },
    subject: 'Biology'
  },
  {
    id: 'l3q6',
    english: {
      question: 'Match respiration types with features',
      leftItems: ['Aerobic', 'Anaerobic', 'Glycolysis', 'Krebs cycle'],
      rightItems: ['Mitochondria', 'Oxygen use', 'Cytoplasm', 'No oxygen']
    },
    tamil: {
      question: 'சுவாச வகைகளை அதன் அம்சங்களுடன் பொருத்துக',
      leftItems: ['ஆக்சிஜன் சுவாசம்', 'ஆக்சிஜன் அற்ற சுவாசம்', 'கிளைகோலிசிஸ்', 'கிரெப்ஸ் சுழற்சி'],
      rightItems: ['மைட்டோகாண்ட்ரியா', 'ஆக்ஸிஜன் பயன்பாடு', 'சைடோபிளாஸ்மம்', 'ஆக்ஸிஜன் இல்லாது']
    },
    correctMatches: { 'Aerobic': 'Oxygen use', 'Anaerobic': 'No oxygen', 'Glycolysis': 'Cytoplasm', 'Krebs cycle': 'Mitochondria' },
    subject: 'Biology'
  },
  {
    id: 'l3q7',
    english: {
      question: 'Match plant hormones with effects',
      leftItems: ['Auxin', 'Cytokinin', 'Gibberellin', 'Abscisic acid'],
      rightItems: ['Dormancy', 'Growth', 'Stem elongation', 'Cell division']
    },
    tamil: {
      question: 'தாவர ஹார்மோன்களை அதன் விளைவுகளுடன் பொருத்துக',
      leftItems: ['ஆக்ஸின்', 'சைடோகைனின்', 'கிபெரலின்', 'அப்சிசிக் அமிலம்'],
      rightItems: ['தூக்கநிலை', 'வளர்ச்சி', 'தண்டு நீட்டிப்பு', 'செல் பிரிவு']
    },
    correctMatches: { 'Auxin': 'Growth', 'Cytokinin': 'Cell division', 'Gibberellin': 'Stem elongation', 'Abscisic acid': 'Dormancy' },
    subject: 'Biology'
  },
  {
    id: 'l3q8',
    english: {
      question: 'Match ecology levels with examples',
      leftItems: ['Population', 'Community', 'Ecosystem', 'Biosphere'],
      rightItems: ['Earth life', 'Species group', 'Biotic + abiotic', 'All species']
    },
    tamil: {
      question: 'சூழியல் நிலைகளை அதன் உதாரணங்களுடன் பொருத்துக',
      leftItems: ['மக்கள் தொகை', 'சமூகம்', 'சூழல் அமைப்பு', 'உயிர்க்கோளம்'],
      rightItems: ['பூமி உயிர்கள்', 'ஒரே இனக் குழு', 'உயிரியல் + உயிரற்றது', 'அனைத்து இனங்கள்']
    },
    correctMatches: { 'Population': 'Species group', 'Community': 'All species', 'Ecosystem': 'Biotic + abiotic', 'Biosphere': 'Earth life' },
    subject: 'Biology'
  },
  {
    id: 'l3q9',
    english: {
      question: 'Match immune cells with roles',
      leftItems: ['B cells', 'T cells', 'Macrophages', 'Antibodies'],
      rightItems: ['Neutralize antigens', 'Produce antibodies', 'Engulf microbes', 'Attack cells']
    },
    tamil: {
      question: 'நோய் எதிர்ப்பு அணுக்களை அதன் செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['B செல்கள்', 'T செல்கள்', 'மாக்ரோஃபேஜ்கள்', 'எதிர் அணுக்கள்'],
      rightItems: ['ஆண்டிஜன்களை செயலிழக்கச் செய்தல்', 'எதிர் அணுக்கள் உற்பத்தி', 'நுண்ணுயிர்களை விழுங்குதல்', 'செல்களை தாக்குதல்']
    },
    correctMatches: { 'B cells': 'Produce antibodies', 'T cells': 'Attack cells', 'Macrophages': 'Engulf microbes', 'Antibodies': 'Neutralize antigens' },
    subject: 'Biology'
  },
  {
    id: 'l3q10',
    english: {
      question: 'Match genetic processes with enzymes',
      leftItems: ['Replication', 'Transcription', 'Translation', 'DNA repair'],
      rightItems: ['Ligase', 'DNA polymerase', 'Ribosome', 'RNA polymerase']
    },
    tamil: {
      question: 'மரபணு செயல்முறைகளை அதன் என்சைம்களுடன் பொருத்துக',
      leftItems: ['நகலெடுத்தல்', 'மறைநகல்', 'மொழிபெயர்ப்பு', 'டிஎன்ஏ பழுது நீக்கம்'],
      rightItems: ['லைகேஸ்', 'டிஎன்ஏ பாலிமரேஸ்', 'ரைபோசோம்', 'ஆர்என்ஏ பாலிமரேஸ்']
    },
    correctMatches: { 'Replication': 'DNA polymerase', 'Transcription': 'RNA polymerase', 'Translation': 'Ribosome', 'DNA repair': 'Ligase' },
    subject: 'Biology'
  },
  {
    id: 'l3q11',
    english: {
      question: 'Match evolutionary concepts',
      leftItems: ['Natural selection', 'Adaptation', 'Speciation', 'Fossils'],
      rightItems: ['Evidence', 'Survival', 'New species', 'Trait change']
    },
    tamil: {
      question: 'உயிரியல் பரிணாமக் கருத்துகளை பொருத்துக',
      leftItems: ['இயற்கைத் தேர்வு', 'செயல்பாடுசார்பு', 'இனப்பிரிவு', 'படிமங்கள்'],
      rightItems: ['ஆதாரம்', 'வாழ்தல்', 'புதிய இனம்', 'பண்பு மாற்றம்']
    },
    correctMatches: { 'Natural selection': 'Survival', 'Adaptation': 'Trait change', 'Speciation': 'New species', 'Fossils': 'Evidence' },
    subject: 'Biology'
  },
  {
    id: 'l3q12',
    english: {
      question: 'Match blood groups with antigens',
      leftItems: ['A group', 'B group', 'AB group', 'O group'],
      rightItems: ['No antigen', 'A antigen', 'A+B antigens', 'B antigen']
    },
    tamil: {
      question: 'இரத்தக் குழுக்களை அதன் ஆன்டிஜன்களுடன் பொருத்துக',
      leftItems: ['A குழு', 'B குழு', 'AB குழு', 'O குழு'],
      rightItems: ['ஆன்டிஜன் இல்லை', 'A ஆன்டிஜன்', 'A+B ஆன்டிஜன்கள்', 'B ஆன்டிஜன்']
    },
    correctMatches: { 'A group': 'A antigen', 'B group': 'B antigen', 'AB group': 'A+B antigens', 'O group': 'No antigen' },
    subject: 'Biology'
  },
  {
    id: 'l3q13',
    english: {
      question: 'Match nervous system parts with functions',
      leftItems: ['Sensory neuron', 'Motor neuron', 'Synapse', 'Spinal cord'],
      rightItems: ['Reflex', 'Signal sensing', 'Message transfer', 'Signal response']
    },
    tamil: {
      question: 'நரம்பு அமைப்பின் பகுதிகளை அதன் செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['உணர்வு நரம்பு', 'இயக்க நரம்பு', 'சைனாப்ஸ்', 'மூளைக்கயிறு'],
      rightItems: ['பிரதி செயல்', 'சிக்னல் உணர்வு', 'செய்தி பரிமாற்றம்', 'சிக்னல் பதில்']
    },
    correctMatches: { 'Sensory neuron': 'Signal sensing', 'Motor neuron': 'Signal response', 'Synapse': 'Message transfer', 'Spinal cord': 'Reflex' },
    subject: 'Biology'
  },
  {
    id: 'l3q14',
    english: {
      question: 'Match human glands with secretions',
      leftItems: ['Pancreas', 'Thyroid', 'Adrenal', 'Pituitary'],
      rightItems: ['Master hormones', 'Insulin', 'Adrenaline', 'Thyroxine']
    },
    tamil: {
      question: 'மனித சுரப்பிகளை அதன் சுரப்புகளுடன் பொருத்துக',
      leftItems: ['அகப்படை', 'தைராய்டு', 'அட்ரினல்', 'பிட்யூட்டரி'],
      rightItems: ['முக்கிய ஹார்மோன்கள்', 'இன்சுலின்', 'அட்ரினலின்', 'தைராக்ஸின்']
    },
    correctMatches: { 'Pancreas': 'Insulin', 'Thyroid': 'Thyroxine', 'Adrenal': 'Adrenaline', 'Pituitary': 'Master hormones' },
    subject: 'Biology'
  },
  {
    id: 'l3q15',
    english: {
      question: 'Match DNA technologies with uses',
      leftItems: ['PCR', 'Gel electrophoresis', 'DNA sequencing', 'Cloning'],
      rightItems: ['Copy organism', 'Amplification', 'Order of bases', 'Separation']
    },
    tamil: {
      question: 'டிஎன்ஏ தொழில்நுட்பங்களை அதன் பயன்பாடுகளுடன் பொருத்துக',
      leftItems: ['PCR', 'ஜெல் எலக்ட்ரோஃபோரசிஸ்', 'டிஎன்ஏ வரிசை', 'குளோனிங்'],
      rightItems: ['நகல் உயிரி உருவாக்கம்', 'பலப்படுத்தல்', 'அடிப்படைகளின் வரிசை', 'பிரித்தல்']
    },
    correctMatches: { 'PCR': 'Amplification', 'Gel electrophoresis': 'Separation', 'DNA sequencing': 'Order of bases', 'Cloning': 'Copy organism' },
    subject: 'Biology'
  },
  {
    id: 'l3q16',
    english: {
      question: 'Match biotechnology products with source',
      leftItems: ['Insulin', 'Antibiotics', 'Vaccines', 'Enzymes'],
      rightItems: ['Industrial use', 'Recombinant DNA', 'Weakened pathogen', 'Bacteria']
    },
    tamil: {
      question: 'உயிர்தொழில்நுட்பப் பொருட்களை அதன் மூலத்துடன் பொருத்துக',
      leftItems: ['இன்சுலின்', 'ஆண்டிபயாட்டிக்', 'தடுப்பூசிகள்', 'என்சைம்கள்'],
      rightItems: ['தொழில்துறை பயன்பாடு', 'மறுவினை டிஎன்ஏ', 'பலவீனமான நோய்க்கிருமி', 'பாக்டீரியா']
    },
    correctMatches: { 'Insulin': 'Recombinant DNA', 'Antibiotics': 'Bacteria', 'Vaccines': 'Weakened pathogen', 'Enzymes': 'Industrial use' },
    subject: 'Biology'
  },
  {
    id: 'l3q17',
    english: {
      question: 'Match ecological cycles with element',
      leftItems: ['Carbon cycle', 'Nitrogen cycle', 'Water cycle', 'Oxygen cycle'],
      rightItems: ['O2', 'CO2', 'H2O', 'N2']
    },
    tamil: {
      question: 'சூழல் சுழற்சிகளை அதன் மூலக்கூறுகளுடன் பொருத்துக',
      leftItems: ['கார்பன் சுழற்சி', 'நைட்ரஜன் சுழற்சி', 'நீர் சுழற்சி', 'ஆக்சிஜன் சுழற்சி'],
      rightItems: ['O2', 'CO2', 'H2O', 'N2']
    },
    correctMatches: { 'Carbon cycle': 'CO2', 'Nitrogen cycle': 'N2', 'Water cycle': 'H2O', 'Oxygen cycle': 'O2' },
    subject: 'Biology'
  },
  {
    id: 'l3q18',
    english: {
      question: 'Match reproductive strategies',
      leftItems: ['Ovoviviparous', 'Viviparous', 'Oviparous', 'Parthenogenesis'],
      rightItems: ['Without fertilization', 'Eggs inside mother', 'Egg laying', 'Live birth']
    },
    tamil: {
      question: 'பெருக்க உத்திகளை பொருத்துக',
      leftItems: ['ஓவோவிவிபரோஸ்', 'விவிபரோஸ்', 'ஓவிபரோஸ்', 'பார்தினோஜெனெசிஸ்'],
      rightItems: ['உரச்சேர்க்கை இல்லாமல்', 'தாயில் முட்டை', 'முட்டை இடுதல்', 'நேரடி பிறப்பு']
    },
    correctMatches: { 'Ovoviviparous': 'Eggs inside mother', 'Viviparous': 'Live birth', 'Oviparous': 'Egg laying', 'Parthenogenesis': 'Without fertilization' },
    subject: 'Biology'
  },
  {
    id: 'l3q19',
    english: {
      question: 'Match human systems with main function',
      leftItems: ['Circulatory', 'Digestive', 'Excretory', 'Respiratory'],
      rightItems: ['Gas exchange', 'Transport', 'Waste removal', 'Food breakdown']
    },
    tamil: {
      question: 'மனித அமைப்புகளை அதன் முக்கிய செயல்பாடுகளுடன் பொருத்துக',
      leftItems: ['இரத்த ஓட்ட அமைப்பு', 'செரிமான அமைப்பு', 'வெளியேற்ற அமைப்பு', 'சுவாச அமைப்பு'],
      rightItems: ['வாயு பரிமாற்றம்', 'கடத்தல்', 'கழிவு நீக்கம்', 'உணவு சிதைவு']
    },
    correctMatches: { 'Circulatory': 'Transport', 'Digestive': 'Food breakdown', 'Excretory': 'Waste removal', 'Respiratory': 'Gas exchange' },
    subject: 'Biology'
  },
  {
    id: 'l3q20',
    english: {
      question: 'Match molecular biology central dogma',
      leftItems: ['DNA', 'RNA', 'Protein', 'Gene expression'],
      rightItems: ['Flow of info', 'Blueprint', 'Functional unit', 'Messenger']
    },
    tamil: {
      question: 'அணுஉயிரியல் மையக் கோட்பாட்டை பொருத்துக',
      leftItems: ['டிஎன்ஏ', 'ஆர்என்ஏ', 'புரதம்', 'ஜீன் வெளிப்பாடு'],
      rightItems: ['தகவல் ஓட்டம்', 'திட்டம்', 'செயல்பாட்டு அலகு', 'தூதுவர்']
    },
    correctMatches: { 'DNA': 'Blueprint', 'RNA': 'Messenger', 'Protein': 'Functional unit', 'Gene expression': 'Flow of info' },
    subject: 'Biology'
  },
  {
    id: 'l3q21',
    english: {
      question: 'Match cell transport types',
      leftItems: ['Osmosis', 'Diffusion', 'Active transport', 'Endocytosis'],
      rightItems: ['Engulfing', 'Water movement', 'Energy use', 'Molecule spread']
    },
    tamil: {
      question: 'செல் கடத்தல் வகைகளை பொருத்துக',
      leftItems: ['ஒஸ்மோசிஸ்', 'டிஃப்யூஷன்', 'செயல்பாட்டுக் கடத்தல்', 'என்டோசைட்டோசிஸ்'],
      rightItems: ['விழுங்குதல்', 'நீரின் இயக்கம்', 'ஆற்றல் பயன்பாடு', 'அணு பரவல்']
    },
    correctMatches: { 'Osmosis': 'Water movement', 'Diffusion': 'Molecule spread', 'Active transport': 'Energy use', 'Endocytosis': 'Engulfing' },
    subject: 'Biology'
  }
]

    // Add more level 3 questions as needed
  
};

const quotes = [
  { english: "Great!", tamil: "அருமை!" },
  { english: "Excellent!", tamil: "சிறந்தது!" },
  { english: "Amazing!", tamil: "அற்புதம்!" },
  { english: "Fantastic!", tamil: "அருமை!" },
  { english: "Genius!", tamil: "மேதை!" },
  { english: "Outstanding!", tamil: "சிறப்பு!" }
];

const levelInfo = {
  level1: { english: "6-8", tamil: "6-8", color: "level1", icon: "📚" },
  level2: { english: "9-10", tamil: "9-10", color: "level2", icon: "🌍" },
  level3: { english: "11-12", tamil: "11-12", color: "level3", icon: "🏆" }
};

// Fast Confetti Component

const Confetti = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 1 + 's',
            backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#feca57'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}
    </div>
  );
};

const ScienceQuiz = () => {
  // FIXED: Move useUser hook inside the component
  const { user, addScore } = useUser();
  
  const [gameState, setGameState] = useState('menu');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language, setLanguage] = useState('english');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [matches, setMatches] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [gameStartTime, setGameStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const initializeQuestions = (level) => {
    const levelQuestions = questionSets[level];
    if (!levelQuestions || levelQuestions.length === 0) return [];
    
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  };

  const startGame = (level) => {
    const gameQuestions = initializeQuestions(level);
    setQuestions(gameQuestions);
    setSelectedLevel(level);
    setCurrentQuestionIndex(0);
    setScore(0);
    setMatches({});
    setSelectedLeft(null);
    setTimeLeft(15);
    setGameState('playing');
    setShowResults(false);
    setFeedback({});
    setGameStartTime(Date.now());
    setTotalTimeTaken(0);
  };

  // FIXED: Proper score saving function
 const saveGameScore = () => {
    if (!user || !questions.length) return;

    const endTime = Date.now();
    const timeTakenSeconds = Math.round((endTime - gameStartTime) / 1000);
    const maxPossibleScore = questions.length * 4; // 4 matches per question
    
    // Use the addScore method from UserContext (not saveScore)
    addScore(
      'scienceQuiz',           // gameType - FIXED: changed from 'mathQuiz' to 'scienceQuiz'
      score,                   // current score
      maxPossibleScore,        // max possible score
      timeTakenSeconds,        // time taken in seconds
      selectedLevel || 'level1' // difficulty level
    );
  };

  const handleTimeUp = () => {
    checkAnswer();
  };

  const handleLeftItemClick = (item) => {
    if (showResults) return;
    setSelectedLeft(selectedLeft === item ? null : item);
  };

  const handleRightItemClick = (item) => {
    if (showResults || !selectedLeft) return;
    
    setMatches(prev => ({ ...prev, [selectedLeft]: item }));
    setSelectedLeft(null);
  };

  const removeMatch = (leftItem) => {
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[leftItem];
      return newMatches;
    });
  };

  // FIXED: Create a mapping function to handle both languages correctly
  const createLanguageMapping = (currentQuestion, targetLanguage) => {
    const englishData = currentQuestion.english;
    const targetData = currentQuestion[targetLanguage];
    const mapping = {};
    
    // Create mapping from target language items to English items
    englishData.leftItems.forEach((englishItem, index) => {
      const targetItem = targetData.leftItems[index];
      mapping[targetItem] = englishItem;
    });
    
    return mapping;
  };

  // FIXED: The main issue was here - checkAnswer function now works properly with both languages
  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctMatches = currentQuestion.correctMatches; // This is always in English
    const currentMatches = matches; // This is in current language
    
    let newFeedback = {};
    let correctCount = 0;

    // Get the current language data
    const questionData = currentQuestion[language];
    const leftItems = questionData.leftItems;
    const rightItems = questionData.rightItems;

    // FIXED: Create mappings to handle language differences
    let leftMapping = {}; // Maps current language left items to English
    let rightMapping = {}; // Maps current language right items to English
    
    if (language === 'tamil') {
      // Create mapping from Tamil to English for both sides
      const englishData = currentQuestion.english;
      
      englishData.leftItems.forEach((englishItem, index) => {
        leftMapping[leftItems[index]] = englishItem;
      });
      
      englishData.rightItems.forEach((englishItem, index) => {
        rightMapping[rightItems[index]] = englishItem;
      });
    } else {
      // For English, direct mapping
      leftItems.forEach(item => leftMapping[item] = item);
      rightItems.forEach(item => rightMapping[item] = item);
    }

    // Check each left item for correct matches
    leftItems.forEach(leftItem => {
      const englishLeftItem = leftMapping[leftItem];
      const expectedEnglishRight = correctMatches[englishLeftItem];
      
      if (currentMatches[leftItem]) {
        const englishRightItem = rightMapping[currentMatches[leftItem]];
        
        if (englishRightItem === expectedEnglishRight) {
          newFeedback[leftItem] = 'correct';
          correctCount++;
        } else {
          newFeedback[leftItem] = 'incorrect';
        }
      } else {
        newFeedback[leftItem] = 'incorrect';
      }
    });

    console.log('Current Language:', language);
    console.log('Left Items:', leftItems);
    console.log('Current Matches:', currentMatches);
    console.log('Left Mapping:', leftMapping);
    console.log('Right Mapping:', rightMapping);
    console.log('Expected Matches (English):', correctMatches);
    console.log('Feedback:', newFeedback);

    setFeedback(newFeedback);
    setShowResults(true);

    if (correctCount > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1500);
    }

    setScore(prev => prev + correctCount);

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setMatches({});
        setSelectedLeft(null);
        setTimeLeft(15);
        setShowResults(false);
        setFeedback({});
      } else {
        // Game completed - save score before showing results
        saveGameScore();
        setGameState('results');
      }
    }, 1500);
  };
  const resetGame = () => {
    setGameState('menu');
    setSelectedLevel(null);
    setCurrentQuestionIndex(0);
    setQuestions([]);
    setMatches({});
    setSelectedLeft(null);
    setScore(0);
    setTimeLeft(30);
    setShowConfetti(false);
    setShowResults(false);
    setFeedback({});
    setGameStartTime(null);
    setTotalTimeTaken(0);
  };

  const switchLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'tamil' : 'english');
  };

  if (gameState === 'menu') {
    return (
      <div className="game-container menu-bg">
        <div className="hero-section">
          <div className="science-icon">⚗</div>
          <h1 className="hero-title">
            {language === 'english' ? 'Science Quiz' : 'அறிவியல் வினாடி வினா'}
          </h1>
          <p className="hero-subtitle">
            {language === 'english' ? 'Fast-paced learning!' : 'வேகமான கற்றல்!'}
          </p>
        </div>

        <div className="content-wrapper">
          <div className="language-switch">
            <button onClick={switchLanguage} className="btn btn-outline">
              🌐 {language === 'english' ? 'தமிழ்' : 'English'}
            </button>
          </div>

          <div className="levels-grid">
            {Object.entries(levelInfo).map(([level, info]) => (
              <div key={level} className={`level-card ${info.color}`}>
                <div className="level-icon">{info.icon}</div>
                <h3>Level {level.slice(-1)}: Classes {info[language]}</h3>
                <p>10 Questions • 15s each</p>
                <button onClick={() => startGame(level)} className="btn btn-primary">
                  Start Quiz →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const maxPossibleScore = questions.length * 4;
    const percentage = Math.round((score / maxPossibleScore) * 100);
    
    return (
      <div className="game-container results-bg">
        <Confetti active={true} />
        <div className="results-container">
          <div className="trophy">🏆</div>
          <h1>{language === 'english' ? 'Complete!' : 'முடிந்தது!'}</h1>
          
          <div className="score-display">
            <div className="score-number">{score}/{maxPossibleScore}</div>
            <p>{language === 'english' ? 'Score' : 'மதிப்பெண்'}</p>
            <div className="percentage">({percentage}%)</div>
          </div>
          
          <div className="quote-box">
            <p>{randomQuote[language]}</p>
          </div>

          <div className="results-buttons">
            <button onClick={resetGame} className="btn btn-primary">
              🔄 {language === 'english' ? 'Play Again' : 'மீண்டும்'}
            </button>
            <button onClick={() => startGame(selectedLevel)} className="btn btn-outline">
              {language === 'english' ? 'Retry' : 'மீண்டும் செய்'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const questionData = currentQuestion[language];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="game-container playing-bg">
      <Confetti active={showConfetti} />

      <div className="game-header">
        <div className="header-right">
         
        </div>
        
        <div className="header-right">
          <span className="question-counter">Q{currentQuestionIndex + 1}/{questions.length}</span>
          <span className="subject-badge">{currentQuestion.subject}</span>
          <div className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}>
            ⏱ {timeLeft}s
          </div>
          <button onClick={resetGame} className="btn btn-small">← Back</button>
          <span className="level-indicator">L{selectedLevel.slice(-1)}</span>
          <button onClick={switchLanguage} className="btn btn-small">
            {language === 'english' ? 'தமிழ்' : 'English'}
          </button>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{width: `${progress}%`}}></div>
      </div>

      <div className="question-card">
        <h2>{questionData.question}</h2>
      </div>

      <div className="game-area">
        <div className="left-column">
          <h3>{language === 'english' ? 'Select:' : 'தேர்ந்தெடு:'}</h3>
          {questionData.leftItems.map((item) => {
            const isMatched = Object.keys(matches).includes(item);
            const isSelected = selectedLeft === item;
            const feedbackType = feedback[item];
            
            return (
              <div
                key={item}
                className={`match-item left-item ${
                  isSelected ? 'selected' : ''
                } ${isMatched ? 'matched' : ''} ${
                  feedbackType === 'correct' ? 'correct' : 
                  feedbackType === 'incorrect' ? 'incorrect' : ''
                }`}
                onClick={() => handleLeftItemClick(item)}
              >
                <div className="item-content">
                  <span>{item}</span>
                  {isMatched && (
                    <div className="match-actions">
                      {showResults && (
                        <span className={`feedback-icon ${feedbackType}`}>
                          {feedbackType === 'correct' ? '✓' : '✗'}
                        </span>
                      )}
                      {!showResults && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMatch(item);
                          }}
                          className="remove-btn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {isMatched && (
                  <div className="match-info">
                    → {matches[item]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="right-column">
          <h3>{language === 'english' ? 'Match:' : 'பொருத்து:'}</h3>
          {questionData.rightItems.map((item) => (
            <div
              key={item}
              className={`match-item right-item ${selectedLeft ? 'clickable' : 'disabled'}`}
              onClick={() => handleRightItemClick(item)}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        {!showResults && (
          <>
            <button 
              onClick={checkAnswer}
              className="btn btn-primary btn-large"
              disabled={Object.keys(matches).length === 0}
            >
              {language === 'english' ? 'Submit' : 'சமர்பிக்கவும்'}
            </button>
            <button onClick={handleTimeUp} className="btn btn-outline">
              {language === 'english' ? 'Skip' : 'தவிர்'}
            </button>
          </>
        )}
      </div>

      {showResults && (
        <div className="question-feedback">
          <p className="feedback-score">
            {Object.values(feedback).filter(f => f === 'correct').length}/{Object.keys(feedback).length} ✓
          </p>
          <p className="next-info">
            {currentQuestionIndex < questions.length - 1
              ? language === 'english' ? 'Next question...' : 'அடுத்த கேள்வி...'
              : language === 'english' ? 'Final results...' : 'இறுதி முடிவுகள்...'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ScienceQuiz;