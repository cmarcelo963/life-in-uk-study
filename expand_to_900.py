#!/usr/bin/env python3
"""Expand to 900 driving theory questions"""
import json
from pathlib import Path

# Load existing questions
existing = json.loads(Path('data/driving-theory-questions.json').read_text(encoding='utf-8'))

questions = existing.copy()

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
            "type": q[3] if len(q) > 3 else "multiple-choice"
        })
        q_id += 1

# SAFETY & SEATBELTS - ~60
safety = [
    ("Seatbelt before driving?", ["Optional", "Compulsory", "Recommended", "Child only"], "Compulsory"),
    ("Seatbelt prevents injury?", ["No", "Yes", "Sometimes", "Rarely"], "Yes"),
    ("Child safety seats?", ["Optional", "Required by law", "Recommended", "Suggestions"], "Required by law"),
    ("Child seat until age?", ["5", "10", "12", "16"], "12"),
    ("Child front seat airbag?", ["Always safe", "Can injure", "Required", "Optional"], "Can injure"),
    ("Airbag deployment speed?", ["Slow", "200 mph", "50 mph", "10 mph"], "200 mph"),
    ("Headrest height correct?", ["Below head", "Level with head", "Above head", "Doesn't matter"], "Level with head"),
    ("Head restraint purpose?", ["Comfort", "Whiplash protection", "Design", "No purpose"], "Whiplash protection"),
    ("Three-point seatbelt?", ["Better protection", "Normal seatbelt", "Across lap", "Shoulder only"], "Better protection"),
    ("Pregnancy seatbelt?", ["Don't wear", "Wear normally", "Across lap", "Remove"], "Wear normally"),
    ("Medical conditions seatbelt?", ["Ignore", "Check doctor", "Always wear", "Never wear"], "Check doctor"),
    ("Seatbelt in taxi?", ["Optional", "Not available", "Compulsory if fitted", "Never"], "Compulsory if fitted"),
    ("Back seat seatbelts?", ["Optional", "Required UK", "Not needed", "Children only"], "Required UK"),
    ("Disabled person seatbelt?", ["Always required", "Check regulations", "Never required", "Optional"], "Check regulations"),
    ("Emergency stop seatbelt?", ["Protect from impact", "No benefit", "Optional", "Uncomfortable"], "Protect from impact"),
    ("Child booster seat?", ["Optional", "Legal requirement", "Uncomfortable", "Not needed"], "Legal requirement"),
    ("Safety feature ABS?", ["Luxury", "Prevents locking", "Improves speed", "Reduces grip"], "Prevents locking"),
    ("Electronic stability?", ["Helps stability", "Reduces grip", "Increases speed", "No benefit"], "Helps stability"),
    ("Traction control purpose?", ["Improves speed", "Prevents wheel spin", "Reduces safety", "Luxury"], "Prevents wheel spin"),
    ("Rollover protection?", ["Safety feature", "Luxury item", "No benefit", "Weight increase"], "Safety feature"),
    ("Daytime running lights?", ["Better visibility", "No benefit", "Save fuel", "Luxury"], "Better visibility"),
    ("Crumple zones purpose?", ["Reduce impact", "Protect passengers", "All of above", "Aesthetic"], "All of above"),
    ("Safety cage strength?", ["No benefit", "Protect occupants", "Luxury", "Looks good"], "Protect occupants"),
    ("Door locks safety?", ["No benefit", "Prevent ejection", "Emergency unlock", "All important"], "All important"),
    ("Emergency escape?", ["Break window", "Use door handle", "Emergency button", "Use seat eject"], "Emergency button"),
    ("Fire extinguisher?", ["Always carry", "Not needed", "In boot", "Optional"], "Not needed"),
    ("First aid kit?", ["Recommended", "Not needed", "Optional", "Never"], "Recommended"),
    ("Hazard lights?", ["Breakdown", "Emergency", "Lane merging", "All situations"], "All situations"),
    ("Breakdown triangle?", ["Carry always", "Optional", "At home", "Only motorway"], "Carry always"),
    ("Fluorescent vest?", ["Optional", "Recommended", "In boot", "Always carry"], "Recommended"),
    ("Eye test requirements?", ["Not needed", "Required for license", "Every 5 years", "Never"], "Required for license"),
    ("Hearing test?", ["Required", "Not required", "Optional", "Recommended"], "Not required"),
    ("Reaction test ability?", ["No requirement", "Part of test", "Optional", "Rarely checked"], "Part of test"),
    ("Fatigue danger?", ["No risk", "Reduced ability", "Improved focus", "No difference"], "Reduced ability"),
    ("Medication effects?", ["Check label", "No effect", "Safe to drive", "Ignore"], "Check label"),
    ("Alcohol effects?", ["No effect", "Impaired judgment", "Better reaction", "Improved safety"], "Impaired judgment"),
    ("Red eyes fatigue?", ["Normal", "Warning sign", "No meaning", "Good focus"], "Warning sign"),
    ("Yawning frequent?", ["Just tired", "Warning sign", "Normal", "No concern"], "Warning sign"),
    ("Glazed eyes fatigue?", ["Normal", "Warning sign", "Focused", "Clear"], "Warning sign"),
    ("Drowsiness danger?", ["Minimal", "Very dangerous", "No risk", "Helps focus"], "Very dangerous"),
    ("Stopping when tired?", ["Drive on", "Take break", "Cold shower", "Slower speed"], "Take break"),
    ("Sleep requirements?", ["4 hours", "6 hours", "8+ hours", "As little"], "8+ hours"),
]

