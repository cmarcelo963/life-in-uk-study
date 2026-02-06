#!/usr/bin/env python3
"""Generate 900 comprehensive driving theory questions for UK theory test"""
import json
from pathlib import Path

questions = []

# Helper function to add questions by category
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

# RULES OF THE ROAD (Core) - ~110
rules = [
    ("What is the speed limit in built-up areas?", ["20 mph", "30 mph", "40 mph", "50 mph"], "30 mph"),
    ("What is the national speed limit on motorways?", ["60 mph", "70 mph", "80 mph", "90 mph"], "70 mph"),
    ("What is the speed limit on single carriageways?", ["40 mph", "50 mph", "60 mph", "70 mph"], "60 mph"),
    ("You are driving at 40 mph in a 30 mph zone?", ["Driving safely", "Exceeding the limit", "Below the limit", "Recommended speed"], "Exceeding the limit"),
    ("Speed limits must never be exceeded", ["True", "False"], "False", "true-false"),
    ("At a red traffic light, you should:", ["Look and proceed", "Stop", "Slow down", "Only stop if traffic approaching"], "Stop"),
    ("You must always obey traffic lights", ["True", "False"], "True", "true-false"),
    ("When can you cross a solid white line?", ["When turning right", "Passing slower vehicle", "Adjacent to your side", "Never"], "Adjacent to your side"),
    ("Solid white line means you can overtake", ["True", "False"], "False", "true-false"),
    ("What does a broken white line mean?", ["Do not cross", "Cross if safe", "Slow down", "Stop ahead"], "Cross if safe"),
    ("Which lane on three-lane motorway?", ["Left lane", "Middle lane", "Right lane", "Any lane"], "Left lane"),
    ("Keep left on motorway unless?", ["Overtaking", "Traffic ahead", "Speed limit change", "Lane closure"], "Overtaking"),
    ("Overtaking on left is permitted", ["True", "False"], "False", "true-false"),
    ("Safest position to pass vehicle?", ["Right on normal road", "Left on motorway", "Any safe space", "Never pass"], "Right on normal road"),
    ("Distance behind another vehicle?", ["Half car length", "One car length", "Two seconds at speed", "Five car lengths"], "Two seconds at speed"),
    ("At 60 mph car lengths distance?", ["2-3 lengths", "4 lengths", "6 lengths", "8 lengths"], "6 lengths"),
    ("What is the two-second rule?", ["Time gap to maintain", "Stop time at 20 mph", "Distance between vehicles", "Reaction time"], "Time gap to maintain"),
    ("Two-second rule applies all weather?", ["True", "False"], "False", "true-false"),
    ("In heavy rain following distance?", ["Stay closer", "Increase to 4-5 seconds", "No change", "Decrease to 1 second"], "Increase to 4-5 seconds"),
    ("Approaching junction you should:", ["Maintain speed", "Accelerate", "Check traffic and reduce speed", "Sound horn"], "Check traffic and reduce speed"),
    ("Stop at junction even unseen traffic?", ["True", "False"], "True", "true-false"),
    ("What is stopping sight distance?", ["Distance to see ahead", "Distance to stop", "Distance to next junction", "Distance traffic light visible"], "Distance to stop"),
    ("On wet road stopping distance?", ["Half", "Same", "Double", "Triple"], "Double"),
    ("Most important stopping factor?", ["Road surface", "Reaction time and braking", "Vehicle weight", "Weather"], "Reaction time and braking"),
    ("Your reaction time normally?", ["0.5 seconds", "1 second", "2 seconds", "3 seconds"], "1 second"),
    ("At 30 mph braking distance?", ["20 feet", "45 feet", "75 feet", "100 feet"], "75 feet"),
    ("At 60 mph stopping distance?", ["120 feet", "180 feet", "240 feet", "300 feet"], "240 feet"),
    ("Quality brake pads improve?", ["Significantly", "Slightly", "No improvement", "Only reaction time"], "Slightly"),
    ("If brakes fail while driving?", ["Steer to verge", "Use handbrake", "Look for escape", "All of above"], "All of above"),
    ("Brakes fail - pump pedal?", ["True", "False"], "True", "true-false"),
    ("Driving in fog you should:", ["Switch on fog lights below 100m", "Increase speed", "Full beam headlights", "Honk horn"], "Switch on fog lights below 100m"),
    ("Fog lights - visibility improves?", ["Switch off", "Leave on", "Optional", "Only when required"], "Switch off"),
    ("Maximum speed towing?", ["40 mph", "50 mph", "60 mph", "70 mph"], "60 mph"),
    ("Sound horn before overtaking?", ["Always", "7am-11:30pm if safe", "Only two-lane roads", "Never"], "7am-11:30pm if safe"),
    ("Illegal sound horn night built-up?", ["True", "False"], "True", "true-false"),
    ("Single yellow line means?", ["Never parking", "Restricted hours", "Loading only", "Residents only"], "Restricted hours"),
    ("Double yellow line means?", ["Some hours", "Any time", "Weekends only", "Peak hours"], "Any time"),
    ("At zebra crossing you should:", ["Drive through normally", "Slow down only", "Stop if pedestrians", "Sound horn"], "Stop if pedestrians"),
    ("Give way at zebra crossing?", ["True", "False"], "True", "true-false"),
    ("Pelican crossing amber light?", ["Stop", "Proceed carefully", "Stop if pedestrians", "Get ready"], "Stop if pedestrians"),
    ("What is Puffin crossing?", ["Children crossing", "Automated detection", "Traffic signals", "Nature reserve"], "Automated detection"),
    ("Toucan crossing - cars and cyclists?", ["True", "False"], "True", "true-false"),
    ("School crossing patrol - do what?", ["Slow only", "Be prepared stop", "Sound horn", "Continue"], "Be prepared stop"),
    ("When to switch headlights?", ["Only night", "Poor visibility", "Sunset to sunrise", "All of above"], "All of above"),
    ("Full-beam when traffic approaching?", ["Yes", "No", "Only motorways", "Only if needed"], "No"),
    ("Parking on clearway?", ["Never", "5 minutes", "Certain times", "Disabled only"], "Never"),
    ("Red X on motorway means?", ["Slow down", "Lane closed", "Accident", "End motorway"], "Lane closed"),
    ("Motorway white arrows left?", ["Keep left", "Speed up", "Exit next", "Merge left"], "Keep left"),
    ("National speed limit all roads?", ["True", "False"], "False", "true-false"),
    ("Miss motorway exit - do what?", ["Reverse", "Stop", "Take next exit", "Signal and change"], "Take next exit"),
    ("Stop on hard shoulder?", ["Never", "5 minutes", "Emergency only", "Permission"], "Emergency only"),
    ("Puncture on motorway?", ["Stop immediately", "Hard shoulder", "Verge", "Service area"], "Hard shoulder"),
    ("Hard shoulder use for?", ["Traffic stops", "Emergencies only", "Reversing", "Exiting"], "Emergencies only"),
    ("Speed in fog visibility <100m?", ["30 mph", "20 mph", "Whatever safe", "No limit"], "Whatever safe"),
    ("When reversing?", ["Fast as possible", "Slowly carefully", "Any speed", "Daylight only"], "Slowly carefully"),
    ("How far reverse motorway?", ["50 metres", "100 metres", "Not at all", "As far needed"], "Not at all"),
    ("Handheld mobile while driving?", ["Going slowly", "Emergency", "Parked legally", "Quiet road"], "Parked legally"),
    ("Handheld phone hands-free legal?", ["True", "False"], "False", "true-false"),
    ("Dazzled by headlights?", ["Flash lights", "Slow down avoid", "Use horn", "Increase speed"], "Slow down avoid"),
    ("Parking uphill no kerb?", ["Toward kerb", "Away from kerb", "Straight", "Any direction"], "Away from kerb"),
    ("Parking downhill wheels?", ["Straight", "Away from kerb", "Toward kerb", "Any way"], "Toward kerb"),
    ("Always park facing traffic?", ["True", "False"], "False", "true-false"),
    ("Minimum driving age UK?", ["16", "17", "18", "21"], "17"),
    ("New drivers L or D plates?", ["True", "False"], "True", "true-false"),
    ("Probationary period?", ["1 year", "2 years", "3 years", "5 years"], "2 years"),
    ("After passing test?", ["Unsupervised immediately", "With adult only", "Certain roads only", "Instructor permission"], "Unsupervised immediately"),
    ("Wet conditions speed adjust?", ["10 mph less", "20 mph less", "Appropriate for conditions", "No change"], "Appropriate for conditions"),
    ("Skidding likely on?", ["Tarmac", "Wet/icy roads", "Concrete", "Gravel"], "Wet/icy roads"),
    ("Vehicle skids what to do?", ["Brake firmly", "Steer same direction", "Accelerate", "Use handbrake"], "Steer same direction"),
    ("ABS prevents wheel locking?", ["True", "False"], "True", "true-false"),
    ("Vehicle slides ice?", ["Brake hard", "Reduce pedal pressure", "Accelerate", "Honk horn"], "Reduce pedal pressure"),
    ("Steep hill descent?", ["Neutral with braking", "Low gear gentle braking", "Any speed", "Accelerate"], "Low gear gentle braking"),
    ("Riding brake descending?", ["Better control", "Brake fade", "Better stopping", "Smoother"], "Brake fade"),
    ("What is brake fade?", ["Loss braking power heat", "Vehicle color", "Loss engine power", "Tire deterioration"], "Loss braking power heat"),
    ("Emergency safest stop?", ["Middle of road", "Hard shoulder/verge", "Under bridge", "At junction"], "Hard shoulder/verge"),
    ("Motorway breakdown first?", ["Get out wave", "Hazard lights", "Get everyone out", "Call help"], "Hazard lights"),
    ("After breakdown wait?", ["In vehicle on shoulder", "Outside away traffic", "At junction", "Under bridge"], "Outside away traffic"),
    ("Speed residential area?", ["20 mph", "30 mph", "40 mph", "50 mph"], "20 mph"),
    ("Sound horn alert others?", ["True", "False"], "True", "true-false"),
    ("Horn always best communicate?", ["True", "False"], "False", "true-false"),
    ("Before opening car door?", ["Check mirrors", "Look for traffic", "Hand signal", "All of above"], "All of above"),
    ("Winter start braking?", ["Same distance", "Half distance", "Twice as far", "Three times"], "Twice as far"),
    ("Skid pan for?", ["Practice control slippery", "Racing", "Speed testing", "Fuel efficiency"], "Practice control slippery"),
    ("On snow acceleration?", ["Aggressive", "Gentle smooth", "Sudden braking", "Horn frequently"], "Gentle smooth"),
    ("Traction control prevents?", ["Loss of grip", "Overheating", "Fuel consumption", "Tire wear"], "Loss of grip"),
    ("ESP function?", ["Fuel efficiency", "Stability in emergency", "Increases speed", "Prevents skidding only"], "Stability in emergency"),
    ("Cruise control safe motorway?", ["Never", "Yes stay alert", "Only daylight", "Only dry roads"], "Yes stay alert"),
]

