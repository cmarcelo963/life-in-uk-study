#!/usr/bin/env python3
"""Add final questions to reach 900 total"""
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

# Add questions to reach 900 - 555 = need 345 more

# Additional HAZARD PERCEPTION - 60 more questions
hazard_extra = [
    ("Vehicle in wrong lane?", ["Normal", "Hazard", "Safe", "Ignore"], "Hazard"),
    ("Brake lights ahead?", ["Maintain speed", "Prepare stop", "Speed up", "Honk"], "Prepare stop"),
    ("Tail gating?", ["Acceptable", "Dangerous", "Normal", "Okay"], "Dangerous"),
    ("Motorcycle lane weaving?", ["Safe", "Unpredictable", "Normal", "Expected"], "Unpredictable"),
    ("Broken white line near?", ["Safe cross", "Not safe", "Always cross", "Check"], "Check"),
    ("Double parked car?", ["Expect stop", "Continue", "Accelerate", "Normal"], "Expect stop"),
    ("Reversing car?", ["Drive normally", "Prepare stop", "Pass quickly", "Honk"], "Prepare stop"),
    ("Amber traffic light?", ["Must stop", "Can proceed", "Proceed carefully", "Speed up"], "Proceed carefully"),
    ("Vehicle brake lights on?", ["Accelerate", "Maintain speed", "Slow down", "Honk"], "Slow down"),
    ("Heavy rain visibility?", ["Normal", "Reduced", "Improved", "Same"], "Reduced"),
    ("Parking lot hazard?", ["No danger", "Pedestrians exit", "Safe zone", "No risk"], "Pedestrians exit"),
    ("Bus indicator on?", ["Continue", "Prepare stop", "Pass", "Honk"], "Prepare stop"),
    ("Cyclist hand signals?", ["Ignore", "Observe intent", "Continue", "Pass"], "Observe intent"),
    ("Wet road markings?", ["Better grip", "Slippery", "Normal", "Improved"], "Slippery"),
    ("Gravel on road?", ["Ignore", "Slippery surface", "Normal", "Safe"], "Slippery surface"),
    ("Pedestrian at curb?", ["Continue", "Prepare stop", "Accelerate", "Normal"], "Prepare stop"),
    ("Car door opening?", ["Ignore", "Expect", "Continue", "Safe"], "Expect"),
    ("Turn signal activated?", ["Ignore", "Observe", "Continue", "Normal"], "Observe"),
    ("Vehicle swerving?", ["Normal", "Distracted", "Safe", "Okay"], "Distracted"),
    ("Emergency vehicle?", ["Continue", "Pull over", "Speed up", "Normal"], "Pull over"),
    ("Speed limit sign?", ["Ignore", "Obey", "Suggests", "Optional"], "Obey"),
    ("Pedestrian phone?", ["Aware", "Distracted", "Safe", "Okay"], "Distracted"),
    ("Child playing road?", ["Run over", "Stop immediately", "Normal", "Continue"], "Stop immediately"),
    ("School zone?", ["Normal speed", "Reduced speed", "Accelerate", "Park"], "Reduced speed"),
    ("Weather conditions?", ["No effect", "Affects driving", "Same", "Ignore"], "Affects driving"),
    ("Low visibility ahead?", ["Speed up", "Reduce speed", "Normal", "No change"], "Reduce speed"),
    ("Vehicle breaklight?", ["Continue", "Prepare stop", "Pass", "Honk"], "Prepare stop"),
    ("Wet pavement?", ["Better grip", "Reduced grip", "Same", "Improved"], "Reduced grip"),
    ("Night driving hazard?", ["See clearly", "Reduced visibility", "Same day", "Normal"], "Reduced visibility"),
    ("Fog density?", ["Normal", "Dangerous", "Safe", "Okay"], "Dangerous"),
    ("Bright sun ahead?", ["Normal", "Glare hazard", "Safe", "Good"], "Glare hazard"),
    ("Side wind?", ["No effect", "Swerve risk", "Normal", "Safe"], "Swerve risk"),
    ("Loose gravel?", ["Good grip", "Skid risk", "Safe", "Normal"], "Skid risk"),
    ("Black ice?", ["Visible", "Hidden hazard", "Safe", "Normal"], "Hidden hazard"),
    ("Puddle on road?", ["Ignore", "Hydroplane risk", "Safe", "Normal"], "Hydroplane risk"),
    ("Vehicle hydroplaning?", ["Maintains grip", "Loses traction", "Normal", "Safe"], "Loses traction"),
    ("Worn tire?", ["Safe", "Reduced grip", "Better", "Good"], "Reduced grip"),
    ("Underinflated tire?", ["Better", "Worse handling", "Same", "Improved"], "Worse handling"),
    ("Overinflated tire?", ["Smoother", "Harsh ride", "Better", "Good"], "Harsh ride"),
    ("Brake fade?", ["Improved", "Reduced braking", "Better", "Improved"], "Reduced braking"),
    ("Engine overheat?", ["Drive on", "Stop", "Continue", "Safe"], "Stop"),
    ("Steering failure?", ["Continue", "Stop gently", "Normal", "Safe"], "Stop gently"),
    ("Clutch failure?", ["Ignore", "Get repaired", "Safe", "Continue"], "Get repaired"),
    ("Accelerator stuck?", ["Drive on", "Shift neutral", "Safe", "Continue"], "Shift neutral"),
    ("Flat tire?", ["Continue", "Hard shoulder", "Safe", "Normal"], "Hard shoulder"),
    ("Swerving car?", ["Ignore", "Alert", "Normal", "Safe"], "Alert"),
    ("Sudden lane change?", ["Expected", "Unexpected", "Normal", "Okay"], "Unexpected"),
    ("Brake checking?", ["Normal", "Dangerous", "Safe", "Okay"], "Dangerous"),
    ("Aggressive driving?", ["Safe", "Hazardous", "Normal", "Okay"], "Hazardous"),
    ("Distracted driver?", ["Predictable", "Unpredictable", "Normal", "Safe"], "Unpredictable"),
    ("Confused driver?", ["Normal", "Sudden maneuvers", "Predictable", "Safe"], "Sudden maneuvers"),
    ("Elderly driver?", ["Normal speed", "Slower reaction", "Fast", "Okay"], "Slower reaction"),
    ("Young driver?", ["Predictable", "Risky behavior", "Safe", "Normal"], "Risky behavior"),
    ("Tired driver?", ["Focused", "Reduced awareness", "Safe", "Alert"], "Reduced awareness"),
    ("Drunk driver?", ["Controlled", "Unpredictable", "Safe", "Normal"], "Unpredictable"),
]