add_category("Safety and Seatbelts", "safety", safety)

# ALCOHOL & DRUGS & FITNESS - ~60
alcohol = [
    ("Alcohol legal limit?", ["200 mg", "35 micrograms", "50 mg", "100 mg"], "35 micrograms"),
    ("Scotland alcohol limit?", ["20 micrograms", "22 micrograms", "50 micrograms", "80 mg"], "22 micrograms"),
    ("Alcohol effects?", ["Improved reaction", "Reduced judgment", "Better focus", "No effect"], "Reduced judgment"),
    ("One drink effects?", ["Impaired", "No problem", "Improved", "No change"], "Impaired"),
    ("Alcohol time to clear?", ["Instantly", "1 unit per hour", "30 minutes", "Varies person"], "1 unit per hour"),
    ("Alcohol confidence?", ["Accurate", "Overconfidence", "No effect", "Reduced"], "Overconfidence"),
    ("Breath test refusal?", ["No penalty", "Criminal offense", "Fine only", "Minor issue"], "Criminal offense"),
    ("Breath test accuracy?", ["Unreliable", "Highly accurate", "50-50", "Random"], "Highly accurate"),
    ("Blood test vs breath?", ["Same result", "More accurate", "Less accurate", "No difference"], "Same result"),
    ("Drug driving penalties?", ["None", "Same as alcohol", "Worse penalties", "Minor"], "Same as alcohol"),
    ("Cannabis driving?", ["Safe if short time", "Dangerous", "No problem", "Okay occasionally"], "Dangerous"),
    ("Cocaine effects?", ["Improved focus", "Dangerously unpredictable", "Better reaction", "No effect"], "Dangerously unpredictable"),
    ("Medication drowsiness?", ["Check label", "Safe to drive", "No effect", "Ignore warning"], "Check label"),
    ("Prescription drug effects?", ["No effect", "Check label", "Safe all", "Ignore"], "Check label"),
    ("Diabetes hypoglycemia?", ["No problem", "Can impair driving", "Safe to drive", "No concern"], "Can impair driving"),
    ("Epilepsy seizure risk?", ["No risk", "Must check fitness", "Managed easily", "No concern"], "Must check fitness"),
    ("Fitness form?", ["Not needed", "Medical assessment", "Optional", "Rarely"], "Medical assessment"),
    ("Fainting while driving?", ["No risk", "Lose control", "Minor issue", "Safe"], "Lose control"),
    ("Heart condition?", ["No issue", "Requires assessment", "Always safe", "Never concern"], "Requires assessment"),
    ("Vision requirements?", ["20/20 only", "Corrected 6/12", "No requirement", "Minimal"], "Corrected 6/12"),
    ("Glasses while driving?", ["Optional", "Legally required", "Recommended", "Suggested"], "Legally required"),
    ("Contact lenses?", ["Safe to drive", "Check regulations", "Not allowed", "Risky"], "Check regulations"),
    ("Colour blindness?", ["Cannot drive", "Can drive normally", "Needs assessment", "Minor issue"], "Can drive normally"),
    ("Tunnel vision condition?", ["No problem", "Reduces vision", "No effect", "Improves"], "Reduces vision"),
    ("Night blindness?", ["Minor issue", "Cannot drive night", "No problem", "Improves"], "Cannot drive night"),
    ("Double vision?", ["No problem", "Cannot drive", "Manageable", "Minor"], "Cannot drive"),
    ("Joint stiffness?", ["No issue", "Check controls", "No effect", "Improves driving"], "Check controls"),
    ("Arthritis limiting?", ["No problem", "Can limit control", "No effect", "Helps"], "Can limit control"),
    ("Back problems?", ["Improve with driving", "Can worsen", "No effect", "Safe"], "Can worsen"),
    ("Leg weakness?", ["No issue", "Can affect pedals", "No effect", "Better control"], "Can affect pedals"),
    ("One arm driving?", ["Impossible", "Possible with adaptation", "Easy", "No problem"], "Possible with adaptation"),
    ("One leg driving?", ["Impossible", "Possible with adaptation", "Easy", "Always safe"], "Possible with adaptation"),
    ("Wheelchair access vehicle?", ["Never", "With modifications", "Always", "Rarely"], "With modifications"),
    ("Medical check-up?", ["Not needed", "Regular checks needed", "Optional", "Once only"], "Regular checks needed"),
    ("Doctor communication?", ["No need", "Tell doctor/DVLA", "Optional", "Private matter"], "Tell doctor/DVLA"),
    ("License conditions?", ["No conditions", "May have restrictions", "All can drive", "Vary"], "May have restrictions"),
    ("Insulin user driving?", ["Cannot drive", "Can with checks", "Always okay", "Never safe"], "Can with checks"),
    ("Anxiety while driving?", ["No issue", "Can impair judgment", "Helps focus", "Minor"], "Can impair judgment"),
    ("Depression effects?", ["No effect", "Can affect concentration", "Helps driving", "No concern"], "Can affect concentration"),
    ("Stress level high?", ["No concern", "Affects judgment", "Improves focus", "No effect"], "Affects judgment"),
]