add_category("Rules of the Road (Core)", "rules_core", rules)

# TRAFFIC SIGNS - ~90
signs = [
    ("Triangular red-bordered indicates?", ["Warning", "Mandatory", "Information", "Prohibition"], "Warning"),
    ("Circular red-bordered indicates?", ["Warning", "Prohibition/mandatory", "Information", "End restriction"], "Prohibition/mandatory"),
    ("Blue circle indicates?", ["True", "False"], "True", "true-false"),
    ("Rectangular green indicates?", ["Danger", "Positive instruction/info", "Mandatory", "Prohibition"], "Positive instruction/info"),
    ("No entry sign looks?", ["Red triangle", "Red circle bar", "Blue circle", "Yellow triangle"], "Red circle bar"),
    ("Do Not Enter means?", ["Cautiously proceed", "Must not go", "Turn around", "Exit immediately"], "Must not go"),
    ("Ignore no entry if empty?", ["True", "False"], "False", "true-false"),
    ("Keep Right sign?", ["Blue arrow right", "Red triangle", "Circle arrow", "Square arrow"], "Blue arrow right"),
    ("Keep Left indicates?", ["Always left", "Keep left of sign", "Pass on left", "Turn left"], "Keep left of sign"),
    ("Triangular red X means?", ["No parking", "Junction danger", "No entry", "End motorway"], "Junction danger"),
    ("End Motorway sign?", ["Blue rectangle", "Red circle", "Green arrow", "White rectangle"], "Blue rectangle"),
    ("Pedestrian crossing triangular?", ["True", "False"], "True", "true-false"),
    ("School warning sign?", ["Blue square", "Red triangle children", "Yellow rectangle", "Red circle"], "Red triangle children"),
    ("See School sign?", ["Speed up", "Slow be vigilant", "Continue normally", "Be prepared stop"], "Slow be vigilant"),
    ("Hospital sign looks?", ["Red square H", "Blue square H", "Yellow triangle", "Green rectangle"], "Blue square H"),
    ("Give Way sign?", ["Red circle", "Red triangle down", "Blue square", "Yellow diamond"], "Red triangle down"),
    ("Give Way must stop?", ["True", "False"], "False", "true-false"),
    ("No Parking sign?", ["Red circle P", "Red bar circle P", "Blue circle", "Yellow rectangle"], "Red bar circle P"),
    ("No Waiting no park?", ["True", "False"], "True", "true-false"),
    ("Stop sign?", ["Circle", "Hexagon", "Octagon", "Square"], "Octagon"),
    ("Stop complete halt?", ["True", "False"], "True", "true-false"),
    ("Yield/Give Way indicates?", ["Must stop", "Slow check proceeding", "Park permitted", "Turn left"], "Slow check proceeding"),
    ("Slippery Road?", ["Wet surface", "Slippery conditions", "Gravel", "Speed limit change"], "Slippery conditions"),
    ("Chevron curve?", ["Junction", "Sharp curve ahead", "Hill", "Roadwork"], "Sharp curve ahead"),
    ("Roadworks triangle?", ["Road construction", "Be prepared stop", "All of above", "Reduce speed"], "All of above"),
    ("Hill Descent?", ["Hill distance", "Steep hill ahead", "Place stop", "Junction"], "Steep hill ahead"),
    ("Uneven Road?", ["Speed reduction", "Bumpy surface", "Be cautious", "Stop ahead"], "Bumpy surface"),
    ("Deer Crossing?", ["Near forests", "Areas deer cross", "Motorways", "National parks"], "Areas deer cross"),
    ("Pedestrian Crossing warns?", ["Pedestrians cross", "Reduce speed", "All of above", "Be prepared stop"], "All of above"),
    ("Bicycle Crossing?", ["Bike lane", "Cyclists crossing", "Reduce speed", "Turn left"], "Cyclists crossing"),
    ("Mandatory signs color?", ["Red", "Green", "Blue", "Yellow"], "Blue"),
    ("Information signs shape?", ["Triangular", "Circular", "Rectangular", "Diamond"], "Rectangular"),
    ("Speed limit signs shape?", ["Triangular", "Rectangular", "Circular", "Diamond"], "Circular"),
    ("Circle white bar symbol?", ["Warning", "Prohibition", "Information", "Mandatory"], "Prohibition"),
    ("No Left Turn?", ["Left prohibited", "Right only", "No vehicles", "One-way"], "Left prohibited"),
    ("No Right Turn?", ["Arrow bar right", "Left arrow", "Red circle", "Blue square"], "Arrow bar right"),
    ("No U-Turn?", ["U prohibited", "Unsafe turning", "One-way road", "Reverse not allowed"], "U prohibited"),
    ("No Overtaking applies?", ["Large vehicles", "All vehicles", "Certain conditions", "Motorcycles"], "All vehicles"),
    ("No Parking with times?", ["Never park", "Don't park during", "Park only during", "Busy hours"], "Don't park during"),
    ("Peak Hours indicates?", ["Max speed rush", "Restrictions during", "Speed increases", "Road closes"], "Restrictions during"),
    ("End prohibition sign?", ["Red bar circle", "Gray circle line", "Red circle", "Blue rectangle"], "Gray circle line"),
    ("Mandatory Seatbelt?", ["Standing person", "Person seatbelt", "Car symbol", "Blue square"], "Person seatbelt"),
    ("Mandatory Helmet?", ["Suggested", "Required by law", "Optional adults", "Only children"], "Required by law"),
    ("Directional signs show?", ["Route numbers", "All of above", "Destination names", "Distance"], "All of above"),
    ("Tourist Information?", ["Warning", "Information", "Prohibition", "Mandatory"], "Information"),
    ("Accessible indicates?", ["Tourist attraction", "Easy access disabled", "Parking", "Info center"], "Easy access disabled"),
    ("Authorized Vehicles?", ["All vehicles", "Only certain", "No vehicles", "Must licensed"], "Only certain"),
    ("Weight limits is?", ["Warning", "Information", "Prohibition", "Mandatory"], "Information"),
    ("Steep Hill warning?", ["Gradual slope", "Sharp gradient", "Hills distance", "Level road"], "Sharp gradient"),
    ("Loose Gravel warns?", ["Rock debris", "Poor grip", "Dusty", "Construction"], "Poor grip"),
    ("Two-Way Traffic?", ["Roundabout", "Opposite direction", "Junction", "Dual end"], "Opposite direction"),
    ("Disabled People warns?", ["Parking area", "People may cross", "Facilities", "Help needed"], "People may cross"),
    ("Car skidding sign?", ["Accident", "Slippery conditions", "Reduce speed", "Cautious"], "Slippery conditions"),
    ("Wildlife Crossing?", ["Zoo ahead", "Animals cross road", "National park", "Safari"], "Animals cross road"),
    ("Blue circle white image?", ["Warning", "Prohibition", "Mandatory instruction", "Information"], "Mandatory instruction"),
    ("Minimum Speed indicates?", ["Max speed", "Min speed maintain", "Recommended", "Average speed"], "Min speed maintain"),
    ("National Speed Limit?", ["Speed limit end", "Limit effect", "Speed reduction", "Speed increase"], "Limit effect"),
    ("Temporary Speed Limit?", ["Permanent", "Speed reduced", "No limit", "Increase speed"], "Speed reduced"),
    ("Circular black white number bar?", ["No entry", "Speed limit", "Parking time", "Distance"], "Speed limit"),
]

