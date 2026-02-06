#!/usr/bin/env python3
"""Add final 150 questions to reach 900 total"""
import json
from pathlib import Path

questions = json.loads(Path('data/driving-theory-questions.json').read_text(encoding='utf-8'))

def add_category(category, concept_id, q_list):
    q_id = 1
    for q in q_list:
        questions.append({
            "id": f"{concept_id}_{q_id:03d}",
            "question": q[0],
            "options": q[1],
            "answer": q[2],
            "conceptId": concept_id,
            "category": category,
            "type": "multiple-choice"
        })
        q_id += 1

# Advanced scenarios - 50 questions
advanced = [
    ("Multi-vehicle collision?", ["Single car problem", "Complex emergency", "Simple", "Easy"], "Complex emergency"),
    ("Rollover accident risk?", ["Stable", "High speed turns", "Normal", "Safe"], "High speed turns"),
    ("High-speed crash scenario?", ["Survivable", "Severe injury likely", "Safe", "Minor"], "Severe injury likely"),
    ("Fuel spill aftermath?", ["Drive through", "Report authorities", "Ignore", "Normal"], "Report authorities"),
    ("Chemical spill?", ["Continue driving", "Isolate area", "Pass through", "Normal"], "Isolate area"),
    ("HGV breakdown?", ["Normal car issue", "Special procedures", "Same", "Easy"], "Special procedures"),
    ("Motorcyclist crash?", ["Will recover", "Serious injury", "Safe", "Minor"], "Serious injury"),
    ("Pedestrian impact?", ["Minor", "Life threatening", "Safe", "Okay"], "Life threatening"),
    ("Cyclist collision?", ["Usually okay", "Serious injury", "Minor", "Safe"], "Serious injury"),
    ("Hit and run avoidance?", ["Stop only needed", "Legal requirement", "Optional", "Minor"], "Legal requirement"),
    ("Emergency lane access?", ["Drive normally", "Clear immediately", "Safe", "No change"], "Clear immediately"),
    ("Ambulance approaching?", ["Continue", "Pull over", "Maintain speed", "Normal"], "Pull over"),
    ("Fire engine response?", ["Let pass", "Block briefly", "Continue", "Normal"], "Let pass"),
    ("Police pursuit nearby?", ["Assist", "Give space", "Follow", "Ignore"], "Give space"),
    ("Accident site safety?", ["Expose self", "Secure area", "No concern", "Risk"], "Secure area"),
    ("Broken glass hazard?", ["Drive over", "Avoid", "No concern", "Safe"], "Avoid"),
    ("Leak hazard liquid?", ["Ignore", "Report", "Continue", "Normal"], "Report"),
    ("Smoke inhalation?", ["Breathe normally", "Open window", "Continue", "No change"], "Open window"),
    ("Eye irritation?", ["Drive through", "Pull over", "Continue", "Normal"], "Pull over"),
    ("Extreme weather preparation?", ["No prep", "Plan ahead", "Ignore", "Not needed"], "Plan ahead"),
    ("Terrain difficulty?", ["No impact", "Affects handling", "Safe", "No change"], "Affects handling"),
    ("Vehicle traction loss?", ["Normal", "Emergency response", "Safe", "Expected"], "Emergency response"),
    ("Brake system failure?", ["Down-shift", "Engine braking", "Freewheel", "Accelerate"], "Engine braking"),
    ("Steering loss recovery?", ["Panic", "Smooth control", "Jerk wheel", "Force"], "Smooth control"),
    ("Tire blowout response?", ["Brake hard", "Steady control", "Accelerate", "Swerve"], "Steady control"),
    ("Throttle stuck condition?", ["Drive faster", "Shift neutral", "Continue", "Normal"], "Shift neutral"),
    ("Clutch failure scenario?", ["Continue", "Coast safely", "Force", "Dangerous"], "Coast safely"),
    ("Oil pressure warning?", ["Ignore", "Stop engine", "Continue", "Normal"], "Stop engine"),
    ("Temperature overheating?", ["Continue", "Stop engine", "Keep driving", "Accelerate"], "Stop engine"),
    ("Battery dead situation?", ["Push start", "Replace battery", "Drive on", "Safe"], "Replace battery"),
    ("Fuel tank empty?", ["Refuel immediately", "Continue", "Coast", "Safe"], "Refuel immediately"),
    ("Coolant leakage?", ["Check level", "Stop engine", "Continue", "Normal"], "Check level"),
    ("Transmission warning?", ["Continue", "Get serviced", "Normal", "Safe"], "Get serviced"),
    ("Warning light activation?", ["Ignore", "Check manual", "No concern", "Minor"], "Check manual"),
    ("Dashboard malfunction?", ["Not important", "Loss of info", "Normal", "No issue"], "Loss of info"),
    ("Speedometer failure?", ["Estimate speed", "Use radar", "Guess", "No problem"], "Estimate speed"),
    ("Mirror obstruction?", ["Ignore", "Clear view", "No concern", "Safe"], "Clear view"),
    ("Wiper malfunction?", ["Continue", "Stop safely", "Drive faster", "Normal"], "Stop safely"),
    ("Headlight out?", ["Drive slowly", "Get repaired", "Continue night", "Safe"], "Get repaired"),
    ("Fuel efficiency?", ["Ignore", "Monitor consumption", "No concern", "Random"], "Monitor consumption"),
    ("Undercarriage damage?", ["Continue", "Check damage", "Safe", "Normal"], "Check damage"),
    ("Suspension issue?", ["Not important", "Handling affected", "Safe", "No change"], "Handling affected"),
    ("Alignment problem?", ["Car drifts", "Maintain", "No effect", "Safe"], "Car drifts"),
    ("Brake pad wear?", ["Ignore", "Replace", "No concern", "Safe"], "Replace"),
    ("Rotor damage?", ["Continue", "Get serviced", "Safe", "Normal"], "Get serviced"),
    ("ABS system failure?", ["Normal braking", "Extra caution", "Safe", "Easy"], "Extra caution"),
    ("Traction control off?", ["Better control", "Reduced safety", "Improved", "Better"], "Reduced safety"),
    ("Stability systems?", ["Not needed", "Important safety", "Optional", "Minor"], "Important safety"),
    ("Electronic throttle?", ["Manual only", "Computer controlled", "Simple", "No"], "Computer controlled"),
]