add_category("Alcohol, Drugs and Fitness to Drive", "alcohol", alcohol)

# DOCUMENTS, INSURANCE & ENFORCEMENT - ~60
documents = [
    ("Driving license UK?", ["No requirement", "Must carry", "Optional", "Not needed"], "Must carry"),
    ("License expire when?", ["5 years", "Until age", "10 years", "Never"], "Until age"),
    ("License categories?", ["Not exist", "Different types", "All same", "No categories"], "Different types"),
    ("Category B license?", ["Motorcycles", "Cars", "Lorries", "Buses"], "Cars"),
    ("Provisional license?", ["Full driving rights", "Learner only", "Some restrictions", "No restrictions"], "Learner only"),
    ("Full license requirement?", ["Pass test", "Age only", "Money", "No requirement"], "Pass test"),
    ("Insurance third party?", ["Covers injury", "Covers damage", "Your damage", "Other vehicle damage"], "Other vehicle damage"),
    ("Comprehensive insurance?", ["Third party plus", "Your damage", "All damage", "Police fine"], "Your damage"),
    ("Uninsured driving?", ["Fine only", "Criminal offense", "Points", "Minor"], "Criminal offense"),
    ("No insurance penalties?", ["Fine", "Points", "License suspension", "All penalties"], "All penalties"),
    ("MOT requirement?", ["Never needed", "After 3 years", "Yearly", "Optional"], "After 3 years"),
    ("MOT failure?", ["Can still drive", "Cannot drive", "Conditional", "Check purposes"], "Cannot drive"),
    ("Vehicle registration?", ["Not needed", "DVLA registration", "Optional", "Police only"], "DVLA registration"),
    ("Reg plate standards?", ["Any format", "GB identifier", "Color choice", "No standard"], "GB identifier"),
    ("Tax disc requirement?", ["Always needed", "Digital only now", "Optional", "Never"], "Digital only now"),
    ("No vehicle tax?", ["Minor fine", "Criminal offense", "No penalty", "Warning"], "Criminal offense"),
    ("Emission standards?", ["No limit", "Must meet", "Optional", "No testing"], "Must meet"),
    ("Pollution control?", ["Not required", "Part of MOT", "Optional", "Private"], "Part of MOT"),
    ("Breakdown insurance?", ["Compulsory", "Optional", "Required by law", "Not needed"], "Optional"),
    ("Breakdown cover?", ["Roadside help", "Full replacement", "Tow only", "No help"], "Roadside help"),
    ("Mobile phone law?", ["No law", "Hands-free allowed", "Handheld illegal", "Not checked"], "Handheld illegal"),
    ("Parking restrictions?", ["Ignore if busy", "Always obey", "Police discretion", "Minor fine"], "Always obey"),
    ("Parking fine issued?", ["Parking ticket", "Penalty charge", "Fine only", "Warning"], "Penalty charge"),
    ("Speeding fine?", ["No fine", "Automatic", "Police discretion", "Optional"], "Automatic"),
    ("Fixed penalty?", ["No option", "Payment option", "Court only", "Police choice"], "Payment option"),
    ("Speed camera evidence?", ["Not admissible", "Photo evidence", "Must witness", "No proof"], "Photo evidence"),
    ("Penalty points?", ["No system", "Affect license", "License ban", "No meaning"], "Affect license"),
    ("Disqualification?", ["No right", "After points", "After ban", "DVLA decision"], "After points"),
    ("License ban length?", ["3 months", "Varies by offense", "1 month", "No ban"], "Varies by offense"),
    ("Court appearance?", ["Not necessary", "May be required", "Always", "Never"], "May be required"),
    ("Police stop power?", ["Cannot stop", "Random checks", "Suspect only", "Never"], "Random checks"),
    ("Breath test refusal?", ["No penalty", "Criminal offense", "Fine only", "Minor"], "Criminal offense"),
    ("Search vehicle?", ["No right", "With consent/warrant", "Always allowed", "Never"], "With consent/warrant"),
    ("Identity requirements?", ["Optional", "Must provide", "Police only", "License card"], "Must provide"),
    ("Name/address important?", ["Optional", "Must provide", "Nice to", "No need"], "Must provide"),
    ("Police discretion?", ["No discretion", "Some discretion", "Full discretion", "No variation"], "Some discretion"),
    ("Accident reporting?", ["Optional", "To police immediately", "Within 30 days", "Never"], "To police immediately"),
    ("Hit and run?", ["No penalty", "Criminal offense", "Minor fine", "Warning"], "Criminal offense"),
    ("Insurance claim?", ["Instant", "Within limits", "Depends terms", "Always pay"], "Depends terms"),
    ("Third party claim?", ["From driver", "From police", "From insurer", "No claim"], "From insurer"),
    ("No-win fee?", ["Prohibited", "Allowed", "Sometimes", "Depends"], "Prohibited"),
]

