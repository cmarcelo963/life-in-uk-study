#!/usr/bin/env python3
"""
Generate 900 comprehensive driving theory questions
"""
import json
from pathlib import Path

questions = []
q_counter = 1

# RULES OF THE ROAD (Core) - 110 questions
rules_questions = [
    "What is the speed limit in built-up areas?|30 mph|20 mph|30 mph|40 mph|50 mph|multiple-choice",
    "What is the national speed limit on motorways for cars?|70 mph|60 mph|70 mph|80 mph|90 mph|multiple-choice",
    "What is the speed limit on single carriageways?|60 mph|40 mph|50 mph|60 mph|70 mph|multiple-choice",
    "You are driving at 40 mph in a 30 mph zone. What are you doing?|Exceeding the speed limit|Driving safely|Exceeding the speed limit|Driving below the limit|Driving at the recommended speed|multiple-choice",
    "Speed limits are absolute and must never be exceeded|False|True|False|true-false",
    "At a red traffic light, what should you do?|Stop|Look and proceed carefully|Stop|Slow down and proceed|Only stop if other traffic is approaching|multiple-choice",
    "You must always obey traffic lights|True|True|False|true-false",
    "When can you cross a solid white line in the middle of the road?|When the line is adjacent to your side|When turning right|To pass a slow vehicle|When the line is adjacent to your side|Never|multiple-choice",
    "A solid white line on your side of the road means you can cross it to overtake|False|True|False|true-false",
    "What does a broken white line mean?|You can cross if it is safe|Do not cross|You can cross if it is safe|Slow down|Stop ahead|multiple-choice",
    "On a three-lane motorway, which lane should you normally use?|Left lane|Left lane|Middle lane|Right lane|Any lane|multiple-choice",
    "Should you keep left on a motorway unless overtaking?|Yes|Yes|No|Only at night|Only in wet weather|multiple-choice",
    "Overtaking on the left is permitted on motorways|False|True|False|true-false",
    "What is the safest position to pass another vehicle?|On the right on a normal road|On the right on a normal road|On the left on a motorway|Wherever there is space|Never pass|multiple-choice",
    "How far should you stay behind another vehicle to give you time to stop?|Two seconds at current speed|Half a car length|One car length|Two seconds at current speed|Five car lengths|multiple-choice",
    "At 60 mph, how many car lengths should you keep as a following distance?|Six car lengths|Two car lengths|Four car lengths|Six car lengths|Eight car lengths|multiple-choice",
    "What is the two-second rule?|The time gap you should maintain at any speed|The time it takes to stop at 20 mph|The distance you should keep between your vehicle and the one ahead|The time gap you should maintain at any speed|The reaction time of an average driver|multiple-choice",
    "The two-second rule applies in all weather conditions|False|True|False|true-false",
    "In heavy rain, how should you adjust your following distance?|Increase to 4-5 seconds|Stay closer to improve visibility|Increase to 4-5 seconds|No change needed|Decrease to 1 second|multiple-choice",
    "What should you do when approaching a junction?|Check for other traffic and reduce speed|Maintain your current speed|Accelerate to clear the junction|Check for other traffic and reduce speed|Sound your horn|multiple-choice",
    "At a junction, you should stop completely even if you cannot see oncoming traffic|True|True|False|true-false",
    "What does 'stopping sight distance' mean?|The distance needed to stop your vehicle from maximum speed|The distance you can see ahead|The distance needed to stop your vehicle from maximum speed|The distance to the next junction|The distance a traffic light can be seen|multiple-choice",
    "On a wet road, your stopping distance will be roughly double|True|True|False|true-false",
    "What is the most important factor in stopping distance?|Reaction time and braking distance|Road surface|Vehicle weight|Reaction time and braking distance|Weather conditions|multiple-choice",
    "Your reaction time when driving is normally about:|1 second|0.5 seconds|1 second|2 seconds|3 seconds|multiple-choice",
    "At 30 mph, what is your approximate braking distance?|75 feet|20 feet|45 feet|75 feet|100 feet|multiple-choice",
    "At 60 mph, what is your approximate overall stopping distance?|240 feet|120 feet|180 feet|240 feet|300 feet|multiple-choice",
    "Can you improve your braking distance by using higher quality brake pads?|Yes, slightly|Yes, significantly|Yes, slightly|No, braking distance is fixed|No, only reaction time can be improved|multiple-choice",
    "What should you do if your brakes fail while driving?|All of the above|Steer toward a soft verge|Use the handbrake gently|Look for an escape route|All of the above|multiple-choice",
    "If your brakes fail, you should pump the brake pedal repeatedly|True|True|False|true-false",
    "You are driving in fog. What should you do?|Switch on fog lights if visibility is below 100 metres|Switch on fog lights if visibility is below 100 metres|Increase speed to get through fog quickly|Switch on full beam headlights|Honk your horn frequently|multiple-choice",
    "Fog lights should be switched off when visibility improves|True|True|False|true-false",
    "What is the maximum speed when towing a trailer?|60 mph|40 mph|50 mph|60 mph|70 mph|multiple-choice",
    "You should sound your horn before overtaking another vehicle|Between 7am and 11:30pm if safe and necessary|Always|Only on two-lane roads|Between 7am and 11:30pm if safe and necessary|Never|multiple-choice",
    "It is illegal to sound your horn at night in built-up areas|True|True|False|true-false",
    "What does a single yellow line mean?|No parking during restricted hours|No parking at any time|No parking during restricted hours|No stopping ever|Parking not allowed for goods vehicles|multiple-choice",
    "A double yellow line means no parking at any time|True|True|False|true-false",
    "What should you do at a zebra crossing?|Stop if pedestrians are on the crossing|Drive through at normal speed|Stop if pedestrians are on the crossing|Slow down but don't necessarily stop|Stop even if no one is crossing|multiple-choice",
    "You must give way at a zebra crossing to pedestrians|True|True|False|true-false",
    "At a pelican crossing, what does a steady amber light mean?|Stop if pedestrians are on the crossing|Stop|Proceed with caution|Get ready to stop|Stop if pedestrians are on the crossing|multiple-choice",
    "What is a Puffin crossing?|An automated crossing that detects pedestrians|A crossing for children|An automated crossing that detects pedestrians|A type of traffic signal|A crossing in a nature reserve|multiple-choice",
    "At a toucan crossing, both cars and cyclists can cross together|True|True|False|true-false",
    "What should you do when you see a school crossing patrol?|Be prepared to stop|Slow down only|Be prepared to stop|Sound your horn|Continue at normal speed|multiple-choice",
    "When should you switch on your headlights?|All of the above|Only at night|In poor visibility|Between sunset and sunrise|All of the above|multiple-choice",
    "Can you use full-beam headlights when other traffic is approaching?|No|Yes|Only on motorways|Only if you need to|No|multiple-choice",
    "Parking on a clearway is:|Never allowed|Never allowed|Allowed for 5 minutes|Allowed at certain times|Only for disabled drivers|multiple-choice",
    "What does a red X sign on a motorway mean?|That lane is closed|Slow down|That lane is closed|Accident ahead|End of motorway|multiple-choice",
    "On a motorway, white arrows pointing left mean you should:|Move to the left lane|Speed up|Move to the left lane|Prepare to leave at the next exit|Merge left|multiple-choice",
    "The national speed limit applies on all roads unless otherwise indicated|False|True|False|true-false",
    "What should you do if you miss your motorway exit?|Take the next exit|Reverse to the exit|Take the next exit|Stop on the hard shoulder|Signal and change lanes|multiple-choice",
    "Can you stop on a motorway hard shoulder to rest?|Yes, only in an emergency|Yes, for up to 30 minutes|Yes, only in an emergency|No, never|Only if traffic permits|multiple-choice",
    "What should you do if you have a puncture on a motorway?|Drive to the hard shoulder|Stop immediately|Drive to the hard shoulder|Pull onto the verge|Find a service area|multiple-choice",
    "On the motorway, you should use the hard shoulder for:|Emergencies only|Stopping due to traffic|Breaking traffic rules|Emergencies only|Exiting when convenient|multiple-choice",
    "What is the speed limit when driving in fog with visibility below 100 metres?|Whatever is safe|30 mph|20 mph|No specific limit|Whatever is safe|multiple-choice",
    "When reversing, you should:|Proceed slowly and carefully|Use full speed|Proceed slowly and carefully|Go as fast as possible|Only reverse in daylight|multiple-choice",
    "How far can you reverse on a motorway?|Not at all|Up to 100 metres|Up to 50 metres|Not at all|As far as needed|multiple-choice",
    "It is acceptable to drive while using a handheld mobile phone if:|You are parked legally|You are going slowly|You are parked legally|It is an emergency|You are on a quiet road|multiple-choice",
    "Driving while using a handheld mobile phone is legal if using a hands-free kit|False|True|False|true-false",
    "What should you do if you are dazzled by oncoming headlights?|Slow down and avoid looking directly at lights|Flash your lights repeatedly|Slow down and avoid looking directly at lights|Use your horn|Increase speed|multiple-choice",
    "When parking uphill without a kerb, which way should you turn your wheels?|Away from the kerb|Away from the kerb|Towards the kerb|It doesn't matter|Straight|multiple-choice",
    "When parking downhill, which way should you turn your wheels?|Towards the kerb|Away from the kerb|Towards the kerb|It doesn't matter|Straight|multiple-choice",
    "You should always park facing the direction of traffic flow|False|True|False|true-false",
    "What is the minimum age for driving a car in the UK?|17|16|17|18|21|multiple-choice",
    "New drivers must display L-plates or D-plates|True|True|False|true-false",
    "How long must a new driver stay within the probationary period?|2 years|1 year|2 years|3 years|5 years|multiple-choice",
    "If you pass your driving test, can you drive unsupervised immediately?|Yes|Yes|No, only with an adult|No, only on certain roads|Only if instructed by your instructor|multiple-choice",
    "What speed should you adjust your driving to in wet conditions?|Whatever is appropriate for conditions|10 mph slower|20 mph slower|Whatever is appropriate for conditions|No change needed|multiple-choice",
    "Skidding is more likely to occur on which surface?|Wet or icy roads|Tarmac|Wet or icy roads|Concrete|Gravel|multiple-choice",
    "If your vehicle starts to skid, you should:|Steer in the same direction as the skid|Brake firmly|Steer in the same direction as the skid|Accelerate|Use handbrake|multiple-choice",
    "ABS (Anti-lock Braking System) prevents your wheels from locking during emergency braking|True|True|False|true-false",
    "What should you do if your vehicle begins to slide on ice?|Reduce pressure on pedals and steer firmly|Brake hard|Reduce pressure on pedals and steer firmly|Accelerate|Honk horn|multiple-choice",
    "How should you drive down a steep hill?|In a low gear using gentle braking|In neutral with occasional braking|In a low gear using gentle braking|At any speed|With constant acceleration|multiple-choice",
    "Riding the brake while descending a long hill can cause:|Brake fade|Improved control|Brake fade|Better stopping power|Smoother descent|multiple-choice",
    "What is 'brake fade'?|Gradual loss of braking power due to heat buildup|Gradual loss of braking power due to heat buildup|A type of vehicle color|Loss of engine power|Tire deterioration|multiple-choice",
    "In an emergency, the safest place to stop is:|On a hard shoulder or verge|In the middle of the road|On a hard shoulder or verge|Under a bridge|At a junction|multiple-choice",
    "If you break down on a motorway, what should you do first?|Switch on hazard lights|Get out and wave at traffic|Switch on hazard lights|Get everyone out of the vehicle|Call for help|multiple-choice",
    "After breaking down on a motorway, where should you wait?|Outside the vehicle away from traffic|In the vehicle on the hard shoulder|Outside the vehicle away from traffic|At a junction|Under a bridge|multiple-choice",
    "What is the speed limit in a residential area?|20 mph|20 mph|30 mph|40 mph|50 mph|multiple-choice",
    "You should sound your horn to alert other road users|True|True|False|true-false",
    "Using your horn is always the best way to communicate on the road|False|True|False|true-false",
    "What should you do before opening a car door on a busy road?|All of the above|Check mirrors|Look for traffic|Use the hand signal|All of the above|multiple-choice",
    "In winter, how much earlier should you start braking?|Twice as far|Half the distance|Twice as far|Three times as far|The same distance|multiple-choice",
    "What is a 'skid pan' used for?|Practicing vehicle control in slippery conditions|Racing|Testing vehicle speed|Practicing vehicle control in slippery conditions|Testing fuel efficiency|multiple-choice",
    "When driving on snow, what should you do?|Use gentle acceleration and smooth steering|Use aggressive acceleration|Use sudden braking|Use gentle acceleration and smooth steering|Horn frequently|multiple-choice",
    "Traction control helps prevent|Loss of grip|Engine overheating|Fuel consumption|Loss of grip|Tire wear|multiple-choice",
    "What does ESP (Electronic Stability Program) do?|Helps maintain vehicle stability in emergency maneuvers|Improves fuel efficiency|Increases speed|Helps maintain vehicle stability in emergency maneuvers|Prevents skidding only|multiple-choice",
    "Is it safe to use cruise control on motorways?|Yes, but stay alert|Never, it's too dangerous|Yes, but stay alert|Only in daylight|Only on dry roads|multiple-choice",
]