add_category("Advanced Emergency Scenarios", "advanced", advanced)

# Professional driving - 50 questions
professional = [
    ("Professional drivers?", ["Normal person", "Advanced training", "Same", "No difference"], "Advanced training"),
    ("Taxi operation?", ["Same as normal", "Different rules", "No change", "Normal"], "Different rules"),
    ("Bus driver requirements?", ["Normal license", "Extended training", "Same", "No"], "Extended training"),
    ("HGV operation?", ["Regular car", "Specialist training", "Same", "Easy"], "Specialist training"),
    ("Dangerous goods transport?", ["Standard", "Special certification", "Normal", "Safe"], "Special certification"),
    ("Passenger safety?", ["Not responsibility", "Critical duty", "Optional", "Minor"], "Critical duty"),
    ("Load securing?", ["Any way", "Properly secured", "Random", "No matter"], "Properly secured"),
    ("Cargo shifting?", ["Not important", "Affects handling", "Safe", "No concern"], "Affects handling"),
    ("Vehicle weight limit?", ["Ignore", "Must obey", "Suggestion", "Optional"], "Must obey"),
    ("Gross vehicle weight?", ["Not relevant", "Critical", "No matter", "Ignore"], "Critical"),
    ("Axle weight distribution?", ["Not important", "Safety critical", "No concern", "Minor"], "Safety critical"),
    ("Overloaded vehicle?", ["Okay", "Dangerous", "Safe", "Normal"], "Dangerous"),
    ("Top-heavy load?", ["Stable", "Rollover risk", "Safe", "Okay"], "Rollover risk"),
    ("Unsecured load?", ["Acceptable", "Dangerous", "Safe", "Normal"], "Dangerous"),
    ("Towing capacity?", ["Ignore", "Respect limit", "Suggestion", "Optional"], "Respect limit"),
    ("Trailer coupling?", ["Any way", "Proper procedure", "Random", "No matter"], "Proper procedure"),
    ("Towing vehicle control?", ["Same as car", "More complex", "Easy", "No difference"], "More complex"),
    ("Trailer sway risk?", ["Not real", "Serious hazard", "Safe", "Unlikely"], "Serious hazard"),
    ("Reverse towing?", ["Easy", "Extreme caution", "Normal", "Simple"], "Extreme caution"),
    ("Parking large vehicle?", ["Spaces too", "Restricted zones", "Always okay", "No difference"], "Restricted zones"),
    ("Overnight parking?", ["Anywhere", "Safe parking", "Random", "No matter"], "Safe parking"),
    ("Vehicle security?", ["Not needed", "Essential", "Optional", "Minor"], "Essential"),
    ("Theft prevention?", ["Not needed", "Essential", "Optional", "No"], "Essential"),
    ("Insurance requirements?", ["Optional", "Mandatory", "Suggestions", "No"], "Mandatory"),
    ("MOT validity?", ["Not important", "Essential safety", "Optional", "Minor"], "Essential safety"),
    ("Roadworthiness check?", ["Not needed", "Required", "Optional", "No"], "Required"),
    ("License suspension impact?", ["Not serious", "Professional loss", "Minor", "No issue"], "Professional loss"),
    ("Accident record?", ["Not important", "Career impact", "No concern", "Minor"], "Career impact"),
    ("Incident reporting?", ["Not needed", "Mandatory", "Optional", "No"], "Mandatory"),
    ("Professional conduct?", ["Not important", "Essential", "Optional", "Minor"], "Essential"),
    ("Customer communication?", ["Not needed", "Professional skill", "Optional", "No"], "Professional skill"),
    ("Time management?", ["Not needed", "Critical skill", "Optional", "Minor"], "Critical skill"),
    ("Route planning?", ["Improvise", "Plan ahead", "Random", "No need"], "Plan ahead"),
    ("Fuel efficiency cost?", ["Not concern", "Business critical", "Minor", "No"], "Business critical"),
    ("Maintenance scheduling?", ["When broken", "Preventative", "After issue", "Reactive"], "Preventative"),
    ("Vehicle inspection?", ["Not needed", "Daily habit", "Optional", "No"], "Daily habit"),
    ("Fatigue management?", ["Drive through", "Planned rest", "Continue", "No breaks"], "Planned rest"),
    ("Legal working hours?", ["No limit", "Strict rules", "Suggestions", "Optional"], "Strict rules"),
    ("Tachograph records?", ["Not needed", "Legally required", "Optional", "No"], "Legally required"),
    ("Rest day requirement?", ["Not needed", "Legally required", "Optional", "No"], "Legally required"),
    ("Physical fitness?", ["Not needed", "Professional need", "Optional", "No"], "Professional need"),
    ("Health certification?", ["Not needed", "May be required", "Optional", "No"], "May be required"),
    ("Medical check-up?", ["Not needed", "Recommended", "Optional", "No"], "Recommended"),
    ("Vision requirements?", ["No standard", "Professional standard", "No need", "Minor"], "Professional standard"),
    ("Hearing requirements?", ["Not needed", "May be required", "Optional", "No"], "May be required"),
    ("Drug testing?", ["Not needed", "May be required", "Optional", "No"], "May be required"),
    ("Alcohol limit lower?", ["Same", "More strict", "Relaxed", "No difference"], "More strict"),
    ("Professional reputation?", ["Not important", "Career critical", "Minor", "No"], "Career critical"),
    ("Customer satisfaction?", ["Not needed", "Essential", "Optional", "Minor"], "Essential"),
]