add_category("Documents, Insurance and Enforcement", "documents", documents)

# BREAKDOWNS & INCIDENTS - ~60
breakdown = [
    ("Vehicle breakdown?", ["Continue driving", "Find safe place", "Abandon car", "Stay in lane"], "Find safe place"),
    ("Hazard lights immediate?", ["Optional", "First priority", "Later", "Not needed"], "First priority"),
    ("Breakdown on motorway?", ["Stop in lane", "Hard shoulder", "Central reserve", "Exit"], "Hard shoulder"),
    ("Hard shoulder safety?", ["Stand in traffic", "Stand away traffic", "In vehicle", "Wave cars"], "Stand away traffic"),
    ("Emergency phone location?", ["Anywhere", "Every 1-2 miles", "As needed", "Rare"], "Every 1-2 miles"),
    ("Breakdown triangle?", ["Not needed", "Should place", "Behind car", "Inside car"], "Should place"),
    ("Triangle distance?", ["No distance", "50m behind", "100m ahead", "Varies road"], "50m behind"),
    ("Fluorescent vest important?", ["No", "Essential visibility", "Optional", "Never"], "Essential visibility"),
    ("Children safe?", ["Leave in vehicle", "Seatbelts on", "Out of traffic", "Away vehicle"], "Out of traffic"),
    ("Pets in breakdown?", ["Stay in car", "Lock inside", "Out of traffic", "Keep cool"], "Out of traffic"),
    ("Overheating engine?", ["Drive on", "Stop immediately", "Keep warm", "Continue carefully"], "Stop immediately"),
    ("Steam from hood?", ["Normal", "Engine overheat", "Safe", "Cosmetic"], "Engine overheat"),
    ("Coolant check?", ["Immediately hot", "When cool", "Any time", "Never"], "When cool"),
    ("Fluid leak?", ["Ignore", "Check source", "Keep driving", "No concern"], "Check source"),
    ("Oil pressure warning?", ["Continue", "Stop immediately", "Minor issue", "No problem"], "Stop immediately"),
    ("Battery flat?", ["Push start", "Jump leads", "Wait", "New battery"], "Jump leads"),
    ("Jump lead procedure?", ["Positive same", "Black opposite", "Both positive", "Random"], "Black opposite"),
    ("Tyre puncture?", ["Drive to garage", "Change immediately", "Use sealant", "Temporary fix"], "Temporary fix"),
    ("Spare tyre condition?", ["Rarely check", "Check regularly", "Never check", "Unnecessary"], "Check regularly"),
    ("Jacking safely?", ["On soft ground", "Flat hard surface", "Any ground", "Not needed"], "Flat hard surface"),
    ("Wheel nuts removal?", ["Before lift", "After lift", "At garage", "Never"], "Before lift"),
    ("Tyre fitting difficulty?", ["Easy all", "Hard sometimes", "Always easy", "No problem"], "Hard sometimes"),
    ("Fuel tank empty?", ["Restart engine", "Get fuel", "Continue coast", "Call help"], "Get fuel"),
    ("Fuel pump priming?", ["Push accelerator", "Turn key on", "Not needed", "Manual only"], "Turn key on"),
    ("Running out fuel motorway?", ["Normal stop", "Hard shoulder", "Next exit", "Keep going"], "Hard shoulder"),
    ("Ignition system?", ["Never fails", "Can fail", "Rare", "Always works"], "Can fail"),
    ("Battery terminals clean?", ["Not needed", "Regularly", "Once yearly", "Never"], "Regularly"),
    ("Lights not working?", ["Continue", "Get repaired", "Minor", "Daytime only"], "Get repaired"),
    ("Wiper failure?", ["Continue", "Get repaired", "Not needed", "Optional"], "Get repaired"),
    ("Brake failure?", ["Pump pedal", "Use handbrake", "Find escape", "All above"], "All above"),
    ("Steering failure?", ["Stop gently", "Emergency stop", "Continue", "No choice"], "Stop gently"),
    ("Accelerator stuck?", ["Ignore", "Shift to neutral", "Brake hard", "Swerve"], "Shift to neutral"),
    ("Clutch failure?", ["Ignore", "Get repaired", "Continue", "No problem"], "Get repaired"),
    ("Gearbox problem?", ["Continue", "Get repaired", "No issue", "Minor only"], "Get repaired"),
    ("Differential lock?", ["Optional", "Emergency only", "Always use", "Never"], "Emergency only"),
    ("Exhaust damage?", ["Ignore", "Get repaired", "Minor noise", "Continue"], "Get repaired"),
    ("Muffler hanging?", ["Drive on", "Secure/repair", "Drag freely", "No issue"], "Secure/repair"),
    ("Smoke from engine?", ["Normal", "Serious problem", "No concern", "Just dirty"], "Serious problem"),
    ("Fluid under car?", ["Normal", "Check source", "No concern", "Cosmetic"], "Check source"),
]

