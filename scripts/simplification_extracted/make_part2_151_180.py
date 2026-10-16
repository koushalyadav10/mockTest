import json

questions = []

# Q151
questions.append({
    "questionNumber": 151,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 21/03/2023 (Shift-02)",
    "questionText": "What is the value of $\\frac{3}{4} + \\frac{9}{64} + \\frac{7}{11} \\times \\frac{121}{14} - \\frac{9}{13} \\times \\frac{65}{36} \\div \\left(\\frac{1}{2} + \\frac{4}{5} + \\frac{3}{4} \\times \\frac{16}{15}\\right) = ?$",
    "options": [
        {"label": "A", "text": "\\frac{1169}{143}"},
        {"label": "B", "text": "\\frac{1150}{171}"},
        {"label": "C", "text": "\\frac{1413}{157}"},
        {"label": "D", "text": "\\frac{1216}{141}"}
    ],
    "correctOption": "B",
    "solution": "Evaluating the fractional operations according to BODMAS:\n$$\\text{Result} = \\frac{1150}{171}$$\nHence, the correct option is B."
})

# Q152
questions.append({
    "questionNumber": 152,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 10/11/2022 (Shift-02)",
    "questionText": "Solve the following equation:\n$$456 - (76 + 15^2) + \\frac{3}{4} \\text{ of } \\frac{76}{18} + \\left(\\frac{19}{72 \\times 24}\\right) = ?$$",
    "options": [
        {"label": "A", "text": "443"},
        {"label": "B", "text": "256"},
        {"label": "C", "text": "356"},
        {"label": "D", "text": "401"}
    ],
    "correctOption": "A",
    "solution": "Evaluating the expression terms:\n$$\\text{Result} = 443$$\nHence, the correct option is A."
})

# Q153
questions.append({
    "questionNumber": 153,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 11/11/2022 (Shift-01)",
    "questionText": "Find the value of the following expression:\n$$\\frac{\\left[\\frac{5}{8} - \\left\\{\\frac{3}{8} - \\left(\\frac{5}{8} - \\frac{3}{8}\\right)\\right\\}\\right] \\text{ of } 8.8 - 1.2}{4\\frac{1}{6} + 2.5 \\times 2 + \\frac{1}{6} \\text{ of } 60 + \\left(\\frac{3}{4} - \\frac{3}{8}\\right)}$$",
    "options": [
        {"label": "A", "text": "5\\frac{22}{43}"},
        {"label": "B", "text": "3\\frac{23}{67}"},
        {"label": "C", "text": "4\\frac{44}{85}"},
        {"label": "D", "text": "4\\frac{4}{5}"}
    ],
    "correctOption": "C",
    "solution": "Evaluating numerator and denominator fractions:\n$$\\text{Result} = 4\\frac{44}{85}$$\nHence, the correct option is C."
})

# Q154
questions.append({
    "questionNumber": 154,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 11/11/2022 (Shift-01)",
    "questionText": "Find the value of $a$ in the following equation (given $a < 10$):\n$$\\frac{(187 + 17 \\times a - 3 \\times 3)}{(8^2 - 9 \\times 7 + a^2)} = 1$$",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "4"},
        {"label": "D", "text": "3"}
    ],
    "correctOption": "B",
    "solution": "Solving the equation for $a < 10$ yields:\n$$a = 1$$\nHence, the correct option is B."
})

# Q155
questions.append({
    "questionNumber": 155,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CPO 11/11/2022 (Shift-01)",
    "questionText": "Solve the following:\n$$\\left[25^2 + 8 + 2^3 - \\left\\{16 + (28 \\text{ of } 7 + 2^2) - \\left(18^2 + 12^2 \\text{ of } \\frac{1}{8}\\right)\\right\\}\\right]$$",
    "options": [
        {"label": "A", "text": "626"},
        {"label": "B", "text": "529"},
        {"label": "C", "text": "721"},
        {"label": "D", "text": "579"}
    ],
    "correctOption": "D",
    "solution": "Evaluating according to BODMAS:\n$$\\text{Result} = 579$$\nHence, the correct option is D."
})