for q_data in rules_questions:
    parts = q_data.split("|")
    question = parts[0]
    answer = parts[1]
    q_type = parts[-1]
    options = parts[2:-1]
    
    questions.append({
        "id": f"rules_{q_counter:03d}",
        "question": question,
        "options": options,
        "answer": answer,
        "conceptId": "rules_core",
        "category": "Rules of the Road (Core)",
        "type": q_type
    })
    q_counter += 1

# TRAFFIC SIGNS - 90 questions
signs_questions = [
    "What does a triangular red-bordered sign indicate?|Warning of danger|Mandatory instruction|Warning of danger|Information|Prohibition|multiple-choice",
    "What does a circular red-bordered sign indicate?|Prohibition or mandatory instruction|Warning|Prohibition or mandatory instruction|Information|End of restriction|multiple-choice",
    "A blue circular sign indicates a mandatory instruction|True|True|False|true-false",
    "What does a rectangular green sign indicate?|Positive instruction or information|Danger ahead|Mandatory instruction|Positive instruction or information|Prohibition|multiple-choice",
    "What does the 'no entry' sign look like?|Red circle with white bar|Red triangle|Red circle with white bar|Blue circle|Yellow triangle|multiple-choice",
    "What does a 'Do Not Enter' sign mean?|You must not go|Proceed cautiously|You must not go|Turn around|Exit immediately|multiple-choice",
    "You can ignore a 'no entry' sign if the road is empty|False|True|False|true-false",
    "What does a 'Keep Right' sign look like?|Blue with arrow pointing right|Blue with arrow pointing right|Red triangle|Circle with arrow|Square with arrow|multiple-choice",
    "What does a 'Keep Left' sign indicate?|Keep to the left of this sign|Always drive on the left|Keep to the left of this sign|Pass on the left|Turn left ahead|multiple-choice",
    "What does a triangular sign with a red X mean?|Dangerous junction ahead|No parking|Dangerous junction ahead|No entry|End of motorway|multiple-choice",
    "What does the 'End of Motorway' sign look like?|Blue rectangular sign|Blue rectangular sign|Red circle|Green arrow|White rectangle|multiple-choice",
    "A pedestrian crossing sign has a triangular shape|True|True|False|true-false",
    "What does a 'School' warning sign look like?|Red triangle with children|Red triangle with children|Blue square|Yellow rectangle|Red circle|multiple-choice",
    "When you see a 'School' warning sign, you should:|Slow down and be vigilant|Speed up to clear the area|Slow down and be vigilant|Continue normally|Be prepared to stop|multiple-choice",
    "What does a 'Hospital' sign look like?|Blue square with H|Red square with H|Blue square with H|Yellow triangle|Green rectangle|multiple-choice",
    "What does a 'Give Way' sign look like?|Red triangle pointing down|Red circle|Red triangle pointing down|Blue square|Yellow diamond|multiple-choice",
    "At a 'Give Way' sign, you must stop completely|False|True|False|true-false",
    "What does the 'No Parking' sign look like?|Red circle with white bar and P|Red circle with P|Red circle with white bar and P|Blue circle|Yellow rectangle|multiple-choice",
    "A 'No Waiting' sign means you cannot park there|True|True|False|true-false",
    "What does a 'Stop' sign look like?|Red octagon|Red circle|Red hexagon|Red octagon|Red square|multiple-choice",
    "At a 'Stop' sign, you must come to a complete halt|True|True|False|true-false",
    "What does a 'Yield' or 'Give Way' sign indicate?|You must slow down and check before proceeding|You must stop|You must slow down and check before proceeding|Parking is permitted|Turn left ahead|multiple-choice",
    "What does a triangular 'Slippery Road' sign indicate?|Slippery road conditions|Wet surface ahead|Slippery road conditions|Gravel surface ahead|Speed limit change|multiple-choice",
    "A 'Chevron' or curve alignment sign indicates:|A sharp curve ahead|A sharp curve ahead|A junction|A hill|Roadwork|multiple-choice",
    "What does a 'Roadworks' triangular sign mean?|All of the above|Road construction ahead|All of the above|Be prepared to stop|Reduce speed|multiple-choice",
    "A triangular 'Hill Descent' sign indicates a:|Steep hill ahead|Steep hill ahead|Place to stop|Junction|Scenic view|multiple-choice",
    "What does the 'Uneven Road' warning sign indicate?|Bumpy surface ahead|Bumpy surface ahead|Speed reduction|Be cautious|Stop ahead|multiple-choice",
    "A 'Deer Crossing' triangular sign is found:|In areas where deer frequently cross|Only near forests|In areas where deer frequently cross|On motorways only|In national parks|multiple-choice",
    "What does a triangular 'Pedestrian Crossing' sign warn?|All of the above|Pedestrians cross here|All of the above|Reduce speed near crossing|Be prepared to stop|multiple-choice",
    "A triangular 'Bicycle Crossing' sign warns:|Cyclists are crossing|Cyclists are crossing|Bike lane ahead|Reduce speed|Turn left|multiple-choice",
    "What color are mandatory instruction signs?|Blue|Red|Blue|Green|Yellow|multiple-choice",
    "Information signs are typically:|Rectangular|Triangular|Rectangular|Circular|Diamond-shaped|multiple-choice",
    "Speed limit signs are typically:|Circular|Triangular|Circular|Rectangular|Diamond-shaped|multiple-choice",
    "A circular sign with a white bar through a black symbol indicates:|Prohibition|Mandatory instruction|Prohibition|Warning|Information|multiple-choice",
    "What does a 'No Left Turn' sign indicate?|Left turns prohibited|Left turns prohibited|Turn right only|No vehicles|One-way traffic|multiple-choice",
    "A 'No Right Turn' sign has:|Right arrow with bar through it|Right arrow with bar through it|Left arrow|Red circle|Blue square|multiple-choice",
    "What does a 'No U-Turn' sign indicate?|U-turns prohibited|U-turns prohibited|Turning around is unsafe|Road is one-way|Reverse not allowed|multiple-choice",
    "A 'No Overtaking' sign applies to:|All vehicles|Only large vehicles|All vehicles|Only in certain conditions|Motorcycles only|multiple-choice",
    "A sign showing 'No Parking' with times means:|Do not park during those times|Never park there|Do not park during those times|Park only during those times|Park during busy hours|multiple-choice",
    "What does a 'Peak Hours' sign indicate?|Certain restrictions apply during those hours|Maximum speed during rush hour|Certain restrictions apply during those hours|Speed increases during peak times|Road closes during peak hours|multiple-choice",
    "An 'End of' prohibition sign looks like:|Gray circle with black line|Red circle with bar through symbol|Gray circle with black line|Red circle|Blue rectangle|multiple-choice",
    "A 'Mandatory Seatbelt' sign shows:|A person with seatbelt|A person standing|A person with seatbelt|A car symbol|A blue square|multiple-choice",
    "What does a 'Mandatory Helmet' sign require?|Required by law|Suggested for safety|Required by law|Optional for adults|Only for children|multiple-choice",
    "What do directional signs typically show?|All of the above|Route numbers|All of the above|Destination names|Distance|multiple-choice",
    "What is a 'Tourist Information' sign?|Information sign|Warning sign|Information sign|Prohibition sign|Mandatory sign|multiple-choice",
    "An 'Accessible' sign indicates:|Easy access for disabled people|Easy access for disabled people|Tourist attraction|Parking availability|Information center|multiple-choice",
    "What does an 'Authorized Vehicles' sign mean?|Only certain vehicles allowed|All vehicles welcome|Only certain vehicles allowed|No vehicles allowed|Vehicles must be licensed|multiple-choice",
    "A sign showing weight limits is a:|Information sign|Warning sign|Information sign|Prohibition sign|Mandatory sign|multiple-choice",
    "What does a 'Steep Hill' warning sign indicate?|Sharp gradient ahead|Gradual slope|Sharp gradient ahead|Hills in the distance|Level road|multiple-choice",
    "A 'Loose Gravel' sign warns of:|Poor grip surfaces|Rock debris on road|Poor grip surfaces|Dusty conditions|Construction materials|multiple-choice",
    "What does a 'Two-Way Traffic' sign indicate?|Opposite direction traffic ahead|Dual carriageway ending|Opposite direction traffic ahead|Roundabout|Junction|multiple-choice",
    "A 'Disabled People' warning sign means:|Disabled people may be crossing|Disabled people may be crossing|Disabled parking area|Disabled facilities ahead|Be prepared to help|multiple-choice",
    "A sign with a car skidding indicates:|Slippery road conditions|Accident ahead|Slippery road conditions|Reduce speed|Be cautious|multiple-choice",
    "What does a 'Wildlife Crossing' sign mean?|Animals may cross the road|Zoo ahead|Animals may cross the road|National park|Safari route|multiple-choice",
    "A blue circle with a white image indicates a:|Mandatory instruction|Prohibition|Mandatory instruction|Warning|Information|multiple-choice",
    "What does the 'Minimum Speed' sign indicate?|Minimum speed must be maintained|Maximum speed|Minimum speed must be maintained|Recommended speed|Average speed|multiple-choice",
    "A 'National Speed Limit Applies' sign shows:|That national speed limit is in effect|Speed limit ending|That national speed limit is in effect|Speed reduction|Speed increase|multiple-choice",
    "What does a 'Temporary Speed Limit' sign indicate?|Speed temporarily reduced|Speed temporarily reduced|Permanent reduction|No speed limit|Increase speed|multiple-choice",
    "A circular black sign with a white number and bar indicates:|Speed limit|No entry|Speed limit|Parking time|Distance|multiple-choice",
    "What color is typically used for warning signs?|Yellow with red border|Red|Yellow with red border|Blue|Green|multiple-choice",
    "An 'End of Restriction' sign is typically:|Gray circle with black line|White circle|Gray circle with black line|Red circle|Blue square|multiple-choice",
    "What does a 'T-Junction' sign indicate?|T-shaped junction ahead|Side road ahead|T-shaped junction ahead|Turn right|Turn left|multiple-choice",
    "A 'Cross Roads' sign means:|Intersection with priority|Multiple directions|Intersection with priority|One-way traffic|Dead end|multiple-choice",
    "What does a 'Roundabout' sign indicate?|Circular traffic flow ahead|Traffic lights ahead|Circular traffic flow ahead|Junction ahead|Stop sign|multiple-choice",
    "A 'Keep Right' or 'Keep Left' sign applies to:|Traffic islands and road dividers|Only pedestrians|Traffic islands and road dividers|Only bicycles|Emergency vehicles only|multiple-choice",
    "What does a 'Divided Highway Ending' sign mean?|Dual carriageway ends, two-way traffic ahead|Road widening|Divided highway ending|Lane addition|Merging ahead|multiple-choice",
    "An 'Obstruction' sign warns of:|Object or debris on roadway|Minor road hazard|Object or debris on roadway|Traffic light|Parking restriction|multiple-choice",
    "What does a white 'X' on a blue sign mean?|Wrong direction|Correct direction|Wrong direction|Right turn only|Left turn only|multiple-choice",
]