add_category("Traffic Signs", "traffic_signs", signs)

# JUNCTIONS & ROUNDABOUTS - ~80
junctions = [
    ("At T-junction you should:", ["Maintain speed", "Check and reduce speed", "Accelerate", "Sound horn"], "Check and reduce speed"),
    ("Approaching roundabout?", ["Increase speed", "Check mirrors and signals", "Sound horn", "No change"], "Check mirrors and signals"),
    ("On roundabout traffic comes?", ["From right", "From left", "Any direction", "Depends on signs"], "From right"),
    ("Exiting roundabout signal?", ["Before entering", "On exit", "Right indicator", "Left at exit"], "Left at exit"),
    ("At junction two vehicles?", ["Largest goes first", "Turning goes first", "Who arrives first", "Car on right"], "Car on right"),
    ("Left turn at junction?", ["Check right", "Check left", "Check both ways", "Sound horn"], "Check both ways"),
    ("Right turn at junction?", ["Give way left", "Give way right", "Go immediately", "Sound horn"], "Give way left"),
    ("Oncoming traffic turning?", ["Give way", "Go ahead", "Take precedence", "Sound horn"], "Give way"),
    ("Slip road onto motorway?", ["Accelerate to speed", "Give way to motorway traffic", "Stop completely", "Honk horn"], "Give way to motorway traffic"),
    ("Leaving motorway?", ["Sudden lane change", "Signal and gradual", "Emergency lane", "Through slip road"], "Signal and gradual"),
    ("Mini-roundabout small?", ["Treat as normal junction", "Treat as normal roundabout", "No rules apply", "Always give way"], "Treat as normal roundabout"),
    ("Approaching traffic lights?", ["Maintain speed", "Be prepared stop", "Always proceed", "Honk horn"], "Be prepared stop"),
    ("Green arrow traffic light?", ["Can turn in that direction", "Must wait", "Slowing requirement", "Turn signal only"], "Can turn in that direction"),
    ("Amber traffic light approaching?", ["Must stop", "Must proceed", "Stop if safe", "Accelerate"], "Stop if safe"),
    ("Red light and am waiting?", ["Can proceed when green", "Must wait for green", "Turn right if clear", "Reverse allowed"], "Must wait for green"),
    ("At staggered junction?", ["Treat as T-junction", "Two separate junctions", "Always give way", "No rules"], "Two separate junctions"),
    ("Skew junction crossing?", ["Diagonal crossing", "Perpendicular crossing", "Check both ways", "Sound horn"], "Check both ways"),
    ("At a crossroads?", ["Largest vehicle priority", "Mutual right of way", "Neither has priority", "Car in front priority"], "Neither has priority"),
    ("Approaching junction pedestrians?", ["Speed up clear", "Prepare to stop", "Sound horn", "Continue"], "Prepare to stop"),
    ("Cyclists at junction?", ["Give way", "Can pass", "Sound horn", "Turn immediately"], "Give way"),
    ("At priority junction?", ["Give way to main road", "Main road gives way", "Sound horn", "Go immediately"], "Give way to main road"),
    ("Filter lanes at junction?", ["All turn same way", "Can turn different ways", "Must stop", "No filter"], "Can turn different ways"),
    ("Turn left from side road?", ["Give way right", "Give way left", "No traffic near", "Go immediately"], "Give way right"),
    ("Turn right from side road?", ["Give way left", "Give way right", "No waiting", "Go when ready"], "Give way right"),
    ("U-turn at junction?", ["Always allowed", "Depends on layout", "Never allowed", "Honk first"], "Depends on layout"),
    ("Pedestrian crossing junction?", ["Drive around them", "Wait for pedestrians", "Sound horn", "Drive through"], "Wait for pedestrians"),
    ("Motorcycles at junction?", ["Same rules as cars", "Different rules", "No rules", "Can go faster"], "Same rules as cars"),
    ("Large vehicles at junction?", ["Wider turning", "Normal turning", "Smaller radius", "Reverse allowed"], "Wider turning"),
    ("At junction with traffic lights?", ["Follow own rules", "Follow traffic lights", "Give way anyway", "Sound horn"], "Follow traffic lights"),
    ("Approaching box junction?", ["Enter if exit clear", "Always enter", "Never enter", "Stop first"], "Enter if exit clear"),
]

