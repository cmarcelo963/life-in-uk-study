#!/usr/bin/env python3
"""Generate 900 comprehensive driving theory questions for UK theory test"""
import json
from pathlib import Path

# Question template: question|answer|option2|option3|option4|type
QUESTION_DATA = """
Rules of the Road (Core)|110|
What is the speed limit in built-up areas?|30 mph|20 mph|30 mph|40 mph|50 mph|multiple-choice
What is the national speed limit on motorways for cars?|70 mph|60 mph|70 mph|80 mph|90 mph|multiple-choice
What is the speed limit on single carriageways?|60 mph|40 mph|50 mph|60 mph|70 mph|multiple-choice
You are driving at 40 mph in a 30 mph zone?|Exceeding the speed limit|Driving safely|Exceeding the speed limit|Driving below the limit|Driving at the recommended speed|multiple-choice
Speed limits are absolute|False|True|False|true-false
At a red traffic light?|Stop|Look and proceed|Stop|Slow down|Only stop if other traffic is approaching|multiple-choice
You must always obey traffic lights|True|True|False|true-false
When can you cross a solid white line?|When adjacent to your side|When turning right|To pass a slow vehicle|When adjacent to your side|Never|multiple-choice
Solid white line means cross to overtake|False|True|False|true-false
What does broken white line mean?|You can cross if safe|Do not cross|You can cross if safe|Slow down|Stop ahead|multiple-choice
Which lane normally on three-lane motorway?|Left lane|Left lane|Middle lane|Right lane|Any lane|multiple-choice
Should you keep left on motorway unless overtaking?|Yes|Yes|No|Only at night|Only in wet weather|multiple-choice
Overtaking on left permitted on motorways?|False|True|False|true-false
Safest position to pass vehicle?|On the right on normal road|On the right on normal road|On the left on motorway|Wherever there is space|Never pass|multiple-choice
How far behind another vehicle?|Two seconds at current speed|Half a car length|One car length|Two seconds at current speed|Five car lengths|multiple-choice
At 60 mph car lengths following distance?|Six car lengths|Two car lengths|Four car lengths|Six car lengths|Eight car lengths|multiple-choice
What is two-second rule?|Time gap you should maintain|Time to stop at 20 mph|Distance between vehicles|Time gap you should maintain|Average reaction time|multiple-choice
Two-second rule applies in all weather?|False|True|False|true-false
In heavy rain adjust following distance?|Increase to 4-5 seconds|Stay closer|Increase to 4-5 seconds|No change|Decrease to 1 second|multiple-choice
When approaching a junction?|Check for traffic and reduce speed|Maintain current speed|Accelerate to clear|Check for traffic and reduce speed|Sound your horn|multiple-choice
Stop at junction even if can't see traffic?|True|True|False|true-false
What is stopping sight distance?|Distance needed to stop from max speed|Distance you can see|Distance to stop|Distance to next junction|Distance traffic light visible|multiple-choice
On wet road stopping distance roughly?|Double|Half|Double|Triple|Same|multiple-choice
Most important factor in stopping distance?|Reaction time and braking|Road surface|Vehicle weight|Reaction time and braking|Weather conditions|multiple-choice
Your reaction time when driving?|1 second|0.5 seconds|1 second|2 seconds|3 seconds|multiple-choice
At 30 mph approximate braking distance?|75 feet|20 feet|45 feet|75 feet|100 feet|multiple-choice
At 60 mph overall stopping distance?|240 feet|120 feet|180 feet|240 feet|300 feet|multiple-choice
Improve braking distance with quality pads?|Yes slightly|Yes significantly|Yes slightly|No fixed|Only reaction time|multiple-choice
If brakes fail while driving?|All of above|Steer toward verge|Use handbrake gently|Look for escape|All of above|multiple-choice
Brakes fail pump brake pedal?|True|True|False|true-false
Driving in fog what should you do?|Switch on fog lights below 100m|Switch on fog lights|Increase speed|Switch on full beam|Honk horn|multiple-choice
Fog lights when visibility improves?|Switch off|Leave on|Switch off|Only if required|Depends on car|multiple-choice
Maximum speed towing trailer?|60 mph|40 mph|50 mph|60 mph|70 mph|multiple-choice
Sound horn before overtaking?|Between 7am-11:30pm if safe|Always|Between 7am-11:30pm if safe|Only two-lane roads|Never|multiple-choice
Illegal to sound horn at night built-up?|True|True|False|true-false
What does single yellow line mean?|No parking restricted hours|No parking any time|No parking restricted hours|No stopping ever|Goods vehicles prohibited|multiple-choice
Double yellow line no parking?|Any time|Some hours|Any time|Weekends|Certain vehicles|multiple-choice
What should you do zebra crossing?|Stop if pedestrians|Drive through normally|Stop if pedestrians|Slow down|Stop even if empty|multiple-choice
Must give way zebra crossing pedestrians?|True|True|False|true-false
Pelican crossing steady amber light?|Stop if pedestrians|Stop|Proceed with caution|Get ready to stop|Stop if pedestrians|multiple-choice
What is Puffin crossing?|Automated crossing detects pedestrians|Crossing for children|Automated crossing|Traffic signal type|Nature reserve crossing|multiple-choice
Toucan crossing cars and cyclists?|True both can cross|True|False|true-false
School crossing patrol what to do?|Be prepared to stop|Slow down only|Be prepared to stop|Sound horn|Continue normally|multiple-choice
When switch on headlights?|All of above|Only night|All of above|Poor visibility|Between sunset/sunrise|multiple-choice
Use full-beam when traffic approaching?|No|Yes|No|Only motorways|Only if needed|multiple-choice
Parking on clearway?|Never allowed|Never allowed|5 minutes allowed|Certain times|Disabled drivers|multiple-choice
Red X motorway sign means?|That lane closed|Slow down|That lane closed|Accident ahead|End of motorway|multiple-choice
Motorway white arrows pointing left?|Move to left lane|Speed up|Move to left lane|Leave at next exit|Merge left|multiple-choice
National speed limit applies all roads?|False|True|False|true-false
Miss motorway exit what to do?|Take next exit|Reverse to exit|Take next exit|Stop on hard shoulder|Signal and change lanes|multiple-choice
Stop on motorway hard shoulder rest?|Emergency only|Up to 30 minutes|Emergency only|Never|Only if traffic permits|multiple-choice
Puncture on motorway what to do?|Drive to hard shoulder|Stop immediately|Drive to hard shoulder|Pull to verge|Find service area|multiple-choice
Motorway use hard shoulder for?|Emergencies only|Traffic stops|Breaking rules|Emergencies only|Exit when convenient|multiple-choice
Speed limit driving fog visibility below 100m?|Whatever is safe|30 mph|20 mph|Whatever is safe|No limit|multiple-choice
When reversing you should?|Slowly and carefully|Full speed|Slowly and carefully|As fast as possible|Only daylight|multiple-choice
How far reverse on motorway?|Not at all|100 metres|50 metres|Not at all|As far as needed|multiple-choice
Handheld mobile phone while driving?|Parked legally only|Going slowly|Parked legally only|Emergency|Quiet road|multiple-choice
Handheld phone legal with hands-free?|False|True|False|true-false
Dazzled by oncoming headlights?|Slow down avoid looking|Flash lights|Slow down avoid looking|Use horn|Increase speed|multiple-choice
Parking uphill no kerb turn wheels?|Away from kerb|Away from kerb|Towards kerb|Doesn't matter|Straight|multiple-choice
Parking downhill turn wheels?|Towards kerb|Away from kerb|Towards kerb|Doesn't matter|Straight|multiple-choice
Always park facing traffic flow?|False|True|False|true-false
Minimum age driving car UK?|17|16|17|18|21|multiple-choice
New drivers display L-plates D-plates?|True|True|False|true-false
New driver probationary period?|2 years|1 year|2 years|3 years|5 years|multiple-choice
Pass driving test unsupervised immediately?|Yes|Yes|No only with adult|No certain roads|Only if instructed|multiple-choice
Speed adjust wet conditions?|Appropriate for conditions|10 mph slower|20 mph slower|Appropriate for conditions|No change|multiple-choice
Skidding likely on surface?|Wet or icy roads|Tarmac|Wet or icy roads|Concrete|Gravel|multiple-choice
Vehicle starts skid what to do?|Steer same direction as skid|Brake firmly|Steer same direction as skid|Accelerate|Use handbrake|multiple-choice
ABS prevents wheel locking?|True|True|False|true-false
Vehicle slides on ice?|Reduce pedal pressure steer firmly|Brake hard|Reduce pedal pressure steer firmly|Accelerate|Honk horn|multiple-choice
Drive down steep hill?|Low gear gentle braking|Neutral with braking|Low gear gentle braking|Any speed|Constant acceleration|multiple-choice
Riding brake descending long hill?|Brake fade|Improved control|Brake fade|Better stopping power|Smoother descent|multiple-choice
What is brake fade?|Loss braking power heat buildup|Loss braking power heat buildup|Vehicle color type|Loss engine power|Tire deterioration|multiple-choice
Emergency safest place stop?|Hard shoulder or verge|Middle of road|Hard shoulder or verge|Under bridge|At junction|multiple-choice
Break down motorway first?|Switch on hazard lights|Get out wave|Switch on hazard lights|Get everyone out|Call for help|multiple-choice
After breakdown motorway where wait?|Outside vehicle away traffic|In vehicle on shoulder|Outside vehicle away traffic|At junction|Under bridge|multiple-choice
Speed limit residential area?|20 mph|20 mph|30 mph|40 mph|50 mph|multiple-choice
Sound horn alert road users?|True|True|False|true-false
Horn always best communicate?|False|True|False|true-false
Before opening door busy road?|All of above|Check mirrors|All of above|Look for traffic|Use hand signal|multiple-choice
Winter start braking earlier?|Twice as far|Half distance|Twice as far|Three times|Same distance|multiple-choice
What is skid pan used?|Practice control slippery conditions|Racing|Practice control slippery conditions|Test speed|Test fuel efficiency|multiple-choice
Driving on snow what to do?|Gentle acceleration smooth steering|Aggressive acceleration|Gentle acceleration smooth steering|Sudden braking|Horn frequently|multiple-choice
Traction control helps prevent?|Loss of grip|Loss of grip|Engine overheating|Fuel consumption|Tire wear|multiple-choice
What does ESP do?|Maintain stability emergency maneuvers|Improves fuel efficiency|Maintain stability emergency maneuvers|Increases speed|Prevents skidding only|multiple-choice
Safe use cruise control motorways?|Yes but stay alert|Never too dangerous|Yes but stay alert|Only daylight|Only dry roads|multiple-choice
What is aquaplaning?|Vehicle skids on water layer|Smooth braking|Vehicle skids on water layer|Loss of traction|Engine flooding|multiple-choice
High speed and standing water?|Risk of aquaplaning|Risk of aquaplaning|Smooth ride|Improved grip|Fuel efficiency|multiple-choice
To prevent aquaplaning?|Reduce speed in heavy rain|Increase speed|Reduce speed in heavy rain|Use cruise control|Brake suddenly|multiple-choice

Traffic Signs|90|
Triangular red-bordered sign indicates?|Warning of danger|Mandatory instruction|Warning of danger|Information|Prohibition|multiple-choice
Circular red-bordered sign indicates?|Prohibition or mandatory|Warning|Prohibition or mandatory|Information|End restriction|multiple-choice
Blue circular sign mandatory instruction?|True|True|False|true-false
Rectangular green sign indicates?|Positive instruction info|Danger ahead|Positive instruction info|Mandatory instruction|Prohibition|multiple-choice
No entry sign looks like?|Red circle white bar|Red triangle|Red circle white bar|Blue circle|Yellow triangle|multiple-choice
Do Not Enter sign means?|You must not go|Proceed cautiously|You must not go|Turn around|Exit immediately|multiple-choice
Ignore no entry sign if road empty?|False|True|False|true-false
Keep Right sign looks like?|Blue arrow pointing right|Blue arrow pointing right|Red triangle|Circle arrow|Square arrow|multiple-choice
Keep Left sign indicates?|Keep left of this sign|Always drive left|Keep left of this sign|Pass on left|Turn left ahead|multiple-choice
Triangular red X sign?|Dangerous junction|No parking|Dangerous junction|No entry|End motorway|multiple-choice
End of Motorway sign looks like?|Blue rectangular|Blue rectangular|Red circle|Green arrow|White rectangle|multiple-choice
Pedestrian crossing triangular?|True|True|False|true-false
School warning sign?|Red triangle with children|Red triangle with children|Blue square|Yellow rectangle|Red circle|multiple-choice
School warning sign should?|Slow down be vigilant|Speed up clear area|Slow down be vigilant|Continue normally|Be prepared to stop|multiple-choice
Hospital sign looks like?|Blue square with H|Red square H|Blue square with H|Yellow triangle|Green rectangle|multiple-choice
Give Way sign looks like?|Red triangle pointing down|Red circle|Red triangle pointing down|Blue square|Yellow diamond|multiple-choice
Give Way sign must stop?|False|True|False|true-false
No Parking sign looks like?|Red circle bar P|Red circle P|Red circle bar P|Blue circle|Yellow rectangle|multiple-choice
No Waiting sign no park?|True|True|False|true-false
Stop sign looks like?|Red octagon|Red circle|Red hexagon|Red octagon|Red square|multiple-choice
Stop sign complete halt?|True|True|False|true-false
Yield Give Way indicates?|Slow check proceeding|Must stop|Slow check proceeding|Parking permitted|Turn left|multiple-choice
Slippery Road sign?|Slippery conditions|Wet surface|Slippery conditions|Gravel surface|Speed limit change|multiple-choice
Chevron curve alignment?|Sharp curve ahead|Sharp curve ahead|Junction|Hill|Roadwork|multiple-choice
Roadworks triangular sign?|All of above|Road construction|All of above|Be prepared stop|Reduce speed|multiple-choice
Hill Descent triangular?|Steep hill ahead|Steep hill ahead|Place to stop|Junction|Scenic view|multiple-choice
Uneven Road warning?|Bumpy surface|Bumpy surface|Speed reduction|Be cautious|Stop ahead|multiple-choice
Deer Crossing sign?|Animals cross area|Only near forests|Animals cross area|Motorways only|National parks|multiple-choice
Pedestrian Crossing warns?|All of above|Pedestrians cross here|All of above|Reduce speed|Be prepared stop|multiple-choice
Bicycle Crossing warns?|Cyclists crossing|Cyclists crossing|Bike lane ahead|Reduce speed|Turn left|multiple-choice
Mandatory instruction signs color?|Blue|Red|Blue|Green|Yellow|multiple-choice
Information signs typically?|Rectangular|Triangular|Rectangular|Circular|Diamond-shaped|multiple-choice
Speed limit signs typically?|Circular|Triangular|Circular|Rectangular|Diamond-shaped|multiple-choice
Circular white bar through symbol?|Prohibition|Mandatory|Prohibition|Warning|Information|multiple-choice
No Left Turn sign?|Left turns prohibited|Left turns prohibited|Turn right only|No vehicles|One-way traffic|multiple-choice
No Right Turn sign?|Right arrow bar through|Right arrow bar through|Left arrow|Red circle|Blue square|multiple-choice
No U-Turn sign?|U-turns prohibited|U-turns prohibited|Turning unsafe|Road one-way|Reverse not allowed|multiple-choice
No Overtaking applies to?|All vehicles|Large vehicles|All vehicles|Certain conditions|Motorcycles only|multiple-choice
No Parking with times?|Don't park during times|Never park|Don't park during times|Park only during times|Park busy hours|multiple-choice
Peak Hours sign indicates?|Restrictions apply those hours|Max speed rush hour|Restrictions apply those hours|Speed increases peak|Road closes peak|multiple-choice
End of prohibition sign?|Gray circle black line|Red circle bar|Gray circle black line|Red circle|Blue rectangle|multiple-choice
Mandatory Seatbelt sign?|Person with seatbelt|Person standing|Person with seatbelt|Car symbol|Blue square|multiple-choice
Mandatory Helmet sign?|Required by law|Required by law|Suggested safety|Optional adults|Only children|multiple-choice
Directional signs typically?|All of above|Route numbers|All of above|Destination names|Distance|multiple-choice
Tourist Information sign?|Information sign|Warning sign|Information sign|Prohibition|Mandatory sign|multiple-choice
Accessible sign indicates?|Easy access disabled|Easy access disabled|Tourist attraction|Parking availability|Information center|multiple-choice
Authorized Vehicles sign?|Only certain vehicles|All vehicles|Only certain vehicles|No vehicles|Must be licensed|multiple-choice
Weight limits sign?|Information sign|Warning sign|Information sign|Prohibition|Mandatory sign|multiple-choice
Steep Hill warning?|Sharp gradient|Gradual slope|Sharp gradient|Hills distance|Level road|multiple-choice
Loose Gravel warns?|Poor grip surfaces|Rock debris|Poor grip surfaces|Dusty conditions|Construction materials|multiple-choice
Two-Way Traffic sign?|Opposite direction ahead|Dual carriageway ends|Opposite direction ahead|Roundabout|Junction|multiple-choice
Disabled People warning?|People may cross|People may cross|Disabled parking|Disabled facilities|Be prepared help|multiple-choice
Car skidding sign?|Slippery conditions|Accident ahead|Slippery conditions|Reduce speed|Be cautious|multiple-choice
Wildlife Crossing sign?|Animals cross road|Zoo ahead|Animals cross road|National park|Safari route|multiple-choice
Blue circle white image?|Mandatory instruction|Prohibition|Mandatory instruction|Warning|Information|multiple-choice
Minimum Speed sign?|Min speed maintain|Max speed|Min speed maintain|Recommended speed|Average speed|multiple-choice
National Speed Limit sign?|National limit effect|Speed limit end|National limit effect|Speed reduction|Speed increase|multiple-choice
Temporary Speed Limit?|Speed reduced temporarily|Speed reduced|Permanent reduction|No speed limit|Increase speed|multiple-choice
Circular black white number bar?|Speed limit|No entry|Speed limit|Parking time|Distance|multiple-choice

Road Markings|80|
Solid white center line mean?|Do not cross|Do not cross|Can cross if safe|Slow down|Stop ahead|multiple-choice
Solid white your side overtake?|True|True|False|true-false
Broken white center indicate?|Can cross if safe|Cannot cross|Can cross if safe|Stop imminent|Sharp bend|multiple-choice
Double white solid your side?|Cannot overtake|Can overtake|Cannot overtake|Slow down|Stop ahead|multiple-choice
Double white solid opposite side?|Can overtake if safe|Can overtake|Can overtake if safe|Cannot overtake|Passing opposite only|multiple-choice
Both lines solid neither overtake?|True|True|False|true-false
Yellow edge line mean?|Parking restrictions|Parking restrictions|Pedestrian area|Cycling lane|Loading zone|multiple-choice
Single yellow no parking?|Restricted hours only|Any time|Restricted hours only|Weekends|Rush hour|multiple-choice
Double yellow no parking?|All times|Some hours|All times|Night only|Certain vehicles|multiple-choice
Check local signs parking yellow?|True|True|False|true-false
No Parking Zone marked?|Red lines|Red lines|Yellow lines|White lines|Blue lines|multiple-choice
Bus Stop typically?|Red box|Yellow box|Red box|White box|Blue box|multiple-choice
Park bus stop night buses?|False|True|False|true-false
Hatched Area Diagonal Stripes?|No parking area|Parking area|No parking area|Pedestrian crossing|Cycle lane|multiple-choice
Chevron markings?|Sharp bend approaching|Speed reduction|Sharp bend approaching|Curve|Yield oncoming|multiple-choice
Dead End marking?|T-shape|Solid line|T-shape|Dashed line|Cross marking|multiple-choice
Keep Clear box purpose?|Area kept clear traffic|Parking area|Area kept clear traffic|Bus stop|Pedestrian crossing|multiple-choice
Stop Keep Clear box?|False|True|False|true-false
Give Way line edge?|Broken white|Solid white|Broken white|Double white|Hatched area|multiple-choice
Triangular marking intersection?|Give way|Stop sign|Give way|One-way|Pedestrian|multiple-choice
Bicycle Lane looks like?|Blue bicycle symbol|White dashed|Blue bicycle symbol|Yellow markings|Red lines|multiple-choice
Park in bicycle lane?|No any time|Yes if brief|No any time|Yes off-peak|Only weekends|multiple-choice
Box Junction?|Yellow grid area|No entry|Yellow grid area|Pedestrian only|One-way system|multiple-choice
Cannot enter box unless exit?|True|True|False|true-false
White T side road?|Dead end|Stop ahead|Dead end|Give way|Turn prohibition|multiple-choice
Taxi marking label?|Taxis and bicycles|Taxis buses only|Taxis and bicycles|Taxis parking|All vehicles permits|multiple-choice
Disabled marking?|Disabled parking|Disabled parking|Pedestrian crossing|Special access|Medical facility|multiple-choice
Park disabled space blue badge?|Yes|Yes|No|Short periods|Permission|multiple-choice
Resident Parking Only?|Residents permits|Open parking|Residents permits|Temporary|All-day allowed|multiple-choice
Visitor resident parking?|Limited time permit|Any duration|Limited time permit|Never|Permission only|multiple-choice
Loading Only marking?|Loading/unloading only|Parking allowed|Loading/unloading only|Temp stopping|Permits only|multiple-choice
Loading bay time-limited?|True|True|False|true-false
White No Entry looks?|Line across road|Line across road|Circle bar|Broken line|Solid line|multiple-choice
Stop line place?|Stop sign|Give way|Stop sign|Slow down|No entry|multiple-choice
Arrowhead Chevron marking?|Direction indicator|Parking area|Direction indicator|Warning bend|Speed limit|multiple-choice
Rumble Strip consists?|Textured surface|Painted lines|Textured surface|Raised bumps|Colored pavement|multiple-choice
Rumble strips designed?|Alert drowsy drivers|Slow traffic|Alert drowsy drivers|Indicate lanes|Mark hazards|multiple-choice
Green Route indicates?|Designated cycle|Environmental road|Designated cycle|Bus priority|Green space|multiple-choice
Red Route means?|No stopping any time|Dangerous|No stopping any time|Bus lane|Speed restriction|multiple-choice
Mandatory Cycle Lane?|Cyclists must use|Suggested cyclists|Cyclists must use|Optional area|Shared use path|multiple-choice
Enter mandatory cycle?|No never|Yes briefly|No never|Yes if none|Only intersections|multiple-choice
Segregated Cycle Track?|Separate area cyclists|Cycle lane road|Separate area cyclists|Painted route|Shared pavement|multiple-choice
Contraflow cycle lane?|Opposite to traffic|Opposite to traffic|Two-way|One side only|Shared with cars|multiple-choice
Contraflow special markings?|True|True|False|true-false
Shared Space area?|Pedestrians cyclists vehicles|Pedestrians cyclists|Pedestrians cyclists vehicles|Pedestrians only|Mixed vehicle types|multiple-choice
Shared space vehicles?|Slow respect others|Go fast|Slow respect others|Have priority|Use horn|multiple-choice
Pedestrian Zone marking?|Vehicles prohibited access|Pedestrians priority|Vehicles prohibited access|Shared space|Slow zone|multiple-choice
Drive pedestrian zone off-hours?|Yes specified times|Yes always|Yes specified times|No never|Permission|multiple-choice
School Keep Clear?|Clear near schools|Bus parking|Clear near schools|Vehicle priority|Emergency|multiple-choice
Cats Eyes road?|Reflective markers|Real cats|Reflective markers|Speed bumps|Paving stones|multiple-choice
Cats Eyes visibility?|Nighttime|Daytime|Nighttime|Both day night|Foggy|multiple-choice
Cats Eyes typically color?|Varies function|Red|Varies function|White|Amber|multiple-choice
Red cats eyes mark?|Left edge road|Left edge road|Center road|Right edge|Hazards|multiple-choice
Amber cats eyes?|Central reservations|Road edges|Central reservations|Lane|Hazards|multiple-choice
White cats eyes?|Lane separations|Lane separations|Road edges|Junctions|All boundaries|multiple-choice
Orange cats eye?|Temporary layout|Road edges|Temporary layout|Lane changes|Hazards|multiple-choice
Yellow cats eyes?|Bus lanes|Road edges|Bus lanes|Cycle lanes|Parking areas|multiple-choice
No Waiting line?|Red line|Yellow line|Red line|White line|Blue line|multiple-choice
Red No Waiting line?|No stopping any time|No park hours|No stopping any time|Parking restricted|Loading only|multiple-choice
Parking Meter marking?|Time-limited parking|Free parking|Time-limited parking|Disabled|Permit|multiple-choice
Clearway marked?|Yellow lines|Yellow lines|Red lines|Blue lines|Green lines|multiple-choice
On Clearway cannot park?|Any time|Business hours|Any time|Peak hours|Weekends|multiple-choice
Mandatory cycle lane boundary?|White solid line|Yellow dashed|White solid line|Red dashed|Blue solid|multiple-choice
Dashed cycle lane means?|Cross temporarily|Cyclists stop|Cross temporarily|End lane|Turn required|multiple-choice
""".strip()

def parse_questions():
    questions = []
    lines = QUESTION_DATA.split('\n')
    current_category = None
    current_concept = None
    q_id = 1
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check if this is a category header (contains category name and count)
        if '|' in line and line.count('|') == 2:
            parts = line.split('|')
            if parts[1].isdigit():
                current_category = parts[0]
                current_concept = parts[0].lower().replace(' ', '_')
                continue
        
        # Parse question line
        if '|' in line and current_category:
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 6:
                question = parts[0]
                answer = parts[1]
                q_type = parts[-1]
                options = parts[2:-1]
                
                # Ensure we have 4 options for multiple-choice
                if len(options) == 4:
                    questions.append({
                        "id": f"{current_concept}_{q_id:03d}",
                        "question": question,
                        "options": options,
                        "answer": answer,
                        "conceptId": current_concept,
                        "category": current_category,
                        "type": q_type
                    })
                    q_id += 1
    
    return questions

# Generate and save
questions = parse_questions()

# Save to file
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')

print(f"Generated {len(questions)} questions")
print(f"Saved to data/driving-theory-questions.json")
print(f"\nDistribution:")
categories = {}
for q in questions:
    cat = q['category']
    categories[cat] = categories.get(cat, 0) + 1

for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count} questions")