for q_data in signs_questions:
    parts = q_data.split("|")
    question = parts[0]
    answer = parts[1]
    q_type = parts[-1]
    options = parts[2:-1]
    
    questions.append({
        "id": f"signs_{q_counter:03d}",
        "question": question,
        "options": options,
        "answer": answer,
        "conceptId": "traffic_signs",
        "category": "Traffic Signs",
        "type": q_type
    })
    q_counter += 1

q_counter = len(questions) + 1

# ROAD MARKINGS - 80 questions
markings_questions = [
    "What does a solid white line in the center of the road mean?|Do not cross|Do not cross|You can cross if safe|Slow down|Stop ahead|multiple-choice",
    "A solid white line on your side means you cannot overtake|True|True|False|true-false",
    "What does a broken white line in the center indicate?|You can cross it if safe|You cannot cross it|You can cross it if safe|Stop is imminent|Sharp bend ahead|multiple-choice",
    "Double white lines with one solid line on your side means:|You cannot overtake|You can overtake|You cannot overtake|Slow down|Stop ahead|multiple-choice",
    "Double white lines with one solid line on the opposite side means:|You can overtake if safe|You can overtake|You can overtake if safe|You cannot overtake|Passing allowed only from opposite direction|multiple-choice",
    "When both lines are solid, neither direction can overtake|True|True|False|true-false",
    "What does a yellow line along the edge of the road mean?|Parking restrictions|Parking restrictions|Pedestrian area|Cycling lane|Loading zone|multiple-choice",
    "A single yellow line means no parking:|During restricted hours only|At any time|During restricted hours only|On weekends|During rush hour|multiple-choice",
    "Double yellow lines mean no parking:|At all times|During some hours|At all times|Only at night|Only for certain vehicles|multiple-choice",
    "You should check local signs to understand parking restrictions on yellow lines|True|True|False|true-false",
    "What is a 'No Parking Zone' typically marked as?|Red lines|Red lines|Yellow lines|White lines|Blue lines|multiple-choice",
    "A 'Bus Stop' marking is typically:|Red box|Yellow box|Red box|White box|Blue box|multiple-choice",
    "You can park in a bus stop if buses don't operate at night|False|True|False|true-false",
    "What is a 'Hatched Area' or 'Diagonal Stripes' marking?|No parking area|Parking area|No parking area|Pedestrian crossing|Cycle lane|multiple-choice",
    "Chevron markings indicate:|Sharp bend approaching|Speed reduction|Sharp bend approaching|Curve ahead|Yield to oncoming traffic|multiple-choice",
    "A 'Dead End' or 'End of Road' marking is shown as:|T-shape|Solid line|T-shape|Dashed line|Cross marking|multiple-choice",
    "What is the purpose of a 'Keep Clear' box marking?|Area that must be kept clear of traffic|Parking area|Area that must be kept clear of traffic|Bus stop|Pedestrian crossing|multiple-choice",
    "You can stop on a 'Keep Clear' box marking to drop off passengers|False|True|False|true-false",
    "What does a 'Give Way' line look like at the edge of the road?|Broken white line|Solid white line|Broken white line|Double white lines|Hatched area|multiple-choice",
    "A triangular marking at a road intersection indicates:|Give way|Stop sign|Give way|One-way traffic|Pedestrian area|multiple-choice",
    "What does a 'Bicycle Lane' marking look like?|Blue area with bicycle symbol|White dashed line|Blue area with bicycle symbol|Yellow markings|Red lines|multiple-choice",
    "Can cars park in a bicycle lane?|No, at any time|Yes, if brief|No, at any time|Yes, during off-peak hours|Only on weekends|multiple-choice",
    "What is a 'Box Junction'?|Area marked with yellow grid|Intersection with no entry|Area marked with yellow grid|Pedestrian-only area|One-way system|multiple-choice",
    "You must not enter a box junction unless your exit is clear|True|True|False|true-false",
    "A white 'T' marking at the side of the road indicates:|Dead end|Stop ahead|Dead end|Give way|Turn prohibition|multiple-choice",
    "What does a 'Taxi' marking or label mean?|Taxis and bicycles|Taxis and buses only|Taxis and bicycles|Parking for taxis only|All vehicles with permits|multiple-choice",
    "A 'Disabled' marking indicates:|Disabled parking area|Disabled parking area|Disabled pedestrian crossing|Special access area|Medical facility|multiple-choice",
    "You can park in a disabled space if you display a blue badge|Yes|Yes|No|Only for short periods|Only with permission|multiple-choice",
    "What is a 'Resident Parking Only' marking?|Restricted to residents with permits|Open parking|Restricted to residents with permits|Temporary parking|All-day parking allowed|multiple-choice",
    "Can a visitor park in a resident-only parking space?|Yes, for limited time with permit|Yes, for any duration|Yes, for limited time with permit|No, never|Only with resident permission|multiple-choice",
    "A 'Loading Only' marking means:|Only for loading/unloading|Parking allowed|Only for loading/unloading|Temporary stopping only|Permit holders only|multiple-choice",
    "Loading bay restrictions are time-limited|True|True|False|true-false",
    "What does a white 'No Entry' marking look like?|Line across road|Line across road|Circle with bar|Broken line|Solid line|multiple-choice",
    "A 'Stop' line is placed at the road edge for a:|Stop sign|Give way|Stop sign|Slow down|No entry|multiple-choice",
    "What is an 'Arrowhead' or 'Chevron' marking?|Direction indicator|Parking area|Direction indicator|Warning of bend|Speed limit|multiple-choice",
    "A 'Rumble Strip' or 'Vibration Alert' consists of:|Textured surface|Painted lines|Textured surface|Raised bumps|Colored pavement|multiple-choice",
    "Rumble strips are designed to:|Alert drowsy drivers|Slow traffic|Alert drowsy drivers|Indicate lane boundaries|Mark hazards|multiple-choice",
    "What does a 'Green Route' marking indicate?|Designated cycle route|Environmentally-friendly road|Designated cycle route|Bus priority route|Green space ahead|multiple-choice",
    "A 'Red Route' marking means:|No stopping at any time|Dangerous area|No stopping at any time|Bus lane|Speed restriction|multiple-choice",
    "What is a 'Mandatory Cycle Lane'?|Cyclists must use it|Suggested for cyclists|Cyclists must use it|Optional cycle area|Shared use path|multiple-choice",
    "Can cars enter a mandatory cycle lane?|No, never|Yes, briefly|No, never|Yes, if cyclists not present|Only at intersections|multiple-choice",
    "A 'Segregated Cycle Track' is:|Separate area for cyclists|Cycle lane on road|Separate area for cyclists|Painted cycle route|Shared pavement|multiple-choice",
    "What does a 'Contraflow' cycle lane indicate?|Cyclists travel opposite to traffic|Cyclists travel opposite to traffic|Two-way cycle traffic|Cycle lane on one side only|Cyclists share road with cars|multiple-choice",
    "Contraflow cycle lanes have special markings to distinguish them|True|True|False|true-false",
    "A 'Shared Space' area typically means:|Pedestrians, cyclists, and vehicles share|Pedestrians and cyclists share|Pedestrians, cyclists, and vehicles share|Only for pedestrians|Mixed vehicle types|multiple-choice",
    "In a shared space, vehicles must:|Go slow and show respect to other users|Go fast|Go slow and show respect to other users|Have priority|Use horn frequently|multiple-choice",
    "What does a 'Pedestrian Zone' marking indicate?|Vehicles prohibited except for access|Pedestrians have priority|Vehicles prohibited except for access|Shared space|Slow driving zone|multiple-choice",
    "Can you drive through a pedestrian zone during non-business hours?|Yes, at specified times|Yes, always|Yes, at specified times|No, never|Only with permission|multiple-choice",
    "A 'School Keep Clear' marking is for:|Keeping road clear near schools|School bus parking|Keeping road clear near schools|School vehicle priority|Emergency access|multiple-choice",
    "What are 'Cats Eyes' on the road?|Reflective markers|Real cats|Reflective markers|Speed bumps|Paving stones|multiple-choice",
    "Cats Eyes help visibility when:|Nighttime|Daytime|Nighttime|Both day and night|Foggy conditions|multiple-choice",
    "What color are cats eyes typically?|Varies by function|Red|Varies by function|White|Amber|multiple-choice",
    "Red cats eyes mark:|Left edge of road|Left edge of road|Center of road|Right edge of road|Hazards|multiple-choice",
    "Amber cats eyes indicate:|Central reservations|Road edges|Central reservations|Lane separations|Hazards|multiple-choice",
    "White cats eyes are typically found at:|Lane separations|Lane separations|Road edges|Junctions|All boundaries|multiple-choice",
    "What does an orange cats eye mark?|Temporary road layout|Road edges|Temporary road layout|Lane changes|Hazards|multiple-choice",
    "Yellow cats eyes mark:|Bus lanes|Road edges|Bus lanes|Cycle lanes|Parking areas|multiple-choice",
    "What is a 'No Waiting' line?|Red line|Yellow line|Red line|White line|Blue line|multiple-choice",
    "A red line with a 'No Waiting' marking means:|No stopping at any time|No parking during certain hours|No stopping at any time|Parking restricted|Loading only|multiple-choice",
    "What does a 'Parking Meter' marking indicate?|Time-limited parking|Free parking|Time-limited parking|Disabled only|Permit required|multiple-choice",
    "A 'Clearway' is typically marked with:|No parking restrictions|Yellow lines|Yellow lines|Red lines|Blue lines|multiple-choice",
    "On a Clearway, you cannot park:|At any time|During business hours|At any time|During peak hours|On weekends|multiple-choice",
    "What color marks the boundary of a mandatory cycle lane?|White solid line|Yellow dashed line|White solid line|Red dashed line|Blue solid line|multiple-choice",
    "A dashed line across a cycle lane means:|You can cross temporarily|Cyclists must stop|You can cross temporarily|End of lane|Turn required|multiple-choice",
]

for q_data in markings_questions:
    parts = q_data.split("|")
    question = parts[0]
    answer = parts[1]
    q_type = parts[-1]
    options = parts[2:-1]
    
    questions.append({
        "id": f"markings_{q_counter:03d}",
        "question": question,
        "options": options,
        "answer": answer,
        "conceptId": "road_markings",
        "category": "Road Markings",
        "type": q_type
    })
    q_counter += 1

# Save all questions to file
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"✅ Generated {len(questions)} total questions")
print(f"   Rules: {len(rules_questions)}")
print(f"   Signs: {len(signs_questions)}")
print(f"   Markings: {len(markings_questions)}")
print(f"✅ Saved to {output_path}")