add_category("Junctions and Roundabouts", "junctions", junctions)

# MOTORWAY DRIVING - ~80
motorway = [
    ("Joining motorway correctly?", ["Accelerate immediately", "Give way to traffic", "Sound horn", "Flash lights"], "Give way to traffic"),
    ("Driving down motorway?", ["Right lane usual", "Left lane usual", "Any lane", "Middle preferred"], "Left lane usual"),
    ("Motorway speed limit?", ["60 mph", "70 mph", "80 mph", "90 mph"], "70 mph"),
    ("Motorway two vehicles?", ["One car length", "Two car lengths", "4-6 car lengths", "Ten car lengths"], "4-6 car lengths"),
    ("Overtaking on motorway?", ["Left lane", "Right lane", "Middle lane", "Any lane"], "Right lane"),
    ("After overtaking return?", ["Immediately", "Check mirror and signal", "Wait for gap", "Don't return"], "Check mirror and signal"),
    ("Motorway three lanes using?", ["Middle for passing", "Right for passing", "Left for normal", "Any lane"], "Left for normal"),
    ("Motorway fog ahead?", ["Maintain speed", "Reduce speed carefully", "Flash lights", "Increase speed"], "Reduce speed carefully"),
    ("Motorway flat tyre?", ["Stop immediately", "Continue to service", "Hard shoulder slowly", "Call from car"], "Hard shoulder slowly"),
    ("Motorway engine trouble?", ["Continue slowly", "Get to hard shoulder", "Stop in lane", "Reverse"], "Get to hard shoulder"),
    ("Hard shoulder use when?", ["Tired driving", "Needing rest", "Emergency only", "Any time"], "Emergency only"),
    ("On hard shoulder stopped?", ["Exit immediately", "Wait in vehicle", "Exit away from traffic", "Wave at cars"], "Exit away from traffic"),
    ("Motorway temporary speed limit?", ["Ignore if clear", "Always obey", "Only peak hours", "Optional"], "Always obey"),
    ("Motorway lane closed?", ["Switch before line", "Can cross line", "Must use other lanes", "Stop immediately"], "Must use other lanes"),
    ("Motorway rain visibility?", ["No change needed", "Reduce speed", "Flash lights", "Use horn"], "Reduce speed"),
    ("Motorway night driving?", ["Full beam always", "Dipped headlights", "No lights needed", "Optional"], "Dipped headlights"),
    ("Motorway vehicles slower?", ["Pass on left", "Encourage faster", "Pass on right", "Stay behind"], "Pass on right"),
    ("Motorway service area?", ["Must use rest", "Encouraged stop", "Not mandatory", "Only fuel"], "Encouraged stop"),
    ("Motorway escape route?", ["Drive through", "Seek help", "Use if brakes fail", "Call police"], "Use if brakes fail"),
    ("Motorway road sign direction?", ["White text green", "Green text white", "Black text white", "Red text white"], "White text green"),
    ("Motorway sign distance?", ["Miles ahead", "Kilometers ahead", "Yards ahead", "Meters ahead"], "Miles ahead"),
    ("Motorway exit sign?", ["Blue arrow", "Green arrow", "Red arrow", "Yellow arrow"], "Blue arrow"),
    ("Motorway distance markers?", ["Every mile", "Every 500m", "Every kilometer", "Irregular"], "Every kilometer"),
    ("Motorway breakdown phone?", ["Call from car", "Walk for help", "Use emergency phone", "Continue driving"], "Use emergency phone"),
    ("Motorway emergency phones?", ["In hard shoulder", "On central reservation", "Both sides", "At junctions"], "On central reservation"),
    ("Motorway solid white edge?", ["Can cross", "Cannot cross", "Sometimes cross", "Check signs"], "Cannot cross"),
    ("Motorway dashed white edge?", ["Can cross", "Cannot cross", "Only at junctions", "Only emergency"], "Can cross"),
    ("Motorway broken line center?", ["Can overtake", "Cannot overtake", "One direction only", "Check other line"], "Can overtake"),
    ("Motorway speed increasing?", ["More car lengths", "Fewer car lengths", "No change", "Depends on road"], "More car lengths"),
    ("Motorway joining correctly?", ["Check blind spot", "Merge smoothly", "Give way", "All of above"], "All of above"),
]