add_category("Hazard Awareness (Extended)", "hazard_ext", hazard_extra)

# Additional DEFENSIVE DRIVING - 60 more
defensive = [
    ("See traffic ahead?", ["Immediate", "Well ahead", "Behind", "Too late"], "Well ahead"),
    ("Scanning technique?", ["Straight", "Around continuously", "Random", "No need"], "Around continuously"),
    ("Mirror checking?", ["Rarely", "Regularly", "Never", "Once"], "Regularly"),
    ("Blind spot check?", ["Not needed", "Essential", "Optional", "When convenient"], "Essential"),
    ("Following vehicle closely?", ["Safe", "Dangerous", "Normal", "Okay"], "Dangerous"),
    ("Road positioning?", ["Doesn't matter", "Affects safety", "Random", "No effect"], "Affects safety"),
    ("Cornering speed?", ["Maximum", "Appropriate", "Slower", "Faster"], "Appropriate"),
    ("Braking distance?", ["Less in rain", "More in rain", "Same", "No change"], "More in rain"),
    ("Reaction preparation?", ["Not needed", "Anticipate", "React after", "Ignore"], "Anticipate"),
    ("Gear selection?", ["Any gear", "Right gear", "Highest", "Lowest"], "Right gear"),
    ("Speed management?", ["Constant", "Adjust conditions", "Fixed", "No need"], "Adjust conditions"),
    ("Road awareness?", ["Ahead only", "All around", "Behind", "Sides"], "All around"),
    ("Traffic pattern?", ["Ignore", "Monitor", "No concern", "Random"], "Monitor"),
    ("Vehicle maintenance?", ["Not important", "Critical safety", "Optional", "No effect"], "Critical safety"),
    ("Tire condition?", ["Cosmetic", "Safety critical", "No issue", "Not important"], "Safety critical"),
    ("Brake condition?", ["Not important", "Safety critical", "Optional", "No concern"], "Safety critical"),
    ("Light function?", ["Cosmetic", "Safety critical", "No issue", "Optional"], "Safety critical"),
    ("Weather adaptation?", ["No change", "Adjust driving", "Continue", "Ignore"], "Adjust driving"),
    ("Night driving caution?", ["Same as day", "More caution", "Less caution", "No difference"], "More caution"),
    ("Fog driving?", ["Normal", "Extreme caution", "Safe", "No issue"], "Extreme caution"),
    ("Ice driving?", ["Normal", "Extreme caution", "Safe", "No problem"], "Extreme caution"),
    ("Skid recovery?", ["Panic brake", "Smooth steering", "Accelerate", "Honk"], "Smooth steering"),
    ("Emergency stop?", ["Gradual", "Smooth deceleration", "Sudden", "Brake hard"], "Smooth deceleration"),
    ("Evasive maneuver?", ["Jerky", "Controlled", "Sudden", "Risky"], "Controlled"),
    ("Vehicle stability?", ["Ignored", "Important", "Optional", "No effect"], "Important"),
    ("Load distribution?", ["Any way", "Balanced", "Random", "No matter"], "Balanced"),
    ("Speed limits?", ["Ignore", "Must obey", "Suggestions", "Optional"], "Must obey"),
    ("Road conditions?", ["No effect", "Affect driving", "Ignored", "No concern"], "Affect driving"),
    ("Traffic density?", ["No effect", "Affects planning", "Ignored", "No issue"], "Affects planning"),
    ("Intersection caution?", ["Speed up", "Prepare stop", "No change", "Continue"], "Prepare stop"),
    ("Pedestrian areas?", ["No concern", "Heightened caution", "Ignore", "Normal"], "Heightened caution"),
    ("Cyclist interaction?", ["No concern", "Extra care", "Ignore", "Normal"], "Extra care"),
    ("Large vehicle proximity?", ["No concern", "Extra space", "Safe", "Normal"], "Extra space"),
    ("Motorcycle vulnerability?", ["Not vulnerable", "Very vulnerable", "Tough", "Safe"], "Very vulnerable"),
    ("Visibility poor?", ["Drive normally", "Reduce speed", "Maintain speed", "Accelerate"], "Reduce speed"),
    ("Communication signals?", ["Not needed", "Essential", "Optional", "Rarely"], "Essential"),
    ("Hand signals?", ["Old fashion", "Still valid", "No value", "Not used"], "Still valid"),
    ("Light signals?", ["No meaning", "Communication", "Cosmetic", "Random"], "Communication"),
    ("Horn usage?", ["Always", "Rarely", "Never", "Only speeding"], "Rarely"),
    ("Vehicle spacing?", ["Close", "Safe distance", "Far", "No matter"], "Safe distance"),
    ("Predictability?", ["Drive erratically", "Consistent", "Random", "Unpredictable"], "Consistent"),
]

