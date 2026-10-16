# Builder script for Questions 191 to 210
import json

questions = []

questions.append({
    "questionNumber": 191,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 23/11/2020 (Shift-02)",
    "questionText": "The value of $\\frac{0.325 \\times 0.325 + 0.175 \\times 0.175 + 25 \\times 0.00455}{5 \\times 0.0065 \\times 3.25 - 7 \\times 0.175 \\times 0.025} - \\frac{0.5}{1.5}$ is:",
    "options": [
        {"label": "A", "text": "3"},
        {"label": "B", "text": "0"},
        {"label": "C", "text": "-1"},
        {"label": "D", "text": "-3"}
    ],
    "correctOption": "A",
    "solution": "Let $a = 0.325$ and $b = 0.175$.\nNotice that $2ab = 2 \\times 0.325 \\times 0.175 = 0.11375$.\nAlso, $25 \\times 0.00455 = 0.11375 = 2ab$.\nThus, the numerator is:\n$$a^2 + b^2 + 2ab = (a + b)^2 = (0.325 + 0.175)^2 = (0.5)^2 = 0.25$$\nFor the denominator:\n$$5 \\times 0.0065 \\times 3.25 = 0.0325 \\times 3.25 = 0.105625$$\n$$7 \\times 0.175 \\times 0.025 = 0.030625$$\n$$\\text{Denominator} = 0.105625 - 0.030625 = 0.075 = \\frac{3}{40}$$\nThus, the first fraction is:\n$$\\frac{0.25}{0.075} = \\frac{250}{75} = \\frac{10}{3}$$\nThe second fraction is:\n$$\\frac{0.5}{1.5} = \\frac{1}{3}$$\nSubtracting them:\n$$\\frac{10}{3} - \\frac{1}{3} = \\frac{9}{3} = 3$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 192,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL Tier-II 29/01/2022",
    "questionText": "The value of $\\frac{1}{4} + \\frac{[(20.35)^2 - (8.35)^2] \\times 0.0175}{(1.05)^2 + (1.05)(27.65)}$ is:",
    "options": [
        {"label": "A", "text": "\\frac{3}{10}"},
        {"label": "B", "text": "\\frac{9}{20}"},
        {"label": "C", "text": "\\frac{7}{20}"},
        {"label": "D", "text": "\\frac{3}{20}"}
    ],
    "correctOption": "B",
    "solution": "Simplify the numerator of the second term using $a^2 - b^2 = (a - b)(a + b)$:\n$$(20.35)^2 - (8.35)^2 = (20.35 - 8.35)(20.35 + 8.35) = 12 \\times 28.7$$\nSimplify the denominator by factoring out $1.05$:\n$$(1.05)^2 + (1.05)(27.65) = 1.05(1.05 + 27.65) = 1.05 \\times 28.7$$\nThus, the second term simplifies to:\n$$\\frac{12 \\times 28.7 \\times 0.0175}{1.05 \\times 28.7} = \\frac{12 \\times 0.0175}{1.05} = \\frac{0.21}{1.05} = \\frac{1}{5} = \\frac{4}{20}$$\nNow add $\\frac{1}{4}$:\n$$\\frac{1}{4} + \\frac{1}{5} = \\frac{5 + 4}{20} = \\frac{9}{20}$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 193,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC MTS 19/05/2023 (Shift-02)",
    "questionText": "Simplify $\\frac{2.5 \\times 2.5 + 0.3 \\times 0.3 + 5 \\times 0.3}{1.6 \\times 1.6 + 0.6 \\times 0.6 - 1.2 \\times 1.6}$",
    "options": [
        {"label": "A", "text": "7.64"},
        {"label": "B", "text": "8.64"},
        {"label": "C", "text": "2.8"},
        {"label": "D", "text": "7.84"}
    ],
    "correctOption": "D",
    "solution": "In the numerator, $5 \\times 0.3 = 2 \\times 2.5 \\times 0.3$, so it is:\n$$(2.5)^2 + (0.3)^2 + 2(2.5)(0.3) = (2.5 + 0.3)^2 = (2.8)^2 = 7.84$$\nIn the denominator, $1.2 \\times 1.6 = 2 \\times 0.6 \\times 1.6$, so it is:\n$$(1.6)^2 + (0.6)^2 - 2(1.6)(0.6) = (1.6 - 0.6)^2 = (1.0)^2 = 1$$\nTherefore, the value of the expression is:\n$$\\frac{7.84}{1} = 7.84$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 194,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 05/12/2022 (Shift-02)",
    "questionText": "Simplify the following:\n$$25^3 - 75^3 + 50^3$$",
    "options": [
        {"label": "A", "text": "-281250"},
        {"label": "B", "text": "281350"},
        {"label": "C", "text": "271250"},
        {"label": "D", "text": "-281450"}
    ],
    "correctOption": "A",
    "solution": "Write the expression as:\n$$25^3 + (-75)^3 + 50^3$$\nLet $a = 25$, $b = -75$, and $c = 50$.\nNotice that $a + b + c = 25 - 75 + 50 = 0$.\nIf $a + b + c = 0$, then $a^3 + b^3 + c^3 = 3abc$.\nThus:\n$$25^3 + (-75)^3 + 50^3 = 3(25)(-75)(50) = 3 \\times 25 \\times (-3750) = 75 \\times (-3750) = -281250$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 195,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 04/10/2023 (Shift-02)",
    "questionText": "Simplify the given expression $(1 + x)^3 + (1 - x)^3 + (-2)^3$",
    "options": [
        {"label": "A", "text": "3(1-x^2)"},
        {"label": "B", "text": "6(1-x^2)"},
        {"label": "C", "text": "-6(1-x^2)"},
        {"label": "D", "text": "-3(1-x^2)"}
    ],
    "correctOption": "C",
    "solution": "Let $a = 1 + x$, $b = 1 - x$, and $c = -2$.\nCheck the sum of the terms:\n$$a + b + c = (1 + x) + (1 - x) + (-2) = 2 - 2 = 0$$\nWhen $a + b + c = 0$, the algebraic identity gives $a^3 + b^3 + c^3 = 3abc$.\nTherefore:\n$$(1 + x)^3 + (1 - x)^3 + (-2)^3 = 3(1 + x)(1 - x)(-2) = -6(1 - x^2)$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 196,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CHSL 14/08/2023 (Shift-02)",
    "questionText": "Simplify: $\\frac{(0.83)^3 - (0.1)^3}{(0.83)^2 + 0.083 + 0.01} = ?$",
    "options": [
        {"label": "A", "text": "0.98"},
        {"label": "B", "text": "0.27"},
        {"label": "C", "text": "0.93"},
        {"label": "D", "text": "0.73"}
    ],
    "correctOption": "D",
    "solution": "Let $a = 0.83$ and $b = 0.1$.\nNotice that $ab = 0.83 \\times 0.1 = 0.083$ and $b^2 = (0.1)^2 = 0.01$.\nThe given expression is:\n$$\\frac{a^3 - b^3}{a^2 + ab + b^2}$$\nUsing $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$:\n$$\\frac{(a - b)(a^2 + ab + b^2)}{a^2 + ab + b^2} = a - b$$\nSubstituting $a$ and $b$:\n$$a - b = 0.83 - 0.1 = 0.73$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 197,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 09/09/2024 (Shift-01)",
    "questionText": "Simplify $\\frac{(8.3)^3 + (9.2)^3 + (6.1)^3 - 3 \\times 8.3 \\times 9.2 \\times 6.1}{(8.3)^2 + (9.2)^2 + (6.1)^2 - 8.3 \\times 9.2 - 9.2 \\times 6.1 - 6.1 \\times 8.3}$",
    "options": [
        {"label": "A", "text": "30.2"},
        {"label": "B", "text": "23.6"},
        {"label": "C", "text": "28.7"},
        {"label": "D", "text": "25.5"}
    ],
    "correctOption": "B",
    "solution": "Let $a = 8.3$, $b = 9.2$, and $c = 6.1$.\nThe expression is of the form:\n$$\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca}$$\nUsing the standard algebraic identity $a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca)$, we obtain:\n$$= a + b + c$$\nSubstituting the values:\n$$8.3 + 9.2 + 6.1 = 23.6$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 198,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 11/09/2024 (Shift-02)",
    "questionText": "Simplify $\\frac{(4.2)^3 - (1.2)^3}{(4.2)^2 + 5.04 + (1.2)^2}$",
    "options": [
        {"label": "A", "text": "2"},
        {"label": "B", "text": "3"},
        {"label": "C", "text": "1"},
        {"label": "D", "text": "5"}
    ],
    "correctOption": "B",
    "solution": "Notice that $4.2 \\times 1.2 = 5.04$.\nLet $a = 4.2$ and $b = 1.2$.\nThe expression is:\n$$\\frac{a^3 - b^3}{a^2 + ab + b^2} = a - b$$\nSubstituting $a = 4.2$ and $b = 1.2$:\n$$4.2 - 1.2 = 3$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 199,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 18/09/2024 (Shift-01)",
    "questionText": "Simplify. $\\frac{(7.3)^3 - (4.7)^3}{(7.3)^2 + 7.3 \\times 4.7 + (4.7)^2}$",
    "options": [
        {"label": "A", "text": "12"},
        {"label": "B", "text": "3.2"},
        {"label": "C", "text": "2.6"},
        {"label": "D", "text": "11"}
    ],
    "correctOption": "C",
    "solution": "Let $a = 7.3$ and $b = 4.7$.\nThe given expression is:\n$$\\frac{a^3 - b^3}{a^2 + ab + b^2} = a - b$$\nSubstituting $a = 7.3$ and $b = 4.7$:\n$$7.3 - 4.7 = 2.6$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 200,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 23/09/2024 (Shift-01)",
    "questionText": "Simplify $\\frac{(232)^3 + (140)^3 + (353)^3 - 3 \\times 232 \\times 140 \\times 353}{(232)^2 + (140)^2 + (353)^2 - 232 \\times 140 - 140 \\times 353 - 353 \\times 232}$",
    "options": [
        {"label": "A", "text": "261"},
        {"label": "B", "text": "725"},
        {"label": "C", "text": "445"},
        {"label": "D", "text": "596"}
    ],
    "correctOption": "B",
    "solution": "Let $a = 232$, $b = 140$, and $c = 353$.\nThe expression is of the form:\n$$\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca} = a + b + c$$\nSubstituting the values:\n$$a + b + c = 232 + 140 + 353 = 725$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 201,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CGL 24/09/2024 (Shift-01)",
    "questionText": "Find the value of: $\\frac{(453 \\times 453 \\times 453 - 383 \\times 383 \\times 383)}{(453 \\times 383 + 383 \\times 383 + 453 \\times 453)}$",
    "options": [
        {"label": "A", "text": "60"},
        {"label": "B", "text": "50"},
        {"label": "C", "text": "80"},
        {"label": "D", "text": "70"}
    ],
    "correctOption": "D",
    "solution": "Let $a = 453$ and $b = 383$.\nThe numerator is $a^3 - b^3 = (a - b)(a^2 + ab + b^2)$.\nThe denominator is $ab + b^2 + a^2 = a^2 + ab + b^2$.\nTherefore:\n$$\\frac{a^3 - b^3}{a^2 + ab + b^2} = a - b$$\nSubstituting $a = 453$ and $b = 383$:\n$$453 - 383 = 70$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 202,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 29/06/2024 (Shift-02)",
    "questionText": "The value of $\\frac{(275 \\times 275 \\times 275 + 725 \\times 725 \\times 725)}{(275 \\times 275 + 725 \\times 725 - 725 \\times 275)} \\times \\frac{(275 \\times 275 \\times 275 - 725 \\times 725 \\times 725)}{(275 \\times 275 + 725 \\times 725 + 725 \\times 275)}$ is:",
    "options": [
        {"label": "A", "text": "-450000"},
        {"label": "B", "text": "45000"},
        {"label": "C", "text": "450000"},
        {"label": "D", "text": "-45000"}
    ],
    "correctOption": "A",
    "solution": "Let $a = 275$ and $b = 725$.\nThe first term is:\n$$\\frac{a^3 + b^3}{a^2 + b^2 - ab} = a + b = 275 + 725 = 1000$$\nThe second term is:\n$$\\frac{a^3 - b^3}{a^2 + b^2 + ab} = a - b = 275 - 725 = -450$$\nMultiplying the two terms:\n$$1000 \\times (-450) = -450000$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 203,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 21/06/2024 (Shift-03)",
    "questionText": "Simplify the following expression:\n$$\\frac{(8.25)^3 - 3 \\times (8.25)^2 \\times 0.25 + 24.75 \\times (0.25)^2 - (0.25)^3}{4 \\times 4 \\times 4}$$",
    "options": [
        {"label": "A", "text": "8"},
        {"label": "B", "text": "6"},
        {"label": "C", "text": "4"},
        {"label": "D", "text": "2"}
    ],
    "correctOption": "A",
    "solution": "Notice that $24.75 = 3 \\times 8.25$.\nThus, the numerator is of the form $a^3 - 3a^2 b + 3ab^2 - b^3 = (a - b)^3$, where $a = 8.25$ and $b = 0.25$:\n$$\\text{Numerator} = (8.25 - 0.25)^3 = 8^3 = 512$$\nThe denominator is:\n$$4 \\times 4 \\times 4 = 64$$\nDividing numerator by denominator:\n$$\\frac{512}{64} = 8$$\nHence, the correct option is A."
})