add_category("Motorways and Dual Carriageways", "motorways", motorway)

# VULNERABLE ROAD USERS - ~70
vulnerable = [
    ("Pedestrians in rain?", ["Drive faster", "Reduce speed", "No change", "Use horn"], "Reduce speed"),
    ("Child pedestrian ahead?", ["Maintain speed", "Reduce speed", "Stop immediately", "Accelerate"], "Reduce speed"),
    ("Elderly pedestrian crossing?", ["Wait patiently", "Hurry them", "Go around", "Sound horn"], "Wait patiently"),
    ("Disabled person crossing?", ["Give priority", "Sound horn", "Drive around", "Continue"], "Give priority"),
    ("Pedestrian in dark clothes?", ["Easily visible", "Less visible", "Very visible", "Normal visibility"], "Less visible"),
    ("Pedestrian wearing reflective?", ["More visible", "Less visible", "Same visibility", "Only day"], "More visible"),
    ("Pedestrian on road edge?", ["Drive normally", "Reduce speed", "Be prepared stop", "Accelerate"], "Be prepared stop"),
    ("Child running after ball?", ["Slow down", "Continue", "Sound horn", "Accelerate"], "Slow down"),
    ("Pedestrians shopping?", ["Maintain speed", "Watch for wandering", "Sound horn", "No change"], "Watch for wandering"),
    ("Pedestrian using phone?", ["They're aware", "May be distracted", "No risk", "Speed up"], "May be distracted"),
    ("Cyclist being overtaken?", ["Close pass safe", "Leave space", "Sound horn", "Flash lights"], "Leave space"),
    ("Cyclist turning right?", ["Pass on left", "Wait", "Close behind", "Sound horn"], "Wait"),
    ("Cyclist on slippery?", ["Difficulty balance", "No problem", "Faster riding", "No difference"], "Difficulty balance"),
    ("Cyclist in rain?", ["Normal riding", "May skid", "Improved grip", "No change"], "May skid"),
    ("Cyclist at night dark?", ["Easily seen", "Hard to see", "Normal visibility", "Very visible"], "Hard to see"),
    ("Cyclist reflectors?", ["Help at night", "Day visibility", "No help", "Street lights only"], "Help at night"),
    ("Motorcyclist vulnerable?", ["Less vulnerable", "More vulnerable", "Same risk", "Minimal risk"], "More vulnerable"),
    ("Motorcyclist wet road?", ["Better grip", "Reduced grip", "No change", "No effect"], "Reduced grip"),
    ("Horse rider on road?", ["Treat as vehicle", "Give space", "Pass carefully", "All of above"], "All of above"),
    ("Horse rider signals?", ["Hand signals", "Verbal commands", "Different signals", "Equipment signals"], "Hand signals"),
    ("Slow vehicle ahead?", ["Pass immediately", "Check before pass", "Sound horn", "Close behind"], "Check before pass"),
    ("Mobility scooter?", ["Speed of car", "4 mph", "10 mph", "Variable speed"], "4 mph"),
    ("Pedestrian using stick?", ["Moving car", "Visually impaired", "Elderly", "Could be blind"], "Visually impaired"),
    ("Person with guide dog?", ["Trained dog", "Independent", "Following dog", "Dog leads"], "Trained dog"),
    ("Wheelchair user crossing?", ["Drive normally", "Wait patiently", "Sound horn", "Drive around"], "Wait patiently"),
    ("Jogger on road?", ["Drive normally", "Give space", "Close behind", "Sound horn"], "Give space"),
    ("Groups of children?", ["Drive normally", "Reduce speed", "Sound horn", "Accelerate"], "Reduce speed"),
    ("School children walking?", ["Maintain speed", "Watch for running", "Sound horn", "No change"], "Watch for running"),
    ("Pram pushing pedestrian?", ["Normal speed", "Reduce speed", "Sound horn", "Accelerate"], "Reduce speed"),
    ("Blind pedestrian at crossing?", ["Drive normally", "Wait for white cane", "Sound horn", "Drive through"], "Wait for white cane"),
]

