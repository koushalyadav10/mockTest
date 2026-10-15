import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load official answer key
with open('scripts/time_work_extracted/official_answer_key_276.json', 'r', encoding='utf-8') as f:
    official_key = json.load(f)

questions = []

def add_q(qnum, shift, qtext, opts, sol):
    if 1 <= qnum <= 39:
        theader = "TYPE - I: BASED ON TWO VARIABLES"
    elif 40 <= qnum <= 86:
        theader = "TYPE - II: BASED ON THREE VARIABLES"
    elif 87 <= qnum <= 127:
        theader = "TYPE - III: CONCEPT OF ALTERNATE DAYS"
    elif 128 <= qnum <= 140:
        theader = "TYPE - IV: CONCEPT OF LEAVING THE WORK"
    else:
        raise ValueError(f"Unexpected qnum {qnum}")

    cor = official_key[str(qnum)]
    
    formatted_opts = []
    for lbl in ["A", "B", "C", "D"]:
        formatted_opts.append({
            "label": lbl,
            "text": str(opts[lbl])
        })
        
    questions.append({
        "questionNumber": qnum,
        "typeHeader": theader,
        "examShift": shift,
        "questionText": qtext,
        "options": formatted_opts,
        "correctOption": cor,
        "solution": sol
    })

# --- PAGE 1: Q1 to Q17 ---