questions.append({
    "questionNumber": 204,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 21/06/2024 (Shift-03)",
    "questionText": "Simplify the given expression:\n$$\\frac{(2.3)^3 + (15.9)^3 + (3.7)^3 - 3 \\times 2.3 \\times 15.9 \\times 3.7}{(2.3)^2 + (15.9)^2 + (3.7)^2 - 2.3 \\times 15.9 - 15.9 \\times 3.7 - 3.7 \\times 2.3}$$",
    "options": [
        {"label": "A", "text": "17.6"},
        {"label": "B", "text": "14.5"},
        {"label": "C", "text": "20.9"},
        {"label": "D", "text": "21.9"}
    ],
    "correctOption": "D",
    "solution": "Using the algebraic identity $\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca} = a + b + c$:\nHere $a = 2.3$, $b = 15.9$, and $c = 3.7$.\n$$a + b + c = 2.3 + 15.9 + 3.7 = 21.9$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 205,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 24/06/2024 (Shift-03)",
    "questionText": "Simplify the given expression:\n$$\\frac{12.43 \\times 12.43 \\times 12.43 + 19.57 \\times 19.57 \\times 19.57}{12.43 \\times 12.43 - 12.43 \\times 19.57 + 19.57 \\times 19.57}$$",
    "options": [
        {"label": "A", "text": "34"},
        {"label": "B", "text": "30"},
        {"label": "C", "text": "32"},
        {"label": "D", "text": "36"}
    ],
    "correctOption": "C",
    "solution": "Let $a = 12.43$ and $b = 19.57$.\nThe expression is:\n$$\\frac{a^3 + b^3}{a^2 - ab + b^2} = a + b$$\nSubstituting $a = 12.43$ and $b = 19.57$:\n$$12.43 + 19.57 = 32$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 206,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 25/06/2024 (Shift-03)",
    "questionText": "Simplify the expression: $15 \\times 15 \\times 15 + 3 \\times 15 \\times 12 \\times 12 - 3 \\times 15 \\times 15 \\times 12 - 12 \\times 12 \\times 12$",
    "options": [
        {"label": "A", "text": "36"},
        {"label": "B", "text": "9"},
        {"label": "C", "text": "18"},
        {"label": "D", "text": "27"}
    ],
    "correctOption": "D",
    "solution": "Let $a = 15$ and $b = 12$.\nThe given expression is:\n$$a^3 + 3ab^2 - 3a^2b - b^3 = a^3 - 3a^2b + 3ab^2 - b^3 = (a - b)^3$$\nSubstituting $a = 15$ and $b = 12$:\n$$(15 - 12)^3 = 3^3 = 27$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 207,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 21/06/2024 (Shift-02)",
    "questionText": "Simplify the following:\n$$(x - 3y)^3 + 27(y^3 - xy^2)$$",
    "options": [
        {"label": "A", "text": "x^3 - 3x^2y"},
        {"label": "B", "text": "x^3 - 9x^2y"},
        {"label": "C", "text": "x^3 - 27y^3 - 9x^2y"},
        {"label": "D", "text": "x^3 - 27y^3 - 9x^2y + 27xy^2 + 27y^3 - 27xy^2"}
    ],
    "correctOption": "B",
    "solution": "Expand $(x - 3y)^3$ using $(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$:\n$$(x - 3y)^3 = x^3 - 3(x^2)(3y) + 3(x)(3y)^2 - (3y)^3 = x^3 - 9x^2y + 27xy^2 - 27y^3$$\nNow expand the second term:\n$$27(y^3 - xy^2) = 27y^3 - 27xy^2$$\nAdding the two expressions:\n$$(x^3 - 9x^2y + 27xy^2 - 27y^3) + (27y^3 - 27xy^2) = x^3 - 9x^2y$$\nHence, the correct option is B."
})