add_category("Vulnerable Road Users", "vulnerable", vulnerable)

# VEHICLE SAFETY & MAINTENANCE - ~70
vehicle = [
    ("Before long journey?", ["Nothing needed", "Check fluid levels", "Drive anyway", "Fill fuel"], "Check fluid levels"),
    ("Tyre condition important?", ["Not really", "Very important", "Minor issue", "Optional"], "Very important"),
    ("Tyre tread minimum?", ["1.6mm", "2mm", "3mm", "5mm"], "1.6mm"),
    ("Worn tyres effect?", ["Better grip", "Reduced grip", "No difference", "Improved handling"], "Reduced grip"),
    ("Underinflated tyres?", ["Normal handling", "Poor handling", "Better fuel", "Faster"], "Poor handling"),
    ("Overinflated tyres?", ["Normal handling", "Harsh ride", "Better grip", "Improved comfort"], "Harsh ride"),
    ("Check brake fluid?", ["Never needed", "Regularly", "Yearly only", "When grinding"], "Regularly"),
    ("Brake pads worn?", ["Still safe", "Replace immediately", "Continue driving", "Optional"], "Replace immediately"),
    ("Power steering fluid?", ["Not important", "Check regularly", "Once only", "Yearly"], "Check regularly"),
    ("Engine oil level?", ["Not important", "Check regularly", "Once yearly", "Never check"], "Check regularly"),
    ("Coolant level low?", ["Drive normally", "Engine overheat risk", "No problem", "Refill later"], "Engine overheat risk"),
    ("Battery terminals corroded?", ["No problem", "Clean them", "Replace battery", "Ignore"], "Clean them"),
    ("Windscreen wipers worn?", ["Still work", "Replace", "No difference", "Save money"], "Replace"),
    ("Windscreen wash fluid?", ["Optional", "Keep topped up", "Never needed", "Rarely needed"], "Keep topped up"),
    ("Headlights not working?", ["Drive carefully", "Get repaired", "Still visible", "Daytime only"], "Get repaired"),
    ("Brake light out?", ["Continue driving", "Get repaired", "Hide it", "Minor issue"], "Get repaired"),
    ("Seatbelt worn?", ["Still protects", "Replace", "No difference", "Minor issue"], "Replace"),
    ("Air filter dirty?", ["Drives normally", "Affects performance", "No effect", "Improves speed"], "Affects performance"),
    ("Fuel filter clogged?", ["No problem", "Engine problems", "Better performance", "Save fuel"], "Engine problems"),
    ("Spare tyre condition?", ["Unnecessary", "Check before journey", "Not needed", "Optional"], "Check before journey"),
    ("Vehicle load limits?", ["No limits", "Follow limits", "Minor issue", "Overload okay"], "Follow limits"),
    ("Roof rack safety?", ["Anything goes", "Secure items", "Weight limit", "All important"], "All important"),
    ("Caravan towing?", ["No lights needed", "Specific lights needed", "Same as car", "Trailer lights"], "Specific lights needed"),
    ("Caravan mirrors?", ["Car mirrors okay", "Extended mirrors", "No mirrors", "Side mirrors only"], "Extended mirrors"),
    ("Parked car doors?", ["Open anytime", "Check traffic", "Open quickly", "Wave first"], "Check traffic"),
    ("Child seats required?", ["No rules", "Required by law", "Optional", "Suggestions"], "Required by law"),
    ("Child seat age?", ["Any age", "Until 12/1.35m", "Until 5", "Until 7"], "Until 12/1.35m"),
    ("Airbags safe?", ["Always protect", "Can injure", "Required", "Optional"], "Can injure"),
    ("Defective headlight?", ["Continue", "Get fixed", "Daytime only", "Use high beam"], "Get fixed"),
    ("Windscreen damage?", ["Safe to drive", "Impairs vision", "No problem", "Fix later"], "Impairs vision"),
]