add_category("Breakdowns and Incidents", "breakdown", breakdown)

# ECO-DRIVING & LOADING - ~50
eco = [
    ("Eco driving benefits?", ["No benefit", "Saves fuel", "More emissions", "No difference"], "Saves fuel"),
    ("Smooth acceleration?", ["Wastes fuel", "Saves fuel", "No effect", "Increases emissions"], "Saves fuel"),
    ("Hard braking impact?", ["No effect", "Wears brakes", "Saves fuel", "Improves handling"], "Wears brakes"),
    ("Coasting downhill?", ["Saves fuel", "Dangerous", "No effect", "Increases fuel"], "Dangerous"),
    ("Appropriate gear?", ["Any gear", "Right gear", "High gear", "Low gear"], "Right gear"),
    ("Engine revs high?", ["Fuel saving", "Fuel wasting", "No effect", "Improves power"], "Fuel wasting"),
    ("Idle engine?", ["Uses fuel", "No fuel", "Neutral only", "Minimal"], "Uses fuel"),
    ("Air conditioning?", ["No effect", "Increases fuel", "Saves fuel", "Minor"], "Increases fuel"),
    ("Roof rack loaded?", ["No effect", "Increases drag", "Saves fuel", "No issue"], "Increases drag"),
    ("Windows open highway?", ["No effect", "Increases drag", "Saves fuel", "Better"], "Increases drag"),
    ("Speed increase fuel?", ["Same", "Significantly more", "Slightly more", "Less"], "Significantly more"),
    ("Underbody aerodynamics?", ["Affects nothing", "Reduces drag", "Increases drag", "No effect"], "Reduces drag"),
    ("Tyre pressure under?", ["Better", "Worse fuel economy", "No effect", "Improves"], "Worse fuel economy"),
    ("Load reduction?", ["No benefit", "Improves fuel", "Worsens fuel", "No effect"], "Improves fuel"),
    ("Engine warm-up?", ["Necessary", "Unnecessary modern", "Always needed", "Engine protection"], "Unnecessary modern"),
    ("Short trips walking?", ["More emissions", "Walking efficient", "Drive always", "No difference"], "Walking efficient"),
    ("Carpooling benefits?", ["No benefit", "Shared costs", "Slower", "No advantage"], "Shared costs"),
    ("Congestion charge?", ["No impact", "Environmental", "Money only", "Minor"], "Environmental"),
    ("Zero emission zones?", ["Not real", "Emission reduction", "Cost only", "No effect"], "Emission reduction"),
    ("Hybrid vehicles?", ["No benefit", "Less emissions", "More emissions", "Same"], "Less emissions"),
    ("Electric vehicles?", ["No benefit", "Zero emissions", "More emissions", "Same"], "Zero emissions"),
    ("Vehicle maintenance affect?", ["No impact", "Better economy", "Worse economy", "Minimal"], "Better economy"),
    ("Fuel grade standard?", ["Any fuel", "Recommended grade", "Premium always", "Lowest cost"], "Recommended grade"),
    ("Fuel additives?", ["Essential", "Optional", "Harmful", "Never needed"], "Optional"),
    ("Engine oil grade?", ["Any grade", "Recommended grade", "Thickest", "Thinnest"], "Recommended grade"),
    ("Laden vehicle?", ["Same performance", "Different", "More power", "No difference"], "Different"),
    ("Max load limits?", ["No limits", "Must follow", "Approximate", "Suggestions"], "Must follow"),
    ("Overloaded braking?", ["Same distance", "Longer distance", "Shorter distance", "No effect"], "Longer distance"),
    ("Load distribution?", ["Any way", "Secure/balanced", "Heavy front", "Heavy back"], "Secure/balanced"),
    ("Insecure load?", ["No problem", "Dangerous", "Minor", "No issue"], "Dangerous"),
    ("Roof loading?", ["Affects weight", "Increases height", "Affects stability", "All above"], "All above"),
    ("Trailer weight?", ["No limits", "Percentage car", "Any weight", "Unlimited"], "Percentage car"),
    ("Vehicle stability loaded?", ["No change", "Can be affected", "Improved", "No effect"], "Can be affected"),
    ("Exhaust emissions?", ["No concern", "Harmful", "Beneficial", "No issue"], "Harmful"),
    ("CO2 levels?", ["No impact", "Climate change", "Irrelevant", "No concern"], "Climate change"),
    ("Particulate matter?", ["Harmless", "Health hazard", "Beneficial", "No problem"], "Health hazard"),
    ("Diesel vs petrol?", ["Same emissions", "Different", "Petrol worse", "Diesel better"], "Different"),
    ("Vehicle age emissions?", ["New worse", "Older cleaner", "No difference", "Age irrelevant"], "Age irrelevant"),
    ("Engine efficiency?", ["No control", "Can improve", "Always same", "Not possible"], "Can improve"),
    ("Fuel consumption tracking?", ["Useless", "Helpful", "No point", "Unnecessary"], "Helpful"),
    ("Aggressive driving?", ["Efficient", "Fuel wasting", "Same fuel", "Saving fuel"], "Fuel wasting"),
    ("Defensive driving?", ["Wasteful", "Fuel efficient", "No impact", "No benefit"], "Fuel efficient"),
    ("Speed limits fuel?", ["Higher faster", "Efficient lower", "No difference", "Always same"], "Efficient lower"),
    ("Traffic flow?", ["No impact", "Affects consumption", "Irrelevant", "No effect"], "Affects consumption"),
    ("Congestion idling?", ["Fuel saving", "Fuel wasting", "No effect", "Neutral better"], "Fuel wasting"),
    ("Planning route?", ["Pointless", "Reduces distance", "Same route", "No benefit"], "Reduces distance"),
    ("Peak travel times?", ["No impact", "Affects fuel", "Same emission", "No difference"], "Affects fuel"),
]