questions.append({
    "questionNumber": 208,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 25/06/2024 (Shift-02)",
    "questionText": "Simplify the given expression.\n$$\\frac{[1.5 \\times 1.5 \\times 1.5 + 2.7 \\times 2.7 \\times 2.7 + 4.8 \\times 4.8 \\times 4.8 - 3 \\times 1.5 \\times 2.7 \\times 4.8]}{[1.5 \\times 1.5 + 2.7 \\times 2.7 + 4.8 \\times 4.8 - 1.5 \\times 2.7 - 2.7 \\times 4.8 - 4.8 \\times 1.5]}$$",
    "options": [
        {"label": "A", "text": "10"},
        {"label": "B", "text": "12"},
        {"label": "C", "text": "14"},
        {"label": "D", "text": "9"}
    ],
    "correctOption": "D",
    "solution": "Let $a = 1.5$, $b = 2.7$, and $c = 4.8$.\nThe expression is of the form:\n$$\\frac{a^3 + b^3 + c^3 - 3abc}{a^2 + b^2 + c^2 - ab - bc - ca} = a + b + c$$\nSubstituting the values:\n$$1.5 + 2.7 + 4.8 = 9.0$$\nHence, the correct option is D."
})

questions.append({
    "questionNumber": 209,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC Phase-XII 26/06/2024 (Shift-02)",
    "questionText": "Simplify the expression:\n$$(0.2)^3 + (0.3)^3 + (0.5)^3 + 3 \\times 0.5 \\times 0.7 \\times 0.8$$",
    "options": [
        {"label": "A", "text": "0.005"},
        {"label": "B", "text": "0.001"},
        {"label": "C", "text": "1.000"},
        {"label": "D", "text": "1.525"}
    ],
    "correctOption": "C",
    "solution": "Let $a = 0.2$, $b = 0.3$, and $c = 0.5$.\nNotice that $a + b = 0.2 + 0.3 = 0.5$, $b + c = 0.3 + 0.5 = 0.8$, and $c + a = 0.5 + 0.2 = 0.7$.\nThus, the expression is:\n$$a^3 + b^3 + c^3 + 3(a + b)(b + c)(c + a)$$\nBy the algebraic identity, $(a + b + c)^3 = a^3 + b^3 + c^3 + 3(a + b)(b + c)(c + a)$.\nTherefore:\n$$(a + b + c)^3 = (0.2 + 0.3 + 0.5)^3 = (1.0)^3 = 1.000$$\nHence, the correct option is C."
})

questions.append({
    "questionNumber": 210,
    "typeHeader": "TYPE - II: BASED ON ALGEBRAIC FORMULAE",
    "examShift": "SSC CPO 04/10/2023 (Shift-02)",
    "questionText": "Simplify the given expression:\n$$\\frac{(3.254 \\times 3.254 \\times 3.254) - (0.746 \\times 0.746 \\times 0.746)}{(3.254 \\times 3.254) + (0.746 \\times 0.746) + (3.254 \\times 0.746)}$$",
    "options": [
        {"label": "A", "text": "2.508"},
        {"label": "B", "text": "4.508"},
        {"label": "C", "text": "2.146"},
        {"label": "D", "text": "3.156"}
    ],
    "correctOption": "A",
    "solution": "Let $a = 3.254$ and $b = 0.746$.\nThe expression is:\n$$\\frac{a^3 - b^3}{a^2 + b^2 + ab} = a - b$$\nSubstituting $a = 3.254$ and $b = 0.746$:\n$$3.254 - 0.746 = 2.508$$\nHence, the correct option is A."
})

with open('scripts/simplification_extracted/part3_q191_210.json', 'w') as f:
    json.dump(questions, f, indent=2)
print("Saved Q191-Q210")