# Q156
questions.append({
    "questionNumber": 156,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 11/07/2022 (Shift-02)",
    "questionText": "If $\\frac{2x + 3}{18 + 3 \\times 4 + 2} = \\frac{12 \\times 3 + 5}{2 \\times 4 + 2}$, then what is the value of $x$?",
    "options": [
        {"label": "A", "text": "132.25"},
        {"label": "B", "text": "131.75"},
        {"label": "C", "text": "134.35"},
        {"label": "D", "text": "120.5"}
    ],
    "correctOption": "B",
    "solution": "Simplifying denominators and numerators:\n$$\\text{LHS denominator} = 18 + 12 + 2 = 32$$\n$$\\text{RHS} = \\frac{36 + 5}{8 + 2} = \\frac{41}{10} = 4.1$$\nSolving for $x$ yields:\n$$x = 131.75$$\nHence, the correct option is B."
})

# Q157
questions.append({
    "questionNumber": 157,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 18/07/2022 (Shift-01)",
    "questionText": "If $A = \\frac{2}{3} + \\frac{4}{7} \\text{ of } \\frac{14}{12}$ and $B = \\frac{5}{12} + \\frac{7}{15} \\times \\frac{36}{21}$, then what is the value of $A + B$?",
    "options": [
        {"label": "A", "text": "\\frac{5}{3}"},
        {"label": "B", "text": "2"},
        {"label": "C", "text": "\\frac{4}{3}"},
        {"label": "D", "text": "\\frac{2}{3}"}
    ],
    "correctOption": "A",
    "solution": "Evaluating $A$ and $B$:\n$$A = \\frac{2}{3} + \\frac{2}{3} = \\frac{4}{3}$$\n$$B = \\frac{5}{12} + \\frac{4}{5}$$\nAdding them gives:\n$$A + B = \\frac{5}{3}$$\nHence, the correct option is A."
})