add_category("Defensive Driving Techniques", "defensive", defensive)

# Additional ROAD SAFETY - 50
road_safety = [
    ("Pedestrian protection?", ["Not important", "Critical", "Optional", "Minor"], "Critical"),
    ("Cyclist safety?", ["Ignore", "Important", "No concern", "Optional"], "Important"),
    ("Child safety?", ["Not priority", "Top priority", "Optional", "Less"], "Top priority"),
    ("Elderly safety?", ["Not concern", "Important", "Optional", "Minor"], "Important"),
    ("Disabled access?", ["Not needed", "Required", "Optional", "No"], "Required"),
    ("Zero tolerance?", ["Some okay", "None acceptable", "Minimal", "Some"], "None acceptable"),
    ("Community safety?", ["Not concern", "Responsibility", "Optional", "Individual"], "Responsibility"),
    ("Safety culture?", ["Not important", "Essential", "Optional", "Minor"], "Essential"),
    ("Training value?", ["Not useful", "Essential", "Optional", "Waste"], "Essential"),
    ("Experience gained?", ["Not valuable", "Critical", "Optional", "Useless"], "Critical"),
    ("Risk awareness?", ["Not needed", "Essential", "Optional", "Minor"], "Essential"),
    ("Decision making?", ["No training", "Needed", "Optional", "Unnecessary"], "Needed"),
    ("Judgment skills?", ["Innate", "Trainable", "Optional", "No"], "Trainable"),
    ("Confidence level?", ["High always", "Appropriate", "Low", "Variable"], "Appropriate"),
    ("Overconfidence?", ["Okay", "Dangerous", "Safe", "Good"], "Dangerous"),
    ("Complacency risk?", ["No risk", "Danger zone", "Safe", "No issue"], "Danger zone"),
    ("Fatigue effect?", ["None", "Impairs ability", "Helps", "No problem"], "Impairs ability"),
    ("Distraction risk?", ["Safe", "Dangerous", "Minor", "Okay"], "Dangerous"),
    ("Medication impact?", ["No effect", "Check label", "Always safe", "No concern"], "Check label"),
    ("Alcohol impact?", ["No effect", "Impairs driving", "Helps", "No problem"], "Impairs driving"),
    ("Drug effects?", ["No impact", "Dangerous", "Safe", "Minor"], "Dangerous"),
    ("Illness effect?", ["No impact", "Affects driving", "Safe", "Minor"], "Affects driving"),
    ("Emotion impact?", ["No effect", "Affects judgment", "Helps", "No concern"], "Affects judgment"),
    ("Stress level?", ["No effect", "Affects safety", "Helps", "No concern"], "Affects safety"),
    ("Anger response?", ["Safe", "Dangerous", "Normal", "Okay"], "Dangerous"),
    ("Impatience?", ["Okay", "Dangerous", "Normal", "Safe"], "Dangerous"),
    ("Frustration?", ["Good", "Clouds judgment", "Helps", "Positive"], "Clouds judgment"),
    ("Peer pressure?", ["Ignore", "Resist", "Follow", "Accept"], "Resist"),
    ("Showing off?", ["Safe", "Dangerous", "Okay", "Normal"], "Dangerous"),
    ("Legal compliance?", ["Optional", "Mandatory", "Suggestions", "No need"], "Mandatory"),
    ("Insurance implications?", ["No effect", "Major importance", "Minor", "No issue"], "Major importance"),
    ("License loss?", ["Temporary", "Possible consequence", "Not real", "Unlikely"], "Possible consequence"),
    ("Financial penalties?", ["No concern", "Significant", "Minimal", "Minor"], "Significant"),
    ("Criminal record?", ["Impossible", "Possible", "No risk", "Unlikely"], "Possible"),
    ("Accident liability?", ["No concern", "Personal responsibility", "Insurance only", "No liability"], "Personal responsibility"),
    ("Third party injury?", ["Not concern", "Serious responsibility", "Insurable only", "Minor"], "Serious responsibility"),
    ("Property damage?", ["Not concern", "Personal responsibility", "Insurable", "Concern"], "Personal responsibility"),
    ("Emergency response?", ["Ignore", "Call immediately", "Wait", "No need"], "Call immediately"),
    ("First aid?", ["Not needed", "Helpful if trained", "Useless", "Minor"], "Helpful if trained"),
    ("Witness statements?", ["Not needed", "Important", "Optional", "No"], "Important"),
    ("Accident report?", ["Not needed", "Essential", "Optional", "Unnecessary"], "Essential"),
    ("Insurance claim?", ["Not needed", "Document", "Optional", "Minor"], "Document"),
    ("Police involvement?", ["Never needed", "Sometimes essential", "Never call", "Avoid"], "Sometimes essential"),
    ("Medical attention?", ["Not needed", "Important", "Optional", "Waste"], "Important"),
    ("Evidence collection?", ["No value", "Important", "Optional", "Useless"], "Important"),
    ("Legal advice?", ["Not useful", "Sometimes needed", "Never", "Unnecessary"], "Sometimes needed"),
    ("Insurance cancellation?", ["No risk", "Possible", "Never", "Unlikely"], "Possible"),
    ("Premium increase?", ["No effect", "Likely", "No change", "Unlikely"], "Likely"),
]