add_q(
    1,
    "SSC CPO 03/10/2023 (Shift-02)",
    "John alone can do a piece of work in 20 days, while Ravi alone can do the same work in 28 days. If they work together, then in how many days can both of them complete the work?",
    {
        "A": "$12\\frac{2}{3}\\text{ days}$",
        "B": "$12\\frac{1}{3}\\text{ days}$",
        "C": "$11\\frac{1}{3}\\text{ days}$",
        "D": "$11\\frac{2}{3}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 28) = 140\\text{ units}$$\n$$\\text{Efficiency of John} = \\frac{140}{20} = 7\\text{ units/day}$$\n$$\\text{Efficiency of Ravi} = \\frac{140}{28} = 5\\text{ units/day}$$\n$$\\text{Combined efficiency} = 7 + 5 = 12\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{140}{12} = \\frac{35}{3} = 11\\frac{2}{3}\\text{ days}$$"
)

add_q(
    2,
    "SSC Phase XII 26/06/2024 (Shift-02)",
    "A completes a piece of work in 4 days and B completes it in 6 days. How long will it take to complete the same piece of work if they both work together?",
    {
        "A": "$2\\frac{3}{5}\\text{ days}$",
        "B": "3 days",
        "C": "$2\\frac{2}{5}\\text{ days}$",
        "D": "4 days"
    },
    "$$\\text{Total work} = \\text{LCM}(4, 6) = 12\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{12}{4} = 3\\text{ units/day}$$\n$$\\text{Efficiency of B} = \\frac{12}{6} = 2\\text{ units/day}$$\n$$\\text{Combined efficiency} = 3 + 2 = 5\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{12}{5} = 2\\frac{2}{5}\\text{ days}$$"
)

add_q(
    3,
    "SSC CHSL 05/07/2024 (Shift-02)",
    "Shobhita can complete a painting work in 20 hours while Saroj can complete the same work in 15 hours. In how much time (in hours) can the entire work of painting be completed, if both Shobhita and Saroj work simultaneously?",
    {
        "A": "8",
        "B": "$7\\frac{4}{7}$",
        "C": "$8\\frac{4}{7}$",
        "D": "7"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 15) = 60\\text{ units}$$\n$$\\text{Efficiency of Shobhita} = \\frac{60}{20} = 3\\text{ units/hour}$$\n$$\\text{Efficiency of Saroj} = \\frac{60}{15} = 4\\text{ units/hour}$$\n$$\\text{Combined efficiency} = 3 + 4 = 7\\text{ units/hour}$$\n$$\\text{Time required} = \\frac{60}{7} = 8\\frac{4}{7}\\text{ hours}$$"
)

add_q(
    4,
    "SSC CHSL 04/07/2024 (Shift-04)",
    "Akhil can complete a piece of work in 24 days. Shyam can complete the same piece of work in 12 days. If both of them work together, in how many days can they complete the same piece of work?",
    {
        "A": "6 days",
        "B": "8 days",
        "C": "10 days",
        "D": "12 days"
    },
    "$$\\text{Total work} = \\text{LCM}(24, 12) = 24\\text{ units}$$\n$$\\text{Efficiency of Akhil} = \\frac{24}{24} = 1\\text{ unit/day}$$\n$$\\text{Efficiency of Shyam} = \\frac{24}{12} = 2\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{24}{1 + 2} = \\frac{24}{3} = 8\\text{ days}$$"
)

add_q(
    5,
    "SSC CHSL 09/07/2024 (Shift-04)",
    "A can finish a piece of work by working alone in 4 days. B, while working alone, can finish the same work in 12 days. If both of them work together, then in how many days will the work be completed?",
    {
        "A": "8",
        "B": "3",
        "C": "4",
        "D": "6"
    },
    "$$\\text{Total work} = \\text{LCM}(4, 12) = 12\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{12}{4} = 3\\text{ units/day}$$\n$$\\text{Efficiency of B} = \\frac{12}{12} = 1\\text{ unit/day}$$\n$$\\text{Time taken together} = \\frac{12}{3 + 1} = \\frac{12}{4} = 3\\text{ days}$$"
)

add_q(
    6,
    "SSC CHSL 01/07/2024 (Shift-03)",
    "A and B can do a piece of work in 9 days and 15 days, respectively. If they work together, then the work will be completed in:",
    {
        "A": "$3\\frac{3}{8}\\text{ days}$",
        "B": "$2\\frac{1}{8}\\text{ days}$",
        "C": "$5\\frac{5}{8}\\text{ days}$",
        "D": "$4\\frac{5}{8}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(9, 15) = 45\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{45}{9} = 5\\text{ units/day}$$\n$$\\text{Efficiency of B} = \\frac{45}{15} = 3\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{45}{5 + 3} = \\frac{45}{8} = 5\\frac{5}{8}\\text{ days}$$"
)

add_q(
    7,
    "SSC CHSL 10/07/2024 (Shift-04)",
    "P completes a work in 12 days and Q in 24 days. In how many days P and Q working together can complete the same work?",
    {
        "A": "16 days",
        "B": "8 days",
        "C": "6 days",
        "D": "12 days"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 24) = 24\\text{ units}$$\n$$\\text{Efficiency of P} = \\frac{24}{12} = 2\\text{ units/day}$$\n$$\\text{Efficiency of Q} = \\frac{24}{24} = 1\\text{ unit/day}$$\n$$\\text{Time taken together} = \\frac{24}{2 + 1} = \\frac{24}{3} = 8\\text{ days}$$"
)

add_q(
    8,
    "SSC CHSL 01/07/2024 (Shift-01)",
    "A and B can do a work in 10 days and 40 days, respectively. How long will it take together to complete the work?",
    {
        "A": "12 days",
        "B": "8 days",
        "C": "20 days",
        "D": "15 days"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 40) = 40\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{40}{10} = 4\\text{ units/day}$$\n$$\\text{Efficiency of B} = \\frac{40}{40} = 1\\text{ unit/day}$$\n$$\\text{Time taken together} = \\frac{40}{4 + 1} = \\frac{40}{5} = 8\\text{ days}$$"
)

add_q(
    9,
    "SSC MTS 13/09/2023 (Shift-03)",
    "P can complete $\\frac{1}{5}$ of a work in 12 days and Q can complete $\\frac{1}{6}$ of a work in 8 days. In how many days can both P and Q together complete the work?",
    {
        "A": "$26\\frac{2}{3}$",
        "B": "$25\\frac{4}{5}$",
        "C": "$22\\frac{4}{5}$",
        "D": "$24\\frac{2}{3}$"
    },
    "$$\\text{Time taken by P alone} = 12 \\times 5 = 60\\text{ days}$$\n$$\\text{Time taken by Q alone} = 8 \\times 6 = 48\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(60, 48) = 240\\text{ units}$$\n$$\\text{Efficiency of P} = \\frac{240}{60} = 4,\\quad \\text{Efficiency of Q} = \\frac{240}{48} = 5$$\n$$\\text{Time taken together} = \\frac{240}{4 + 5} = \\frac{240}{9} = \\frac{80}{3} = 26\\frac{2}{3}\\text{ days}$$"
)

add_q(
    10,
    "SSC CGL 25/07/2023 (Shift-02)",
    "A can complete $\\frac{1}{3}$ of a work in 7 days and B can complete $\\frac{2}{7}$ of the same work in 10 days. In how many days can both A and B together complete the work?",
    {
        "A": "$12\\frac{3}{8}$",
        "B": "$11\\frac{7}{8}$",
        "C": "$13\\frac{1}{8}$",
        "D": "$15\\frac{1}{7}$"
    },
    "$$\\text{Time taken by A alone} = 7 \\times 3 = 21\\text{ days}$$\n$$\\text{Time taken by B alone} = 10 \\times \\frac{7}{2} = 35\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(21, 35) = 105\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{105}{21} = 5,\\quad \\text{Efficiency of B} = \\frac{105}{35} = 3$$\n$$\\text{Time taken together} = \\frac{105}{5 + 3} = \\frac{105}{8} = 13\\frac{1}{8}\\text{ days}$$"
)

add_q(
    11,
    "SSC CGL TIER-II (08/08/2022)",
    "A can do 1/4 part of a work in 9 days. B can do 2/3 part of the same work in 28 days. Working together, in how many days can A and B complete the whole work?",
    {
        "A": "$\\frac{261}{15}\\text{ days}$",
        "B": "$\\frac{198}{17}\\text{ days}$",
        "C": "$\\frac{252}{13}\\text{ days}$",
        "D": "$\\frac{262}{11}\\text{ days}$"
    },
    "$$\\text{Time taken by A alone} = 9 \\times 4 = 36\\text{ days}$$\n$$\\text{Time taken by B alone} = 28 \\times \\frac{3}{2} = 42\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(36, 42) = 252\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{252}{36} = 7,\\quad \\text{Efficiency of B} = \\frac{252}{42} = 6$$\n$$\\text{Time taken together} = \\frac{252}{7 + 6} = \\frac{252}{13}\\text{ days}$$"
)

add_q(
    12,
    "SSC CHSL 03/08/2023 (Shift-04)",
    "Disha takes 12 hours to copy a 75-page manuscript, while Mohit can copy the same manuscript in 10 hours. How many hours will it take to copy a 150-page manuscript if they work together?",
    {
        "A": "$9\\frac{9}{11}\\text{ hours}$",
        "B": "$10\\frac{10}{11}\\text{ hours}$",
        "C": "$8\\frac{9}{11}\\text{ hours}$",
        "D": "$11\\frac{8}{11}\\text{ hours}$"
    },
    "$$\\text{Rate of Disha} = \\frac{75}{12} = \\frac{25}{4}\\text{ pages/hour}$$\n$$\\text{Rate of Mohit} = \\frac{75}{10} = \\frac{15}{2} = \\frac{30}{4}\\text{ pages/hour}$$\n$$\\text{Combined typing rate} = \\frac{25}{4} + \\frac{30}{4} = \\frac{55}{4}\\text{ pages/hour}$$\n$$\\text{Time taken for 150 pages} = \\frac{150}{\\frac{55}{4}} = \\frac{600}{55} = \\frac{120}{11} = 10\\frac{10}{11}\\text{ hours}$$"
)

add_q(
    13,
    "SSC CHSL 14/08/2023 (Shift-01)",
    "Jason can do a piece of work alone in 23.4 days, while Refigure can do the same piece of work alone in 39 days. In how many days can the duo complete the same if they work together?",
    {
        "A": "14.750",
        "B": "14.625",
        "C": "14.875",
        "D": "14.375"
    },
    "$$\\text{Time taken together} = \\frac{x \\times y}{x + y} = \\frac{23.4 \\times 39}{23.4 + 39} = \\frac{912.6}{62.4} = 14.625\\text{ days}$$"
)

add_q(
    14,
    "SSC CGL 17/07/2023 (Shift-04)",
    "A can do 20% of a job in 7 days and B can do 25% of the job in 7 days if they worked alone. How much of the job (in percentage) can they complete in 7 days if they worked together?",
    {
        "A": "38%",
        "B": "52%",
        "C": "56%",
        "D": "45%"
    },
    "$$\\text{Work done by A in 7 days} = 20\\%$$\n$$\\text{Work done by B in 7 days} = 25\\%$$\n$$\\text{Work done together in 7 days} = 20\\% + 25\\% = 45\\%$$"
)

add_q(
    15,
    "SSC CHSL 21/03/2023 (Shift-01)",
    "A can complete 3/8 part of a work in 36 days. B can complete 1/2 part of the same work in 27 days. Which of the following statement(s) is/are correct?\nI. A is less efficient than B.\nII. A and B working together can complete $\\frac{11}{15}$ part of the same work in 36 days.",
    {
        "A": "Neither I nor II",
        "B": "Only I",
        "C": "Only II",
        "D": "Both I & II"
    },
    "$$\\text{Time taken by A for complete work} = 36 \\times \\frac{8}{3} = 96\\text{ days}$$\n$$\\text{Time taken by B for complete work} = 27 \\times 2 = 54\\text{ days}$$\n$$\\text{Since A takes more days than B, A is less efficient than B (Statement I is correct).}$$\n$$\\text{Work done by both in 36 days} = 36 \\times \\left(\\frac{1}{96} + \\frac{1}{54}\\right) = 36 \\times \\frac{9 + 16}{864} = 36 \\times \\frac{25}{864} = \\frac{25}{24} \\neq \\frac{11}{15}$$\n$$\\text{Thus Statement II is incorrect. Hence, Only I is correct.}$$"
)

add_q(
    16,
    "SSC CPO 24/11/2020 (Shift-01)",
    "A and B can do a piece of work in 25 days. B alone can do $66\\frac{2}{3}\\%$ of the same work in 30 days. In how many days can A alone do $\\frac{4}{15}$ part of the same work?",
    {
        "A": "15",
        "B": "20",
        "C": "18",
        "D": "12"
    },
    "$$\\text{Time taken by B alone for total work} = 30 \\times \\frac{3}{2} = 45\\text{ days}$$\n$$\\text{Time taken by (A + B) together} = 25\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(25, 45) = 225\\text{ units}$$\n$$\\text{Efficiency of (A + B)} = \\frac{225}{25} = 9,\\quad \\text{Efficiency of B} = \\frac{225}{45} = 5$$\n$$\\text{Efficiency of A} = 9 - 5 = 4\\text{ units/day}$$\n$$\\text{Work required} = \\frac{4}{15} \\times 225 = 60\\text{ units}$$\n$$\\text{Time taken by A} = \\frac{60}{4} = 15\\text{ days}$$\n$$\\text{[Note: Option (B) is designated as the official key per commission records.]}$$"
)

add_q(
    17,
    "SSC MTS 04/09/2023 (Shift-01)",
    "Julie and Rahul together can complete the work of painting a room in 12 days. If Julie alone can paint the room in 20 days, then in how many days can Rahul complete the same work of painting the room alone?",
    {
        "A": "30",
        "B": "25",
        "C": "40",
        "D": "35"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 20) = 60\\text{ units}$$\n$$\\text{Efficiency of (Julie + Rahul)} = \\frac{60}{12} = 5\\text{ units/day}$$\n$$\\text{Efficiency of Julie} = \\frac{60}{20} = 3\\text{ units/day}$$\n$$\\text{Efficiency of Rahul} = 5 - 3 = 2\\text{ units/day}$$\n$$\\text{Time taken by Rahul alone} = \\frac{60}{2} = 30\\text{ days}$$"
)

# --- PAGE 2: Q18 to Q39 ---

add_q(
    18,
    "SSC CGL 26/07/2023 (Shift-02)",
    "A can complete a piece of work alone in 120 days, while A and B, working together, can complete this piece of work in 72 days. In how many days can B, working alone, complete this piece of work?",
    {
        "A": "180",
        "B": "200",
        "C": "160",
        "D": "216"
    },
    "$$\\text{Total work} = \\text{LCM}(120, 72) = 360\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{360}{120} = 3,\\quad \\text{Efficiency of (A + B)} = \\frac{360}{72} = 5$$\n$$\\text{Efficiency of B} = 5 - 3 = 2\\text{ units/day}$$\n$$\\text{Time taken by B alone} = \\frac{360}{2} = 180\\text{ days}$$"
)

add_q(
    19,
    "SSC CGL 26/09/2024 (Shift-02)",
    "Varun and Raju, working together, can complete a job in 40 hours whereas Varun alone can complete the same job in 50 hours. The number of hours required by Raju to complete the job alone is:",
    {
        "A": "200",
        "B": "150",
        "C": "170",
        "D": "190"
    },
    "$$\\text{Total work} = \\text{LCM}(40, 50) = 200\\text{ units}$$\n$$\\text{Efficiency of (Varun + Raju)} = \\frac{200}{40} = 5,\\quad \\text{Efficiency of Varun} = \\frac{200}{50} = 4$$\n$$\\text{Efficiency of Raju} = 5 - 4 = 1\\text{ unit/hour}$$\n$$\\text{Time taken by Raju alone} = \\frac{200}{1} = 200\\text{ hours}$$"
)

add_q(
    20,
    "SSC CHSL 02/07/2024 (Shift-03)",
    "A and B, working together, take 15 days to complete a piece of work. If A alone can complete the job in 18 days, how long will B take to complete the same job?",
    {
        "A": "90 days",
        "B": "33 days",
        "C": "15 days",
        "D": "8 days"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 18) = 90\\text{ units}$$\n$$\\text{Efficiency of (A + B)} = \\frac{90}{15} = 6,\\quad \\text{Efficiency of A} = \\frac{90}{18} = 5$$\n$$\\text{Efficiency of B} = 6 - 5 = 1\\text{ unit/day}$$\n$$\\text{Time taken by B alone} = \\frac{90}{1} = 90\\text{ days}$$"
)

add_q(
    21,
    "SSC CHSL 08/07/2024 (Shift-02)",
    "Rohan takes 10 hours to mow a large lawn. Rohan and Mohan together can mow it in 4 hours. How long will Mohan take to mow the lawn if he works alone?",
    {
        "A": "$\\frac{16}{3}\\text{ hours}$",
        "B": "$\\frac{40}{3}\\text{ hours}$",
        "C": "$\\frac{10}{3}\\text{ hours}$",
        "D": "$\\frac{20}{3}\\text{ hours}$"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 4) = 20\\text{ units}$$\n$$\\text{Efficiency of Rohan} = \\frac{20}{10} = 2,\\quad \\text{Efficiency of (Rohan + Mohan)} = \\frac{20}{4} = 5$$\n$$\\text{Efficiency of Mohan} = 5 - 2 = 3\\text{ units/hour}$$\n$$\\text{Time taken by Mohan alone} = \\frac{20}{3}\\text{ hours}$$"
)

add_q(
    22,
    "SSC CHSL 05/07/2024 (Shift-01)",
    "Sapna finishes a job in 12 hours working alone. If Sapna and Riya finish the same job in 8 hours working together at their respective constant rates, then, in how many hours can Riya do the job working alone?",
    {
        "A": "24",
        "B": "18",
        "C": "16",
        "D": "20"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 8) = 24\\text{ units}$$\n$$\\text{Efficiency of Sapna} = \\frac{24}{12} = 2,\\quad \\text{Efficiency of (Sapna + Riya)} = \\frac{24}{8} = 3$$\n$$\\text{Efficiency of Riya} = 3 - 2 = 1\\text{ unit/hour}$$\n$$\\text{Time taken by Riya alone} = \\frac{24}{1} = 24\\text{ hours}$$"
)

add_q(
    23,
    "SSC CHSL 08/07/2024 (Shift-01)",
    "Antony and Julie can simultaneously complete a work of floor decoration in 15 days and Julie alone in 20 days. In how many days can Antony alone complete the work of floor decoration?",
    {
        "A": "55",
        "B": "60",
        "C": "45",
        "D": "50"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 20) = 60\\text{ units}$$\n$$\\text{Efficiency of (Antony + Julie)} = \\frac{60}{15} = 4,\\quad \\text{Efficiency of Julie} = \\frac{60}{20} = 3$$\n$$\\text{Efficiency of Antony} = 4 - 3 = 1\\text{ unit/day}$$\n$$\\text{Time taken by Antony alone} = \\frac{60}{1} = 60\\text{ days}$$"
)

add_q(
    24,
    "SSC CHSL 01/07/2024 (Shift-02)",
    "A and B can do a piece of work in 8 days and B alone can do it in 16 days. In how many days can A do it alone?",
    {
        "A": "24 days",
        "B": "16 days",
        "C": "18 days",
        "D": "10 days"
    },
    "$$\\text{Total work} = \\text{LCM}(8, 16) = 16\\text{ units}$$\n$$\\text{Efficiency of (A + B)} = \\frac{16}{8} = 2,\\quad \\text{Efficiency of B} = \\frac{16}{16} = 1$$\n$$\\text{Efficiency of A} = 2 - 1 = 1\\text{ unit/day}$$\n$$\\text{Time taken by A alone} = \\frac{16}{1} = 16\\text{ days}$$"
)

add_q(
    25,
    "SSC CPO 29/06/2024 (Shift-03)",
    "Sumit and Rajiv, working together, can do a job in 20 hours whereas Sumit alone can do the same job in 25 hours. In how many hours can Rajiv alone do the job?",
    {
        "A": "70",
        "B": "90",
        "C": "80",
        "D": "100"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 25) = 100\\text{ units}$$\n$$\\text{Efficiency of (Sumit + Rajiv)} = \\frac{100}{20} = 5,\\quad \\text{Efficiency of Sumit} = \\frac{100}{25} = 4$$\n$$\\text{Efficiency of Rajiv} = 5 - 4 = 1\\text{ unit/hour}$$\n$$\\text{Time taken by Rajiv alone} = \\frac{100}{1} = 100\\text{ hours}$$"
)

add_q(
    26,
    "SSC CPO 03/10/2023 (Shift-03)",
    "Jeevan can do a piece of work alone in 42 days, while Rishi and Jeevan together can do the same piece of work in 27 days. How many days will Rishi take to complete the same piece of work alone?",
    {
        "A": "$75\\frac{4}{5}\\text{ days}$",
        "B": "$75\\frac{1}{5}\\text{ days}$",
        "C": "$75\\frac{3}{5}\\text{ days}$",
        "D": "$74\\frac{3}{5}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(42, 27) = 378\\text{ units}$$\n$$\\text{Efficiency of Jeevan} = \\frac{378}{42} = 9,\\quad \\text{Efficiency of (Rishi + Jeevan)} = \\frac{378}{27} = 14$$\n$$\\text{Efficiency of Rishi} = 14 - 9 = 5\\text{ units/day}$$\n$$\\text{Time taken by Rishi alone} = \\frac{378}{5} = 75\\frac{3}{5}\\text{ days}$$"
)

add_q(
    27,
    "SSC CPO 09/11/2022 (Shift-02)",
    "A can do a piece of work in 10 days while A and B together can complete it in $2\\frac{1}{2}$ days. How long will B alone take to complete the work?",
    {
        "A": "$\\frac{3}{10}\\text{ days}$",
        "B": "$\\frac{10}{3}\\text{ days}$",
        "C": "3 days",
        "D": "4 days"
    },
    "$$2\\frac{1}{2}\\text{ days} = \\frac{5}{2}\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}\\left(10, \\frac{5}{2}\\right) = 10\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{10}{10} = 1,\\quad \\text{Efficiency of (A + B)} = \\frac{10}{5/2} = 4$$\n$$\\text{Efficiency of B} = 4 - 1 = 3\\text{ units/day}$$\n$$\\text{Time taken by B alone} = \\frac{10}{3}\\text{ days}$$"
)

add_q(
    28,
    "SSC CHSL 10/08/2023 (Shift-03)",
    "George can do 35% of the total work in 6 days. Jim and George together completed a piece of work in 12 days. In how many days could Jim, working alone, complete the entire task?",
    {
        "A": "36",
        "B": "40",
        "C": "42",
        "D": "45"
    },
    "$$\\text{Time for George to do full work} = 6 \\times \\frac{100}{35} = \\frac{120}{7}\\text{ days}$$\n$$\\text{Time for (Jim + George)} = 12\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}\\left(\\frac{120}{7}, 12\\right) = 120\\text{ units}$$\n$$\\text{Efficiency of George} = \\frac{120}{120/7} = 7,\\quad \\text{Efficiency of (Jim + George)} = \\frac{120}{12} = 10$$\n$$\\text{Efficiency of Jim} = 10 - 7 = 3\\text{ units/day}$$\n$$\\text{Time taken by Jim alone} = \\frac{120}{3} = 40\\text{ days}$$"
)

add_q(
    29,
    "SSC CGL 19/09/2024 (Shift-02)",
    "A and B can do a work in 12 days and 16 days, respectively. If they work together for 6 days, then the fraction of the work left is:",
    {
        "A": "$\\frac{5}{7}$",
        "B": "$\\frac{7}{8}$",
        "C": "$\\frac{1}{8}$",
        "D": "$\\frac{1}{7}$"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 16) = 48\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{48}{12} = 4,\\quad \\text{Efficiency of B} = \\frac{48}{16} = 3$$\n$$\\text{Work done together in 6 days} = 6 \\times (4 + 3) = 6 \\times 7 = 42\\text{ units}$$\n$$\\text{Work remaining} = 48 - 42 = 6\\text{ units}$$\n$$\\text{Fraction of work left} = \\frac{6}{48} = \\frac{1}{8}$$"
)

add_q(
    30,
    "SSC MTS 17/05/2023 (Shift-03)",
    "A alone can do (1/10) part of a work in 8 hours. B alone can do (1/5) part of same work in 4 hours. If they work together, then how many hours will they take to complete (9/16) part of the same work?",
    {
        "A": "9 hours",
        "B": "5 hours",
        "C": "8 hours",
        "D": "4 hours"
    },
    "$$\\text{Time for A alone} = 8 \\times 10 = 80\\text{ hours}$$\n$$\\text{Time for B alone} = 4 \\times 5 = 20\\text{ hours}$$\n$$\\text{Total work} = \\text{LCM}(80, 20) = 80\\text{ units}$$\n$$\\text{Efficiency of A} = \\frac{80}{80} = 1,\\quad \\text{Efficiency of B} = \\frac{80}{20} = 4$$\n$$\\text{Combined efficiency} = 1 + 4 = 5\\text{ units/hour}$$\n$$\\text{Work to be completed} = \\frac{9}{16} \\times 80 = 45\\text{ units}$$\n$$\\text{Time required} = \\frac{45}{5} = 9\\text{ hours}$$"
)

add_q(
    31,
    "SSC CHSL 03/07/2024 (Shift-04)",
    "Riya and Sangeeta can finish a work in 6 days and 8 days, respectively. Riya started the work alone and then after 3 days, Sangeeta joined Riya. They both finish the remaining work. How long did the total work last?",
    {
        "A": "$4\\frac{4}{7}\\text{ days}$",
        "B": "$4\\frac{2}{7}\\text{ days}$",
        "C": "$4\\frac{5}{7}\\text{ days}$",
        "D": "$4\\frac{3}{7}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(6, 8) = 24\\text{ units}$$\n$$\\text{Efficiency of Riya} = 4,\\quad \\text{Efficiency of Sangeeta} = 3$$\n$$\\text{Work done by Riya in first 3 days} = 3 \\times 4 = 12\\text{ units}$$\n$$\\text{Remaining work} = 24 - 12 = 12\\text{ units}$$\n$$\\text{Time taken together for remaining work} = \\frac{12}{4 + 3} = \\frac{12}{7} = 1\\frac{5}{7}\\text{ days}$$\n$$\\text{Total time work lasted} = 3 + 1\\frac{5}{7} = 4\\frac{5}{7}\\text{ days}$$"
)

add_q(
    32,
    "SSC CHSL 07/08/2023 (Shift-02)",
    "A and B can finish a work in 6 days and 4 days, respectively. A alone worked on it for 2 days. Thereafter, B joined him. How much total time was taken by them to finish the work?",
    {
        "A": "$3\\frac{3}{5}$",
        "B": "$1\\frac{3}{5}$",
        "C": "$3\\frac{1}{5}$",
        "D": "$4\\frac{1}{5}$"
    },
    "$$\\text{Total work} = \\text{LCM}(6, 4) = 12\\text{ units}$$\n$$\\text{Efficiency of A} = 2,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work done by A in 2 days} = 2 \\times 2 = 4\\text{ units}$$\n$$\\text{Remaining work} = 12 - 4 = 8\\text{ units}$$\n$$\\text{Time taken together for remaining work} = \\frac{8}{2 + 3} = \\frac{8}{5} = 1\\frac{3}{5}\\text{ days}$$\n$$\\text{Total time} = 2 + 1\\frac{3}{5} = 3\\frac{3}{5}\\text{ days}$$"
)

add_q(
    33,
    "SSC CHSL 14/08/2023 (Shift-01)",
    "A can finish a work in 25 days, and B can do the same work in 15 days. B worked for 10 days and left the job. A alone can finish the remaining work in how many days?",
    {
        "A": "$7\\frac{1}{3}\\text{ days}$",
        "B": "$6\\frac{1}{3}\\text{ days}$",
        "C": "$8\\frac{1}{3}\\text{ days}$",
        "D": "$5\\frac{1}{3}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(25, 15) = 75\\text{ units}$$\n$$\\text{Efficiency of A} = 3,\\quad \\text{Efficiency of B} = 5$$\n$$\\text{Work done by B in 10 days} = 10 \\times 5 = 50\\text{ units}$$\n$$\\text{Remaining work} = 75 - 50 = 25\\text{ units}$$\n$$\\text{Time taken by A alone} = \\frac{25}{3} = 8\\frac{1}{3}\\text{ days}$$"
)

add_q(
    34,
    "SSC CHSL 17/08/2023 (Shift-04)",
    "Raju and Akber take 4 hours and 6 hours to type 32 pages and 48 pages, respectively, on a computer. They are given an assignment of typing 256 pages. If they work together, typing on two different computers, starting at the same time, how much time will they take to complete the assignment (in hours)?",
    {
        "A": "16",
        "B": "14",
        "C": "18",
        "D": "12"
    },
    "$$\\text{Rate of Raju} = \\frac{32}{4} = 8\\text{ pages/hour}$$\n$$\\text{Rate of Akber} = \\frac{48}{6} = 8\\text{ pages/hour}$$\n$$\\text{Combined rate} = 8 + 8 = 16\\text{ pages/hour}$$\n$$\\text{Time required} = \\frac{256}{16} = 16\\text{ hours}$$"
)

add_q(
    35,
    "SSC MTS 08/05/2023 (Shift-01)",
    "Suresh alone can do a work in 10 days working 1 hour a day. Shalu alone can do the same work in 2 days working 5 hours a day. How many hours do they need to work together in a day to complete the same work in 10 days?",
    {
        "A": "1.5 hours",
        "B": "0.5 hours",
        "C": "1 hour",
        "D": "2 hours"
    },
    "$$\\text{Total hours taken by Suresh} = 10 \\times 1 = 10\\text{ hours}$$\n$$\\text{Total hours taken by Shalu} = 2 \\times 5 = 10\\text{ hours}$$\n$$\\text{Total work} = 10\\text{ units (efficiency of each = 1 unit/hour)}$$\n$$\\text{Combined rate} = 1 + 1 = 2\\text{ units/hour}$$\n$$\\text{To complete 10 units in 10 days, work per day} = \\frac{10}{10} = 1\\text{ unit/day}$$\n$$\\text{Hours required per day} = \\frac{1\\text{ unit}}{2\\text{ units/hour}} = 0.5\\text{ hours}$$"
)

add_q(
    36,
    "SSC CHSL 17/03/2023 (Shift-04)",
    "Ram alone can do a work in 5 days working 4 hours a day. Seema alone can do the same work in 3 days working 10 hours a day. How many hours do they need to work together in a day to complete the same work in 6 days?",
    {
        "A": "1 hour",
        "B": "3 hours",
        "C": "5 hours",
        "D": "2 hours"
    },
    "$$\\text{Total hours taken by Ram} = 5 \\times 4 = 20\\text{ hours}$$\n$$\\text{Total hours taken by Seema} = 3 \\times 10 = 30\\text{ hours}$$\n$$\\text{Total work} = \\text{LCM}(20, 30) = 60\\text{ units}$$\n$$\\text{Efficiency of Ram} = 3\\text{ units/hour},\\quad \\text{Efficiency of Seema} = 2\\text{ units/hour}$$\n$$\\text{Combined rate} = 3 + 2 = 5\\text{ units/hour}$$\n$$\\text{Total hours required together} = \\frac{60}{5} = 12\\text{ hours}$$\n$$\\text{Hours required per day to finish in 6 days} = \\frac{12}{6} = 2\\text{ hours}$$"
)

add_q(
    37,
    "SSC CGL 09/09/2024 (Shift-01)",
    "Rajesh, in his printing press, got an order to print some books, out of which he completed $\\frac{17}{27}$ of the order in 34 days. In how many days did he complete the entire order of printing?",
    {
        "A": "60",
        "B": "20",
        "C": "54",
        "D": "56"
    },
    "$$\\text{Time taken for entire order} = 34 \\times \\frac{27}{17} = 2 \\times 27 = 54\\text{ days}$$"
)

add_q(
    38,
    "SSC CPO 05/10/2023 (Shift-03)",
    "If Arun can complete $\\frac{2}{3}\\text{rd}$ of a work in 12 days, then in how many days can he complete $\\frac{1}{6}\\text{th}$ of the same work?",
    {
        "A": "4 days",
        "B": "5 days",
        "C": "2 days",
        "D": "3 days"
    },
    "$$\\text{Time taken to complete full work} = 12 \\times \\frac{3}{2} = 18\\text{ days}$$\n$$\\text{Time taken for }\\frac{1}{6}\\text{th of the work} = \\frac{1}{6} \\times 18 = 3\\text{ days}$$"
)

add_q(
    39,
    "SSC Phase X 04/08/2022 (Shift-03)",
    "Anjali is designing a wall for a social purpose. In 14 days, he completed $\\frac{7}{11}$ of the work. In how many days will she complete the rest of the work?",
    {
        "A": "10",
        "B": "8",
        "C": "12",
        "D": "9"
    },
    "$$\\text{Time taken for }\\frac{1}{11}\\text{ of the work} = \\frac{14}{7} = 2\\text{ days}$$\n$$\\text{Remaining work} = 1 - \\frac{7}{11} = \\frac{4}{11}$$\n$$\\text{Time to complete rest of work} = 4 \\times 2 = 8\\text{ days}$$"
)

# --- PAGE 3: Q40 to Q58 ---

add_q(
    40,
    "SSC CHSL 09/08/2023 (Shift-01)",
    "X can do a piece of work in 14 days, Y can complete the same work in 28 days and Z can do it in 42 days. In how many days can X, Y and Z together complete the work?",
    {
        "A": "$7\\frac{9}{11}\\text{ days}$",
        "B": "$7\\frac{7}{11}\\text{ days}$",
        "C": "$7\\frac{5}{11}\\text{ days}$",
        "D": "$7\\frac{3}{11}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(14, 28, 42) = 84\\text{ units}$$\n$$\\text{Efficiency of X} = 6,\\quad \\text{Efficiency of Y} = 3,\\quad \\text{Efficiency of Z} = 2$$\n$$\\text{Combined efficiency} = 6 + 3 + 2 = 11\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{84}{11} = 7\\frac{7}{11}\\text{ days}$$"
)

add_q(
    41,
    "SSC CHSL 02/07/2024 (Shift-04)",
    "A, B and C can complete a work in 12, 15 and 20 days, respectively. How many days are required to finish the work if they work together?",
    {
        "A": "5 days",
        "B": "4 days",
        "C": "6 days",
        "D": "3 days"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 15, 20) = 60\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 4,\\quad \\text{Efficiency of C} = 3$$\n$$\\text{Combined efficiency} = 5 + 4 + 3 = 12\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{60}{12} = 5\\text{ days}$$"
)

add_q(
    42,
    "SSC CHSL 11/07/2024 (Shift-04)",
    "X, Y and Z can do a work in 24 days, 5 days and 12 days, respectively. In how many days can they do the same work if they work together?",
    {
        "A": "$3\\frac{1}{24}\\text{ days}$",
        "B": "$3\\frac{1}{13}\\text{ days}$",
        "C": "4 days",
        "D": "$3\\frac{7}{24}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(24, 5, 12) = 120\\text{ units}$$\n$$\\text{Efficiency of X} = 5,\\quad \\text{Efficiency of Y} = 24,\\quad \\text{Efficiency of Z} = 10$$\n$$\\text{Combined efficiency} = 5 + 24 + 10 = 39\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{120}{39} = \\frac{40}{13} = 3\\frac{1}{13}\\text{ days}$$"
)

add_q(
    43,
    "SSC CPO 05/10/2023 (Shift-02)",
    "Vipin can do a piece of work in 2 days; Vaibhav can do the same work in 3 days and Chirag can do the same work in 6 days. If they start working together, how many days will they take to complete the work?",
    {
        "A": "3 days",
        "B": "5 days",
        "C": "1 days",
        "D": "4 days"
    },
    "$$\\text{Total work} = \\text{LCM}(2, 3, 6) = 6\\text{ units}$$\n$$\\text{Efficiency of Vipin} = 3,\\quad \\text{Efficiency of Vaibhav} = 2,\\quad \\text{Efficiency of Chirag} = 1$$\n$$\\text{Combined efficiency} = 3 + 2 + 1 = 6\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{6}{6} = 1\\text{ day}$$"
)

add_q(
    44,
    "SSC CGL 13/04/2022 (Shift-02)",
    "A tyre has 3 punctures. The first puncture alone would have made the tyre flat in 9 minutes, the second alone would have done it in 18 minutes, the third alone would have done it in 6 minutes. If the air leaks out at a constant rate, then how long (in minutes) does it take for all the punctures together to make it flat?",
    {
        "A": "6",
        "B": "3",
        "C": "2",
        "D": "1"
    },
    "$$\\text{Total capacity} = \\text{LCM}(9, 18, 6) = 18\\text{ units}$$\n$$\\text{Rates of punctures} = 2, 1, 3\\text{ units/min}$$\n$$\\text{Combined rate} = 2 + 1 + 3 = 6\\text{ units/min}$$\n$$\\text{Time required} = \\frac{18}{6} = 3\\text{ minutes}$$"
)

add_q(
    45,
    "SSC CPO 23/11/2020 (Shift-02)",
    "X can do a work in 3 days, Y does three times the same work in 8 days, and Z does five times the same work in 12 days. If they have to work together for 6 hours in a day, then in how much time can they complete the work?",
    {
        "A": "4 hours",
        "B": "5 hours",
        "C": "5 hours 20 minutes",
        "D": "4 hours 10 minutes"
    },
    "$$\\text{Time taken for 1 unit of work:}$$\n$$\\text{X} = 3\\text{ days},\\quad \\text{Y} = \\frac{8}{3}\\text{ days},\\quad \\text{Z} = \\frac{12}{5}\\text{ days}$$\n$$\\text{Work done together per day} = \\frac{1}{3} + \\frac{3}{8} + \\frac{5}{12} = \\frac{8 + 9 + 10}{24} = \\frac{27}{24} = \\frac{9}{8}\\text{ of total work}$$\n$$\\text{Days taken together} = \\frac{8}{9}\\text{ days}$$\n$$\\text{With 6 working hours per day, total time} = \\frac{8}{9} \\times 6 = \\frac{16}{3}\\text{ hours} = 5\\text{ hours } 20\\text{ minutes}$$"
)

add_q(
    46,
    "SSC CHSL 03/08/2023 (Shift-01)",
    "Ali, Avtar Singh and Ashok working together can finish a work in 8 days. Ali alone can do it in 20 days and Avtar Singh alone can do it in 24 days. In how many days can Ashok alone do the same work?",
    {
        "A": "30",
        "B": "28",
        "C": "26",
        "D": "25"
    },
    "$$\\text{Total work} = \\text{LCM}(8, 20, 24) = 120\\text{ units}$$\n$$\\text{Efficiency of (Ali + Avtar + Ashok)} = \\frac{120}{8} = 15$$\n$$\\text{Efficiency of Ali} = \\frac{120}{20} = 6,\\quad \\text{Efficiency of Avtar} = \\frac{120}{24} = 5$$\n$$\\text{Efficiency of Ashok} = 15 - (6 + 5) = 4\\text{ units/day}$$\n$$\\text{Time taken by Ashok alone} = \\frac{120}{4} = 30\\text{ days}$$"
)

add_q(
    47,
    "SSC CHSL 14/08/2023 (Shift-03)",
    "Ram can complete a piece of work in 18 days, Reena can complete the same work in 12 days, and with the help of Shyam, they finish the same work in six days. In how many days can Shyam alone complete the same work?",
    {
        "A": "42 days",
        "B": "36 days",
        "C": "30 days",
        "D": "24 days"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 12, 6) = 36\\text{ units}$$\n$$\\text{Efficiency of Ram} = 2,\\quad \\text{Efficiency of Reena} = 3,\\quad \\text{Efficiency of All three} = 6$$\n$$\\text{Efficiency of Shyam} = 6 - (2 + 3) = 1\\text{ unit/day}$$\n$$\\text{Time taken by Shyam alone} = \\frac{36}{1} = 36\\text{ days}$$"
)

add_q(
    48,
    "SSC CHSL 04/07/2024 (Shift-02)",
    "A can complete a piece of work in 20 days and B can complete the same work in 10 days. With the help of C, working together they completed the work in 5 days. The number of days in which C alone can complete the work is:",
    {
        "A": "15",
        "B": "10",
        "C": "25",
        "D": "20"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 10, 5) = 20\\text{ units}$$\n$$\\text{Efficiency of A} = 1,\\quad \\text{Efficiency of B} = 2,\\quad \\text{Efficiency of (A + B + C)} = 4$$\n$$\\text{Efficiency of C} = 4 - (1 + 2) = 1\\text{ unit/day}$$\n$$\\text{Time taken by C alone} = \\frac{20}{1} = 20\\text{ days}$$"
)

add_q(
    49,
    "SSC CGL 17/07/2023 (Shift-01)",
    "Rakshit, Ajay, and Satish are sanitation workers in a Municipal Corporation. Rakshit alone takes 20 hours to clean a drain while Ajay takes 12 hours when working alone to do the same. All three together take only 5 hours to clean the drain. In how many hours, can Satish complete the work alone?",
    {
        "A": "12",
        "B": "10",
        "C": "15",
        "D": "18"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 12, 5) = 60\\text{ units}$$\n$$\\text{Efficiency of Rakshit} = 3,\\quad \\text{Efficiency of Ajay} = 5,\\quad \\text{Efficiency of All three} = 12$$\n$$\\text{Efficiency of Satish} = 12 - (3 + 5) = 4\\text{ units/hour}$$\n$$\\text{Time taken by Satish alone} = \\frac{60}{4} = 15\\text{ hours}$$"
)

add_q(
    50,
    "SSC CHSL 12/08/2021 (Shift-02)",
    "A and B can complete a piece of work in 27 days and 54 days, respectively. They completed the work in 9 days with the help of C. How many days will C take to complete $\\frac{8}{9}$ of work alone?",
    {
        "A": "24",
        "B": "45",
        "C": "30",
        "D": "16"
    },
    "$$\\text{Total work} = \\text{LCM}(27, 54, 9) = 54\\text{ units}$$\n$$\\text{Efficiency of A} = 2,\\quad \\text{Efficiency of B} = 1,\\quad \\text{Efficiency of (A + B + C)} = 6$$\n$$\\text{Efficiency of C} = 6 - (2 + 1) = 3\\text{ units/day}$$\n$$\\text{Time for C to complete whole work} = \\frac{54}{3} = 18\\text{ days}$$\n$$\\text{Time for }\\frac{8}{9}\\text{th of work} = 18 \\times \\frac{8}{9} = 16\\text{ days}$$"
)

add_q(
    51,
    "SSC CPO 23/11/2020 (Shift-01)",
    "A and B can do a job in 10 days and 5 days, respectively. They worked together for two days, after which B was replaced by C and the work was finished in the next three days. How long will C alone take to finish 60% of the job?",
    {
        "A": "30 days",
        "B": "25 days",
        "C": "18 days",
        "D": "24 days"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 5) = 10\\text{ units}$$\n$$\\text{Efficiency of A} = 1,\\quad \\text{Efficiency of B} = 2$$\n$$\\text{Work done by (A + B) in 2 days} = 2 \\times (1 + 2) = 6\\text{ units}$$\n$$\\text{Remaining work} = 10 - 6 = 4\\text{ units}$$\n$$\\text{Work done by (A + C) in 3 days} = 3 \\times (1 + \\text{Eff}(C)) = 4 \\implies \\text{Eff}(C) = \\frac{4}{3} - 1 = \\frac{1}{3}\\text{ unit/day}$$\n$$\\text{Time for C to complete full work} = \\frac{10}{1/3} = 30\\text{ days}$$\n$$\\text{Time for 60\\% of the job} = 30 \\times 0.60 = 18\\text{ days}$$"
)

add_q(
    52,
    "SSC CPO 25/11/2020 (Shift-01)",
    "A and B can do a job in 10 days and 5 days, respectively. They worked together for two days, after which B was replaced by C and the work was finished in the next three days. How long will C alone take to finish 40% of the job?",
    {
        "A": "15 days",
        "B": "18 days",
        "C": "10 days",
        "D": "12 days"
    },
    "$$\\text{From earlier calculation, Efficiency of C} = \\frac{1}{3}\\text{ unit/day}$$\n$$\\text{Total work} = 10\\text{ units}$$\n$$\\text{Time taken by C alone for 100\\% work} = \\frac{10}{1/3} = 30\\text{ days}$$\n$$\\text{Time taken by C for 40\\% of the job} = 30 \\times 0.40 = 12\\text{ days}$$"
)

add_q(
    53,
    "SSC CHSL TIER-II 15/11/2020",
    "A can do 20% of the work in 4 days, B can do $33\\frac{1}{3}\\%$ of the same work in 10 days. They worked together for 9 days. C completed the remaining work in 6 days. In how many days will B and C together complete 75% of the work?",
    {
        "A": "12",
        "B": "15",
        "C": "10",
        "D": "9"
    },
    "$$\\text{Time for A} = 4 \\times 5 = 20\\text{ days},\\quad \\text{Time for B} = 10 \\times 3 = 30\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(20, 30) = 60\\text{ units}$$\n$$\\text{Efficiency of A} = 3,\\quad \\text{Efficiency of B} = 2$$\n$$\\text{Work done by (A + B) in 9 days} = 9 \\times (3 + 2) = 45\\text{ units}$$\n$$\\text{Remaining work} = 60 - 45 = 15\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{15}{6} = 2.5\\text{ units/day}$$\n$$\\text{Combined efficiency of B and C} = 2 + 2.5 = 4.5 = \\frac{9}{2}\\text{ units/day}$$\n$$75\\%\\text{ of work} = 0.75 \\times 60 = 45\\text{ units}$$\n$$\\text{Time required} = \\frac{45}{9/2} = 10\\text{ days}$$"
)

add_q(
    54,
    "SSC CGL TIER-II 16/11/2020",
    "A can do $\\frac{1}{3}$ of work in 30 days, B can do $\\frac{2}{5}$ part of the same work in 24 days. They worked together for 20 days. C completed the remaining work in 8 days. In how many days will A, B and C together complete the work?",
    {
        "A": "10",
        "B": "12",
        "C": "18",
        "D": "15"
    },
    "$$\\text{Time for A} = 30 \\times 3 = 90\\text{ days},\\quad \\text{Time for B} = 24 \\times \\frac{5}{2} = 60\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(90, 60) = 180\\text{ units}$$\n$$\\text{Efficiency of A} = 2,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work done by (A + B) in 20 days} = 20 \\times (2 + 3) = 100\\text{ units}$$\n$$\\text{Remaining work} = 180 - 100 = 80\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{80}{8} = 10\\text{ units/day}$$\n$$\\text{Combined efficiency of A, B and C} = 2 + 3 + 10 = 15\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{180}{15} = 12\\text{ days}$$"
)

add_q(
    55,
    "SSC CGL TIER-II 12/09/2019",
    "A can do 40% of a work in 12 days while B 60% of the same work can be done in 15 days. Both work together for 10 days. C completes the remaining work in 4 days. In how many days will A, B and C together complete 28% of the same work?",
    {
        "A": "$2\\frac{1}{2}\\text{ days}$",
        "B": "3 days",
        "C": "$1\\frac{1}{2}\\text{ days}$",
        "D": "2 days"
    },
    "$$\\text{Time for A} = 12 \\times \\frac{5}{2} = 30\\text{ days},\\quad \\text{Time for B} = 15 \\times \\frac{5}{3} = 25\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(30, 25) = 150\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 6$$\n$$\\text{Work done by (A + B) in 10 days} = 10 \\times (5 + 6) = 110\\text{ units}$$\n$$\\text{Remaining work} = 150 - 110 = 40\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{40}{4} = 10\\text{ units/day}$$\n$$\\text{Combined efficiency of A, B and C} = 5 + 6 + 10 = 21\\text{ units/day}$$\n$$28\\%\\text{ of work} = 0.28 \\times 150 = 42\\text{ units}$$\n$$\\text{Time required} = \\frac{42}{21} = 2\\text{ days}$$"
)

add_q(
    56,
    "SSC CHSL 11/07/2024 (Shift-02)",
    "Meera can complete a piece of work in 20 days, Neena in 30 days and Seema in 40 days. Meera and Seema worked together for 4 days and then Meera was replaced by Neena. In how many days, altogether, was the work completed?",
    {
        "A": "14",
        "B": "16",
        "C": "18",
        "D": "20"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 30, 40) = 120\\text{ units}$$\n$$\\text{Efficiency of Meera} = 6,\\quad \\text{Efficiency of Neena} = 4,\\quad \\text{Efficiency of Seema} = 3$$\n$$\\text{Work done by (Meera + Seema) in 4 days} = 4 \\times (6 + 3) = 36\\text{ units}$$\n$$\\text{Remaining work} = 120 - 36 = 84\\text{ units}$$\n$$\\text{Efficiency of (Neena + Seema)} = 4 + 3 = 7\\text{ units/day}$$\n$$\\text{Days taken for remaining work} = \\frac{84}{7} = 12\\text{ days}$$\n$$\\text{Total days altogether} = 4 + 12 = 16\\text{ days}$$"
)

add_q(
    57,
    "SSC CGL 27/07/2023 (Shift-03)",
    "Ram can complete a piece work in 15 days, Rohan in 25 days, and Rohit in 30 days. Rohan and Rohit worked together for 2 days and then Rohit was replaced by Ram. In how many days altogether was the work completed?",
    {
        "A": "10 days",
        "B": "8 days",
        "C": "12 days",
        "D": "7 days"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 25, 30) = 150\\text{ units}$$\n$$\\text{Efficiency of Ram} = 10,\\quad \\text{Efficiency of Rohan} = 6,\\quad \\text{Efficiency of Rohit} = 5$$\n$$\\text{Work done by (Rohan + Rohit) in 2 days} = 2 \\times (6 + 5) = 22\\text{ units}$$\n$$\\text{Remaining work} = 150 - 22 = 128\\text{ units}$$\n$$\\text{Efficiency of (Ram + Rohan)} = 10 + 6 = 16\\text{ units/day}$$\n$$\\text{Days taken for remaining work} = \\frac{128}{16} = 8\\text{ days}$$\n$$\\text{Total days altogether} = 2 + 8 = 10\\text{ days}$$"
)

add_q(
    58,
    "SSC CPO 27/06/2024 (Shift-03)",
    "Mitu can do a piece of work in 12 hours, Titu and Situ together in 2 hours, and Mitu and Situ together in 3 hours. How long will Titu alone take to do it?",
    {
        "A": "7 hours",
        "B": "8 hours",
        "C": "4 hours",
        "D": "6 hours"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 2, 3) = 12\\text{ units}$$\n$$\\text{Efficiency of Mitu} = \\frac{12}{12} = 1\\text{ unit/hour}$$\n$$\\text{Efficiency of (Titu + Situ)} = \\frac{12}{2} = 6\\text{ units/hour}$$\n$$\\text{Efficiency of (Mitu + Situ)} = \\frac{12}{3} = 4\\text{ units/hour}$$\n$$\\text{Efficiency of Situ} = 4 - 1 = 3\\text{ units/hour}$$\n$$\\text{Efficiency of Titu} = 6 - 3 = 3\\text{ units/hour}$$\n$$\\text{Time taken by Titu alone} = \\frac{12}{3} = 4\\text{ hours}$$"
)

# --- PAGE 4: Q59 to Q76 ---

add_q(
    59,
    "SSC CPO 28/06/2024 (Shift-02)",
    "Manish, Nakul and Pintoo alone can complete a certain work in 21 days, 28 days and 15 days, respectively. Manish and Pintoo started the work together while Nakul joined them after 5 days and worked with them till the completion of the work. For how many days did Nakul work?",
    {
        "A": "$3\\frac{1}{2}$",
        "B": "$2\\frac{1}{7}$",
        "C": "$5\\frac{1}{2}$",
        "D": "$2\\frac{6}{7}$"
    },
    "$$\\text{Total work} = \\text{LCM}(21, 28, 15) = 420\\text{ units}$$\n$$\\text{Efficiency of Manish} = 20,\\quad \\text{Efficiency of Nakul} = 15,\\quad \\text{Efficiency of Pintoo} = 28$$\n$$\\text{Work done by (Manish + Pintoo) in first 5 days} = 5 \\times (20 + 28) = 240\\text{ units}$$\n$$\\text{Remaining work} = 420 - 240 = 180\\text{ units}$$\n$$\\text{Combined efficiency of all three} = 20 + 15 + 28 = 63\\text{ units/day}$$\n$$\\text{Days Nakul worked} = \\frac{180}{63} = \\frac{20}{7} = 2\\frac{6}{7}\\text{ days}$$"
)

add_q(
    60,
    "SSC Phase XII 24/06/2024 (Shift-03)",
    "A, B and C can do the same work in 9 days, 12 days and 18 days, respectively. A started the work and worked for 3 days and left. Then, B joined the work and worked for 3 days and left. Then, C joined the work and completed the work. Find the number of days C took to complete the work.",
    {
        "A": "$7\\frac{1}{2}$",
        "B": "8",
        "C": "7",
        "D": "$8\\frac{1}{2}$"
    },
    "$$\\text{Total work} = \\text{LCM}(9, 12, 18) = 36\\text{ units}$$\n$$\\text{Efficiency of A} = 4,\\quad \\text{Efficiency of B} = 3,\\quad \\text{Efficiency of C} = 2$$\n$$\\text{Work done by A} = 3 \\times 4 = 12\\text{ units}$$\n$$\\text{Work done by B} = 3 \\times 3 = 9\\text{ units}$$\n$$\\text{Work completed} = 12 + 9 = 21\\text{ units}$$\n$$\\text{Remaining work} = 36 - 21 = 15\\text{ units}$$\n$$\\text{Time taken by C} = \\frac{15}{2} = 7\\frac{1}{2}\\text{ days}$$"
)

add_q(
    61,
    "SSC MTS 01/09/2023 (Shift-01)",
    "A, B and C can do a piece of work in 10, 15, 12 days, respectively. A and B worked alternately for 5 days each and left. Then C joined and completed the work. In how many days did C complete the remaining work?",
    {
        "A": "4",
        "B": "1",
        "C": "2",
        "D": "3"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 15, 12) = 60\\text{ units}$$\n$$\\text{Efficiency of A} = 6,\\quad \\text{Efficiency of B} = 4,\\quad \\text{Efficiency of C} = 5$$\n$$\\text{Work done by A in 5 days} = 5 \\times 6 = 30\\text{ units}$$\n$$\\text{Work done by B in 5 days} = 5 \\times 4 = 20\\text{ units}$$\n$$\\text{Remaining work} = 60 - (30 + 20) = 10\\text{ units}$$\n$$\\text{Time taken by C} = \\frac{10}{5} = 2\\text{ days}$$"
)

add_q(
    62,
    "SSC CHSL 02/08/2023 (Shift-01)",
    "A can finish a work in 15 days, B can finish the same work in 25 days. They work together for 5 days. The rest of the work is finished by A and C in 4 days. Then C alone can finish the work in:",
    {
        "A": "18 days",
        "B": "24 days",
        "C": "20 days",
        "D": "21 days"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 25) = 75\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work done by (A + B) in 5 days} = 5 \\times (5 + 3) = 40\\text{ units}$$\n$$\\text{Remaining work} = 75 - 40 = 35\\text{ units}$$\n$$\\text{Work done by (A + C) in 4 days} = 4 \\times (5 + \\text{Eff}(C)) = 35 \\implies \\text{Eff}(C) = \\frac{15}{4}\\text{ units/day}$$\n$$\\text{Time taken by C alone} = \\frac{75}{15/4} = 20\\text{ days}$$"
)

add_q(
    63,
    "SSC CGL 21/07/2023 (Shift-03)",
    "A can do 20% of a work in 4 days, and B can do $33\\frac{1}{3}\\%$ of the same work in 10 days. They worked together for 9 days and then C completed the remaining work in 6 days. B and C together will complete 75% of the same work in:",
    {
        "A": "12 days",
        "B": "9 days",
        "C": "11 days",
        "D": "10 days"
    },
    "$$\\text{Time for A} = 20\\text{ days},\\quad \\text{Time for B} = 30\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(20, 30) = 60\\text{ units}$$\n$$\\text{Efficiency of A} = 3,\\quad \\text{Efficiency of B} = 2$$\n$$\\text{Work done by (A + B) in 9 days} = 9 \\times (3 + 2) = 45\\text{ units}$$\n$$\\text{Remaining work} = 60 - 45 = 15\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{15}{6} = 2.5\\text{ units/day}$$\n$$\\text{Combined efficiency of B and C} = 2 + 2.5 = 4.5\\text{ units/day}$$\n$$75\\%\\text{ of work} = 0.75 \\times 60 = 45\\text{ units}$$\n$$\\text{Time taken} = \\frac{45}{4.5} = 10\\text{ days}$$"
)

add_q(
    64,
    "SSC CGL 11/04/2022 (Shift-02)",
    "X, Y and Z can do a piece of work in 46 days, 92 days and 23 days, respectively. X started the work. Y joined him after 2 days. If Z joined them after 8 days from the beginning, then for how many days did X work?",
    {
        "A": "16",
        "B": "21",
        "C": "18",
        "D": "13"
    },
    "$$\\text{Total work} = \\text{LCM}(46, 92, 23) = 92\\text{ units}$$\n$$\\text{Efficiency of X} = 2,\\quad \\text{Efficiency of Y} = 1,\\quad \\text{Efficiency of Z} = 4$$\n$$\\text{Days 1 to 2 (only X)} = 2 \\times 2 = 4\\text{ units}$$\n$$\\text{Days 3 to 8 (X + Y)} = 6 \\times (2 + 1) = 18\\text{ units}$$\n$$\\text{Work done in first 8 days} = 4 + 18 = 22\\text{ units}$$\n$$\\text{Remaining work} = 92 - 22 = 70\\text{ units}$$\n$$\\text{Days taken by (X + Y + Z)} = \\frac{70}{2 + 1 + 4} = \\frac{70}{7} = 10\\text{ days}$$\n$$\\text{Total days X worked} = 8 + 10 = 18\\text{ days}$$"
)

add_q(
    65,
    "SSC CGL 19/04/2022 (Shift-02)",
    "X, Y and Z can complete a piece of work in 46 days, 92 days and 23 days, respectively. X started the work. Y joined him after 7 days. If Z joined them after 8 days from the beginning, then for how many days did Y work?",
    {
        "A": "$12\\frac{5}{7}$",
        "B": "$9\\frac{5}{7}$",
        "C": "$10\\frac{5}{7}$",
        "D": "$11\\frac{5}{7}$"
    },
    "$$\\text{Total work} = \\text{LCM}(46, 92, 23) = 92\\text{ units}$$\n$$\\text{Efficiency of X} = 2,\\quad \\text{Efficiency of Y} = 1,\\quad \\text{Efficiency of Z} = 4$$\n$$\\text{Days 1 to 7 (only X)} = 7 \\times 2 = 14\\text{ units}$$\n$$\\text{Day 8 (X + Y)} = 1 \\times (2 + 1) = 3\\text{ units}$$\n$$\\text{Work done in first 8 days} = 14 + 3 = 17\\text{ units}$$\n$$\\text{Remaining work} = 92 - 17 = 75\\text{ units}$$\n$$\\text{Days taken by (X + Y + Z)} = \\frac{75}{2 + 1 + 4} = \\frac{75}{7} = 10\\frac{5}{7}\\text{ days}$$\n$$\\text{Total days Y worked} = 1 + 10\\frac{5}{7} = 11\\frac{5}{7}\\text{ days}$$"
)

add_q(
    66,
    "SSC MTS 27/10/2021 (Shift-02)",
    "X and Y can complete a certain work in 16 days and 24 days, respectively. They work together for 4 days. Z alone completes the remaining work in $10\\frac{1}{2}$ days. Y and Z together can complete 7/8th part of the same work in:",
    {
        "A": "10 days",
        "B": "12 days",
        "C": "8 days",
        "D": "9 days"
    },
    "$$\\text{Total work} = \\text{LCM}(16, 24) = 48\\text{ units}$$\n$$\\text{Efficiency of X} = 3,\\quad \\text{Efficiency of Y} = 2$$\n$$\\text{Work done by (X + Y) in 4 days} = 4 \\times (3 + 2) = 20\\text{ units}$$\n$$\\text{Remaining work} = 48 - 20 = 28\\text{ units}$$\n$$\\text{Efficiency of Z} = \\frac{28}{10.5} = \\frac{28}{21/2} = \\frac{8}{3}\\text{ units/day}$$\n$$\\text{Efficiency of (Y + Z)} = 2 + \\frac{8}{3} = \\frac{14}{3}\\text{ units/day}$$\n$$\\frac{7}{8}\\text{ of total work} = \\frac{7}{8} \\times 48 = 42\\text{ units}$$\n$$\\text{Time taken} = \\frac{42}{14/3} = 9\\text{ days}$$"
)

add_q(
    67,
    "SSC CGL 13/08/2021 (Shift-03)",
    "A and B can do a certain work in 18 days and 30 days, respectively. They work together for 5 days. C alone completes the remaining work in 15 days. A and C together can complete 5/6th part of the same work in:",
    {
        "A": "6 days",
        "B": "8 days",
        "C": "9 days",
        "D": "5 days"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 30) = 90\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work done by (A + B) in 5 days} = 5 \\times (5 + 3) = 40\\text{ units}$$\n$$\\text{Remaining work} = 90 - 40 = 50\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{50}{15} = \\frac{10}{3}\\text{ units/day}$$\n$$\\text{Efficiency of (A + C)} = 5 + \\frac{10}{3} = \\frac{25}{3}\\text{ units/day}$$\n$$\\frac{5}{6}\\text{ of total work} = \\frac{5}{6} \\times 90 = 75\\text{ units}$$\n$$\\text{Time taken} = \\frac{75}{25/3} = 9\\text{ days}$$"
)

add_q(
    68,
    "SSC CHSL 05/08/2021 (Shift-01)",
    "A can complete a work in 20 days, while B can complete the same work in 25 days. Both worked together for 10 days and then C alone completed the remaining work in 10 days. In how many days will A, B and C together complete the same work?",
    {
        "A": "5 Days",
        "B": "10 Days",
        "C": "12 Days",
        "D": "8 Days"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 25) = 100\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 4$$\n$$\\text{Work done by (A + B) in 10 days} = 10 \\times (5 + 4) = 90\\text{ units}$$\n$$\\text{Remaining work} = 100 - 90 = 10\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{10}{10} = 1\\text{ unit/day}$$\n$$\\text{Combined efficiency of A, B and C} = 5 + 4 + 1 = 10\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{100}{10} = 10\\text{ days}$$"
)

add_q(
    69,
    "SSC CHSL 06/08/2021 (Shift-02)",
    "A can do 60% of a work in 18 days, while B can do 40% of the same work in 10 days. Both work together for 10 days only. C completed the remaining work in 4 days. In how many days will C complete the same work?",
    {
        "A": "15",
        "B": "18",
        "C": "25",
        "D": "12"
    },
    "$$\\text{Time for A} = 18 \\times \\frac{5}{3} = 30\\text{ days},\\quad \\text{Time for B} = 10 \\times \\frac{5}{2} = 25\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(30, 25) = 150\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 6$$\n$$\\text{Work done by (A + B) in 10 days} = 10 \\times (5 + 6) = 110\\text{ units}$$\n$$\\text{Remaining work} = 150 - 110 = 40\\text{ units}$$\n$$\\text{Efficiency of C} = \\frac{40}{4} = 10\\text{ units/day}$$\n$$\\text{Time taken by C alone} = \\frac{150}{10} = 15\\text{ days}$$"
)

add_q(
    70,
    "SSC CHSL 04/07/2024 (Shift-01)",
    "A and B can complete a piece of work in 15 days, B and C in 30 days and C and A in 45 days. In how many days will they complete the work if they start working together?",
    {
        "A": "$16\\frac{4}{11}$",
        "B": "$8\\frac{3}{11}$",
        "C": "$11\\frac{1}{3}$",
        "D": "$11\\frac{2}{3}$"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 30, 45) = 90\\text{ units}$$\n$$\\text{Eff}(A + B) = 6,\\quad \\text{Eff}(B + C) = 3,\\quad \\text{Eff}(C + A) = 2$$\n$$2 \\times \\text{Eff}(A + B + C) = 6 + 3 + 2 = 11 \\implies \\text{Eff}(A + B + C) = \\frac{11}{2}\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{90}{11/2} = \\frac{180}{11} = 16\\frac{4}{11}\\text{ days}$$"
)

add_q(
    71,
    "SSC MTS 05/07/2022 (Shift-01)",
    "A and B can together complete a piece of work in 18 days. B and C can together complete the same work in 24 days and A and C can together complete it in 36 days. In how many days can A, B and C, working together, complete this piece of work?",
    {
        "A": "19",
        "B": "16",
        "C": "20",
        "D": "14"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 24, 36) = 72\\text{ units}$$\n$$\\text{Eff}(A + B) = 4,\\quad \\text{Eff}(B + C) = 3,\\quad \\text{Eff}(A + C) = 2$$\n$$2 \\times \\text{Eff}(A + B + C) = 4 + 3 + 2 = 9 \\implies \\text{Eff}(A + B + C) = \\frac{9}{2}\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{72}{9/2} = 16\\text{ days}$$"
)

add_q(
    72,
    "SSC MTS 01/09/2023 (Shift-01)",
    "A and B can do any work in 4 days. B and C can do the same work in 5 days. A and C can do the same work in 10 days. If A, B, C work together, in how many days can they complete the work?",
    {
        "A": "$3\\frac{11}{7}\\text{ days}$",
        "B": "$11\\frac{7}{3}\\text{ days}$",
        "C": "$3\\frac{7}{11}\\text{ days}$",
        "D": "$11\\frac{3}{7}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(4, 5, 10) = 20\\text{ units}$$\n$$\\text{Eff}(A + B) = 5,\\quad \\text{Eff}(B + C) = 4,\\quad \\text{Eff}(A + C) = 2$$\n$$2 \\times \\text{Eff}(A + B + C) = 5 + 4 + 2 = 11 \\implies \\text{Eff}(A + B + C) = \\frac{11}{2}\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{20}{11/2} = \\frac{40}{11} = 3\\frac{7}{11}\\text{ days}$$"
)

add_q(
    73,
    "SSC CGL 18/07/2023 (Shift-02)",
    "A and B can finish a work in 10 days, B and C can finish it in 12 days and C and A can finish in 6 days. In how many days A alone can finish the work?",
    {
        "A": "$\\frac{120}{9}$",
        "B": "12",
        "C": "$\\frac{120}{11}$",
        "D": "$\\frac{121}{12}$"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 12, 6) = 60\\text{ units}$$\n$$\\text{Eff}(A + B) = 6,\\quad \\text{Eff}(B + C) = 5,\\quad \\text{Eff}(C + A) = 10$$\n$$2 \\times \\text{Eff}(A + B + C) = 6 + 5 + 10 = 21 \\implies \\text{Eff}(A + B + C) = \\frac{21}{2}\\text{ units/day}$$\n$$\\text{Efficiency of A} = \\frac{21}{2} - 5 = \\frac{11}{2}\\text{ units/day}$$\n$$\\text{Time taken by A alone} = \\frac{60}{11/2} = \\frac{120}{11}\\text{ days}$$"
)

add_q(
    74,
    "SSC CPO 28/06/2024 (Shift-01)",
    "A and B together can complete a piece of work in 25 days, B and C together can complete the same piece of work in 36 days, while C and A together can complete it in 30 days. If A, B, C, and D together can complete this piece of work in 18 days, then in how many days can D alone complete this piece of work?",
    {
        "A": "225",
        "B": "210",
        "C": "200",
        "D": "180"
    },
    "$$\\text{Total work} = \\text{LCM}(25, 36, 30, 18) = 900\\text{ units}$$\n$$\\text{Eff}(A + B) = 36,\\quad \\text{Eff}(B + C) = 25,\\quad \\text{Eff}(C + A) = 30$$\n$$2 \\times \\text{Eff}(A + B + C) = 36 + 25 + 30 = 91 \\implies \\text{Eff}(A + B + C) = 45.5\\text{ units/day}$$\n$$\\text{Eff}(A + B + C + D) = \\frac{900}{18} = 50\\text{ units/day}$$\n$$\\text{Efficiency of D} = 50 - 45.5 = 4.5 = \\frac{9}{2}\\text{ units/day}$$\n$$\\text{Time taken by D alone} = \\frac{900}{9/2} = 200\\text{ days}$$"
)

add_q(
    75,
    "SSC CHSL 10/07/2024 (Shift-04)",
    "Reena and Riya together can complete a piece of work in 36 days. Riya and Geeta together can complete it in 54 days. Reena and Geeta together can complete it in 81 days. In how many days can Reena alone complete the work?",
    {
        "A": "$82\\frac{4}{7}\\text{ days}$",
        "B": "$87\\frac{4}{7}\\text{ days}$",
        "C": "$97\\frac{4}{7}\\text{ days}$",
        "D": "$92\\frac{4}{7}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(36, 54, 81) = 324\\text{ units}$$\n$$\\text{Eff}(\\text{Reena} + \\text{Riya}) = 9,\\quad \\text{Eff}(\\text{Riya} + \\text{Geeta}) = 6,\\quad \\text{Eff}(\\text{Reena} + \\text{Geeta}) = 4$$\n$$2 \\times \\text{Eff}(\\text{Reena} + \\text{Riya} + \\text{Geeta}) = 9 + 6 + 4 = 19 \\implies \\text{Combined} = 9.5\\text{ units/day}$$\n$$\\text{Efficiency of Reena} = 9.5 - 6 = 3.5 = \\frac{7}{2}\\text{ units/day}$$\n$$\\text{Time taken by Reena alone} = \\frac{324}{7/2} = \\frac{648}{7} = 92\\frac{4}{7}\\text{ days}$$"
)

add_q(
    76,
    "SSC CHSL 03/07/2024 (Shift-01)",
    "A and B can complete a piece of work in 12 days. B and C can complete the same work in 15 days, and C and A in 10 days. How many days will A take to complete the work by himself?",
    {
        "A": "$9\\frac{1}{8}$",
        "B": "$13\\frac{4}{7}$",
        "C": "$16\\frac{1}{7}$",
        "D": "$17\\frac{1}{7}$"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 15, 10) = 60\\text{ units}$$\n$$\\text{Eff}(A + B) = 5,\\quad \\text{Eff}(B + C) = 4,\\quad \\text{Eff}(C + A) = 6$$\n$$2 \\times \\text{Eff}(A + B + C) = 5 + 4 + 6 = 15 \\implies \\text{Eff}(A + B + C) = 7.5\\text{ units/day}$$\n$$\\text{Efficiency of A} = 7.5 - 4 = 3.5 = \\frac{7}{2}\\text{ units/day}$$\n$$\\text{Time taken by A alone} = \\frac{60}{7/2} = \\frac{120}{7} = 17\\frac{1}{7}\\text{ days}$$"
)

# --- PAGE 5: Q77 to Q95 ---

add_q(
    77,
    "SSC CHSL 08/07/2024 (Shift-03)",
    "R and S can finish a work in 10 days, S and T can finish it in 12 days and T and R can finish in 8 days. In how many days will the work be finished if they all work simultaneously?",
    {
        "A": "$\\frac{240}{39}$",
        "B": "$\\frac{240}{33}$",
        "C": "$\\frac{240}{37}$",
        "D": "$\\frac{240}{31}$"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 12, 8) = 120\\text{ units}$$\n$$\\text{Eff}(R + S) = 12,\\quad \\text{Eff}(S + T) = 10,\\quad \\text{Eff}(T + R) = 15$$\n$$2 \\times \\text{Eff}(R + S + T) = 12 + 10 + 15 = 37 \\implies \\text{Eff}(R + S + T) = \\frac{37}{2}\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{120}{37/2} = \\frac{240}{37}\\text{ days}$$"
)

add_q(
    78,
    "SSC CHSL 05/07/2024 (Shift-04)",
    "X and Y can complete a piece of work in 18 days, Y and Z can complete the same work in 24 days. If all three of them can complete the same work in 12 days, then in how many days can X and Z complete the work?",
    {
        "A": "$14\\frac{2}{5}\\text{ days}$",
        "B": "7 days",
        "C": "$12\\frac{3}{5}\\text{ days}$",
        "D": "5 days"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 24, 12) = 72\\text{ units}$$\n$$\\text{Eff}(X + Y) = 4,\\quad \\text{Eff}(Y + Z) = 3,\\quad \\text{Eff}(X + Y + Z) = 6$$\n$$\\text{Efficiency of Z} = 6 - 4 = 2,\\quad \\text{Efficiency of X} = 6 - 3 = 3$$\n$$\\text{Efficiency of (X + Z)} = 3 + 2 = 5\\text{ units/day}$$\n$$\\text{Time taken by X and Z} = \\frac{72}{5} = 14\\frac{2}{5}\\text{ days}$$"
)

add_q(
    79,
    "SSC CPO 28/06/2024 (Shift-01)",
    "Ravi and Sanju together can do a job in 2 days, Sanju and Mahesh can do it in 4 days, while Ravi and Mahesh can do it in 2 days. What is the number of days required for Ravi to do the same job alone?",
    {
        "A": "9 days",
        "B": "$\\frac{8}{3}\\text{ days}$",
        "C": "$\\frac{5}{3}\\text{ days}$",
        "D": "4 days"
    },
    "$$\\text{Total work} = \\text{LCM}(2, 4, 2) = 4\\text{ units}$$\n$$\\text{Eff}(R + S) = 2,\\quad \\text{Eff}(S + M) = 1,\\quad \\text{Eff}(R + M) = 2$$\n$$2 \\times \\text{Eff}(R + S + M) = 2 + 1 + 2 = 5 \\implies \\text{Eff}(R + S + M) = 2.5\\text{ units/day}$$\n$$\\text{Efficiency of Ravi} = 2.5 - 1 = 1.5 = \\frac{3}{2}\\text{ units/day}$$\n$$\\text{Time taken by Ravi alone} = \\frac{4}{3/2} = \\frac{8}{3}\\text{ days}$$"
)

add_q(
    80,
    "SSC Phase XII 25/06/2024 (Shift-03)",
    "A and B can do a piece of work in 10 days. B and C can do the same work in 12 days. C and A can do the same work in 15 days. If all the three work together, find the number of days required to complete the work.",
    {
        "A": "6",
        "B": "10",
        "C": "8",
        "D": "12"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 12, 15) = 60\\text{ units}$$\n$$\\text{Eff}(A + B) = 6,\\quad \\text{Eff}(B + C) = 5,\\quad \\text{Eff}(C + A) = 4$$\n$$2 \\times \\text{Eff}(A + B + C) = 6 + 5 + 4 = 15 \\implies \\text{Eff}(A + B + C) = 7.5\\text{ units/day}$$\n$$\\text{Time taken together} = \\frac{60}{7.5} = 8\\text{ days}$$"
)

add_q(
    81,
    "SSC CHSL TIER II 02/11/2023",
    "A and B can complete work in 9 days, while B and C can complete the same work in 18 days. When working together A, B and C, can finish the same work in 8 days. How many days will it take for A and C to complete the work together?",
    {
        "A": "11",
        "B": "14",
        "C": "12",
        "D": "13"
    },
    "$$\\text{Total work} = \\text{LCM}(9, 18, 8) = 72\\text{ units}$$\n$$\\text{Eff}(A + B) = 8,\\quad \\text{Eff}(B + C) = 4,\\quad \\text{Eff}(A + B + C) = 9$$\n$$\\text{Efficiency of C} = 9 - 8 = 1,\\quad \\text{Efficiency of A} = 9 - 4 = 5$$\n$$\\text{Efficiency of (A + C)} = 5 + 1 = 6\\text{ units/day}$$\n$$\\text{Time taken by A and C} = \\frac{72}{6} = 12\\text{ days}$$"
)

add_q(
    82,
    "SSC CGL TIER-II 26/10/2023",
    "A and B can complete a job together in 12.5 days, B and C can complete the same job together in 18.75 days, while C and A can complete the same job together in 15 days. In how many days will A, B and C together be able to complete the same job alongside D, who is only 40% as efficient as C?",
    {
        "A": "$9\\frac{1}{3}$",
        "B": "$9\\frac{17}{27}$",
        "C": "$9\\frac{2}{3}$",
        "D": "$9\\frac{7}{27}$"
    },
    "$$\\text{Total work} = 75\\text{ units}$$\n$$\\text{Eff}(A + B) = \\frac{75}{12.5} = 6,\\quad \\text{Eff}(B + C) = \\frac{75}{18.75} = 4,\\quad \\text{Eff}(C + A) = \\frac{75}{15} = 5$$\n$$2 \\times \\text{Eff}(A + B + C) = 6 + 4 + 5 = 15 \\implies \\text{Eff}(A + B + C) = 7.5\\text{ units/day}$$\n$$\\text{Efficiency of C} = 7.5 - 6 = 1.5\\text{ units/day}$$\n$$\\text{Efficiency of D} = 40\\% \\times 1.5 = 0.6\\text{ units/day}$$\n$$\\text{Efficiency of (A + B + C + D)} = 7.5 + 0.6 = 8.1 = \\frac{81}{10}\\text{ units/day}$$\n$$\\text{Time taken} = \\frac{75}{81/10} = \\frac{750}{81} = \\frac{250}{27} = 9\\frac{7}{27}\\text{ days}$$"
)

add_q(
    83,
    "SSC CGL TIER-II 29/01/2022",
    "A and B can do a work in $26\\frac{2}{3}$ days. B and C together can complete the same work in 48 days, while A and C together can complete the same work in 30 days. How long (in days) will A alone take to complete 60% of the work?",
    {
        "A": "20",
        "B": "32",
        "C": "24",
        "D": "36"
    },
    "$$26\\frac{2}{3} = \\frac{80}{3}\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(80, 48, 30) = 240\\text{ units}$$\n$$\\text{Eff}(A + B) = 9,\\quad \\text{Eff}(B + C) = 5,\\quad \\text{Eff}(A + C) = 8$$\n$$2 \\times \\text{Eff}(A + B + C) = 22 \\implies \\text{Eff}(A + B + C) = 11\\text{ units/day}$$\n$$\\text{Efficiency of A} = 11 - 5 = 6\\text{ units/day}$$\n$$60\\%\\text{ of work} = 0.60 \\times 240 = 144\\text{ units}$$\n$$\\text{Time taken by A alone} = \\frac{144}{6} = 24\\text{ days}$$"
)

add_q(
    84,
    "SSC CPO 23/11/2020 (Shift-02)",
    "A and B can do a piece of work in 36 days. B and C can do the same work in 60 days. A and C can do the same work in 45 days. In how many days can A alone complete the same work?",
    {
        "A": "90",
        "B": "45",
        "C": "60",
        "D": "120"
    },
    "$$\\text{Total work} = \\text{LCM}(36, 60, 45) = 180\\text{ units}$$\n$$\\text{Eff}(A + B) = 5,\\quad \\text{Eff}(B + C) = 3,\\quad \\text{Eff}(A + C) = 4$$\n$$2 \\times \\text{Eff}(A + B + C) = 12 \\implies \\text{Eff}(A + B + C) = 6\\text{ units/day}$$\n$$\\text{Efficiency of A} = 6 - 3 = 3\\text{ units/day}$$\n$$\\text{Time taken by A alone} = \\frac{180}{3} = 60\\text{ days}$$"
)

add_q(
    85,
    "SSC PHASE-IX 2022",
    "X and Y together can complete a piece of work in 20 days, while Y and Z together can complete it in 24 days. After X worked on it for 10 days and Y for 18 days, Z alone completed the remaining work in another 13 days. X and Z together can complete 75% of the original work in:",
    {
        "A": "12 days",
        "B": "9 days",
        "C": "10 days",
        "D": "8 days"
    },
    "$$\\text{Let work be } W.$$\n$$x + y = \\frac{W}{20},\\quad y + z = \\frac{W}{24}$$\n$$10x + 18y + 13z = W \\implies 10(x + y) + 8(y + z) + 5z = W$$\n$$10\\left(\\frac{W}{20}\\right) + 8\\left(\\frac{W}{24}\\right) + 5z = W \\implies \\frac{W}{2} + \\frac{W}{3} + 5z = W$$\n$$5z = W - \\frac{5W}{6} = \\frac{W}{6} \\implies z = \\frac{W}{30}$$\n$$x = \\frac{W}{20} - \\left(\\frac{W}{24} - \\frac{W}{30}\\right) = \\frac{W}{20} - \\frac{W}{120} = \\frac{5W}{120} = \\frac{W}{24}$$\n$$\\text{Combined rate of X and Z} = \\frac{W}{24} + \\frac{W}{30} = \\frac{9W}{120} = \\frac{3W}{40}$$\n$$\\text{Time for } 75\\%\\text{ work} = \\frac{0.75W}{3W/40} = 10\\text{ days}$$"
)

add_q(
    86,
    "SSC CGL TIER-II (18/01/2023)",
    "Rani and Adya, working separately, can finish a task in 12 days and 16 days, respectively. They work in stretches of one day alternately. If Rani starts working first, then the task will be completed in:",
    {
        "A": "$12\\frac{1}{3}\\text{ days}$",
        "B": "$13\\frac{2}{3}\\text{ days}$",
        "C": "$13\\frac{1}{3}\\text{ days}$",
        "D": "$12\\frac{2}{3}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 16) = 48\\text{ units}$$\n$$\\text{Efficiency of Rani} = 4,\\quad \\text{Efficiency of Adya} = 3$$\n$$\\text{Work in 2-day cycle} = 4 + 3 = 7\\text{ units}$$\n$$\\text{In 6 cycles (12 days), work done} = 6 \\times 7 = 42\\text{ units}$$\n$$\\text{Remaining work} = 48 - 42 = 6\\text{ units}$$\n$$\\text{Day 13: Rani works and does } 4\\text{ units. Remaining} = 2\\text{ units}$$\n$$\\text{Day 14: Adya works and takes } \\frac{2}{3}\\text{ of a day}$$\n$$\\text{Total time} = 12 + 1 + \\frac{2}{3} = 13\\frac{2}{3}\\text{ days}$$"
)

add_q(
    87,
    "SSC CPO 27/06/2024 (Shift-02)",
    "A and B can do a work in 13 days and 26 days, respectively. If they work for a day alternately, starting with A, then in how many days will the work be completed?",
    {
        "A": "17",
        "B": "16",
        "C": "13",
        "D": "14"
    },
    "$$\\text{Total work} = \\text{LCM}(13, 26) = 26\\text{ units}$$\n$$\\text{Efficiency of A} = 2,\\quad \\text{Efficiency of B} = 1$$\n$$\\text{Work in 2-day cycle} = 2 + 1 = 3\\text{ units}$$\n$$\\text{In 8 cycles (16 days), work done} = 8 \\times 3 = 24\\text{ units}$$\n$$\\text{Remaining work} = 26 - 24 = 2\\text{ units}$$\n$$\\text{Day 17: A finishes the remaining } 2\\text{ units in } 1\\text{ day}$$\n$$\\text{Total time} = 16 + 1 = 17\\text{ days}$$"
)

add_q(
    88,
    "SSC CPO 29/06/2024 (Shift-01)",
    "Akash and Vikash can complete a work in 40 days and 60 days, respectively. In how many days will the entire work be completed if they work on alternate days, starting with Akash?",
    {
        "A": "48",
        "B": "52",
        "C": "50",
        "D": "42"
    },
    "$$\\text{Total work} = \\text{LCM}(40, 60) = 120\\text{ units}$$\n$$\\text{Efficiency of Akash} = 3,\\quad \\text{Efficiency of Vikash} = 2$$\n$$\\text{Work in 2-day cycle} = 3 + 2 = 5\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{120}{5} = 24\\text{ cycles}$$\n$$\\text{Total days} = 24 \\times 2 = 48\\text{ days}$$"
)

add_q(
    89,
    "SSC CPO 29/06/2024 (Shift-02)",
    "Rajan and Rajat can do a work in 64 days and 48 days, respectively. Starting with Rajat, they work on alternate days. In how many days will the work be completed?",
    {
        "A": "55",
        "B": "$55\\frac{3}{4}$",
        "C": "54",
        "D": "$54\\frac{3}{4}$"
    },
    "$$\\text{Total work} = \\text{LCM}(64, 48) = 192\\text{ units}$$\n$$\\text{Efficiency of Rajan} = 3,\\quad \\text{Efficiency of Rajat} = 4$$\n$$\\text{Starting with Rajat, work in 2-day cycle} = 4 + 3 = 7\\text{ units}$$\n$$\\text{In 27 cycles (54 days), work done} = 27 \\times 7 = 189\\text{ units}$$\n$$\\text{Remaining work} = 192 - 189 = 3\\text{ units}$$\n$$\\text{Day 55: Rajat works and takes } \\frac{3}{4}\\text{ day}$$\n$$\\text{Total time} = 54 + \\frac{3}{4} = 54\\frac{3}{4}\\text{ days}$$"
)

add_q(
    90,
    "SSC Phase XII 26/06/2024 (Shift-04)",
    "A and B can do a piece of work separately in 10 days and 8 days, respectively. If they work alternately and A begins the work, in how many days will the work be completed?",
    {
        "A": "8",
        "B": "10",
        "C": "12",
        "D": "9"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 8) = 40\\text{ units}$$\n$$\\text{Efficiency of A} = 4,\\quad \\text{Efficiency of B} = 5$$\n$$\\text{Work in 2-day cycle} = 4 + 5 = 9\\text{ units}$$\n$$\\text{In 4 cycles (8 days), work done} = 4 \\times 9 = 36\\text{ units}$$\n$$\\text{Remaining work} = 40 - 36 = 4\\text{ units}$$\n$$\\text{Day 9: A works and finishes } 4\\text{ units in exactly } 1\\text{ day}$$\n$$\\text{Total time} = 8 + 1 = 9\\text{ days}$$"
)

add_q(
    91,
    "SSC Phase XII 25/06/2024 (Shift-03)",
    "X and Y can do a piece of work in 18 days and 27 days, respectively. Starting with X, they work on alternate days. The whole number of days to complete the work by X and Y is:",
    {
        "A": "$21\\frac{1}{2}$",
        "B": "24",
        "C": "20",
        "D": "21"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 27) = 54\\text{ units}$$\n$$\\text{Efficiency of X} = 3,\\quad \\text{Efficiency of Y} = 2$$\n$$\\text{Work in 2-day cycle} = 3 + 2 = 5\\text{ units}$$\n$$\\text{In 10 cycles (20 days), work done} = 10 \\times 5 = 50\\text{ units}$$\n$$\\text{Remaining work} = 54 - 50 = 4\\text{ units}$$\n$$\\text{Day 21: X does } 3\\text{ units. Remaining} = 1\\text{ unit}$$\n$$\\text{Day 22: Y takes } \\frac{1}{2}\\text{ day}$$\n$$\\text{Total time} = 20 + 1 + \\frac{1}{2} = 21\\frac{1}{2}\\text{ days}$$"
)

add_q(
    92,
    "SSC Phase XII 25/06/2024 (Shift-04)",
    "Sarthak and Mohan are working on alternate days in a workshop. Sarthak can complete the work in 20 days while Mohan can finish in 25 days. Sarthak works on the 1st day, Mohan on the 2nd day, and so on. How much time (in days) will they take on alternate basis?",
    {
        "A": "$22\\frac{1}{3}$",
        "B": "$22\\frac{1}{5}$",
        "C": "23",
        "D": "$20\\frac{1}{5}$"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 25) = 100\\text{ units}$$\n$$\\text{Efficiency of Sarthak} = 5,\\quad \\text{Efficiency of Mohan} = 4$$\n$$\\text{Work in 2-day cycle} = 5 + 4 = 9\\text{ units}$$\n$$\\text{In 11 cycles (22 days), work done} = 11 \\times 9 = 99\\text{ units}$$\n$$\\text{Remaining work} = 100 - 99 = 1\\text{ unit}$$\n$$\\text{Day 23: Sarthak takes } \\frac{1}{5}\\text{ day}$$\n$$\\text{Total time} = 22 + \\frac{1}{5} = 22\\frac{1}{5}\\text{ days}$$"
)

add_q(
    93,
    "SSC Phase XII 26/06/2024 (Shift-02)",
    "Working separately, A and B can complete a work in 15 days and 18 days, respectively. If A starts the work and they work on alternate days, one on each day, then in how many days will the work be completed?",
    {
        "A": "$15\\frac{2}{3}$",
        "B": "$17\\frac{1}{3}$",
        "C": "$18\\frac{2}{3}$",
        "D": "$16\\frac{1}{3}$"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 18) = 90\\text{ units}$$\n$$\\text{Efficiency of A} = 6,\\quad \\text{Efficiency of B} = 5$$\n$$\\text{Work in 2-day cycle} = 6 + 5 = 11\\text{ units}$$\n$$\\text{In 8 cycles (16 days), work done} = 8 \\times 11 = 88\\text{ units}$$\n$$\\text{Remaining work} = 90 - 88 = 2\\text{ units}$$\n$$\\text{Day 17: A takes } \\frac{2}{6} = \\frac{1}{3}\\text{ day}$$\n$$\\text{Total time} = 16 + \\frac{1}{3} = 16\\frac{1}{3}\\text{ days}$$"
)

add_q(
    94,
    "SSC CPO 04/10/2023 (Shift-02)",
    "Akshita and Raina are typing a book, but have only one laptop to work upon. They decided that they will work on alternate basis such that Akshita works for the first day, Raina works for the second day, Akshita for the third day and so on. Akshita alone can finish the typing work in 16 days, while Raina will take 24 days if she works alone on the entire book. How many days will they take to finish the typing work if they work on alternate basis?",
    {
        "A": "19 days",
        "B": "15 days",
        "C": "17 days",
        "D": "18 days"
    },
    "$$\\text{Total work} = \\text{LCM}(16, 24) = 48\\text{ units}$$\n$$\\text{Efficiency of Akshita} = 3,\\quad \\text{Efficiency of Raina} = 2$$\n$$\\text{Work in 2-day cycle} = 3 + 2 = 5\\text{ units}$$\n$$\\text{In 9 cycles (18 days), work done} = 9 \\times 5 = 45\\text{ units}$$\n$$\\text{Remaining work} = 48 - 45 = 3\\text{ units}$$\n$$\\text{Day 19: Akshita finishes } 3\\text{ units in } 1\\text{ day}$$\n$$\\text{Total time} = 18 + 1 = 19\\text{ days}$$"
)

add_q(
    95,
    "SSC MTS 04/09/2023 (Shift-01)",
    "A work can be completed by P and Q working separately in 12 and 18 days, respectively. But they work on alternate days beginning with P. How many days will it take to complete the work?",
    {
        "A": "$14\\frac{1}{12}$",
        "B": "15",
        "C": "$14\\frac{1}{3}$",
        "D": "$14\\frac{1}{4}$"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 18) = 36\\text{ units}$$\n$$\\text{Efficiency of P} = 3,\\quad \\text{Efficiency of Q} = 2$$\n$$\\text{Work in 2-day cycle} = 3 + 2 = 5\\text{ units}$$\n$$\\text{In 7 cycles (14 days), work done} = 7 \\times 5 = 35\\text{ units}$$\n$$\\text{Remaining work} = 36 - 35 = 1\\text{ unit}$$\n$$\\text{Day 15: P takes } \\frac{1}{3}\\text{ day}$$\n$$\\text{Total time} = 14 + \\frac{1}{3} = 14\\frac{1}{3}\\text{ days}$$"
)

# --- PAGE 6: Q96 to Q111 ---

add_q(
    96,
    "SSC CGL 18/07/2023 (Shift-02)",
    "Amar can complete a work in 15 days and Prem in 12 days. Starting with Amar, they work on alternate days. In how many days will the work be completed?",
    {
        "A": "$13\\frac{1}{2}$",
        "B": "$12\\frac{1}{6}$",
        "C": "$13\\frac{2}{5}$",
        "D": "13"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 12) = 60\\text{ units}$$\n$$\\text{Efficiency of Amar} = 4,\\quad \\text{Efficiency of Prem} = 5$$\n$$\\text{Work in 2-day cycle} = 4 + 5 = 9\\text{ units}$$\n$$\\text{In 6 cycles (12 days), work done} = 6 \\times 9 = 54\\text{ units}$$\n$$\\text{Remaining work} = 60 - 54 = 6\\text{ units}$$\n$$\\text{Day 13: Amar does } 4\\text{ units. Remaining} = 2\\text{ units}$$\n$$\\text{Day 14: Prem takes } \\frac{2}{5}\\text{ day}$$\n$$\\text{Total time} = 12 + 1 + \\frac{2}{5} = 13\\frac{2}{5}\\text{ days}$$"
)

add_q(
    97,
    "SSC CGL 14/07/2023 (Shift-01)",
    "A can complete a piece of work in 25 days while B can complete the same work in 30 days. They work on alternate basis, starting with A. Both A and B follow this pattern for 5 days and then A leaves the work. In how many days will B finish the remaining work?",
    {
        "A": "$24\\frac{2}{5}$",
        "B": "$5\\frac{2}{5}$",
        "C": "$5\\frac{3}{5}$",
        "D": "$24\\frac{3}{5}$"
    },
    "$$\\text{Total work} = \\text{LCM}(25, 30) = 150\\text{ units}$$\n$$\\text{Efficiency of A} = 6,\\quad \\text{Efficiency of B} = 5$$\n$$\\text{Pattern for 5 days: A, B, A, B, A (A works 3 days, B works 2 days)}$$\n$$\\text{Work done in 5 days} = (3 \\times 6) + (2 \\times 5) = 18 + 10 = 28\\text{ units}$$\n$$\\text{Remaining work} = 150 - 28 = 122\\text{ units}$$\n$$\\text{Time taken by B alone} = \\frac{122}{5} = 24\\frac{2}{5}\\text{ days}$$"
)

add_q(
    98,
    "SSC MTS 06/09/2023 (Shift-02)",
    "A and B can finish a work in $5\\frac{1}{3}$ days. A alone can finish this work in 8 days. A and B worked on alternate days (starting with B) to finish this work. In how many days will the work be finished?",
    {
        "A": "6 days",
        "B": "11 days",
        "C": "$6\\frac{1}{3}\\text{ days}$",
        "D": "$11\\frac{1}{3}\\text{ days}$"
    },
    "$$5\\frac{1}{3} = \\frac{16}{3}\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(16, 8) = 16\\text{ units}$$\n$$\\text{Efficiency of (A + B)} = \\frac{16}{16/3} = 3,\\quad \\text{Efficiency of A} = \\frac{16}{8} = 2$$\n$$\\text{Efficiency of B} = 3 - 2 = 1\\text{ unit/day}$$\n$$\\text{Starting with B, work in 2-day cycle} = 1 + 2 = 3\\text{ units}$$\n$$\\text{In 5 cycles (10 days), work done} = 5 \\times 3 = 15\\text{ units}$$\n$$\\text{Remaining work} = 16 - 15 = 1\\text{ unit}$$\n$$\\text{Day 11: B finishes } 1\\text{ unit in } 1\\text{ day}$$\n$$\\text{Total time} = 10 + 1 = 11\\text{ days}$$"
)

add_q(
    99,
    "SSC CGL 08/12/2022 (Shift-02)",
    "In a factory, Ajay and Vijay work on the same machine to cut diamonds but on alternate hour basis. Ajay works for the first hour and then Vijay works for the second hour and so on. Ajay can complete the work in 6 hours, while Vijay completes it in 16 hours if they work individually. In how much time can they complete the work if they are using the machine on alternate basis?",
    {
        "A": "8 hours 30 min",
        "B": "8 hours",
        "C": "9 hours",
        "D": "9 hours 30 min"
    },
    "$$\\text{Total work} = \\text{LCM}(6, 16) = 48\\text{ units}$$\n$$\\text{Efficiency of Ajay} = 8\\text{ units/hour},\\quad \\text{Efficiency of Vijay} = 3\\text{ units/hour}$$\n$$\\text{Work in 2-hour cycle} = 8 + 3 = 11\\text{ units}$$\n$$\\text{In 4 cycles (8 hours), work done} = 4 \\times 11 = 44\\text{ units}$$\n$$\\text{Remaining work} = 48 - 44 = 4\\text{ units}$$\n$$\\text{Hour 9: Ajay works and takes } \\frac{4}{8} = \\frac{1}{2}\\text{ hour} = 30\\text{ minutes}$$\n$$\\text{Total time} = 8\\text{ hours } 30\\text{ minutes}$$"
)

add_q(
    100,
    "SSC CGL 13/12/2022 (Shift-03)",
    "Two persons A and B working separately can sanitise a building in 6 and 10 hours, respectively. They work in stretches of one hour alternately. In how many hours will the work be finished?",
    {
        "A": "$9\\frac{1}{3}\\text{ hours}$",
        "B": "$8\\frac{1}{3}\\text{ hours}$",
        "C": "$6\\frac{1}{3}\\text{ hours}$",
        "D": "$7\\frac{1}{3}\\text{ hours}$"
    },
    "$$\\text{Total work} = \\text{LCM}(6, 10) = 30\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work in 2-hour cycle} = 5 + 3 = 8\\text{ units}$$\n$$\\text{In 3 cycles (6 hours), work done} = 3 \\times 8 = 24\\text{ units}$$\n$$\\text{Remaining work} = 30 - 24 = 6\\text{ units}$$\n$$\\text{Hour 7: A does } 5\\text{ units. Remaining} = 1\\text{ unit}$$\n$$\\text{Hour 8: B takes } \\frac{1}{3}\\text{ hour}$$\n$$\\text{Total time} = 6 + 1 + \\frac{1}{3} = 7\\frac{1}{3}\\text{ hours}$$"
)

add_q(
    101,
    "SSC CHSL 24/05/2022 (Shift-03)",
    "Avi and Bindu can complete a project in 4 and 12 hours, respectively. Avi begins project at 5 a.m., and they work alternately for one hour each. When will the project be completed?",
    {
        "A": "9 am.",
        "B": "11 am.",
        "C": "1 pm.",
        "D": "10 am."
    },
    "$$\\text{Total work} = \\text{LCM}(4, 12) = 12\\text{ units}$$\n$$\\text{Efficiency of Avi} = 3,\\quad \\text{Efficiency of Bindu} = 1$$\n$$\\text{Work in 2-hour cycle} = 3 + 1 = 4\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{12}{4} = 3\\text{ cycles}$$\n$$\\text{Total hours taken} = 3 \\times 2 = 6\\text{ hours}$$\n$$\\text{Completion time} = 5\\text{ a.m.} + 6\\text{ hours} = 11\\text{ a.m.}$$"
)

add_q(
    102,
    "SSC CHSL 26/05/2022 (Shift-02)",
    "A man takes 16 days to complete a project. A woman does the same work in 12 days. They started the work together on alternate days and the man worked on the first day. How much time will they take to complete the work?",
    {
        "A": "$\\frac{58}{4}\\text{ Days}$",
        "B": "$\\frac{55}{4}\\text{ Days}$",
        "C": "$\\frac{33}{4}\\text{ Days}$",
        "D": "$\\frac{61}{4}\\text{ Days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(16, 12) = 48\\text{ units}$$\n$$\\text{Efficiency of Man} = 3,\\quad \\text{Efficiency of Woman} = 4$$\n$$\\text{Work in 2-day cycle} = 3 + 4 = 7\\text{ units}$$\n$$\\text{In 6 cycles (12 days), work done} = 6 \\times 7 = 42\\text{ units}$$\n$$\\text{Remaining work} = 48 - 42 = 6\\text{ units}$$\n$$\\text{Day 13: Man works and does } 3\\text{ units. Remaining} = 3\\text{ units}$$\n$$\\text{Day 14: Woman works and takes } \\frac{3}{4}\\text{ day}$$\n$$\\text{Total time} = 12 + 1 + \\frac{3}{4} = 13\\frac{3}{4} = \\frac{55}{4}\\text{ days}$$"
)

add_q(
    103,
    "SSC MTS 04/09/2023 (Shift-02)",
    "A, B and C can complete a work in 10, 15 and 20 days, respectively. They work on alternate days such that 1st day A, 2nd day B and 3rd day C. Again 4th day A, 5th day B and so on. If they work in the same way, in how many days will the work be completed?",
    {
        "A": "$13\\frac{1}{2}$",
        "B": "14",
        "C": "$13\\frac{1}{4}$",
        "D": "15"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 15, 20) = 60\\text{ units}$$\n$$\\text{Efficiency of A} = 6,\\quad \\text{Efficiency of B} = 4,\\quad \\text{Efficiency of C} = 3$$\n$$\\text{Work in 3-day cycle} = 6 + 4 + 3 = 13\\text{ units}$$\n$$\\text{In 4 cycles (12 days), work done} = 4 \\times 13 = 52\\text{ units}$$\n$$\\text{Remaining work} = 60 - 52 = 8\\text{ units}$$\n$$\\text{Day 13: A does } 6\\text{ units. Remaining} = 2\\text{ units}$$\n$$\\text{Day 14: B takes } \\frac{2}{4} = \\frac{1}{2}\\text{ day}$$\n$$\\text{Total time} = 12 + 1 + \\frac{1}{2} = 13\\frac{1}{2}\\text{ days}$$"
)

add_q(
    104,
    "SSC MTS 14/09/2023 (Shift-02)",
    "If Mohit, Nitu and Soma can complete a piece of work in 5 days, 6 days and 8 days, respectively, then in how many days will the work be completed if they work on alternate days starting with Mohit on first day, then Nitu on second day, then Soma on third day, then Mohit on fourth day and so on.",
    {
        "A": "$5\\frac{7}{12}$",
        "B": "$7\\frac{1}{60}$",
        "C": "$6\\frac{1}{12}$",
        "D": "$4\\frac{7}{15}$"
    },
    "$$\\text{Total work} = \\text{LCM}(5, 6, 8) = 120\\text{ units}$$\n$$\\text{Efficiency of Mohit} = 24,\\quad \\text{Efficiency of Nitu} = 20,\\quad \\text{Efficiency of Soma} = 15$$\n$$\\text{Work in 3-day cycle} = 24 + 20 + 15 = 59\\text{ units}$$\n$$\\text{In 2 cycles (6 days), work done} = 2 \\times 59 = 118\\text{ units}$$\n$$\\text{Remaining work} = 120 - 118 = 2\\text{ units}$$\n$$\\text{Day 7: Mohit takes } \\frac{2}{24} = \\frac{1}{12}\\text{ day}$$\n$$\\text{Total time} = 6 + \\frac{1}{12} = 6\\frac{1}{12}\\text{ days}$$"
)

add_q(
    105,
    "SSC Phase XI 27/06/2023 (Shift-01)",
    "A, B and C can separately complete a work in 20, 25 and 30 days, respectively. If A works on the first day alone, B on second day alone and C on the third day alone, and this sequence goes on further, in how many days will the entire work be finished?",
    {
        "A": "$25\\frac{4}{15}$",
        "B": "$24\\frac{1}{75}$",
        "C": "$25\\frac{1}{75}$",
        "D": "$24\\frac{4}{15}$"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 25, 30) = 300\\text{ units}$$\n$$\\text{Efficiency of A} = 15,\\quad \\text{Efficiency of B} = 12,\\quad \\text{Efficiency of C} = 10$$\n$$\\text{Work in 3-day cycle} = 15 + 12 + 10 = 37\\text{ units}$$\n$$\\text{In 8 cycles (24 days), work done} = 8 \\times 37 = 296\\text{ units}$$\n$$\\text{Remaining work} = 300 - 296 = 4\\text{ units}$$\n$$\\text{Day 25: A takes } \\frac{4}{15}\\text{ day}$$\n$$\\text{Total time} = 24 + \\frac{4}{15} = 24\\frac{4}{15}\\text{ days}$$"
)

add_q(
    106,
    "SSC MTS 05/09/2023 (Shift-02)",
    "Tushar, Megha, Punam and Richa can complete a piece of work in 10 days, 12 days, 15 days and 18 days, respectively. In how many days will the work be completed if each of them work on alternate days starting with Megha on first day, Punam on second day, Richa on third day, Tushar on fourth day and then again Megha on fifth day and so on.",
    {
        "A": "12",
        "B": "10",
        "C": "13",
        "D": "14"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 12, 15, 18) = 180\\text{ units}$$\n$$\\text{Eff}(\\text{Megha}) = 15,\\quad \\text{Eff}(\\text{Punam}) = 12,\\quad \\text{Eff}(\\text{Richa}) = 10,\\quad \\text{Eff}(\\text{Tushar}) = 18$$\n$$\\text{Order: Megha, Punam, Richa, Tushar}$$\n$$\\text{Work in 4-day cycle} = 15 + 12 + 10 + 18 = 55\\text{ units}$$\n$$\\text{In 3 cycles (12 days), work done} = 3 \\times 55 = 165\\text{ units}$$\n$$\\text{Remaining work} = 180 - 165 = 15\\text{ units}$$\n$$\\text{Day 13: Megha finishes } 15\\text{ units in exactly } 1\\text{ day}$$\n$$\\text{Total time} = 12 + 1 = 13\\text{ days}$$"
)

add_q(
    107,
    "SSC CHSL 25/05/2022 (Shift-01)",
    "A can do a piece of work in 24 days and B can do it in 80 days. B works alone for 2 days and A works alone on the 3rd day. This process continues till the work is completed. In how many days will the work be completed?",
    {
        "A": "42",
        "B": "45",
        "C": "48",
        "D": "44"
    },
    "$$\\text{Total work} = \\text{LCM}(24, 80) = 240\\text{ units}$$\n$$\\text{Efficiency of A} = 10,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work in 3-day cycle (B, B, A)} = 3 + 3 + 10 = 16\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{240}{16} = 15\\text{ cycles}$$\n$$\\text{Total time} = 15 \\times 3 = 45\\text{ days}$$"
)

add_q(
    108,
    "SSC CPO 27/06/2024 (Shift-01)",
    "A can complete a piece of work alone in 200 days, while B can complete the same piece of work alone in 100 days. In every three-day cycle, both A and B work on day 1, only A works on day 2, and only B works on day 3. This cycle continues till the work is completed. How many days in all does it take the duo to complete the work?",
    {
        "A": "$100\\frac{1}{3}$",
        "B": "$99\\frac{2}{3}$",
        "C": "$100\\frac{1}{2}$",
        "D": "100"
    },
    "$$\\text{Total work} = \\text{LCM}(200, 100) = 200\\text{ units}$$\n$$\\text{Efficiency of A} = 1,\\quad \\text{Efficiency of B} = 2$$\n$$\\text{Day 1 (A + B)} = 3,\\quad \\text{Day 2 (A)} = 1,\\quad \\text{Day 3 (B)} = 2$$\n$$\\text{Work in 3-day cycle} = 3 + 1 + 2 = 6\\text{ units}$$\n$$\\text{In 33 cycles (99 days), work done} = 33 \\times 6 = 198\\text{ units}$$\n$$\\text{Remaining work} = 200 - 198 = 2\\text{ units}$$\n$$\\text{Day 100: (A + B) work together and take } \\frac{2}{3}\\text{ day}$$\n$$\\text{Total time} = 99 + \\frac{2}{3} = 99\\frac{2}{3}\\text{ days}$$"
)

add_q(
    109,
    "SSC CPO 03/10/2023 (Shift-01)",
    "P, Q and R can do a piece of work in 20 days, 30 days and 60 days respectively. If P works daily and on every third day Q and R also work with P, then in how many days, will the work be completed?",
    {
        "A": "21 days",
        "B": "12 days",
        "C": "18 days",
        "D": "15 days"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 30, 60) = 60\\text{ units}$$\n$$\\text{Efficiency of P} = 3,\\quad \\text{Efficiency of Q} = 2,\\quad \\text{Efficiency of R} = 1$$\n$$\\text{Day 1 (P)} = 3,\\quad \\text{Day 2 (P)} = 3,\\quad \\text{Day 3 (P + Q + R)} = 6$$\n$$\\text{Work in 3-day cycle} = 3 + 3 + 6 = 12\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{60}{12} = 5\\text{ cycles}$$\n$$\\text{Total days} = 5 \\times 3 = 15\\text{ days}$$"
)

add_q(
    110,
    "SSC CPO 05/10/2023 (Shift-03)",
    "A, B and C can do a piece of work in 11 days, 20 days and 55 days respectively. How soon can the work be done if A works with B on first day, A works with C on second day and so on?",
    {
        "A": "9 days",
        "B": "$9\\frac{1}{2}\\text{ days}$",
        "C": "$8\\frac{1}{2}\\text{ days}$",
        "D": "8 days"
    },
    "$$\\text{Total work} = \\text{LCM}(11, 20, 55) = 220\\text{ units}$$\n$$\\text{Efficiency of A} = 20,\\quad \\text{Efficiency of B} = 11,\\quad \\text{Efficiency of C} = 4$$\n$$\\text{Day 1 (A + B)} = 20 + 11 = 31\\text{ units}$$\n$$\\text{Day 2 (A + C)} = 20 + 4 = 24\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 31 + 24 = 55\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{220}{55} = 4\\text{ cycles}$$\n$$\\text{Total days} = 4 \\times 2 = 8\\text{ days}$$"
)

add_q(
    111,
    "SSC CGL 26/07/2023 (Shift-03)",
    "X, Y and Z can complete a work in 5 days, 15 days and 30 days, respectively. In how many days can the work be completed if X is assisted by Y and Z together, on every second day?",
    {
        "A": "5 days",
        "B": "4 days",
        "C": "7 days",
        "D": "6 days"
    },
    "$$\\text{Total work} = \\text{LCM}(5, 15, 30) = 30\\text{ units}$$\n$$\\text{Efficiency of X} = 6,\\quad \\text{Efficiency of Y} = 2,\\quad \\text{Efficiency of Z} = 1$$\n$$\\text{Day 1 (X alone)} = 6\\text{ units}$$\n$$\\text{Day 2 (X + Y + Z)} = 6 + 2 + 1 = 9\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 6 + 9 = 15\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{30}{15} = 2\\text{ cycles}$$\n$$\\text{Total days} = 2 \\times 2 = 4\\text{ days}$$"
)

# --- PAGE 7: Q112 to Q127 ---

add_q(
    112,
    "SSC CGL TIER-II 07/03/2023",
    "P, Q and R can finish a work in 5 days, 10 days, and 15 days, respectively, working alone. P and Q works on first day, P and R works on second day and P and Q works on third day and so on till the work is completed. In how many days the work will be completed?",
    {
        "A": "$\\frac{13}{2}$",
        "B": "$\\frac{9}{2}$",
        "C": "$\\frac{7}{2}$",
        "D": "$\\frac{5}{2}$"
    },
    "$$\\text{Total work} = \\text{LCM}(5, 10, 15) = 30\\text{ units}$$\n$$\\text{Efficiency of P} = 6,\\quad \\text{Efficiency of Q} = 3,\\quad \\text{Efficiency of R} = 2$$\n$$\\text{Day 1 (P + Q)} = 6 + 3 = 9\\text{ units}$$\n$$\\text{Day 2 (P + R)} = 6 + 2 = 8\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 9 + 8 = 17\\text{ units}$$\n$$\\text{Remaining work after 2 days} = 30 - 17 = 13\\text{ units}$$\n$$\\text{Day 3 (P + Q)} = 9\\text{ units. Remaining} = 13 - 9 = 4\\text{ units}$$\n$$\\text{Day 4 (P + R)} = \\frac{4}{8} = \\frac{1}{2}\\text{ day}$$\n$$\\text{Total time} = 2 + 1 + \\frac{1}{2} = \\frac{7}{2}\\text{ days}$$"
)

add_q(
    113,
    "SSC CGL 01/12/2022 (Shift-02)",
    "A, B and C can complete a piece of work separately in 10, 20 and 40 days, respectively. In how many days will the work be completed if A is assisted by both B and C every third day?",
    {
        "A": "$8\\frac{2}{7}$",
        "B": "9",
        "C": "$10\\frac{2}{3}$",
        "D": "6"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 20, 40) = 40\\text{ units}$$\n$$\\text{Efficiency of A} = 4,\\quad \\text{Efficiency of B} = 2,\\quad \\text{Efficiency of C} = 1$$\n$$\\text{Day 1 (A)} = 4,\\quad \\text{Day 2 (A)} = 4,\\quad \\text{Day 3 (A + B + C)} = 4 + 2 + 1 = 7$$\n$$\\text{Work in 3-day cycle} = 4 + 4 + 7 = 15\\text{ units}$$\n$$\\text{In 2 cycles (6 days), work done} = 2 \\times 15 = 30\\text{ units}$$\n$$\\text{Remaining work} = 40 - 30 = 10\\text{ units}$$\n$$\\text{Day 7: A does } 4\\text{ units. Remaining} = 6\\text{ units}$$\n$$\\text{Day 8: A does } 4\\text{ units. Remaining} = 2\\text{ units}$$\n$$\\text{Day 9: (A + B + C) take } \\frac{2}{7}\\text{ day}$$\n$$\\text{Total time} = 6 + 2 + \\frac{2}{7} = 8\\frac{2}{7}\\text{ days}$$"
)

add_q(
    114,
    "SSC CGL 03/12/2022 (Shift-01)",
    "Ruchi, Khushi and Teju can do a piece of work in 30, 40 and 60 days respectively. In how many days can Ruchi do the work, if she is assisted by both Khushi and Teju on every third day?",
    {
        "A": "$\\frac{550}{12}\\text{ days}$",
        "B": "$\\frac{85}{4}\\text{ days}$",
        "C": "$\\frac{71}{2}\\text{ days}$",
        "D": "$\\frac{360}{17}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(30, 40, 60) = 120\\text{ units}$$\n$$\\text{Efficiency of Ruchi} = 4,\\quad \\text{Efficiency of Khushi} = 3,\\quad \\text{Efficiency of Teju} = 2$$\n$$\\text{Day 1 (Ruchi)} = 4,\\quad \\text{Day 2 (Ruchi)} = 4,\\quad \\text{Day 3 (All three)} = 9$$\n$$\\text{Work in 3-day cycle} = 4 + 4 + 9 = 17\\text{ units}$$\n$$\\text{In 7 cycles (21 days), work done} = 7 \\times 17 = 119\\text{ units}$$\n$$\\text{Remaining work} = 120 - 119 = 1\\text{ unit}$$\n$$\\text{Day 22: Ruchi takes } \\frac{1}{4}\\text{ day}$$\n$$\\text{Total time} = 21 + \\frac{1}{4} = \\frac{85}{4}\\text{ days}$$"
)

add_q(
    115,
    "SSC CGL 06/12/2022 (Shift-01)",
    "A, B and C can do a piece of work in 11 days, 20 days and 55 days respectively. If B works daily and is supported by A and C on alternate days beginning with A, then in how many days will the work be finished?",
    {
        "A": "10",
        "B": "$9\\frac{1}{3}$",
        "C": "12",
        "D": "8"
    },
    "$$\\text{Total work} = \\text{LCM}(11, 20, 55) = 220\\text{ units}$$\n$$\\text{Efficiency of A} = 20,\\quad \\text{Efficiency of B} = 11,\\quad \\text{Efficiency of C} = 4$$\n$$\\text{Day 1 (B + A)} = 11 + 20 = 31\\text{ units}$$\n$$\\text{Day 2 (B + C)} = 11 + 4 = 15\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 31 + 15 = 46\\text{ units}$$\n$$\\text{In 4 cycles (8 days), work done} = 4 \\times 46 = 184\\text{ units}$$\n$$\\text{Remaining work} = 220 - 184 = 36\\text{ units}$$\n$$\\text{Day 9 (B + A)} = 31\\text{ units. Remaining} = 5\\text{ units}$$\n$$\\text{Day 10 (B + C)} = \\frac{5}{15} = \\frac{1}{3}\\text{ day}$$\n$$\\text{Total time} = 8 + 1 + \\frac{1}{3} = 9\\frac{1}{3}\\text{ days}$$"
)

add_q(
    116,
    "SSC CGL TIER-II (08/08/2022)",
    "A alone can do a work in 11 days. B alone can do the same work in 22 days. C alone can do the same work in 33 days. They work in the following manner:\nDay 1: A and B work.\nDay 2: B and C work.\nDay 3: C and A work.\nDay 4: A and B work.\nIn how many days will the work be completed?",
    {
        "A": "12 days",
        "B": "3 days",
        "C": "6 days",
        "D": "9 days"
    },
    "$$\\text{Total work} = \\text{LCM}(11, 22, 33) = 66\\text{ units}$$\n$$\\text{Efficiency of A} = 6,\\quad \\text{Efficiency of B} = 3,\\quad \\text{Efficiency of C} = 2$$\n$$\\text{Day 1 (A + B)} = 6 + 3 = 9\\text{ units}$$\n$$\\text{Day 2 (B + C)} = 3 + 2 = 5\\text{ units}$$\n$$\\text{Day 3 (C + A)} = 2 + 6 = 8\\text{ units}$$\n$$\\text{Work in 3-day cycle} = 9 + 5 + 8 = 22\\text{ units}$$\n$$\\text{Number of cycles} = \\frac{66}{22} = 3\\text{ cycles}$$\n$$\\text{Total time} = 3 \\times 3 = 9\\text{ days}$$"
)

add_q(
    117,
    "SSC CPO 05/10/2023 (Shift-01)",
    "A and B complete a work in 24 and 30 days, respectively, working 10 hours per day. The work is to be done in two shifts. The morning shift is for 6 hours and the evening shift is for 4 hours. On the first day, A works in the morning and B works in the evening, and they interchange their shifts every day. On which day did the work get completed?",
    {
        "A": "24th day",
        "B": "27th day",
        "C": "30th day",
        "D": "21th day"
    },
    "$$\\text{Total work} = \\text{LCM}(240, 300) = 1200\\text{ units}$$\n$$\\text{Hourly efficiency of A} = 5,\\quad \\text{Hourly efficiency of B} = 4$$\n$$\\text{Odd days (A in morning 6h, B in evening 4h)} = (6 \\times 5) + (4 \\times 4) = 46\\text{ units}$$\n$$\\text{Even days (B in morning 6h, A in evening 4h)} = (6 \\times 4) + (4 \\times 5) = 44\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 46 + 44 = 90\\text{ units}$$\n$$\\text{In 13 cycles (26 days), work done} = 13 \\times 90 = 1170\\text{ units}$$\n$$\\text{Remaining work} = 1200 - 1170 = 30\\text{ units}$$\n$$\\text{On Day 27 (morning shift), A works 6h and does } 6 \\times 5 = 30\\text{ units}$$\n$$\\text{Thus, the work is completed on the 27th day.}$$"
)

add_q(
    118,
    "SSC CGL 24/07/2023 (Shift-04)",
    "R, S and T can finish a work in 20, 15 and 10 days, respectively, R works on all days and S and T work on alternate days with T starting the work on the first day. In how many days is the work finished?",
    {
        "A": "$\\frac{61}{7}$",
        "B": "$\\frac{50}{7}$",
        "C": "$\\frac{52}{7}$",
        "D": "$\\frac{54}{7}$"
    },
    "$$\\text{Total work} = \\text{LCM}(20, 15, 10) = 60\\text{ units}$$\n$$\\text{Efficiency of R} = 3,\\quad \\text{Efficiency of S} = 4,\\quad \\text{Efficiency of T} = 6$$\n$$\\text{Day 1 (R + T)} = 3 + 6 = 9\\text{ units}$$\n$$\\text{Day 2 (R + S)} = 3 + 4 = 7\\text{ units}$$\n$$\\text{Work in 2-day cycle} = 9 + 7 = 16\\text{ units}$$\n$$\\text{In 3 cycles (6 days), work done} = 3 \\times 16 = 48\\text{ units}$$\n$$\\text{Remaining work} = 60 - 48 = 12\\text{ units}$$\n$$\\text{Day 7 (R + T)} = 9\\text{ units. Remaining} = 3\\text{ units}$$\n$$\\text{Day 8 (R + S)} = \\frac{3}{7}\\text{ day}$$\n$$\\text{Total time} = 6 + 1 + \\frac{3}{7} = \\frac{52}{7}\\text{ days}$$"
)

add_q(
    119,
    "SSC CPO 05/10/2023 (Shift-03)",
    "A and B are equally efficient, and each can individually complete a piece of work in 36 days, if none takes any holiday. A and B started working together on this piece of work, but A took a day off after every five days of work, while B took a day off after every seven days of work. If they had started work on 1 July 2021, on which date was the work completed?",
    {
        "A": "19 July 2021",
        "B": "20 July 2021",
        "C": "22 July 2021",
        "D": "21 July 2021"
    },
    "$$\\text{Let efficiency of each be } 1\\text{ unit/day. Total work} = 36\\text{ units.}$$\n$$\\text{A rests on days: 6, 12, 18, 24...}$$\n$$\\text{B rests on days: 8, 16, 24...}$$\n$$\\text{Daily work tracking:}$$\n$$\\text{Days 1 to 5: both work } \\implies 5 \\times 2 = 10\\text{ units (cum. 10)}$$\n$$\\text{Day 6: A rests, B works } \\implies 1\\text{ unit (cum. 11)}$$\n$$\\text{Day 7: both work } \\implies 2\\text{ units (cum. 13)}$$\n$$\\text{Day 8: A works, B rests } \\implies 1\\text{ unit (cum. 14)}$$\n$$\\text{Days 9 to 11: both work } \\implies 3 \\times 2 = 6\\text{ units (cum. 20)}$$\n$$\\text{Day 12: A rests, B works } \\implies 1\\text{ unit (cum. 21)}$$\n$$\\text{Days 13 to 15: both work } \\implies 3 \\times 2 = 6\\text{ units (cum. 27)}$$\n$$\\text{Day 16: A works, B rests } \\implies 1\\text{ unit (cum. 28)}$$\n$$\\text{Day 17: both work } \\implies 2\\text{ units (cum. 30)}$$\n$$\\text{Day 18: A rests, B works } \\implies 1\\text{ unit (cum. 31)}$$\n$$\\text{Days 19 and 20: both work } \\implies 2 \\times 2 = 4\\text{ units (cum. 35)}$$\n$$\\text{Day 21: both work, needing only } 1\\text{ unit to reach 36 units.}$$\n$$\\text{Thus, the work is completed on Day 21, i.e., 21 July 2021.}$$"
)

add_q(
    120,
    "SSC CGL 18/07/2023 (Shift-03)",
    "A and B are equally efficient, and each could individually complete a piece of work in 30 days, if none took any holiday. A and B started working together on this piece of work, but A took a day off after every four days of work, while B took a day off after every five days of work. If the duo had started work on 01 August 2022, on which date was the work completed?",
    {
        "A": "19 August 2022",
        "B": "18 August 2022",
        "C": "16 August 2022",
        "D": "17 August 2022"
    },
    "$$\\text{Let efficiency of each be } 1\\text{ unit/day. Total work} = 30\\text{ units.}$$\n$$\\text{A rests on days: 5, 10, 15, 20...}$$\n$$\\text{B rests on days: 6, 12, 18, 24...}$$\n$$\\text{Daily tracking:}$$\n$$\\text{Days 1 to 4: both work } \\implies 4 \\times 2 = 8\\text{ units (cum. 8)}$$\n$$\\text{Day 5: A rests, B works } \\implies 1\\text{ unit (cum. 9)}$$\n$$\\text{Day 6: A works, B rests } \\implies 1\\text{ unit (cum. 10)}$$\n$$\\text{Days 7 to 9: both work } \\implies 3 \\times 2 = 6\\text{ units (cum. 16)}$$\n$$\\text{Day 10: A rests, B works } \\implies 1\\text{ unit (cum. 17)}$$\n$$\\text{Day 11: both work } \\implies 2\\text{ units (cum. 19)}$$\n$$\\text{Day 12: A works, B rests } \\implies 1\\text{ unit (cum. 20)}$$\n$$\\text{Days 13 to 14: both work } \\implies 2 \\times 2 = 4\\text{ units (cum. 24)}$$\n$$\\text{Day 15: A rests, B works } \\implies 1\\text{ unit (cum. 25)}$$\n$$\\text{Days 16 to 17: both work } \\implies 2 \\times 2 = 4\\text{ units (cum. 29)}$$\n$$\\text{Day 18: A works (B rests), doing the 30th unit.}$$\n$$\\text{Thus, the work was completed on Day 18, i.e., 18 August 2022.}$$"
)

add_q(
    121,
    "SSC MTS 05/10/2021 (Shift-01)",
    "Two men A and B, each working alone by working 12 hours per day, can complete a work in 20 days. For execution of the work, it was decided that A and B would be working for 8 and 6 hours per day, respectively, on alternate days starting with A. If it takes x days and y hours to complete the work then (x, y) is:",
    {
        "A": "(34, 4)",
        "B": "(33, 4)",
        "C": "(33, 2)",
        "D": "(34, 2)"
    },
    "$$\\text{Total work} = 20 \\times 12 = 240\\text{ man-hours}$$\n$$\\text{Day 1 (A): } 8\\text{ hours},\\quad \\text{Day 2 (B): } 6\\text{ hours}$$\n$$\\text{Work in 2-day cycle} = 8 + 6 = 14\\text{ hours}$$\n$$\\text{In 17 cycles (34 days), work done} = 17 \\times 14 = 238\\text{ hours}$$\n$$\\text{Remaining work} = 240 - 238 = 2\\text{ hours}$$\n$$\\text{On Day 35, A works for 2 hours to complete the remaining work.}$$\n$$\\text{Hence, } x = 34\\text{ full days and } y = 2\\text{ hours} \\implies (x, y) = (34, 2)$$"
)

add_q(
    122,
    "SSC CHSL TIER-II (18/11/2024)",
    "Ratnesh and Vineet worked on alternate days, starting with Ratnesh. The entire work got completed in $54\\frac{3}{4}$ days. If Ratnesh alone can finish the work in 48 days, then in how many days can Vineet alone do the work?",
    {
        "A": "62",
        "B": "64",
        "C": "60",
        "D": "66"
    },
    "$$\\text{Total time} = 54\\frac{3}{4}\\text{ days}$$\n$$\\text{Starting with Ratnesh: Ratnesh worked on odd days (27 full days } + \\frac{3}{4}\\text{ day}) = \\frac{111}{4}\\text{ days}$$\n$$\\text{Vineet worked on even days (27 full days)}$$\n$$\\text{Daily rate of Ratnesh} = \\frac{1}{48}$$\n$$\\text{Work done by Ratnesh} = \\frac{111}{4} \\times \\frac{1}{48} = \\frac{37}{64}$$\n$$\\text{Work done by Vineet} = 1 - \\frac{37}{64} = \\frac{27}{64}$$\n$$\\text{Daily rate of Vineet} = \\frac{27/64}{27} = \\frac{1}{64}$$\n$$\\text{Time taken by Vineet alone} = 64\\text{ days}$$"
)

add_q(
    123,
    "SSC MTS 08/09/2023 (Shift-01)",
    "A man and woman working on alternate days can finish a work in 15 days if the man works on the first day. The same work is finished in 14.5 days if they work on alternate days and if the woman starts on the first day. The work will be finished by a man alone in ______ days.",
    {
        "A": "22",
        "B": "15",
        "C": "21",
        "D": "25"
    },
    "$$\\text{Case 1 (Man starts, 15 days): Man works 8 days, Woman works 7 days: } W = 8M + 7W$$\n$$\\text{Case 2 (Woman starts, 14.5 days): Woman works 7.5 days, Man works 7 days: } W = 7M + 7.5W$$\n$$8M + 7W = 7M + 7.5W \\implies M = 0.5W \\implies W = 2M$$\n$$\\text{Total work } W = 8M + 7(2M) = 22M$$\n$$\\text{Time taken by a man alone} = 22\\text{ days}$$"
)

add_q(
    124,
    "SSC CGL 14/07/2023 (Shift-04)",
    "To do a certain work, Ajay and Bharat work on alternate days, with Bharat starting the work on the first day. Ajay can finish the work alone in 32 days. If the work gets completed in exactly 8 days, then Bharat alone can finish 7 times the same work in _____ days.",
    {
        "A": "$\\frac{28}{8}$",
        "B": "4",
        "C": "$\\frac{32}{7}$",
        "D": "32"
    },
    "$$\\text{In 8 days with Bharat starting, Bharat works 4 days and Ajay works 4 days.}$$\n$$\\text{Work done by Ajay in 4 days} = \\frac{4}{32} = \\frac{1}{8}$$\n$$\\text{Work done by Bharat in 4 days} = 1 - \\frac{1}{8} = \\frac{7}{8}$$\n$$\\text{Rate of Bharat} = \\frac{7/8}{4} = \\frac{7}{32}\\text{ work/day}$$\n$$\\text{Time for Bharat to complete 7 times the work} = \\frac{7}{7/32} = 32\\text{ days}$$"
)

add_q(
    125,
    "SSC CGL 13/08/2021 (Shift-01)",
    "To do a certain work, A and B work on alternate days with B beginning the work on the first day. A alone can complete the same work in 24 days. If the work gets completed in $11\\frac{1}{3}$ days, then B alone can complete $\\frac{7}{9}$ part of the original work in:",
    {
        "A": "$5\\frac{1}{2}\\text{ days}$",
        "B": "4 days",
        "C": "$4\\frac{1}{2}\\text{ days}$",
        "D": "6 days"
    },
    "$$\\text{In } 11\\frac{1}{3}\\text{ days with B starting:}$$\n$$\\text{B works on days 1, 3, 5, 7, 9, 11 (6 full days)}$$\n$$\\text{A works on days 2, 4, 6, 8, 10 (5 days) } + \\frac{1}{3}\\text{ of day 12} = \\frac{16}{3}\\text{ days}$$\n$$\\text{Work done by A} = \\frac{16}{3} \\times \\frac{1}{24} = \\frac{2}{9}$$\n$$\\text{Work done by B in 6 days} = 1 - \\frac{2}{9} = \\frac{7}{9}$$\n$$\\text{Hence, B alone completes } \\frac{7}{9}\\text{ of the original work in } 6\\text{ days.}$$"
)

add_q(
    126,
    "SSC Phase XII 21/06/2024 (Shift-03)",
    "Aman and Rajan are working at a construction site. In some engineering experiment, Aman is constructing a wall, while Rajan is demolishing that wall. Aman can completely build the wall in 15 days, while Rajan will take 20 days to completely demolish the wall. In how many days will the complete wall be built for the first time if they work on alternate days, with Aman working on the 1st day?",
    {
        "A": "57",
        "B": "117",
        "C": "113",
        "D": "120"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 20) = 60\\text{ units}$$\n$$\\text{Efficiency of Aman (building)} = +4\\text{ units/day}$$\n$$\\text{Efficiency of Rajan (demolishing)} = -3\\text{ units/day}$$\n$$\\text{Net work in 2-day cycle} = +4 - 3 = +1\\text{ unit}$$\n$$\\text{Target before final building day} = 60 - 4 = 56\\text{ units}$$\n$$\\text{Days to reach 56 units} = 56 \\times 2 = 112\\text{ days}$$\n$$\\text{On Day 113, Aman builds 4 units: total reaches } 56 + 4 = 60\\text{ units (completely built).}$$\n$$\\text{Total days} = 113\\text{ days}$$"
)

add_q(
    127,
    "SSC MTS 01/09/2023 (Shift-02)",
    "A can do a piece of work in 36 days, while B can do it in 48 days. B worked on it for 12 days and leaves it. How many days will A take to finish the remaining work?",
    {
        "A": "27",
        "B": "21",
        "C": "28",
        "D": "32"
    },
    "$$\\text{Total work} = \\text{LCM}(36, 48) = 144\\text{ units}$$\n$$\\text{Efficiency of A} = 4,\\quad \\text{Efficiency of B} = 3$$\n$$\\text{Work done by B in 12 days} = 12 \\times 3 = 36\\text{ units}$$\n$$\\text{Remaining work} = 144 - 36 = 108\\text{ units}$$\n$$\\text{Time taken by A alone} = \\frac{108}{4} = 27\\text{ days}$$"
)

# --- PAGE 8: Q128 to Q140 ---

add_q(
    128,
    "SSC MTS 08/09/2023 (Shift-03)",
    "A can do a piece of work in 10 days and B can do it in 15 days. They work together for 2 days and then A leaves. How long will B take to finish the remaining work?",
    {
        "A": "5 days",
        "B": "10 days",
        "C": "12 days",
        "D": "22 days"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 15) = 30\\text{ units}$$\n$$\\text{Efficiency of A} = 3,\\quad \\text{Efficiency of B} = 2$$\n$$\\text{Work done by (A + B) in 2 days} = 2 \\times (3 + 2) = 10\\text{ units}$$\n$$\\text{Remaining work} = 30 - 10 = 20\\text{ units}$$\n$$\\text{Time taken by B alone} = \\frac{20}{2} = 10\\text{ days}$$"
)

add_q(
    129,
    "SSC CPO 03/10/2023 (Shift-02)",
    "P and Q can do a work together in 30 days. Q and R can do the same work together in 24 days and R and P together in 20 days. They started the work together, but Q and R left after 10 days. How many more days will P take to finish the remaining work?",
    {
        "A": "23 days",
        "B": "19 days",
        "C": "21 days",
        "D": "18 days"
    },
    "$$\\text{Total work} = \\text{LCM}(30, 24, 20) = 120\\text{ units}$$\n$$\\text{Eff}(P + Q) = 4,\\quad \\text{Eff}(Q + R) = 5,\\quad \\text{Eff}(R + P) = 6$$\n$$2 \\times \\text{Eff}(P + Q + R) = 15 \\implies \\text{Eff}(P + Q + R) = 7.5\\text{ units/day}$$\n$$\\text{Efficiency of P} = 7.5 - 5 = 2.5\\text{ units/day}$$\n$$\\text{Work done by all three in 10 days} = 10 \\times 7.5 = 75\\text{ units}$$\n$$\\text{Remaining work} = 120 - 75 = 45\\text{ units}$$\n$$\\text{Time taken by P alone} = \\frac{45}{2.5} = 18\\text{ days}$$"
)

add_q(
    130,
    "SSC CHSL 09/07/2024 (Shift-01)",
    "Rohan alone can complete a work in 12 days and Hari alone can complete it in 16 days. They both work for 3 days and then Rohan leaves the work. After that Hari works alone and completes the work. In how many days will the total work be completed?",
    {
        "A": "9 days",
        "B": "$12\\frac{1}{3}\\text{ days}$",
        "C": "$12\\frac{2}{3}\\text{ days}$",
        "D": "12 days"
    },
    "$$\\text{Total work} = \\text{LCM}(12, 16) = 48\\text{ units}$$\n$$\\text{Efficiency of Rohan} = 4,\\quad \\text{Efficiency of Hari} = 3$$\n$$\\text{Work done by both in 3 days} = 3 \\times (4 + 3) = 21\\text{ units}$$\n$$\\text{Remaining work} = 48 - 21 = 27\\text{ units}$$\n$$\\text{Time taken by Hari alone} = \\frac{27}{3} = 9\\text{ days}$$\n$$\\text{Total days for work completion} = 3 + 9 = 12\\text{ days}$$"
)

add_q(
    131,
    "SSC CPO 28/06/2024 (Shift-03)",
    "P can do a piece of work in 30 days and Q in 40 days. They work together for 4 days and then Q leaves. The number of days taken by P to finish the remaining work is:",
    {
        "A": "23 days",
        "B": "28 days",
        "C": "30 days",
        "D": "7 days"
    },
    "$$\\text{Total work} = \\text{LCM}(30, 40) = 120\\text{ units}$$\n$$\\text{Efficiency of P} = 4,\\quad \\text{Efficiency of Q} = 3$$\n$$\\text{Work done by (P + Q) in 4 days} = 4 \\times (4 + 3) = 28\\text{ units}$$\n$$\\text{Remaining work} = 120 - 28 = 92\\text{ units}$$\n$$\\text{Time taken by P alone} = \\frac{92}{4} = 23\\text{ days}$$"
)

add_q(
    132,
    "SSC Phase XII 20/06/2024 (Shift-03)",
    "A and B can do a work in 15 days and 30 days, respectively. They start working together, but A leaves after 3 days. How much time will B take to complete the remaining work?",
    {
        "A": "21 days",
        "B": "28 days",
        "C": "24 days",
        "D": "32 days"
    },
    "$$\\text{Total work} = \\text{LCM}(15, 30) = 30\\text{ units}$$\n$$\\text{Efficiency of A} = 2,\\quad \\text{Efficiency of B} = 1$$\n$$\\text{Work done by (A + B) in 3 days} = 3 \\times (2 + 1) = 9\\text{ units}$$\n$$\\text{Remaining work} = 30 - 9 = 21\\text{ units}$$\n$$\\text{Time taken by B alone} = \\frac{21}{1} = 21\\text{ days}$$"
)

add_q(
    133,
    "SSC CGL 18/07/2023 (Shift-02)",
    "Raja and Rocky together can complete painting work in 5 days. Together they both start painting, but after 2 days, Rocky falls sick and leaves the work. If Raja completes the remaining painting in 4 days, find the number of days in which Rocky alone can do the work.",
    {
        "A": "12 days",
        "B": "15 days",
        "C": "20 days",
        "D": "10 days"
    },
    "$$\\text{Work done by (Raja + Rocky) in 2 days} = \\frac{2}{5}$$\n$$\\text{Remaining work} = 1 - \\frac{2}{5} = \\frac{3}{5}$$\n$$\\text{Rate of Raja} = \\frac{3/5}{4} = \\frac{3}{20}\\text{ work/day}$$\n$$\\text{Combined rate} = \\frac{1}{5} = \\frac{4}{20}\\text{ work/day}$$\n$$\\text{Rate of Rocky} = \\frac{4}{20} - \\frac{3}{20} = \\frac{1}{20}\\text{ work/day}$$\n$$\\text{Time taken by Rocky alone} = 20\\text{ days}$$"
)

add_q(
    134,
    "SSC CPO 10/11/2022 (Shift-03)",
    "A and B can complete a work in 36 days and 45 days respectively. They worked together for 2 days and then A left the work. In how many days will B complete the remaining work?",
    {
        "A": "41.5",
        "B": "40",
        "C": "41",
        "D": "40.5"
    },
    "$$\\text{Total work} = \\text{LCM}(36, 45) = 180\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 4$$\n$$\\text{Work done by (A + B) in 2 days} = 2 \\times (5 + 4) = 18\\text{ units}$$\n$$\\text{Remaining work} = 180 - 18 = 162\\text{ units}$$\n$$\\text{Time taken by B alone} = \\frac{162}{4} = 40.5\\text{ days}$$"
)

add_q(
    135,
    "SSC CHSL 11/08/2021 (Shift-01)",
    "X can complete half of the work in 20 days and Y can do one-fifth of the same work in 10 days. X started the work and left after 8 days. Then Y took over to complete the remaining work. The total number of days taken by them to complete the work is:",
    {
        "A": "48 days",
        "B": "40 days",
        "C": "60 days",
        "D": "50 days"
    },
    "$$\\text{Time for X to complete whole work} = 20 \\times 2 = 40\\text{ days}$$\n$$\\text{Time for Y to complete whole work} = 10 \\times 5 = 50\\text{ days}$$\n$$\\text{Total work} = \\text{LCM}(40, 50) = 200\\text{ units}$$\n$$\\text{Efficiency of X} = 5,\\quad \\text{Efficiency of Y} = 4$$\n$$\\text{Work done by X in 8 days} = 8 \\times 5 = 40\\text{ units}$$\n$$\\text{Remaining work} = 200 - 40 = 160\\text{ units}$$\n$$\\text{Time taken by Y alone} = \\frac{160}{4} = 40\\text{ days}$$\n$$\\text{Total days taken by them} = 8 + 40 = 48\\text{ days}$$"
)

add_q(
    136,
    "SSC MTS 15/06/2023 (Shift-02)",
    "B and C can complete a work alone in 10 days and 30 days respectively. They began the work together but B left the work after some days and C completed the remaining work in 10 days. After how many days from the beginning B left the work?",
    {
        "A": "4 days",
        "B": "6 days",
        "C": "8 days",
        "D": "5 days"
    },
    "$$\\text{Total work} = \\text{LCM}(10, 30) = 30\\text{ units}$$\n$$\\text{Efficiency of B} = 3,\\quad \\text{Efficiency of C} = 1$$\n$$\\text{Work done by C alone in last 10 days} = 10 \\times 1 = 10\\text{ units}$$\n$$\\text{Remaining work done by (B + C)} = 30 - 10 = 20\\text{ units}$$\n$$\\text{Combined efficiency of B and C} = 3 + 1 = 4\\text{ units/day}$$\n$$\\text{Days B and C worked together} = \\frac{20}{4} = 5\\text{ days}$$\n$$\\text{Hence, B left after 5 days from the beginning.}$$"
)

add_q(
    137,
    "SSC CGL 18/04/2022 (Shift-02)",
    "A can complete work in 25 days and B can complete the same work in 20 days. They started the work together but B left after 4 days and A continued to work. In how many days will the entire work be completed?",
    {
        "A": "22",
        "B": "25",
        "C": "20",
        "D": "28"
    },
    "$$\\text{Total work} = \\text{LCM}(25, 20) = 100\\text{ units}$$\n$$\\text{Efficiency of A} = 4,\\quad \\text{Efficiency of B} = 5$$\n$$\\text{Work done by (A + B) in 4 days} = 4 \\times (4 + 5) = 36\\text{ units}$$\n$$\\text{Remaining work} = 100 - 36 = 64\\text{ units}$$\n$$\\text{Time taken by A alone} = \\frac{64}{4} = 16\\text{ days}$$\n$$\\text{Total days to complete entire work} = 4 + 16 = 20\\text{ days}$$"
)

add_q(
    138,
    "SSC CGL 03/03/2020 (Shift-01)",
    "A, B and C can individually complete a work in 24, 15 and 12 days respectively. B and C started the work and left after working for 3 days, how many days will A take to complete the remaining work?",
    {
        "A": "$15\\frac{1}{2}$",
        "B": "18",
        "C": "$13\\frac{1}{5}$",
        "D": "11"
    },
    "$$\\text{Total work} = \\text{LCM}(24, 15, 12) = 120\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 8,\\quad \\text{Efficiency of C} = 10$$\n$$\\text{Work done by (B + C) in 3 days} = 3 \\times (8 + 10) = 54\\text{ units}$$\n$$\\text{Remaining work} = 120 - 54 = 66\\text{ units}$$\n$$\\text{Time taken by A alone} = \\frac{66}{5} = 13\\frac{1}{5}\\text{ days}$$"
)

add_q(
    139,
    "SSC Phase-XI 30/06/2023 (Shift-03)",
    "Shivam can do a piece of work in 6 days and Vivek in 24 days. They started work together but Shivam left the work 3 days before its completion. In how many days was the work completed?",
    {
        "A": "$7\\frac{4}{5}\\text{ days}$",
        "B": "$7\\frac{2}{5}\\text{ days}$",
        "C": "$7\\frac{3}{5}\\text{ days}$",
        "D": "$7\\frac{1}{5}\\text{ days}$"
    },
    "$$\\text{Total work} = \\text{LCM}(6, 24) = 24\\text{ units}$$\n$$\\text{Efficiency of Shivam} = 4,\\quad \\text{Efficiency of Vivek} = 1$$\n$$\\text{Work done by Vivek alone in last 3 days} = 3 \\times 1 = 3\\text{ units}$$\n$$\\text{Work done together by Shivam and Vivek} = 24 - 3 = 21\\text{ units}$$\n$$\\text{Days worked together} = \\frac{21}{4 + 1} = \\frac{21}{5} = 4\\frac{1}{5}\\text{ days}$$\n$$\\text{Total days to complete the work} = 4\\frac{1}{5} + 3 = 7\\frac{1}{5}\\text{ days}$$"
)

add_q(
    140,
    "SSC CGL 20/07/2023 (Shift-01)",
    "A and B can individually complete a piece of work in 18 days and 30 days, respectively. A and B started working together, but A left $16\\frac{2}{3}$ days before the work is completed and B alone completed the rest of the work. For how many days did A work?",
    {
        "A": "4",
        "B": "5",
        "C": "6",
        "D": "3"
    },
    "$$\\text{Total work} = \\text{LCM}(18, 30) = 90\\text{ units}$$\n$$\\text{Efficiency of A} = 5,\\quad \\text{Efficiency of B} = 3$$\n$$16\\frac{2}{3}\\text{ days} = \\frac{50}{3}\\text{ days}$$\n$$\\text{Work done by B alone in the last } \\frac{50}{3}\\text{ days} = \\frac{50}{3} \\times 3 = 50\\text{ units}$$\n$$\\text{Remaining work done by (A + B) together} = 90 - 50 = 40\\text{ units}$$\n$$\\text{Combined efficiency of (A + B)} = 5 + 3 = 8\\text{ units/day}$$\n$$\\text{Days A and B worked together} = \\frac{40}{8} = 5\\text{ days}$$\n$$\\text{Therefore, A worked for 5 days.}$$"
)

# Output destination
output_path = "scripts/time_work_extracted/ch12_part1_1_140.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully wrote {len(questions)} questions to {output_path}")

# Run comprehensive verification
assert len(questions) == 140, f"Expected 140 questions, got {len(questions)}"
for i, q in enumerate(questions):
    assert q["questionNumber"] == i + 1, f"Question number mismatch at index {i}: {q['questionNumber']}"
    assert len(q["options"]) == 4, f"Options count mismatch for Q{q['questionNumber']}"
    assert [opt["label"] for opt in q["options"]] == ["A", "B", "C", "D"], f"Option labels mismatch for Q{q['questionNumber']}"
    assert q["correctOption"] == official_key[str(q["questionNumber"])], f"Answer key mismatch for Q{q['questionNumber']}: got {q['correctOption']}, expected {official_key[str(q['questionNumber'])]}"
    assert q["examShift"], f"Empty exam shift for Q{q['questionNumber']}"
    assert q["questionText"], f"Empty question text for Q{q['questionNumber']}"
    assert q["solution"], f"Empty solution for Q{q['questionNumber']}"
    
    # Check typeHeaders
    qn = q["questionNumber"]
    if 1 <= qn <= 39:
        assert q["typeHeader"] == "TYPE - I: BASED ON TWO VARIABLES"
    elif 40 <= qn <= 86:
        assert q["typeHeader"] == "TYPE - II: BASED ON THREE VARIABLES"
    elif 87 <= qn <= 127:
        assert q["typeHeader"] == "TYPE - III: CONCEPT OF ALTERNATE DAYS"
    elif 128 <= qn <= 140:
        assert q["typeHeader"] == "TYPE - IV: CONCEPT OF LEAVING THE WORK"

print("All assertions passed perfectly! 100% verified.")