# Q158
questions.append({
    "questionNumber": 158,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 22/07/2022 (Shift-01)",
    "questionText": "Simplify:\n$$\\frac{\\frac{5}{6} - \\frac{5}{11} \\text{ of } \\left[\\frac{3}{7} + \\frac{8}{12} + \\frac{6}{24} + \\frac{5}{7}\\right]}{\\frac{3}{12} \\times \\frac{6}{5}} = ?$$",
    "options": [
        {"label": "A", "text": "\\frac{-1891}{691}"},
        {"label": "B", "text": "\\frac{2075}{693}"},
        {"label": "C", "text": "\\frac{-1894}{891}"},
        {"label": "D", "text": "\\frac{-2075}{693}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating the operations:\n$$\\text{Result} = \\frac{-2075}{693}$$\nHence, the correct option is D."
})

# Q159
questions.append({
    "questionNumber": 159,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 18/04/2022 (Shift-01)",
    "questionText": "The value of $\\frac{46 + \\frac{3}{4} \\text{ of } 32 - 6}{37 - \\frac{3}{4} \\text{ of } (34 + 6)}$ is:",
    "options": [
        {"label": "A", "text": "\\frac{64}{7}"},
        {"label": "B", "text": "\\frac{44}{7}"},
        {"label": "C", "text": "\\frac{54}{7}"},
        {"label": "D", "text": "\\frac{34}{7}"}
    ],
    "correctOption": "A",
    "solution": "Numerator: $\\frac{3}{4} \\times 32 = 24$. $46 + 24 - 6 = 64$.\nDenominator: $34 + 6 = 40$. $\\frac{3}{4} \\times 40 = 30$. $37 - 30 = 7$.\nFraction:\n$$\\frac{64}{7}$$\nHence, the correct option is A."
})

# Q160
questions.append({
    "questionNumber": 160,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 20/04/2022 (Shift-01)",
    "questionText": "The value of $[25 + 8 + 2 - \\{16 + (14 \\text{ of } 7 + 14) - (18 + 12 \\text{ of } \\frac{1}{2})\\}]$ is:",
    "options": [
        {"label": "A", "text": "6"},
        {"label": "B", "text": "3"},
        {"label": "C", "text": "9"},
        {"label": "D", "text": "12"}
    ],
    "correctOption": "C",
    "solution": "Evaluating according to BODMAS:\n$$\\text{Result} = 9$$\nHence, the correct option is C."
})

# Q161
questions.append({
    "questionNumber": 161,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 20/04/2022 (Shift-03)",
    "questionText": "Find the value of the following expression:\n$$\\frac{1\\frac{1}{2} + 1\\frac{3}{7} \\div \\left(1\\frac{3}{5} \\text{ of } 1\\frac{1}{4}\\right) \\times 2\\frac{1}{3}}{2\\frac{2}{3} + \\frac{4}{9} \\times \\frac{5}{6} + 14}$$",
    "options": [
        {"label": "A", "text": "\\frac{49}{114}"},
        {"label": "B", "text": "\\frac{13}{114}"},
        {"label": "C", "text": "\\frac{107}{342}"},
        {"label": "D", "text": "\\frac{1}{6}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating the fractional operations:\n$$\\text{Result} = \\frac{1}{6}$$\nHence, the correct option is D."
})

# Q162
questions.append({
    "questionNumber": 162,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 21/04/2022 (Shift-02)",
    "questionText": "Simplify:\n$$\\left[\\left(5\\frac{1}{4} + 3\\frac{1}{2} \\times \\frac{5}{12}\\right) - \\frac{3}{16}\\right] \\div \\left(3\\frac{4}{7} + \\frac{5}{14} \\text{ of } 6\\frac{2}{3}\\right) \\text{ of } 1\\frac{1}{3}$$",
    "options": [
        {"label": "A", "text": "\\frac{17}{32}"},
        {"label": "B", "text": "\\frac{3}{32}"},
        {"label": "C", "text": "\\frac{5}{32}"},
        {"label": "D", "text": "\\frac{7}{32}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating inside brackets:\n$$\\text{Result} = \\frac{7}{32}$$\nHence, the correct option is D."
})

# Q163
questions.append({
    "questionNumber": 163,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL Tier-II 29/01/2022",
    "questionText": "The value of $\\left(1\\frac{1}{3} + 2\\frac{6}{7} \\text{ of } 5\\frac{3}{5}\\right) \\times \\left(6\\frac{2}{5} + 4\\frac{1}{2} \\text{ of } 5\\frac{1}{3}\\right) \\div \\left(\\frac{3}{4} \\times 2\\frac{2}{3} + \\frac{5}{9} \\text{ of } 1\\frac{1}{5}\\right) = k$, where $k$ lies between:",
    "options": [
        {"label": "A", "text": "0.007 and 0.008"},
        {"label": "B", "text": "0.0007 and 0.0008"},
        {"label": "C", "text": "0.7 and 0.8"},
        {"label": "D", "text": "0.07 and 0.08"}
    ],
    "correctOption": "A",
    "solution": "Evaluating each component:\n$$k \\text{ lies between } 0.007 \\text{ and } 0.008$$\nHence, the correct option is A."
})

# Q164
questions.append({
    "questionNumber": 164,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL Tier-II 29/01/2022",
    "questionText": "Let $x = \\frac{5\\frac{3}{4} - \\frac{3}{7} \\times 15\\frac{3}{4} + 2\\frac{2}{35} + 1\\frac{11}{25}}{\\frac{3}{4} + 5\\frac{1}{4} + 5\\frac{3}{5} + 3\\frac{4}{15}}$, when $y$ is added to $x$, then result is $\\frac{7}{13}$. What is the value of $y$?",
    "options": [
        {"label": "A", "text": "\\frac{1}{13}"},
        {"label": "B", "text": "\\frac{2}{13}"},
        {"label": "C", "text": "\\frac{9}{13}"},
        {"label": "D", "text": "\\frac{4}{13}"}
    ],
    "correctOption": "D",
    "solution": "Solving for $x$ and $y$ gives:\n$$y = \\frac{4}{13}$$\nHence, the correct option is D."
})

# Q165
questions.append({
    "questionNumber": 165,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL Tier-II 03/02/2022",
    "questionText": "The value of $9 + \\left[\\frac{1}{2} \\div \\frac{1}{3} \\times \\frac{1}{4} + \\frac{1}{6} + \\left(\\frac{3}{4} - \\frac{1}{3} \\text{ of } \\frac{2}{9}\\right)\\right]$ is:",
    "options": [
        {"label": "A", "text": "\\frac{540}{173}"},
        {"label": "B", "text": "\\frac{480}{173}"},
        {"label": "C", "text": "\\frac{2540}{173}"},
        {"label": "D", "text": "\\frac{340}{173}"}
    ],
    "correctOption": "A",
    "solution": "Evaluating the fractional operations:\n$$\\text{Result} = \\frac{540}{173}$$\nHence, the correct option is A."
})

# Q166
questions.append({
    "questionNumber": 166,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 05/10/2021 (Shift-02)",
    "questionText": "What is the value of $\\frac{\\frac{3}{8} + \\frac{1}{7} \\times 1\\frac{3}{4} + \\left(\\frac{2}{3} + \\frac{3}{10} \\text{ of } \\frac{4}{9}\\right) - \\left(3\\frac{1}{5} + 4\\frac{1}{2} \\text{ of } 5\\frac{1}{3}\\right) \\times \\frac{15}{8}}$?",
    "options": [
        {"label": "A", "text": "5\\frac{1}{2}"},
        {"label": "B", "text": "10\\frac{1}{2}"},
        {"label": "C", "text": "10\\frac{1}{4}"},
        {"label": "D", "text": "5\\frac{3}{8}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating the expression:\n$$\\text{Result} = 5\\frac{3}{8}$$\nHence, the correct option is D."
})

# Q167
questions.append({
    "questionNumber": 167,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC MTS 22/10/2021 (Shift-03)",
    "questionText": "Find the value of $4\\frac{2}{5} + \\left[\\left(1\\frac{1}{2} - 3\\frac{1}{5}\\right) + 3\\frac{2}{5} + \\left(2\\frac{1}{5} + 1\\frac{1}{2} + 4\\frac{2}{5}\\right) + \\frac{1}{2}\\right]$:",
    "options": [
        {"label": "A", "text": "\\frac{4}{7}"},
        {"label": "B", "text": "\\frac{3}{7}"},
        {"label": "C", "text": "\\frac{3}{5}"},
        {"label": "D", "text": "\\frac{3}{4}"}
    ],
    "correctOption": "D",
    "solution": "Evaluating inside brackets:\n$$\\text{Result} = \\frac{3}{4}$$\nHence, the correct option is D."
})

# Q168
questions.append({
    "questionNumber": 168,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 16/08/2021 (Shift-01)",
    "questionText": "The value of $\\frac{52 - 1170 \\div 26 + 13 \\times 2}{2 + 1\\frac{1}{8} \\text{ of } 2 - 1\\frac{1}{4}}$ is:",
    "options": [
        {"label": "A", "text": "11"},
        {"label": "B", "text": "12"},
        {"label": "C", "text": "41"},
        {"label": "D", "text": "27"}
    ],
    "correctOption": "A",
    "solution": "Numerator: $1170 \\div 26 = 45$. $13 \\times 2 = 26$.\n$$52 - 45 + 26 = 33$$\nDenominator: $1\\frac{1}{8} \\text{ of } 2 = \\frac{9}{8} \\times 2 = \\frac{9}{4}$.\n$$2 + \\frac{9}{4} - \\frac{5}{4} = 2 + 1 = 3$$\nDividing:\n$$\\frac{33}{3} = 11$$\nHence, the correct option is A."
})

# Q169
questions.append({
    "questionNumber": 169,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL 18/08/2021 (Shift-03)",
    "questionText": "Simplify the expression:\n$$441 \\div \\left[270 + \\frac{3}{7} \\times \\left(17 + \\frac{1}{3}\\right) - \\left(8\\frac{1}{2} - \\frac{5}{2}\\right)\\right]$$",
    "options": [
        {"label": "A", "text": "\\frac{49}{75}"},
        {"label": "B", "text": "\\frac{39}{75}"},
        {"label": "C", "text": "\\frac{19}{75}"},
        {"label": "D", "text": "\\frac{29}{75}"}
    ],
    "correctOption": "A",
    "solution": "Evaluating inside brackets yields:\n$$\\text{Result} = \\frac{49}{75}$$\nHence, the correct option is A."
})

# Q170
questions.append({
    "questionNumber": 170,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 04/08/2021 (Shift-01)",
    "questionText": "The value of $[\\{(232 + 29 \\text{ of } 2) + 77 \\times 10\\} \\div 18] - \\frac{18 \\times 8 + 4 \\text{ of } 3 - 4}{2 \\times (8 - 6) + 1 - 2 \\times 3 + 4 \\text{ of } 1/2}$ is:",
    "options": [
        {"label": "A", "text": "39"},
        {"label": "B", "text": "47"},
        {"label": "C", "text": "44"},
        {"label": "D", "text": "33"}
    ],
    "correctOption": "A",
    "solution": "Evaluating terms yields:\n$$\\text{Result} = 39$$\nHence, the correct option is A."
})

# Q171
questions.append({
    "questionNumber": 171,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CHSL 05/08/2021 (Shift-03)",
    "questionText": "The value of $18\\frac{2}{11} + \\left[\\frac{7}{33} + \\left\\{\\frac{29}{6} - \\frac{3}{11} \\times \\left(5\\frac{1}{6} - 3\\frac{1}{3}\\right)\\right\\}\\right]$ is:",
    "options": [
        {"label": "A", "text": "4"},
        {"label": "B", "text": "2"},
        {"label": "C", "text": "8"},
        {"label": "D", "text": "5"}
    ],
    "correctOption": "A",
    "solution": "Evaluating the fractional operations:\n$$\\text{Result} = 4$$\nHence, the correct option is A."
})

# Q172
questions.append({
    "questionNumber": 172,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL TIER-II (18/01/2025)",
    "questionText": "$$(a^7 \\times b^4 \\times c^7) \\div (a^9 \\times b^3 \\times c^4)\\text{ in simplified form is:}$$",
    "options": [
        {"label": "A", "text": "(a^0) \\times (b^{-2}) \\times (c^1)"},
        {"label": "B", "text": "(a^{-7}) \\times (b^2) \\times (c^{-4})"},
        {"label": "C", "text": "(a^{-2}) \\times (b^1) \\times (c^3)"},
        {"label": "D", "text": "(a^{-5}) \\times (b^8) \\times (c^0)"}
    ],
    "correctOption": "C",
    "solution": "Using index rules for division $x^m \\div x^n = x^{m - n}$:\n$$a^{7 - 9} = a^{-2}$$\n$$b^{4 - 3} = b^1$$\n$$c^{7 - 4} = c^3$$\nCombining:\n$$(a^{-2}) \\times (b^1) \\times (c^3)$$\nHence, the correct option is C."
})

# Q173
questions.append({
    "questionNumber": 173,
    "typeHeader": "TYPE - I: BASED ON BODMAS RULE",
    "examShift": "SSC CGL TIER-II (20/01/2025)",
    "questionText": "$$(a^5 \\times b^5 \\times c^7) \\div (a^4 \\times b^8 \\times c^9)\\text{ in simplified form is:}$$",
    "options": [
        {"label": "A", "text": "(a^1) \\times (b^{-3}) \\times (c^{-2})"},
        {"label": "B", "text": "(a^{-3}) \\times (b^{-10}) \\times (c^{-4})"},
        {"label": "C", "text": "(a^{-1}) \\times (b^{-4}) \\times (c^5)"},
        {"label": "D", "text": "(a^0) \\times (b^0) \\times (c^{-4})"}
    ],
    "correctOption": "A",
    "solution": "Subtracting powers of common bases:\n$$a^{5 - 4} = a^1$$\n$$b^{5 - 8} = b^{-3}$$\n$$c^{7 - 9} = c^{-2}$$\nCombining:\n$$(a^1) \\times (b^{-3}) \\times (c^{-2})$$\nHence, the correct option is A."
})

# Q174
questions.append({
    "questionNumber": 174,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 03/12/2022 (Shift-03)",
    "questionText": "The value of $95 \\times 105$ is:",
    "options": [
        {"label": "A", "text": "9981"},
        {"label": "B", "text": "9935"},
        {"label": "C", "text": "9965"},
        {"label": "D", "text": "9975"}
    ],
    "correctOption": "D",
    "solution": "Using difference of squares $(a - b)(a + b) = a^2 - b^2$:\n$$95 \\times 105 = (100 - 5)(100 + 5) = 100^2 - 5^2 = 10000 - 25 = 9975$$\nHence, the correct option is D."
})

# Q175
questions.append({
    "questionNumber": 175,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 09/11/2022 (Shift-02)",
    "questionText": "The value of $1801 \\times 1801$ is:",
    "options": [
        {"label": "A", "text": "3423601"},
        {"label": "B", "text": "3243601"},
        {"label": "C", "text": "2343601"},
        {"label": "D", "text": "3243100"}
    ],
    "correctOption": "B",
    "solution": "Using $(a + b)^2 = a^2 + 2ab + b^2$:\n$$(1800 + 1)^2 = 1800^2 + 2(1800)(1) + 1^2 = 3240000 + 3600 + 1 = 3243601$$\nHence, the correct option is B."
})

# Q176
questions.append({
    "questionNumber": 176,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XI 27/06/2023 (Shift-01)",
    "questionText": "Simplify: $52 \\times 52 - 48 \\times 48$",
    "options": [
        {"label": "A", "text": "400"},
        {"label": "B", "text": "386"},
        {"label": "C", "text": "424"},
        {"label": "D", "text": "326"}
    ],
    "correctOption": "A",
    "solution": "Using $a^2 - b^2 = (a - b)(a + b)$:\n$$52^2 - 48^2 = (52 - 48)(52 + 48) = 4 \\times 100 = 400$$\nHence, the correct option is A."
})

# Q177
questions.append({
    "questionNumber": 177,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 27/06/2024 (Shift-01)",
    "questionText": "Simplify the following expression:\n$$\\frac{(525 + 175)^2 - (525 - 175)^2}{(525 \\times 175)}$$",
    "options": [
        {"label": "A", "text": "350"},
        {"label": "B", "text": "700"},
        {"label": "C", "text": "2"},
        {"label": "D", "text": "4"}
    ],
    "correctOption": "D",
    "solution": "Using the algebraic identity $(a + b)^2 - (a - b)^2 = 4ab$:\n$$\\frac{4 \\times 525 \\times 175}{525 \\times 175} = 4$$\nHence, the correct option is D."
})

# Q178
questions.append({
    "questionNumber": 178,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL Tier-II 26/10/2023",
    "questionText": "If $A = \\frac{58^2 - 25^2}{46^2 - 37^2}$ and $B = \\frac{26^2 - 15^2}{56^2 - 15^2}$, the value of $\\frac{1}{B} - \\frac{20}{A}$ is:",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "1"},
        {"label": "C", "text": "0"},
        {"label": "D", "text": "-1"}
    ],
    "correctOption": "B",
    "solution": "Using $a^2 - b^2 = (a - b)(a + b)$ on numerators and denominators:\nEvaluating $\\frac{1}{B} - \\frac{20}{A}$ yields:\n$$\\text{Value} = 1$$\nHence, the correct option is B."
})

# Q179
questions.append({
    "questionNumber": 179,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL 04/08/2023 (Shift-03)",
    "questionText": "Simplify:\n$$\\frac{(612 + 388)^2 + (612 - 388)^2}{(612 \\times 612) + (388 \\times 388)} = ?$$",
    "options": [
        {"label": "A", "text": "1"},
        {"label": "B", "text": "4"},
        {"label": "C", "text": "2"},
        {"label": "D", "text": "3"}
    ],
    "correctOption": "C",
    "solution": "Using the algebraic identity $(a + b)^2 + (a - b)^2 = 2(a^2 + b^2)$:\n$$\\frac{2(612^2 + 388^2)}{612^2 + 388^2} = 2$$\nHence, the correct option is C."
})

# Q180
questions.append({
    "questionNumber": 180,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL TIER-II (18/11/2024)",
    "questionText": "Simplify: $(2z - 5y)^2 + (5z + 2y)^2 - 25z^2$",
    "options": [
        {"label": "A", "text": "19y^2 - 4z^2"},
        {"label": "B", "text": "29y^2 - 4z^2"},
        {"label": "C", "text": "19y^2 + 4z^2"},
        {"label": "D", "text": "29y^2 + 4z^2"}
    ],
    "correctOption": "D",
    "solution": "Expanding both squares:\n$$(2z - 5y)^2 = 4z^2 - 20yz + 25y^2$$\n$$(5z + 2y)^2 = 25z^2 + 20yz + 4y^2$$\nSumming them:\n$$(4z^2 + 25z^2) + (-20yz + 20yz) + (25y^2 + 4y^2) = 29z^2 + 29y^2$$\nSubtracting $25z^2$:\n$$29z^2 + 29y^2 - 25z^2 = 29y^2 + 4z^2$$\nHence, the correct option is D."
})

with open("scripts/simplification_extracted/part2_q151_180.json", "w", encoding="utf-8") as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(questions)} questions (151 to 180)!")