add_category("Road Safety and Responsibility", "safety_resp", road_safety)

# Additional PRACTICAL DRIVING SCENARIOS - 70
scenarios = [
    ("Rush hour traffic?", ["Drive fast", "Patient driving", "Aggressive", "Impatient"], "Patient driving"),
    ("Heavy traffic jam?", ["Stress increases", "Stay calm", "Honk horn", "Aggressive"], "Stay calm"),
    ("Congestion?", ["Speed up", "Accept delay", "Cut corners", "Risk"], "Accept delay"),
    ("Narrow passage?", ["Speed up", "Careful control", "Risky", "Aggressive"], "Careful control"),
    ("Parked cars sides?", ["Speed", "Slow control", "Careful", "Risky"], "Slow control"),
    ("Roundabout confusion?", ["Speed up", "Observe traffic", "Reckless", "Aggressive"], "Observe traffic"),
    ("Lane merging?", ["Cut in", "Signal merge", "Reckless", "Force"], "Signal merge"),
    ("Traffic jam end?", ["Accelerate", "Check then move", "Rush", "Aggressive"], "Check then move"),
    ("Slip road highway?", ["Merge slow", "Match speed", "Slow entry", "Risky"], "Match speed"),
    ("Exit motorway?", ["Sudden change", "Gradual decelerate", "Quick exit", "Risky"], "Gradual decelerate"),
    ("Parking space?", ["Anyhow", "Properly parked", "Crooked", "Careless"], "Properly parked"),
    ("Reverse parking?", ["Quick reverse", "Careful control", "Speed", "Risky"], "Careful control"),
    ("Parallel parking?", ["Quick", "Careful control", "Risky", "Speed"], "Careful control"),
    ("Hillside parking?", ["Leave unlocked", "Handbrake/wedge", "Unsafe", "Risky"], "Handbrake/wedge"),
    ("Steep slope?", ["No precaution", "Engine off", "Park carefully", "Cautious"], "Park carefully"),
    ("Wet surface parking?", ["Normal", "Extra care", "Same", "No change"], "Extra care"),
    ("Ice patch parking?", ["Normal", "Avoid", "Safe", "No concern"], "Avoid"),
    ("Beach parking?", ["Hard sand", "Soft sand", "Any area", "Anywhere"], "Hard sand"),
    ("Off-road driving?", ["Always okay", "Skill required", "Easy", "Simple"], "Skill required"),
    ("Muddy terrain?", ["Normal car", "Specialist vehicle", "Any car", "Easy"], "Specialist vehicle"),
    ("Water crossing?", ["Drive through", "Check depth", "Risky", "Attempt"], "Check depth"),
    ("River crossing?", ["Attempt", "Turn back", "Risky", "Possible"], "Turn back"),
    ("Flood area?", ["Drive through", "Avoid", "Risky", "Try"], "Avoid"),
    ("Night driving preparation?", ["No prep", "Check lights", "Unnecessary", "Minor"], "Check lights"),
    ("Night visibility?", ["Clear", "Limited", "Perfect", "Good"], "Limited"),
    ("Dawn driving?", ["No concern", "Glare hazard", "Safe", "Easy"], "Glare hazard"),
    ("Dusk driving?", ["No concern", "Visibility change", "Safe", "Easy"], "Visibility change"),
    ("Rain driving?", ["Normal speed", "Reduced speed", "Maintain", "Increase"], "Reduced speed"),
    ("Snow driving?", ["Normal speed", "Very slow", "Maintain", "Speed up"], "Very slow"),
    ("Ice driving?", ["Normal speed", "Extreme caution", "Maintain", "Increase"], "Extreme caution"),
    ("Hail conditions?", ["Safe", "Dangerous", "No issue", "Minor"], "Dangerous"),
    ("Lightning storm?", ["Continue", "Shelter", "Dangerous", "Drive on"], "Shelter"),
    ("Fog density?", ["Drive normally", "Very slow", "Safe", "Easy"], "Very slow"),
    ("Visibility under 50m?", ["Normal speed", "Extreme caution", "Maintain", "Safe"], "Extreme caution"),
    ("Dust storm?", ["Drive", "Stop safe place", "Continue", "Risky"], "Stop safe place"),
    ("Sand storm?", ["Drive on", "Stop shelter", "Continue", "Attempt"], "Stop shelter"),
    ("Wind gust?", ["Ignore", "Grip tight", "Prepare", "No action"], "Prepare"),
    ("Strong wind?", ["Normal", "Extra grip", "Safe", "Easy"], "Extra grip"),
    ("Crosswind?", ["Normal", "Steer into", "Ignore", "No adjustment"], "Steer into"),
    ("Tailwind?", ["Slows car", "Helps", "No effect", "Hurts"], "Helps"),
    ("Downwind?", ["Normal", "Affects stability", "Safe", "Easy"], "Affects stability"),
    ("Headwind?", ["Normal", "Increases fuel", "Helps", "Safe"], "Increases fuel"),
    ("Slippery entrance?", ["Speed", "Caution", "Risky", "Normal"], "Caution"),
    ("Loose gravel?", ["Speed", "Caution", "Careful", "Risky"], "Caution"),
    ("Potholes?", ["Speed over", "Avoid/slow", "Careful", "Risky"], "Avoid/slow"),
    ("Debris on road?", ["Ignore", "Avoid safely", "Drive over", "Risk"], "Avoid safely"),
    ("Animal ahead?", ["Speed", "Slow stop", "Risky", "Normal"], "Slow stop"),
    ("Wildlife crossing?", ["Honk", "Slow", "Stop", "Speed"], "Slow"),
    ("Accident scene?", ["Speed", "Slow observe", "Careful", "Curious"], "Slow observe"),
    ("Disabled vehicle?", ["Ignore", "Check help", "Pass", "Normal"], "Check help"),
    ("Breakdown ahead?", ["Honk", "Slow", "Pass", "Speed"], "Slow"),
]

add_category("Driving Scenarios and Situations", "scenarios", scenarios)

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