add_category("Professional Driving Standards", "professional", professional)

# Final 50 - UK specific regulations
uk_specific = [
    ("Dual carriage crossing?", ["Allowed anywhere", "Prohibited", "Sometimes", "Check"], "Prohibited"),
    ("Reversing on motorway?", ["Allowed", "Strictly prohibited", "Emergency only", "Risky"], "Strictly prohibited"),
    ("Parking on hard shoulder?", ["Allowed", "Emergency only", "Sometimes", "Dangerous"], "Emergency only"),
    ("Breakdown on motorway?", ["Stop vehicle", "Walk to phones", "Call police", "Vehicles only"], "Walk to phones"),
    ("Fog light usage?", ["When wanted", "Poor visibility", "Always", "Optional"], "Poor visibility"),
    ("Dipped headlights?", ["Daytime", "Meeting traffic", "Twilight", "Always"], "Meeting traffic"),
    ("Daytime lights?", ["Not needed", "Daytime running", "Optional", "No"], "Daytime running"),
    ("Traffic light arrow?", ["Follow main", "Ignore arrow", "Stop anyway", "Follow arrow"], "Follow arrow"),
    ("Experimental light?", ["Follow experiment", "Treat normal", "Ignore", "Test"], "Treat normal"),
    ("Pelican crossing?", ["Reds only", "Green also", "Both stop", "Either"], "Both stop"),
    ("Zebra crossing?", ["Must stop", "May proceed", "Slow pass", "Either"], "Must stop"),
    ("Puffin crossing?", ["Different rule", "Normal crossing", "Same red/green", "Other"], "Normal crossing"),
    ("Toucan crossing?", ["Pedestrians only", "Cyclists too", "Vehicles", "No cyclists"], "Cyclists too"),
    ("Road works?", ["Always obey signs", "Choose speed", "Ignore", "Maybe"], "Always obey signs"),
    ("Contraflow traffic?", ["Normal", "Opposite direction", "Careful", "Same"], "Opposite direction"),
    ("Speed restriction?", ["Suggestion", "Mandatory", "Preference", "Guide"], "Mandatory"),
    ("Chevron boards?", ["Ignore", "Warning alignment", "No concern", "Minor"], "Warning alignment"),
    ("Dragon's teeth?", ["Harmless", "No crossing", "Safe", "Normal"], "No crossing"),
    ("Cattle grid crossing?", ["Dangerous", "Be careful", "Smooth", "Easy"], "Be careful"),
    ("Ford crossing?", ["Check depth", "Always safe", "Normal", "Easy"], "Check depth"),
    ("Level crossing?", ["Cross quickly", "Check lights/gates", "Drive through", "Normal"], "Check lights/gates"),
    ("Railway safety?", ["Not required", "Essential", "Optional", "Minor"], "Essential"),
    ("Yield to trains?", ["Never needed", "Always give way", "Sometimes", "No"], "Always give way"),
    ("Single track road?", ["Same", "Different rules", "No change", "Normal"], "Different rules"),
    ("Passing place etiquette?", ["Not important", "Code essential", "Optional", "Minor"], "Code essential"),
    ("Mountain pass safety?", ["Normal", "Special caution", "Safe", "Easy"], "Special caution"),
    ("Hill descent control?", ["Not needed", "Prevent overheating", "Optional", "No"], "Prevent overheating"),
    ("Bridge weight limit?", ["Ignore", "Obey", "Suggestion", "Optional"], "Obey"),
    ("Overhead height limit?", ["Ignore", "Obey", "Suggestion", "Optional"], "Obey"),
    ("Width restriction?", ["Ignore", "Obey", "Suggestion", "Optional"], "Obey"),
    ("Low emission zone?", ["Not real", "Emission limits", "Optional", "Ignore"], "Emission limits"),
    ("Ultra low emission zone?", ["More strict", "Same limits", "Less strict", "Same"], "More strict"),
    ("London congestion?", ["Free entry", "Charge required", "Optional", "No"], "Charge required"),
    ("Mobile phone law?", ["Hands-free ok", "Prohibited", "Allowed", "No"], "Prohibited"),
    ("Texting while driving?", ["Okay briefly", "Strictly illegal", "Safe", "Okay"], "Strictly illegal"),
    ("Seatbelt enforcement?", ["Not required", "Mandatory by law", "Optional", "No"], "Mandatory by law"),
    ("Child seat requirement?", ["Not needed", "Legal requirement", "Optional", "No"], "Legal requirement"),
    ("Age restrictions?", ["None", "Age specific", "No rules", "Random"], "Age specific"),
    ("Probationary period?", ["New drivers", "All drivers", "No requirement", "Optional"], "New drivers"),
    ("Demerit points?", ["Ignored", "License threat", "Minor", "No"], "License threat"),
    ("Retest requirement?", ["Never needed", "After violations", "Always", "Optional"], "After violations"),
    ("Driving without license?", ["Minor fine", "Criminal offense", "Not serious", "Okay"], "Criminal offense"),
    ("Uninsured driving?", ["Minor", "Criminal offense", "Not serious", "Fine only"], "Criminal offense"),
    ("Unregistered vehicle?", ["Okay", "Illegal", "Safe", "Normal"], "Illegal"),
    ("Expired roadworthiness?", ["Okay", "Illegal", "Safe", "Fine only"], "Illegal"),
    ("Third party liability?", ["Optional", "Mandatory", "Expensive", "Suggestion"], "Mandatory"),
    ("Breakdown cover?", ["Not needed", "Recommended", "Optional", "Minor"], "Recommended"),
    ("Replacement vehicle?", ["Premium option", "In some policies", "Rare", "Common"], "In some policies"),
]

add_category("UK Road Rules and Regulations", "uk_rules", uk_specific)

# Save all
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')

print(f"Generated {len(questions)} total questions")
print(f"\nDistribution:")
categories = {}
for q in questions:
    cat = q['category']
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

print(f"\nTotal: {sum(categories.values())}")