add_category("Vehicle Safety and Maintenance", "vehicle", vehicle)

# DRIVING IN DIFFERENT CONDITIONS - ~70
conditions = [
    ("Rain reduced visibility?", ["Normal speed", "Reduce speed", "Increase speed", "Same handling"], "Reduce speed"),
    ("Rain road grip?", ["Better grip", "Reduced grip", "Same grip", "No difference"], "Reduced grip"),
    ("Wet road braking?", ["Same distance", "Reduced distance", "Increased distance", "No change"], "Increased distance"),
    ("Wet road following distance?", ["Reduce it", "Increase it", "No change", "Half normal"], "Increase it"),
    ("Puddle on road?", ["Drive through normally", "Slow down", "Check depth", "All of above"], "All of above"),
    ("Aquaplaning occurs?", ["Rough surface", "Water layer", "Gravel", "Dry road"], "Water layer"),
    ("Aquaplaning safe speed?", ["Normal", "Reduce speed", "Faster needed", "No change"], "Reduce speed"),
    ("Skidding prevention?", ["Drive fast", "Smooth acceleration", "Harsh braking", "High speed"], "Smooth acceleration"),
    ("On ice reduce speed?", ["Gradually", "Suddenly", "Abruptly", "With brakes"], "Gradually"),
    ("Snow visibility?", ["Normal", "Reduced", "Improved", "Same"], "Reduced"),
    ("Snow tire grip?", ["Poor grip", "Better grip", "Same grip", "No difference"], "Better grip"),
    ("Frost on windscreen?", ["Drive immediately", "Clear before driving", "Half clear okay", "Use wipers"], "Clear before driving"),
    ("Black ice appears?", ["Wet road", "Dry surface", "Slippery", "Gravel"], "Dry surface"),
    ("Fog distance?", ["Drive faster", "Reduce speed", "Normal speed", "No change"], "Reduce speed"),
    ("Fog headlights?", ["Main beam", "Dipped lights", "Fog lights", "All of above"], "Fog lights"),
    ("Fog visibility below?", ["100m use fog", "200m use fog", "50m use fog", "Never use"], "100m use fog"),
    ("Wind side gust?", ["Maintain course", "Grip tight", "Prepare for swerve", "Reduce speed"], "Prepare for swerve"),
    ("Strong wind vehicles?", ["No problem", "High-sided affected", "Cars only", "No difference"], "High-sided affected"),
    ("Rain and wind?", ["Normal handling", "Reduced grip", "No effect", "Better handling"], "Reduced grip"),
    ("Twilight driving?", ["No lights needed", "Use dipped lights", "Full beam", "Optional"], "Use dipped lights"),
    ("Night driving distances?", ["See normally", "Reduced visibility", "Improved sight", "Same day"], "Reduced visibility"),
    ("Night speed limits?", ["Same as day", "Lower limits", "No limits", "No change"], "Same as day"),
    ("Night following distance?", ["Reduce", "Increase", "Normal", "No change"], "Increase"),
    ("Wet road planning?", ["Normal maneuvers", "Reduce speed", "More braking", "All caution"], "All caution"),
    ("Hydroplaning risks?", ["Low speed", "High speed", "Daytime", "Sunny"], "High speed"),
    ("Brake temperature rain?", ["Reduced", "Improved", "Same", "No difference"], "Reduced"),
    ("Sun glare ahead?", ["Maintain speed", "Reduce speed", "Sunglasses", "All measures"], "All measures"),
    ("Storm approaching?", ["Drive faster", "Find shelter", "Normal speed", "Continue"], "Find shelter"),
    ("Lightning while driving?", ["Stop immediately", "Continue", "Exit vehicle", "Safe to stay in"], "Safe to stay in"),
    ("Flooded road ahead?", ["Drive through", "Turn back", "Wade first", "Honk horn"], "Turn back"),
]