add_category("Eco-Driving and Vehicle Loading", "eco", eco)

# Additional questions for other categories to expand
other_misc = [
    ("Motorway signals overhead?", ["Ignore", "Follow immediately", "Check origin", "Question authority"], "Follow immediately"),
    ("Variable speed limits?", ["No such thing", "Change with conditions", "Always same", "Set yearly"], "Change with conditions"),
    ("Smart motorways?", ["Traditional", "Technology assisted", "Same old", "Nothing new"], "Technology assisted"),
    ("Lane closure signs?", ["Advisory", "Must comply", "Optional", "Ignore"], "Must comply"),
    ("Chevron merge sign?", ["Go fast", "Merge carefully", "Exit", "Yield"], "Merge carefully"),
    ("Right-hand drive?", ["Not available", "Specific vehicles", "All vehicles", "Optional"], "Specific vehicles"),
    ("Left-hand traffic?", ["Drive left", "Drive right", "Country dependent", "No difference"], "Country dependent"),
    ("Continental driving?", ["Same rules", "Different rules", "No difference", "Always same"], "Different rules"),
    ("Winter tyres?", ["Luxury", "Improved grip", "No difference", "Harmful"], "Improved grip"),
    ("Snow chains?", ["Never needed", "Legal in some countries", "For racing", "Optional"], "Legal in some countries"),
    ("Headlight beam adjustment?", ["Not needed", "Adjust for load", "Always same", "No effect"], "Adjust for load"),
    ("Headlight aim?", ["Not important", "Must be correct", "Approximate", "No matter"], "Must be correct"),
    ("Fog light use?", ["Anytime", "Fog only", "Night driving", "Always"], "Fog only"),
    ("Reversing lights?", ["Optional", "Mandatory", "For visibility", "Safety feature"], "Mandatory"),
    ("Brake light bulbs?", ["Optional", "Must work", "One sufficient", "Not needed"], "Must work"),
    ("Indicator fluid?", ["No such thing", "Not needed", "Electrical", "No fluid"], "Not needed"),
    ("Horn sound volume?", ["No limit", "Regulated", "Louder better", "No rule"], "Regulated"),
    ("Wing mirror damage?", ["Cosmetic", "Replace", "Non-safety", "Ignore"], "Replace"),
    ("Windscreen pillar?", ["No blind spot", "Can hide vehicles", "Just plastic", "Not important"], "Can hide vehicles"),
    ("Pedal placement?", ["Varies", "Standardized", "No standard", "Differs"], "Standardized"),
]

add_category("Miscellaneous Driving Knowledge", "misc", other_misc)

# Save all questions
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')

# Summary
print(f"Generated {len(questions)} total questions")
print(f"Saved to data/driving-theory-questions.json")
print(f"\nDistribution:")
categories = {}
for q in questions:
    cat = q['category']
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count}")

print(f"\nTotal: {sum(categories.values())} questions")
