import React, { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import "./GFGWordGame.css";
import { useUser } from './UserContext';

// Word data organized by difficulty levels
const gameWords = {
    beginner: [
        {
            word: "WATER",
            description: {
                en: "H2O - Essential for all life, made of hydrogen and oxygen.",
                ta: "H2O - அனைத்து உயிர்களுக்கும் அவசியம், ஹைட்ரஜன் மற்றும் ஆக்ஸிஜனால் ஆனது."
            }
        },
        
        {
            word: "SALT",
            description: {
                en: "Sodium chloride (NaCl) - Common table salt used in cooking.",
                ta: "சோடியம் குளோரைடு (NaCl) - சமையலில் பயன்படும் பொதுவான உப்பு."
            }
        },
        {
            word: "GOLD",
            description: {
                en: "Au - A precious yellow metal that doesn't rust.",
                ta: "Au - துருப்பிடிக்காத விலையுயர்ந்த மஞ்சள் உலோகம்."
            }
        },
         { word: "HYDROGEN", description: { en: "H - Lightest element, most abundant in universe.", ta: "H - பிரபஞ்சத்தில் மிக இலகுவான மற்றும் அதிகமாக உள்ள தனிமம்." } },
    { word: "OXYGEN", description: { en: "O - Gas we breathe to survive.", ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு." } },
    { word: "NITROGEN", description: { en: "N - Makes up 78% of air, essential for proteins.", ta: "N - வளிமண்டலத்தில் 78% உள்ளது, புரதங்களுக்கு அவசியம்." } },
    { word: "CARBON", description: { en: "C - Found in all living things like diamonds and coal.", ta: "C - வைரம் மற்றும் நிலக்கரி போல அனைத்து உயிரினங்களிலும் காணப்படும்." } },
    { word: "SODIUM", description: { en: "Na - Found in table salt.", ta: "Na - சாதாரண உப்பில் காணப்படும்." } },
    { word: "CHLORINE", description: { en: "Cl - Green gas used in disinfecting water.", ta: "Cl - நீரை சுத்திகரிக்க பயன்படும் பச்சை வாயு." } },
    { word: "POTASSIUM", description: { en: "K - Reacts violently with water.", ta: "K - நீருடன் கடுமையாக வினையாற்றும்." } },
    { word: "CALCIUM", description: { en: "Ca - Important for bones and teeth, found in milk.", ta: "Ca - எலும்புகள் மற்றும் பற்களுக்கு முக்கியம், பாலில் காணப்படும்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame.", ta: "Mg - பிரகாசமான வெள்ளை காட்சியுடன் எரியும்." } },
    { word: "IRON", description: { en: "Fe - Magnetic metal, used in construction.", ta: "Fe - காந்த உலோகம், கட்டடங்களில் பயன்படும்." } },
    // Continue up to 100 words...
  
       
        {
            word: "OXYGEN",
            description: {
                en: "O - The gas we breathe to stay alive.",
                ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு."
            }
        },
        {
            word: "CARBON",
            description: {
                en: "C - Found in all living things, like diamonds and coal.",
                ta: "C - வைரம் மற்றும் நிலக்கரி போல அனைத்து உயிரினங்களிலும் காணப்படும்."
            }
        },
        {
            word: "HELIUM",
            description: {
                en: "He - A light gas that makes balloons float.",
                ta: "He - பலூன்களை மிதக்க வைக்கும் இலகுவான வாயு."
            }
        },
        {
            word: "SILVER",
            description: {
                en: "Ag - A shiny white metal used in jewelry.",
                ta: "Ag - நகைகளில் பயன்படும் பளபளக்கும் வெள்ளை உலோகம்."
            }
        },
        {
            word: "COPPER",
            description: {
                en: "Cu - A reddish-brown metal used in electrical wires.",
                ta: "Cu - மின்சார கம்பிகளில் பயன்படும் சிவப்பு-பழுப்பு உலோகம்."
            }
        },
        { word: "FLUORINE", description: { en: "F - A very reactive halogen, used in toothpaste.", ta: "F - மிகவும் வினையாற்றும் ஹாலஜன், பல் பேஸ்ட்டில் பயன்படும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in cans and foil.", ta: "Al - கேன்கள் மற்றும் தட்டில் பயன்படும் இலகுவான உலோகம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element with a pungent smell, used in matches.", ta: "S - வலுவான வாசனை கொண்ட மஞ்சள் தனிமம், சிலிண்டர்கள் மற்றும் விளக்குகளில் பயன்படும்." } },
    { word: "PHOSPHORUS", description: { en: "P - Essential for DNA and bones, glows in dark.", ta: "P - DNA மற்றும் எலும்புகளுக்கு அவசியம், இருட்டில் ஒளிரும்." } },
    { word: "ZINC", description: { en: "Zn - Used for galvanizing iron and making alloys.", ta: "Zn - இரும்பை ஜால்வனேஸ் செய்ய மற்றும் கலவைகள் செய்ய பயன்படும்." } },
    { word: "LEAD", description: { en: "Pb - Heavy metal used in batteries and pipes.", ta: "Pb - கனமான உலோகம், பேட்டரி மற்றும் குழாய்களில் பயன்படும்." } },
    { word: "TIN", description: { en: "Sn - Used in alloys and coating other metals.", ta: "Sn - கலவைகள் மற்றும் மற்ற உலோகங்களை மூடுவதற்கு பயன்படும்." } },
    { word: "MANGANESE", description: { en: "Mn - Metal used in steel production.", ta: "Mn - எஃகு உற்பத்தியில் பயன்படும் உலோகம்." } },
    { word: "CHROMIUM", description: { en: "Cr - Metal used to make stainless steel.", ta: "Cr - துருப்பிடிக்காத எஃகு செய்ய பயன்படும் உலோகம்." } },
    { word: "NICKEL", description: { en: "Ni - Shiny metal used in coins and batteries.", ta: "Ni - நாணயங்கள் மற்றும் பேட்டரிகளில் பயன்படும் பளபளக்கும் உலோகம்." } },

    { word: "ARGON", description: { en: "Ar - Inert gas, used in light bulbs.", ta: "Ar - செயற்கை வாயு, மின்விளக்குகளில் பயன்படும்." } },
    { word: "KRYPTON", description: { en: "Kr - Inert gas used in lighting.", ta: "Kr - விளக்குகளில் பயன்படும் செயற்கை வாயு." } },
    { word: "XENON", description: { en: "Xe - Noble gas used in high-intensity lamps.", ta: "Xe - அதிக பிரகாச விளக்குகளில் பயன்படும் அரிய வாயு." } },
    { word: "BROMINE", description: { en: "Br - Red-brown liquid used in fire retardants.", ta: "Br - தீ நிறுத்தி பயன்படுத்தப்படும் சிவப்பு-பழுப்பு திரவம்." } },
    { word: "IODINE", description: { en: "I - Purple solid used in medicine.", ta: "I - மருத்துவத்தில் பயன்படுத்தப்படும் ஊதா உறிஞ்சு உலோகம்." } },
    { word: "PHOSPHATE", description: { en: "PO4 - Compound used in fertilizers.", ta: "PO4 - உரத்தில் பயன்படும் যৌகம்." } },
    { word: "SODIUMBICARBONATE", description: { en: "NaHCO3 - Baking soda, used in cooking.", ta: "NaHCO3 - சமையலில் பயன்படும் பேக்கிங் சோடா." } },
 
        {
            word: "NEON",
            description: {
                en: "Ne - A colorful gas used in bright signs.",
                ta: "Ne - பிரகாசமான பலகைகளில் பயன்படும் வண்ணமயமான வாயு."
            }
        },
         { word: "SUGAR", description: { en: "C12H22O11 - Sweet substance used in food.", ta: "C12H22O11 - உணவில் பயன்படுத்தப்படும் இனிப்பு பொருள்." } },
    { word: "IRON", description: { en: "Fe - Used to make tools and construction materials.", ta: "Fe - கருவிகள் மற்றும் கட்டுமானங்களில் பயன்படும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in foils and cans.", ta: "Al - பந்தல் மற்றும் கேன்களில் பயன்படும் இலகு உலோகம்." } },
    { word: "SILICON", description: { en: "Si - Used in computers and electronics.", ta: "Si - கணினிகள் மற்றும் மின்னணுவியலில் பயன்படும்." } },
    { word: "CHLORINE", description: { en: "Cl - Used to disinfect swimming pool water.", ta: "Cl - நீச்சல் குளங்களை சுத்தம் செய்ய பயன்படும்." } },
    { word: "PHOSPHORUS", description: { en: "P - Used in matches and fertilizers.", ta: "P - மிளகாய் மற்றும் உரத்தில் பயன்படும்." } },
    { word: "SULFUR", description: { en: "S - Yellow element used in gunpowder and matches.", ta: "S - மஞ்சள் தனிமம், தூண்டிலை மற்றும் மிளகாயில் பயன்படும்." } },
    { word: "CALCIUM", description: { en: "Ca - Found in milk and bones.", ta: "Ca - பாலிலும் எலும்புகளிலும் காணப்படும்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame, used in fireworks.", ta: "Mg - பிரகாசமான வெள்ளை தீப்பொறியுடன் எரியும், பீர்க்கங்க்களில் பயன்படும்." } },
   
    { word: "COPPER", description: { en: "Cu - Used in electrical wiring and coins.", ta: "Cu - மின்கம்பி மற்றும் நாணயங்களில் பயன்படும்." } },
    { word: "SILVER", description: { en: "Ag - Precious metal used in jewelry.", ta: "Ag - நகைகளில் பயன்படும் விலைமதிப்புள்ள உலோகம்." } },
    { word: "GOLD", description: { en: "Au - Precious yellow metal, doesn't rust.", ta: "Au - துருப்பிடிக்காத விலையுயர்ந்த மஞ்சள் உலோகம்." } },
    { word: "HELIUM", description: { en: "He - Light gas used in balloons.", ta: "He - பலூன்களில் பயன்படுத்தப்படும் இலகு வாயு." } },
    { word: "NEON", description: { en: "Ne - Gas used in glowing signs.", ta: "Ne - ஒளிரும் விளக்குகளில் பயன்படும் வாயு." } },
    { word: "ARGON", description: { en: "Ar - Inert gas used in lights.", ta: "Ar - விளக்குகளில் பயன்படும் செயற்கை வாயு." } },
    { word: "NICKEL", description: { en: "Ni - Used to make coins and stainless steel.", ta: "Ni - நாணயங்கள் மற்றும் துருப்பிடிக்காத எஃகில் பயன்படும்." } },
    { word: "LEAD", description: { en: "Pb - Heavy metal used in batteries.", ta: "Pb - பேட்டரிகளில் பயன்படும் கனமான உலோகம்." } },
    { word: "MERCURY", description: { en: "Hg - Liquid metal used in thermometers.", ta: "Hg - வெப்பமானி போன்ற கருவிகளில் பயன்படும் திரவ உலோகம்." } },
    { word: "TIN", description: { en: "Sn - Used in cans and alloys.", ta: "Sn - கேன்கள் மற்றும் கலவைகளில் பயன்படும்." } }

    ],
    medium: [
        { word: "LITHIUM", description: { en: "Li - Lightest metal, used in batteries.", ta: "Li - எளிதான உலோகம், பேட்டரிகளில் பயன்படும்." } },
    { word: "BERYLLIUM", description: { en: "Be - Used in aerospace materials.", ta: "Be - விண்வெளி உபகரணங்களில் பயன்படும்." } },
    { word: "BORON", description: { en: "B - Used in glass and detergents.", ta: "B - கண்ணாடி மற்றும் சோப்புகளில் பயன்படும்." } },
    { word: "FLUORINE", description: { en: "F - Highly reactive, used in toothpaste.", ta: "F - மிகவும் வினையாற்றும், பல் மஞ்சில் பயன்படும்." } },
    { word: "NEON", description: { en: "Ne - Inert gas, used in glowing signs.", ta: "Ne - ஒளிரும் விளக்குகளில் பயன்படும் செயற்கை வாயு." } },
    { word: "SODIUM", description: { en: "Na - Found in table salt, reacts with water.", ta: "Na - சாதாரண உப்பில் காணப்படும், நீருடன் வினையாற்றும்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright flame, used in fireworks.", ta: "Mg - பிரகாசமான தீப்பொறியுடன் எரியும், பீர்க்கங்க்களில் பயன்படும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in foils and cans.", ta: "Al - பந்தல் மற்றும் கேன்களில் பயன்படும் இலகு உலோகம்." } },
    { word: "SILICON", description: { en: "Si - Used in semiconductors and electronics.", ta: "Si - அரைதலைமையியல் மற்றும் மின்னணுவியலில் பயன்படும்." } },
    { word: "PHOSPHORUS", description: { en: "P - Used in matches and fertilizers.", ta: "P - மிளகாய் மற்றும் உரங்களில் பயன்படும்." } },
    { word: "SULFUR", description: { en: "S - Yellow element used in industry.", ta: "S - மஞ்சள் தனிமம், தொழிலில் பயன்படும்." } },
    { word: "CHLORINE", description: { en: "Cl - Green gas used in disinfecting water.", ta: "Cl - நீரை சுத்தம் செய்ய பச்சை வாயு." } },
    { word: "POTASSIUM", description: { en: "K - Reacts violently with water.", ta: "K - நீருடன் கடுமையாக வினையாற்றும்." } },
    { word: "CALCIUM", description: { en: "Ca - Important for bones and teeth.", ta: "Ca - எலும்புகள் மற்றும் பற்களுக்கு முக்கியம்." } },
    { word: "COPPER", description: { en: "Cu - Used in electrical wiring and coins.", ta: "Cu - மின்கம்பி மற்றும் நாணயங்களில் பயன்படும்." } },
    { word: "ZINC", description: { en: "Zn - Used to galvanize iron and in alloys.", ta: "Zn - இரும்பை குவளைப்படுத்த மற்றும் கலவைகளில் பயன்படும்." } },
    { word: "SILVER", description: { en: "Ag - Precious metal used in jewelry.", ta: "Ag - நகைகளில் பயன்படும் விலைமதிப்புள்ள உலோகம்." } },
    { word: "GOLD", description: { en: "Au - Precious yellow metal.", ta: "Au - விலையுயர்ந்த மஞ்சள் உலோகம்." } },
    { word: "LEAD", description: { en: "Pb - Heavy metal used in batteries.", ta: "Pb - பேட்டரிகளில் பயன்படும் கனமான உலோகம்." } },

        {
            word: "HYDROGEN",
            description: {
                en: "H - The lightest and most abundant element in the universe.",
                ta: "H - பிரபஞ்சத்தில் மிக இலகுவான மற்றும் அதிகமாக உள்ள தனிமம்."
            }
        },
        { word: "LITHIUM", description: { en: "Li - Light metal used in batteries.", ta: "Li - பேட்டரிகளில் பயன்படும் இலகு உலோகம்." } },
    { word: "BERYLLIUM", description: { en: "Be - Lightweight metal used in aerospace.", ta: "Be - விமான மற்றும் விண்வெளி உலோகங்களில் பயன்படும்." } },
    { word: "BORON", description: { en: "B - Non-metal used in glass and detergents.", ta: "B - கண்ணாடி மற்றும் சோப்புகளில் பயன்படும் அலையாத உலோகம்." } },
    { word: "SILICON", description: { en: "Si - Semiconductor used in electronics.", ta: "Si - மின்னணுவியல் சாதனங்களில் பயன்படும் அரை-கொண்டு உலோகம்." } },
    { word: "PHOSPHORUS", description: { en: "P - Essential for DNA and fertilizers.", ta: "P - DNA மற்றும் உரத்தில் அவசியம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element used in matches.", ta: "S - மஞ்சள் தனிமம், சிலிண்டர் மற்றும் விளக்குகளில் பயன்படும்." } },
    { word: "CHLORINE", description: { en: "Cl - Used in disinfectants and pools.", ta: "Cl - நீர் சுத்திகரிப்பில் மற்றும் குளங்களில் பயன்படும்." } },
    { word: "ARGON", description: { en: "Ar - Noble gas used in lighting.", ta: "Ar - விளக்குகளில் பயன்படும் அரிய வாயு." } },
    { word: "POTASSIUM", description: { en: "K - Important for nerves and muscles.", ta: "K - நரம்புகள் மற்றும் தசைகளுக்கு முக்கியம்." } },
    { word: "CALCIUM", description: { en: "Ca - Found in bones and dairy products.", ta: "Ca - எலும்புகள் மற்றும் பால் பொருட்களில் காணப்படும்." } },
    { word: "SCANDIUM", description: { en: "Sc - Rare metal used in aerospace alloys.", ta: "Sc - விமான கலவைகளில் பயன்படும் அரிதான உலோகம்." } },
    { word: "TITANIUM", description: { en: "Ti - Strong, lightweight metal used in aircraft.", ta: "Ti - விமானங்களில் பயன்படும் வலுவான இலகுவான உலோகம்." } },
    { word: "VANADIUM", description: { en: "V - Used to strengthen steel.", ta: "V - எஃகை வலுப்படுத்த பயன்படும்." } },
    { word: "CHROMIUM", description: { en: "Cr - Used in stainless steel and plating.", ta: "Cr - துருப்பிடிக்காத எஃகு மற்றும் பூச்சில் பயன்படும்." } },
    { word: "MANGANESE", description: { en: "Mn - Metal used in steel and batteries.", ta: "Mn - எஃகு மற்றும் பேட்டரிகளில் பயன்படும் உலோகம்." } },
    { word: "IRON", description: { en: "Fe - Magnetic metal used in construction.", ta: "Fe - கட்டடங்களில் பயன்படும் காந்த உலோகம்." } },
    { word: "COBALT", description: { en: "Co - Used in batteries and magnets.", ta: "Co - பேட்டரி மற்றும் காந்தங்களில் பயன்படும்." } },
    { word: "NICKEL", description: { en: "Ni - Shiny metal used in coins and alloys.", ta: "Ni - நாணயங்கள் மற்றும் கலவைகளில் பயன்படும் பளபளக்கும் உலோகம்." } },
    { word: "COPPER", description: { en: "Cu - Used in electrical wires and plumbing.", ta: "Cu - மின்கம்பிகள் மற்றும் குழாய் அமைப்புகளில் பயன்படும்." } },
    { word: "ZINC", description: { en: "Zn - Used for galvanizing iron and making alloys.", ta: "Zn - இரும்பை ஜால்வனேஸ் செய்யவும் கலவைகள் செய்யவும் பயன்படும்." } },
      { word: "FLUORINE", description: { en: "F - Most reactive element, used in toothpaste.", ta: "F - மிகவும் வினையாற்றும் தனிமம், பல் பேஸ்ட்டில் பயன்படும்." } },
    { word: "NEON", description: { en: "Ne - Colorful gas used in bright signs.", ta: "Ne - பிரகாசமான பலகைகளில் பயன்படும் வண்ணமயமான வாயு." } },
    { word: "ARGON", description: { en: "Ar - Noble gas used in lighting and welding.", ta: "Ar - விளக்கு மற்றும் வேல்டிங் வேலைகளில் பயன்படும் அரிய வாயு." } },
    { word: "NICKEL", description: { en: "Ni - Shiny metal used in coins.", ta: "Ni - நாணயங்களில் பயன்படும் பளபளக்கும் உலோகம்." } },
    { word: "SILICON", description: { en: "Si - Semiconductor used in computers.", ta: "Si - கணினிகளில் பயன்படும் அரை-கொண்டு உலோகம்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame.", ta: "Mg - பிரகாசமான வெள்ளை காட்சியுடன் எரியும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in cans.", ta: "Al - கேன்களில் பயன்படும் இலகு உலோகம்." } },
    { word: "SODIUM", description: { en: "Na - Found in table salt.", ta: "Na - சாதாரண உப்பில் காணப்படும்." } },
    { word: "POTASSIUM", description: { en: "K - Reacts violently with water.", ta: "K - நீருடன் கடுமையாக வினையாற்றும்." } },
    { word: "CALCIUM", description: { en: "Ca - Essential for strong bones.", ta: "Ca - வலுவான எலும்புகளுக்கு அவசியம்." } },
    { word: "PHOSPHORUS", description: { en: "P - Glows in the dark, essential for life.", ta: "P - இருட்டில் ஒளிரும், உயிர்க்கும் அவசியம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element with a pungent smell.", ta: "S - வாசனை கொண்ட மஞ்சள் தனிமம்." } },
    { word: "CHLORINE", description: { en: "Cl - Greenish gas used to purify water.", ta: "Cl - நீரை சுத்திகரிக்க பயன்படும் பச்சை வாயு." } },
    { word: "HELIUM", description: { en: "He - Light gas used in balloons.", ta: "He - பலூன்களில் பயன்படும் இலகுவான வாயு." } },
    { word: "GOLD", description: { en: "Au - Precious yellow metal.", ta: "Au - விலையுயர்ந்த மஞ்சள் உலோகம்." } },
    { word: "SILVER", description: { en: "Ag - Shiny white metal used in jewelry.", ta: "Ag - நகைகளில் பயன்படும் பளபளக்கும் வெள்ளை உலோகம்." } },
    { word: "COPPER", description: { en: "Cu - Reddish-brown metal used in wires.", ta: "Cu - மின்கம்பிகளில் பயன்படும் சிவப்பு-பழுப்பு உலோகம்." } },
    { word: "IRON", description: { en: "Fe - Magnetic metal used in construction.", ta: "Fe - கட்டடங்களில் பயன்படும் காந்த உலோகம்." } },
    { word: "OXYGEN", description: { en: "O - Gas we breathe to stay alive.", ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு." } },
  { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in foil and cans.", ta: "Al - அலுமினியம் உலோகம், பந்தல் மற்றும் கேன்களில் பயன்படும்." } },
    { word: "SILICON", description: { en: "Si - Used in computers and electronics.", ta: "Si - கணினி மற்றும் மின்னணுவியல் சாதனங்களில் பயன்படும்." } },
    { word: "PHOSPHORUS", description: { en: "P - Glows in dark, essential for life.", ta: "P - இருட்டில் ஒளிரும், உயிர்க்கும் அவசியம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element with strong smell.", ta: "S - வாசனை கொண்ட மஞ்சள் தனிமம்." } },
    { word: "CHLORINE", description: { en: "Cl - Used to clean water.", ta: "Cl - நீரை சுத்தம் செய்ய பயன்படும்." } },
    { word: "ARGON", description: { en: "Ar - Noble gas used in lights.", ta: "Ar - விளக்குகளில் பயன்படும் அரிய வாயு." } },
    { word: "CALCIUM", description: { en: "Ca - Found in milk and bones.", ta: "Ca - பாலிலும் எலும்புகளிலும் காணப்படும்." } },
    { word: "POTASSIUM", description: { en: "K - Important for muscles and nerves.", ta: "K - தசைகள் மற்றும் நரம்புகளுக்கு முக்கியம்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame.", ta: "Mg - பிரகாசமான வெள்ளை தீப்பொறி ஒளியுடன் எரியும்." } },
    { word: "ZINC", description: { en: "Zn - Prevents rusting, used in coatings.", ta: "Zn - துருப்பிடாமல் தடுக்கும், மேற்பரப்பில் பயன்படும்." } },
    { word: "NICKEL", description: { en: "Ni - Used in coins and alloys.", ta: "Ni - நாணயங்கள் மற்றும் கலவைகளில் பயன்படும்." } },
    { word: "LEAD", description: { en: "Pb - Heavy metal used in batteries.", ta: "Pb - பேட்டரிகளில் பயன்படும் கனமான உலோகம்." } },
    { word: "TIN", description: { en: "Sn - Used to coat other metals.", ta: "Sn - பிற உலோகங்களை மூட பயன்படுத்தப்படும்." } },
    { word: "SILVER", description: { en: "Ag - Shiny metal used in jewelry.", ta: "Ag - நகைகளில் பயன்படும் பளபளக்கும் உலோகம்." } },
    { word: "PLATINUM", description: { en: "Pt - Precious metal, used in jewelry and catalysts.", ta: "Pt - நகைகள் மற்றும் சார்ஜ் செயலிகளில் பயன்படும் விலைமதிப்பான உலோகம்." } },
    { word: "MERCURY", description: { en: "Hg - Liquid metal used in thermometers.", ta: "Hg - வெப்ப அளவைக் கருவிகளில் பயன்படும் திரவ உலோகம்." } },
    { word: "IODINE", description: { en: "I - Used in antiseptics and nutrition.", ta: "I - கிருமி நாசினி மற்றும் ஊட்டச்சத்து பொருளில் பயன்படும்." } },
    { word: "BROMINE", description: { en: "Br - Red-brown liquid used in flame retardants.", ta: "Br - தீக்கு எதிர்ப்பு பொருள்களில் பயன்படும் சிவப்புப் பழுப்பு திரவம்." } },
    { word: "HELIUM", description: { en: "He - Light gas that makes balloons float.", ta: "He - பலூன்களை மிதக்க வைக்கும் இலகுவான வாயு." } },
    { word: "NEON", description: { en: "Ne - Used in glowing signs.", ta: "Ne - ஒளிரும் பலகைகளில் பயன்படும்." } },

    {
            word: "SODIUM",
            description: {
                en: "Na - An alkali metal that reacts violently with water.",
                ta: "Na - நீருடன் கடுமையாக வினையாற்றும் ஆல்கலி உலோகம்."
            }
        },
        {
            word: "CHLORINE",
            description: {
                en: "Cl - A greenish gas used to purify swimming pool water.",
                ta: "Cl - நீச்சல் குளத்தின் நீரை சுத்திகரிக்க பயன்படும் பச்சை நிற வாயு."
            }
        },
        {
            word: "CALCIUM",
            description: {
                en: "Ca - Important for strong bones and teeth, found in milk.",
                ta: "Ca - வலுவான எலும்புகள் மற்றும் பற்களுக்கு முக்கியம், பாலில் காணப்படும்."
            }
        },
        {
            word: "FLUORINE",
            description: {
                en: "F - The most reactive element, used in toothpaste.",
                ta: "F - மிகவும் வினையாற்றும் தனிமம், பல் பேஸ்ட்டில் பயன்படும்."
            }
        },
             { word: "LITHIUM", description: { en: "Li - Soft alkali metal used in batteries.", ta: "Li - பேட்டரிகளில் பயன்படும் மென்மையான ஆல்கலி உலோகம்." } },
    { word: "BERYLLIUM", description: { en: "Be - Light metal used in aerospace alloys.", ta: "Be - விமான உலோக கலவைகளில் பயன்படும் இலகு உலோகம்." } },
    { word: "BORON", description: { en: "B - Metalloid used in detergents and glass.", ta: "B - சோப்புகள் மற்றும் கண்ணாடிகளில் பயன்படும் அரைகாந்த உலோகம்." } },
    { word: "CARBON", description: { en: "C - Found in all living things like diamonds and coal.", ta: "C - வைரம் மற்றும் நிலக்கரி போல அனைத்து உயிரினங்களிலும் காணப்படும்." } },
    { word: "NITROGEN", description: { en: "N - Makes up 78% of air, essential for proteins.", ta: "N - வளிமண்டலத்தில் 78% உள்ளது, புரதங்களுக்கு அவசியம்." } },
    { word: "OXYGEN", description: { en: "O - Gas we breathe to survive.", ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு." } },
    { word: "FLUORINE", description: { en: "F - Highly reactive, used in toothpaste.", ta: "F - மிகவும் வினையாற்றும் தனிமம், பல் பேஸ்ட்டில் பயன்படும்." } },
    { word: "NEON", description: { en: "Ne - Colorful gas used in signs.", ta: "Ne - பலகைகளில் பயன்படும் வண்ணமயமான வாயு." } },
    { word: "SODIUM", description: { en: "Na - Found in table salt.", ta: "Na - சாதாரண உப்பில் காணப்படும்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame.", ta: "Mg - பிரகாசமான வெள்ளை காட்சியுடன் எரியும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in cans.", ta: "Al - கேன்களில் பயன்படும் இலகு உலோகம்." } },
    { word: "SILICON", description: { en: "Si - Semiconductor used in electronics.", ta: "Si - மின்னணுவியல் சாதனங்களில் பயன்படும் அரை-கொண்டு உலோகம்." } },
    { word: "PHOSPHORUS", description: { en: "P - Glows in the dark, essential for life.", ta: "P - இருட்டில் ஒளிரும், உயிர்க்கும் அவசியம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element with pungent smell.", ta: "S - வாசனை கொண்ட மஞ்சள் தனிமம்." } },
    { word: "CHLORINE", description: { en: "Cl - Green gas used to disinfect water.", ta: "Cl - நீரை சுத்திகரிக்க பயன்படும் பச்சை வாயு." } },
    { word: "ARGON", description: { en: "Ar - Noble gas used in lighting and welding.", ta: "Ar - விளக்கு மற்றும் வேல்டிங் வேலைகளில் பயன்படும் அரிய வாயு." } },
    { word: "CALCIUM", description: { en: "Ca - Important for bones and teeth.", ta: "Ca - எலும்புகள் மற்றும் பற்களுக்கு முக்கியம்." } },
    { word: "POTASSIUM", description: { en: "K - Reacts violently with water.", ta: "K - நீருடன் கடுமையாக வினையாற்றும்." } },
    { word: "IRON", description: { en: "Fe - Magnetic metal used in construction.", ta: "Fe - கட்டடங்களில் பயன்படும் காந்த உலோகம்." } },
    { word: "COPPER", description: { en: "Cu - Reddish-brown metal used in wires.", ta: "Cu - மின்கம்பிகளில் பயன்படும் சிவப்பு-பழுப்பு உலோகம்." } },

        
        {
            word: "NITROGEN",
            description: {
                en: "N - Makes up 78% of Earth's atmosphere, essential for proteins.",
                ta: "N - பூமியின் வளிமண்டலத்தின் 78% உள்ளது, புரதங்களுக்கு அவசியம்."
            }
        },
        {
            word: "ALUMINUM",
            description: {
                en: "Al - A lightweight metal used in cans and aircraft.",
                ta: "Al - கேன்கள் மற்றும் விமானங்களில் பயன்படும் இலகு உலோகம்."
            }
        },
        {
            word: "SULFUR",
            description: {
                en: "S - A yellow element that smells like rotten eggs.",
                ta: "S - அழுகிய முட்டை போன்ற வாசனை கொண்ட மஞ்சள் தனிமம்."
            }
        },
        {
            word: "PHOSPHORUS",
            description: {
                en: "P - Essential for DNA and bones, glows in the dark.",
                ta: "P - DNA மற்றும் எலும்புகளுக்கு அவசியம், இருட்டில் ஒளிரும்."
            }
        },
        {
            word: "POTASSIUM",
            description: {
                en: "K - Important for muscles and nerves, found in bananas.",
                ta: "K - தசைகள் மற்றும் நரம்புகளுக்கு முக்கியம், வாழைப்பழத்தில் உள்ளது."
            }
        },
        { word: "LITHIUM", description: { en: "Li - Lightest metal, used in batteries.", ta: "Li - மிக இலகு உலோகம், பேட்டரிகளில் பயன்படும்." } },
    { word: "BERYLLIUM", description: { en: "Be - Lightweight, used in aerospace materials.", ta: "Be - இலகுவானது, விண்வெளி உலோகங்களில் பயன்படும்." } },
    { word: "BORON", description: { en: "B - Used in glass and detergents.", ta: "B - கண்ணாடி மற்றும் சோப்புகளில் பயன்படும்." } },
    { word: "CARBON", description: { en: "C - Found in all living things and fuels.", ta: "C - அனைத்து உயிர்களிலும் மற்றும் எரிபொருளிலும் காணப்படும்." } },
    { word: "NITROGEN", description: { en: "N - Makes up 78% of air, essential for proteins.", ta: "N - வளிமண்டலத்தில் 78% உள்ளது, புரதங்களுக்கு அவசியம்." } },
    { word: "OXYGEN", description: { en: "O - Gas we breathe to survive.", ta: "O - நாம் உயிர் வாழ சுவாசிக்கும் வாயு." } },
    { word: "FLUORINE", description: { en: "F - Highly reactive, used in toothpaste.", ta: "F - மிகவும் வினையாற்றும், பல் பேஸ்ட்டில் பயன்படும்." } },
    { word: "NEON", description: { en: "Ne - Inert gas used in lights.", ta: "Ne - செயற்கை வாயு, விளக்குகளில் பயன்படும்." } },
    { word: "SODIUM", description: { en: "Na - Found in table salt.", ta: "Na - சாதாரண உப்பில் காணப்படும்." } },
    { word: "MAGNESIUM", description: { en: "Mg - Burns with bright white flame.", ta: "Mg - பிரகாசமான வெள்ளை தீப்பொறி ஒளியுடன் எரியும்." } },
    { word: "ALUMINUM", description: { en: "Al - Lightweight metal used in foil and cans.", ta: "Al - பந்தல் மற்றும் கேன்களில் பயன்படும்." } },
    { word: "SILICON", description: { en: "Si - Used in computers and electronics.", ta: "Si - கணினி மற்றும் மின்னணுவியல் சாதனங்களில் பயன்படும்." } },
    { word: "PHOSPHORUS", description: { en: "P - Glows in dark, essential for life.", ta: "P - இருட்டில் ஒளிரும், உயிர்க்கும் அவசியம்." } },
    { word: "SULFUR", description: { en: "S - Yellow element with strong smell.", ta: "S - வாசனை கொண்ட மஞ்சள் தனிமம்." } },
    { word: "CHLORINE", description: { en: "Cl - Used to disinfect water.", ta: "Cl - நீரை சுத்தம் செய்ய பயன்படும்." } },
    { word: "ARGON", description: { en: "Ar - Noble gas used in lights.", ta: "Ar - விளக்குகளில் பயன்படும் அரிய வாயு." } },
    { word: "CALCIUM", description: { en: "Ca - Found in milk and bones.", ta: "Ca - பாலிலும் எலும்புகளிலும் காணப்படும்." } },
    { word: "POTASSIUM", description: { en: "K - Important for muscles and nerves.", ta: "K - தசைகள் மற்றும் நரம்புகளுக்கு முக்கியம்." } },
    { word: "IRON", description: { en: "Fe - Magnetic metal, used in construction.", ta: "Fe - காந்த உலோகம், கட்டடங்களில் பயன்படும்." } },
    { word: "COPPER", description: { en: "Cu - Used in electrical wires.", ta: "Cu - மின்கம்பிகளில் பயன்படும்." } }

    ],
    advanced: [
        {
            word: "URANIUM",
            description: {
                en: "U - A radioactive element used in nuclear power plants.",
                ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்."
            }
        },
         { word: "URANIUM", description: { en: "U - Radioactive element used in nuclear power.", ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "PLUTONIUM", description: { en: "Pu - Man-made radioactive element used in nuclear weapons.", ta: "Pu - அணு ஆயுதங்களில் பயன்படும் மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம்." } },
    { word: "THORIUM", description: { en: "Th - Radioactive metal, potential nuclear fuel.", ta: "Th - கதிரியக்க உலோகம், அணு எரிபொருள் ஆகும்." } },
    { word: "RADIUM", description: { en: "Ra - Highly radioactive, used in luminous paints.", ta: "Ra - மிகவும் கதிரியக்கமானது, ஒளிரும் வண்ணங்களில் பயன்படும்." } },
    { word: "TUNGSTEN", description: { en: "W - High melting point, used in filaments.", ta: "W - மிக அதிக உருகு நிலை கொண்டது, மின்விளக்கு இழைகளில் பயன்படும்." } },
    { word: "MOLYBDENUM", description: { en: "Mo - Strengthens steel alloys and electronics.", ta: "Mo - எஃகு கலவைகளுக்கு வலிமை தரும் மற்றும் மின்னணுவியலில் பயன்படும்." } },
    { word: "CHROMIUM", description: { en: "Cr - Used to make stainless steel and plating.", ta: "Cr - துருப்பிடிக்காத எஃகு மற்றும் மூலக்கோட்டை செய்ய பயன்படும்." } },
    { word: "VANADIUM", description: { en: "V - Strengthens steel and used in batteries.", ta: "V - எஃகை வலுப்படுத்த மற்றும் பேட்டரிகளில் பயன்படும்." } },
    { word: "RUTHENIUM", description: { en: "Ru - Rare platinum-group metal used in electronics.", ta: "Ru - மின்னணுவியலில் பயன்படும் அரிய பிளாட்டினம் குழு உலோகம்." } },
    { word: "RHENIUM", description: { en: "Re - Rare element used in jet engines.", ta: "Re - ஜெட் என்ஜின்களில் பயன்படும் அரிதான தனிமம்." } },
    { word: "BERKELIUM", description: { en: "Bk - Synthetic radioactive element created in labs.", ta: "Bk - ஆய்வகங்களில் உருவாக்கப்படும் செயற்கை கதிரியக்க தனிமம்." } },
    { word: "EINSTEINIUM", description: { en: "Es - Named after Einstein, produced in nuclear reactors.", ta: "Es - ஐன்ஸ்டைன் பெயரில் பெயரிடப்பட்டது, அணு உலைகளில் உற்பத்தியாகிறது." } },
    { word: "NEPTUNIUM", description: { en: "Np - Radioactive element used in research.", ta: "Np - ஆய்வுகளில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "PROMETHIUM", description: { en: "Pm - Rare radioactive element, used in luminous paint.", ta: "Pm - அரிய கதிரியக்க தனிமம், ஒளிரும் வண்ணங்களில் பயன்படும்." } },
    { word: "SAMARIUM", description: { en: "Sm - Used in magnets and electronics.", ta: "Sm - மின்னணுவியல் மற்றும் காந்தத்தில் பயன்படும்." } },
    { word: "EUROPIUM", description: { en: "Eu - Used in red phosphors for TVs.", ta: "Eu - தொலைக்காட்சிகளுக்கான சிவப்பு பாஸ்பர் பொருளில் பயன்படும்." } },
    { word: "GADOLINIUM", description: { en: "Gd - Used in MRI contrast agents.", ta: "Gd - எம்ஆர்ஐ கருவிகளில் மாற்று சின்னியாக பயன்படும்." } },
    { word: "TERBIUM", description: { en: "Tb - Used in green phosphors.", ta: "Tb - பச்சை பாஸ்பர் பொருளில் பயன்படும்." } },
    { word: "DYSPROSIUM", description: { en: "Dy - Used in magnets and lasers.", ta: "Dy - காந்தங்கள் மற்றும் லேசர்களில் பயன்படும்." } },
    { word: "HOLMIUM", description: { en: "Ho - Used in lasers and nuclear control rods.", ta: "Ho - லேசர் மற்றும் அணு கட்டுப்பாட்டு ராட்களில் பயன்படும்." } },

        { word: "URANIUM", description: { en: "U - Radioactive element used in nuclear power.", ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "PLUTONIUM", description: { en: "Pu - Man-made radioactive element for nuclear weapons.", ta: "Pu - அணு ஆயுதங்களில் பயன்படும் மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம்." } },
    { word: "NEPTUNIUM", description: { en: "Np - Radioactive actinide, used in research.", ta: "Np - ஆராய்ச்சியில் பயன்படும் கதிரியக்க ஆக்டினைடு." } },
    { word: "AMERICIUM", description: { en: "Am - Synthetic element used in smoke detectors.", ta: "Am - புகை கண்டறிதலில் பயன்படும் செயற்கை தனிமம்." } },
    { word: "CURIUM", description: { en: "Cm - Radioactive element used in research.", ta: "Cm - ஆராய்ச்சியில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "BERKELIUM", description: { en: "Bk - Synthetic radioactive element created in labs.", ta: "Bk - ஆய்வகங்களில் உருவாக்கப்படும் செயற்கை கதிரியக்க தனிமம்." } },
    { word: "CALIFORNIUM", description: { en: "Cf - Used as a neutron source in nuclear reactors.", ta: "Cf - அணு உலைகளில் நியூட்ரான் மூலமாக பயன்படும்." } },
    { word: "EINSTEINIUM", description: { en: "Es - Named after Einstein, produced in nuclear reactors.", ta: "Es - ஐன்ஸ்டைன் பெயரில் பெயரிடப்பட்டது, அணு உலைகளில் உற்பத்தியாகிறது." } },
    { word: "FERMIUM", description: { en: "Fm - Synthetic radioactive element in research.", ta: "Fm - ஆராய்ச்சியில் பயன்படும் செயற்கை கதிரியக்க தனிமம்." } },
    { word: "MENDELEVIUM", description: { en: "Md - Synthetic element named after Mendeleev.", ta: "Md - மெண்டிலீவ் பெயரில் பெயரிடப்பட்ட செயற்கை தனிமம்." } },
    { word: "RUTHENIUM", description: { en: "Ru - Rare platinum group metal used in electronics.", ta: "Ru - மின்னணுவியலில் பயன்படும் அரிய பிளாட்டினம் குழு உலோகம்." } },
    { word: "RHODIUM", description: { en: "Rh - Precious metal used in catalytic converters.", ta: "Rh - காற்றழுத்த மாற்றி பயன்படும் விலைமதிப்புள்ள உலோகம்." } },
    { word: "PALLADIUM", description: { en: "Pd - Used in electronics and jewelry.", ta: "Pd - மின்னணு சாதனங்கள் மற்றும் நகைகளில் பயன்படும்." } },
    { word: "SILVER", description: { en: "Ag - Precious white metal used in jewelry.", ta: "Ag - நகைகளில் பயன்படும் விலையுயர்ந்த வெள்ளை உலோகம்." } },
    { word: "CADMIUM", description: { en: "Cd - Soft metal used in batteries.", ta: "Cd - பேட்டரிகளில் பயன்படும் மெல்லிய உலோகம்." } },
    { word: "INDIUM", description: { en: "In - Soft metal used in electronics and alloys.", ta: "In - மின்னணு சாதனங்கள் மற்றும் கலவைகளில் பயன்படும் மெல்லிய உலோகம்." } },
    { word: "TIN", description: { en: "Sn - Metal used in alloys and coatings.", ta: "Sn - கலவைகள் மற்றும் பூச்சில் பயன்படும் உலோகம்." } },
    { word: "ANTIMONY", description: { en: "Sb - Metalloid used in flame retardants.", ta: "Sb - தீ நிறுத்தியில் பயன்படும் அரைகாந்த உலோகம்." } },
    { word: "TELLURIUM", description: { en: "Te - Metalloid used in alloys and electronics.", ta: "Te - கலவைகள் மற்றும் மின்னணுவியல் உலோகங்களில் பயன்படும் அரைகாந்த உலோகம்." } },
    { word: "BISMUTH", description: { en: "Bi - Heavy metal used in cosmetics and alloys.", ta: "Bi - அழகு பொருட்கள் மற்றும் கலவைகளில் பயன்படும் கனமான உலோகம்." } },
 { word: "URANIUM", description: { en: "U - Radioactive element used in nuclear power plants.", ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "PLUTONIUM", description: { en: "Pu - Man-made radioactive element used in nuclear weapons.", ta: "Pu - அணு ஆயுதங்களில் பயன்படும் மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம்." } },
    { word: "THORIUM", description: { en: "Th - Radioactive metal used as nuclear fuel.", ta: "Th - அணு எரிபொருளாக பயன்படும் கதிரியக்க உலோகம்." } },
    { word: "RADIUM", description: { en: "Ra - Glows in dark, used in old luminous paints.", ta: "Ra - இருட்டில் ஒளிரும், பழைய வெளிச்ச பேண்ட்களில் பயன்படுத்தப்பட்டது." } },
    { word: "TUNGSTEN", description: { en: "W - Highest melting point, used in filaments.", ta: "W - மிக உயர்ந்த உருகு நிலை, மின்விளக்கு இழைகளில் பயன்படும்." } },
    { word: "CHROMIUM", description: { en: "Cr - Used in stainless steel and plating.", ta: "Cr - துருப்பிடிக்காத எஃகு மற்றும் குரோம் மேற்பரப்பில் பயன்படும்." } },
    { word: "VANADIUM", description: { en: "V - Strengthens steel, used in batteries.", ta: "V - எஃகை வலுப்படுத்த மற்றும் பேட்டரிகளில் பயன்படும்." } },
    { word: "MOLYBDENUM", description: { en: "Mo - Used in high-strength steel alloys.", ta: "Mo - அதிக வலிமை எஃகு கலவைகளில் பயன்படும்." } },
    { word: "RUTHENIUM", description: { en: "Ru - Rare platinum group metal used in electronics.", ta: "Ru - மின்னணுவியலில் பயன்படும் அரிய பிளாட்டினம் உலோகம்." } },
    { word: "RHENIUM", description: { en: "Re - One of the rarest elements, used in jet engines.", ta: "Re - அரிதான தனிமங்களில் ஒன்று, ஜெட் என்ஜின்களில் பயன்படும்." } },
    { word: "BERKELIUM", description: { en: "Bk - Synthetic radioactive element created in labs.", ta: "Bk - ஆய்வகங்களில் உருவாக்கப்படும் செயற்கை கதிரியக்க தனிமம்." } },
    { word: "EINSTEINIUM", description: { en: "Es - Named after Einstein, produced in nuclear reactors.", ta: "Es - ஐன்ஸ்டைன் பெயரில் பெயரிடப்பட்டது, அணு உலைகளில் உற்பத்தியாகிறது." } },
    { word: "COPERNICIUM", description: { en: "Cn - Synthetic element, very unstable.", ta: "Cn - செயற்கை தனிமம், மிகவும் நிலைத்திருக்காதது." } },
    { word: "NIHINIUM", description: { en: "Nh - Man-made element, highly radioactive.", ta: "Nh - மனிதனால் உருவாக்கப்பட்ட, மிகவும் கதிரியக்க தனிமம்." } },
    { word: "FLEROVIUM", description: { en: "Fl - Synthetic element, discovered in labs.", ta: "Fl - ஆய்வகங்களில் கண்டுபிடிக்கப்பட்ட செயற்கை தனிமம்." } },
    { word: "MOSCOVIUM", description: { en: "Mc - Highly unstable synthetic element.", ta: "Mc - மிகவும் நிலைத்திராத செயற்கை தனிமம்." } },
    { word: "LIVERMORIUM", description: { en: "Lv - Synthetic element, radioactive.", ta: "Lv - செயற்கை தனிமம், கதிரியக்கம் கொண்டது." } },
    { word: "TENNESSINE", description: { en: "Ts - Man-made, very unstable element.", ta: "Ts - மனிதனால் உருவாக்கப்பட்ட, மிகவும் நிலைத்திராத தனிமம்." } },
    { word: "OGANESSON", description: { en: "Og - Synthetic noble gas, very unstable.", ta: "Og - செயற்கை அரிய வாயு, மிகவும் நிலைத்திராதது." } },
    { word: "ACTINIUM", description: { en: "Ac - Radioactive metal used in research.", ta: "Ac - ஆய்வில் பயன்படும் கதிரியக்க உலோகம்." } },

        {
            word: "PLUTONIUM",
            description: {
                en: "Pu - A man-made radioactive element used in nuclear weapons.",
                ta: "Pu - அணு ஆயுதங்களில் பயன்படும் மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம்."
            }
        },
        {
            word: "TUNGSTEN",
            description: {
                en: "W - Has the highest melting point, used in light bulb filaments.",
                ta: "W - மிக அதிக உருகு நிலை கொண்டது, மின்விளக்கு இழைகளில் பயன்படும்."
            }
        },
        {
            word: "CHROMIUM",
            description: {
                en: "Cr - Used to make stainless steel and chrome plating.",
                ta: "Cr - துருப்பிடிக்காத எஃகு மற்றும் குரோம் முலாம் செய்ய பயன்படும்."
            }
        },
        {
            word: "VANADIUM",
            description: {
                en: "V - Used to strengthen steel and in rechargeable batteries.",
                ta: "V - எஃகை வலுப்படுத்த மற்றும் மீண்டும் சார்ஜ் செய்யக்கூடிய பேட்டரிகளில் பயன்படும்."
            }
        },
        {
            word: "MOLYBDENUM",
            description: {
                en: "Mo - Used in high-strength steel alloys and electronics.",
                ta: "Mo - அதிக வலிமை எஃகு கலவைகள் மற்றும் மின்னணுவியலில் பயன்படும்."
            }
        },
        {
            word: "RUTHENIUM",
            description: {
                en: "Ru - A rare platinum group metal used in electronics.",
                ta: "Ru - மின்னணுவியலில் பயன்படும் அரிய பிளாட்டினம் குழு உலோகம்."
            }
        },
        {
            word: "RHENIUM",
            description: {
                en: "Re - One of the rarest elements, used in jet engines.",
                ta: "Re - அரிதான தனிமங்களில் ஒன்று, ஜெட் என்ஜின்களில் பயன்படும்."
            }
        },
        {
            word: "BERKELIUM",
            description: {
                en: "Bk - A synthetic radioactive element created in laboratories.",
                ta: "Bk - ஆய்வகங்களில் உருவாக்கப்படும் செயற்கை கதிரியக்க தனிமம்."
            }
        },
        {
            word: "EINSTEINIUM",
            description: {
                en: "Es - Named after Einstein, produced in nuclear reactors.",
                ta: "Es - ஐன்ஸ்டைன் பெயரில் பெயரிடப்பட்டது, அணு உலைகளில் உற்பத்தியாகிறது."
            }
        },
         { word: "URANIUM", description: { en: "U - Radioactive element used in nuclear power.", ta: "U - அணு மின் நிலையங்களில் பயன்படும் கதிரியக்க தனிமம்." } },
    { word: "PLUTONIUM", description: { en: "Pu - Man-made radioactive element, used in nuclear weapons.", ta: "Pu - மனிதனால் உருவாக்கப்பட்ட கதிரியக்க தனிமம், அணு ஆயுதங்களில் பயன்படும்." } },
    { word: "THORIUM", description: { en: "Th - Radioactive element, alternative nuclear fuel.", ta: "Th - கதிரியக்க தனிமம், அணு எரிபொருளுக்கு மாற்றாக பயன்படும்." } },
    { word: "RADON", description: { en: "Rn - Radioactive noble gas from decay of radium.", ta: "Rn - ரேடியத்தின் முறிவில் உருவாகும் கதிரியக்க வாயு." } },
    { word: "ACTINIUM", description: { en: "Ac - Rare radioactive element, used in research.", ta: "Ac - அரிய கதிரியக்க தனிமம், ஆராய்ச்சியில் பயன்படும்." } },
    { word: "THALLIUM", description: { en: "Tl - Soft metal used in electronics and optics.", ta: "Tl - மின்னணு மற்றும் ஒளியியல் கருவிகளில் பயன்படும் மெல்லிய உலோகம்." } },
    { word: "BISMUTH", description: { en: "Bi - Heavy metal, low toxicity, used in cosmetics.", ta: "Bi - கனமான உலோகம், குறைந்த விஷம், பொம்மைகள் மற்றும் அழகு பொருள்களில் பயன்படும்." } },
    { word: "TANTALUM", description: { en: "Ta - Used in capacitors and high-temperature alloys.", ta: "Ta - கேபாசிட்டர்கள் மற்றும் உயர் வெப்ப கலவைகளில் பயன்படும்." } },
    { word: "RUTHENIUM", description: { en: "Ru - Rare platinum group metal used in electronics.", ta: "Ru - அரிய பிளாட்டினம் குழு உலோகம், மின்னணுவியலில் பயன்படும்." } },
    { word: "RHENIUM", description: { en: "Re - Very rare metal, used in jet engines.", ta: "Re - மிகவும் அரிய உலோகம், ஜெட் என்ஜின்களில் பயன்படும்." } },
    { word: "OSMIUM", description: { en: "Os - Densest naturally occurring element.", ta: "Os - இயற்கையில் காணப்படும் மிக கனமான தனிமம்." } },
    { word: "IRIDIUM", description: { en: "Ir - Hard, brittle metal used in electrical contacts.", ta: "Ir - கடினம், شکنத்தன்மை கொண்ட உலோகம், மின் தொடர்புகளில் பயன்படும்." } },
    { word: "PALLADIUM", description: { en: "Pd - Platinum group metal, used in catalytic converters.", ta: "Pd - பிளாட்டினம் குழு உலோகம், சாத்தி மாற்றி கருவிகளில் பயன்படும்." } },
    { word: "OSMIUM", description: { en: "Os - Hard metal, used in fountain pen tips.", ta: "Os - கடின உலோகம், பேனா முனையில் பயன்படும்." } },
    { word: "ANTIMONY", description: { en: "Sb - Metalloid used in flame retardants.", ta: "Sb - மெட்டலாய்ட், தீயை தடுக்கும் பொருள்களில் பயன்படும்." } },
    { word: "SELENIUM", description: { en: "Se - Non-metal, used in photocells and electronics.", ta: "Se - அல்லாத உலோகம், புகைப்பட செல்கள் மற்றும் மின்னணுவியலில் பயன்படும்." } },
    { word: "IODINE", description: { en: "I - Halogen used in medicine and antiseptics.", ta: "I - மருத்துவம் மற்றும் கிருமிநாசினி மருந்துகளில் பயன்படும் ஹாலஜன்." } },
    { word: "ASTATINE", description: { en: "At - Rare radioactive halogen, used in research.", ta: "At - அரிய கதிரியக்க ஹாலஜன், ஆராய்ச்சியில் பயன்படும்." } },
    { word: "CESIUM", description: { en: "Cs - Alkali metal, used in atomic clocks.", ta: "Cs - ஆல்கலி உலோகம், அணு கடிகாரங்களில் பயன்படும்." } },
    { word: "FRANCIUM", description: { en: "Fr - Extremely rare alkali metal.", ta: "Fr - மிகவும் அரிய ஆல்கலி உலோகம்." } }

    ]
};

const translations = {
    en: {
        title: "Chemistry Periodic Table Word Guess Game",
        selectLevel: "Select Difficulty Level",
        beginner: "Beginner (Classes 6-8)",
        medium: "Medium (Classes 9-10)", 
        advanced: "Advanced (Classes 11-12)",
        hint: "Hint:",
        correctGuess: "Excellent! You guessed correctly!",
        wrongGuess: "Wrong guess! Try again!",
        timeUp: "Time's up! The correct word was:",
        correctWordWas: "Correct word was:",
        gameOver: "Game Over! You made too many wrong guesses.",
        levelComplete: "Level Complete!",
        congratulations: "Congratulations!",
        yourScore: "Your Score:",
        questionsCorrect: "questions correct out of",
        timeBonus: "Time Bonus:",
        totalScore: "Total Score:",
        restart: "Restart Game",
        nextLevel: "Next Level",
        removeLetter: "Remove Letter",
        hintsRemaining: "Hints:",
        getHint: "Get Hint",
        guess: "Guess",
        next: "Next Question",
        question: "Question",
        of: "of",
        timeLeft: "Time:",
        seconds: "s",
        backToMenu: "Back to Menu"
    },
    ta: {
        title: "வேதியியல் ஆவர்த்தன அட்டவணை சொல் யூக விளையாட்டு",
        selectLevel: "கஷ்டத்தின் அளவை தேர்வு செய்யுங்கள்",
        beginner: "ஆரம்ப நிலை (வகுப்புகள் 6-8)",
        medium: "நடுத்தர நிலை (வகுப்புகள் 9-10)",
        advanced: "மேல்நிலை (வகுப்புகள் 11-12)",
        hint: "குறிப்பு:",
        correctGuess: "சிறப்பு! நீங்கள் சரியாக கண்டுபிடித்துவிட்டீர்கள்!",
        wrongGuess: "தவறான யூகம்! மீண்டும் முயற்சி செய்யுங்கள்!",
        timeUp: "நேரம் முடிந்துவிட்டது! சரியான சொல்:",
        correctWordWas: "சரியான சொல்:",
        gameOver: "விளையாட்டு முடிந்தது! நீங்கள் அதிக தவறான யூகங்களை செய்துவிட்டீர்கள்.",
        levelComplete: "நிலை முடிந்தது!",
        congratulations: "வாழ்த்துக்கள்!",
        yourScore: "உங்கள் மதிப்பெண்:",
        questionsCorrect: "கேள்விகள் சரி",
        timeBonus: "நேர போனஸ்:",
        totalScore: "மொத்த மதிப்பெண்:",
        restart: "மீண்டும் தொடங்கு",
        nextLevel: "அடுத்த நிலை",
        removeLetter: "எழுத்தை நீக்கு",
        hintsRemaining: "குறிப்புகள்:",
        getHint: "குறிப்பு பெறு",
        guess: "யூகம்",
        next: "அடுத்த கேள்வி",
        question: "கேள்வி",
        of: "இல்",
        timeLeft: "நேரம்:",
        seconds: "வி",
        backToMenu: "மெனுவிற்கு திரும்பு"
    }
};

const GFGWordGame = () => {
    const { addScore } = useUser(); // Get the addScore function from UserContext
    
    const [language, setLanguage] = useState("en");
    const [currentLevel, setCurrentLevel] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [wordData, setWordData] = useState(null);
    const [randomQuestions, setRandomQuestions] = useState([]); // Store randomly selected questions
    const [msg, setMsg] = useState("");
    const [chosenLetters, setChosenLetters] = useState([]);
    const [hints, setHints] = useState(3);
    const [displayWord, setDisplayWord] = useState(false);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [levelComplete, setLevelComplete] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameStartTime, setGameStartTime] = useState(null); // Track game start time
    const [totalGameTime, setTotalGameTime] = useState(0); // Track total time taken

    const t = translations[language];

    // Function to randomly select 10 unique questions from the word pool
    const generateRandomQuestions = (level) => {
        const levelWords = gameWords[level];
        if (!levelWords || levelWords.length === 0) {
            console.error(`No words found for level: ${level}`);
            return [];
        }

        // Create a copy of the array to avoid modifying the original
        const availableWords = [...levelWords];
        const selectedWords = [];

        // Randomly select 10 unique words (or all available if less than 10)
        const questionsCount = Math.min(10, availableWords.length);
        
        for (let i = 0; i < questionsCount; i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            selectedWords.push(availableWords[randomIndex]);
            // Remove the selected word to ensure uniqueness
            availableWords.splice(randomIndex, 1);
        }

        return selectedWords;
    };

    // Timer configuration based on level
    const getTimerDuration = (level) => {
        switch(level) {
            case 'beginner': return 50;
            case 'medium': return 40;
            case 'advanced': return 30;
            default: return 50;
        }
    };

    // Timer effect
    useEffect(() => {
        let interval;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            handleTimeUp();
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    // Game over effect
    useEffect(() => {
        if (wrongGuesses >= 3) {
            setTimerActive(false);
            setMsg(t.gameOver);
            setTimeout(() => {
                restartGameFunction();
            }, 3000);
        }
    }, [wrongGuesses, t.gameOver]);

    const handleTimeUp = () => {
        setTimerActive(false);
        setMsg(t.timeUp);
        setDisplayWord(true);
        triggerSadConfetti();
        setTimeout(() => {
            nextQuestion();
        }, 3000);
    };

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ta" : "en");
    };

    const selectLevel = (level) => {
        setCurrentLevel(level);
        setCurrentQuestionIndex(0);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(true);
        setGameStartTime(Date.now()); // Record game start time
        setTotalGameTime(0);
        
        // Generate random questions for this game session
        const randomlySelectedQuestions = generateRandomQuestions(level);
        setRandomQuestions(randomlySelectedQuestions);
        
        // Start with the first randomly selected question
        if (randomlySelectedQuestions.length > 0) {
            startQuestion(randomlySelectedQuestions, 0);
        }
    };

    const startQuestion = (questionsArray, questionIndex) => {
        if (questionIndex >= questionsArray.length) {
            completeLevelFunction();
            return;
        }

        setWordData(questionsArray[questionIndex]);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(getTimerDuration(currentLevel));
        setTimerActive(true);
    };

    const letterSelectFunction = (letter) => {
        if (!chosenLetters.includes(letter) && timerActive) {
            setChosenLetters([...chosenLetters, letter]);
            if (!wordData.word.includes(letter)) {
                setWrongGuesses(wrongGuesses + 1);
            }
        }
    };

    const hintFunction = () => {
        if (hints > 0 && timerActive) {
            const hiddenLetterIndex = wordData.word
                .split("")
                .findIndex((letter) => !chosenLetters.includes(letter));
            
            if (hiddenLetterIndex !== -1) {
                setChosenLetters([...chosenLetters, wordData.word[hiddenLetterIndex]]);
                setHints(hints - 1);
            }
        }
    };

    const removeCharacterFunction = () => {
        if (timerActive) {
            setChosenLetters(chosenLetters.slice(0, -1));
        }
    };

    const displayLettersFunction = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        return Array.from(letters).map((letter, index) => (
            <button
                key={index}
                onClick={() => letterSelectFunction(letter)}
                disabled={chosenLetters.includes(letter) || !timerActive}
                className={`letter-button ${chosenLetters.includes(letter) ? "selected" : ""}`}
            >
                {letter}
            </button>
        ));
    };

    const checkWordGuessedFunction = () => {
        return wordData.word.split("").every((letter) => chosenLetters.includes(letter));
    };

    const guessFunction = () => {
        if (checkWordGuessedFunction()) {
            setTimerActive(false);
            setMsg(t.correctGuess);
            const timeBonus = Math.max(0, timeLeft * 2);
            const questionScore = 100 + timeBonus;
            setScore(score + questionScore);
            setCorrectAnswers(correctAnswers + 1);
            triggerSuccessConfetti();
            setTimeout(() => {
                nextQuestion();
            }, 3000);
        } else {
            setMsg(t.wrongGuess);
            setDisplayWord(true);
            triggerSadConfetti();
            setTimeout(() => {
                nextQuestion();
            }, 3000);
        }
    };

    const nextQuestion = () => {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        startQuestion(randomQuestions, nextIndex);
    };

    const completeLevelFunction = () => {
        setTimerActive(false);
        setLevelComplete(true);
        setGameStarted(false);
        
        // Calculate total time taken
        const endTime = Date.now();
        const timeTakenInSeconds = Math.round((endTime - gameStartTime) / 1000);
        setTotalGameTime(timeTakenInSeconds);
        
        // Save the score to the user's data
        const actualQuestionsCount = randomQuestions.length;
        const maxPossibleScore = actualQuestionsCount * 100; // Base score without time bonuses
        const actualMaxScore = actualQuestionsCount * (100 + getTimerDuration(currentLevel) * 2); // Including max time bonus
        
        // Save score using the addScore function from UserContext
        addScore(
            'wordGuessGame', // gameType - matches the routing in App.js
            score, // actual score achieved
            actualMaxScore, // maximum possible score with time bonuses
            timeTakenInSeconds, // time taken in seconds
            currentLevel // difficulty level
        );
        
        triggerLevelCompleteConfetti();
    };

    const backToMenuFunction = () => {
        setCurrentLevel(null);
        setCurrentQuestionIndex(0);
        setWordData(null);
        setRandomQuestions([]);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(0);
        setTimerActive(false);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(false);
        setGameStartTime(null);
        setTotalGameTime(0);
    };

    const triggerSuccessConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { 
            startVelocity: 30, 
            spread: 360, 
            ticks: 60, 
            zIndex: 0,
            particleCount: 100
        };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // You'll need to ensure confetti library is imported
            if (typeof confetti !== 'undefined') {
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107']
                }));
                confetti(Object.assign({}, defaults, {
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107']
                }));
            }
        }, 250);
    };

    const triggerSadConfetti = () => {
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 30,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#FF5722', '#F44336', '#E91E63'],
                shapes: ['circle'],
                gravity: 1.2,
                drift: 0
            });
        }
    };

    const triggerLevelCompleteConfetti = () => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            if (typeof confetti !== 'undefined') {
                confetti({
                    particleCount: 100,
                    startVelocity: 30,
                    spread: 360,
                    origin: {
                        x: Math.random(),
                        y: Math.random() - 0.2
                    },
                    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98FB98']
                });
            }
        }, 200);
    };

    const restartGameFunction = () => {
        setCurrentLevel(null);
        setCurrentQuestionIndex(0);
        setWordData(null);
        setRandomQuestions([]);
        setMsg("");
        setChosenLetters([]);
        setHints(3);
        setDisplayWord(false);
        setWrongGuesses(0);
        setTimeLeft(0);
        setTimerActive(false);
        setScore(0);
        setCorrectAnswers(0);
        setLevelComplete(false);
        setGameStarted(false);
        setGameStartTime(null);
        setTotalGameTime(0);
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    // Level Selection Screen
    if (!gameStarted && !levelComplete) {
        return (
            <div className="game-fullscreen">
                <div className="game-container">
                    <div className="header">
                        <button onClick={toggleLanguage} className="language-toggle">
                            {language === "en" ? "தமிழ்" : "English"}
                        </button>
                        <button className="close-button" onClick={handleClose}>&times;</button>
                    </div>
                    
                    <div className="content">
                        <h1>{t.title}</h1>
                        <div className="level-selection">
                            <h2>{t.selectLevel}</h2>
                            <div className="level-buttons">
                                <button className="level-button beginner" onClick={() => selectLevel('beginner')}>
                                    {t.beginner}
                                    <div className="level-details">
                                        ⏱ 50{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                                <button className="level-button medium" onClick={() => selectLevel('medium')}>
                                    {t.medium}
                                    <div className="level-details">
                                        ⏱ 40{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                                <button className="level-button advanced" onClick={() => selectLevel('advanced')}>
                                    {t.advanced}
                                    <div className="level-details">
                                        ⏱ 30{t.seconds} • 10 {t.questionsCorrect.split(' ')[0]}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Level Complete Screen
    if (levelComplete) {
        const finalScore = score;
        const actualQuestionsCount = randomQuestions.length;
        const percentage = (correctAnswers / actualQuestionsCount) * 100;
        
        return (
            <div className="game-fullscreen">
                <div className="game-container">
                    <div className="header">
                        <button onClick={toggleLanguage} className="language-toggle">
                            {language === "en" ? "தமிழ்" : "English"}
                        </button>
                        <button className="close-button" onClick={handleClose}>&times;</button>
                    </div>
                    
                    <div className="content">
                        <div className="level-complete">
                            <h2>{t.levelComplete}</h2>
                            <h1>{t.congratulations}</h1>
                            <div className="score-display">
                                <p>{t.yourScore}</p>
                                <p className="final-score">
                                    🏆 {finalScore} {language === 'en' ? 'points' : 'புள்ளிகள்'}
                                </p>
                                <p>{correctAnswers} {t.questionsCorrect} {actualQuestionsCount}</p>
                                <p>📊 {percentage.toFixed(1)}%</p>
                                <p>⏱ {Math.floor(totalGameTime / 60)}m {totalGameTime % 60}s</p>
                            </div>
                            <div className="completion-buttons">
                                <button onClick={backToMenuFunction} className="back-to-menu-button">
                                    <span className="back-icon">🏠</span>
                                    {t.backToMenu}
                                </button>
                                <button onClick={restartGameFunction} className="restart-button">
                                    {t.restart}
                                </button>
                                {currentLevel !== 'advanced' && (
                                    <button onClick={() => {
                                        const nextLevel = currentLevel === 'beginner' ? 'medium' : 'advanced';
                                        selectLevel(nextLevel);
                                    }} className="next-button">
                                        {t.nextLevel}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Game Screen
    const actualQuestionsCount = randomQuestions.length;
    const progressPercentage = ((currentQuestionIndex + 1) / actualQuestionsCount) * 100;

    return (
        <div className="game-fullscreen">
            <div className="game-container">
                <div className="header">
                    <button onClick={toggleLanguage} className="language-toggle">
                        {language === "en" ? "தமிழ்" : "English"}
                    </button>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                
                <div className="content">
                    <h1>{t.title}</h1>
                    
                    <div className="game-status">
                        <div className="level-info">
                            {currentLevel === 'beginner' && t.beginner}
                            {currentLevel === 'medium' && t.medium}
                            {currentLevel === 'advanced' && t.advanced}
                        </div>
                        <div className="question-counter">
                            {t.question} {currentQuestionIndex + 1} {t.of} {actualQuestionsCount}
                        </div>
                        <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                            {t.timeLeft} {timeLeft}{t.seconds}
                        </div>
                    </div>

                    <div className="progress-container">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    <div className="score-display-game">
                        {t.yourScore} {score} | ✅ {correctAnswers}/{actualQuestionsCount}
                    </div>

                    <div className="word-container">
                        {Array.from(wordData.word).map((letter, index) => (
                            <div key={index} className={`letter ${chosenLetters.includes(letter) ? "visible" : ""}`}>
                                {chosenLetters.includes(letter) ? letter : ""}
                            </div>
                        ))}
                    </div>
                    
                    <p className="word-description">{t.hint} {wordData.description[language]}</p>
                    
                    {msg && (
                        <div className={`message ${msg === t.correctGuess ? 'success' : 'error'}`}>
                            <p>{msg}</p>
                            {displayWord && (
                                <p className="correct-word">
                                    {t.correctWordWas} <span>{wordData.word}</span>
                                </p>
                            )}
                        </div>
                    )}
                    
                    <div className="game-actions">
                        <div className="control-buttons">
                            <button onClick={backToMenuFunction} className="back-to-menu-button">
                                <span className="back-icon">🏠</span>
                                {t.backToMenu}
                            </button>
                            <button onClick={restartGameFunction} className="restart-button">{t.restart}</button>
                            <button onClick={removeCharacterFunction} disabled={!chosenLetters.length || !timerActive} className="remove-button">
                                {t.removeLetter}
                            </button>
                        </div>
                        
                        <div className="letter-selection">
                            {displayLettersFunction()}
                        </div>
                        
                        <div className="hints-section">
                            <span>{t.hintsRemaining} {hints}</span>
                            <button onClick={hintFunction} disabled={hints === 0 || !timerActive} className="hint-button">
                                {t.getHint}
                            </button>
                        </div>
                        
                        {!msg && (
                            <button onClick={guessFunction} disabled={!chosenLetters.length || !timerActive} className="guess-button">
                                {t.guess}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GFGWordGame;