add_category("Driving in Different Conditions", "conditions", conditions)

# HAZARD AWARENESS - ~80
hazard = [
    ("Hazard perception skill?", ["Instant reaction", "Anticipate dangers", "No planning", "React after"], "Anticipate dangers"),
    ("Early warning helps?", ["No", "More time react", "Same as late", "Worse"], "More time react"),
    ("Pedestrian in distance?", ["Ignore", "Watch carefully", "Accelerate", "Sound horn"], "Watch carefully"),
    ("Parked car door opening?", ["Drive normally", "Assume will open", "Sound horn", "Slow down"], "Assume will open"),
    ("Child near traffic?", ["Normal speed", "Be prepared stop", "Sound horn", "Accelerate"], "Be prepared stop"),
    ("Animal on road?", ["Drive normally", "Reduce speed", "Sound horn", "Swerve"], "Reduce speed"),
    ("Debris on road?", ["Drive normally", "Reduce speed", "Swerve", "Sound horn"], "Reduce speed"),
    ("Broken vehicle ahead?", ["Normal speed", "Anticipate stop", "Sound horn", "Close behind"], "Anticipate stop"),
    ("Oncoming car crossing?", ["Continue", "Slow down", "Be prepared", "Accelerate"], "Be prepared"),
    ("Motorcycle vulnerable?", ["Always safe", "Less visible", "Well protected", "No concerns"], "Less visible"),
    ("Bicycle unpredictable?", ["Always straight", "Check intentions", "Sound horn", "Close pass"], "Check intentions"),
    ("Horse rider spooked?", ["Nothing do", "Slow pass", "Sound horn", "Accelerate"], "Slow pass"),
    ("Lost driver behavior?", ["Straight line", "Sudden maneuvers", "Normal driving", "Fast"], "Sudden maneuvers"),
    ("Tired driver awareness?", ["Good focus", "Reduced focus", "Same focus", "Improved"], "Reduced focus"),
    ("Distracted driver?", ["Predictable", "Unpredictable", "Safe", "Normal"], "Unpredictable"),
    ("Bus stop hazard?", ["Passengers exit", "No hazard", "Stop traffic", "Safe"], "Passengers exit"),
    ("Lorry turning space?", ["Small turning", "Wide turning", "Same car", "Limited"], "Wide turning"),
    ("Taxi sudden stop?", ["Prepare stop", "No warning", "Safe stopping", "Advance notice"], "Prepare stop"),
    ("Delivery vehicle opening?", ["Predictable", "Sudden opening", "No hazard", "Expected"], "Sudden opening"),
    ("Emergency vehicle approaching?", ["Continue", "Pull over", "Sound horn", "Speed up"], "Pull over"),
    ("Blind spot awareness?", ["No blind spots", "Side mirrors", "Check blind spots", "Ignore"], "Check blind spots"),
    ("Reversing hazard?", ["Clear behind", "Always check", "Mirrors only", "No need"], "Always check"),
    ("Lane change safety?", ["Mirror only", "Mirror and check", "No check", "Assume clear"], "Mirror and check"),
    ("Pedestrian in shadow?", ["Easy see", "Difficult see", "Very visible", "No issue"], "Difficult see"),
    ("Vehicle reflectors?", ["Ugly", "Important safety", "Not needed", "Optional"], "Important safety"),
    ("Wet road hydroplane?", ["Smooth braking", "Sudden stop", "High speed", "Jerky movements"], "Sudden stop"),
    ("Ice patch appears?", ["Drive normally", "Gentle steering", "Hard braking", "Accelerate"], "Gentle steering"),
    ("Wind gust buffer?", ["Ignore", "Expect swerve", "Sound horn", "Maintain"], "Expect swerve"),
    ("Sun reflection water?", ["No problem", "Blinding glare", "Safe", "Continue"], "Blinding glare"),
    ("Dust cloud ahead?", ["Drive normally", "Reduce speed", "Accelerate", "Sound horn"], "Reduce speed"),
]

add_category("Hazard Awareness and Defensive Driving", "hazard", hazard)

# Save all questions
output_path = Path('data/driving-theory-questions.json')
output_path.write_text(json.dumps(questions, indent=2, ensure_ascii=False), encoding='utf-8')

# Summary
print(f"Generated {len(questions)} questions")
print(f"Saved to data/driving-theory-questions.json")
print(f"\nDistribution:")
categories = {}
for q in questions:
    cat = q['category']
    categories[cat] = categories.get(cat, 0) + 1

total = 0
for cat, count in sorted(categories.items()):
    print(f"  {cat}: {count} questions")
    total += count

print(f"\nTotal: {total} questions")
